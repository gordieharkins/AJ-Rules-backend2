var express = require('express');
var router = express.Router();

var path = require('path');
var timelineBllFile = require(path.resolve(__dirname, '../BLL/timeline'));
var Response = require(path.resolve(__dirname, '../BLL/util/response'));
var BLL = new timelineBllFile();

router.use(function (req, res, next) {
    // //console.log(req.user[0]);
    if (!req.user[0].roles.timeline)
    {
        Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
        return;
    }
    next();
});


router.post('/getTimelineForJurisdiction', function(req, res, next) {
    BLL.getTimelineForJurisdiction(req, res);
});

router.get('/getJurisdictions', function(req, res, next) {
    BLL.getJurisdictions(req, res);
});

router.post('/markAsRead', function(req, res, next) {
    BLL.markAsRead(req, res);
});


router.get('/getNotifications', function(req, res, next) {
    BLL.getNotifications(req, res);
});

// router.get('/getJurisdictions', function(req, res, next) {
// 	//console.log("here");
//     BLL.getJurisdictions(req, res);
// });


router.post('/getAllPropertiesTimelineStatus', function(req, res, next) {
    BLL.getAllPropertiesTimelineStatus(req, res);
});


router.post('/getJurisdictionTimeline', function(req, res, next) {
    BLL.getJurisdictionTimeline(req, res);
});


router.post('/createNewInternalEvent', function(req, res, next) {
    BLL.createNewInternalEvent(req, res);
});

router.get('/getInternalEvent', function(req, res, next) {
    BLL.getInternalEvent(req, res);
});


router.get('/getInternalEvent', function(req, res, next) {
    BLL.getInternalEvent(req, res);
});

router.post('/linkInternalEvent', function(req, res, next) {
    BLL.linkInternalEvent(req, res);
});

router.post('/getTimelineForProperty', function(req, res, next) {
    BLL.getTimelineForProperty(req, res);
});

router.post('/addJurisdictionTimeline', function(req, res, next) {
    BLL.addJurisdictionTimeline(req, res);
});

router.post('/extractNotifications', function(req, res, next) {
    BLL.extractNotifications(req, res);
});

module.exports = router;
