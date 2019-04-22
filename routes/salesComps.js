var express = require('express');
var router = express.Router();
var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/salesComps'));
var Response = require(path.resolve(__dirname, '../BLL/util/response'));
var UtilityFunctions = require(path.resolve(__dirname, '../BLL/util/functions'));
var BLL = new bllFile();
var util = new UtilityFunctions();
var Busboy = require('busboy');
var fs = require('fs');
const IMAGES_DIR_NAME = 'CompsImages';
var propertyImagesPath = path.resolve(__dirname, '../public/' + IMAGES_DIR_NAME);

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
    //console.log("TestSalesComps...");
});

router.post('/getZDeepCompsProperties', function(req, res) {

    BLL.getZDeepCompsProperties(req.body, res);
});

router.post('/GetDeepSearchResults', function(req, res) {

    BLL.GetDeepSearchResults(req.body, res);
});


router.post('/addCompsToPropManual', function(req, res) {
    BLL.addCompsToPropManual(req, res);
});

router.post('/addCompsImageManual/:id', function(req, res) {
    var filePath;

    var busboy = new Busboy({ headers: req.headers });
    var uniqueName = "";
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var date = new Date();
        uniqueName = req.params.id + '_' + date.getTime() + '_' + fieldname;

        var mainFile = path.join(propertyImagesPath, uniqueName);
        filePath=mainFile
        file.pipe(fs.createWriteStream(mainFile));
    });
    busboy.on('finish', function() {
        res.writeHead(200, { 'Connection': 'close' });
        var filePath2 = IMAGES_DIR_NAME + '/' + uniqueName;
        res.end(filePath2);
    });
    return req.pipe(busboy);
});

router.post('/getSavedComps', function(req, res) {

    BLL.getSavedComps(req, res);
});

router.post('/deleteCompsFromProperty', function(req, res) {
        // //console.log(req);
    BLL.deleteCompsFromProperty(req, res);
});

router.post('/getZillowPropImage', function(req, res) {

    BLL.getZillowPropImage(req.body, res);
});

router.post('/getComparables', function(req, res) {

    BLL.getComparables(req, res);
});

router.post('/saveSubjectPropertyUpdatedData', function(req, res) {

    BLL.saveSubjectPropertyUpdatedData(req.body, res);
});

router.post('/addCompsToProp', function(req, res) {
    // //console.log("Dasdas");
    BLL.addCompsToProp(req, res);
});


module.exports = router;