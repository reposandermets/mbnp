const DI = require('../dependency-injection');
const db = require('./db');
const config = require('../config');

const reviewStack = {
  inProgress: null,
  items: [],
};

const notificationStack = {
  inProgress: null,
  items: [],
};

const queue = () => {
  const redis = DI.newRedis();
  const pub = DI.newRedis();

  const reviewQueue = () => {
    if (reviewStack.items.length && !reviewStack.inProgress) {
      const review = reviewStack.items.shift();

      pub.publish(config.channel.reviewRequest, review);

      reviewStack.inProgress = review;
    }

    DI.setTimeout(reviewQueue, config.msWait.reviewPoll);
  };

  const notificationQueue = () => {
    if (notificationStack.items.length && !notificationStack.inProgress) {
      const notification = notificationStack.items.shift();

      pub.publish(config.channel.notificationRequest, notification);

      notificationStack.inProgress = notification;
    }

    DI.setTimeout(notificationQueue, config.msWait.notificationPoll);
  };

  redis.subscribe(
    config.channel.reviewResponse,
    config.channel.notificationResponse,
  );

  redis.on('message', (channel, message) => {
    console.log('INFO: queue redis on message', channel, message);

    if (channel === config.channel.reviewResponse) {
      reviewStack.inProgress = null;
      notificationStack.items.push(message);

      const { productreviewid, prohibitedwords } = JSON.parse(message);

      if (prohibitedwords) {
        return db
          .updateReviewBadWords(productreviewid)
          .catch(error => console.log(
            'ERROR: queue redis on message updateReviewBadWords',
            error,
          ));
      }
    }

    if (channel === config.channel.notificationResponse) {
      notificationStack.inProgress = null;
    }
  });

  reviewQueue();
  notificationQueue();
};

module.exports.reviewStack = reviewStack;
module.exports.notificationStack = notificationStack;
module.exports.run = queue;
