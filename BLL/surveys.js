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
    let jurisdiction = json.value.jurisdiction
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
    for (let i = 0; i < json.value.hassubmission[0].has.length; i++) {
        let question = json.value.hassubmission[0].has[i]
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
//==========================================================================================================
//==========================================================================================================
//==========================================================================================================
//==========================================================================================================
//==========================================================================================================
//==========================================================================================================

//----------------------------------------------
// getFormSubmissions
//----------------------------------------------
BLL.prototype.getFormSubmissions = function(req, res) {

    console.log("DDDDDDDDDDDdd");
    if (!req || req === null || req === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    var userId = req.user[0].userId;
    var userRole = req.user[0].roles.name;
    
    console.log(req.user[0]);
    
    DAL.getFormSubmissions(userId, userRole, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            console.log(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            if(result.length > 0){
                var result = JSON.parse(JSON.stringify(result[0]));
            } else {
                var result = {};
            }
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getFormSubmissions
//----------------------------------------------
BLL.prototype.addNewSubmission = function(req, res) {
    if (!req || req === null || req === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    // console.log(req.user[0]);
    var userId = req.user[0].userId;
    var userName = req.user[0].userName;
    var time = (new Date()).getTime();
    // console.log(req.body)
    var data = JSON.parse(JSON.stringify(req.body));
    data.updatedByUserId = userId;
    data.createdAt = time;
    data.updatedAt = time;
    data.createdByUserId = userId;
    data.updatedByUserName = userName;
    data.contradict = false;
    data.status = "Not Started";
    data.total = 20;
    data.filled = 0;    
    // var formId = req.body.formId;
    
    // console.log(data);rs
    DAL.addNewSubmission(data, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            sortFormData(JSON.parse(JSON.stringify(result)), function(sortedData){
                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, sortedData[0], res);
            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getFormSubmissions
//----------------------------------------------
BLL.prototype.getSubmissionData = function(req, res) {
    if (!req || req === null || req === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    var data = req.body;
    DAL.getSubmissionData(data, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            sortFormData(JSON.parse(JSON.stringify(result)), function(sortedData){
                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, sortedData[0], res);
            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getFormSubmissions
//----------------------------------------------
BLL.prototype.updateSubmissionData = function(req, res) {
    if (!req || req === null || req === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }


    var userId = req.user[0].userId;
    var userName = req.user[0].userName;
    var data = req.body;

    DAL.updateSubmissionData(data, userName, userId, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            console.log(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
    // res.send(data);
}
// ---------------------END---------------------

//----------------------------------------------
// getFormQuestions
//----------------------------------------------
BLL.prototype.getFormQuestions = function(req, res) {
    if (!req || req === null || req === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    var data = req.body;
    DAL.getFormQuestions(data, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            sortFormQuestions(JSON.parse(JSON.stringify(result)), function(sortedData){
                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, sortedData, res);
            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getFormQuestions
//----------------------------------------------
BLL.prototype.addNewForm = function(req, res) {
    if (!req || req === null || req === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    var userData = req.user[0];
    var data = req.body;
    DAL.addNewForm(data, userData, function(error, result) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FORM_ADDITION_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.FORM_ADDITION_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getHistory
//----------------------------------------------
BLL.prototype.getHistory = function(req, res) {
    if (!req || req === null || req === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    // var userData = req.user[0];
    var data = req.body;
    DAL.getHistory(data, function(error, result) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getHistory
//----------------------------------------------
BLL.prototype.getReports = function(req, res) {
    if (!req || req === null || req === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getReports(function(error, result) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            //testS
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            var report = [];
            // res.send(result);
            sortFormData(result, function(sortedData){
                sortedData.forEach(function(value){
                    var survey = {
                        jurisdiction: value.value.jurisdiction,
                        id: value.value.jurisdiction,
                        formName: value.value.formName,
                        contradict: value.value.contradict,
                        questions: []
                    };

                    value.value.hassubmission[0].has.forEach(function(parent){
                        var parentQuestion = {
                            ajrule: parent.ajRule,
                            answer: parent.hasanswer[0].value
                        };
                        if(report.length > 0){
                            var parentIndex = report[0].questions.findIndex(function(pq){
                                return pq.ajrule == parentQuestion.ajrule;
                            });
                            survey.questions[parentIndex] = parentQuestion;
                        } else {
                            survey.questions.push(parentQuestion);
                        }
                        if(parent.has != undefined){
                            parent.has.forEach(function(child){
                                var childQuestion = {
                                    ajrule: child.ajRule,
                                    answer: child.hasanswer[0].value
                                };
                                if(report.length > 0){
                                    var childIndex = report[0].questions.findIndex(function(cq){
                                        return cq.ajrule == childQuestion.ajrule;
                                    });
                                    survey.questions[childIndex] = childQuestion;
                                } else {
                                    survey.questions.push(childQuestion);
                                }
                            });
                        }
                    });
                    report.push(survey);
                });
                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, report, res);
            });

            
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// autoSave
//----------------------------------------------
BLL.prototype.autoSave = function(req, res) {
    if (!req.body || req.body === null || req.body === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    // var userData = req.user[0];
    var data = req.body;
    DAL.autoSave(data, function(error, result) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.UPDATE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getStates
//----------------------------------------------
BLL.prototype.getStates = function(req, res) {
    if (!req || req === null || req === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    // var userData = req.user[0];
    // var data = req.body;
    DAL.getStates(function(error, result) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------
function sortFormData(data, cb){
    // console.log(formData.value.hassubmission[0].has);
    // console.log(data);
    data.forEach(function(formData){
        formData.value.hassubmission[0].has.sort(function(a,b){ return a.order - b.order});
        formData.value.hassubmission[0].has.forEach(function(question){
            // console.log(has);
            if(question.has != undefined){
                question.has.sort(function(a, b){ return a.order - b.order});
            }
        });
    });
    
    cb(data);
}

function sortFormQuestions(data, cb){
    // console.log(formData.value.hassubmission[0].has);
    // console.log(data);
   
    data.forEach(function(formData){
        formData.value.has.sort(function(a,b){ return a.order - b.order});
        formData.value.has.forEach(function(question){
            // console.log(has);
            if(question.has != undefined){
                question.has.sort(function(a, b){ return a.order - b.order});
            }
        });
    });
    
    cb(data);
}

//----------------------------------------------
// surveysToAJrules
//----------------------------------------------
BLL.prototype.surveysToAJrules = function(req, res) {
    if (!req || req === null || req === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    var data = req.body;
    DAL.getSubmissionData(data, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            sortFormData(JSON.parse(JSON.stringify(result)), function(sortedData){
                var myJson = sortedData[0]
                var params = AJruleToCypher(myJson)
                DAL.surveysToAJrules(params, function(error, result2) {
                    if (error) {
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                        Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                        return;
                    } else{
                        Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS ,result2, res);
                    }
                });
                // Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, sortedData[0], res);
            });
        }
    });
}
// ---------------------END---------------------


function AJruleToCypher(json) {
    console.log(JSON.stringify(json))
    let jurisdiction = json.value.jurisdiction
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
    for (let i = 0; i < json.value.hassubmission[0].has.length; i++) {
        let question = json.value.hassubmission[0].has[i]
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
                    break
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
    //create cypher

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
    return params;
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


//----------------------------------------------
// getFormSubmissions
//----------------------------------------------
BLL.prototype.surveyJsonToRules = function(req, res) {
    if (!req || req === null || req === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    var data = req.body;
    DAL.getSubmissionData(data, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            sortFormData(JSON.parse(JSON.stringify(result)), function(sortedData){
                // parseSurveyToRules(sortedData[0]);
                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, parseSurveyToRules(sortedData[0]), res);
            });
        }
    });
}
// ---------------------END---------------------

function parseSurveyToRules(survey){
    let temp = {
		jurisdiction: null,
		appealDeadline: null,
		appealDateType: null,
		isAppealForm: null,
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

	if (board2 == 0) {
		board2 = temp
	}

	if (board3 == 0) {
		board3 = temp
	}

	let rules = {
		jurisdiction: assessor1.jurisdiction,
		appealDeadline1: {
			deadline: assessor1.appealDeadline,
			isAppealForm: assessor1.isAppealForm,
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
			isAppealForm: board2.isAppealForm,
			type: board2.appealDateType
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
			isAppealForm: board3.isAppealForm,
			type: board3.appealDateType
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
    console.log(JSON.stringify(json));
	let jurisdiction = json.value.jurisdiction
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
					}
					
					break
				}
			}
		}

		if (daysFromNotice && question.ajRule == "Assessment Notice Mail Format") {
			let myans = question.hasanswer[0].value[0]
			for (let k = 0; k < question.has.length; k++) {
				if (question.has[k].enabled == myans) {
					let tempappealDeadline = question.has[k].hasanswer[0].value[0]
					var tdate = new Date(tempappealDeadline);
					var newdate = new Date(tdate);
					newdate.setDate(newdate.getDate() + daysFromNotice);
					appealDeadline = newdate


				}
			}


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
			} else {
				appealEvidenceSubmissionDays = ""
			}
		}
		if (question.ajRule == "Appeal Package Items") {
			appealPackageItems = []

			if (question.hasanswer[0].value.length > 0) {
				if (question.hasanswer[0].value.includes("Income and expense statements for the current year and the previous 2 years")){
					appealPackageItems.push("IE||3")
				}
				if (question.hasanswer[0].value.includes("Rent roll as of January 1 for the current year and rent roll as of January 1 for the previous year")){
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
			// console.log(appealPackageItems)
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


	return extracted
}

function extractBoard2Data(json) {
	let jurisdiction = json.value.jurisdiction
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

			for (let j = 0; j < question.has.length; j++) {
				if (question.has && question.has[j] && question.has[j].hasanswer && question.has[j].hasanswer[0].value) {
					if (question.has[j].enabled == appealDateType) {

						if (question.has[j].hasanswer[0].value.length == 1) {
							appealDeadline = question.has[j].hasanswer[0].value[0]
						} else {
							appealDeadline = question.has[j].hasanswer[0].value
						}
					}
				
					break
				}
			}
		}


		if (question.ajRule == "Ascertain Board Level Appeal Form") {
			if (question.hasanswer[0].value == "Yes") {
				isAppealForm = true
			} else {
				isAppealForm = false
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
			appealEvidenceSubmissionValue = question.hasanswer[0].value[0]
			if (question.hasanswer[0].value[0] == "# of Days Before Hearing") {
				appealEvidenceSubmissionDays = question.has[0].hasanswer[0].value[0]
			} else {
				appealEvidenceSubmissionDays = ""
			}
		}
		if (question.ajRule == "Board Level Submission Required Items") {

			appealPackageItems = []

			if (question.hasanswer[0].value.length > 0) {
				if (question.hasanswer[0].value.includes("Income and expense statements for the current year and the previous 2 years")){
					appealPackageItems.push("IE||3")
				}
				if (question.hasanswer[0].value.includes("Rent roll as of January 1 for the current year and rent roll as of January 1 for the previous year")){
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


	return extracted
}

function extractBoard3Data(json) {
	let jurisdiction = json.value.jurisdiction
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
					}

					break
				}
			}
		}



		if (question.ajRule == "Ascertain Board Level (2) Appeal Form") {
			if (question.hasanswer[0].value == "Yes") {
				isAppealForm = true
			} else {
				isAppealForm = false
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
			} else {
				appealEvidenceSubmissionDays = ""
			}
		}
		if (question.ajRule == "Board Level (2) Submission Required Items") {

			appealPackageItems = []

			if (question.hasanswer[0].value.length > 0) {
				if (question.hasanswer[0].value.includes("Income and expense statements for the current year and the previous 2 years")){
					appealPackageItems.push("IE||3")
				}
				if (question.hasanswer[0].value.includes("Rent roll as of January 1 for the current year and rent roll as of January 1 for the previous year")){
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


	return extracted
}
