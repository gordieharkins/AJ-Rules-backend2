var path = require('path');
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var aJRulesDALFile = require(path.resolve(__dirname, '../DAL/aJRules'));
var DAL = new aJRulesDALFile();
var loginUserName = 'Ali'; // Infutre will get logged in user name


module.exports = BLL;


//Class Constructor 
function BLL() {

}

// ---------------------------------------------
// getAllSurveysMetaData
// ---------------------------------------------
BLL.prototype.getAllSurveysMetaData = function(res) {
    DAL.getAllSurveysMetaData(function(error, allSurveysMetaData) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, allSurveysMetaData, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getAllSurveysDataById
// ---------------------------------------------
BLL.prototype.getAllSurveysDataById = function(id, res) {
    if (!id || id === null || id === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.getAllSurveysDataById(id, function(error, surveyMetaData){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, surveyMetaData, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// addAJRules
// ---------------------------------------------
BLL.prototype.addAJRules = function(rules, res) {
    if (!rules || rules === null || rules === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.addAJRules(rules, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------



//----------------------------------------------
// getAJPublicProperties
//----------------------------------------------
BLL.prototype.getAllAJProperties = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.getAllAJProperties(data.query, function(error, properties) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, properties, res);
        }
    });
}
// ---------------------END---------------------