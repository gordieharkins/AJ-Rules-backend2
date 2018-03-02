var express = require('express');
var router = express.Router();
var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/admin'));
var Response = require(path.resolve(__dirname, '../BLL/util/response'));
var BLL = new bllFile();

router.use(function (req, res, next) {
    if (req.user[0].roles.name != "Admin"){
        Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
        return;
    } else {
        next();
    } 
});

router.get('/getAllUserRoles', function(req, res, next) {
    BLL.getAllUserRoles(req, res);
});

router.post('/updateUserRole', function(req, res, next) {
    BLL.updateUserRole(req, res);
});

router.post('/addNewRole', function(req, res, next) {
    BLL.addNewRole(req, res);
});

module.exports = router;