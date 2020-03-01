import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './loaders/mongooseLoader';
import routes from './routes/index';
import config from './config';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(routes);

connectDB()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log('server started at', config.PORT);
    });
  })
  .catch((error) => {
    console.log('Unable to start app', error);
  });
