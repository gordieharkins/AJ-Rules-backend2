var express = require('express');
var router = express.Router();

var path = require('path');
var aJRulesBllFile = require(path.resolve(__dirname, '../BLL/appeal'));
var BLL = new aJRulesBllFile();


// router.use(function (req, res, next) {
    
//     if (!req.user[0].roles.properties){
        
//         Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
//         return;
//     }

//     if (req.body || req.query) {
        
//         if (req.body.propId || req.query.propId) {

//             var propId;
//             var endPoint=req.path;

//             if (req.body.propId) {
//                 propId = req.body.propId;
//             } else {
//                 propId = req.query.propId;
//             }

//             if (endPoint.charAt(0) === '/') {
//                 endPoint = endPoint.slice(1);
//             }
        
//             util.getPropertyUserRoles(req.user[0].userId, parseInt(propId), endPoint, function(err,status){
                
//                 if (!status) {
//                     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
//                     return;
//                 } else {
//                     next();
//                 }
//             });
//         } else {
//             next();
//         }   
//     } else {
//         next();
//     } 
// });

router.get('/getFormDataForJurisdiction', function(req, res, next) {
    BLL.getFormDataForJurisdiction(req.query, res);
});

router.post('/getIESurveyInformation', function(req, res, next) {
    BLL.getIESurveyInformation(req.body, res);
});

router.post('/updateIESurveyInformation', function(req, res, next) {
    BLL.updateIESurveyInformation(req.body, res);
});

router.post('/getPropertyTimelineData', function(req, res, next) {
    BLL.getPropertyTimelineData(req, res);
});

module.exports = router;
