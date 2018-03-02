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



router.get('/getAllAJProperties', function(req, res, next) {
    BLL.getAllAJProperties(req, res);
});

module.exports = router;