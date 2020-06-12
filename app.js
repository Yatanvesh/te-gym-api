const createError = require('http-errors');
const express = require('express');
var cors = require('cors');
// const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');
// const upload = multer();

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const trainerRouter = require('./routes/trainers');

const middleware = require('./middleware');
const auth = require('./auth');

const app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(upload.array('file'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.post('/login', auth.authenticate, auth.login);
app.use('/trainers', auth.ensureUser, trainerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(middleware.handleError);

module.exports = app;
