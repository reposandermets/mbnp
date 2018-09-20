const Redis = require('ioredis');
const { Pool } = require('pg');
const config = require('./config');

module.exports.newRedis = () => new Redis(config.redis);

module.exports.newPool = () => new Pool(config.db);

module.exports.setTimeout = (f, t) => setTimeout(f, t);

module.exports.newDate = () => new Date();
