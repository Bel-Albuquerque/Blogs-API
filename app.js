const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const userRouter = require('./routers/userRouter');

app.use(bodyParser.json());

// app.post('/login');
// app.post('/signup');
app.use('/', userRouter);

module.exports = app; 