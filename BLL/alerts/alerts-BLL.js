var path = require('path')
var cron = require('node-cron')
var ErrorLogDALFile = require(path.resolve(__dirname, '../../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('../errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, '../util/response'));
var loginUserName = 'Ali'; // Infutre will get logged in user name
var ALERTDAL = require(path.resolve(__dirname, './alerts-DAL'));
var jurisdictionTimeline = require(path.resolve(__dirname, '../util/jdRules'));

// var IEDAL = new IEDAL();
// var RRDAL = new RRDAL();
var DAL = new ALERTDAL();


module.exports = BLL;

function BLL() {

}

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

// ---------------------------------------------
// saveSettings
// ---------------------------------------------
BLL.prototype.saveSettings = function(req, res) {
    var userId = req.user[0].userId;
    var data = req.body;
    var dbObject = {};
    

    dbObject.sms = [data.sms.flag, data.sms.details, data.sms.verified];
    dbObject.email = [data.email.flag, data.email.details, data.email.verified];
    dbObject.timezone = data.timezone;

    for(var i = 0; i < data.blackouts.length; i++){
        var days = data.blackouts[i].days.join("||");
        for(var j = 0; j < data.blackouts[i].intervals.length; j++){
            var startTime = data.blackouts[i].intervals[j].startTime;
            var endTime = data.blackouts[i].intervals[j].endTime;
            dbObject[i+""+j] = [days, startTime, endTime];
        }
    }

    console.log(dbObject);
    DAL.saveSettings(dbObject, userId, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getSettings
// ---------------------------------------------
BLL.prototype.getSettings = function(req, res) {
    var userId = req.user[0].userId;

    // console.log(dbObject);
    DAL.getSettings(userId, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            var data =  result[0].settings;
            var finalResult = {
                sms: {
                    flag: data.sms[0],
                    details: data.sms[1],
                    verified: data.sms[2]
                },
                email: {
                    flag: data.email[0],
                    details: data.email[1],
                    verified: data.email[2]
                },
                timezone: data.timezone,
                blackouts: []
            };

            var blackouts = [];
            var daysList = [];

            for(var element in data){
                if(element == "sms" || element == "email" || element == "timezone"){
                    continue;
                } else {
                    var daysIndex = daysList.indexOf[data[element][0]];
                    var interval = {
                        startTime: data[element][1],
                        endTime: data[element][2]
                    };

                    if(daysIndex > -1){
                        blackouts[daysIndex].intervals.push(interval);
                    } else {
                        var blackout = {
                            days: data[element][0].split("||"),
                            intervals: [interval]
                        }

                        blackouts.push(blackout);
                        daysList.push(data[element][0]);
                    }
                }
            }

            finalResult.blackouts = blackouts;
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
        }
    });
}
// ---------------------END---------------------