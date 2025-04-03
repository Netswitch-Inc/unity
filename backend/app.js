var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

var fs = require('fs');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var bluebird = require('bluebird');
var mongoose = require('mongoose');
const cors = require("cors");

const maxLimitSize = "500mb"; // Or adjust as needed

var app = express();
app.use(cors());
app.use(bodyParser.json({ limit: maxLimitSize }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({ limit: maxLimitSize }));
app.use(express.urlencoded({ limit: maxLimitSize, extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/images', indexRouter);
app.use('/', apiRouter);
app.use('/api', apiRouter);
app.use('/api2', apiRouter);

require('./config');

// ** Database connection
mongoose.Promise = bluebird;
let url = 'mongodb://' + `${process.env.HOST}` + ':' + `${process.env.DB_PORT}` + '/' + `${process.env.DATABASE_NAME}`;
if (process.env?.APP_MODE === "production" && process.env?.DATABASE_PASSWORD) {
  url = 'mongodb://' + `${process.env.DATABASE_USER}` + ':' + `${process.env.DATABASE_PASSWORD}` + '@' + `${process.env.HOST}` + ':' + `${process.env.DB_PORT}` + '/' + `${process.env.DATABASE_NAME}` + `?authSource=${process.env.DATABASE_AUTH}`;
}

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(`Successfully Connected to theMongodb Database...${process.env.DATABASE_NAME}`)
}).catch((e) => {
  console.log(e)
  console.log(e.message)
  console.log(`Error Connecting to the Mongodb Database...`)
})

// catch 404 and forward to error handler 
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
