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
BLL.prototype.getSurveysList = function(res) {
    DAL.getSurveysList(function(error, result) {
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
BLL.prototype.getSurveyById = function(id, res) {
    var surveys = {
        surveyName: null,
        sections: []
    };
    var surveyIds = [];


    if (!id || id === null || id === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getSurveyById(id, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            surveys.surveyName = result.sections[0].surveyName;
            for(var i = 0;i < result.sections.length; i++){
                var section = {
                    sectionId: null,
                    name: null,
                    questions: []
                }
                if(surveyIds.indexOf(result.sections[i].sectionId) > -1){
                    continue;
                } else {
                    surveyIds.push(result.sections[i].sectionId);
                    section.sectionId = result.sections[i].sectionId;
                    section.name = result.sections[i].section;

                    for(var j = 0;j < result.questions.length; j++){
                        var question = {
                            questionId: null,
                            questionText: null,
                            options: null
                        }
                        if(result.questions[j].sectionId === section.sectionId){
                            question.questionId = result.questions[j].questionId;
                            question.questionText = result.questions[j].question;
                            if(result.questions[j].options.length === 0){
                                question.options = [];
                            } else {
                                question.options = JSON.parse(result.questions[j].options);
                            }
                            section.questions[result.questions[j].order] = question;
                            result.questions.splice(j,1);
                            j = j - 1;
                        } else {
                            continue;
                        }
                    }

                    for(var k = 0;k < section.questions.length;k++){
                        if(section.questions[k] == null){
                            section.questions.splice(k,1);
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
BLL.prototype.getEditedSurveyById = function(id, res) {
    var surveys = {};
    var surveyIds = [];
    var count = 0;


    if (!id || id === null || id === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getSurveyById(id, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {

            for(var i = 0; i < result.sections.length; i++){

                if(surveyIds.indexOf(result.sections[i].sectionId) > -1){
                  continue;
                } else {
                    surveys[count] = [];
                    var section = {
                        key : result.sections[i].section,
                        sectionID: result.sections[i].sectionId
                    }
                    surveyIds.push(result.sections[i].sectionId);
                    surveys[count].push(section);
                    count++;

                }
            }
            for(var i = result.questions.length-1;i >= 0; i--){
                for(var j = 0; j < count; j++){
                    if(result.questions[i].sectionId == surveys[j][surveys[j].length -1].sectionID){
                        var question = {
                            "question": result.questions[i].question,
                            "id":  result.questions[i].questionId,
                            "ref_id":  result.questions[i].questionId,
                            "check":  true,
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
// addSurvey
// ---------------------------------------------
BLL.prototype.addSurvey = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.addSurvey(data, function(error, result) {
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
BLL.prototype.submitSurvey = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.submitSurvey(data, function(error, result) {
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
// addQuestion
// ---------------------------------------------
BLL.prototype.deleteSurvey = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.deleteSurvey(data, function(error, result) {
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
BLL.prototype.getSubmittedSurveyById = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getSurveyNameById(data, function(error, surveyName) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            DAL.getSubmittedSurveyById(data, function(error, result) {
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
                            "email":result[0].email,
                            "dateCalled": result[0].dateCalled
                        },
                        sections: []
                    }
                    for(var i = 0;i < result.length;i++){
                        var section = {
                            sectionId : null,
                            name: null,
                            questions:[]
                        }

                        var question = {
                            questionId: null,
                            questionText: null,
                            options: null
                        }
                        if(sectionIds.indexOf(result[i].sectionId) > -1){
                            for(var j = 0; j < finalResult.sections.length; j++){
                                if(finalResult.sections[j].sectionId == result[i].sectionId){
                                    question.questionId = result[i].questionId;
                                    question.questionText = result[i].question;
                                    if(result[i].value.length > 0){
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
                            if(result[i].value.length > 0){
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
BLL.prototype.getSubmittedSurveys = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.getSubmittedSurveys(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getSubmittedSurveys(data, function(error, result) {
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
BLL.prototype.getQuestions = function(res) {
    DAL.getQuestions(function(error, allQuestions) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            // if options exists return options as JSON instead of string
            for(let i = 0;i < allQuestions.length;i++){
                if(allQuestions[i].type === "options"){
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
BLL.prototype.addQuestion = function(data, res) {
	if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.addQuestion(data, function(error, result) {
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
BLL.prototype.updateQuestion = function(data, res) {
	if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.updateQuestion(data, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
            return;
        } else { //RAISEERROR not working in SQL and Node JS so Error returned from procedure in Field
            if(result !== undefined){
                if(result[0].error.indexOf("Question already in use") > -1){
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
BLL.prototype.deleteQuestion = function(data, res) {
	if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.deleteQuestion(data, function(error, result) {
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
BLL.prototype.getSections = function(res) {
    DAL.getSections(function(error, allSections) {
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
BLL.prototype.addSection = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.addSection(data, function(error, result) {
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
BLL.prototype.updateSection = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.updateSection(data, function(error, result) {
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
BLL.prototype.deleteSection = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.deleteSection(data, function(error, result) {
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
BLL.prototype.getUSstates = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getUSstates(data, function(error, result) {
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
BLL.prototype.updateSubmittedForm = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.updateSubmittedForm(data, function(error, result) {
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
BLL.prototype.updateSurvey = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.updateSurvey(data, function(error, result) {
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
BLL.prototype.deleteSubmission = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.deleteSubmission(data, function(error, result) {
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
BLL.prototype.getSurveyReport = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getSurveyReport(data, function(error, result) {
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

            for(var i = 0; i < result.length; i++){
                var question = {
                    question: result[i].question,
                    questionId: result[i].questionId,
                    options: parseOptions(result[i].options),
                    answers: []
                }
                var questionFlag = true;

                for(var k = 0; k < questions.length; k++){
                    if(questions[k].questionId == result[i].questionId){
                        questionFlag = false;
                        break;
                    }
                }

                if(questionFlag){
                    questions.push(question);
                }

                // console.log(questions);

                var tempJurisdiction = {
                    jurisdiction:"",
                    questions: [],
                    questionIds:[]
                }

                var jurisdictionFlag = false;
                var jurisdictionIndex = null;
                for(var j = 0;j < tempJurisdictions.length;j++){
                    if(tempJurisdictions[j].jurisdiction == result[i].assessingJurisdiction
                        && tempJurisdictions[j].questionIds.indexOf(result[i].questionId) < 0){
                        jurisdictionFlag = true;
                        jurisdictionIndex = j;
                        break;
                    } 
                }

                if(jurisdictionFlag){
                    // console.log("jere")
                    try{
                        tempJurisdictions[jurisdictionIndex].questionIds.push(result[i].questionId);
                        tempJurisdictions[jurisdictionIndex].questions.push(result[i]);
                    } catch (err){
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

            for(var i = 0; i < questions.length; i++){
                for(var j = 0; j < tempJurisdictions.length; j++){
                    var answerFlag = true;
                    for(var k = 0; k < tempJurisdictions[j].questions.length; k++){
                        if(questions[i].questionId == tempJurisdictions[j].questions[k].questionId){
                            questions[i].answers.push(parseAnswers(tempJurisdictions[j].questions[k].value));
                            answerFlag = false;
                        }
                    }

                    if(answerFlag){
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


function parseOptions(option){
    option = JSON.parse(option);

    var options = [];
    for(var i = 0;i < option.length;i++){
        if(option[i].id == 0){
            continue;
        } else if(option[i].id == 1){
            continue;
        } else if(option[i].id == 2){
            continue;
        } else if(option[i].id == 3){
            options.push(option[i].radioLabel);
        } else if(option[i].id == 4){
            options.push(option[i].radioLabel1);
        } else if(option[i].id == 5){
            options.push(option[i].radioLabel);
        } else if(option[i].id == 6){
            options.push(option[i].checkboxLabel);
        } else if(option[i].id == 7){
            options.push(option[i].label);
        } else if(option[i].id == 8){
            continue;
        } else if(option[i].id == 9){
            options.push(option[i].label);
        } else if(option[i].id == 10){
            options.push(option[i].label1);
        }
    }
    return options;
}

function parseAnswers(answer) {
    answer = JSON.parse(answer);
    var answers = [];
    for(var i = 0;i < answer.length;i++){
        if(answer[i].id == 0){
            answers.push(answer[i].answer.value);
        } else if(answer[i].id == 1){
            if(answer[i].answer.state){
                answers.push(answer[i].radioLabel);
            }
        } else if(answer[i].id == 2){
            if(answer[i].answer.state){
                answers.push(answer[i].checkboxLabel);
            }
        } else if(answer[i].id == 3){
            if(answer[i].answer.state){
                answers.push(answer[i].answer.value);
            }
        } else if(answer[i].id == 4){
            if(answer[i].answer.state){
                answers.push(answer[i].answer.value +" "+answer[i].radioLabel2);
            }
        } else if(answer[i].id == 5){
            if(answer[i].answer.state){
                answers.push(answer[i].answer.value);
            }
        } else if(answer[i].id == 6){
            if(answer[i].answer.state){
                answers.push(answer[i].answer.value);
            }
        } else if(answer[i].id == 7){
            if(answer[i].answer.value != null && answer[i].answer.value != undefined && answer[i].answer.value != ""){
                answers.push(dateFormat(answer[i].answer.value, "mmmm dS, yyyy"));
            }
        } else if(answer[i].id == 8){
            continue;
        } else if(answer[i].id == 9){
            answers.push(answer[i].answer.value);
        } else if(answer[i].id == 10){
            var data = answer[i].answer.inputValue +" - "+ answer[i].answer.value;
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
BLL.prototype.getFormSubmissions = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.getFormSubmissions(function(error, result) {
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
    var data = JSON.parse(JSON.stringify(req.body.formData));
    data.updatedByUserId = userId;
    data.createdAt = time;
    data.updatedAt = time;
    data.createdByUserId = userId;
    data.updatedByUserName = userName;
    data.contradict = false;
    data.status = "Not Started";
    data.total = 20;
    data.filled = 0;    
    var formId = req.body.formId;
    
    // console.log(data);rs
    DAL.addNewSubmission(formId, data, function(error, result) {
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
            sortFormData(JSON.parse(JSON.stringify(result)), function(sortedData){
                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, sortedData[0], res);
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
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            var report = [];
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


function sortFormData(data, cb){
    // console.log(formData.value.hassubmission[0].has);
    console.log(data);
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