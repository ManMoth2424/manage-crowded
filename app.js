var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); // ★★★ 1. express-session を require

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ★★★ 2. セッション設定 (ルーターより前に追加) ★★★
app.use(session({
  // ↓ 必ず推測されにくい文字列に変更してください
  secret: 'your_very_secret_key_bunkasai', 
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // HTTPSを使う場合は true に
    maxAge: 60 * 60 * 1000 // セッションの有効期間 (例: 1時間)
  }
}));
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

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