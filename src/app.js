const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
app.listen(process.env.PORT);

a = [
  1, //
  2,
  3,
];

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
  }),
);
app.use(express.json());

const userRouter = require('./routes/users');
const planRouter = require('./routes/plans');
const categoryRouter = require('./routes/categories');
const notificationRouter = require('./routes/notifications');
const statisticRouter = require('./routes/statistics');

app.use('/users', userRouter);
app.use('/plans', planRouter);
app.use('/categories', categoryRouter);
app.use('/notifications', notificationRouter);
app.use('/statistics', statisticRouter);
