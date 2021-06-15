import express from 'express';
import { Application } from 'express';
import * as bodyParser from 'body-parser';
import { MainRouter } from './routes';
import { loadErrorHandlers } from './utilities/error-handling';
import helmet from "helmet";
import compression from "compression";
import './database'; // initialize database
import './utilities/passport';
import cors from 'cors';


const app: Application = express();

app.use(cors())
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());

app.use('/api', MainRouter);

loadErrorHandlers(app);


export default app;
