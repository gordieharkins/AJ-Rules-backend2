var path = require('path');
var cron = require('node-cron');
var async = require('async');

var config = require(path.resolve(__dirname,'./config'));

var SmsService = require(path.resolve(__dirname, './sms'));
var smsService = new SmsService();

var AlertSettings = require(path.resolve(__dirname, './settings'));
var alertSettings = new AlertSettings();

module.exports = BLL;

function BLL() {}

BLL.prototype.startCronJob = function(req,res) {
    console.log('coming')
    var array = [{body:'1234',from:'+14242173909',to:'+923335375372'},
    {body:'1234',from:'+14242173909',to:'+923335375272'},]

    var task = cron.schedule('*/'+config.cron_time+' * * * *', function(){
        
        executeJob(array, res)
        
    });
    
    task.start()  
}

function executeJob(data,res) {
  
     var results = []
     console.log(data.length)
     async.forEachOf(data, function (value, i, cb) {
        console.log('started',i)
            smsService.sendSms(value, function(error, result) {
                console.log('sending',i,value.to)
                results.push(result)
                cb()
            })
     }, function (err) {
        if (err) console.error(err.message);
         console.log('all done')
        console.log(results);
    });
       
}
