var express = require('express');
var router = express.Router();
var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/calendar_invites/calendar_invites'));
var BLL = new bllFile();


router.post('/sendInvite', function(req, res, next) {
    BLL.postCalendarInvites(req, res);
});


module.exports = router;