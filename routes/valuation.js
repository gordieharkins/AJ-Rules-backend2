var express = require('express');
var router = express.Router();
var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/valuation')); //change this
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
                }
                else {
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

router.post('/', function(req, res, next) {
    BLL.getValuationData(req, res);
});

router.post('/save-form', function(req, res, next) {
    BLL.addValuationForm(req, res);
});

router.post('/get-modal', function(req, res, next) {
    BLL.getModalData(req, res);
});

router.post('/get-evidence-files', function(req, res, next) {
    BLL.getEvidenceFiles(req, res);
});

router.post('/get-evidence-by-Id', function(req, res, next) {
    BLL.getEvidenceFilesById(req, res);
});

router.post('/get-forms-by-propertyId', function(req, res, next) {
    BLL.getFormsByPropertyId(req, res);
});

router.get('/get-forms-by-formId', function(req, res, next) {
    BLL.getFormsByFormId(req, res);
});

router.post('/replace-valuation-form', function(req, res, next) {
    BLL.replaceValuationForm(req, res);
});

router.post('/save-work-space', function(req, res, next) {
    BLL.saveWorkSpace(req, res);
});

router.post('/replace-work-space', function(req, res, next) {
    BLL.replaceWorkSpace(req, res);
});

router.post('/get-work-space', function(req, res, next) {
    BLL.getWorkSpace(req, res);
});

router.post('/delete-valuation-form', function(req, res, next) {
    BLL.deleteValuationForm(req, res);
});

router.post('/createAppealPackage', function(req, res, next) {
    BLL.createAppealPackage(req, res);
});

module.exports = router;
