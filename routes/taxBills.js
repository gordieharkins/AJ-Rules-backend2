var express = require('express');
var router = express.Router();
var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/taxBills'));
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
    res.send("taxBills");
});

//--------------------------------------------
// Upload Taxbills files.
//--------------------------------------------
router.post('/uploadTaxBillFile', function(req, res, next) {
    BLL.uploadTaxBillFile(req, res);
});

//--------------------------------------------
// Upload Taxbills files.
//--------------------------------------------
router.post('/getTaxBills', function(req, res, next) {
    BLL.getTaxBills(req, res);
});

// ---------------------------------------------
// unlinkTaxBillsById
// ---------------------------------------------
router.post('/unlinkTaxBillsById', function(req, res, next) {
    BLL.unlinkTaxBillsById(req, res);
});
// ---------------------END---------------------

// ---------------------------------------------
// deleteTaxBillsById
// ---------------------------------------------
router.post('/deleteTaxBillsById', function(req, res, next) {
    BLL.deleteTaxBillsById(req, res);
});
// ---------------------END---------------------

router.get('/getAJPublicProperties', function(req, res, next) {
    BLL.getAJPublicProperties(req, res);
});

module.exports = router;
