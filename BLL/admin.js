var path = require('path');
// var converter = require('office-converter')();

var contracts = require(path.resolve(__dirname, '../DAL/admin'));
var DAL = new contracts();
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var Response = require(path.resolve(__dirname, './util/response'));
var loginUserName = 'Ali'; // Infutre will get logged in user name

module.exports = BLL;

// Class Constructor
function BLL() {

}

BLL.prototype.getAllUserRoles = function(data,res,next){
    DAL.getAllUserRoles(function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}

BLL.prototype.updateUserRole = function(data,res,next){
    DAL.updateUserRole(data.body, function(error, result){
        if (error) {
        	//console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}


BLL.prototype.addNewRole = function(data,res,next){
    DAL.addNewRole(data.body, function(error, result){
        if (error) {
            //console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}