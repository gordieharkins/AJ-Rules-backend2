var path = require('path');
var stream = require('stream');
var busBoy = require('busboy');
var fs = require('fs');
var async = require('async');
var TaxBillsDAL = require(path.resolve(__dirname, '../DAL/taxBills'));
var TBDAL = new TaxBillsDAL();
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var ObjectStorage = require(path.resolve(__dirname, './util/objectStorage'));
var objectStorage = new ObjectStorage();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var TaxbillsFilesPath = path.resolve(__dirname, '../public/taxbills/');
// var loginUserId = 0; // Infutre will get logged in user ID
var loginUserName = 'Ali'; // Infutre will get logged in user name
const CONTAINER_NAME = 'TaxBills';

module.exports = BLL;

// Class Constructor
function BLL() {

}

//----------------------------------------------
// getProperties
//----------------------------------------------
BLL.prototype.getTaxBills = function(data, res) {

    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    TBDAL.getTaxBills(data.body.propId, function(error, taxBills) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, taxBills, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// uploadTaxBillFile
//----------------------------------------------
BLL.prototype.uploadTaxBillFile = function(data, res) {

    // if(!data.user[0].roles.upload_property_data){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    var propertyId = data.query.propId;
    var loginUserId = data.user[0].userId;
    var files = [];
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
        } catch(error) {
            // Log error and send response
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
            return;
        }
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

                        TBDAL.uploadTaxBillFile(files, propertyId, loginUserId, function(error, result) {
                            if(error) {
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
        } catch(error) {
            // Log error and send response
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
        }
    });
}
// ---------------------END---------------------


//----------------------------------------------
// unlinkIEFiles
//----------------------------------------------
BLL.prototype.unlinkTaxBillsById = function(data, res){

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }
    var userId = data.user[0].userId;
    TBDAL.unlinkTaxBillsById(data.body, userId, function(error, result){
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
// deleteIEById Soft Delete
//----------------------------------------------
BLL.prototype.deleteTaxBillsById = function(data, res){

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }
    var userId = data.user[0].userId;
    TBDAL.deleteTaxBillsById(data.body, userId, function(error, result){
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
