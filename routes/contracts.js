var express = require('express');
var router = express.Router();
var path = require('path');
var bllFile = require(path.resolve(__dirname, '../BLL/contracts'));
var Response = require(path.resolve(__dirname, '../BLL/util/response'));
var BLL = new bllFile();

router.use(function (req, res, next) {
    if (!req.user[0].roles.contracts)
    {
        Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
        return;
    }
    next();
});

// ---------------------------------------------
// testEndPoint
// ---------------------------------------------
router.get('/', function(req, res, next) {
    res.send("contracts");
});

router.post('/addContracts', function(req, res, next) {
    BLL.addContracts(req.body, res);
});

router.post('/addSectionTemplate', function(req, res, next) {
    BLL.addSectionTemplate(req.body, res);
});

router.post('/deleteContractSection', function(req, res, next) {
    BLL.deleteContractSection(req.body, res);
});

router.post('/deleteSectionTemplate', function(req, res, next) {
    BLL.deleteSectionTemplate(req.body, res);
});

router.get('/getSectionTemplate', function(req, res, next) {
    BLL.getSectionTemplate(req.query, res);
});

router.get('/getContracts', function(req, res, next) {
    BLL.getContracts(req, res);
});

router.get('/getParticularContract', function(req, res, next) {
    BLL.getParticularContract(req.query, res);
});

router.post('/uploadContracts', function(req, res, next) {
    BLL.uploadContracts(req, res);
});

router.post('/addContractTemplate', function(req, res, next) {
    BLL.addContractTemplate(req, res);
});

router.get('/getContractTerms', function(req, res, next) {
    BLL.getContractTerms(req, res);
});

router.post('/addContractTerms', function(req, res, next) {
    BLL.addContractTerms(req.body, res);
});

router.post('/updateContractTerms', function(req, res, next) {
    BLL.updateContractTerms(req.body, res);
});

router.post('/addContract', function(req, res, next) {
    BLL.addContract(req, res);
});

router.post('/getContractsByUserId', function(req, res, next) {
    BLL.getContractsByUserId(req, res);
});

router.post('/getContractsById', function(req, res, next) {
    BLL.getContractsById(req.body, res);
});

router.post('/saveInvoice', function(req, res, next) {
    BLL.saveInvoice(req, res);
});

router.post('/getInvoiceByContractId', function(req, res, next) {
    BLL.getInvoiceByContractId(req, res);
});

router.post('/getDataforSampleCalculations', function(req, res, next) {
    BLL.getDataforSampleCalculations(req, res);
});

module.exports = router;
