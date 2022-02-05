const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const userRouter = require('./routers/userRouter');
const loginRouter = require('./routers/loginRouter');

app.use(bodyParser.json());

app.use('/', userRouter);
app.use('/', loginRouter);

module.exports = app; 