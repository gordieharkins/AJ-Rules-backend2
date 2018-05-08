var express = require('express');
var router = express.Router();
// var excelParser = require('excel-parser');

var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/users'));
// var response = require(path.resolve(__dirname, '../Common/Response'));
var BLL = new bllFile();


router.post('/', function(req, res, next) {
	console.log("Body:", req.body);
	res.send("Users");
});
/* GET users listing. */
router.get('/', function(req, res, next) {

	res.send("Users");
});

router.post('/userSignIn', function(req, res, next) {
	BLL.userSignIn(req.body,res);
});

router.post('/uploadUserFile', function(req, res, next) {

	BLL.uploadUserFile(req,res);
});

router.get('/getUserDataByToken/', function(req, res, next) {
	BLL.getUserDataByToken(req.query.token,res);
});

router.get('/getAllInvitedUsers/', function(req, res, next) {
	BLL.getAllInvitedUsers(req.query.adminId,res);
});

router.post('/addSingleUserNonRef', function(req, res, next) {
	BLL.addSingleUserNonRef(req.body,res);
});

router.post('/addBulkUsersRef', function(req, res, next) {
	BLL.addBulkUsersRef(req.body,res);
});

router.post('/getUserByRole', function(req, res, next) {
	BLL.getUserByRole(req, res);
});

router.get('/getUserRoles', function(req, res, next) {
	BLL.getUserRoles(req, res);
});

router.get('/getUSstates', function(req, res, next) {
    BLL.getUSstates(req, res);
});

router.get('/downloadAppealPackage', function(req, res, next) {
    BLL.downloadAppealPackage(req, res);
});

module.exports = router;
