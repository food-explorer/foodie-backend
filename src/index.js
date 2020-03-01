import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './loaders/mongooseLoader';
import routes from './routes/index';
import config from './config';
import logger from './loaders/logger';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(routes);

connectDB()
  .then(() => {
    app.listen(config.PORT, () => {
      logger.log('info', `Server started on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    logger.log('error', error);
  });
