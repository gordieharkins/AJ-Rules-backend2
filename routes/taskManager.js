var express = require('express');
var router = express.Router();
var path = require('path');
var TaskManagerBLL = require(path.resolve(__dirname, '../BLL/taskManager'));
var Response = require(path.resolve(__dirname, '../BLL/util/response'));
var taskManagerBLL = new TaskManagerBLL();

router.use(function (req, res, next) {
    if (!req.user[0].roles.taskManager)
    {
        Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
        return;
    }
    next();
});

router.get('/', function(req, res, next) {
    res.send("task manager");
});

router.get('/getTasksByUserId', function(req, res, next) {
    taskManagerBLL.getTasksByUserId(req, res);
});

module.exports = router;
