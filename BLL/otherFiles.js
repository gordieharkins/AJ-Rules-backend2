var path = require('path');
var stream = require('stream');
var busBoy = require('busboy');
var fs = require('fs');
var async = require('async');
var OtherFilesDALFile = require(path.resolve(__dirname, '../DAL/otherFiles'));
var OtherFilesDAL = new OtherFilesDALFile();
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var ObjectStorage = require(path.resolve(__dirname, './util/objectStorage'));
var objectStorage = new ObjectStorage();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var OtherFilesPath = path.resolve(__dirname, '../public/otherFiles/');
// var loginUserId = 0; // Infutre will get logged in user ID
var loginUserName = 'Ali'; // Infutre will get logged in user name
const CONTAINER_NAME = 'OtherFiles';

module.exports = BLL;

// Class Constructor
function BLL() {

}

//----------------------------------------------
// uploadOtherFiles
//----------------------------------------------
BLL.prototype.uploadOtherFiles = function(data, res) {

    // if(!data.user[0].roles.upload_property_data){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    var propertyId = data.query.propId;
    var loginUserId = data.user[0].userId;
    var files = [];
    var description = null;
    var busboy = new busBoy({ headers: data.headers });
    data.pipe(busboy);

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        try {
            var name = path.basename(filename);
            var date = new Date();
            var uniqueName = loginUserId + '_' + date.getTime() + '_' + name;
            var fileStream = file.pipe(new stream.PassThrough());
            var fileBuffer = new Buffer('');

            file.on('data', function(data) {
                fileBuffer = Buffer.concat([fileBuffer, data]);
            });

            file.on('end', function() {
                // File details
                var details = {
                    fileName: uniqueName,
                    fileStream: fileStream,
                    originalName: name
                };

                files.push(details);
            });
        } catch (error) {
            // Log error and send response
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
            return;
        }
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      // console.log('Field [' + fieldname + ']: value: '+ val);
      description = val.split("|");
      // console.log("Description: ",description);
          });

    busboy.on('finish', function() {
        try {
            if(files.length <= 0) {
                Response.sendResponse(false, Response.REPLY_MSG.NO_FILE_UPLOADED, null, res);
            } else {
                var isError = false;
                async.forEachOf(files, function(file, i, callback) {
                    if(!isError) {
                        objectStorage.uploadFile(file.fileStream, file.fileName, CONTAINER_NAME, function(error, fileDetails) {
                            if(error) {
                                error.userName = loginUserName;
                                errorLogDAL.addErrorLog(error);
                                isError = true;
                            }

                            callback();
                        });
                    }
                }, function() {
                    if(isError) {
                        Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
                    } else {
                        // Delete the fileStream attribute as we don't need to save it in db.
                        for (var i = 0; i < files.length; i++) {
                            delete files[i].fileStream;
                        }

                        OtherFilesDAL.uploadOtherFiles(files, propertyId, loginUserId, description, function(error, result) {
                            if (error) {
                                error.userName = loginUserName;
                                ErrorLogDAL.addErrorLog(error);
                                Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
                                return;
                            }
                            Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_SUCCESS, null, res);
                        });
                    }
                });
            }
        } catch (error) {
            // Log error and send response
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// Get Other Files
//----------------------------------------------
BLL.prototype.getOtherFiles = function(data, res) {

     OtherFilesDAL.getOtherFiles(data.body,res, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
     });
}


//----------------------------------------------
// unlinkOtherFilesById
//----------------------------------------------
BLL.prototype.unlinkOtherFilesById = function(data,res,next){

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    var userId =  data.user[0].userId;

    OtherFilesDAL.unlinkOtherFilesById(data.body, userId, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UNLINK_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.UNLINK_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// deleteOtherFilesById Soft Delete
//----------------------------------------------
BLL.prototype.deleteOtherFilesById = function(data, res, next){

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }
    var userId = data.user[0].userId;
    OtherFilesDAL.deleteOtherFilesById(data.body, userId, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------
