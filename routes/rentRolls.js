var express = require('express');
var router = express.Router();
var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/rentRolls'));
var Response = require(path.resolve(__dirname, '../BLL/util/response'));
var UtilityFunctions = require(path.resolve(__dirname, '../BLL/util/functions'));
var BLL = new bllFile();
var util = new UtilityFunctions();

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
            }
            else {
                propId = req.query.propId;
            }

            if (endPoint.charAt(0) === '/') {
                endPoint = endPoint.slice(1);
            }
        
            util.getPropertyUserRoles(req.user[0].userId, parseInt(propId), endPoint, function(err,status){
                
                if (!status) {
                    Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
                    return;
                }
                else {
                    next();
                }
            });
        }
        else {
            next();
        }   
    }
    else {
        next();
    } 
});


router.get('/', function(req, res, next) {
    res.send("rentRolls");
});

router.post('/addPropertyRR', function(req, res, next) {
    BLL.addPropertyRR(req, res);
});

router.post('/addPropertyRRManual', function(req, res, next) {
    BLL.addPropertyRRManual(req, res);
});

router.post('/addBulkPropertyRR', function(req, res, next) {
    BLL.addBulkPropertyRR(req, res);
});

router.post('/getPropertyRR', function(req, res, next) {
    BLL.getPropertyRR(req, res);
});

router.get('/getPropertyRRUnits', function(req, res, next) {
    BLL.getPropertyRRUnits(req, res);
});

router.post('/unlinkRentRollsById', function(req, res, next) {
    BLL.unlinkRentRollsById(req, res);
});

router.post('/deleteRentRollsById', function(req, res, next) {
    BLL.deleteRentRollsById(req, res);
});

module.exports = router;
