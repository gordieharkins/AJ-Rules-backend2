var path = require('path');
var InvalidFileFormat = require('../errors/invalidFileFormat');
var db = require(path.resolve(__dirname, '../../DAL/graphConnection'));
var func = require(path.resolve(__dirname, '../util/functions'));
var func = require(path.resolve(__dirname, '../util/functions'));
var converter = new func();

module.exports = DAL;

// Class Constructor
function DAL() {

}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.saveSettings = function(data, userId, cb) {
	// console.log("here it is00")
    var query = `MATCH (n:user) where id(n) = {userId}
                MERGE(n)-[:settings]->(s:userSettings)
                ON MATCH SET s = {settings}
                ON CREATE SET s = {settings}`;

    var params = {
        userId: userId,
        settings: data
    }

     db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}


//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.getSettings = function(userId, cb) {
	// console.log("here it is00")
    var query = `MATCH (n:user)-[:settings]->(s:userSettings) where id(n) = {userId}
                Return properties(s) as settings, id(s) as id`;

    var params = {
        userId: userId
    }

     db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.saveEmailCode = function(userId, data, cb) {
	// console.log("here it is00")
    var query = `MATCH (n:user)-[:settings]->(s:userSettings) where id(n) = {userId}
                MERGE (s)-[:emailVerificationCode]->(e:emailCode{email: {emailId}})
                ON MATCH SET e.code = {code}, e.createdDate = {date}
                ON CREATE SET e.code = {code}, e.createdDate = {date}`;

    var params = {
        userId: userId,
        emailId: data.email,
        code: data.code,
        date: date.createdDate
    }

     db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.savePhoneCode = function(userId, data, cb) {
	// console.log("here it is00")
    var query = `MATCH (n:user)-[:settings]->(s:userSettings) where id(n) = {userId}
                MERGE (s)-[:phoneVerificationCode]->(e:phoneCode{phoneNumber: {phoneNumber}})
                ON MATCH SET e.code = {code}, e.createdDate = {date}
                ON CREATE SET e.code = {code}, e.createdDate = {date}`;

    var params = {
        userId: userId,
        phoneNumber: data.phoneNumber,
        code: data.code,
        date: data.createdDate
    }

     db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.verifyPhone = function(userId, data, cb) {
	// console.log("here it is00")
    var query = `MATCH (n:user)-[:settings]->(s:userSettings) where id(n) = {userId}
                MERGE (s)-[:phoneVerificationCode]->(e:phoneCode{phoneNumber: {phoneNumber}})
                ON MATCH SET e.code = {code}, e.createdDate = {date}
                ON CREATE SET e.code = {code}, e.createdDate = {date}`;

    var params = {
        userId: userId,
        phoneNumber: data.phoneNumber,
        code: data.code,
        date: data.createdDate
    }

     db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

