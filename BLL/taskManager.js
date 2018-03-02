var path = require('path');
var ErrorLogDAL = require(path.resolve(__dirname, '../DAL/errorLog'));
var TaskManagerDAL = require(path.resolve(__dirname, '../DAL/taskManager'));
var Response = require(path.resolve(__dirname, './util/response'));
var errorLogDAL = new ErrorLogDAL();
var taskManagerDAL = new TaskManagerDAL();
var loginUserName = 'Ali'; // In future will get logged in user name

module.exports = BLL;

// Class Constructor
function BLL() {

}

//----------------------------------------------
// getTasksByUserId
//----------------------------------------------
BLL.prototype.getTasksByUserId = function(data, res) {
	var userId = data.user[0].userId;
    taskManagerDAL.getTasksByUserId(userId, function(error, tasks) {
        if (error) {
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, tasks, res);
        }
    });
}
// ---------------------END---------------------