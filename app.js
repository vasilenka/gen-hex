const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const formData = require('express-form-data')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json());
app.use(formData.parse());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/process', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
