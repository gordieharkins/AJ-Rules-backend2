var path = require('path');
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var loginUserName = 'Ali'; // Infutre will get logged in user name
var AppealDAL = require(path.resolve(__dirname, '../DAL/appeal'));
var DAL = new AppealDAL();

module.exports = BLL;

function BLL() {

}

// ---------------------------------------------
// getFormDataForJurisdiction
// ---------------------------------------------
BLL.prototype.getFormDataForJurisdiction = function(data, res) {
    DAL.getFormDataForJurisdiction(data, function(error, result) {
        if (error) {
        	console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
        	var form = result[0].form.properties;
        	var clauses = [];
        	for(var i = 0; i < form.clauses.length; i++){
        		var clause = {
        			clause: form.clauses[i],
        			explanation: form.clausesExp[i]
        		}

        		clauses.push(clause);
        	}

        	var faqs = [];
        	for(var i = 0; i < form.faqs.length; i++){
        		var faq = {
        			question: form.faqs[i],
        			answer: form.faqAnswers[i]
        		}

        		faqs.push(faq);
        	}

        	delete result[0].form.properties.clauses;
        	delete result[0].form.properties.clausesExp;
        	delete result[0].form.properties.faqs;
        	delete result[0].form.properties.faqAnswers;
        	result[0].form.properties["clauses"] = clauses;
        	result[0].form.properties["faqs"] = faqs;

            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------