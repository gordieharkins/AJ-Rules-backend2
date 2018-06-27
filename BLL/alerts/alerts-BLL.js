
var path = require('path')
var cron = require('node-cron')
var ErrorLogDALFile = require(path.resolve(__dirname, '../../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('../errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, '../util/response'));
var loginUserName = 'Ali'; // Infutre will get logged in user name
var ALERTDAL = require(path.resolve(__dirname, './alerts-DAL'));
var jurisdictionTimeline = require(path.resolve(__dirname, '../util/jdRules'));
var async = require('async');

var config = require(path.resolve(__dirname,'./config'));

var SmsService = require(path.resolve(__dirname, './sms'));
var smsService = new SmsService();


var EmailService = require(path.resolve(__dirname, './email_sender'))(config);

var AlertSettings = require(path.resolve(__dirname, './settings'));
var alertSettings = new AlertSettings();
var moment = require('moment');

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

BLL.prototype.startCronJob = function() {
    var task = cron.schedule('1 * * * * *', function(){
        
        DAL.getAlert(function(error, result) {
            if (error) {
                console.log(error);
                error.userName = loginUserName;
                ErrorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            } else {
                console.log("Here are the alerts: ", result);
                executeJob(result);
                // Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
            }
        });

        // executeJob(array, res)
        
    });
    
    task.start()  
}

function executeJob(data) {
  
     var results = []
     async.forEachOf(data, function (value, i, cb) {
        async.parallel([
            function(callback) {
                console.log('sending sms')

                if(value.alert.properties.sms != "null"){
                    // if(value.alert.properties.sms== "null"){
                        smsService.sendSms(value.alert.properties, function(error, result) {
                            if(error){
                                callback(error,null);
                            } else {
                                DAL.updateAlert(value.alert._id, function(error, result) {
                                    if (error) {
                                        console.log(error);
                                        callback(error,null);
                                        error.userName = loginUserName;
                                        ErrorLogDAL.addErrorLog(error);
                                    }
                                });
                                callback(null,result);
                             }
                        });
                    // }
                }

            },
            function(callback) {
                console.log('sending email')
                 if (value.alert.properties.email != "null"){
                var emailOption = {
                    text: `Hi,\nThis email message has been sent by the AOTC System to remind you that `+ value.alert.properties.message +
                            `.\nJurisdiction: ` +value.alert.properties.jurisdiction+ `\nSincerely,\nAOTC`,
                    from:"AOTC <aotc.invite@gmail.com>", 
                    subject:"AOTC Alert for " +(new Date().getDate()),
                    to: value.alert.properties.email
                };

                EmailService.send_email(emailOption, function(error, result) {
                    if(error){
                        callback(error,null);
                    } else {
                        DAL.updateAlert(value.alert._id, function(error, result) {
                            if (error) {
                                console.log(error);
                                error.userName = loginUserName;
                                ErrorLogDAL.addErrorLog(error);
                            }
                        });
                        
                        callback(null,result);
                    }
                });
            }
            }
        ],
        // optional callback
        function(err, results) {
            // the results array will equal ['one','two'] even though
            // the second function had a shorter timeout.
            if (err) {
                console.log(error);
            }
            console.log('done')
            results.push(results)
            cb()
        })
            
            
          
            
     }, function (err) {
        if (err) console.error(err.message);
    });
       
}

// BLL.prototype.addAlert = function(alert, userId, cb) {
BLL.prototype.addAlert = function(alert, userId) {
    // var userId = req.user[0].userId;
    DAL.getSettings(userId, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            // cb(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            if(result.length > 0){
                var settingsJSON = createSettingsJSON(result);
                var settings = {
                sms: settingsJSON.sms,
                email: settingsJSON.email,
                settings: getActiveTime(settingsJSON.blackouts)  
                };

                alertSettings.configureAlert(alert, settings, function(finalAlert){
                    DAL.addAlert(finalAlert, userId, function(error, result) {
                        if (error) {
                            console.log(error);
                            error.userName = loginUserName;
                            ErrorLogDAL.addErrorLog(error);
                            // Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                        }
                    });
                });
            }
        }
    });
}

// ---------------------------------------------
// saveSettings
// ---------------------------------------------
BLL.prototype.saveSettings = function(req, res) {
    var userId = req.user[0].userId;
    var data = req.body;
    var dbObject = {};
    if(data.sms.details == null){
        data.sms.details = "null";
    }

    if(data.email.details == null){
        data.email.details = "null";
    }

    dbObject.sms = [data.sms.flag, data.sms.details, data.sms.verified];
    dbObject.email = [data.email.flag, data.email.details, data.email.verified];
    dbObject.timezone = data.timezone;

    for(var i = 0; i < data.blackouts.length; i++){
        var days = data.blackouts[i].days.join("||");
        for(var j = 0; j < data.blackouts[i].intervals.length; j++){
            var startTime = data.blackouts[i].intervals[j].startTime;
            var endTime = data.blackouts[i].intervals[j].endTime;
            var checked = data.blackouts[i].checked;
            if(data.blackouts[i].span != undefined){
                var span = data.blackouts[i].span;
            } else {
                var span = "";
            }
            dbObject[i+""+j] = [days, checked, span, startTime, endTime];
        }
    }

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

    DAL.getSettings(userId, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            if(result[0].settings != undefined){
                var finalResult = {
                    id: result[0].id,
                    settings: createSettingsJSON(result)
                }
            } else {
                var finalResult = {};
            }
            
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getSettings
// ---------------------------------------------
BLL.prototype.saveEmailCode = function(req, res) {
    var userId = req.user[0].userId;

    var date = new Date();
    var data = req.body;
    data.createdDate = date;
    data.code = generateCode();
    DAL.saveEmailCode(userId, data, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            // var emailOption = {
            //     text: "Please use this verfication code: "+ data.code,
            //     from:"AOTC <aotc.invite@gmail.com>", 
            //     subject:"AOTC Email Verification",
            //     to: value.alert.properties.email
            // };

            // EmailService.send_email(emailOption, function(error, result) {
            //     console.log('sending',i,emailOption.to)
            //     results.push(result)
            //     cb()
            // });
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getSettings
// ---------------------------------------------
BLL.prototype.savePhoneCode = function(req, res) {
    var userId = req.user[0].userId;

    var date = new Date();
    var data = req.body;
    data.createdDate = date;
    data.code = generateCode();
    DAL.savePhoneCode(userId, data, function(error, result) {
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
BLL.prototype.verifyEmailCode = function(req, res) {
    var userId = req.user[0].userId;

    var date = new Date();
    var email = req.body.email;
    var verificationCode = req.body.code;
    // var data = req.body;
    // data.createdDate = date;
    // data.code = generateCode();
    
    DAL.verifyEmailCode(userId, email, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            if(result.length > 0){
                var endingTime = new Date(result[0].e.properties.createdDate);
                endingTime = endingTime.setDate(endingTime.getDate() + 1);
                if(moment(date).isBefore(endingTime)){
                    if(result[0].e.properties.code == verificationCode){
                        DAL.getSettings(userId, function(error, settings) {
                            if (error) {
                                console.log(error);
                                error.userName = loginUserName;
                                ErrorLogDAL.addErrorLog(error);
                                Response.sendResponse(false, "Something went wrong.", null, res);
                                
                            } else {
                                try{
                                    var tempSettings = settings[0].settings;
                                    tempSettings.email[2] = "true";
                                    DAL.saveSettings(tempSettings, userId, function(error, result) {
                                        if (error) {
                                            console.log(error);
                                            error.userName = loginUserName;
                                            ErrorLogDAL.addErrorLog(error);
                                            Response.sendResponse(false, "Something went wrong.", null, res);
                                        } else {
                                            Response.sendResponse(true, "Verification Successful.", null, res); 
                                        }
                                    });
                                } catch(e){
                                    var finalResult = {};
                                }
                            }
                        });
                    } else {
                        Response.sendResponse(false, "Verfication Failed.", null, res);
                    }
                } else {
                    Response.sendResponse(false, "Verfication code expired.", null, res);
                }
            }
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getSettings
// ---------------------------------------------
BLL.prototype.verifyPhoneCode = function(req, res) {
    var userId = req.user[0].userId;

    var date = new Date();
    var phone = req.body.phone;
    var verificationCode = req.body.code;
    
    DAL.verifyPhoneCode(userId, phone, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            if(result.length > 0){
                var endingTime = new Date(result[0].e.properties.createdDate);
                endingTime = endingTime.setDate(endingTime.getDate() + 1);
                if(moment(date).isBefore(endingTime)){
                    if(result[0].e.properties.code == verificationCode){
                        DAL.getSettings(userId, function(error, settings) {
                            if (error) {
                                console.log(error);
                                error.userName = loginUserName;
                                ErrorLogDAL.addErrorLog(error);
                                Response.sendResponse(false, "Something went wrong.", null, res);
                                
                            } else {
                                try{
                                    var tempSettings = settings[0].settings;
                                    tempSettings.sms[2] = "true";
                                    DAL.saveSettings(tempSettings, userId, function(error, result) {
                                        if (error) {
                                            console.log(error);
                                            error.userName = loginUserName;
                                            ErrorLogDAL.addErrorLog(error);
                                            Response.sendResponse(false, "Something went wrong.", null, res);
                                        } else {
                                            Response.sendResponse(true, "Verification Successful.", null, res); 
                                        }
                                    });
                                } catch(e){
                                    var finalResult = {};
                                }
                            }
                        });
                    } else {
                        Response.sendResponse(false, "Verfication Failed.", null, res);
                    }
                } else {
                    Response.sendResponse(false, "Verfication code expired.", null, res);
                }
            }
        }
    });
}
// ---------------------END---------------------

function createSettingsJSON(result){
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
        } else{
            var daysIndex = daysList.indexOf(data[element][0]);
            var interval = {
                startTime: data[element][3],
                endTime: data[element][4]
            };

            if(daysIndex > -1){
                blackouts[daysIndex].intervals.push(interval);
            } else {

                var blackout = {
                    checked: data[element][1],
                    days: data[element][0].split("||"),
                    intervals: [interval]
                }

                if(data[element][2] != undefined){
                    blackout.span = data[element][2];
                }

                blackouts.push(blackout);
                daysList.push(data[element][0]);
            }
        }
    }
    finalResult.blackouts = blackouts;
    return finalResult;
}

function getActiveTime(blackouts){
    
    var blackoutTimes = [
            {
                day: "Sunday",
                intervals: []
            }, 
            {
                day: "Monday",
                intervals: []
            }, 
            {
                day: "Tuesday",
                intervals: []
            }, 
            {
                day: "Wednesday",
                intervals: []
            }, 
            {
                day: "Thursday",
                intervals: []
            }, 
            {
                day: "Friday",
                intervals: []
            }, 
            {
                day: "Saturday",
                intervals: []
            }
        ];

        var activeTimes = [
            {
                day: "Sunday",
                intervals: []
            }, 
            {
                day: "Monday",
                intervals: []
            }, 
            {
                day: "Tuesday",
                intervals: []
            }, 
            {
                day: "Wednesday",
                intervals: []
            }, 
            {
                day: "Thursday",
                intervals: []
            }, 
            {
                day: "Friday",
                intervals: []
            }, 
            {
                day: "Saturday",
                intervals: []
            }
        ];
    
        for(var i = 0; i < blackouts.length; i++){
            // var intervals = [];
            if(blackouts[i].checked == "true"){
                for(var j = 0; j < blackouts[i].intervals.length; j++){
                    var currentStartTime = moment(blackouts[i].intervals[j].startTime).format("HH:mm");
                    var currentEndTime = moment(blackouts[i].intervals[j].endTime).format("HH:mm");
                    if(currentEndTime == "Invalid date" || currentStartTime == "Invalid date"){
                        continue;
                    }
    
                    var blackout = {
                        startTime: currentStartTime,
                        endTime: currentEndTime
                    }
                    
                    blackoutTimes = addActiveTime(blackout, blackoutTimes, blackouts[i].days);
                }
            }
        }

        for(var i = 0; i < blackoutTimes.length; i++){
            blackoutTimes[i].intervals = blackoutTimes[i].intervals.sort(function(a, b){
                return b.startTime < a.startTime;
            });

            for(var j = 0; j < blackoutTimes[i].intervals.length; j++){
                var currentStartTime = blackoutTimes[i].intervals[j].startTime;
                var currentEndTime = blackoutTimes[i].intervals[j].endTime;

                if(currentStartTime > currentEndTime){

                }
                
                if(blackoutTimes[i].intervals.length == 1){
                    if(currentStartTime != "00:00"){
                        var activeTime1  = {};
                        activeTime1.startTime = "00:00";
                        activeTime1.endTime = currentStartTime;
                        activeTimes = addActiveTime(activeTime1, activeTimes, blackoutTimes[i].day);                    
                    }

                    if(currentEndTime != "23:59"){
                        var activeTime2 = {};
                        activeTime2.startTime = currentEndTime;
                        activeTime2.endTime = "23:59";
                        activeTimes = addActiveTime(activeTime2, activeTimes, blackoutTimes[i].day);
                    }
                } else {
                    var activeTime = {};
                    if( j == 0 && currentStartTime != "00:00"){
                        activeTime.startTime = "00:00";
                        activeTime.endTime = currentStartTime;
                        activeTimes = addActiveTime(activeTime, activeTimes, blackoutTimes[i].day);
                    } else if(j > 0) {
                        var previousEndTime = blackoutTimes[i].intervals[j-1].endTime;
                        if(currentStartTime == previousEndTime){
                            // continue;
                        } else if(currentStartTime < previousEndTime){
                            if(previousEndTime > currentEndTime){
                                blackoutTimes[i].intervals[j].endTime = previousEndTime;
                                currentEndTime = previousEndTime;
                            }
                        } else {
                            activeTime.startTime = previousEndTime;
                            activeTime.endTime = currentStartTime;
                            activeTimes = addActiveTime(activeTime, activeTimes, blackoutTimes[i].day);
                        }
                        
                    } 
                    
                    if (j == blackoutTimes[i].intervals.length - 1 && currentEndTime != "23:59"){
                        var activeTime3 = {};
                        activeTime3.startTime = currentEndTime;
                        activeTime3.endTime = "23:59";
                        activeTimes = addActiveTime(activeTime3, activeTimes, blackoutTimes[i].day);
                    }
                }
            }
        }
    return activeTimes;
}


function addActiveTime(activeTime, activeTimes, days){
    if(days.indexOf("Sunday") > -1 || days == "Sunday"){
        activeTimes[0].intervals.push(activeTime);
    }

    if(days.indexOf("Monday") > -1 || days == "Monday"){
        activeTimes[1].intervals.push(activeTime);
    }

    if(days.indexOf("Tuesday") > -1 || days == "Tuesday"){
        activeTimes[2].intervals.push(activeTime);
    }

    if(days.indexOf("Wednesday") > -1 || days == "Wednesday"){
        activeTimes[3].intervals.push(activeTime);
    }

    if(days.indexOf("Thursday") > -1 || days == "Thursday"){
        activeTimes[4].intervals.push(activeTime);
    }

    if(days.indexOf("Friday") > -1 || days == "Friday"){
        activeTimes[5].intervals.push(activeTime);
    }

    if(days.indexOf("Saturday") > -1 || days == "Saturday"){
        activeTimes[6].intervals.push(activeTime);
    }

    return activeTimes;
}

function updateActiveTime (endTime, activeTimes, days){
    if(days.indexOf("Sunday") > -1 || days == "Sunday"){
        activeTimes[0].intervals[activeTimes[0].intervals.length - 1].endTime = endTime;
    }

    if(days.indexOf("Monday") > -1 || days == "Monday"){
        activeTimes[0].intervals[activeTimes[0].intervals.length - 1].endTime = endTime;
    }

    if(days.indexOf("Tuesday") > -1 || days == "Tuesday"){
        activeTimes[0].intervals[activeTimes[0].intervals.length - 1].endTime = endTime;
    }

    if(days.indexOf("Wednesday") > -1 || days == "Wednesday"){
        activeTimes[0].intervals[activeTimes[0].intervals.length - 1].endTime = endTime;
    }

    if(days.indexOf("Thursday") > -1 || days == "Thursday"){
        activeTimes[0].intervals[activeTimes[0].intervals.length - 1].endTime = endTime;
    }

    if(days.indexOf("Friday") > -1 || days == "Friday"){

        activeTimes[0].intervals[activeTimes[0].intervals.length - 1].endTime = endTime;
    }

    if(days.indexOf("Saturday") > -1 || days == "Saturday"){
        activeTimes[0].intervals[activeTimes[0].intervals.length - 1].endTime = endTime;
    }

    return activeTimes;
}

function generateCode(){
    return Math.floor(100000 + Math.random() * 900000);
}