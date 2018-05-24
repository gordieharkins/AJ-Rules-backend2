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
// Single IE adding against a propertyId
// ---------------------------------------------
DAL.prototype.addPropertyIE = function(propertyIE, propertyId, userId, cb) {
    // console.log("propertyIE: ",propertyIE);
    // console.log("propertyId: ",propertyId);
    // console.log("userId: ",userId);
    // console.log("*********************************************************");
    // console.log(propertyIE);
    console.log("here is tafkasf");
    userId = parseInt(userId);
    var params = {
        propertyId:parseInt(propertyId)
    }
    var query = "MATCH (prop:property) where id(prop) = {propertyId}";
    for (var i = 0; i < propertyIE.length; i++) {
        propertyIE[i].uuidFileName = "toBeGenerated";
        propertyIE[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        propertyIE[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        propertyIE[i].createdBy = userId;
        propertyIE[i].modifiedBy = userId;
        propertyIE[i].isDeleted = false;

        params['IE'+i] = propertyIE[i];
        // console.log("params: ",params[IE0]);
        query += "\nCREATE (IE" + i + ":IE{IE" + i + "})" +
            "\nCREATE (IE" + i + ")-[rel" + i + ":OF{IEYear:\"" + propertyIE[i].IEYear + "\"}]->(prop)";
            // console.log("test query: ",query);
        
    }
    // console.log("query: ",query);
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// Add Bulk Properties and Assigned to User
// ---------------------------------------------
DAL.prototype.addPropertyIEManual = function(propertyIEData, userId, cb) {
    var propertyId = propertyIEData.propId;
    var IEYear = propertyIEData.IEYear[1];
    delete propertyIEData.propertyId;

    propertyIEData.uuidFileName = "toBeGenerated";
    propertyIEData.createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    propertyIEData.modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    propertyIEData.createdBy = userId;
    propertyIEData.modifiedBy = userId;
    propertyIEData.isDeleted = false;

    var params = {
        propertyId:propertyId,
        propertyIEData:propertyIEData,
        IEYear:IEYear
    }

    var query = `MATCH (prop:property) where id(prop) = `+propertyId+`
        CREATE (IE:IE{propertyIEData})
        CREATE (IE)-[rel:OF{year:{IEYear}}]->(prop)`;
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// addBulkPropertyIE
// ---------------------------------------------
DAL.prototype.addBulkPropertyIE = function(propertiesIE, userId, cb) {
    userId = parseInt(userId);
    var params = {
        userId:userId
    }
    var query = `MATCH (user:user) WHERE id(user) = {userId}`;
    var query2 = `\nMERGE (user)-[rel:unlinkedFilesNode]->(uF:unlinkedFiles)`;
    var linkedCount = 0;
    var unlinkedCount = 0;
    var unlinkedArr = [];
    for (var i = 0; i < propertiesIE.length; i++) {
        propertiesIE[i].uuidFileName = "toBeGenerated";
        propertiesIE[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        propertiesIE[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        propertiesIE[i].createdBy = userId;
        propertiesIE[i].modifiedBy = userId;
        propertiesIE[i].isDeleted = false;
        
        var prop = "prop" + i + "";
        var IE = "IE" + i + "";
        var rel = "rel" + i + "";

        params['IE' + i] = propertiesIE[i];

        if (propertiesIE[i].propertyId !== -1) {
            linkedCount++;
            query += "\nMATCH (" + prop + ":property) where id(" + prop + ") = " + propertiesIE[i].propertyId;
            query2 += "\nCREATE (" + IE + ":IE{IE" + i + "})" +
                "\nCREATE (" + IE + ")-[" + rel + ":OF{IEYear:\"" + propertiesIE[i].IEYear + "\"}]->(" + prop + ")";
        } else {
            unlinkedArr.push({ fileName: propertiesIE[i].fileName, sheetName: propertiesIE[i].sheetName });
            unlinkedCount++;
            var uploadDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
            query2 += "\nCREATE (" + IE + ":IE{IE" + i + "})" +
                "\nCREATE (" + IE + ")-[" + rel + ":IE{uploadDate:\"" + uploadDate + "\"}]->(uF)";
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
        cb(err, results,linkedUnlinkedFiles);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// getPropertyIE
// ---------------------------------------------
DAL.prototype.getPropertyIE = function(propertyIds, cb) {
    var query = "MATCH (prop:property)<-[rel:OF]-(IE:IE) where id(prop) IN {propertyIds} AND IE.isDeleted = false AND IE.parsed[1] = 'true' return IE,rel.IEYear as year";

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
// getPropertyIEById
// ---------------------------------------------
DAL.prototype.getPropertyIEDataReduction = function(data, cb) {
    // propertyIds = parseInt(propertyIds);
    var query = "MATCH (prop:property)<-[rel:OF]-(ie:IE) where id(prop) = " +data.propId+" AND toInt(ie.IEYear[1]) <= "+data.year+" AND ie.isDeleted = false return ie as IE,ie.IEYear[1] as year ORDER BY ie.IEYear[1] DESC";
    // res.send(query)
    // console.log(query);
    db.cypher({
        query: query,
        // params:{
        //     ieIds:ieIds
        // }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// getPropertyIEById
// ---------------------------------------------
DAL.prototype.getPropertyIEForValuation = function(data, cb) {
    var query = `MATCH (prop:property)<-[rel:OF]-(ie:IE) 
                where id(prop) = {propertyId} AND ie.isDeleted = false
                AND toInt(ie.IEYear[1]) IN {year} return ie as IE,ie.IEYear[1] as year ORDER BY ie.IEYear[1] DESC`;

    db.cypher({
        query: query,
        params:{
            propertyId: data.propId,
            year: [(data.year-1),(data.year-2),(data.year-3)]
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// Link IE files to property
// ---------------------------------------------
// DAL.prototype.linkIEFiles = function(data, cb) {
//     var query = `MATCH (prop:property) WHERE id(prop) = {propertyId}`;
                

//     for(var i =0)

//     db.cypher({
//         query: query,
//         params:{
//             propertyId: data.propId,
//         }
//     }, function(err, results) {
//         cb(err, results);
//     });
// };
// ---------------------END---------------------

// ---------------------------------------------
// Unlink IE files from a property 
// ---------------------------------------------
DAL.prototype.unlinkIEFiles = function(data, userId, cb) {

    var uploadDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    
    var query = `MATCH (user:user) WHERE id(user) = {userId}
        MATCH (IE:IE)-[rel2:OF]->(prop) WHERE id(IE) IN ` + JSON.stringify(data.incomeExpenseIds) + ` 
        MERGE (user)-[rel:unlinkedFilesNode]->(uF:unlinkedFiles)
        CREATE (IE)-[rel3:IE{uploadDate:{uploadDate}}]->(uF)
        DELETE rel2`;

    db.cypher({
        query: query,
        params:{
            userId: userId,
            uploadDate: uploadDate
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// deleteIEById
// ---------------------------------------------
DAL.prototype.deleteIEById = function(data, userId, cb) {

    var deleteDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    var query = `MATCH (IE:IE) WHERE id(IE) IN ` + JSON.stringify(data.incomeExpenseIds) + ` 
        SET IE.isDeleted = true
        SET IE.deleteDate = {deleteDate}
        SET IE.deletedBy = {deletedBy}`;
    
    db.cypher({
        query: query,
        params:{
            deletedBy: userId,
            deleteDate: deleteDate
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// Unparsed IE adding against a propertyId
// ---------------------------------------------
DAL.prototype.addUnparsedPropertyIE = function(propertyIE, propertyId, userId, cb) {
    // console.log("propertyIE: ",propertyIE);
    // console.log("propertyId: ",propertyId);
    // console.log("userId: ",userId);
    // console.log("*************************TEST********************************");
    // console.log(propertyIE);
    userId = parseInt(userId);
    var params = {
        propertyId:parseInt(propertyId)
    }
    
    var query = "MATCH (prop:property) where id(prop) = {propertyId}";
    for (var i = 0; i < propertyIE.length; i++) {
        propertyIE[i].uuidFileName = "toBeGenerated";
        propertyIE[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        propertyIE[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        propertyIE[i].createdBy = userId;
        propertyIE[i].modifiedBy = userId;
        propertyIE[i].isDeleted = false;

        params['IE'+i] = propertyIE[i];
        // console.log("params: ",propertyIE[i]);
        query += "\nCREATE (IE" + i + ":IE{IE" + i + "})" +
            "\nCREATE (IE" + i + ")-[rel" + i + ":OF{IEYear:\"" + propertyIE[i].IEYear + "\"}]->(prop)";
        // console.log("query: ",query);
    }
    // console.log("params: ",params);

    // console.log("query: ",query);
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------