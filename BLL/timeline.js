var path = require('path');
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var loginUserName = 'Ali'; // Infutre will get logged in user name
var AppealDAL = require(path.resolve(__dirname, '../DAL/timeline'));
var DAL = new AppealDAL();
// var cron = require('node-cron');
// var nodemailer = require('nodemailer'); // required for sending email


// var ical = require(path.resolve(__dirname, './util/my-ical-generator')); // simple JS file downloaded from git, required for generating ICS file


// var nodemailer = require('nodemailer');

// var ical = require('my-ical-generator');

//Create notifications for users everyday
// var task = cron.schedule('30 10 * * *', function() { //min hour
//     //console.log("notifications extracted");
// 	extractNotifications(); //extract notifications and store them in the DB everyday
// }, false);
// task.start();


module.exports = BLL;

function BLL() {

}


// ---------------------------------------------
// getTimelineForJurisdiction
// ---------------------------------------------
BLL.prototype.getTimelineForJurisdiction = function(data, res) {

    // if(!data.user[0].roles.view_appeal_timeline){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }
	
    DAL.getTimelineForJurisdiction(data.body, function(error, result) {
        if (error) {
        	//console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {

        	var finalResult = {
        		assessmentData: "",
        		valuationDate: "",
        		surveyFormName: "",
        		surveyFormOutDate: "",
        		surveyFormDueDate: ""
			}

        	for(var i = 0; i <  result.length; i++){
        		if(i == 0){
        			finalResult.assessmentData = assessmentData(result[i]);
        		} else if(i == 1){
        			finalResult.valuationDate = valuationDate(result[i]);
        		} else if( i == 2){
        			finalResult.surveyFormName = surveyFormName(result[i]);
        		} else if(i == 3){
        			finalResult.surveyFormOutDate = surveyFormOutDate(result[i]);
        		} else if(i == 4){
        			finalResult.surveyFormDueDate = surveyFormDueDate(result[i]);
        		}


        	}
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
            // Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);

        }
    });
}
// ---------------------END---------------------


function assessmentData(question) {

	var options = JSON.parse(question.value);
	var assessmentData = {
		specificDate: {
			state:false,
			value: ""
		},
		overPeriod: {
			state: false,
			value: {
				from:"",
				to:""
			}

		}
	}
	if(options[0].answer.state){
		assessmentData.specificDate.state = true;
		assessmentData.specificDate.value = options[1].answer.value;
	} else if( options[2].answer.state){
		assessmentData.overPeriod.state = true;
		assessmentData.overPeriod.value.from = options[4].answer.value;
		assessmentData.overPeriod.value.to = options[6].answer.value;
	} else {
		assessmentData.specificDate.state = true;
		assessmentData.specificDate.value = options[1].answer.value;
	}

	return assessmentData;
}


function valuationDate(question) {

	var options = JSON.parse(question.value);
	var assessmentData = {
			value: ""
	}
	if(options[0].answer.value != ""){
		assessmentData.value = options[0].answer.value;
	} else if( options[1].answer.value != ""){
		assessmentData.value = options.answer.value[4];
		assessmentData.value = options.answer.value[6];
	}

	return assessmentData;
}

function surveyFormName(question) {

	var options = JSON.parse(question.value);
	var assessmentData = {
			value: ""

	}
	if(options[0].answer.state){
		assessmentData.value = "Survey Form";
	} else if( options[2].answer.state){
		assessmentData.value = options[2].answer.value;
	} else {
		assessmentData.value = "Surver Form";
	}

	return assessmentData;
}


function surveyFormOutDate(question) {

	var options = JSON.parse(question.value);
	var assessmentData = {
			value: ""

	}
	if(options[0].answer.state){
		assessmentData.value = options[1].answer.value;
	} else if( options[2].answer.state){
		assessmentData.value = options[2].answer.value + options[2].radioLabel2;
	} else if( options[3].answer.state){
		assessmentData.value = options[2].answer.value + options[2].radioLabel2;
	} else if( options[4].answer.state){
		assessmentData.value = options[2].answer.value + options[2].radioLabel2;
	} else {
		assessmentData.value = options[1].answer.value;
	}

	return assessmentData;
}

function surveyFormDueDate(question) {

	var options = JSON.parse(question.value);
	var assessmentData = {
			value: options[0].answer.value

	}

	return assessmentData;
}
// ---------------------------------------------
// getTimelineForJurisdiction
// ---------------------------------------------
BLL.prototype.getJurisdictions = function(data, res) {

    // if(!data.user[0].roles.view_appeal_timeline){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    DAL.getJurisdictions(data, function(error, result) {
        if (error) {
        	//console.log(error);
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
// getTimelineForJurisdiction
// ---------------------------------------------
BLL.prototype.getAllPropertiesTimelineStatus = function(data, res) {

    // if(!data.user[0].roles.view_appeal_timeline){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
	// }
	// try{
	// 	var userId = data.user[0].userId;
	// }catch(e){
	// 	var userId = data.userId;
	// }
	
    // //console.log(userId);

    var userId = data.user[0].userId;
    ////console.log(userId);

    DAL.getAllPropertiesTimelineStatus(data.body, userId, function(error, result) {
        if (error) {
        	//console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------
function getAllPropertiesTimelineStatus2(userId, role) {
		//var userId = data.userId;
	DAL.getAllPropertiesTimelineStatus(null, userId, function(error, result) {
		if (error) {
			//console.log(error);
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
		} else {
			// //console.log(role,result);
			
			if (result.length > 0){
				// //console.log("timeline status: ", result);
			var jurisdictions = [];
			for(var i = 0; i < result.length; i++){
				if (jurisdictions.indexOf(result[i].jurisdiction.trim()) === -1){
					jurisdictions.push(result[i].jurisdiction.trim());
				}
				
			}

			for(var j = 0; j < jurisdictions.length;j++){
				var mydata = [];
				mydata.userId = userId;
				mydata.jurisdictionName = jurisdictions[j];
				mydata.role = role;
				getJurisdictionTimeline2(mydata);
			}
		}else{
			// //console.log("empty status");
		}

		}
	});
}

// function extractNotifications() {
// 	DAL.getUserIds(function(error, result) {
// 		if (error) {
// 			//console.log(error);
// 			error.userName = loginUserName;
// 			ErrorLogDAL.addErrorLog(error);
// 		} else {
// 			// //console.log("user ids: ", result);
// 			for(var i = 0; i < result.length; i++){
// 				getAllPropertiesTimelineStatus2(result[i].id, result[i].role);
// 			}
		
// 		}
// 	});
// }


BLL.prototype.markAsRead = function(data,res){
	var notId = data.body.notId;
	DAL.markAsRead(notId, function(error, result) {
        if (error) {
        	// //console.log(error);
            error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			//console.log(error);
        } else {
			// //console.log(JSON.stringify(result));
			Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });


}

BLL.prototype.getNotifications = function(data,res){
	var userId = data.user[0].userId;
	DAL.getNotifications(userId, function(error, result) {
        if (error) {
        	// //console.log(error);
            error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			//console.log(error);
        } else {
			// //console.log(JSON.stringify(result));
			Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });


}

// ---------------------------------------------
// getTimelineForJurisdiction
// ---------------------------------------------
BLL.prototype.getJurisdictionTimeline = function(data, res) {
    var userId = data.user[0].userId;
    var userRole = data.user[0].roles.name;
    if(userRole == "Assessing Jurisdiction"){
		userRole = "AJ";
	} else {
		userRole = "PO";
	}

    DAL.getJurisdictionTimeline(data.body, userId, function(error, result) {
        if (error) {
        	//console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
        	var finalResult = [];
        	for(var i = 0; i < result.length; i++){
        		// //console.log(result[i].events.properties.eventFor);
        		if(userRole == result[i].events.properties.eventFor){
        			var flag = false;
	        		var event = {
	        			event: "",
	        			internalEvents:[]
	        		}
	        		var internalEvent = {
	        			event: result[i].internalEvents,
	        			propertyNames: result[i].propertyNames
	        		}
	        		// result[i].internalEvents.properties["propertyNames"]= result[i].propertyNames
	        		// var internalEvent = result[i].internalEvents;
	        		// internalEvent.propertyNames = "adasdsda";
	        		// internalEvent.a = "asdas";
	     //    		if(result[i].propertyNames.length == 0){
						// internalEvent["propertyNames"] = [1];

	     //    		} else {
	     //    			internalEvent["propertyNames"] = result[i].propertyNames;
	     //    		}
	        		for(var j = 0; j < finalResult.length; j++){
	        			if(finalResult[j].event._id == result[i].events._id){
	        				var index = j;
	        				flag = true;
	        				break;
	        			}


	        		}
	        		if(flag){
	    				finalResult[j].internalEvents.push(internalEvent);
	    			} else {
	    				event.event = result[i].events;
	    				event.internalEvents.push(internalEvent);
	    				finalResult.push(event);
	    			}
        		}
        		
			}
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
        }
    });
}
// ---------------------END---------------------
function getJurisdictionTimeline2 (data) {
	// //console.log(data);
	
		var userId = data.userId;
		var userRole = data.role;

		if(userRole == "Assessing Jurisdiction"){
			userRole = "AJ";
		} else {
			userRole = "PO";
		}
		DAL.getJurisdictionTimeline(data, userId, function(error, result) {
			if (error) {
				//console.log(error);
				error.userName = loginUserName;
				ErrorLogDAL.addErrorLog(error);
				Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
			} else {
				if (result.length > 0){
				// //console.log("jurisdicion timeline: ", JSON.stringify(result));
				// //console.log("******************************************");
				var finalResult = [];
				for(var i = 0; i < result.length; i++){
					var flag = false;
					var event = {
						event: "",
						internalEvents:[]
					}
					var internalEvent = {
						event: result[i].internalEvents,
						propertyNames: result[i].propertyNames
					}
					for(var j = 0; j < finalResult.length; j++){
						if(finalResult[j].event._id == result[i].events._id){
							var index = j;
							flag = true;
							break;
						}
	
	
					}
					if(flag){
						finalResult[j].internalEvents.push(internalEvent);
					} else {
						event.event = result[i].events;
						event.internalEvents.push(internalEvent);
						finalResult.push(event);
					}
				}

				var result = finalResult;
				// //console.log("myResult: ",JSON.stringify(finalResult));
				for(var i = 0; i < result.length;i++){
					
							var days = 300;
					
							var startdate = result[i].event.properties.deadlineStart;
					
							for(var j = 0; j < result[i].internalEvents.length; j++){
								if(result[i].internalEvents[j].event){
					
								
									var internalDeadline = result[i].internalEvents[j].event.properties.deadline;
									var currDate = Date();
									var date_1 = new Date(currDate);
									
									var deadline = Date.parse(internalDeadline);
									var date_2 = new Date(deadline);
									
									var timeDiff1 = date_2.getTime() - date_1.getTime();
									var diffDays1 = Math.ceil(timeDiff1 / (1000 * 3600 * 24));
									if(result[i].internalEvents[j].event.properties.snooze && diffDays1 <= parseInt(result[i].internalEvents[j].event.properties.before) ){ //3 days /* parseInt(result[i].internalEvents[j].event.properties.before)*/
										////console.log("Internal Event: Store it in the DB and Generate a Notification");
										var readFlag = 0;
										var daysLeft = diffDays1;
										details = {"eventName": result[i].internalEvents[j].event.properties.event_name, "eventDetails": result[i].internalEvents[j].event.properties.description , "deadLine":internalDeadline, "before": result[i].internalEvents[j].event.properties.before,"eventType": "internal","propertyNames": JSON.stringify(result[i].internalEvents[j].propertyNames) };
										DAL.sendNotifications(details,readFlag,daysLeft,userId, function(error, result) {
											if (error) {
												//console.log("error");
												////console.log("error: ",error);
												
											} else {
												// //console.log("result: ",result)
											}
										});
									}else{
										if( !result[i].internalEvents[j].event.properties.snooze && diffDays1 == parseInt(result[i].internalEvents[j].event.properties.before) ){
											var readFlag = 0;
											var daysLeft = diffDays1;
											details = {"eventName": result[i].internalEvents[j].event.properties.event_name, "eventDetails": result[i].internalEvents[j].event.properties.description , "deadLine":internalDeadline, "before": result[i].internalEvents[j].event.properties.before,"eventType": "internal","propertyNames": JSON.stringify(result[i].internalEvents[j].propertyNames) };
											DAL.sendNotifications(details,readFlag,daysLeft,userId, function(error, result) {
												if (error) {
													//console.log("error");
													////console.log("error: ",error);
													
												} else {
													// //console.log("result: ",result)
												}
											});
										}
										////console.log("internal Event: Do nothing");
									}
								
								}
					
								
							}
					
							var currDate = Date();
							var date1 = new Date(currDate);
							
							var deadline = Date.parse(startdate);
							var date2 = new Date(deadline);
							
							var timeDiff = date2.getTime() - date1.getTime();
							var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
							// //console.log(result[i].event.properties.eventFor);
							if(userRole == result[i].event.properties.eventFor){
									// //console.log("erere");

								if(diffDays <= days){ //3 days
									////console.log("Store it in the DB and Generate a Notification");
									var readFlag = 0;
									var daysLeft = diffDays;
									details = {"eventName": result[i].event.properties.eventName , "eventDetails": result[i].event.properties.description , "startDate":startdate, "endDate": result[i].event.properties.deadlineEnd,"eventType": "external" };
									DAL.sendNotifications(details,readFlag,daysLeft,userId, function(error, result) {
										if (error) {
											////console.log("error: ",error);
											//console.log("error");
											
										} else {
											// //console.log("result: ",result)
										}
										
									});
								}else{
									// //console.log("Do nothing");
								}
							}
							
					}
				}
				else{
					// //console.log("empty JD timeline")
				}
			}
		});
	}
// ---------------------------------------------
// getTimelineForJurisdiction
// ---------------------------------------------
BLL.prototype.createNewInternalEvent = function(data, res) {

    // if(!data.user[0].roles.edit_appeal_timeline){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    var userId = data.user[0].userId;

    DAL.createNewInternalEvent(data.body, userId, function(error, result) {
        if (error) {
        	//console.log(error);
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
// getTimelineForJurisdiction
// ---------------------------------------------
BLL.prototype.getInternalEvent = function(data, res) {

    // if(!data.user[0].roles.view_appeal_timeline){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    var userId = data.user[0].userId;

    DAL.getInternalEvent(data.query, userId, function(error, result) {
        if (error) {
        	//console.log(error);
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
// getTimelineForJurisdiction
// ---------------------------------------------
BLL.prototype.linkInternalEvent = function(data, res) {

    // if(!data.user[0].roles.edit_appeal_timeline){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    DAL.linkInternalEvent(data.body, function(error, result) {
        if (error) {
        	//console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getTimelineForJurisdiction
// ---------------------------------------------
BLL.prototype.getTimelineForProperty = function(data, res) {

    // if(!data.user[0].roles.view_appeal_timeline){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    DAL.getTimelineForProperty(data.body, function(error, result) {
        if (error) {
        	//console.log(error);
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
// addJurisdictionTimeline
// ---------------------------------------------
BLL.prototype.addJurisdictionTimeline = function(data, res) {

    // if(!data.user[0].roles.edit_appeal_timeline){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }
    
    DAL.addJurisdictionTimeline(data.body, function(error, result) {
        if (error) {
        	//console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// BLL.prototype.createEventFile = function() {

//     var eventObj = {
// 		'start' : new Date(),
// 		'end' : new Date("13 May,2018"),
// 		'title' : 'Testing an ICS file',
// 		'description' : 'Lets check this module',
// 		'id' : 'wdcwe76234e127eugb', //Some unique identifier
// 		'organiser' : {'name' : 'Muhammad Umar', 'email':'muhammad.umar@spsnet.com'},
// 		'location' : 'Islamabad'
// 	}
// 	var cal = ical();

// 	cal.setDomain('http://aotc-prod.mybluemix.net/').setName('Timeline Event Notifications');

// 	cal.addEvent({
// 		start: eventObj.start,
// 		end: eventObj.end,
// 		summary: eventObj.title,
// 		uid: eventObj.id, // Some unique identifier
// 		sequence: 0,
// 		description: eventObj.description,
// 		location: eventObj.location,
// 		organizer: {
// 					name: eventObj.organiser.name,
// 					email: eventObj.organiser.email
// 				  },
// 		method: 'request'
// 	});

// 	var mypath = __dirname + '\\'+ eventObj.id + '.ics';

// 	cal.saveSync(mypath);
// 	// //console.log("cal: ",cal);
// 	//console.log("event created and file saved at: ",mypath); 

// 	//sending email

// 	// Create a SMTP transporter object
// 	var transporter = nodemailer.createTransport({
// 	service: 'Gmail',
// 	auth: {
// 		user: 'hamza.simorghsps@gmail.com',
// 		pass: 'object@00'
// 	},
// 	logger: true, // log to console
// 	debug: true // include SMTP traffic in the logs
// 	});

// 	// Message object
// 	var message = {
// 	from: '"Umar" <muhammad.umar@spsnet.com>',
// 	to: '"Hamza" <Muhammad.Hamza@spsnet.com>',
// 	subject: 'Calendar invite',
// 	text: 'This message contains a calendar event',
// 	icalEvent: {
// 		method: 'request',
// 		path: mypath
// 	}
// 	};

// 	//console.log('Sending Mail');
// 	transporter.sendMail(message, function (error, info) {
// 	if (error) {
// 		// //console.log('Error occurred');
// 		//console.log(error.message);
// 		return;
// 	}
// 	//console.log('Message sent successfully!');
// 	// //console.log('Server responded with "%s"', info.response);
// 	});
// }
