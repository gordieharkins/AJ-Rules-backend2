var path = require('path')
var cron = require('node-cron')

var SmsService = require(path.resolve(__dirname, './sms'));
var smsService = new SmsService();

var AlertSettings = require(path.resolve(__dirname, './settings'));
var alertSettings = new AlertSettings();

module.exports = BLL;

function BLL() {}

BLL.prototype.startCronJob = function(req,res) {
    console.log('coming')
    var array = [{body:'1234',from:'+14242173909',to:'+923152579777'},
    {body:'1234',from:'+14242173909',to:'+923152579777'},]
    
    var task = cron.schedule('* * * * *', function(){

        executeJob(array, res)
        
    });
    
    task.start()  
}

function executeJob(data,res) {
       var results  = []
       
        var data = smsService.sendSms(data,res)
        console.log('returned', data)
     
    
  
}
