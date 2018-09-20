const cluster = require('cluster');
const DI = require('../dependency-injection');
const config = require('../config');
const db = require('./db');
const api = require('./api');
const queue = require('./queue');

const master = () => db.connectPool()
  .then(() => {
    const workers = {};

    const bootReviewWorker = () => {
      workers.review = cluster.fork({ ROLE: 'review' });

      workers.review.name = 'review';
      workers.review.on('online', () => {
        console.log('INFO: REVIEW WORKER ONLINE');
      });
      workers.review.on('exit', () => {
        console.log('ERROR: REVIEW WORKER DIED');
        delete workers.review;
      });
    };

    const bootNotificationWorker = () => {
      workers.notification = cluster
        .fork({ ROLE: 'notification' });

      workers.notification.name = 'notification';
      workers.notification.on('online', () => {
        console.log('INFO: NOTFICATION WORKER ONLINE');
      });
      workers.notification.on('exit', () => {
        console.log('ERROR: NOTFICATION WORKER DIED');
        delete workers.notification;
      });
    };

    const workersBootAndHotReload = () => {
      if (!workers.review) {
        bootReviewWorker();
      }
      if (!workers.notification) {
        bootNotificationWorker();
      }
      DI.setTimeout(
        workersBootAndHotReload,
        config.msWait.workersHotReload,
      );
    };

    workersBootAndHotReload();
    api.run();
    queue.run();
  })
  .catch((error) => {
    console.log('CRITICAL: master error connecting database.', error);
    return db.closeConnection()
      .then(() => {
        console.log('CRITICAL: master I Retry DB connect', DI.newDate().getTime());
        return DI.setTimeout(master, config.msWait.retryDbConnect);
      })
      .catch((e) => {
        console.log('CRITICAL: master II Retry DB connect', DI.newDate().getTime(), e);
        return DI.setTimeout(master, config.msWait.retryDbConnect);
      });
  });

module.exports.run = master;
