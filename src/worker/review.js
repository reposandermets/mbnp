const config = require('../config');
const DI = require('../dependency-injection');

const validateReview = (phrases, review) => {
  const wrodsMap = review
    .split(' ')
    .reduce((acc, curr) => {
      const word = JSON.stringify(curr).replace(/[^a-z]/gi, '');
      acc[word.toLowerCase()] = true;
      return acc;
    }, {});

  const phrasesLength = phrases.length;
  for (let i = 0; i < phrasesLength; i++) {
    if (wrodsMap[phrases[i]]) {
      return true;
    }
  }
  return false;
};

module.exports = () => {
  const redis = DI.newRedis();
  const pub = DI.newRedis();

  redis.subscribe(config.channel.reviewRequest);

  redis.on('error', (e) => {
    console.log('ERROR worker review redis', e);
  });

  redis.on('message', (channel, message) => {
    if (channel === config.channel.reviewRequest) {
      const { phrases } = config;
      const {
        review,
        productreviewid,
        name,
        email,
      } = JSON.parse(message);

      pub.publish(
        config.channel.reviewResponse,
        JSON.stringify({
          review,
          productreviewid,
          name,
          email,
          prohibitedwords: validateReview(phrases, review),
        }),
      );
    }
  });
};
