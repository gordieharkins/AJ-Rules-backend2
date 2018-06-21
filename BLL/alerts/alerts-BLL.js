
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

// BLL.prototype.addAlert = function(alert, userId, cb) {
BLL.prototype.addAlert = function(req, res) {
    var userId = req.user[0].userId;
    DAL.getSettings(userId, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            // cb(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            var settingsJSON = createSettingsJSON(result);
            var settings = {
              sms: settingsJSON.sms,
              email: settingsJSON.email,
              settings: getActiveTime(settingsJSON.blackouts)  
            };

            // console.log(JSON.stringify(settings));
            var alert = req.body;
            alertSettings.configureAlert(alert, settings, function(finalAlert){
               DAL.addAlert(finalAlert, userId, function(error, result) {
                    if (error) {
                        console.log(error);
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                        Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                    } else {
                        Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
                    }
                });
            });
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
    

    dbObject.sms = [data.sms.flag, data.sms.details, data.sms.verified];
    dbObject.email = [data.email.flag, data.email.details, data.email.verified];
    dbObject.timezone = data.timezone;

    for(var i = 0; i < data.blackouts.length; i++){
        var days = data.blackouts[i].days.join("||");
        // dbObject.span = data.blackouts[i].span;
        // dbObject.checked = data.blackouts[i].checked;
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

    // console.log(dbObject);
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
            
            var finalResult = {
                id: result[0].id,
                settings: createSettingsJSON(result)
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

    // console.log(dbObject);
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
    // console.log(dbObject);
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

function createSettingsJSON(result){
    // console.log(result);
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
            // console.log(daysList);
        //    console.log(data[element][0]);
            var daysIndex = daysList.indexOf(data[element][0]);
            // console.log(daysIndex);
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


                // if(data[element][1] != "true"){
                //     blackout.checked = true;
                // } else if(data[element][1] != "false"){
                //     blackout.checked = false;
                // }

                if(data[element][2] != undefined){
                    blackout.span = data[element][2];
                }

                blackouts.push(blackout);
                daysList.push(data[element][0]);
            }
        }
    }
    getActiveTime(blackouts);
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
            for(var j = 0; j < blackouts[i].intervals.length; j++){
                var currentStartTime = moment(blackouts[i].intervals[j].startTime).format("HH:mm");
                var currentEndTime = moment(blackouts[i].intervals[j].endTime).format("HH:mm");
                var blackout = {
                    startTime: currentStartTime,
                    endTime: currentEndTime
                }
                
                blackoutTimes = addActiveTime(blackout, blackoutTimes, blackouts[i].days);
            }

            // blackoutTimes
        }

        // blackoutTimes.sort(function(a, b){
        //     return b.startTime > a.startTime;
        // });

        console.log(JSON.stringify(blackouts));

        

        for(var i = 0; i < blackoutTimes.length; i++){
            blackoutTimes[i].intervals = blackoutTimes[i].intervals.sort(function(a, b){
                return b.startTime < a.startTime;
            });

            // blackoutTimes[i].intervals = blackoutTimes[i].intervals.sort(function(a, b){
            //     return b.endTime < a.endTime;
            // });

            for(var j = 0; j < blackoutTimes[i].intervals.length; j++){
                // console.log("cccccccccccccc",blackoutTimes[i].intervals[j]);
                var currentStartTime = blackoutTimes[i].intervals[j].startTime;
                var currentEndTime = blackoutTimes[i].intervals[j].endTime;
                
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
                            // if(previousEndTime > currentEndTime){
                            //     // activeTimes = updateActiveTime(currentEndTime, activeTimes, blackoutTimes[i].day);
                            //     blackoutTimes[i].intervals[j].endTime = previousEndTime;
                            // }
                            // continue;
                        } else if(currentStartTime < previousEndTime){
                            // if(currentEndTime > previousEndTime){
                            //     activeTimes = updateActiveTime(currentEndTime, activeTimes, blackoutTimes[i].day);
                            // }

                            if(previousEndTime > currentEndTime){
                                // activeTimes = updateActiveTime(currentEndTime, activeTimes, blackoutTimes[i].day);
                                blackoutTimes[i].intervals[j].endTime = previousEndTime;
                                currentEndTime = previousEndTime;
                            }
                            // continue;
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

            // console.log(blackoutTimes[i].intervals);
        }
    // for(var i = 0; i < blackouts.length; i++){
    //     var intervals = [];
    //     for(var j = 0; j < blackouts[i].intervals.length; j++){
    //         var currentStartTime = moment(blackouts[i].intervals[j].startTime).format("HH:mm");
    //         var currentEndTime = moment(blackouts[i].intervals[j].endTime).format("HH:mm");
            
    //         if(blackouts[i].intervals.length == 1){
    //             if(currentStartTime != "00:00"){
    //                 var activeTime1  = {};
    //                 activeTime1.startTime = "00:00";
    //                 activeTime1.endTime = currentStartTime;
    //                 activeTimes = addActiveTime(activeTime1, activeTimes, blackouts[i].days);                    
    //             }

    //             if(currentEndTime != "00:00"){
    //                 var activeTime2 = {};
    //                 activeTime2.startTime = currentEndTime;
    //                 activeTime2.endTime = "00:00";
    //                 activeTimes = addActiveTime(activeTime2, activeTimes, blackouts[i].days);
    //             }
                

    //         } else {
    //             var activeTime = {};
    //             if( j == 0 && currentStartTime != "00:00"){
    //                 activeTime.startTime = "00:00";
    //                 activeTime.endTime = currentStartTime;
    //             } 

    //             if(j > 0) {
    //                 var previousEndTime = moment(blackouts[i].intervals[j].endTime).format("HH:mm");
    //                 if(currentStartTime == previousEndTime){
    //                     continue;
    //                 } else {
    //                     activeTime.startTime = previousEndTime;
    //                     activeTime.endTime = currentStartTime;
    //                 }
    //             }

    //             activeTimes = addActiveTime(activeTime, activeTimes, blackouts[i].days);
                
    //         }
    //     }
    // }

    console.log("AAAAAAAAAAAA",JSON.stringify(blackoutTimes));
    console.log("BBBBBBBBBBBBBB",JSON.stringify(activeTimes));


    return activeTimes;
    
}


function addActiveTime(activeTime, activeTimes, days){
    // console.log(activeTimes[1]);
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