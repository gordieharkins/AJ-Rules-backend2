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
// var marylandTimeline = {
// 	ieSurvey:{
// 		main: {
// 			name: "Income and Expense Survey",
// 			obligatory: true,
// 			form: true,
// 			requiredItems: ["IE 2015","IE 2016", "IE 2017", "RR as of January 1, 2017", "RR as of January 1, 2018"],
// 			formObtain: "AOTC",
// 			signature: "PIN",
// 			tranmitForm: "AOTC",
// 			transmitPackage: "AOTC",
// 			paradigm: "AOTC",
// 			deadline: "6/14/2018",
// 			status: "Not Started", 
// 			message: "",
// 			warning: "",
// 			order: 1
// 		},
// 		event1:{
// 			name: "Complete Required Information",
// 			status: "Not Started",
// 			message: "",
// 			warning: "",
// 			flag: true,
// 			mandatory: true,
// 			buttonText: "Details",
// 			button: true,
// 			order: 1,
// 			a: ["item","IE 2015", "false", "2015", "IE"],
// 			// b: ["item","IE 2016", "false", "2016", "IE"],
// 			// c: ["item","IE 2017", "false", "2017", "IE"],
// 			// d: ["item","RR as of January 1, 2017", "false", "January 1, 2017", "RR"],
// 			// e: ["item","RR as of January 1, 2018", "false", "January 1, 2018", "RR"],
// 			f: ["field","A", "0", "IE 2015"],
// 			g: ["field","B", "1", "IE 2015"],
// 			h: ["field","C", "2", "IE 2016"],
// 			i: ["field","D", "3", "IE 2017"],
// 			j: ["field","E", "4", "RR as of January 1, 2017"],
// 			k: ["field","F", "5", "RR as of January 1, 2018"]
// 		},
// 		// event2: {
// 		// 	name: "Complete IE Survey Form",
// 		// 	status: "Not Started",
// 		// 	message: "",
// 		// 	flag: true,
// 		// 	mandatory: true,
// 		// 	warning: true,
// 		// 	buttonText: "Details",
// 		// 	button: true,
// 		// 	a: ["A", "abc", "IE 2015"],
// 		// 	a: ["B", "1", "IE 2015"],
// 		// 	a: ["C", "2", "IE 2016"],
// 		// 	a: ["D", "3", "IE 2017"],
// 		// 	a: ["E", "4", "RR as of January 1, 2017"],
// 		// 	a: ["F", "5", "RR as of January 1, 2018"]
// 		// },

// 		event3: {
// 			name: "Review IE Survey Draft",
// 			status: "Not Started",
// 			message: "",
// 			flag: false,
// 			mandatory: false,
// 			buttonText: "Schedule Review",
// 			button: true,
// 			reviewResult:true,
// 			order: 2
// 		},

// 		event4: {
// 			name: "Submit IE Survey Data",
// 			status: "Not Started",
// 			message: "",
// 			flag: false,
// 			buttonText: "Execute Signature",
// 			button: true,
// 			mandatory: true,
// 			// state: "", 
// 			order: 3
// 		}


// 	},
// 	obtainAJRecord:{
// 		main: {
// 			name: "Obtain AJ Valuation Record",
// 			status: "Not Started",
// 			startDate: "06/15/2018",
// 			deadline: "08/15/2018",
// 			message: "",
// 			warning: "",
// 			order: 2
// 		}
// 	},
// 	appealMerit:{
// 		main: {
// 			name: "Determine Appeal Merit/Produce Evidence",
// 			status: "Not Started",
// 			startDate: "06/15/2018",
// 			deadline: "08/15/2018",
// 			message: "",
// 			warning: "",
// 			order: 3
// 		}
// 	},
// 	appealDecision:{
// 		main: {
// 			name: "Decision to Appeal",
// 			status: "Not Started",
// 			startDate: "06/15/2018",
// 			deadline: "08/15/2018",
// 			message: "",
// 			warning: "",
// 			order: 4
// 		}
// 	},
// 	appealPackage:{
// 		main: {
// 			name: "Prepare Appeal Package for Submission",
// 			status: "Not Started",
// 			startDate: "06/15/2018",
// 			deadline: "08/15/2018",
// 			message: "",
// 			warning: "",
// 			order: 5
// 		}
// 	},
// 	appealSubmission:{
// 		main: {
// 			name: "Appeal Submission",
// 			status: "Not Started",
// 			startDate: "06/15/2018",
// 			deadline: "08/15/2018",
// 			message: "",
// 			warning: "",
// 			order: 6
// 		}
// 	}
// }


var floridaTimeline = {
	ieSurvey:{
		main: {
			name: "Income and Expense Survey",
			obligatory: true,
			form: true,
			requiredItems: ["IE 2015","IE 2016", "IE 2017", "RR as of January 1, 2017", "RR as of January 1, 2018"],
			formObtain: "mail",
			signature: "ink",
			tranmitForm: "mail",
			transmitPackage: "mail",
			paradigm: "paper",
			deadline: "6/14/2018",
			status: "Not Started", 
			message: "",
			warning: "",
			order: 1
		},
		event2: {
			name: "Complete IE Survey Form",
			status: "Not Started",
			message: "Have you received the income expense survey form?",
			flag: true,
			mandatory: true,
			warning: false,
			buttonText: "",
			button: false,
			toggle: true,
			toggleValue: false,
			order: 1
		},
		event1:{
			name: "Complete Required Items",
			status: "Not Started",
			message: "",
			warning: "",
			flag: true,
			mandatory: true,
			buttonText: "View Checklist",
			button: true,
			order: 2,
			a: ["item","IE 2015", "false"],
			b: ["item","IE 2015", "false"],
			c: ["item","IE 2015", "false"],
			d: ["item","RR as of January 1, 2017", "false"],
			e: ["item","RR as of January 1, 2017", "false"],
			f: ["field","A","false"],
			g: ["field","B","false"],
			h: ["field","C","false"],
			i: ["field","D","false"],
			j: ["field","E","false"],
			k: ["field","F","false"]
		},
		
		event3: {
			name: "Review IE Survey Draft",
			status: "Not Started",
			message: "",
			flag: false,
			mandatory: false,
			buttonText: "Schedule Review",
			button: true,
			reviewResult:true,
			order: 3
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
			order: 4
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
	console.log("here");
    DAL.addPropertyTimelineData(data, floridaTimeline, year, function(error, result) {
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
			// console.log(result[0].pin , "-------------", req.body.pin);
			if(result[0].pin == req.body.pin){
				for(var i = 0; i < req.body.data.length; i++){
					req.body.data[i].properties.button = false;
					req.body.data[i].properties.buttonText = "";
					req.body.data[i].properties.message = "The data will be released to AJ soon."
					// console.log(req.body.data[i]);
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
				Response.sendResponse(true, Response.REPLY_MSG.PIN_FAILED, result, res);
			}

			
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// get Property timeline data
// ---------------------------------------------
BLL.prototype.getPropertyTimelineData = function(req, res) {
	console.log("Request for timeline data");
	
	var year = (new Date()).getFullYear();
	var userId = req.user[0].userId;
	// var userId = req.body.userId;
	
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
			async.forEachOf(result, function (value, i, callbackMain) {
				if(value.event.properties.name == "Income and Expense Survey"){
					if(value.event.properties.paradigm == "AOTC"){
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
													subValue._id, value.event.properties.deadline, value.jurisdiction, function(error, requiredItems){
									if(error){
										callbackSubMain(error);
									} else {
										subValue.properties = requiredItems;
										var status = true;
										for(var element in subValue.properties){
											if(element == "requiredItems" || element == "dataFields"){
												continue;
											}
											if(Array.isArray(subValue.properties[element])){
												if(subValue.properties[element][0] == "field"){
													if(subValue.properties[element][2] == ""){
														status = false;													
													}

													var temp = {
														name: subValue.properties[element][1],
														value: subValue.properties[element][2],
														source: subValue.properties[element][3]
													}

													subValue.properties.dataFields.push(temp);
													delete subValue.properties[element];
												} else {
													if(subValue.properties[element][2] == "false"){
														status = false;													
													}

													var temp = {
														name: subValue.properties[element][1],
														value: subValue.properties[element][2],
														type: subValue.properties[element][4]
													}
													subValue.properties.requiredItems.push(temp);
													delete subValue.properties[element];
												}
											}
										}

										if(status){
											subValue.properties.status = "Done";
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
								checkSubmissionStatus(value.subEvent[reviewIEDraftIndex], value.subEvent[requireInformationIndex], subValue, function(error, surveyData){
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
							if(!isComplete){
								var notification = {
									heading: value.jurisdiction + " Properties",
									text: "Need to complete IE survey package for " +value.jurisdiction
											+ " properties before "+value.event.properties.deadline+".",
									type: "warning"
								}

								generateNotification(notification, userId);
							}
							
							if(value.subEvent[requireInformationIndex].properties.status == "Done" &&
							value.subEvent[reviewIEDraftIndex].properties.status == "Done" &&
							value.subEvent[submitIEDataIndex].properties.status == "Done"){
								value.event.properties.status = "Done";
								value.event.properties.message = "Completed on: " +value.event.properties.deadline; 
							} else if(value.subEvent[requireInformationIndex].properties.status == "Not Started" &&
							value.subEvent[reviewIEDraftIndex].properties.status == "Not Started" &&
							value.subEvent[submitIEDataIndex].properties.status == "Not Started"){
								value.event.properties.status = "Done";
							} else if(value.subEvent[requireInformationIndex].properties.status == "In Progress" ||
							value.subEvent[reviewIEDraftIndex].properties.status == "In Progress" ||
							value.subEvent[submitIEDataIndex].properties.status == "In Progress"){
								value.event.properties.status = "In Progress";
								value.event.properties.message = "Deadline: "+ value.event.properties.deadline;
								if(value.subEvent[requireInformationIndex].properties.status == "In Progress"){
									value.event.properties.warning = "Complete required information.";
								} else if(value.subEvent[submitIEDataIndex].properties.status == "In Progress" ){
									value.event.properties.warning = "Please execute signature.";
								} 
							}

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
								events: []
							}

							property.events[event.properties.order - 1] = event;
							
							var jurisdiction = {
								name: value.jurisdiction,
								properties: [property]		
							}

							var jurisdictionIndex = jurisdictionsNames.indexOf(value.jurisdiction);
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
							callbackMain();
						});
					} else if(value.event.properties.paradigm == "paper"){
						var tempEvent = [];
						for(var k = 0; k < value.subEvent.length; k++){
							tempEvent[value.subEvent[k].properties.order - 1] = value.subEvent[k];
						}
						async.forEachOf(value.subEvent, function (subValue, j, callbackSubMain) {
							if(subValue.properties.name == "Complete Required Items"){
								requireInformationIndex = j;
								checkRequiredItemsPaper(subValue.properties, value.propertyId, 
													subValue._id, value.event.properties.deadline, value.jurisdiction, 
													function(error, requiredItems){
									if(error){
										callbackSubMain(error);
									} else {
										subValue.properties = requiredItems;
										var status = true;
										for(var element in subValue.properties){
											if(element == "requiredItems" || element == "dataFields"){
												continue;
											}
											if(Array.isArray(subValue.properties[element])){
												if(subValue.properties[element][0] == "field"){
													if(subValue.properties[element][2] == "false"){
														status = false;													
													}

													var temp = {
														name: subValue.properties[element][1],
														value: subValue.properties[element][2]
													}

													subValue.properties.dataFields.push(temp);
													delete subValue.properties[element];
												} else {
													if(subValue.properties[element][2] == "false"){
														status = false;													
													}

													var temp = {
														name: subValue.properties[element][1],
														value: subValue.properties[element][2],
													}
													subValue.properties.requiredItems.push(temp);
													delete subValue.properties[element];
												}
											}
										}

										if(status){
											subValue.properties.status = "Done";
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
							} else {
								callbackSubMain();
							}
								// } else if(subValue.properties.name == "Review IE Survey Draft"){

								// 	reviewIEDraftIndex = j;
							// 	checkReivewStatus(value.subEvent[requireInformationIndex], subValue, function(error, reviewStatus){
							// 		if(error){
							// 			callbackSubMain(error);
							// 		} else {
							// 			subValue = reviewStatus;
							// 			if(subValue.properties.status != "Done"){
							// 				isComplete = false;
							// 			}
							// 			callbackSubMain();
							// 		}
							// 	});
							// } else if(subValue.properties.name == "Submit IE Survey Data"){
							// 	submitIEDataIndex = j;
							// 	checkSubmissionStatus(value.subEvent[reviewIEDraftIndex], value.subEvent[requireInformationIndex], subValue, function(error, surveyData){
							// 		if(error){
							// 			callbackSubMain(error);
							// 		} else {
							// 			subValue = surveyData;
							// 			if(subValue.properties.status != "Done"){
							// 				isComplete = false;
							// 			}
							// 			callbackSubMain();
							// 		}
							// 	});
							// }
						}, function (err) {
							if (err) console.error(err.message);
							//configs is now a map of JSON data
							if(!isComplete){
								var notification = {
									heading: value.jurisdiction + " Properties",
									text: "Need to complete IE survey package for " +value.jurisdiction
											+ " properties before "+value.event.properties.deadline+".",
									type: "warning"
								}

								generateNotification(notification, userId);
							}
							
							// if(value.subEvent[requireInformationIndex].properties.status == "Done" &&
							// value.subEvent[reviewIEDraftIndex].properties.status == "Done" &&
							// value.subEvent[submitIEDataIndex].properties.status == "Done"){
							// 	value.event.properties.status = "Done";
							// 	value.event.properties.message = "Completed on: " +value.event.properties.deadline; 
							// } else if(value.subEvent[requireInformationIndex].properties.status == "Not Started" &&
							// value.subEvent[reviewIEDraftIndex].properties.status == "Not Started" &&
							// value.subEvent[submitIEDataIndex].properties.status == "Not Started"){
							// 	value.event.properties.status = "Done";
							// } else if(value.subEvent[requireInformationIndex].properties.status == "In Progress" ||
							// value.subEvent[reviewIEDraftIndex].properties.status == "In Progress" ||
							// value.subEvent[submitIEDataIndex].properties.status == "In Progress"){
							// 	value.event.properties.status = "In Progress";
							// 	value.event.properties.message = "Deadline: "+ value.event.properties.deadline;
							// 	if(value.subEvent[requireInformationIndex].properties.status == "In Progress"){
							// 		value.event.properties.warning = "Complete required information.";
							// 	} else if(value.subEvent[submitIEDataIndex].properties.status == "In Progress" ){
							// 		value.event.properties.warning = "Please execute signature.";
							// 	} 
							// }

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
								events: []
							}

							property.events[event.properties.order - 1] = event;
							
							var jurisdiction = {
								name: value.jurisdiction,
								properties: [property]		
							}

							var jurisdictionIndex = jurisdictionsNames.indexOf(value.jurisdiction);
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
							callbackMain();
						});
					}
					
				} else {

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
						events: []
					}

					property.events[event.properties.order - 1] = event;
					
					var jurisdiction = {
						name: value.jurisdiction,
						properties: [property]		
					}

					var jurisdictionIndex = jurisdictionsNames.indexOf(value.jurisdiction);
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
					callbackMain();
				}
			}, function (err) {
				if (err) console.error(err.message);
				// configs is now a map of JSON data
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

function checkRequiredItems(requiredItems, propertyId, itemId, deadline, jurisdiction, cb){
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
				
				
				daysRemaining = parseInt(daysRemaining.days());
				var notification = {
					heading: "Complete Required Information",
					text: "",
					type: "warning"
				}

				if(daysRemaining < 30 && daysRemaining > 0){
					notification.text = daysRemaining+ " days remaining before submission of Income Expence Survey package for "+jurisdiction+" properties. Please complete the required information."
					message += daysRemaining+ " days remaining before submission. "
				} else if (daysRemaining <= 0 ){
					notification.text = "Income Expense Survey submission overdue by " +parseInt(daysRemaining)*(-1)+ " days for "+jurisdiction+" properties. Please complete the required information.";
					message += "Income Expense Survey submission overdue by " +parseInt(daysRemaining)*(-1)+ " days. "
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

			// console.log(JSON.stringify(requiredItems));
			cb(null, requiredItems) ;
		}
	});
}

function checkReivewStatus(requiredItems, reviewStatus, cb){
	if(requiredItems.properties.status == "Done"){
		reviewStatus.properties.flag = true;
		reviewStatus.properties.status = "In Progress"
	}
	cb(null,reviewStatus);
}

function checkSubmissionStatus(reviewStatus, requiredItemsStatus, submissionStatus, cb){
	if(reviewStatus.properties.reviewResult != false && requiredItemsStatus.properties.status == "Done"){
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

function calculateRemainingDays(deadline){
	var daysRemaining = new dateDiff(new Date(deadline), new Date());
	daysRemaining = parseInt(daysRemaining.days());

	return daysRemaining;
}

function checkRequiredItemsPaper(requiredItems, propertyId, itemId, deadline, jurisdiction, cb){
	var totalItems = 0;
	var remainingItems = 0;
	var totalFields = 0;
	var remainingFields = 0;
	var remainingDays = calculateRemainingDays(deadline);
	var warning = "";
	for(var element in requiredItems){
		if(Array.isArray(requiredItems[element])){
			if(requiredItems[element][0] == "item"){
				totalItems++;
				if(requiredItems[element][2] == "false"){
					remainingItems++;
				}
			} else if(requiredItems[element][0] == "field"){
				totalFields++;
				if(requiredItems[element][2] == "false"){
					remainingFields++;
				}
			}
		}
	}

	if(remainingItems == 0 && remainingFields == 0){
		requiredItems.message = "All items are complete.",
		requiredItems.status = "Done";
	} else {
		requiredItems.message = "Complete required items in checklist.";
		requiredItems.status = "In Progress";
		var notification = {
			heading: "Complete Required Information",
			text: "",
			type: "warning"
		};

		if(deadline > 0 && deadline < 30){
			notification.text = daysRemaining+ " days remaining before submission of Income Expence Survey package for "+jurisdiction+" properties. Please complete the required information. "
			warning += remainingDays +" days remaining before submission. "
		} else {
			remainingDays = remainingDays * (-1);
			notification.text = "Income Expense Survey submission overdue by " +remainingDays+ " days for "+jurisdiction+" properties. Please complete the required information.";
			warning += "Income Expense survey overdue by "+ remainingDays +" days. ";
			
		}

		if(remainingItems > 0){
			warning += remainingItems+ " of "+totalItems+ " items remaing. "
		} 

		if(remainingFields > 0){
			warning += remainingFields+ " of "+totalFields+ " fields remaing. "
		}
		requiredItems['notification'] = notification;
		warning += "Please complete the required information";
	}

	requiredItems.warning = warning;
	
	requiredItems["requiredItems"] = [];
	requiredItems["dataFields"] = [];

	cb(null, requiredItems);
}