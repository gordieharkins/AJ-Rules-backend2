var express = require('express');
var router = express.Router();

var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/properties'));
var propertiesParserBLL = require(path.resolve(__dirname, '../BLL/parsers/properties/propertiesParser'));
var path = require('path');
var Response = require(path.resolve(__dirname, '../BLL/util/response'));
var UtilityFunctions = require(path.resolve(__dirname, '../BLL/util/functions'));
var BLL = new bllFile();
var util = new UtilityFunctions();
var propertiesParser = new propertiesParserBLL();


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
    res.send("properties");
});

router.post('/addPropertiesList', function(req, res, next) {
    BLL.addPropertiesList(req.body, res, req.query.userId);
});

router.post('/setMultiAccMasterSlave', function(req, res, next) {
    BLL.setMultiAccMasterSlave(req.body, res);
});

router.get('/getProperties', function(req, res, next) {
    BLL.getProperties(req, res);
});

router.post('/getMasterProperties', function(req, res, next) {
    BLL.getMasterProperties(req, res);
});

router.get('/getAllProperties', function(req, res, next) {
    BLL.getAllProperties(req, res);
});

router.post('/getAJPublicProperties', function(req, res, next) {
    // console.log("pro")
    // console.log(req.body);
	if (!req.user[0].roles.publicData)
    {
        Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
        return;
    }
    BLL.getAJPublicProperties(req, res);
});

router.get('/getSlavePropertiesByMasterId', function(req, res, next) {
    BLL.getSlavePropertiesByMasterId(req, res);
});

//--------------------------------------------
// Upload properties files.
//--------------------------------------------
router.post('/uploadPropertyFiles', function(req, res, next) {
   
    if (!req.user[0].roles.uploadProperties)
    {
        Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
        return;
    }
    
    BLL.uploadPropertyFiles(req, res);

});

//--------------------------------------------
// Update Tax Acc No.
//--------------------------------------------
router.post('/updateTaxAccNo', function(req, res, next) {
    BLL.updateTaxAccNo(req.body, req.query.userId, res);
});

//-----------------------------
// Save properties data mapping.
//----------------------------
router.post('/MapPropertiesData', function(req, res, next) {
    BLL.mapPropertiesData(req.body, res, req.query.userId)
});

//-----------------------------
// Linking Multipart Properties
//----------------------------
router.post('/multiPartLinking', function(req, res, next) {
    BLL.multiPartLinking(req.body.properties, res)
});

//-----------------------------
// Linking Multipart Properties
//----------------------------
router.post('/multiAccountLinking', function(req, res, next) {
    BLL.multiAccountLinking(req.body.properties, res)
});

//--------------------------------------------
// updateAnyNodeAttriutes and Keep History
//--------------------------------------------
router.post('/updateNodeAttributes', function(req, res, next) {
    BLL.updateNodeAttributes(req.body, res, req.query.userId);
});

router.get('/getRawProperties', function(req, res, next) {
    BLL.getRawProperties(req, res);
});

router.post('/deleteRawPropertiesByFileId', function(req, res, next) {
    BLL.deleteRawPropertiesByFileId(req.body, res);
});

router.post('/addFinalProperties', function(req, res, next) {
    BLL.addFinalProperties(req.body, res);
});

router.post('/deletePropertiesByIds', function(req, res, next) {
    BLL.deletePropertiesByIds(req.body, res, req.query.userId);
});

router.get('/getPropertiesLandingPage', function(req, res, next) {
    BLL.getPropertiesLandingPage(req, res);
});

router.post('/getPropertiesById', function(req, res, next) {
    BLL.getPropertiesById(req, res);
});

router.get('/getPropertyDetialsById', function(req, res, next) {
    BLL.getPropertyDetialsById(req, res);
});

router.post('/assignPropertyToAgent', function(req, res, next) {
    // console.log(req.body);
    BLL.assignPropertyToAgent(req, res);
});

router.post('/getAssignedUsers', function(req, res, next) {
    BLL.getAssignedUsers(req, res);
});

router.post('/removeAssignedUser', function(req, res, next) {
    BLL.removeAssignedUser(req, res);
});

router.post('/getPublicPropertyDetailsById', function(req, res, next) {
    if (!req.user[0].roles.publicData)
    {
        Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
        return;
    }
    BLL.getPublicPropertyDetailsById(req, res);
});

router.post('/getFileStatusIE', function(req, res, next) {
    BLL.getFileStatusIE(req, res);
});

router.post('/getFileStatusRR', function(req, res, next) {
    BLL.getFileStatusRR(req, res);
});

module.exports = router;
