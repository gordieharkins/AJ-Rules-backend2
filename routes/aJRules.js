var express = require('express');
var router = express.Router();

var path = require('path');
var aJRulesBllFile = require(path.resolve(__dirname, '../BLL/aJRules'));
var BLL = new aJRulesBllFile();

router.get('/', function(req, res, next) {
	res.send("properties");
});

router.get('/getAllSurveysMetaData', function(req, res, next) {
	BLL.getAllSurveysMetaData(res);
});

router.get('/getAllSurveysDataById', function(req, res, next) {
	BLL.getAllSurveysDataById(req.query.Id,res);
});

router.post('/addAJRules', function(req, res, next) {
	BLL.addAJRules(req.body,res);
});

router.post('/updateJurisdictionRules', function(req, res) {
    BLL.updateJurisdictionRules(req, res);
});

router.get('/getAllAJProperties', function(req, res, next) {
    BLL.getAllAJProperties(req, res);
});

router.get('/getFormSubmissions', function(req, res, next) {
    BLL.getFormSubmissions(req, res);
});

router.post('/addNewSubmission', function(req, res, next) {
    BLL.addNewSubmission(req, res);
});

module.exports = router;