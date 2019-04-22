var path = require('path');
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var surveysDALFile = require(path.resolve(__dirname, '../DAL/surveys'));
var DAL = new surveysDALFile();
var loginUserName = 'Ali'; // Infutre will get logged in user name
var jsonexport = require('jsonexport');
var dateFormat = require('dateformat');


module.exports = BLL;


//Class Constructor 
function BLL() {

}

function sortFormData(data, cb) {
	// //console.log(formData.value.hassubmission[0].has);
	// //console.log(data);
	data.forEach(function (formData) {
		if (formData && formData.value && formData.value.hassubmission && formData.value.hassubmission.length > 0 && formData.value.hassubmission[0].has) {
			formData.value.hassubmission[0].has.sort(function (a, b) { return a.order - b.order });
			formData.value.hassubmission[0].has.forEach(function (question) {
				// //console.log(has);
				if (question.has != undefined) {
					question.has.sort(function (a, b) { return a.order - b.order });
				}
			});
		}

	});

	cb(data);
}


//----------------------------------------------
// getFormSubmissions
//----------------------------------------------
BLL.prototype.surveyJsonToRules = function (req, res) {
	if (!req || req === null || req === undefined) {
		Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
		return;
	}
	var surveyId = req.query.id;
	var data = { "submissionId": parseInt(surveyId) };
	DAL.getSubmissionData(data, function (error, result) {
		// console.log(result[0].value)
		if (Object.keys(result[0].value).length === 0 && result[0].value.constructor === Object || error) {
			Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
			return;
		} else {
			sortFormData(JSON.parse(JSON.stringify(result)), function (sortedData) {
				// console.log(sortedData[0].value,sortedData.length);
				Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, parseSurveyToRules(sortedData[0]), res);
			});
		}
	});
}
// ---------------------END---------------------

function parseSurveyToRules(survey) {
	let temp = {
		jurisdiction: null,
		appealDeadline: null,
		appealDateType: null,
		is_appeal_form: null,
		appealFormSubmittalFormat: null,
		appealFromSignatureRequirements: null,
		appealEvidenceSubmissionValue: null,
		appealEvidenceSubmissionDays: null,
		appealPackageItems: null,
		appealPackageSubmittalFormatValue: null,
		appealPackageSubmittalFormatDeadline: null,
		daysFromNotice: null
	};


	let assessor1 = extractAssessor1Data(survey);
	let board2 = extractBoard2Data(survey);
	let board3 = extractBoard3Data(survey);
	let bflag = true;
	let b2flag = true;
	if (board2 == 0) {
		board2 = temp
		bflag = false
	}

	if (board3 == 0) {
		board3 = temp
		b2flag = false
	}

	let rules = {
		isBoardLevel: bflag,
		isBoard2Level: b2flag,
		jurisdiction: assessor1.jurisdiction,
		appealDeadline1: {
			deadline: assessor1.appealDeadline,
			is_appeal_form: assessor1.is_appeal_form,
			type: assessor1.appealDateType
		},
		appealFormSubmittalFormat1: {
			value: assessor1.appealFormSubmittalFormat

		},
		appealFormSignatureRequirements1: {
			value: assessor1.appealFromSignatureRequirements
		},
		appealPackageSubmittalFormat1: {
			deadline: assessor1.appealPackageSubmittalFormatDeadline,
			value: assessor1.appealPackageSubmittalFormatValue
		},
		appealEvidenceSubmission1: {
			days: assessor1.appealEvidenceSubmissionDays,
			value: assessor1.appealEvidenceSubmissionValue
		},
		appealPackageItems1: {
			value: assessor1.appealPackageItems
		},
		appealDeadline2: {
			deadline: board2.appealDeadline,
			is_appeal_form: board2.is_appeal_form,
			type: board2.appealDateType,
			event: board2.event,
			days: board2.days
		},
		appealFormSubmittalFormat2: {
			value: board2.appealFormSubmittalFormat

		},
		appealFormSignatureRequirements2: {
			value: board2.appealFromSignatureRequirements
		},
		appealPackageSubmittalFormat2: {
			deadline: board2.appealPackageSubmittalFormatDeadline,
			value: board2.appealPackageSubmittalFormatValue
		},
		appealEvidenceSubmission2: {
			days: board2.appealEvidenceSubmissionDays,
			value: board2.appealEvidenceSubmissionValue
		},
		appealPackageItems2: {
			value: board2.appealPackageItems
		},
		appealDeadline3: {
			deadline: board3.appealDeadline,
			is_appeal_form: board3.is_appeal_form,
			type: board3.appealDateType,
			event: board3.event,
			days: board3.days
		},
		appealFormSubmittalFormat3: {
			value: board3.appealFormSubmittalFormat

		},
		appealFormSignatureRequirements3: {
			value: board3.appealFromSignatureRequirements
		},
		appealPackageSubmittalFormat3: {
			deadline: board3.appealPackageSubmittalFormatDeadline,
			value: board3.appealPackageSubmittalFormatValue
		},
		appealEvidenceSubmission3: {
			days: board3.appealEvidenceSubmissionDays,
			value: board3.appealEvidenceSubmissionValue
		},
		appealPackageItems3: {
			value: board3.appealPackageItems
		}
	}
	return rules;
}

function extractAssessor1Data(json) {
	//console.log(JSON.stringify(json));
	let jurisdiction = json.value.jurisdiction
	let appealDeadline = ""
	let appealDateType = ""
	let is_appeal_form = ""
	let appealFormSubmittalFormat = ""
	let appealFromSignatureRequirements = ""
	let appealEvidenceSubmissionValue = ""
	let appealEvidenceSubmissionDays = ""
	let appealPackageItems = ""
	let appealPackageSubmittalFormatValue = ""
	let appealPackageSubmittalFormatDeadline = ""
	let daysFromNotice = null
	for (let i = 0; i < json.value.hassubmission[0].has.length; i++) {
		let question = json.value.hassubmission[0].has[i]
		if (question.ajRule == "Appeal Deadline Format") {
			if (question.hasanswer[0].value.length == 1) {
				appealDateType = question.hasanswer[0].value[0]
			} else {
				appealDateType = question.hasanswer[0].value
			}

			for (let j = 0; j < question.has.length; j++) {
				if (question.has && question.has[j] && question.has[j].hasanswer && question.has[j].hasanswer[0].value) {
					if (question.has[j].enabled == appealDateType) {
						if (question.has[j].hasanswer[0].value.length == 1) {
							appealDeadline = question.has[j].hasanswer[0].value[0]
						} else {
							appealDeadline = question.has[j].hasanswer[0].value
						}
						break
					}


				}
			}
		}

		if (appealDateType == "Approx Deadline" && question.ajRule == "Assessment Notice Mail Format") {
			let myans = question.hasanswer[0].value[0]
			for (let k = 0; k < question.has.length; k++) {
				if (question.has[k].enabled == myans) {
					let tempappealDeadline = question.has[k].hasanswer[0].value[0]
					
					var tdate = new Date(tempappealDeadline);
					var newdate = new Date(tdate);
					newdate.setDate(newdate.getDate() + parseInt(appealDeadline));
					appealDeadline = newdate


				}
			}


		}

		if (question.ajRule == "Appeal Form") {
			if (question.hasanswer[0].value == "Yes") {
				is_appeal_form = true
			} else {
				is_appeal_form = false
			}
			for (let k = 0; k < question.has.length; k++) {
				if (question.has[k].ajRule == "Appeal Form Signature Requirements") {
					appealFromSignatureRequirements = question.has[k].hasanswer[0].value
				}
			}


		}

		if (question.ajRule == "Appeal Form Submittal Format") {
			appealFormSubmittalFormat = question.hasanswer[0].value
		}
		if (question.ajRule == "Event when evidence is due") {
			appealEvidenceSubmissionValue = question.hasanswer[0].value[0]
			if (question.hasanswer[0].value[0] == "# of Days Before Hearing") {
				appealEvidenceSubmissionDays = question.has[0].hasanswer[0].value[0]
				appealEvidenceSubmissionValue = "Days Prior Hearing"
			} else if (question.hasanswer[0].value[0] == "At time of Appeal") {
				appealEvidenceSubmissionValue = "At Appeal"
			}
			else {
				appealEvidenceSubmissionDays = ""
			}
		}
		if (question.ajRule == "Appeal Package Items") {
			appealPackageItems = []

			if (question.hasanswer[0].value.length > 0) {
				if (question.hasanswer[0].value.includes("Income and expense statements for the current year and the previous 2 years")) {
					appealPackageItems.push("IE||3")
				}
				if (question.hasanswer[0].value.includes("Rent roll as of January 1 for the current year and rent roll as of January 1 for the previous year")) {
					appealPackageItems.push("RR||2")
				}
				// if (question.hasanswer[0].value.includes("Decision from Assessor Appeal")){
				// 	appealPackageItems.push("AAD||1")
				// }
				// if (question.hasanswer[0].value.includes("Decision from local Board Appeal")){
				// 	appealPackageItems.push("LBD||1")
				// }

			}


			// if (question.hasanswer[0].value.length == 2) {
			// 	appealPackageItems = ["IE||3", "RR||2"]
			// } else if (question.hasanswer[0].value.length == 1 && question.hasanswer[0].value[0] == "RR 2017, RR 2018") {
			// 	appealPackageItems = ["RR||2"]
			// } else if (question.hasanswer[0].value.length == 1 && question.hasanswer[0].value[0] == "IE 2018, IE 2019, IE 2017") {
			// 	appealPackageItems = ["IE||3"]
			// } else {
			// 	appealPackageItems = question.hasanswer[0].value
			// }
			// //console.log(appealPackageItems)
		}

		if (question.ajRule == "Appeal Package Submittal Format") {
			appealPackageSubmittalFormatValue = question.hasanswer[0].value

		}
		if (question.ajRule == "Appeal Deadline Format") {

		}
	}

	const extracted = {
		jurisdiction,
		appealDeadline,
		appealDateType,
		is_appeal_form,
		appealFormSubmittalFormat,
		appealFromSignatureRequirements,
		appealEvidenceSubmissionValue,
		appealEvidenceSubmissionDays,
		appealPackageItems,
		appealPackageSubmittalFormatValue,
		appealPackageSubmittalFormatDeadline,
		daysFromNotice
	};


	return extracted
}

function extractBoard2Data(json) {
	// console.log(JSON.stringify(json))
	let jurisdiction = json.value.jurisdiction
	let appealDeadline = ""
	let appealDateType = ""
	let is_appeal_form = ""
	let appealFormSubmittalFormat = ""
	let appealFromSignatureRequirements = ""
	let appealEvidenceSubmissionValue = ""
	let appealEvidenceSubmissionDays = ""
	let appealPackageItems = ""
	let appealPackageSubmittalFormatValue = ""
	let appealPackageSubmittalFormatDeadline = ""
	let daysFromNotice = null
	let event = null
	let days = null

	
	for (let i = 0; i < json.value.hassubmission[0].has.length; i++) {
		let question = json.value.hassubmission[0].has[i]
		if (question.ajRule == "Ascertain Board Level Appeal" && question.hasanswer[0].value == "No") {
			return 0;
		}
		if (question.ajRule == "Ascertain Board Level Appeal Deadline Format") {
			if (question.hasanswer[0].value.length == 1) {
				appealDateType = question.hasanswer[0].value[0]
			} else {
				appealDateType = question.hasanswer[0].value
			}
			let myflag = false
			for (let j = 0; j < question.has.length; j++) {

				if (question.has && question.has[j] && question.has[j].hasanswer && question.has[j].hasanswer[0].value) {

					if (appealDateType == "A Firm Date" && question.has[j].enabled == appealDateType) {

						if (question.has[j].hasanswer[0].value.length == 1) {
							appealDeadline = question.has[j].hasanswer[0].value[0]
						} else {
							appealDeadline = question.has[j].hasanswer[0].value
						}
						break

					}else if(appealDateType == "Relative to an event" && question.has[j].enabled == appealDateType){
						myflag = true

						if (question.has[j].ajRule == "Ascertain Board Level Appeal Triggering Event") {
							if (question.has[j].hasanswer[0].value[0] == "The date on the written decision made by the Assessor") {
								event = "days after assessor decision"
							} else {
								event = "not implemented yet"
							}

						}
						if(question.has[j].ajRule == "Calculate Board Level Appeal Deadline"){
							days = question.has[j].hasanswer[0].value[0]
						}
					}

				}
			}
			if(myflag){
				appealDateType = "Approx Deadline"
			}
		}



		if (question.ajRule == "Ascertain Board Level Appeal Form") {
			if (question.hasanswer[0].value == "Yes") {
				is_appeal_form = true
			} else {
				is_appeal_form = false
			}
			for (let k = 0; k < question.has.length; k++) {
				if (question.has[k].ajRule == "Board Level Form Signature Requirement(s)") {
					appealFromSignatureRequirements = question.has[k].hasanswer[0].value
				}
			}


		}

		if (question.ajRule == "Board Level Form Submission Method(s)") {
			appealFormSubmittalFormat = question.hasanswer[0].value
		}
		if (question.ajRule == "Ascertain when Board Level Appeal Evidence deadline") {
			// console.log("bleh",question.hasanswer[0].value[0])
			appealEvidenceSubmissionValue = question.hasanswer[0].value[0]
			if (question.hasanswer[0].value[0] == "# of Days Before Hearing") {
				appealEvidenceSubmissionDays = question.has[0].hasanswer[0].value[0]
				appealEvidenceSubmissionValue = "Days Prior Hearing"
			} else if (question.hasanswer[0].value[0] == "At time of Appeal") {
				appealEvidenceSubmissionValue = "At Appeal"
			}
			else {
				appealEvidenceSubmissionDays = ""
			}
		}
		if (question.ajRule == "Board Level Submission Required Items") {

			appealPackageItems = []

			if (question.hasanswer[0].value.length > 0) {
				if (question.hasanswer[0].value.includes("Income and expense statements for the current year and the previous 2 years")) {
					appealPackageItems.push("IE||3")
				}
				if (question.hasanswer[0].value.includes("Rent roll as of January 1 for the current year and rent roll as of January 1 for the previous year")) {
					appealPackageItems.push("RR||2")
				}
				// if (question.hasanswer[0].value.includes("Decision from Assessor Appeal")){
				// 	appealPackageItems.push("AAD||1")
				// }
				// if (question.hasanswer[0].value.includes("Decision from local Board Appeal")){
				// 	appealPackageItems.push("LBD||1")
				// }

			}


		}

		if (question.ajRule == "Board Level Appeal Package Submission Method(s)") {
			appealPackageSubmittalFormatValue = question.hasanswer[0].value
		}
		if (question.ajRule == "Ascertain Board Level Appeal Deadline Format") {

		}
	}

	const extracted = {
		jurisdiction,
		appealDeadline,
		appealDateType,
		is_appeal_form,
		appealFormSubmittalFormat,
		appealFromSignatureRequirements,
		appealEvidenceSubmissionValue,
		appealEvidenceSubmissionDays,
		appealPackageItems,
		appealPackageSubmittalFormatValue,
		appealPackageSubmittalFormatDeadline,
		daysFromNotice,
		days,
		event
	};


	return extracted
}

function extractBoard3Data(json) {
	let jurisdiction = json.value.jurisdiction
	let appealDeadline = ""
	let appealDateType = ""
	let is_appeal_form = ""
	let appealFormSubmittalFormat = ""
	let appealFromSignatureRequirements = ""
	let appealEvidenceSubmissionValue = ""
	let appealEvidenceSubmissionDays = ""
	let appealPackageItems = ""
	let appealPackageSubmittalFormatValue = ""
	let appealPackageSubmittalFormatDeadline = ""
	let daysFromNotice = null
	for (let i = 0; i < json.value.hassubmission[0].has.length; i++) {
		let question = json.value.hassubmission[0].has[i]
		if (question.ajRule == "Ascertain Board Level (2) Appeal" && question.hasanswer[0].value == "No") {
			return 0;
		}
		if (question.ajRule == "Ascertain Board Level (2) Appeal Deadline Format") {
			if (question.hasanswer[0].value.length == 1) {
				appealDateType = question.hasanswer[0].value[0]
			} else {
				appealDateType = question.hasanswer[0].value
			}

			for (let j = 0; j < question.has.length; j++) {
				if (question.has && question.has[j] && question.has[j].hasanswer && question.has[j].hasanswer[0].value) {
					if (question.has[j].enabled == appealDateType) {

						if (question.has[j].hasanswer[0].value.length == 1) {
							appealDeadline = question.has[j].hasanswer[0].value[0]
						} else {
							appealDeadline = question.has[j].hasanswer[0].value
						}
						break
					}


				}
			}
		}



		if (question.ajRule == "Ascertain Board Level (2) Appeal Form") {
			if (question.hasanswer[0].value == "Yes") {
				is_appeal_form = true
			} else {
				is_appeal_form = false
			}
			for (let k = 0; k < question.has.length; k++) {
				if (question.has[k].ajRule == "Board Level (2) Form Signature Requirement(s)") {
					appealFromSignatureRequirements = question.has[k].hasanswer[0].value
				}
			}


		}

		if (question.ajRule == "Board Level (2) Form Submission Method(s)") {
			appealFormSubmittalFormat = question.hasanswer[0].value

		}
		if (question.ajRule == "Ascertain when Board Level (2) Appeal Evidence deadline") {
			appealEvidenceSubmissionValue = question.hasanswer[0].value[0]
			if (question.hasanswer[0].value[0] == "# of Days Before Hearing") {
				appealEvidenceSubmissionDays = question.has[0].hasanswer[0].value[0]
				appealEvidenceSubmissionValue = "Days Prior Hearing"
			} else if (question.hasanswer[0].value[0] == "At time of Appeal") {
				appealEvidenceSubmissionValue = "At Appeal"
			}
			else {
				appealEvidenceSubmissionDays = ""
			}
		}
		if (question.ajRule == "Board Level (2) Submission Required Items") {

			appealPackageItems = []

			if (question.hasanswer[0].value.length > 0) {
				if (question.hasanswer[0].value.includes("Income and expense statements for the current year and the previous 2 years")) {
					appealPackageItems.push("IE||3")
				}
				if (question.hasanswer[0].value.includes("Rent roll as of January 1 for the current year and rent roll as of January 1 for the previous year")) {
					appealPackageItems.push("RR||2")
				}
				// if (question.hasanswer[0].value.includes("Decision from Assessor Appeal")){
				// 	appealPackageItems.push("AAD||1")
				// }
				// if (question.hasanswer[0].value.includes("Decision from local Board Appeal")){
				// 	appealPackageItems.push("LBD||1")
				// }

			}


		}

		if (question.ajRule == "Board Level (2) Appeal Package Submission Method(s)") {
			appealPackageSubmittalFormatValue = question.hasanswer[0].value
		}
	}

	const extracted = {
		jurisdiction,
		appealDeadline,
		appealDateType,
		is_appeal_form,
		appealFormSubmittalFormat,
		appealFromSignatureRequirements,
		appealEvidenceSubmissionValue,
		appealEvidenceSubmissionDays,
		appealPackageItems,
		appealPackageSubmittalFormatValue,
		appealPackageSubmittalFormatDeadline,
		daysFromNotice
	};


	return extracted
}