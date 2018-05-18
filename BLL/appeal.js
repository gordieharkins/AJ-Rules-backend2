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
	console.log("timeline: ",data);
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

			var finalResult = {
				jurisdictions: []
			};
			var jurisdictionsNames = [];
			var propertyIds = [];
			async.forEachOf(result, function (value, i, callbackMain) {
					if(value.event.properties.name == "Income and Expense Survey"){
						var tempSubEvent = {};
						var flag = false;
						console.log(value);
						// console.log("Bbbbbbbbb",value.subEvent);
						// value.subEvent = value.subEvent.sort(function(a, b) {
						// 	return parseFloat(a.order) - parseFloat(b.order);
						// });
						// console.log("aaaaaaaaaa",value.subEvent);
						async.forEachOf(value.subEvent, function (subValue, j, callbackSubMain) {
							if(subValue.properties.name == "Complete Required Information"){
								async.series([
									function(callback) {
										if(!(subValue.status == "Done")){
											console.log("aaaaaaaw22.", value.deadline);
											checkRequiredItems(subValue.properties, value.propertyId, subValue._id, value.event.properties.deadline, function(error, requiredItems){
												if(error){
													callback(error, null);
												} else {
													callback(null, requiredItems);
												}
											});
										}
									},
	
									function(callback){
										callback(null, "1");
									}
								],
								// optional callback
								function(err, results) {
									subValue.properties = results[0];
									// subValue.properties["requiredItems"] = [];
									// subValue.properties["dataFields"] = [];
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

									callbackSubMain();
								});
								
							} else {
								callbackSubMain();
							}
						}, function (err) {
							if (err) console.error(err.message);
							// configs is now a map of JSON data

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
								events: [event]
							}
			
							var jurisdiction = {
								name: value.jurisdiction,
								properties: [property]		
							}

							// console.log(event);
							var jurisdictionIndex = jurisdictionsNames.indexOf(value.jurisdiction);
							if(jurisdictionIndex > -1){
								var propertyIndex = propertyIds[jurisdictionIndex].indexOf(value.propertyId);
								if(propertyIndex > -1){
									finalResult.jurisdictions[jurisdictionIndex].properties[propertyIndex].events.push(event);
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
					} else {

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
							events: [event]
						}
		
						var jurisdiction = {
							name: value.jurisdiction,
							properties: [property]		
						}

						// console.log(event);
						var jurisdictionIndex = jurisdictionsNames.indexOf(value.jurisdiction);
						if(jurisdictionIndex > -1){
							var propertyIndex = propertyIds[jurisdictionIndex].indexOf(value.propertyId);
							if(propertyIndex > -1){
								finalResult.jurisdictions[jurisdictionIndex].properties[propertyIndex].events.push(event);
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
				console.log("erere");
				Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
			});






            
        }
	});
	
}
// ---------------------END---------------------


function checkRequiredItems(requiredItems, propertyId, itemId, deadline, cb){
	console.log("*************", requiredItems);
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
								console.log(results[0][j].year);
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
								console.log("A",asOfDate);
								// console.log(results[1][j].asOfYear);
								console.log("B",results[1][j].asOfYear.split(",")[1]);
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
						if(requiredItems[element][2] == "abc"){
							remainingFields++;
						}
					}
				}
			}
			
			if(remainingFields > 0){
				message += remainingFields + " out of " + totalFields+ " fields remaining. "
			}

			if(remainingItems > 0){
				message += remainingItems + " out of " + totalItems+ " items remaining."
			}

			if(remainingItems == 0 && remainingFields == 0){
				requiredItems.message = "All items complete.";
				requiredItems.button = true;
				requiredItems.buttonText = "Details";
				requiredItems.warning = "";
				requiredItems.status = "Done";
				requiredItems.flag = true;

			} else {
				console.log(deadline);
				var daysRemaining = new dateDiff(new Date(), new Date(deadline));
				console.log(daysRemaining);
				daysRemaining = daysRemaining.days();
				message += daysRemaining+ " days remaining before submission. Please complete the required information. "
				requiredItems.warning = message;
				requiredItems.message = "";
				requiredItems.button = true;
				requiredItems.buttonText = "Details";
				requiredItems.status = "In Progress";
				requiredItems.flag = true;


				
				var notification = {
					heading: "Complete Required Information",
					text: daysRemaining+ " days remaining before submission. Please complete the required information."
				}
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
