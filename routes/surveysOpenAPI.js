var express = require('express');
var router = express.Router();

var path = require('path');
var surveysBLLFile = require(path.resolve(__dirname, '../BLL/surveysOpenAPI'));
var Response = require(path.resolve(__dirname, '../BLL/util/response'));
var BLL = new surveysBLLFile();

// router.use(function (req, res, next) {
//     if (!req.user[0].roles.surveys)
//     {
//         //console.log(req.user[0]);
//         Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
//         return;
//     }
//     next();
// });

router.get('/surveyJsonToRules', function(req, res, next) {
    // //console.log("here");
    BLL.surveyJsonToRules(req, res);
});

router.post('/deleteSubmissions', function(req, res, next) {
    // //console.log("here");
    BLL.deleteSubmissions(req, res);
});

module.exports = router;
