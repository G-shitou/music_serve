let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let ejs = require('ejs');
let bodyParser = require('body-parser');


let index = require('./routes/index'); 

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.__express)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * @author G-shitou
 * 设置/routes/index文件为总的路由控制文件
 * 在routes/index文件中再进行统一的路由分发，这样防止app.js中代码过于臃肿
 */

index(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
