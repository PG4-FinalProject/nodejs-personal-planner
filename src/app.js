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
    origin: process.env.FRONT_URL,
    credentials: true,
    optionSuccessStatus: 200,
  }),
);
app.use(express.json());

const userRouter = require('./routes/users');
const planRouter = require('./routes/plans');
const categoryRouter = require('./routes/categories');
const notificationRouter = require('./routes/notifications');

app.use('/users', userRouter);
app.use('/plans', planRouter);
app.use('/categories', categoryRouter);
app.use('/notifications', notificationRouter);
