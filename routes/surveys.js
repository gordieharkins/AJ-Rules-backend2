var express = require('express');
var router = express.Router();

var path = require('path');
var surveysBLLFile = require(path.resolve(__dirname, '../BLL/surveys'));
var Response = require(path.resolve(__dirname, '../BLL/util/response'));
var BLL = new surveysBLLFile();

router.use(function (req, res, next) {
    if (!req.user[0].roles.surveys)
    {
        Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
        return;
    }
    next();
});

router.get('/', function(req, res, next) {
    res.send("properties");
});

router.get('/getSurveysList', function(req, res, next) {
    BLL.getSurveysList(res);
});

router.get('/getSurveyById', function(req, res, next) {
    BLL.getSurveyById(req.query.id, res);
});

router.get('/getEditedSurveyById', function(req, res, next) {
    BLL.getEditedSurveyById(req.query.id, res);
});

router.post('/addSurvey', function(req, res, next) {
    BLL.addSurvey(req.body, res);
});

router.get('/getQuestions', function(req, res, next) {
    BLL.getQuestions(res);
});

router.post('/addQuestion', function(req, res, next) {
    BLL.addQuestion(req.body, res);
});

router.post('/updateQuestion', function(req, res, next) {
    BLL.updateQuestion(req.body, res);
});

router.post('/deleteQuestion', function(req, res, next) {
    BLL.deleteQuestion(req.body, res);
});

router.get('/getSections', function(req, res, next) {
    BLL.getSections(res);
});

router.post('/addSection', function(req, res, next) {
    BLL.addSection(req.body, res);
});

router.post('/updateSection', function(req, res, next) {
    BLL.updateSection(req.body, res);
});

router.post('/deleteSection', function(req, res, next) {
    BLL.deleteSection(req.body, res);
});

router.post('/deleteSurvey', function(req, res, next) {
    BLL.deleteSurvey(req.body, res);
});

router.get('/getSubmittedSurveys', function(req, res, next) {
    BLL.getSubmittedSurveys(req.query, res);
});

router.post('/submitSurvey', function(req, res, next) {
    BLL.submitSurvey(req.body, res);
});

router.get('/getSubmittedSurveyById', function(req, res, next) {
    BLL.getSubmittedSurveyById(req.query, res);
});

router.get('/getUSstates', function(req, res, next) {
    res.send("ok");
    // BLL.getUSstates(req, res);
});

router.post('/updateSubmittedForm', function(req, res, next) {
    BLL.updateSubmittedForm(req.body, res);
});

router.post('/updateSurvey', function(req, res, next) {
    BLL.updateSurvey(req.body, res);
});


router.get('/getSurveyReport', function(req, res, next) {
    BLL.getSurveyReport(req.query, res);
});

router.post('/deleteSubmission', function(req, res, next) {
    BLL.deleteSubmission(req.body, res);
});

router.get('/getFormSubmissions', function(req, res, next) {
    BLL.getFormSubmissions(req, res);
});

router.post('/addNewSubmission', function(req, res, next) {
    // console.log("here");
    BLL.addNewSubmission(req, res);
});

router.post('/getSubmissionData', function(req, res, next) {
    // console.log("here");
    BLL.getSubmissionData(req, res);
});

router.post('/updateSubmissionData', function(req, res, next) {
    // console.log("here");
    BLL.updateSubmissionData(req, res);
});

router.get('/getFormQuestions', function(req, res, next) {
    // console.log("here");
    BLL.getFormQuestions(req, res);
});

router.post('/addNewForm', function(req, res, next) {
    // console.log("here");
    BLL.addNewForm(req, res);
});

router.post('/getHistory', function(req, res, next) {
    // console.log("here");
    BLL.getHistory(req, res);
});

router.get('/getReports', function(req, res, next) {
    // console.log("here");
    BLL.getReports(req, res);
});

module.exports = router;
