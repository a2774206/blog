var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/config')
const usersSchema = require('./db/users.js')

var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var classificationRouter = require('./routes/classification');
var articleRouter = require('./routes/article')
var app = express();
mongoose.connect(config.database,{useNewUrlParser:true,useUnifiedTopology:true});
let db = mongoose.connection; // 创建一个连接放在db中

db.once('open', function() {
    console.log('MongoDB连接成功..');
	usersSchema.find({},function(err,users){
		if( !err ){
			if(users.length < 1){
				// 初次没有后台帐号创建初始
				usersSchema.create({
					username:config.accounts.username,
					password:config.accounts.password
				}, function(err, docs){
					if ( err ) return;
					console.log('管理员初始帐号创建成功')
				});
			}
		}
	})
})
db.on('error', function(err) {
    console.log(err);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/classification', classificationRouter);
app.use('/article', articleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(200));
});

// error handler
app.use(function(err, req, res, next) {
	
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
	
  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
