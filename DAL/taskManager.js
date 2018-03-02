var path = require('path');
var SQL = require('mssql');

module.exports = DAL;

function DAL() {

}

// ---------------------------------------------
// add
// ---------------------------------------------
DAL.prototype.add = function(task, cb) {
    var query = "INSERT INTO taskManager(userId, fileName, type, message, propertyId) " +
        "VALUES(@userId, @fileName, @type, @message, @propertyId); " +
        "SELECT SCOPE_IDENTITY()";

    new SQL.Request()
        .input("userId", SQL.BigInt, task.userId)
        .input("fileName", SQL.NVarChar(250), task.fileName)
        .input("type", SQL.VarChar(50), task.type)
        .input("message", SQL.NVarChar(250), task.message)
        .input("propertyId", SQL.BigInt, task.propertyId)
        .query(query).then(function(result) {
            // First object in the result has empty key
            // To get its value, convert it to string and remove braces and quotes
            var id = JSON.stringify(result[0]).replace('{"":', '').replace('}', '');
            task.id = id;

            cb(null);
    }).catch(function(err) {
        cb(err);
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// update
// ---------------------------------------------
DAL.prototype.update = function(task, cb) {
    var query = "UPDATE TaskManager SET message = @message, " +
        "inProgress = @inProgress, isProcessed = @isProcessed, success = @success, propertyId = @propertyId " +
        "WHERE id = @id;";

    new SQL.Request()
        .input("message", SQL.NVarChar(250), task.message)
        .input("inProgress", SQL.Bit, task.inProgress)
        .input("isProcessed", SQL.Bit, task.isProcessed)
        .input("success", SQL.Bit, task.success)
        .input("id", SQL.BigInt, task.id)
        .input("propertyId", SQL.BigInt, task.propertyId)
        .query(query).then(function(result) {
            cb(null, result);
    }).catch(function(err) {
        cb(err, null);
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getTasksByUserId
// ---------------------------------------------
DAL.prototype.getTasksByUserId = function(userId, cb) {
    var query = "SELECT fileName, type, message, uploadTime, inProgress, isProcessed, success, propertyId " +
        "FROM taskManager " +
        "WHERE userId = @userId " +
        "ORDER BY uploadTime DESC, id;";

    new SQL.Request()
        .input("userId", SQL.BigInt, userId)
        .query(query).then(function(result) {
            cb(null, result);
    }).catch(function(err) {
        cb(err, null);
    });
}
// ---------------------END---------------------