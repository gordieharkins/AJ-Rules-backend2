var moment = require('moment-timezone');
var path = require('path');
var InvalidFileFormat = require('../BLL/errors/invalidFileFormat');
var db = require(path.resolve(__dirname, './graphConnection'));
var func = require(path.resolve(__dirname, '../BLL/util/functions'));
var converter = new func();

module.exports = DAL;

// Class Constructor 
function DAL() {

}

// ---------------------------------------------
// Single RR adding against a propertyId
// ---------------------------------------------
DAL.prototype.addPropertyRR = function(rentRolls, propertyId, userId, cb) {
    // console.log("in DAL");
    // console.log("RR: ",rentRolls)
    // console.log("propertyId: ", propertyId);
    // console.log("userId: ", userId);
    propertyId = parseInt(propertyId);
    // console.log("userId: ", userId);
    var params = {
        propertyId:propertyId
    };
    var query = "MATCH (prop:property) where id(prop) = {propertyId}";
    var count = 0;
    var i = 0;
    for (var k = 0; k < rentRolls.length; k++) {
        var tempData = "";
        rentRolls[k].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        rentRolls[k].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        rentRolls[k].createdBy = userId;
        rentRolls[k].modifiedBy = userId;
        rentRolls[k].isDeleted = false;
        tempData = JSON.stringify(rentRolls[k]);
        tempData = JSON.parse(tempData);
        delete tempData.tenants;

        params['RR'+k] = tempData;

        query += "\nCREATE (rentRoll" + k + ":RR{RR"+k+"})" +
            "\nCREATE (rentRoll" + k + ")-[rel" + k + ":AS_OF{year:'" + tempData.asOfDate + "'}]->(prop)";

        for (i = 0; i < rentRolls[k].tenants.length; i++, count++) {
            var tenants = "tenants" + count;
            var rel_t = "rel_t" + count;

            rentRolls[k].tenants[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
            rentRolls[k].tenants[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
            rentRolls[k].tenants[i].createdBy = userId;
            rentRolls[k].tenants[i].modifiedBy = userId;
            
            params['RR'+k+'Tenant'+i] = rentRolls[k].tenants[i];
            
            query += "\nCREATE (" + tenants + ":tenants{RR"+k+"Tenant"+i+"})" +
                "\nCREATE (rentRoll" + k + ")-[" + rel_t + ":OF]->(" + tenants + ")";
        }
    }
    // console.log(query);
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        // console.log("errors: ",err);
        // console.log("results: ",results);
        // console.log("errors: ",err);
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// Add Bulk Properties and Assigned to User
// ---------------------------------------------
DAL.prototype.addPropertyRRManual = function(propertyRRData, userId, cb) {

    var tempData = "";
    var propertyId = parseInt(propertyRRData.propId);
    userId = parseInt(userId);
    var asOfDate = propertyRRData.asOfDate;
    delete propertyRRData.propertyId;

    // Defining query params
    var params = {
        propertyId:propertyId,
        asOfDate:asOfDate
    }

    // Adding default fields
    propertyRRData.uuidFileName = "toBeGenerated";
    propertyRRData.createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    propertyRRData.modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    propertyRRData.createdBy = userId;
    propertyRRData.modifiedBy = userId;
    propertyRRData.isDeleted = false;
    

    // Assigning IE data without tenants to query params
    tempData = JSON.stringify(propertyRRData);
    tempData = JSON.parse(tempData);
    delete tempData.tenants;
    params.propertyRRData = tempData;
    
    // Query Building
    var query = `MATCH (prop:property) where id(prop) = {propertyId}
        CREATE (RR:RR{propertyRRData})
        CREATE (RR)-[rel:AS_OF{year:{asOfDate}}]->(prop)`;

    for (var i = 0; i < propertyRRData.tenants.length; i++) {
        var tenants = "tenants" + i;
        var tenantsRel = "relTenants" + i;
        
        // Adding default fields
        propertyRRData.tenants[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        propertyRRData.tenants[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        propertyRRData.tenants[i].createdBy = userId;
        propertyRRData.tenants[i].modifiedBy = userId;
        
        query += `\nCREATE (` + tenants + `:tenants{` + 'tenant' + i + `})
            CREATE (RR)-[` + tenantsRel + `:OF]->(` + tenants + `)`;

        // Adding each tenants to query params
        params['tenant' + i] = propertyRRData.tenants[i];
    }
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// addBulkPropertyRR
// ---------------------------------------------
DAL.prototype.addBulkPropertyRR = function(propertiesRR, userId, cb) {
    userId = parseInt(userId);
    var params = {
        userId:userId
    };
    var count = 0;
    var query = `\nMATCH (user:user) WHERE id(user) = {userId}`;
    var query2 = `\nMERGE (user)-[rel:unlinkedFilesNode]->(uF:unlinkedFiles)`;
    var linkedCount = 0;
    var unlinkedCount = 0;
    var unlinkedArr = [];

    var i = 0;
    for (var k = 0; k < propertiesRR.length; k++) {

        var tempData = "";
        propertiesRR[k].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        propertiesRR[k].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        propertiesRR[k].createdBy = userId;
        propertiesRR[k].modifiedBy = userId;
        propertiesRR[k].isDeleted = false;
        tempData = JSON.stringify(propertiesRR[k]);
        tempData = JSON.parse(tempData);
        delete tempData.tenants;

        var prop = "prop" + k + "" + i;
        var RR = "RR" + k + "" + i;
        var rel = "rel" + k + "" + i;

        params['RR'+k] = tempData;

        if (propertiesRR[k].propertyId !== -1) {
            linkedCount++;
            query += "\nMATCH (" + prop + ":property) where id(" + prop + ") = " + propertiesRR[k].propertyId;
            query2 += "\nCREATE (" + RR + ":RR{RR"+k+"})" +
                "\nCREATE (" + RR + ")-[" + rel + ":AS_OF{year:'" + tempData.asOfDate + "'}]->(" + prop + ")";

        } else {
            unlinkedCount++;
            unlinkedArr.push({ fileName: propertiesRR[k].fileName, sheetName: propertiesRR[k].sheetName });
            var uploadDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
            query2 += "\nCREATE (" + RR + ":RR{RR"+k+"})" +
                "\nCREATE (" + RR + ")-[" + rel + ":RR{uploadDate:\"" + uploadDate + "\"}]->(uF)";
        }
        for (i = 0; i < propertiesRR[k].tenants.length; i++, count++) {
            var tenants = "tenants" + k + "" + i;
            var rel_t = "rel_t" + k + "" + i;
            propertiesRR[k].tenants[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
            propertiesRR[k].tenants[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
            propertiesRR[k].tenants[i].createdBy = userId;
            propertiesRR[k].tenants[i].modifiedBy = userId;

            params['RR'+k+'Tenant'+i] = propertiesRR[k].tenants[i];
            
            query2 += "\nCREATE (" + tenants + ":tenants{RR"+k+"Tenant"+i+"})" +
                "\nCREATE (" + RR + ")-[" + rel_t + ":OF]->(" + tenants + ")";
        }
    }
    query += query2;

    var linkedUnlinkedFiles = {
        linked: linkedCount,
        unlinkedCount: unlinkedCount,
        unlinkedFiles: unlinkedArr
    }

    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results, linkedUnlinkedFiles);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// getPropertyRR
// ---------------------------------------------
DAL.prototype.getPropertyRR = function(propertyIds, cb) {
    // propertyIds = parseInt(propertyIds);
    // var query = "MATCH (prop:property)<-[rel:AS_OF]-(RR:RR) where id(prop) IN {propertyIds} OPTIONAL MATCH (RR)-[rel2:OF]->(tenants) return RR,rel.year as asOfYear,collect(properties(tenants)) AS tenants ORDER BY id(tenants)";
    var query = `MATCH (prop:property)<-[rel:AS_OF]-(RR:RR) 
        where id(prop) IN {propertyIds} AND RR.isDeleted <> true AND RR.parsed[1] = 'true'
        with RR, rel
        OPTIONAL MATCH (RR)-[rel2:OF]->(tenants) 
        WITH RR, rel, id(tenants) AS tId, tenants
        ORDER BY tId
        return RR, rel.year as asOfYear, collect(properties(tenants)) AS tenants`;
    db.cypher({
        query: query,
        params:{
            propertyIds:propertyIds
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// unlinkRentRollsById 
// ---------------------------------------------
DAL.prototype.unlinkRentRollsById = function(data, userId, cb) {

    var uploadDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    
    var query = `MATCH (user:user) WHERE id(user) = {userId}
        MATCH (RR:RR)-[rel2:AS_OF]->(prop) WHERE id(RR) IN ` + JSON.stringify(data.rentRollsIds) + ` 
        MERGE (user)-[rel:unlinkedFilesNode]->(uF:unlinkedFiles)
        CREATE (RR)-[rel3:RR]->(uF)
        DELETE rel2`;

    db.cypher({
        query: query,
        params:{
            userId: userId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// deleteRentRollsById
// ---------------------------------------------
DAL.prototype.deleteRentRollsById = function(data, userId, cb) {

    var deleteDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    
    var query = `MATCH (RR:RR) WHERE id(RR) IN ` + JSON.stringify(data.rentRollsIds) + ` 
        SET RR.isDeleted = true
        SET RR.deleteDate = {deleteDate}
        SET RR.deletedBy = {deletedBy}`;

    db.cypher({
        query: query,
        params:{
            deletedBy: userId,
            deleteDate:deleteDate
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

DAL.prototype.addUnparsedPropertyRR = function(rentRolls, propertyId, userId, cb) {
    // console.log("in DAL unparsed");
    // console.log("RR: ",rentRolls)
    // console.log("propertyId: ", propertyId);
    // console.log("userId: ", userId);
    propertyId = parseInt(propertyId);
    // console.log("userId: ", userId);
    var params = {
        propertyId:propertyId
    };
    var query = "MATCH (prop:property) where id(prop) = {propertyId}";
    var count = 0;
    var i = 0;
    for (var k = 0; k < rentRolls.length; k++) {
        var tempData = "";
        rentRolls[k].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        rentRolls[k].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        rentRolls[k].createdBy = userId;
        rentRolls[k].modifiedBy = userId;
        rentRolls[k].isDeleted = false;
        tempData = JSON.stringify(rentRolls[k]);
        tempData = JSON.parse(tempData);
        delete tempData.tenants;

        params['RR'+k] = tempData;
        // console.log("tempData.asOfDate umar: ",tempData.asOfDate);
        query += "\nCREATE (rentRoll" + k + ":RR{RR"+k+"})" +
            "\nCREATE (rentRoll" + k + ")-[rel" + k + ":AS_OF{year:'" + "As of Date,unknown" + "'}]->(prop)";

        for (i = 0; i < rentRolls[k].tenants.length; i++, count++) {
            var tenants = "tenants" + count;
            var rel_t = "rel_t" + count;

            rentRolls[k].tenants[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
            rentRolls[k].tenants[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
            rentRolls[k].tenants[i].createdBy = userId;
            rentRolls[k].tenants[i].modifiedBy = userId;
            // rentRolls[k].asOfDate = ["As of Date","unknown","1","4"];
            // console.log(rentRolls[k].tenants[i]);
            params['RR'+k+'Tenant'+i] = rentRolls[k].tenants[i];
            
            query += "\nCREATE (" + tenants + ":tenants{RR"+k+"Tenant"+i+"})" +
                "\nCREATE (rentRoll" + k + ")-[" + rel_t + ":OF]->(" + tenants + ")";
        }
    }
    // console.log("query: ",query);
    // console.log("params: ",params);
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        // console.log("errors: ",err);
        // console.log("results: ",results);
        // console.log("errors: ",err);
        cb(err, results);
    });
};
// ---------------------END---------------------