var path = require('path');
var fs = require('fs');
var async = require('async');
// var converter = require('office-converter')();
var newsFeed = require(path.resolve(__dirname, '../DAL/newsFeed'));
var DAL = new newsFeed();
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var Response = require(path.resolve(__dirname, './util/response'));
var loginUserName = 'Ali'; // Infutre will get logged in user name
var discovery = new DiscoveryV1({
  username: '9fe8df06-099f-4462-8d45-b7cafab90013',
  password: 'lbIiKBr7Ry0s',
  version_date: '2017-10-16'
});

module.exports = BLL;

// Class Constructor
function BLL() {

}

BLL.prototype.getNewsFeed = function(data,res,next){
	var keywords = ["real estate","property","property sale"];
	var userId = data.user[0].userId;
	data = data.body;
	if(data.region.length == 0 && data.sources.length == 0 && data.time == 60){
		DAL.getNewsFeed(userId, function(error, result){
	        if (error) {
	        	console.log(error);
	            error.userName = loginUserName;
	            ErrorLogDAL.addErrorLog(error);
	            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
	            return;
	        } else {

	        	var entities = [];
	        	var sources = ["bizjournals.com","bisnow.com","globest.com","irei.com","link.globest.com"];

	        	for(var i = 0; i < result.length; i++){
	        		if((entities.indexOf(result[i].state) < 0)){
	        			entities.push(result[i].state);
	        		} 

	        		if((entities.indexOf(result[i].county) < 0)){
	        			entities.push(result[i].county);
	        		} 

	        		if((entities.indexOf(result[i].city) < 0)){
	        			entities.push(result[i].city);
	        		} 
	        	}
	        	var query = queryBuilder(keywords, entities, sources, 60);
	        	executeQuery(query, function(err, result){
	        		if (err) {
		                Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, err, res);
		            } else {
		            	result.region = entities;
		            	result.sources = sources;
			            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
		            }
	        	});
	        }
    	});
	} else {
		var query = queryBuilder(keywords, data.region, data.sources, data.time);
        // Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, query, res);
			executeQuery(query, function(err, result){
	    		if (err) {
	                Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, err, res);
	            } else {
		            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
	            }
    		});
	}
}

function executeQuery(query, cb){
	discovery.query({
            environment_id: 'system',
            collection_id: 'news',
            query: query,
            filter: '',
            return: 'title, text, url, publication_date, main_image_url'
        }, function (err, response) {
            cb(err, response);
        });
}
function queryBuilder(concepts, enitity, sources, dayOld){

	var conceptString = "";
	var enitityString = "";
	var sourcesString = "";
	var timeString = "";


	for(var i = 0; i < concepts.length; i++){
		if(i == 0){
			conceptString += '((enriched_text.concepts.text:"' + concepts[i] + '")|(enriched_title.concepts.text:"' + concepts[i] + '")';
		} else {
			conceptString += '|(enriched_text.concepts.text:"' + concepts[i] + '")|(enriched_title.concepts.text:"' + concepts[i] + '")';
		} 

		if(i == (concepts.length -1)) {
			conceptString += ')';
		}
	}


	for(var i = 0; i < enitity.length; i++){
		if(i == 0){
			enitityString += '((enriched_text.entities.text:"' + enitity[i] + '")|(enriched_title.entities.text:"' + enitity[i] + '")';
		} else {
			enitityString += '|(enriched_text.entities.text:"' + enitity[i] + '")|(enriched_title.entities.text:"' + enitity[i] + '")';
		} 

		if(i == (enitity.length - 1)) {
			enitityString += ')';
		}
	}

	for(var i = 0; i < sources.length; i++){
		if(i == 0){
			sourcesString += '((host:: "'+sources[i]+'")';

		} else {
			sourcesString += '|(host:: "'+sources[i]+'")';
		} 

		if(i == (sources.length -1)) {
			sourcesString += ')';
		}
	}

	if(dayOld == "latest"){
		console.log("nothing");
	} else {
		var timeValue = new Date();
        timeValue.setDate(timeValue.getDate()-dayOld);
        timeString +='(publication_date>=' + timeValue.toISOString() + ')';
	}
	var queryString = conceptString + ", " + enitityString + ", " + sourcesString + ", " + timeString; 
	return queryString;
}

