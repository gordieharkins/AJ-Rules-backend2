var path = require('path');
var fs = require('fs');
var UnlinkedFilesDALFile = require(path.resolve(__dirname, '../DAL/unlinkedFiles'));
var DAL = new UnlinkedFilesDALFile();
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
// var loginUserId = 0; // Infutre will get logged in user ID
var loginUserName = 'Ali'; // Infutre will get logged in user name

module.exports = BLL;

// Class Constructor
function BLL() {

}

//----------------------------------------------
// Get Unlinked Files
//----------------------------------------------
BLL.prototype.getUnlinkedFiles = function(req, res) {
    DAL.getUnlinkedFiles(req, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}