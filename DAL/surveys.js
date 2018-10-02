var moment = require('moment-timezone');
var path = require('path');
var execute_query = require(path.resolve(__dirname, './execute_sql'));
var db = require(path.resolve(__dirname, './graphConnection'));
var SQL = require('mssql');

module.exports = DAL;

function DAL() {

}

var object = new DAL();
// ---------------------------------------------
// getSurvysList
// ---------------------------------------------
DAL.prototype.getSurveysList = function(cb) {

    var getSurveysList = `SELECT
        dbo.surveyList.id AS id,
        dbo.surveyList.surveyName AS surveyName,
        dbo.surveyList.createdBy AS createdBy,
        dbo.surveyList.link AS link,
        dbo.surveyList.createDate AS createDate,
        dbo.surveyList.modifiedDate AS modifiedDate,
        dbo.surveyList.modifiedBy AS modifiedBy
        FROM
        dbo.surveyList
        WHERE isDeleted = 0
        ORDER BY surveyList.id DESC`;

    var sqlRequest = new SQL.Request();

    sqlRequest.query(getSurveysList).then(function(result) {
        console.log("result : "+result);
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });

    // execute_query(getSurveysList, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------


// ---------------------------------------------
// getSurvysList
// ---------------------------------------------
DAL.prototype.getSurveyNameById = function(data, cb) {

    var getSurveysName = `SELECT
                        DISTINCT dbo.surveyList.surveyName,
                        dbo.surveyList.createDate
                        FROM
                        dbo.surveyList
                        INNER JOIN dbo.surveySubmissions ON dbo.surveySubmissions.surveyListId = dbo.surveyList.id
                        WHERE
                        dbo.surveySubmissions.id = @surveyId`;
    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("surveyId", SQL.Int, data.id);
    sqlRequest.query(getSurveysName).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getSurveyById single instance of a survey
// ---------------------------------------------
DAL.prototype.getSurveyById = function(id, cb) {
    id = parseInt(id);
    var getSections = `SELECT
        dbo.surveyList.surveyName,
        dbo.surveyList.createdBy,
        dbo.surveyList.createDate,
        dbo.surveyList.link,
        dbo.surveyList.id,
        dbo.sectionOrder.sectionId,
        dbo.sectionOrder.sectionOrder,
        dbo.sections.[section]
        FROM
        dbo.surveyList
        INNER JOIN dbo.sectionOrder ON dbo.sectionOrder.surveyListId = dbo.surveyList.id
        INNER JOIN dbo.sections ON dbo.sectionOrder.sectionId = dbo.sections.id
        WHERE
        dbo.surveyList.id = @surveyListId`;

    var getQuestions = `SELECT
        dbo.surveyList.surveyName,
        dbo.surveyList.createdBy,
        dbo.surveyList.createDate,
        dbo.surveyList.link,
        dbo.surveyList.id,
        dbo.surveyItem.questionId,
        dbo.surveyItem.[order],
        dbo.surveyItem.sectionId,
        dbo.questions.question,
        dbo.questions.options

        FROM
        dbo.surveyList
        INNER JOIN dbo.surveyItem ON dbo.surveyItem.surveyListId = dbo.surveyList.id
        INNER JOIN dbo.questions ON dbo.surveyItem.questionId = dbo.questions.id
        WHERE
        dbo.surveyList.id = @surveyListId`;


    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("surveyListId", SQL.Int, id);

    sqlRequest.query(getSections).then(function(result) {

        // Get Questions Query
        var sqlRequest = new SQL.Request();
        sqlRequest = sqlRequest.input("surveyListId", SQL.Int, id);

        sqlRequest.query(getQuestions).then(function(result2) {
            var finalResult = {
                sections: result,
                questions: result2
            }

            cb(null, finalResult);
        }).catch(function(err) {
            console.log("Error : "+err);
            cb(err, null);
        });
        // Get Questions Query END
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// addSurvey single instance of a survey
// with predifined Question and Orders
// ---------------------------------------------
DAL.prototype.addSurvey = function(data, cb) {
    var sqlRequest = new SQL.Request();
    var createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');

    var addSurvey = `BEGIN
        DECLARE @SurveyID INTEGER
        INSERT INTO surveyList VALUES(@surveyName,
        @createdBy, null, 0, @createdDate, null, null)
        SELECT @SurveyID = SCOPE_IDENTITY()\n`;


    sqlRequest = sqlRequest.input("surveyName", SQL.VarChar, data.surveyName);
    sqlRequest = sqlRequest.input("createdBy", SQL.BigInt(), data.createdBy);
    sqlRequest = sqlRequest.input("createdDate", SQL.DateTime2(),createdDate);

    var sectionOrderQuery = ``;

    for (var i = 0; i < data.sectionOrder.length; i++) {
        var section = data.sectionOrder[i];
        // console.log(section);
        sectionOrderQuery += `INSERT INTO sectionOrder 
            VALUES(@sectionId`+i+`, @SurveyID, @sectionOrder`+i+`);\n`;

        sqlRequest = sqlRequest.input("sectionId"+i, SQL.Int, section.sectionId);
        sqlRequest = sqlRequest.input("sectionOrder"+i, SQL.Int, section.sectionOrder);
    }
    // console.log(sectionOrderQuery);
    addSurvey += sectionOrderQuery;

    var surveyItemQuery = ``;

    for (var j = 0; j < data.surveyItems.length; j++) {
        var survey = data.surveyItems[j];

        surveyItemQuery += `INSERT INTO surveyItem 
            VALUES(@questionId`+j+`,@questionOrder`+j+`,@sectionsId`+j+`,@SurveyID, 0);\n`;

        sqlRequest = sqlRequest.input("sectionsId"+j, SQL.Int, survey.sectionId);
        sqlRequest = sqlRequest.input("questionOrder"+j, SQL.Int, survey.questionOrder);
        sqlRequest = sqlRequest.input("questionId"+j, SQL.Int, survey.questionId);

    }
    addSurvey += surveyItemQuery;
    addSurvey += `\nEND`;
    // console.log(addSurvey);

    sqlRequest.query(addSurvey).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(addSurvey, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// deleteSurvey
// ---------------------------------------------
DAL.prototype.deleteSurvey = function(data, cb) {
    var deleteQuestion = `UPDATE surveyList
		SET isDeleted = 1
		WHERE id = @id;`;

    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("id", SQL.Int, data.id);
    sqlRequest.query(deleteQuestion).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(deleteQuestion, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// getSubmittedSurveys
// ---------------------------------------------
DAL.prototype.getSubmittedSurveys = function(data, cb) {
    var getSubmittedSurveysQuery = `SELECT * FROM surveySubmissions Where surveyListId = @surveyId AND isDeleted = 0`;
    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("surveyId", SQL.Int, data.id);
    sqlRequest.query(getSubmittedSurveysQuery).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// submitSurvey
// ---------------------------------------------
DAL.prototype.submitSurvey = function(data, cb) {
    var submitSurveyQuery = `INSERT INTO surveySubmissions (interviewer, dateCalled, phoneNumberCalled,taxAssessorMainWebsite, state, assessingJurisdiction,interviewee,intervieweeOfficeAddress,surveyListId,email,isDeleted)
                            VALUES(@interviewer, @dateCalled,@phoneNumberCalled,@taxAssessorMainWebsite,@state,@assessingJurisdiction,@interviewee,@intervieweeOfficeAddress,@surveyId, @email, 0) 
                            DECLARE @submissionId INTEGER
                            SELECT @submissionId = SCOPE_IDENTITY();`;

    var sqlRequest = new SQL.Request();
    for(var i = 0; i < data.sections.length; i++){
        for(var j = 0; j < data.sections[i].questions.length;j++){
            var options = JSON.stringify(data.sections[i].questions[j].options);
            submitSurveyQuery += `INSERT INTO responses(sectionId, questionId, value, surveySubmissionId) 
                                   VALUES (@sectionId`+i+`,@questionId`+i+""+j+`,@answer`+i+""+j+`,@submissionId);`;
            sqlRequest = sqlRequest.input("questionId"+i+""+j, SQL.Int, data.sections[i].questions[j].questionId);
            sqlRequest = sqlRequest.input("answer"+i+""+j, SQL.Text, options);
        }
        sqlRequest = sqlRequest.input("sectionId"+i, SQL.Int, data.sections[i].sectionId);
    }
    sqlRequest = sqlRequest.input("surveyId", SQL.Int, data.surveyId);
    sqlRequest = sqlRequest.input("interviewer", SQL.VarChar(), data.information.interviewer);
    sqlRequest = sqlRequest.input("taxAssessorMainWebsite", SQL.VarChar(), data.information.taxAssessorMainWebsite);
    sqlRequest = sqlRequest.input("phoneNumberCalled", SQL.VarChar(), data.information.phoneNumberCalled);
    sqlRequest = sqlRequest.input("state", SQL.VarChar(), data.information.state);
    sqlRequest = sqlRequest.input("intervieweeOfficeAddress",SQL.VarChar(), data.information.intervieweeOfficeAddress);
    sqlRequest = sqlRequest.input("assessingJurisdiction",SQL.VarChar(), data.information.assessingJurisdiction);
    sqlRequest = sqlRequest.input("interviewee", SQL.VarChar(), data.information.interviewee);
    sqlRequest = sqlRequest.input("email", SQL.VarChar(), data.information.email);
    sqlRequest = sqlRequest.input("dateCalled", SQL.VarChar(), data.information.dateCalled);
    // sqlRequest = sqlRequest.input("submissionName", SQL.VarChar(), data.information.submissionName);


    sqlRequest.query(submitSurveyQuery).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// submitSurvey
// ---------------------------------------------q
DAL.prototype.getSubmittedSurveyById = function(data, cb) {
    var submitSurveyQuery = `SELECT
                    dbo.responses.id,
                    dbo.sections.[section],
                    dbo.questions.question,
                    dbo.responses.[value],
                    dbo.responses.sectionId,
                    dbo.responses.questionId,
                    dbo.responses.surveySubmissionId,
                    dbo.surveySubmissions.interviewer,
                    dbo.surveySubmissions.dateCalled,
                    dbo.surveySubmissions.phoneNumberCalled,
                    dbo.surveySubmissions.taxAssessorMainWebsite,
                    dbo.surveySubmissions.state,
                    dbo.surveySubmissions.assessingJurisdiction,
                    dbo.surveySubmissions.interviewee,
                    dbo.surveySubmissions.intervieweeOfficeAddress,
                    dbo.surveySubmissions.email
                    FROM
                    dbo.responses
                    INNER JOIN dbo.surveySubmissions ON dbo.responses.surveySubmissionId = dbo.surveySubmissions.id
                    INNER JOIN dbo.questions ON dbo.responses.questionId = dbo.questions.id
                    INNER JOIN dbo.sections ON dbo.responses.sectionId = dbo.sections.id
                    WHERE
                    dbo.surveySubmissions.id = @submissionId`;
    // console.log(submitSurveyQuery);
    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("submissionId", SQL.Int, data.id);
    sqlRequest.query(submitSurveyQuery).then(function(result) {
        // console.log("result : "+result);
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getQuestions
// ---------------------------------------------
DAL.prototype.getQuestions = function(cb) {
    var getQuestions = `SELECT
		questions.id AS id,
		questions.ref_id as ref_id,
        questions.question AS questionText,
		questions.options AS options,
		questions.version as version
		FROM questions
		WHERE
		questions.isDeleted = 0
		ORDER BY ref_id`;

    var sqlRequest = new SQL.Request();
    sqlRequest.query(getQuestions).then(function(result) {
        // console.log("result : "+result);
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// addQuestion
// ---------------------------------------------
DAL.prototype.addQuestion = function(data, cb) {

    var addQuestion = `INSERT INTO questions(question, options, isDeleted, version)
		VALUES ('${data.questionText}','${data.options}', 0, 1); DECLARE @id INTEGER
		    SELECT @id = SCOPE_IDENTITY() UPDATE questions SET ref_id = @id where id = @id`;

    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("question", SQL.Text, data.questionText);
    sqlRequest = sqlRequest.input("options", SQL.Text, data.options);
    sqlRequest.query(addQuestion).then(function(result) {
        // console.log("result : "+result);
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(addQuestion, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// updateQuestion
// ---------------------------------------------
// DAL.prototype.updateQuestion = function(data, cb) {
//
//     var updateQuestionQuery = `BEGIN
//         DECLARE @err_message nvarchar(255)
//         IF EXISTS (SELECT id FROM surveyItem WHERE questionId = @questionId)
//             BEGIN
//                 SET @err_message = 'Question already in use in SurveyItem.'
//                 SELECT @err_message AS error
//            END
//         ELSE
//             BEGIN
//                 UPDATE questions
//                 SET question = @questionText,
//                     options = @options
//                 WHERE questions.id = @questionId;
//           END
//         END`;
//
//     var sqlRequest = new SQL.Request();
//     sqlRequest = sqlRequest.input("questionId", SQL.Int, data.id);
//     sqlRequest = sqlRequest.input("questionText", SQL.Text, data.questionText);
//     sqlRequest = sqlRequest.input("options", SQL.Text, data.options);
//
//     sqlRequest.query(updateQuestionQuery).then(function(result) {
//         console.log("result : "+result);
//         cb(null, result);
//     }).catch(function(err) {
//         console.log("Error : "+err);
//         cb(err, null);
//     });
// }

DAL.prototype.updateQuestion = function(data, cb) {
    var updateQuestionQuery = `BEGIN
                IF EXISTS (SELECT id FROM responses WHERE questionId = @questionId)
                    BEGIN
                        DECLARE @version INTEGER
                        SELECT @version = MAX(version) FROM questions WHERE ref_id = @refId
                        INSERT INTO questions(question, options, isDeleted, ref_id, version) 
                        VALUES(@questionText,@options, 0,@questionId,@version + 1 )
                   END
                ELSE
                    BEGIN
                        UPDATE questions
                        SET question = @questionText,
                            options = @options
                        WHERE questions.id = @questionId
                    END
                END`;
    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("questionId", SQL.Int, data.id);
    sqlRequest = sqlRequest.input("refId", SQL.Int, data.ref_id);
    sqlRequest = sqlRequest.input("questionText", SQL.Text, data.questionText);
    sqlRequest = sqlRequest.input("options", SQL.Text, data.options);


    console.log(data.options);

    sqlRequest.query(updateQuestionQuery).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
}
// ---------------------END---------------------



// ---------------------------------------------
// deleteQuestion
// ---------------------------------------------
DAL.prototype.deleteQuestion = function(data, cb) {
    var deleteQuestion = `UPDATE questions
		SET questions.isDeleted = 1
		WHERE questions.id = @id;`;

    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("id", SQL.Int, data.id);
    sqlRequest.query(deleteQuestion).then(function(result) {
        // console.log("result : "+result);
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(deleteQuestion, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// getSections
// ---------------------------------------------
DAL.prototype.getSections = function(cb) {
    var getSections = `SELECT
		sections.id AS sectionId,
		sections.section AS section
		FROM sections
		WHERE sections.isDeleted = 0`;

    var sqlRequest = new SQL.Request();
    sqlRequest.query(getSections).then(function(result) {
        // console.log("result : "+result);
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// addSection
// ---------------------------------------------
DAL.prototype.addSection = function(data, cb) {
    var addSection = `INSERT INTO sections
		VALUES (@section,0);`;


    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("section", SQL.VarChar, data.sectionText);
    sqlRequest.query(addSection).then(function(result) {
        // console.log("result : "+result);
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(addSection, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// updateSection
// ---------------------------------------------
DAL.prototype.updateSection = function(data, cb) {

    var updateSection = `UPDATE sections
		SET section = @section
		WHERE sections.id = @id ;`;

    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("section", SQL.Text, data.sectionText);
    sqlRequest = sqlRequest.input("id", SQL.Int, data.id);

    sqlRequest.query(updateSection).then(function(result) {
        // console.log("result : "+result);
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(updateSection, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// deleteSection
// ---------------------------------------------
DAL.prototype.deleteSection = function(data, cb) {
    var deleteSection = `UPDATE sections
		SET isDeleted = 1
		WHERE sections.id = ` + data.id + `;`;

    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("id", SQL.Int, data.id);

    sqlRequest.query(deleteSection).then(function(result) {
        // console.log("result : "+result);
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(deleteSection, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// getUSstates
// ---------------------------------------------
DAL.prototype.getUSstates = function(data, cb) {
    var getStates = `SELECT (s.state_name+ ' '+ s.state_code) AS States FROM states s;`;

    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("id", SQL.Int, data.id);

    sqlRequest.query(getStates).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(deleteSection, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// updateSubmittedForm
// ---------------------------------------------
DAL.prototype.updateSubmittedForm = function(data, cb) {
    var updateSubmittedForm = `UPDATE surveySubmissions SET
                    interviewer = @interviewer,
                    dateCalled = @dateCalled,
                    phoneNumberCalled = @phoneNumberCalled,
                    taxAssessorMainWebsite = @taxAssessorMainWebsite,
                    state = @state,
                    assessingJurisdiction = @assessingJurisdiction,
                    interviewee = @interviewee,
                    intervieweeOfficeAddress = @intervieweeOfficeAddress,
                    email = @email 
                    WHERE id = @submissionId;`;

    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("interviewer", SQL.VarChar(), data.information.interviewer);
    sqlRequest = sqlRequest.input("taxAssessorMainWebsite", SQL.VarChar(), data.information.taxAssessorMainWebsite);
    sqlRequest = sqlRequest.input("phoneNumberCalled", SQL.VarChar(), data.information.phoneNumberCalled);
    sqlRequest = sqlRequest.input("state", SQL.VarChar(), data.information.state);
    sqlRequest = sqlRequest.input("intervieweeOfficeAddress",SQL.VarChar(), data.information.intervieweeOfficeAddress);
    sqlRequest = sqlRequest.input("assessingJurisdiction",SQL.VarChar(), data.information.assessingJurisdiction);
    sqlRequest = sqlRequest.input("interviewee", SQL.VarChar(), data.information.interviewee);
    sqlRequest = sqlRequest.input("email", SQL.VarChar(), data.information.email);
    sqlRequest = sqlRequest.input("dateCalled", SQL.DateTime2(), data.information.dateCalled);
    sqlRequest = sqlRequest.input("submissionId", SQL.Int, data.submissionId);


    for(var i = 0;i < data.sections.length; i++){

        for(var j = 0; j < data.sections[i].questions.length; j++ ){
            var options = JSON.stringify(data.sections[i].questions[j].options);
            updateSubmittedForm += `UPDATE responses 
                                    SET value = @options`+i+""+j+` 
                                    WHERE sectionId = @sectionId`+i+
                ` AND questionId = @questionId`+i+""+j+`
                                     AND surveySubmissionId = @submissionId;`;

            sqlRequest = sqlRequest.input("questionId"+i+""+j, SQL.Int, data.sections[i].questions[j].questionId);
            sqlRequest = sqlRequest.input("options"+i+""+j, SQL.Text, options);
        }
        sqlRequest = sqlRequest.input("sectionId"+i, SQL.Int, data.sections[i].sectionId);
    }
    sqlRequest.query(updateSubmittedForm).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(deleteSection, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// getUSstates
// ---------------------------------------------
DAL.prototype.deleteSubmission = function(data, cb) {
    var getStates = `UPDATE surveySubmissions SET isDeleted = 1 WHERE id = @id;`;

    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("id", SQL.Int, data.id);

    sqlRequest.query(getStates).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(deleteSection, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// getUSstates
// ---------------------------------------------
DAL.prototype.updateSurvey = function(data, cb) {
    var modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');

    var updateSurvey = `UPDATE surveyList SET 
                         link = @link, modifiedBy = @modifiedBy, modifiedDate = @modifiedDate WHERE id = @surveyId; `;

    updateSurvey += `DELETE FROM sectionOrder WHERE surveyListId = @surveyId;
                     DELETE FROM surveyItem WHERE surveyListId = @surveyId;`



    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("surveyName", SQL.VarChar, data.surveyName);
    sqlRequest = sqlRequest.input("link", SQL.VarChar, data.link);
    sqlRequest = sqlRequest.input("modifiedBy", SQL.BigInt, data.modifiedBy);
    sqlRequest = sqlRequest.input("modifiedDate", SQL.DateTime2(), modifiedDate);
    sqlRequest = sqlRequest.input("surveyId", SQL.Int, data.surveyId);

    var sectionOrderQuery = ``;

    for (var i = 0; i < data.sectionOrder.length; i++) {
        var section = data.sectionOrder[i];
        // console.log(section);
        sectionOrderQuery += `INSERT INTO sectionOrder 
            VALUES(@sectionId`+i+`, @surveyId, @sectionOrder`+i+`);\n`;

        sqlRequest = sqlRequest.input("sectionId"+i, SQL.Int, section.sectionId);
        sqlRequest = sqlRequest.input("sectionOrder"+i, SQL.Int, section.sectionOrder);
    }
    // console.log(sectionOrderQuery);
    updateSurvey += sectionOrderQuery;

    var surveyItemQuery = ``;

    for (var j = 0; j < data.surveyItems.length; j++) {
        var survey = data.surveyItems[j];

        surveyItemQuery += `INSERT INTO surveyItem 
            VALUES(@questionId`+j+`,@questionOrder`+j+`,@sectionsId`+j+`,@surveyId, 0);\n`;

        sqlRequest = sqlRequest.input("sectionsId"+j, SQL.Int, survey.sectionId);
        sqlRequest = sqlRequest.input("questionOrder"+j, SQL.Int, survey.questionOrder);
        sqlRequest = sqlRequest.input("questionId"+j, SQL.Int, survey.questionId);

    }
    updateSurvey += surveyItemQuery;


    sqlRequest.query(updateSurvey).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(deleteSection, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// getUSstates
// ---------------------------------------------
DAL.prototype.getSurveyReport = function(data, cb) {
    var getReport = `SELECT
                    dbo.surveyList.id,
                    dbo.surveySubmissions.surveyListId,
                    dbo.surveySubmissions.assessingJurisdiction,
                    dbo.responses.[value],
                    dbo.questions.question,
                    dbo.questions.options,
                    dbo.questions.id as questionId,
                    dbo.questions.ref_id as refId
                    
                    FROM
                    dbo.surveyList
                    INNER JOIN dbo.surveySubmissions ON dbo.surveySubmissions.surveyListId = dbo.surveyList.id
                    INNER JOIN dbo.responses ON dbo.responses.surveySubmissionId = dbo.surveySubmissions.id
                    INNER JOIN dbo.questions ON dbo.responses.questionId = dbo.questions.id
                    WHERE
                    dbo.surveyList.id = @id AND dbo.surveySubmissions.isDeleted = 0
                    ORDER BY refId
                    `;

    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("id", SQL.Int, data.id);

    sqlRequest.query(getReport).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(deleteSection, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------


//====================================================================================================
//====================================================================================================
//====================================================================================================
//====================================================================================================
//====================================================================================================
//====================================================================================================

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.getFormSubmissions = function(cb) {
	// var query = `MATCH a = (:surveyForm)-[:version]->(version:formVersion)-[:hasSubmission]-(:surveySubmission)
	// with collect(a) as paths
	// CALL apoc.convert.toTree(paths) yield value
    // RETURN value`;
    
    var query = `MATCH (survey:surveyForm)-[:version]->(version:formVersion)
    OPTIONAL MATCH (version)-[:hasSubmission]-(submission:surveySubmission)
    RETURN collect(DISTINCT version) as versions, collect(submission) as submissions, survey`
	db.cypher({
		query: query
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.addNewSubmission = function(formId, data, cb) {
    var params = {
        formId: formId,
        data: data
    }
    var query = `MATCH (form: formVersion) where id(form) = {formId}
    CREATE(sub:surveySubmission{data})
    CREATE(form)-[:hasSubmission]->(sub)            
    WITH * 
    MATCH (form)-[:HAS*]->(question) 
    CREATE(ans: answer{value: []})
    CREATE(question)-[:hasAnswer]->(ans)
    CREATE(sub)-[:HAS]->(ans)
    RETURN DISTINCT id(sub) as submissionId`;
	db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        if(results.length>0){
            var data = results[0];
            object.getSubmissionData(data, function(error, result){
                cb(err, result);
            });
        } else {
            cb("Failed", null);
        }
    });
}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.getSubmissionData = function(data, cb) {
    var params = {
        submissionId: data.submissionId
    }
    var query = `match path = (sub:surveySubmission)<-[:hasSubmission]-(:formVersion)-[:HAS*]->(a)-[:hasAnswer]->(:answer) where id(sub) = {submissionId}
    with collect(path) as paths
    CALL apoc.convert.toTree(paths) yield value
    RETURN value`;
	db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.updateSubmissionData = function(data, userName, userId, cb) {
    var time = (new Date()).getTime();
    var params = {
        submissionId: data.submissionId,
        answers: data.answers, 
        time: time,
        userName: userName,
        userId: userId,
        surveyeeName: data.surveyeeName,
        phone: data.phone,
        contradict: data.contradict,
        total: data.total,
        filled: data.filled,
        status: data.status
    }
    var query = `MATCH(sub:surveySubmission) where id(sub) = {submissionId}
                SET sub.updatedByUserName = {userName}, sub.updatedByUserId = {userId}, 
                sub.updatedAt = {time}, sub.phone = {phone}, sub.contradict = {contradict},
                sub.total = {total}, sub.filled = {filled}, sub.status = {status}\n`;

    data.answers.forEach(function(answer, index){
        params['answerId'+index] = answer._id;
        params['answerValue'+index] = answer.value;
        params['contradict'+index] = answer.contradict;
        params['comment'+ index] = answer.comment;

        query += `
        WITH *
        MATCH(a`+index+`:answer) where id(a`+index+`) = {answerId`+index+`} SET a`+index+`.value = {answerValue`+index+`}, a`+index+`.contradict = {contradict`+index+`}, a`+index+`.comment = {comment`+index+`} \n
        CREATE(history`+index+`:history{updatedByUserId: {userId}, updatedByUserName: {userName}, updatedAT: {time}, 
            answer: {answerValue`+index+`}, surveyeeName: {surveyeeName}})
        CREATE(a`+index+`)-[:hasHistory]->(history`+index+`)\n`;
    });
	db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.getFormQuestions = function(data, cb) {
    // var params = {
    //     submissionId: data.submissionId
    // }
    var query = `match path = (:formVersion)-[:HAS*]->(a)
    with collect(path) as paths
    CALL apoc.convert.toTree(paths) yield value
    RETURN value`;
	db.cypher({
        query: query
    }, function(err, results) {
        cb(err, results);
    });
}


//--------------------------------------------------------
// addNewForm
//--------------------------------------------------------
DAL.prototype.addNewForm = function(data, userData, cb) {
    var params = {
        userName: userData.userName,
        userId: userData.userId,
        formName: data.formName,
        createdAt: (new Date()).getTime()
    }
    var query = `MATCH(survey: surveyForm) where id(survey) = 9946540
    MERGE(survey)-[:version]-(form:formVersion{formName: {formName}, created_at: {createdAt}, created_by_userId: {userId}, created_by_username: {userName}})\n`;
    for(var i = 0; i < data.questions.length; i++){
        var question = JSON.parse(JSON.stringify(data.questions[i]));
        delete question.has;
        params['question'+i] = question;
        query += `CREATE(question`+i+`:surveyQuestion{question`+i+`})
                CREATE(form)-[:HAS]->(question`+i+`)\n`;
        if(data.questions[i].has != undefined){
            for(var j = 0; j < data.questions[i].has.length; j++){
                params['child'+i+""+j] = data.questions[i].has[j];
                query += `CREATE(child`+i+""+j+`:childQuestion{child`+i+""+j+`})
                CREATE(question`+i+`)-[:HAS]->(child`+i+""+j+`)\n`;
            }
        }
    }

    // var query = ``;
    console.log(params);
	db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.getHistory = function(data, cb) {
    var params = {
        answerId: data.answerId
    }
    var query = `MATCH(answer)-[:hasHistory]->(history:history) where id(answer) = {answerId} return history ORDER BY history.updatedAt DESC`;
	db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.getReports = function(cb) {
    // var params = {
    //     answerId: data.answerId
    // }
    var query = `match path = (sub:surveySubmission)<-[:hasSubmission]-(:formVersion)-[:HAS*]->(a)-[:hasAnswer]->(:answer)
    with collect(path) as paths
    CALL apoc.convert.toTree(paths) yield value
    RETURN value`;
	db.cypher({
        query: query,
        // params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// autoSave
//--------------------------------------------------------
DAL.prototype.autoSave = function(data, cb) {
    var params = {
        answerId: data._id,
        contradiction: data.contradict,
        answerValue: data.value
    }

    var query = `MATCH(ans:answer) WHERE id(ans) = {answerId}
                SET ans.value = {answerValue}, ans.contradict = {contradiction}`;
	db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}