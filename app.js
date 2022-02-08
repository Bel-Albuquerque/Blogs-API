const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const userRouter = require('./routers/userRouter');
const loginRouter = require('./routers/loginRouter');
const categoriesRouter = require('./routers/categoriesRouter');
const postRouters = require('./routers/postRouters');

app.use(bodyParser.json());

app.use('/', userRouter);
app.use('/', loginRouter);
app.use('/', categoriesRouter);
app.use('/', postRouters);

module.exports = app; 