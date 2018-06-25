// import { reverse } from 'dns';

var path = require('path');
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var loginUserName = 'Ali'; // Infutre will get logged in user name
var AppealDAL = require(path.resolve(__dirname, '../DAL/appeal'));
var IEDAL = require(path.resolve(__dirname, '../DAL/incomeExpenses'));
var RRDAL = require(path.resolve(__dirname, '../DAL/rentRolls'));
var async = require('async');
var dateDiff = require('date-diff');
var jurisdictionTimeline = require(path.resolve(__dirname, './util/jdRules'));
var alerts = require(path.resolve(__dirname, './alerts/alerts-BLL'));

var IEDAL = new IEDAL();
var RRDAL = new RRDAL();
var DAL = new AppealDAL();
var ALERT =  new alert();


module.exports = BLL;

function BLL() {

}

// ---------------------------------------------
// getFormDataForJurisdiction
// ---------------------------------------------
BLL.prototype.getFormDataForJurisdiction = function(data, res) {
    DAL.getFormDataForJurisdiction(data, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
        	var form = result[0].form.properties;
        	var clauses = [];
        	for(var i = 0; i < form.clauses.length; i++){
        		var clause = {
        			clause: form.clauses[i],
        			explanation: form.clausesExp[i]
        		}

        		clauses.push(clause);
        	}

        	var faqs = [];
        	for(var i = 0; i < form.faqs.length; i++){
        		var faq = {
        			question: form.faqs[i],
        			answer: form.faqAnswers[i]
        		}

        		faqs.push(faq);
        	}

        	delete result[0].form.properties.clauses;
        	delete result[0].form.properties.clausesExp;
        	delete result[0].form.properties.faqs;
        	delete result[0].form.properties.faqAnswers;
        	result[0].form.properties["clauses"] = clauses;
        	result[0].form.properties["faqs"] = faqs;

            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getFormDataForJurisdiction
// ---------------------------------------------
BLL.prototype.getIESurveyInformation = function(data, res) {
    DAL.getIESurveyInformation(data, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
			var finalResult = [];
        	for(var i = 0; i < result.length; i++){
				var ieData = {
					propertyId: result[i].propertyId
				};
				for(var j = 0; j < result[i].submodules.length; j++){
					ieData[result[i].submodules[j].labels[0]] = result[i].submodules[j]; 
				}
				finalResult.push(ieData);
			}
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// updateIESurveyInformation
// ---------------------------------------------
BLL.prototype.updateIESurveyInformation = function(data, res) {
    DAL.updateIESurveyInformation(data, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
			
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
        }
    });
}
// ---------------------END---------------------



// ---------------------------------------------
// Add timeline data to property
// ---------------------------------------------
BLL.prototype.addPropertyTimelineData = function(data, cb) {
	var year = (new Date()).getFullYear();
	// var jurisdictionIndex = jurisdictionTimeline.jurisdictionsNames.indexOf(data[0].jurisdiction);
	var jurisdictionTimelineData = jurisdictionTimeline.jurisdictions[1];
	DAL.getJurisdictionTimelineData(data[0].jurisdiction, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            cb(error);
		} else {
			try{
				jurisdictionTimelineData.ieSurvey.main = result[0].rules;
			} catch (err){
					
				jurisdictionTimelineData["ieSurvey"] = {};
				jurisdictionTimelineData.ieSurvey["main"] = {};
				jurisdictionTimelineData.ieSurvey.main = result[0].rules;
			}
			var timeline = createTimelineWithJson(jurisdictionTimelineData);
			DAL.addPropertyTimelineData(data, timeline, year, function(error, result) {
				if (error) {
					console.log(error);
					error.userName = loginUserName;
					ErrorLogDAL.addErrorLog(error);
					cb(error);
				} else {
					cb(null);
				}
			});
        }
	});
	
}
// ---------------------END---------------------

// ---------------------------------------------
// Add timeline data to property
// ---------------------------------------------
BLL.prototype.getNotification = function(req, res) {
	var userId = req.user[0].userId;
    DAL.getNotification(userId, function(error, result) {
		if (error) {
			console.log(error);
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
		} else {
			var notificationText = [];
			var notifications = [];
			
			for(var i = 0; i < result.length; i++){
				if(result[i].notification != null){
					var notificationIndex = notificationText.indexOf(result[i].notification.text);
					if(notificationIndex > -1){
						console.log("dummy console. will find something better soon. ");
					} else {
						notificationText.push(result[i].notification.text);
						notifications.push(result[i].notification);
					}
				}

				if(result[i].notification1 != null){
					result[i].notification1.text = result[i].remainingDays + result[i].notification1.text;
					result[i].notification1["count"] = 1;
					var notificationIndex = notificationText.indexOf(result[i].notification1.text);
					if(notificationIndex > -1){
						notifications[notificationIndex].count += 1;
					} else {
						notificationText.push(result[i].notification1.text);
						notifications.push(result[i].notification1)
					}
				}
			}
			// finalResult["notification"] = result;
			Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, notifications, res);
			
		}
	});
	
}
// ---------------------END---------------------

// ---------------------------------------------
// Update Appeal Data
// ---------------------------------------------
BLL.prototype.updateData = function(req, res) {
    DAL.updateData(req.body, null, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
        } else {
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_SUCCESS, null, res);
        }
	});
	
}
// ---------------------END---------------------

// ---------------------------------------------
// updateRequiredItemsPaper
// ---------------------------------------------
BLL.prototype.updateRequiredItemsPaper = function(req, res) {
	var data = req.body;
	for(var j = 0; j < data.length; j++){
		for(var i = 0; i < data[j].properties.requiredItems.length; i++){
			data[j].properties[i+"req"] = ["item",data[j].properties.requiredItems[i].name,data[j].properties.requiredItems[i].value];

		}
	
		for(var i = 0; i < data[j].properties.dataFields.length; i++){
			data[j].properties[i+"fields"] = ["field",data[j].properties.dataFields[i].name,data[j].properties.dataFields[i].value]
		}
	
		delete data[j].properties.requiredItems;
		delete data[j].properties.dataFields;
		delete data[j].properties.notification;
	}
	DAL.updateData(data[0].properties, data[0]._id, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.UPDATE_SUCCESS, null, res);
        }
	});
	
}
// ---------------------END---------------------

// ---------------------------------------------
// executeSignature
// ---------------------------------------------
BLL.prototype.executeSignature = function(req, res) {
	var userId = req.user[0].userId;
    DAL.executeSignature(userId, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
			if(result[0].pin == req.body.pin){
				for(var i = 0; i < req.body.data.length; i++){
					req.body.data[i].properties.button = false;
					req.body.data[i].properties.buttonText = "";
					req.body.data[i].properties.message = "Signature executed successfully.";
					req.body.data[i].properties.dropdown = false;
					req.body.data[i].properties.status = "Done";
					
				}

				DAL.updateData(req.body.data, null, function(error, result) {
					if (error) {
						console.log(error);
						error.userName = loginUserName;
						ErrorLogDAL.addErrorLog(error);
						Response.sendResponse(false, Response.REPLY_MSG.PIN_FAILED, null, res);
					} else {
						Response.sendResponse(true, Response.REPLY_MSG.PIN_SUCCESS, result, res);
					}
				});
			} else {
				Response.sendResponse(false, Response.REPLY_MSG.PIN_FAILED, result, res);
			}

			
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// get Property timeline data
// ---------------------------------------------
BLL.prototype.getPropertyTimelineData = function(req, res) {
	var year = (new Date()).getFullYear();
	var userId = req.user[0].userId;
	
    DAL.getPropertyTimelineData(userId, req.body.appealYear, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
			// res.send(result);
			var finalResult = {
				jurisdictionsNames: [],
				propertyIds: [],
				jurisdictions: []
			};

			async.forEachOf(result, function (value, i, callbackMain) {
				if(value.event == null){
					callbackMain();
				} else {
					if(value.event.properties.type == 1){
						var tempEvent = [];
						var started = true;
						var indexes = [[],[]];
						for(var k = 0; k < value.subEvent.length; k++){
							tempEvent[value.subEvent[k].properties.order - 1] = value.subEvent[k];
						}
						value.subEvent = tempEvent;
						if(value.event.properties.status != "In Progress" && value.event.properties.status != "Done"){
							var startDate = calculateRemainingDays(value.event.properties.startDate);
							if(startDate <= 0){
								value.event.properties.status = "In Progress";
								value.event.properties.message = "Deadline: "+ value.event.properties.deadline;
								value.event.properties.warning = "Complete required information.";
								updateData(value.event.properties, value.event._id, null);
							} else {
								value.event.properties.message = "Start date: "+ value.event.properties.startDate;
								started = false;
								createEventsJson(value, finalResult, function(){
									callbackMain();
								});
							}
						}

						if(started){
							async.forEachOfSeries(value.subEvent, function (subValue, j, callbackSubMain) {
								var isComplete = true;
								if(!(subValue == undefined)){
									if(subValue.properties.type == "00"){
										indexes[0][0] = j;
										checkIEFormStatus(subValue.properties, value.jurisdiction, 
														value.event.properties.deadline, subValue._id, function(error, formStatus){
											if(error){
												callbackSubMain(error);
											} else {
												subValue.properties = formStatus;
												callbackSubMain();
											}
										});
									} else if(subValue.properties.type == "01"){
										indexes[0][1] = j;
										checkRequiredItemsPaper(subValue.properties, value.propertyId, 
															subValue._id, value.event.properties.deadline, value.jurisdiction, userId,
															function(error, requiredItems){
											if(error){
												callbackSubMain(error);
											} else {
												subValue.properties = requiredItems;
												if(subValue.properties.status != "Done"){
													isComplete = false;
												}
												callbackSubMain();
											} 
										});
									} else if(subValue.properties.type == "02"){
										indexes[0][2] = j;
										var ieFormStatus = validateValueAtIndexes(value.subEvent[indexes[0][0]], "Done");
										var reqItemsStatus = validateValueAtIndexes(value.subEvent[indexes[0][1]], "Done");
										checkReivewStatusPaper(ieFormStatus, reqItemsStatus, 
											subValue.properties, subValue._id, function(error, reviewStatus){
											if(error){
												callbackSubMain(error);
											} else {
												subValue.properties = reviewStatus;
												if(subValue.properties.status != "Done"){
													isComplete = false;
												}
												callbackSubMain();
											}
										});
									} else if(subValue.properties.type == "03"){
										indexes[0][3] = j;
										var ieFormStatus = validateValueAtIndexes(value.subEvent[indexes[0][0]], "Done");
										var reqItemsStatus = validateValueAtIndexes(value.subEvent[indexes[0][1]], "Done");
										var reviewStatus = validateValueAtIndexes(value.subEvent[indexes[0][2]], true);
										
										checkSignatureStatusPaper(reviewStatus, ieFormStatus, reqItemsStatus, subValue.properties,
											subValue._id, function(error, signatureStatus){
											if(error){
												callbackSubMain(error);
											} else {
												subValue.properties = signatureStatus;
												if(subValue.properties.status != "Done"){
													isComplete = false;
												}
												callbackSubMain();
											}
										});
									} else if(subValue.properties.type == "04"){
										indexes[0][4] = j;
										var ieFormStatus = validateValueAtIndexes(value.subEvent[indexes[0][0]], "Done");
										var reqItemsStatus = validateValueAtIndexes(value.subEvent[indexes[0][1]], "Done");
										var reviewStatus = validateValueAtIndexes(value.subEvent[indexes[0][2]], true);
										var signatureStatus = validateValueAtIndexes(value.subEvent[indexes[0][3]], "Done");
										checkSubmissionStatusPaper(reviewStatus, ieFormStatus,reqItemsStatus, 
											signatureStatus, subValue.properties, subValue._id, function(error, submissionStatus){
											if(error){
												callbackSubMain(error);
											} else {
												subValue.properties = submissionStatus;
												if(subValue.properties.status != "Done"){
													isComplete = false;
												}
												callbackSubMain();
											}
										});
									} else if(subValue.properties.type == "10"){
										indexes[1][0] = j;
										checkRequiredItems(subValue.properties, value.propertyId, 
														subValue._id, value.event.properties.deadline, 
														value.jurisdiction, userId, function(error, requiredItems){
											if(error){
												callbackSubMain(error);
											} else {
												subValue.properties = requiredItems;
												if(subValue.properties.status != "Done"){
													isComplete = false;
												}
												callbackSubMain();
											} 
										});
									} else if(subValue.properties.type == "11"){
										indexes[1][1] = j;
										checkReivewStatus(value.subEvent[indexes[1][0]].properties.status, 
														subValue.properties, subValue._id, function(error, reviewStatus){
											if(error){
												callbackSubMain(error);
											} else {
												subValue.properties = reviewStatus;
												if(subValue.properties.reviewResult != true){
													isComplete = false;
												}
												callbackSubMain();
											}
										});
									} else if(subValue.properties.type == "12"){
										indexes[1][2] = j;
										var reqItemsStatus = validateValueAtIndexes(value.subEvent[indexes[1][0]], "Done");
										var reviewStatus = validateValueAtIndexes(value.subEvent[indexes[1][1]], true);
										checkSignatureStatus(reqItemsStatus, reviewStatus,
											subValue.properties, subValue._id, function(error, signatureStatus){
											if(error){
												callbackSubMain(error);
											} else {
												subValue.properties = signatureStatus;
												if(subValue.properties.status != "Done"){
													isComplete = false;
												}
												callbackSubMain();
											}
										});
									} else if(subValue.properties.type == "13"){
										indexes[1][3] = j;
										var signatureStatus = validateValueAtIndexes(value.subEvent[indexes[1][2]], "Done");
										checkSubmissionStatus(signatureStatus, 
											subValue.properties, subValue._id, function(error, submissionStatus){
											if(error){
												callbackSubMain(error);
											} else {
												subValue.properties = submissionStatus;
												if(subValue.properties.status != "Done"){
													isComplete = false;
												}
												callbackSubMain();
											}
										});
									}
								} else {
									callbackSubMain();
								}
							}, function (err) {
								var deadline = value.event.properties.deadline;
								if(value.event.properties.paradigm == "machine"){
									try {
										if(value.subEvent[indexes[1][3]].properties.status == "In Progress" 
										&& value.event.properties.message != value.subEvent[indexes[1][3]].properties.message){
											value.event.properties.status = "In Progress";
											value.event.properties.warning = "";
											value.event.properties.message = "Data will be released to assessing jurisdiction on this date: " + deadline;
											updateData(value.event.properties, value.event._id, null);
										} else if(value.subEvent[indexes[1][3]].properties.status == "Done" 
										&& value.event.properties.status != "Done"){
											value.event.properties.status = "Done";
											value.event.properties.message = "Data was released to assessing jurisdiction on this date: " + deadline;
											value.event.properties.warning = "";
											updateData(value.event.properties, value.event._id, null);
											
										} else if(value.subEvent[indexes[1][0]].properties.status == "In Progress" &&
											value.event.properties.warning != "Complete required information."){
											value.event.properties.message = "Deadline: " + deadline;
											value.event.properties.warning = "Complete required information.";
											updateData(value.event.properties, value.event._id, null);
											
										} else if(value.subEvent[indexes[1][2]].properties.status == "In Progress" &&
											value.event.properties.warning != "Execute Signature."){
											value.event.properties.warning = "Execute Signature.";
											updateData(value.event.properties, value.event._id, null);
										}
									} catch (err){

									}
									
								} else if(value.event.properties.paradigm == "paper"){
									try{
										if(value.subEvent[indexes[0][4]].properties.status == "Done" &&
										value.event.properties.status != "Done"){
											value.event.properties.status = "Done";
											value.event.properties.warning = "";
											value.event.properties.message = "Income expense survey submitted successfully.";
											updateData(value.event.properties, value.event._id, null);
										} else if(value.subEvent[indexes[0][4]].properties.status == "In Progress" &&
											value.event.properties.warning != "Submit income expense survey package"){
											value.event.properties.status = "In Progress";
											value.event.properties.warning = "Submit income expense survey package";
											updateData(value.event.properties, value.event._id, null);
										} else if(value.subEvent[indexes[0][3]].properties.status == "In Progress" &&
											value.event.properties.warning != "Execute Signature"){
											value.event.properties.status = "In Progress";
											value.event.properties.warning = "Execute Signature";
											updateData(value.event.properties, value.event._id, null);
										} else if(value.subEvent[indexes[0][0]].properties.status != "Done" ||
										value.subEvent[indexes[0][1]].properties.status != "Done"){
											value.event.properties.status = "In Progress";
											value.event.properties.warning = "";
											if(value.subEvent[indexes[0][0]].properties.status != "Done"){
												value.event.properties.warning = "Complete income expense survey form. ";											
											}

											if(value.subEvent[indexes[0][1]].properties.status != "Done"){
												value.event.properties.warning += "Complete required items. ";											
											}

											updateData(value.event.properties, value.event._id, null);
										}
									} catch (err) {

									}
									
								}

								// if(value.event.properties.status != "Done"){
								// 	var notification = {
								// 		heading: value.jurisdiction + " Properties",
								// 		text: "Need to complete income expense survey package for " +value.jurisdiction
								// 				+ " properties before "+value.event.properties.deadline+".",
								// 		type: "warning",
								// 		remainingDays: ""
								// 	}
	
								// 	generateNotification(notification, value.event._id);
								// }

								createEventsJson(value, finalResult, function(){
									callbackMain();
								});
							});
						}
					} else {
						createEventsJson(value, finalResult, function(){
							callbackMain();
						});
					}
				}
			}, function (err) {
				if (err) console.error(err.message);
				DAL.getNotification(userId, function(error, result) {
					if (error) {
						console.log(error);
						error.userName = loginUserName;
						ErrorLogDAL.addErrorLog(error);
					} else {
						var notificationText = [];
						var notifications = [];
						
						for(var i = 0; i < result.length; i++){
							if(result[i].notification != null){
								var notificationIndex = notificationText.indexOf(result[i].notification.text);
								if(notificationIndex < 0){
									notificationText.push(result[i].notification.text);
									notifications.push(result[i].notification);
								} 
							}

							if(result[i].notification1 != null){
								// result[i].remainingDays = 1;
								if(result[i].remainingDays == 1){
									result[i].notification1.text = result[i].notification1.text.replace("days", "day");
								}

								result[i].notification1.text = result[i].remainingDays + result[i].notification1.text;
								result[i].notification1["count"] = 1;
								var notificationIndex = notificationText.indexOf(result[i].notification1.text);
								if(notificationIndex > -1){
									notifications[notificationIndex].count += 1;
								} else {
									notificationText.push(result[i].notification1.text);
									notifications.push(result[i].notification1)
								}
							}
						}
						finalResult["notification"] = notifications;
						Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
						
					}
				});
				
			});
        }
	});
}
// ---------------------END---------------------

function checkRequiredItems(subValue, propertyId, itemId, deadline, jurisdiction, userId, cb){
	var requiredItems = subValue;
	async.parallel([
		function(callback) {
			IEDAL.getPropertyIE(propertyId, function(error, result) {
				if (error) {
					console.log(error);
					error.userName = loginUserName;
					ErrorLogDAL.addErrorLog(error);
					callback(error, null);
				} else {
					callback(null,result);
				}
			});
		},
		function(callback) {
			RRDAL.getPropertyRR([propertyId], function(error, result) {
				if (error) {
					console.log(error);
					error.userName = loginUserName;
					ErrorLogDAL.addErrorLog(error);
					callback(error, null);
				} else {
					callback(null,result);
				}
			});
		}
	],
	// optional callback
	function(error, results) {

		if (error) {
			console.log(error);
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			return requiredItems; 
		} else {
			var totalFields = 0;
			var remainingFields = 0;
			var totalItems = 0;
			var remainingItems = 0;
			var message = "";
			var notification = {
				heading: "Complete Required Information",
				text: "",
				type: "warning",
				remainingDays: 0
			}
			var alert = "";

			for(var element in requiredItems){
				if(Array.isArray(requiredItems[element])){
					if(requiredItems[element][4] == "IE"){
						totalItems++;
						if(requiredItems[element][2] == "false"){
							for(var j = 0;j < results[0].length; j++){
								if(results[0][j].year.split(",")[1] == requiredItems[element][3]){
									requiredItems[element][2] = "true";
									break;
								}
							}
							if(requiredItems[element][2] == "false"){
								remainingItems++;
							}
						}

						if(requiredItems[element[2]] == "false"){
							remainingItems++;
						}
					} else if(requiredItems[element][4] == "RR"){
						totalItems++;
						if(requiredItems[element][2] == "false"){
							for(var j = 0;j < results[1].length; j++){
								var asOfDate = new Date(requiredItems[element][3]).getTime();
								if(results[1][j].asOfYear.split(",")[1] == asOfDate){
									requiredItems[element][2] = "true";
									break;
								}
							}
							
							if(requiredItems[element][2] == "false"){
								remainingItems++;
							}
						}
					} else if(requiredItems[element][0] == "field"){
						totalFields++;
						if(requiredItems[element][2] == ""){
							remainingFields++;
						}
					}
				}
			}
			
			
			if(remainingItems == 0 && remainingFields == 0){
				requiredItems.message = "All items complete.";
				requiredItems.button = true;
				requiredItems.buttonText = "Details";
				requiredItems.warning = "";
				requiredItems.status = "Done";
				requiredItems.flag = true;

			} else {
				var daysRemaining = new dateDiff(new Date(deadline), new Date());
				daysRemaining = parseInt(daysRemaining.days()) + 1;
				if(daysRemaining < 30){
					notification.remainingDays = daysRemaining;
					if(daysRemaining > 0){
						notification.text = " days remaining before submission of Income Expense Survey package for "+jurisdiction+" properties. Please complete the required information.";
						message += daysRemaining+ " days remaining before submission. "
						alert += daysRemaining+ " days remaining before submission of Income Expense Survey package for "+jurisdiction+" properties. Please complete the required information.";
					} else if (daysRemaining <= 0 ){
						notification.text = "Income Expense Survey submission overdue by || days for "+jurisdiction+" properties. Please complete the required information.";
						message += "Income Expense Survey submission overdue by " +parseInt(daysRemaining)*(-1)+ " days. "
						alert += "Income Expense Survey submission overdue by " +daysRemaining+ " days for "+jurisdiction+" properties. Please complete the required information.";
					}
					
					if(remainingItems > 0){
						message += remainingItems + " of " + totalItems+ " items needed for submission."
					}
		
					requiredItems.warning = message;
					requiredItems.message = "";
					requiredItems.button = true;
					requiredItems.buttonText = "Details";
					requiredItems.status = "In Progress";
					requiredItems.flag = true;
	
					
				}
			}

			var copytobeUpdated = JSON.stringify(requiredItems);
			copytobeUpdated = JSON.parse(copytobeUpdated);
			
			
			// requiredItems['notification'] = notification;
			requiredItems["requiredItems"] = [];
			requiredItems["dataFields"] = [];

			for(var element in requiredItems){
				if(element == "requiredItems" || element == "dataFields"){
					continue;
				}
				if(Array.isArray(requiredItems[element])){
					if(requiredItems[element][0] == "field"){
						var tempItems = requiredItems[element][3].split("||");
						var temp = {
							name: requiredItems[element][1],
							value: requiredItems[element][2],
							source: tempItems[0],
							year: tempItems[1],
							type: tempItems[2]
						}

						requiredItems.dataFields.push(temp);
						delete requiredItems[element];
					} else {
						var temp = {
							name: requiredItems[element][1],
							value: requiredItems[element][2],
							type: requiredItems[element][4],
							year: requiredItems[element][3]
						}
						requiredItems.requiredItems.push(temp);
						delete requiredItems[element];
					}
				}
			}

			requiredItems.remainingItems = sortByKey(requiredItems.requiredItems, 'year');
			requiredItems.requiredItems = sortByKey(requiredItems.requiredItems, 'name');
			requiredItems.dataFields = sortByKey(requiredItems.dataFields, 'year');
			// requiredItems.dataFields = sortByKey(requiredItems.dataFields, 'name');
			var reqItemsLength = requiredItems.requiredItems.length;
			for(var i = 0; i < reqItemsLength; i++){
				if(requiredItems.requiredItems[i].value == "true"){
					requiredItems.requiredItems.push(requiredItems.requiredItems[i]);
					requiredItems.requiredItems.splice(i, 1);
					i -= 1;
					reqItemsLength -= 1;
				}
			}

			try{
				updateData(copytobeUpdated, itemId, function(){
					if(requiredItems.status != "Done"){
						generateNotification(notification, itemId, function(){
							cb(null, requiredItems);
						});
						
						generateAlert(alert, userId, jurisdiction);
					} else {
						cb(null, requiredItems);
					}
				});
			} catch (err){
				cb(null, requiredItems);
			}
			
		}
	});
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

function checkReivewStatus(requiredItemsStatus, subValue, id, cb){
	var reviewStatus = subValue;
	if(requiredItemsStatus != "Done" && subValue.flag == true){
		reviewStatus.flag = false;
		reviewStatus.status = "Not Started";
		updateData(reviewStatus, id, null);
	} else if(reviewStatus.status == "Done"){
		console.log("dummy console. will find something better soon. ");
	} else if(requiredItemsStatus == "Done" && reviewStatus.flag == false){
		reviewStatus.flag = true;
		// reviewStatus.status = "In Progress";
		updateData(reviewStatus, id, null);
	}

	cb(null,reviewStatus);
}

function checkSignatureStatus(requiredItemsStatus, reviewStatus, subValue, id, cb){
	var signatureStatus = subValue;
	if((requiredItemsStatus != "Done" || reviewStatus == false) &&
		(signatureStatus.flag == true && signatureStatus.status != "Not Started")){
		signatureStatus.flag = false;
		signatureStatus.status = "Not Started";
		signatureStatus.message = "";
		updateData(signatureStatus, id, null);
	} else if(signatureStatus.status == "Done"){
		console.log("dummy console. will find something better soon. ");
	} else if((requiredItemsStatus == "Done" && reviewStatus == true) && 
		(signatureStatus.flag == false && signatureStatus.status != "In Progress")){
		signatureStatus.flag = true;
		signatureStatus.status = "In Progress";
		updateData(signatureStatus, id, null);
	}
	cb(null,signatureStatus);
}


function checkSubmissionStatus(signatureStatus, subValue, id, cb){
	var submissionStatus = subValue;
	if(signatureStatus != "Done" && submissionStatus.flag == true){
		submissionStatus.flag = false;
		submissionStatus.status = "Not Started";
		submissionStatus.message = "";
		updateData(submissionStatus, id, null);
	} else if(submissionStatus.status == "Done"){
		console.log("dummy console. will find something better soon. ");
	} else if(signatureStatus == "Done" && submissionStatus.flag == false){
		submissionStatus.flag = true;
		submissionStatus.status = "In Progress";
		submissionStatus.message = "Data will be released to assessing jurisdiction on " + submissionStatus.deadline;
		updateData(submissionStatus, id, null);
		
	}
	cb(null,submissionStatus);
}

function generateNotification(notification, id, cb){
	DAL.generateNotification(notification, id, function(error, result) {
		if (error) {
			console.log(error);
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
		} 

		cb();
	});
}

function calculateRemainingDays(deadline){
	var daysRemaining = new dateDiff(new Date(deadline), new Date());
	daysRemaining = parseFloat(daysRemaining.days());

	return daysRemaining + 1;
}

function checkRequiredItemsPaper(requiredItems, propertyId, itemId, deadline, jurisdiction, userId, cb){
	var totalItems = 0;
	var remainingItems = 0;
	var totalFields = 0;
	var remainingFields = 0;
	var remainingDays = parseInt(calculateRemainingDays(deadline));
	var warning = "";
	var notification = {
		heading: "Complete Required Information",
		text: "",
		type: "warning",
		remainingDays: 0
	};
	
	var alert = "";
	for(var element in requiredItems){
		if(Array.isArray(requiredItems[element])){
			if(requiredItems[element][0] == "item"){
				totalItems++;
				if(requiredItems[element][2] == "false"){
					remainingItems++;
				}
			}
			// } else if(requiredItems[element][0] == "field"){
			// 	totalFields++;
			// 	if(requiredItems[element][2] == "false"){
			// 		remainingFields++;
			// 	}
			// }
		}
	}

	if(remainingItems == 0){
		requiredItems.message = "All items are complete.",
		requiredItems.status = "Done";
	} else {
		requiredItems.message = "Complete required items in checklist.";
		requiredItems.status = "In Progress";
		notification.remainingDays = remainingDays;
		if(remainingDays < 30 && remainingDays > 0){
			notification.text = " days remaining before submission of Income Expense Survey package for "+jurisdiction+" properties. Please complete the required information.";
			// notification.remainingDays = daysRemaining;
			warning += remainingDays+ " days remaining before submission. ";
			alert += remainingDays+ " days remaining before submission of Income Expense Survey package for "+jurisdiction+" properties. Please complete the required information.";
		} else if (remainingDays <= 0 ){
			notification.text = "Income Expense Survey submission overdue by || days for "+jurisdiction+" properties. Please complete the required information.";
			// notification.remainingDays = daysRemaining;
			warning += "Income Expense Survey submission overdue by " +parseInt(remainingDays)*(-1)+ " days. ";
			alert += "Income Expense Survey submission overdue by "+remainingDays+" days for "+jurisdiction+" properties. Please complete the required information.";
		}

		if(remainingItems > 0){
			warning += remainingItems+ " of "+totalItems+ " items remaining. "
		} 

		// if(remainingFields > 0){
		// 	warning += remainingFields+ " of "+totalFields+ " fields remaining. "
		// }
		// requiredItems['notification'] = notification;
		warning += "Please complete the required information";
	}

	requiredItems.warning = warning;
	
	var copytobeUpdated = JSON.stringify(requiredItems);
	copytobeUpdated = JSON.parse(copytobeUpdated);
	// updateData(requiredItems, itemId);

	requiredItems["requiredItems"] = [];
	requiredItems["dataFields"] = [];
	for(var element in requiredItems){
		if(element == "requiredItems" || element == "dataFields"){
			continue;
		}
		if(Array.isArray(requiredItems[element])){
			if(requiredItems[element][0] == "field"){
				if(requiredItems[element][2] == "false"){
					status = false;													
				}

				var temp = {
					name: requiredItems[element][1],
					value: requiredItems[element][2]
				}

				requiredItems.dataFields.push(temp);
				delete requiredItems[element];
			} else {
				if(requiredItems[element][2] == "false"){
					status = false;													
				}

				var temp = {
					name: requiredItems[element][1],
					value: requiredItems[element][2],
				}
				requiredItems.requiredItems.push(temp);
				delete requiredItems[element];
			}
		}
	}

	try{
		updateData(copytobeUpdated, itemId, function(){
			if(requiredItems.status != "Done"){
				generateNotification(notification, itemId, function(){
					cb(null, requiredItems);
				});

				generateAlert(alert, userId, jurisdiction);
			} else {
				cb(null, requiredItems);
			}
		});
	} catch (err){
		cb(null, requiredItems);
	}
	
}

function checkReivewStatusPaper(ieForm, requiredItems, subValue, id, cb){
	var reviewStatus = subValue;
	if(requiredItems != "Done" || ieForm != "Done"){
		reviewStatus.flag = false;
		reviewStatus.status = "Not Started";
		reviewStatus.message = ""
		reviewStatus.toggle = false;
		reviewStatus.toggleValue = false;
	} else if (reviewStatus.status == "Done"){
		console.log("dummy console. will find something better soon. ");
	} else if(requiredItems == "Done" && ieForm == "Done"){
		reviewStatus.flag = true;
		// reviewStatus.status = "In Progress";
		reviewStatus.message = "Was review successful?"
		reviewStatus.toggle = true;
		reviewStatus.toggleValue = false;
	} 
	updateData(reviewStatus, id);
	cb(null,reviewStatus);
}

function checkSubmissionStatusPaper(reviewStatus, ieForm, requiredItemsStatus, 
signatureStatus, subValue, id, cb){
	var submissionStatus = subValue;
	if(reviewStatus == false 
	|| requiredItemsStatus != "Done" 
	|| ieForm != "Done"
	|| signatureStatus != "Done"){
		submissionStatus.flag = false;
		submissionStatus.status = "Not Started",
		submissionStatus.toggle = false;
		submissionStatus.toggleValue = false;
		submissionStatus.message = "";
	} else if(submissionStatus.status == "Done"){
		console.log("dummy console. will find something better soon. ");
	} else if(reviewStatus != false && requiredItemsStatus == "Done" && ieForm == "Done" && signatureStatus == "Done"){
		submissionStatus.flag = true;
		submissionStatus.status = "In Progress",
		submissionStatus.toggle = true;
		submissionStatus.toggleValue = false;
		submissionStatus.message = "Have you submitted the income expense survey package?"
	}

	updateData(submissionStatus, id);
	cb(null,submissionStatus);
}

function checkSignatureStatusPaper(reviewStatus, ieForm, requiredItemsStatus, subValue, id, cb){
	var signatureStatus = subValue;
	if(reviewStatus == false || requiredItemsStatus != "Done" || ieForm != "Done"){
		signatureStatus.flag = false;
		signatureStatus.status = "Not Started",
		signatureStatus.toggle = false;
		signatureStatus.toggleValue = false;
		signatureStatus.message = "";
	} else if(signatureStatus.status == "Done"){
		console.log("dummy console. will find something better soon. ");
	} else if(reviewStatus != false && requiredItemsStatus == "Done" && ieForm == "Done"){
		signatureStatus.flag = true;
		signatureStatus.status = "In Progress",
		signatureStatus.toggle = true;
		signatureStatus.toggleValue = false;
		signatureStatus.message = "Have you signed the income expense survey package?"
	}

	updateData(signatureStatus, id);
	cb(null,signatureStatus);
}

function checkIEFormStatus(subValue, jurisdiction, deadline, id, cb){
	var status = subValue;
	var remainingDays = parseInt(calculateRemainingDays(deadline));
	if(remainingDays <= 0){
		remainingDays *= -1;
	}

	if(status.notificationGenerated == undefined){
		status["notificationGenerated"] = false;
	}

	if(status.status != "Done"){
		status.notificationGenerated = true;
		status.status = "In Progress";
		var notification = {
			heading: "Fill Income Expense Survey form",
			text:  " days remaining before submission. Fill income expense survey forms for properties of "+jurisdiction+".",
			type: "warning",
			remainingDays: remainingDays
		}

		generateNotification(notification, id, function(){
			cb(null, status);
		});
		// status["notification"] = notification;
	} else {
		cb(null, status);
	}

	
}

function createEventsJson(value, finalResult, cb){
	var event = {
		eventId: value.event._id,
		properties: value.event.properties,
		subEvents: value.subEvent,
		additionalItems: value.additionalItems
	};
	
	var property = {
		id: value.propertyId,
		name: value.propertyName,
		address: value.address,
		ownerName: value.ownerName,
		taxAccountNo: value.taxAccountNo.replace(/,/g, ""),
		zipCode: (value.zipCode + "").replace(/,/g, ""),
		streetAddress: value.streetAddress,
		events: []
	}

	property.events[event.properties.order - 1] = event;
	
	var jurisdiction = {
		name: value.jurisdiction,
		properties: [property]		
	}

	var jurisdictionIndex = finalResult.jurisdictionsNames.indexOf(value.jurisdiction);
	if(jurisdictionIndex > -1){
		var propertyIndex = finalResult.propertyIds[jurisdictionIndex].indexOf(value.propertyId);
		if(propertyIndex > -1){
			finalResult.jurisdictions[jurisdictionIndex].properties[propertyIndex].events[event.properties.order - 1] = event;
		} else {
			finalResult.jurisdictions[jurisdictionIndex].properties.push(property);
			finalResult.propertyIds[jurisdictionIndex].push(value.propertyId);
		}
	} else {
		finalResult.jurisdictionsNames.push(value.jurisdiction);
		finalResult.propertyIds[finalResult.jurisdictionsNames.length -1] = [value.propertyId];
		finalResult.jurisdictions.push(jurisdiction);
	}
	cb();
}

function updateData(data, id, cb){
	DAL.updateData(data, id, function(error, result) {
		if (error) {
			console.log(error);
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
		}
		
		if(cb != null){
			cb();
		}
	});
}

function createTimelineWithJson(timelineData){
	var timeline = JSON.stringify(timelineData);
	timeline = JSON.parse(timeline);
	if(timeline.ieSurvey.main.obligatory == false){
		delete timeline.ieSurvey;
	} else {
		if(timeline.ieSurvey.main.form == true){
			var deadline = timeline.ieSurvey.main.deadline;
			if(timeline.ieSurvey.main.formObtain == "machine"){
				timeline.ieSurvey["completeRequiredInformation"] = jurisdictionTimeline.paradigms.machine.requiredItems;
				timeline.ieSurvey.completeRequiredInformation.deadline = deadline; 
			} else if(timeline.ieSurvey.main.formObtain == "paper"){
				timeline.ieSurvey["completeIEform"] = jurisdictionTimeline.paradigms.paper.form;
				timeline.ieSurvey.completeIEform.deadline = deadline;
			}

			if(timeline.ieSurvey.main.requiredItems == true){
				if(timeline.ieSurvey.main.requiredItemsForm == "machine"){
					timeline.ieSurvey["completeRequiredInformation"] = createRequiredItemsJson(jurisdictionTimeline.paradigms.machine.requiredItems, 
																		timeline.ieSurvey.main.requiredItemsList, "machine");
					timeline.ieSurvey.completeRequiredInformation.deadline = deadline;
				} else if(timeline.ieSurvey.main.requiredItemsForm == "paper"){
					timeline.ieSurvey["completeRequiredItems"] = createRequiredItemsJson(jurisdictionTimeline.paradigms.paper.requiredItems,
																timeline.ieSurvey.main.requiredItemsList, "paper");
					timeline.ieSurvey.completeRequiredItems.deadline = deadline;
				}
			}

			if(timeline.ieSurvey.main.paradigm == "machine"){
				timeline.ieSurvey["review"] = jurisdictionTimeline.paradigms.machine.review;
				timeline.ieSurvey.review.deadline = deadline;
			} else if(timeline.ieSurvey.main.paradigm == "paper"){
				timeline.ieSurvey["review"] = jurisdictionTimeline.paradigms.paper.review;
				timeline.ieSurvey.review.deadline = deadline;
			}

			if(timeline.ieSurvey.main.signature == true){
				if(timeline.ieSurvey.main.paradigm == "machine"){
					timeline.ieSurvey["signature"] = jurisdictionTimeline.paradigms.machine.signature;
					timeline.ieSurvey.signature.deadline = deadline;
				} else if(timeline.ieSurvey.main.paradigm == "paper"){
					timeline.ieSurvey["signature"] = jurisdictionTimeline.paradigms.paper.signature;
					timeline.ieSurvey.signature.deadline = deadline;
				}
			}

			if(timeline.ieSurvey.main.submission == true){
				if(timeline.ieSurvey.main.submissionType == "machine"){
					timeline.ieSurvey["submission"] = jurisdictionTimeline.paradigms.machine.submission;
					timeline.ieSurvey.submission.deadline = deadline;
				} else if(timeline.ieSurvey.main.submissionType == "paper"){
					timeline.ieSurvey["submission"] = jurisdictionTimeline.paradigms.paper.submission;
					timeline.ieSurvey.submission.deadline = deadline;
				}
			}
		}
	}
	return timeline;
} 

function createRequiredItemsJson(event, itemsList, paradigm){
	if(paradigm == "machine"){
		for(var i = 0; i < itemsList.length; i++){
			var tempItem = itemsList[i];
			try{
				var temp = tempItem.split("||");
			} catch (error){
				console.log(error);
			} 
			
			var item = ["item", temp[0], "false", temp[1], temp[2]];
			event["item"+i] = item;
		}
	} else if(paradigm == "paper"){
		for(var i = 0; i < itemsList.length; i++){
			var tempItem = itemsList[i];
			try{
				var temp = tempItem.split("||");
			} catch (error){
				console.log(error);
			} 
			var item = ["item", temp[0], "false"];
			event["item"+i] = item;
		}
	}
	return event;
}

function validateValueAtIndexes(indexes, value){
	var status = "";
	try{
		if(value == true){
			status = indexes.properties.reviewResult;
		} else {
			status = indexes.properties.status;
		}
	} catch (err){
		status = value;
	}

	return status;
}

function generateAlert(alert, userId, jurisdiction){
	var dateTime = new Date().toISOString();
	var finalAlert = {
		message: alert,
		dateTime: dateTime,
		jurisdiction: jurisdiction
	};
	
	ALERT.addAlert(finalAlert, userId);
};