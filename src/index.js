const cluster = require('cluster');
const master = require('./master');
const worker = require('./worker');

function main() {
  if (cluster.isMaster) {
    master.run();
  } else {
    if (process.env.ROLE === 'review') {
      worker.review();
    }
    if (process.env.ROLE === 'notification') {
      worker.notification();
    }
  }
}

main();
