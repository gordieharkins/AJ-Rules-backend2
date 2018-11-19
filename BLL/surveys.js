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

// ---------------------------------------------
// addSurvey
// ---------------------------------------------
BLL.prototype.getSurveysList = function (res) {
    DAL.getSurveysList(function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// addSurvey
// ---------------------------------------------
BLL.prototype.getSurveyById = function (id, res) {
    var surveys = {
        surveyName: null,
        sections: []
    };
    var surveyIds = [];


    if (!id || id === null || id === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getSurveyById(id, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            surveys.surveyName = result.sections[0].surveyName;
            for (var i = 0; i < result.sections.length; i++) {
                var section = {
                    sectionId: null,
                    name: null,
                    questions: []
                }
                if (surveyIds.indexOf(result.sections[i].sectionId) > -1) {
                    continue;
                } else {
                    surveyIds.push(result.sections[i].sectionId);
                    section.sectionId = result.sections[i].sectionId;
                    section.name = result.sections[i].section;

                    for (var j = 0; j < result.questions.length; j++) {
                        var question = {
                            questionId: null,
                            questionText: null,
                            options: null
                        }
                        if (result.questions[j].sectionId === section.sectionId) {
                            question.questionId = result.questions[j].questionId;
                            question.questionText = result.questions[j].question;
                            if (result.questions[j].options.length === 0) {
                                question.options = [];
                            } else {
                                question.options = JSON.parse(result.questions[j].options);
                            }
                            section.questions[result.questions[j].order] = question;
                            result.questions.splice(j, 1);
                            j = j - 1;
                        } else {
                            continue;
                        }
                    }

                    for (var k = 0; k < section.questions.length; k++) {
                        if (section.questions[k] == null) {
                            section.questions.splice(k, 1);
                            k = k - 1;
                        }
                    }

                    surveys.sections[result.sections[i].sectionOrder] = section;
                }
            }

            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, surveys, res);
        }
    });
}
//---------------------END---------------------


// ---------------------------------------------
// addSurvey
// ---------------------------------------------
BLL.prototype.getEditedSurveyById = function (id, res) {
    var surveys = {};
    var surveyIds = [];
    var count = 0;


    if (!id || id === null || id === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getSurveyById(id, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {

            for (var i = 0; i < result.sections.length; i++) {

                if (surveyIds.indexOf(result.sections[i].sectionId) > -1) {
                    continue;
                } else {
                    surveys[count] = [];
                    var section = {
                        key: result.sections[i].section,
                        sectionID: result.sections[i].sectionId
                    }
                    surveyIds.push(result.sections[i].sectionId);
                    surveys[count].push(section);
                    count++;

                }
            }
            for (var i = result.questions.length - 1; i >= 0; i--) {
                for (var j = 0; j < count; j++) {
                    if (result.questions[i].sectionId == surveys[j][surveys[j].length - 1].sectionID) {
                        var question = {
                            "question": result.questions[i].question,
                            "id": result.questions[i].questionId,
                            "ref_id": result.questions[i].questionId,
                            "check": true,
                            "options": JSON.parse(result.questions[i].options)
                        }
                        surveys[j].unshift(question);
                    }
                }
            }
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, surveys, res);
        }
    });
}
// ---------------------------------------------
function AJruleToCypher(json) {
    let jurisdiction = json.result.value.jurisdiction
    let appealDeadline = ""
    let appealDateType = ""
    let isAppealForm = ""
    let appealFormSubmittalFormat = ""
    let appealFromSignatureRequirements = ""
    let appealEvidenceSubmissionValue = ""
    let appealEvidenceSubmissionDays = ""
    let appealPackageItems = ""
    let appealPackageSubmittalFormatValue = ""
    let appealPackageSubmittalFormatDeadline = ""
    let daysFromNotice = null
    console.log(jurisdiction)
    for (let i = 0; i < json.result.value.hassubmission[0].has.length; i++) {
        let question = json.result.value.hassubmission[0].has[i]
        if (question.ajRule == "Appeal Deadline Format") {
            console.log(question.hasanswer[0].value.length)
            if (question.hasanswer[0].value.length == 1) {
                appealDateType = question.hasanswer[0].value[0]
            } else {
                appealDateType = question.hasanswer[0].value
            }
            console.log(appealDateType)

            for (let j = 0; j < question.has.length; j++) {
                if (question.has && question.has[j] && question.has[j].hasanswer && question.has[j].hasanswer[0].value) {
                    if (appealDateType == "A Firm Date") {

                        if (question.has[j].hasanswer[0].value.length == 1) {
                            appealDeadline = question.has[j].hasanswer[0].value[0]
                        } else {
                            appealDeadline = question.has[j].hasanswer[0].value
                        }
                    } else if (appealDateType == "Approx Deadline") {
                        daysFromNotice = question.has[j].hasanswer[0].value[0]
                    }

                    console.log(appealDeadline)
                    // break
                }
            }
        }

        if (daysFromNotice && question.ajRule == "Assessment Notice Mail Format") {
            let myans = question.hasanswer[0].value[0]
            console.log("temp", myans)
            for (let k = 0; k < question.has.length; k++) {
                if (question.has[k].enabled == myans) {
                    let tempappealDeadline = question.has[k].hasanswer[0].value[0]
                    console.log("temp", tempappealDeadline)
                    var tdate = new Date(tempappealDeadline);
                    var newdate = new Date(tdate);
                    newdate.setDate(newdate.getDate() + daysFromNotice);
                    appealDeadline = newdate
                    console.log("temp1, ", newdate)


                }
            }


            console.log(isAppealForm)
        }

        if (question.ajRule == "Appeal Form") {
            if (question.hasanswer[0].value == "Yes") {
                isAppealForm = true
            } else {
                isAppealForm = false
            }
            for (let k = 0; k < question.has.length; k++) {
                if (question.has[k].ajRule == "Appeal Form Signature Requirements") {
                    appealFromSignatureRequirements = question.has[k].hasanswer[0].value
                    console.log(appealFromSignatureRequirements)
                }
            }


            console.log(isAppealForm)
        }

        if (question.ajRule == "Appeal Form Submittal Format") {
            appealFormSubmittalFormat = question.hasanswer[0].value
            console.log(appealFormSubmittalFormat)
        }
        if (question.ajRule == "Event when evidence is due") {
            appealEvidenceSubmissionValue = question.hasanswer[0].value[0]
            console.log(appealEvidenceSubmissionValue)
            if (question.hasanswer[0].value[0] == "# of Days Before Hearing") {
                // appealEvidenceSubmissionValue = question.hasanswer[0].value
                appealEvidenceSubmissionDays = question.has[0].hasanswer[0].value[0]
                console.log(appealEvidenceSubmissionDays)
            } else {
                appealEvidenceSubmissionDays = ""
            }
        }
        if (question.ajRule == "Appeal Package Items") {
            if (question.hasanswer[0].value.length == 2) {
                appealPackageItems = ["IE||3", "RR||2"]
            } else if (question.hasanswer[0].value.length == 1 && question.hasanswer[0].value[0] == "RR 2017, RR 2018") {
                appealPackageItems = ["RR||2"]
            } else if (question.hasanswer[0].value.length == 1 && question.hasanswer[0].value[0] == "IE 2018, IE 2019, IE 2017") {
                appealPackageItems = ["IE||3"]
            } else {
                appealPackageItems = question.hasanswer[0].value
            }
            console.log(appealPackageItems)
            console.log(appealPackageItems.length)
        }

        if (question.ajRule == "Appeal Package Submittal Format") {
            appealPackageSubmittalFormatValue = question.hasanswer[0].value
            console.log(appealPackageSubmittalFormatValue)
        }
        if (question.ajRule == "Appeal Deadline Format") {

        }
    }
    const params = {
        jurisdiction,
        appealDeadline,
        appealDateType,
        isAppealForm,
        appealFormSubmittalFormat,
        appealFromSignatureRequirements,
        appealEvidenceSubmissionValue,
        appealEvidenceSubmissionDays,
        appealPackageItems,
        appealPackageSubmittalFormatValue,
        appealPackageSubmittalFormatDeadline,
        daysFromNotice
    };
    //create cypher

    DAL.addAJRules(params, function (error, result) {
        if (error) {
            // Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return result;
        } else {
            return result;
        }
    });



    // const query = 'create(jurisdiction1:jurisdictionRules{jurisdiction: {jurisdiction} }) \
    // create(jurisdiction1)-[:rule]->(appealDeadline:appealDeadline{deadline: {appealDeadline} , type: {appealDateType}, isAppealForm: {isAppealForm} }) \
    // create(jurisdiction1)-[:rule]->(appealFormSubmittalFormat:appealFormSubmittalFormat{value: {appealFormSubmittalFormat} }) \
    // create(jurisdiction1)-[:rule]->(appealFromSignatureRequirements:appealFromSignatureRequirements{value: {appealFromSignatureRequirements} }) \
    // create(jurisdiction1)-[:rule]->(appealEvidenceSubmission:appealEvidenceSubmission{value: {appealEvidenceSubmissionValue} , days: {appealEvidenceSubmissionDays} }) \
    // create(jurisdiction1)-[:rule]->(appealPackageItems:appealPackageItems{value: {appealPackageItems} }) \
    // create(jurisdiction1)-[:rule]->(appealPackageSubmittalFormat:appealPackageSubmittalFormat{value: {appealPackageSubmittalFormatValue} })'

    // // db.executeQuery(query, params);
    // console.log(query)
}
// ---------------------------------------------


// ---------------------------------------------
// addSurvey
// ---------------------------------------------
BLL.prototype.addSurvey = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.addSurvey(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// addSurvey
// ---------------------------------------------
BLL.prototype.submitSurvey = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.submitSurvey(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            console.log("*******************")
            var newResult = AJruleToCypher(data, result)
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, { "addAJRules": newResult, "addSurvey": result }, res);
            // Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------


// ---------------------------------------------
// addQuestion
// ---------------------------------------------
BLL.prototype.deleteSurvey = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.deleteSurvey(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getSubmittedSurveys
// ---------------------------------------------
BLL.prototype.getSubmittedSurveyById = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getSurveyNameById(data, function (error, surveyName) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            DAL.getSubmittedSurveyById(data, function (error, result) {
                if (error) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
                    Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                    return;
                } else {
                    var sectionIds = [];
                    var finalResult = {
                        surveyName: surveyName[0].surveyName,
                        submissionId: result[0].surveySubmissionId,
                        information: {
                            "interviewer": result[0].interviewer,
                            "phoneNumberCalled": result[0].phoneNumberCalled,
                            "taxAssessorMainWebsite": result[0].taxAssessorMainWebsite,
                            "state": result[0].state,
                            "intervieweeOfficeAddress": result[0].intervieweeOfficeAddress,
                            "assessingJurisdiction": result[0].assessingJurisdiction,
                            "interviewee": result[0].interviewee,
                            "email": result[0].email,
                            "dateCalled": result[0].dateCalled
                        },
                        sections: []
                    }
                    for (var i = 0; i < result.length; i++) {
                        var section = {
                            sectionId: null,
                            name: null,
                            questions: []
                        }

                        var question = {
                            questionId: null,
                            questionText: null,
                            options: null
                        }
                        if (sectionIds.indexOf(result[i].sectionId) > -1) {
                            for (var j = 0; j < finalResult.sections.length; j++) {
                                if (finalResult.sections[j].sectionId == result[i].sectionId) {
                                    question.questionId = result[i].questionId;
                                    question.questionText = result[i].question;
                                    if (result[i].value.length > 0) {
                                        question.options = JSON.parse(result[i].value);
                                    } else {
                                        question.options = [];
                                    }
                                    finalResult.sections[j].questions.push(question);
                                }
                            }
                        } else {
                            sectionIds.push(result[i].sectionId);
                            section.sectionId = result[i].sectionId;
                            section.name = result[i].section;
                            question.questionId = result[i].questionId;
                            question.questionText = result[i].question;
                            if (result[i].value.length > 0) {
                                question.options = JSON.parse(result[i].value);
                            } else {
                                question.options = [];
                            }

                            section.questions.push(question);
                            finalResult.sections.push(section);
                        }
                    }
                    Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
                }
            });
        }
    });

}
// ---------------------END---------------------

// ---------------------------------------------
// submitSurvey
// ---------------------------------------------
BLL.prototype.getSubmittedSurveys = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.getSubmittedSurveys(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getSubmittedSurveys(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {


            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getQuestions
// ---------------------------------------------
BLL.prototype.getQuestions = function (res) {
    DAL.getQuestions(function (error, allQuestions) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            // if options exists return options as JSON instead of string
            for (let i = 0; i < allQuestions.length; i++) {
                if (allQuestions[i].type === "options") {
                    allQuestions[i].options = JSON.parse(allQuestions[i].options);
                }
            }
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, allQuestions, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// addQuestion
// ---------------------------------------------
BLL.prototype.addQuestion = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.addQuestion(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// updateQuestion
// ---------------------------------------------
BLL.prototype.updateQuestion = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.updateQuestion(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
            return;
        } else { //RAISEERROR not working in SQL and Node JS so Error returned from procedure in Field
            if (result !== undefined) {
                if (result[0].error.indexOf("Question already in use") > -1) {
                    Response.sendResponse(false, result[0].error, null, res);
                    return;
                }
            }
            Response.sendResponse(true, Response.REPLY_MSG.UPDATE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// deleteQuestion
// ---------------------------------------------
BLL.prototype.deleteQuestion = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.deleteQuestion(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getQuestions
// ---------------------------------------------
BLL.prototype.getSections = function (res) {
    DAL.getSections(function (error, allSections) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, allSections, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// addSection
// ---------------------------------------------
BLL.prototype.addSection = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.addSection(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// updateSection
// ---------------------------------------------
BLL.prototype.updateSection = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.updateSection(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.UPDATE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// deleteSection
// ---------------------------------------------
BLL.prototype.deleteSection = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.deleteSection(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getUSstates
// ---------------------------------------------
BLL.prototype.getUSstates = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getUSstates(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// updateSubmittedForm
// ---------------------------------------------
BLL.prototype.updateSubmittedForm = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.updateSubmittedForm(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.UPDATE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// updateSubmittedForm
// ---------------------------------------------
BLL.prototype.updateSurvey = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.updateSurvey(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.UPDATE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// deleteSubmission
// ---------------------------------------------
BLL.prototype.deleteSubmission = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.deleteSubmission(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.UPDATE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------


// ---------------------------------------------
// getSurveyReport
// ---------------------------------------------
BLL.prototype.getSurveyReport = function (data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getSurveyReport(data, function (error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            var finalResult = {
                questions: [],
                jurisdictions: []
            };
            var tempJurisdictions = [];
            var questions = [];

            for (var i = 0; i < result.length; i++) {
                var question = {
                    question: result[i].question,
                    questionId: result[i].questionId,
                    options: parseOptions(result[i].options),
                    answers: []
                }
                var questionFlag = true;

                for (var k = 0; k < questions.length; k++) {
                    if (questions[k].questionId == result[i].questionId) {
                        questionFlag = false;
                        break;
                    }
                }

                if (questionFlag) {
                    questions.push(question);
                }

                // console.log(questions);

                var tempJurisdiction = {
                    jurisdiction: "",
                    questions: [],
                    questionIds: []
                }

                var jurisdictionFlag = false;
                var jurisdictionIndex = null;
                for (var j = 0; j < tempJurisdictions.length; j++) {
                    if (tempJurisdictions[j].jurisdiction == result[i].assessingJurisdiction
                        && tempJurisdictions[j].questionIds.indexOf(result[i].questionId) < 0) {
                        jurisdictionFlag = true;
                        jurisdictionIndex = j;
                        break;
                    }
                }

                if (jurisdictionFlag) {
                    // console.log("jere")
                    try {
                        tempJurisdictions[jurisdictionIndex].questionIds.push(result[i].questionId);
                        tempJurisdictions[jurisdictionIndex].questions.push(result[i]);
                    } catch (err) {
                        console.log(err);
                    }

                } else {
                    tempJurisdiction.jurisdiction = result[i].assessingJurisdiction;
                    tempJurisdiction.questionIds.push(result[i].questionId);
                    tempJurisdiction.questions.push(result[i]);
                    tempJurisdictions.push(tempJurisdiction);
                    finalResult.jurisdictions.push(result[i].assessingJurisdiction);

                }

            }

            for (var i = 0; i < questions.length; i++) {
                for (var j = 0; j < tempJurisdictions.length; j++) {
                    var answerFlag = true;
                    for (var k = 0; k < tempJurisdictions[j].questions.length; k++) {
                        if (questions[i].questionId == tempJurisdictions[j].questions[k].questionId) {
                            questions[i].answers.push(parseAnswers(tempJurisdictions[j].questions[k].value));
                            answerFlag = false;
                        }
                    }

                    if (answerFlag) {
                        questions[i].answers.push(["N/A"]);
                    }
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////

            // var max = 0;
            // var diff = 0;
            // var jurisdictions = [];
            // var flag = false;
            // for(var i = 0;i < result.length; i++){
            //     var index = null;
            //     var question = {
            //         question: result[i].question,
            //         options: parseOptions(result[i].options),
            //         answers:[]
            //     }

            //     for(var j = 0; j < questions.length;j++){
            //         if(questions[j].question == question.question){

            //             flag = true;
            //             index = j;
            //             break;
            //         }
            //     }

            //     if(!flag){
            //         question.answers.push(parseAnswers(result[i].value));
            //         questions.push(question);

            //     } else {
            //         questions[index].answers.push(parseAnswers(result[i].value));
            //         flag = false;
            //     }
            // }

            // for(var i = 0; i < questions.length;i++){
            //     if(questions[i].answers.length > max){
            //         max = questions[i].answers.length;
            //     } else if (questions[i].answers.length < max){
            //         diff = max - questions[i].answers.length;
            //         if(questions[i].question == "12.- Who do I call to get those details?"){
            //             for(var j = 0; j < diff; j++){
            //                 questions[i].answers.push("");
            //             }
            //         } else {
            //             for(var j = 0; j < diff; j++){
            //                 questions[i].answers.unshift("");
            //             }    
            //         }

            //     }
            // }



            finalResult.questions = questions;
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);

        }
    });
}
// ---------------------END---------------------


function parseOptions(option) {
    option = JSON.parse(option);

    var options = [];
    for (var i = 0; i < option.length; i++) {
        if (option[i].id == 0) {
            continue;
        } else if (option[i].id == 1) {
            continue;
        } else if (option[i].id == 2) {
            continue;
        } else if (option[i].id == 3) {
            options.push(option[i].radioLabel);
        } else if (option[i].id == 4) {
            options.push(option[i].radioLabel1);
        } else if (option[i].id == 5) {
            options.push(option[i].radioLabel);
        } else if (option[i].id == 6) {
            options.push(option[i].checkboxLabel);
        } else if (option[i].id == 7) {
            options.push(option[i].label);
        } else if (option[i].id == 8) {
            continue;
        } else if (option[i].id == 9) {
            options.push(option[i].label);
        } else if (option[i].id == 10) {
            options.push(option[i].label1);
        }
    }
    return options;
}

function parseAnswers(answer) {
    answer = JSON.parse(answer);
    var answers = [];
    for (var i = 0; i < answer.length; i++) {
        if (answer[i].id == 0) {
            answers.push(answer[i].answer.value);
        } else if (answer[i].id == 1) {
            if (answer[i].answer.state) {
                answers.push(answer[i].radioLabel);
            }
        } else if (answer[i].id == 2) {
            if (answer[i].answer.state) {
                answers.push(answer[i].checkboxLabel);
            }
        } else if (answer[i].id == 3) {
            if (answer[i].answer.state) {
                answers.push(answer[i].answer.value);
            }
        } else if (answer[i].id == 4) {
            if (answer[i].answer.state) {
                answers.push(answer[i].answer.value + " " + answer[i].radioLabel2);
            }
        } else if (answer[i].id == 5) {
            if (answer[i].answer.state) {
                answers.push(answer[i].answer.value);
            }
        } else if (answer[i].id == 6) {
            if (answer[i].answer.state) {
                answers.push(answer[i].answer.value);
            }
        } else if (answer[i].id == 7) {
            if (answer[i].answer.value != null && answer[i].answer.value != undefined && answer[i].answer.value != "") {
                answers.push(dateFormat(answer[i].answer.value, "mmmm dS, yyyy"));
            }
        } else if (answer[i].id == 8) {
            continue;
        } else if (answer[i].id == 9) {
            answers.push(answer[i].answer.value);
        } else if (answer[i].id == 10) {
            var data = answer[i].answer.inputValue + " - " + answer[i].answer.value;
            answers.push(data);
        }
    }

    return answers;
}
