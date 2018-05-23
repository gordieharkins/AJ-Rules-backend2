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

var IEDAL = new IEDAL();
var RRDAL = new RRDAL();
var DAL = new AppealDAL();
var marylandTimeline = {
	ieSurvey:{
		main: {
			name: "Income and Expense Survey",
			obligatory: true,
			form: true,
			requiredItems: ["IE 2015","IE 2016", "IE 2017", "RR as of January 1, 2017", "RR as of January 1, 2018"],
			formObtain: "AOTC",
			signature: "PIN",
			tranmitForm: "AOTC",
			transmitPackage: "AOTC",
			paradigm: "AOTC",
			deadline: "6/14/2018",
			status: "Not Started", 
			message: "",
			warning: "",
			order: 1
		},
		event1:{
			name: "Complete Required Information",
			status: "Not Started",
			message: "",
			warning: "",
			flag: true,
			mandatory: true,
			buttonText: "Details",
			button: true,
			order: 1,
			a: ["item","IE 2015", "false", "2015", "IE"],
			b: ["item","IE 2016", "false", "2016", "IE"],
			c: ["item","IE 2017", "false", "2017", "IE"],
			d: ["item","RR as of January 1, 2017", "false", "January 1, 2017", "RR"],
			e: ["item","RR as of January 1, 2018", "false", "January 1, 2018", "RR"],
			f: ["field","A", "abc", "IE 2015"],
			g: ["field","B", "1", "IE 2015"],
			h: ["field","C", "2", "IE 2016"],
			i: ["field","D", "3", "IE 2017"],
			j: ["field","E", "4", "RR as of January 1, 2017"],
			k: ["field","F", "5", "RR as of January 1, 2018"]
		},
		// event2: {
		// 	name: "Complete IE Survey Form",
		// 	status: "Not Started",
		// 	message: "",
		// 	flag: true,
		// 	mandatory: true,
		// 	warning: true,
		// 	buttonText: "Details",
		// 	button: true,
		// 	a: ["A", "abc", "IE 2015"],
		// 	a: ["B", "1", "IE 2015"],
		// 	a: ["C", "2", "IE 2016"],
		// 	a: ["D", "3", "IE 2017"],
		// 	a: ["E", "4", "RR as of January 1, 2017"],
		// 	a: ["F", "5", "RR as of January 1, 2018"]
		// },

		event3: {
			name: "Review IE Survey Draft",
			status: "Not Started",
			message: "",
			flag: false,
			mandatory: false,
			buttonText: "Schedule Review",
			button: true,
			reviewResult:true,
			order: 2
		},

		event4: {
			name: "Submit IE Survey Data",
			status: "Not Started",
			message: "",
			flag: false,
			buttonText: "Execute Signature",
			button: true,
			mandatory: true,
			// state: "", 
			order: 3
		}


	},
	obtainAJRecord:{
		main: {
			name: "Obtain AJ Valuation Record",
			status: "Not Started",
			startDate: "06/15/2018",
			deadline: "08/15/2018",
			message: "",
			warning: "",
			order: 2
		}
	},
	appealMerit:{
		main: {
			name: "Determine Appeal Merit/Produce Evidence",
			status: "Not Started",
			startDate: "06/15/2018",
			deadline: "08/15/2018",
			message: "",
			warning: "",
			order: 3
		}
	},
	appealDecision:{
		main: {
			name: "Decision to Appeal",
			status: "Not Started",
			startDate: "06/15/2018",
			deadline: "08/15/2018",
			message: "",
			warning: "",
			order: 4
		}
	},
	appealPackage:{
		main: {
			name: "Prepare Appeal Package for Submission",
			status: "Not Started",
			startDate: "06/15/2018",
			deadline: "08/15/2018",
			message: "",
			warning: "",
			order: 5
		}
	},
	appealSubmission:{
		main: {
			name: "Appeal Submission",
			status: "Not Started",
			startDate: "06/15/2018",
			deadline: "08/15/2018",
			message: "",
			warning: "",
			order: 6
		}
	}
}

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
	// console.log("timeline: ",data);
	var year = (new Date()).getFullYear();
	// if(data.jurisdiction == "Maryland"){
	// 	var timeline
	// }
    DAL.addPropertyTimelineData(data, marylandTimeline, year, function(error, result) {
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
// ---------------------END---------------------


// ---------------------------------------------
// get Property timeline data
// ---------------------------------------------
BLL.prototype.getPropertyTimelineData = function(req, res) {
	var year = (new Date()).getFullYear();
	// var userId = req.user[0].userId;
	var userId = req.body.userId;
	
    DAL.getPropertyTimelineData(userId, req.body.appealYear, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
			// res.send(result);
			var finalResult = {
				jurisdictions: []
			};
			var jurisdictionsNames = [];
			var propertyIds = [];

			//
			
			// ?
			async.forEachOf(result, function (value, i, callbackMain) {
				if(value.event.properties.name == "Income and Expense Survey"){
					var tempSubEvent = {};
					var requireInformationIndex = null;
					var reviewIEDraftIndex = null;
					var submitIEDataIndex = null;
					var flag = false;
					var tempEvent = [];
					var isComplete = true;
					for(var k = 0; k < value.subEvent.length; k++){
						tempEvent[value.subEvent[k].properties.order - 1] = value.subEvent[k];
					}

					value.subEvent = tempEvent;
					async.forEachOf(value.subEvent, function (subValue, j, callbackSubMain) {
						if(subValue.properties.name == "Complete Required Information"){
							requireInformationIndex = j;
							checkRequiredItems(subValue.properties, value.propertyId, 
												subValue._id, value.event.properties.deadline, function(error, requiredItems){
								if(error){
									callbackSubMain(error);
								} else {
									subValue.properties = requiredItems;
									for(var element in subValue.properties){
										if(element == "requiredItems" || element == "dataFields"){
											continue;
										}
										if(Array.isArray(subValue.properties[element])){
											if(subValue.properties[element][0] == "field"){
												var temp = {
													name: subValue.properties[element][1],
													value: subValue.properties[element][2],
													source: subValue.properties[element][3]
												}

												subValue.properties.dataFields.push(temp);
												delete subValue.properties[element];
											} else {
												var temp = {
													name: subValue.properties[element][1],
													value: subValue.properties[element][2]
												}
												
												subValue.properties.requiredItems.push(temp);
												delete subValue.properties[element];
											}
										}
									}

									if(subValue.properties.notification != undefined){
										generateNotification(subValue.properties.notification, userId);
									}
									callbackSubMain();

									if(subValue.properties.status != "Done"){
										isComplete = false;
									}
								}
							});
						} else if(subValue.properties.name == "Review IE Survey Draft"){
							reviewIEDraftIndex = j;
							checkReivewStatus(value.subEvent[requireInformationIndex], subValue, function(error, reviewStatus){
								if(error){
									callbackSubMain(error);
								} else {
									subValue = reviewStatus;
									if(subValue.properties.status != "Done"){
										isComplete = false;
									}
									callbackSubMain();
								}
							});
						} else if(subValue.properties.name == "Submit IE Survey Data"){
							submitIEDataIndex = j;
							checkSubmissionStatus(value.subEvent[reviewIEDraftIndex], subValue, function(error, surveyData){
								if(error){
									callbackSubMain(error);
								} else {
									subValue = surveyData;
									if(subValue.properties.status != "Done"){
										isComplete = false;
									}
									callbackSubMain();
								}
							});
						}
					}, function (err) {
						if (err) console.error(err.message);
						//configs is now a map of JSON data
						// console.log("here;", finalResult.jurisdictions[0].properties[0].events);
						if(!isComplete){
							var notification = {
								heading: value.jurisdiction + " Properties",
								text: "Need to complete IE survey package for " +value.jurisdiction
										+ " properties before "+value.event.properties.deadline+".",
								type: "warning"
							}

							generateNotification(notification, userId);
						}
						var event = {
							eventId: value.event._id,
							properties: value.event.properties,
							subEvents: value.subEvent 
						};
						
						var property = {
							id: value.propertyId,
							name: value.propertyName,
							address: value.address,
							ownerName: value.ownerName,
							events: []
						}

						property.events[event.properties.order - 1] = event;
						
						var jurisdiction = {
							name: value.jurisdiction,
							properties: [property]		
						}

						// console.log("JurisdictionsNames: ",jurisdictionsNames);
						// console.log("Jurisdiction Name: ",value.jurisdiction);
						var jurisdictionIndex = jurisdictionsNames.indexOf(value.jurisdiction);
						// console.log("jurisdictionIndex: ",jurisdictionIndex);

						if(jurisdictionIndex > -1){
							var propertyIndex = propertyIds[jurisdictionIndex].indexOf(value.propertyId);
							if(propertyIndex > -1){
								finalResult.jurisdictions[jurisdictionIndex].properties[propertyIndex].events[event.properties.order - 1] = event;
							} else {
								finalResult.jurisdictions[jurisdictionIndex].properties.push(property);
								propertyIds[jurisdictionIndex].push(value.propertyId);
							}
						} else {
							jurisdictionsNames.push(value.jurisdiction);
							propertyIds[jurisdictionsNames.length -1] = [value.propertyId];
							finalResult.jurisdictions.push(jurisdiction);
						}
						// console.log("here1;", finalResult.jurisdictions[0].properties[0].events);
						callbackMain();
						
					});
				} else {

					// console.log("here;", finalResult.jurisdictions[0].properties[0].events);
					var event = {
						eventId: value.event._id,
						properties: value.event.properties,
						subEvents: value.subEvent 
					};
					// console.log(event);
					var property = {
						id: value.propertyId,
						name: value.propertyName,
						address: value.address,
						ownerName: value.ownerName,
						events: []
					}

					property.events[event.properties.order - 1] = event;
					
					var jurisdiction = {
						name: value.jurisdiction,
						properties: [property]		
					}

					// console.log("JurisdictionsNames: ",jurisdictionsNames);
					// console.log("Jurisdiction Name: ",value.jurisdiction);
					
					var jurisdictionIndex = jurisdictionsNames.indexOf(value.jurisdiction);
					// console.log("jurisdictionIndex: ",jurisdictionIndex);
					if(jurisdictionIndex > -1){
						var propertyIndex = propertyIds[jurisdictionIndex].indexOf(value.propertyId);
						if(propertyIndex > -1){
							finalResult.jurisdictions[jurisdictionIndex].properties[propertyIndex].events[event.properties.order - 1] = event;
						} else {
							finalResult.jurisdictions[jurisdictionIndex].properties.push(property);
							propertyIds[jurisdictionIndex].push(value.propertyId);
						}
					} else {
						jurisdictionsNames.push(value.jurisdiction);
						propertyIds[jurisdictionsNames.length -1] = [value.propertyId];
						finalResult.jurisdictions.push(jurisdiction);
					}
					// console.log("here1;", finalResult.jurisdictions[0].properties[0].events);
					callbackMain();
				}
			}, function (err) {
				if (err) console.error(err.message);
				// configs is now a map of JSON data
				// console.log("erere");
				DAL.getNotification(userId, function(error, result) {
					if (error) {
						console.log(error);
						error.userName = loginUserName;
						ErrorLogDAL.addErrorLog(error);
					} else {
						finalResult["notification"] = result;
						Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
					}
				});
				
			});
        }
	});
}
// ---------------------END---------------------


function checkRequiredItems(requiredItems, propertyId, itemId, deadline, cb){
	// console.log("*************", requiredItems);
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
			for(var element in requiredItems){
				if(Array.isArray(requiredItems[element])){
					// console.log(requiredItems[element]);
					if(requiredItems[element][4] == "IE"){
						totalItems++;
						if(requiredItems[element][2] == "false"){
							for(var j = 0;j < results[0].length; j++){
								// console.log(results[0][j].year);
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
								// console.log(results[0][j].asOfYear);
								// var asOfDate = (new Date(results[0][j].asOfYear.split(",")[1]));
								var asOfDate = new Date(requiredItems[element][3]).getTime();
								// console.log("A",asOfDate);
								// console.log(results[1][j].asOfYear);
								// console.log("B",results[1][j].asOfYear.split(",")[1]);
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
				// console.log(deadline);
				var daysRemaining = new dateDiff(new Date(), new Date(deadline));
				daysRemaining = parseInt(daysRemaining.days());
				var notification = {
					heading: "Complete Required Information",
					text: "",
					type: "warning"
				}

				if(daysRemaining < 15 && daysRemaining > 0){
					notification.text = daysRemaining+ " days remaining before submission. Please complete the required information."
					message += daysRemaining+ " days remaining before submission. "
				} else if (daysRemaining <= 0 ){
					notification.text = "Income Expense Survey submission overdue by " +parseInt(daysRemaining)*(-1)+ " days. Please complete the required information.";
					message += "Income Expense Survey submission overdue by " +parseInt(daysRemaining)*(-1)+ " days. "
				}
				
				// if(remainingFields > 0){
				// 	message += remainingFields + " out of " + totalFields+ " fields remaining. "
				// }
	
				if(remainingItems > 0){
					message += remainingItems + " of " + totalItems+ " items needed for submission."
				}
	
				// console.log(daysRemaining);
				requiredItems.warning = message;
				requiredItems.message = "";
				requiredItems.button = true;
				requiredItems.buttonText = "Details";
				requiredItems.status = "In Progress";
				requiredItems.flag = true;
			}

			DAL.updateData(requiredItems, itemId, function(error, result) {
				if (error) {
					console.log(error);
					error.userName = loginUserName;
					ErrorLogDAL.addErrorLog(error);
				} else {
					console.log("success");
				}
			});
			
			requiredItems['notification'] = notification;
			requiredItems["requiredItems"] = [];
			requiredItems["dataFields"] = [];
			cb(null, requiredItems) ;
		}
	});
}


function checkReivewStatus(requiredItems, reviewStatus, cb){
	// console.log("Req: ",requiredItems);
	// console.log("Status: ",reviewStatus);
	if(requiredItems.status == "Done"){
		reviewStatus.properties.flag = true;
		reviewStatus.properties.status = "In Progress"
	}
	cb(null,reviewStatus);
}


function checkSubmissionStatus(reviewStatus, submissionStatus, cb){
	// console.log("Req: ",requiredItems);
	// console.log("Status: ",reviewStatus);
	if(reviewStatus.reviewResult){
		submissionStatus.properties.flag = true;
		submissionStatus.properties.status = "In Progress"
	}
	cb(null,submissionStatus);
}

function generateNotification(notification, userId){
	DAL.generateNotification(notification, userId, function(error, result) {
		if (error) {
			console.log(error);
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
		} else {
			console.log("notification added successfully.");
		}
	});
}