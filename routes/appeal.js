var express = require('express');
var router = express.Router();

var path = require('path');
var aJRulesBllFile = require(path.resolve(__dirname, '../BLL/appeal'));
var BLL = new aJRulesBllFile();

router.get('/getFormDataForJurisdiction', function(req, res, next) {
    BLL.getFormDataForJurisdiction(req.query, res);
});



module.exports = router;
