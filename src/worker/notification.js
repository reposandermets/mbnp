const DI = require('../dependency-injection');
const config = require('../config');

module.exports = () => {
  const redis = DI.newRedis();
  const pub = DI.newRedis();

  redis.subscribe(config.channel.notificationRequest);

  redis.on('error', (e) => {
    console.log('ERROR worker notification redis', e);
  });

  redis.on('message', (channel, message) => {
    console.log('INFO: notification worker redis on message', channel, message);
    if (channel === config.channel.notificationRequest) {
      const {
        name,
        email,
        prohibitedwords,
      } = JSON.parse(message);

      console.log('######## SENDING OUT EMAIL ########');
      console.log({
        to: email,
        subject: prohibitedwords
          ? 'Review feedback.'
          : 'Review received!',
        body: prohibitedwords
          ? `Hello ${name}, We have processed your review, unfortunately inappropriate content was found.`
          : `Dear ${name}, Thank you for your feedback! We have published the review.`,
      });
      console.log('###################################');

      pub.publish(
        config.channel.notificationResponse,
        JSON.stringify({ message }),
      );
    }
  });
};
