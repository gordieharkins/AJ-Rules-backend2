var express = require('express');
var router = express.Router();
var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/scheduler/scheduler')); //change this
var BLL = new bllFile();


router.post('/startJob', function(req, res, next) {
    BLL.startCronJob(req, res);
});

module.exports = router;
