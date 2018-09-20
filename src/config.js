const config = {};

const dbHost = process.env.NODE_ENV === 'production!'
  ? 'postgres'
  : '0.0.0.0';

config.db = {
  user: 'postgres',
  host: dbHost,
  database: 'Adventureworks',
  password: 'postgres',
};

const redisHost = process.env.NODE_ENV === 'production!'
  ? 'redis'
  : '0.0.0.0';

config.redis = {
  host: redisHost,
};

config.msWait = {
  reviewPoll: 333,
  notificationPoll: 333,
  workersHotReload: 1000,
  retryDbConnect: 1000,
};

config.phrases = [
  'fee',
  'nee',
  'cruul',
  'leent',
];

config.port = 8888;

config.channel = {
  reviewRequest: 'reviewRequest',
  reviewResponse: 'reviewResponse',
  notificationRequest: 'notificationRequest',
  notificationResponse: 'notificationResponse',
};

module.exports = config;
