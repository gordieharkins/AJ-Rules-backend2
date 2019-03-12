var express = require('express');
var router = express.Router();

var path = require('path');
var alertsBLLFile = require(path.resolve(__dirname, './alerts-BLL'));
var BLL = new alertsBLLFile();

router.use(function (req, res, next) {
    
    if (!req.user[0].roles.properties){
        
        Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
        return;
    }

    if (req.body || req.query) {
        
        if (req.body.propId || req.query.propId) {

            var propId;
            var endPoint=req.path;

            if (req.body.propId) {
                propId = req.body.propId;
            } else {
                propId = req.query.propId;
            }

            if (endPoint.charAt(0) === '/') {
                endPoint = endPoint.slice(1);
            }
        
            util.getPropertyUserRoles(req.user[0].userId, parseInt(propId), endPoint, function(err,status){
                
                if (!status) {
                    Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
                    return;
                } else {
                    next();
                }
            });
        } else {
            next();
        }   
    } else {
        next();
    } 
});

router.post('/saveSettings', function(req, res, next) {
    BLL.saveSettings(req, res);
});

router.get('/getSettings', function(req, res, next) {
    BLL.getSettings(req, res);
});

router.post('/startJob', function(req, res, next) {
    BLL.startCronJob(req, res);
});


router.post('/addAlert', function(req, res, next) {
    BLL.addAlert(req, res);
});

router.post('/saveEmailCode', function(req, res, next) {
    BLL.saveEmailCode(req, res);
});

router.post('/savePhoneCode', function(req, res, next) {
    BLL.savePhoneCode(req, res);
});

router.post('/verifyEmailCode', function(req, res, next) {
    BLL.verifyEmailCode(req, res);
});

router.post('/verifyPhoneCode', function(req, res, next) {
    BLL.verifyPhoneCode(req, res);
});



module.exports = router;