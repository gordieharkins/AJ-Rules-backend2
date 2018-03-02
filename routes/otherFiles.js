var express = require('express');
var router = express.Router();
var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/otherFiles'));
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
    res.send("otherFiles");
});

//--------------------------------------------
// Upload other files.
//--------------------------------------------
router.post('/uploadOtherFiles', function(req, res, next) {
    BLL.uploadOtherFiles(req, res);
});

//--------------------------------------------
// Upload other files.
//--------------------------------------------
router.post('/getOtherFiles', function(req, res, next) {
    BLL.getOtherFiles(req, res);
});

// ---------------------------------------------
// unlinkOtherFilesById
// ---------------------------------------------
router.post('/unlinkOtherFilesById', function(req, res, next) {
    BLL.unlinkOtherFilesById(req, res);
});
// ---------------------END---------------------

// ---------------------------------------------
// deleteOtherFilesById
// ---------------------------------------------
router.post('/deleteOtherFilesById', function(req, res, next) {
    BLL.deleteOtherFilesById(req, res);
});
// ---------------------END---------------------

module.exports = router;
