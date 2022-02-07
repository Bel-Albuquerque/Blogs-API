const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const userRouter = require('./routers/userRouter');
const loginRouter = require('./routers/loginRouter');
const categoriesRouter = require('./routers/categoriesRouter');

app.use(bodyParser.json());

app.use('/', userRouter);
app.use('/', loginRouter);
app.use('/', categoriesRouter);

module.exports = app; 