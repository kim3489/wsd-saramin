import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongodb from './config/mongodb.js';
import userRoutes from './routes/authRouter.js';
import jobRoutes from './routes/jobRouter.js';
import {globalErrorHandler} from './middlewares/errorMiddleware.js';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

dotenv.config();
mongodb();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(globalErrorHandler);
app.use('/auth', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.listen(PORT, () => {
  console.log(`서버 실행 중`);
});