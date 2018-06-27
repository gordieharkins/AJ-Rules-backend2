var express = require('express');
var cfenv = require('cfenv');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var path = require('path');
var passport = require('passport');
// var exec = require('child_process').exec;

// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var cors = require('cors');
var path = require('path');
var connection = require(path.resolve(__dirname, './DAL/sqlConnection'));

var routes = require('./routes/index');
var users = require('./routes/users');
var properties = require('./routes/properties');
var rentRolls = require('./routes/rentRolls');
var incomeExpenses = require('./routes/incomeExpenses');
var otherFiles = require('./routes/otherFiles');
var taxBills = require('./routes/taxBills');
var valuation = require('./routes/valuation');
var aJRules = require('./routes/aJRules');
var taskManager = require('./routes/taskManager');
var unlinkedFiles = require('./routes/unlinkedFiles');
var salesComps = require('./routes/salesComps');
var propertyImages = require('./routes/propertyImages');
var surveys = require('./routes/surveys');
var contracts = require('./routes/contracts');
var newsFeed = require('./routes/newsFeed');
var timeline = require('./routes/timeline');
var admin = require('./routes/admin');
var appeal = require('./routes/appeal');
var alerts = require('./BLL/alerts/alerts-routes');
var alertsCronJobFile = require('./BLL/alerts/alerts-BLL');
var appealCronJobFile = require('./BLL/appeal');


// var alertsCronJob = new alertsCronJobFile();
// var appealCronJob = new appealCronJobFile();

var zillow = require('./routes/zillow');
// var cors = require('cors');

var app = express();
//============================================passport-start===================================
app.use(passport.initialize());
//And now we can import our JWT passport strategy. Enter this below our mongoose connection:

// app.use(cors());
// Bring in defined Passport Strategy
require('./BLL/util/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));



// serve the files out of ./public as our main files
// app.use(express.static(__dirname + '/public'));

// app.use(express.static(path.join(__dirname, '/public/')));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/bower_components', express.static(__dirname + '/bower_components'));


// var cors = require('cors');
// app.use(cors());
// app.all('*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
// app.use('/appeal', appeal);
app.use('/aJRules', aJRules);
app.use('/appeal', passport.authenticate('jwt', { session: false }), appeal);
app.use('/admin', passport.authenticate('jwt', { session: false }), admin);
app.use('/rentRolls', passport.authenticate('jwt', { session: false }), rentRolls);
app.use('/otherFiles', passport.authenticate('jwt', { session: false }), otherFiles);
app.use('/taxBills', passport.authenticate('jwt', { session: false }), taxBills);
app.use('/valuation', passport.authenticate('jwt', { session: false }), valuation);
app.use('/aJRules', passport.authenticate('jwt', { session: false }),aJRules);
app.use('/taskManager', passport.authenticate('jwt', { session: false }), taskManager);
app.use('/unlinkedFiles', passport.authenticate('jwt', { session: false }), unlinkedFiles);
app.use('/zillow', passport.authenticate('jwt', { session: false }),zillow);
app.use('/salesComps', passport.authenticate('jwt', { session: false }),salesComps);
app.use('/propertyImages', passport.authenticate('jwt', { session: false }), propertyImages);
app.use('/surveys', passport.authenticate('jwt', { session: false }),surveys);
app.use('/contracts', passport.authenticate('jwt', { session: false }), contracts);
app.use('/newsFeed', passport.authenticate('jwt', { session: false }),newsFeed);
app.use('/timeline', passport.authenticate('jwt', { session: false }), timeline);
app.use('/properties', passport.authenticate('jwt', { session: false }), properties);
app.use('/incomeExpenses', passport.authenticate('jwt', { session: false }), incomeExpenses);
app.use('/alerts', passport.authenticate('jwt', { session: false }), alerts);
// app.use('/', routes);
// app.use('/users', users);
// app.use('/rentRolls', rentRolls);
// app.use('/otherFiles', otherFiles);
// app.use('/taxBills', taxBills);
// app.use('/valuation', valuation);
// app.use('/aJRules', aJRules);
// app.use('/taskManager', taskManager);
// app.use('/unlinkedFiles', unlinkedFiles);
// app.use('/zillow', zillow);
// app.use('/salesComps', salesComps);
// app.use('/propertyImages', propertyImages);
// app.use('/surveys', surveys);
// app.use('/contracts', contracts);
// app.use('/newsFeed', newsFeed);
// app.use('/timeline', timeline);
// // app.use('/properties', properties);
// app.use('/incomeExpenses', incomeExpenses);
// alertsCronJob.startCronJob();
// appealCronJob.startCronJob();
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

connection(function(err,status)
  {
    if(err){
      console.log("Error in SQL connection.")
    }
    else{
      console.log("Successful SQL connection.")
    }
});

// exec('unoconv', function(err, stdout, stderr){
//   if(err){
//     console.log("error1: ", err);
//     exec('sudo apt-get install unoconv', function(err2, stdout2, stderr2){
//       console.log("Error 2", err2);
//     });
//   }
// });


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host

var server = app.listen(4100, '0.0.0.0', function() {
 // app.listen(appEnv.port, '0.0.0.0', function() {
  console.log("Server starting on " + server.address().port);
});
// server.timeout = 100000;
//
module.exports = app;
