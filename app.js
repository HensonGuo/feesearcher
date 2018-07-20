var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

try{
  var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users');
  var followsRouter = require('./routes/follows');
  var crawlRouter = require('./routes/crawl');
  var searchRouter = require('./routes/search');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'video_player')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', indexRouter.test);
app.use('/follows', followsRouter.handle);
app.use('/crawl', crawlRouter);
app.post('/search', searchRouter.search);
app.post('/delstar', indexRouter.delstar)
}
catch(err)
{
  console.info(err)
}

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

try{
	var dataCenter = require('./public/javascripts/data_center')
	dataCenter.loadData()
}
catch (err)
{
	console.info(err)
}