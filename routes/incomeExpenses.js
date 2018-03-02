var express = require('express');
var router = express.Router();
var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/incomeExpenses'));
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


// ---------------------------------------------
// testEndPoint
// ---------------------------------------------
router.get('/', function(req, res, next) {
    res.send("incomeExpenses");
});
// ---------------------END---------------------

// ---------------------------------------------
// addPropertyIE
// ---------------------------------------------
router.post('/addPropertyIE', function(req, res, next) {
    BLL.addPropertyIE(req, res);
});
// ---------------------END---------------------

// ---------------------------------------------
// addPropertyIEManual through form fill
// ---------------------------------------------
router.post('/addPropertyIEManual', function(req, res, next) {
    BLL.addPropertyIEManual(req, res);
});
// ---------------------END---------------------

// ---------------------------------------------
// addBulkPropertyIE
// ---------------------------------------------
router.post('/addBulkPropertyIE', function(req, res, next) {
    BLL.addBulkPropertyIE(req, res);
});
// ---------------------END---------------------

// ---------------------------------------------
// getPropertyIE
// ---------------------------------------------
router.post('/getPropertyIE', function(req, res, next) {
    BLL.getPropertyIE(req, res); 
});
// ---------------------END---------------------

// ---------------------------------------------
// dataReductionIE
// ---------------------------------------------
router.post('/dataReductionIE', function(req, res, next) {
    BLL.dataReductionIE(req, res);
});
// ---------------------END---------------------

// ---------------------------------------------
// propertyValuationIE
// ---------------------------------------------
router.post('/propertyValuationIE', function(req, res, next) {
    BLL.propertyValuationIE(req, res);
});
// ---------------------END---------------------

// ---------------------------------------------
// linkIeFiles
// ---------------------------------------------
router.post('/linkIeFiles', function(req, res, next) {
    BLL.linkIEFiles(req, res);
});
// ---------------------END---------------------

// ---------------------------------------------
// unlinkIeFiles
// ---------------------------------------------
router.post('/unlinkIEFiles', function(req, res, next) {
    BLL.unlinkIEFiles(req, res);
});
// ---------------------END---------------------

// ---------------------------------------------
// deleteRentRoll
// ---------------------------------------------
router.post('/deleteIEById', function(req, res, next) {
    BLL.deleteIEById(req, res);
});
// ---------------------END---------------------

module.exports = router;
