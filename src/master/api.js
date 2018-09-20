const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('../config');
const queue = require('./queue');
const db = require('./db');
const apiHelper = require('./api-helper');

const webServer = () => {
  const { port } = config;
  const app = express();

  app.disable('x-powered-by');
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,x-access-token,mode');
    next();
  });

  app.get('/healthcheck', (req, res) => res.status(200).json({ status: 'OK' }));

  app.get('/api/reviews', (req, res) => {
    return db.getReviews()
      .then(result => res.status(result.success ? 200 : 500).json(result))
      .catch((error) => {
        console.log('CRITICAL: api db.getReviews()', error);
        return res.status(500).json({ success: false, message: 'SERVER_ERROR' });
      });
  });

  app.post('/api/reviews', (req, res) => {
    const { body } = req;
    const {
      invalid,
      message,
    } = apiHelper.isPostReviewPayloadInvalid(body);

    if (invalid) {
      return res.status(400).json({ success: false, message });
    }

    const { productid, name, email, review } = body;

    return db.saveReview({ productid, name, email, review })
      .then(({ success, data, message }) => {
        if (success) {
          res.json({ data, success });
          const { productreviewid } = data;
          return queue.reviewStack.items
            .push(JSON.stringify({ productreviewid, review, name, email }));
        } else {
          return res
            .status(message === 'SERVER_ERROR' ? 500 : 400)
            .json({ message, success: false });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ success: false, message: 'SERVER_ERROR' });
      });
  });
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.listen(port, () => console.log(`INFO: Webserver listening on ${port}!`));
};

module.exports.run = webServer;
