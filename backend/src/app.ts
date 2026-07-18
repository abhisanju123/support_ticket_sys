import compression from 'compression';
import cors from 'cors';
import express, { Router } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.js';
import { ApiResponse } from './helpers/api-response.helper.js';
import { asyncHandler, errorHandler, notFoundHandler } from './middlewares/index.js';
import { registerRoutes } from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRouter = Router();

apiRouter.get(
  '/health',
  asyncHandler(async (_req, res) => {
    ApiResponse.success(res, { timestamp: new Date().toISOString() }, 'Service is healthy');
  }),
);

registerRoutes(apiRouter);

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
