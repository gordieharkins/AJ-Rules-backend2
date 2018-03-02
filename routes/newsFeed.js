var express = require('express');
var router = express.Router();
// var excelParser = require('excel-parser');

var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/newsFeed'));
var Response = require(path.resolve(__dirname, '../BLL/util/response'));
// var response = require(path.resolve(__dirname, '../Common/Response'));
var BLL = new bllFile();

router.use(function (req, res, next) {
    if (!req.user[0].roles.newsFeed)
    {
        Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
        return;
    }
    next();
});

router.post('/getNewsFeed', function(req, res, next) {
	BLL.getNewsFeed(req,res);
});

module.exports = router;