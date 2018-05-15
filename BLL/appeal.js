var path = require('path');
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var loginUserName = 'Ali'; // Infutre will get logged in user name
var AppealDAL = require(path.resolve(__dirname, '../DAL/appeal'));
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
			deadline: "5/14/2018",
			status: "Not Started"
		},
		event1:{
			name: "Complete Required Information",
			status: "Not Started",
			message: "",
			warning: true,
			flag: true,
			mandatory: true,
			buttonText: "Details",
			button: true,
			a: ["IE 2015", "false"],
			b: ["IE 2016", "false"],
			c: ["IE 2017", "false"],
			d: ["RR 2017", "false"],
			e: ["RR 2018", "false"],
			f: ["A", "abc", "IE 2015"],
			g: ["B", "1", "IE 2015"],
			h: ["C", "2", "IE 2016"],
			i: ["D", "3", "IE 2017"],
			j: ["E", "4", "RR as of January 1, 2017"],
			k: ["F", "5", "RR as of January 1, 2018"]
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
			button: true
		},

		event4: {
			name: "Submit IE Survey Data",
			status: "Not Started",
			message: "",
			flag: false,
			buttonText: "Execute Signature",
			button: true,
			mandatory: true
		}


	},
	obtainAJRecord:{
		main: {
			name: "Obtain AJ Valuation Record",
			status: "Not Started",
			startDate: "06/15/2018",
			deadline: "08/15/2018"
		}
	},
	appealMerit:{
		main: {
			name: "Determine Appeal Merit/Produce Evidence",
			status: "Not Started",
			startDate: "06/15/2018",
			deadline: "08/15/2018"
		}
	},
	appealDecision:{
		main: {
			name: "Decision to Appeal",
			status: "Not Started",
			startDate: "06/15/2018",
			deadline: "08/15/2018"
		}
	},
	appealPackage:{
		main: {
			name: "Prepare Appeal Package for Submission",
			status: "Not Started",
			startDate: "06/15/2018",
			deadline: "08/15/2018"
		}
	},
	appealSubmission:{
		main: {
			name: "Appeal Submission",
			status: "Not Started",
			startDate: "06/15/2018",
			deadline: "08/15/2018"
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
	// console.log("timeline: ",data);
	var year = (new Date()).getFullYear();
	// if(data.jurisdiction == "Maryland"){
	// 	var timeline
	// }
	console.log(req.user);
	var userId = req.user[0].userId;
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
			for(var i = 0; i < result.length; i++){

				if(result[i].event.properties.name == "Income and Expense Survey"){
					var tempSubEvent = {};
					var flag = false;
					for(var j = 0; j < result[i].subEvent.length; j++){
						if(result[i].subEvent[j].properties.name == "Complete Required Information"){
							result[i].subEvent[j].properties["requiredItems"] = [];
														
							result[i].subEvent[j].properties["dataFields"] = [];
							console.log("$$$$$$$$$$$",result[i].subEvent[j].properties.requiredItems);
							for(var element in result[i].subEvent[j].properties){
								if(element == "requiredItems" || element == "dataFields"){
									continue;
								}
								if(Array.isArray(result[i].subEvent[j].properties[element])){
									if(result[i].subEvent[j].properties[element].length == 3){
										// console.log(result[i].subEvent[j].properties[element].length);
										// console.log(result[i].subEvent[j].properties[element]);
										
										var temp = {
											name: result[i].subEvent[j].properties[element][0],
											value: result[i].subEvent[j].properties[element][1],
											source: result[i].subEvent[j].properties[element][2]
										}
										result[i].subEvent[j].properties.dataFields.push(temp);
										delete result[i].subEvent[j].properties[element];

									} else {
										var temp = {
											name: result[i].subEvent[j].properties[element][0],
											value: result[i].subEvent[j].properties[element][1]
										}
										
										result[i].subEvent[j].properties.requiredItems.push(temp);
										delete result[i].subEvent[j].properties[element];
									}
								}
							}
						}
					}
				} 
				var event = {
					eventId: result[i].event._id,
					properties: result[i].event.properties,
					subEvents: result[i].subEvent 
				};
				
				var property = {
					id: result[i].propertyId,
					name: result[i].propertyName,
					address: result[i].address,
					ownerName: result[i].ownerName,
					events: [event]
				}

				var jurisdiction = {
					name: result[i].jurisdiction,
					properties: [property]		
				}
				var jurisdictionIndex = jurisdictionsNames.indexOf(result[i].jurisdiction);
				if(jurisdictionIndex > -1){
					var propertyIndex = propertyIds[jurisdictionIndex].indexOf(result[i].propertyId);
					if(propertyIndex > -1){
						finalResult.jurisdictions[jurisdictionIndex].properties[propertyIndex].events.push(event);
					} else {
						finalResult.jurisdictions[jurisdictionIndex].properties.push(property);
						propertyIds[jurisdictionIndex].push(result[i].propertyId);
					}
				} else {
					jurisdictionsNames.push(result[i].jurisdiction);
					propertyIds[jurisdictionsNames.length -1] = [result[i].propertyId];
					finalResult.jurisdictions.push(jurisdiction);
				}
			}
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
        }
	});
	
}
// ---------------------END---------------------
