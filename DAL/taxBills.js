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
// getTaxBills
// ---------------------------------------------
DAL.prototype.getTaxBills = function(propId, cb) {
    propId = parseInt(propId);
    
    var query = `MATCH (prop:property)<-[relTB:taxBill_OF]-(taxBills) WHERE id(prop) = {propId} AND taxBills.isDeleted = false RETURN taxBills`;
    
    db.cypher({
        query: query,
        params:{
            propId:propId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// uploadTaxBillFile
// ---------------------------------------------
DAL.prototype.uploadTaxBillFile = function(taxBillFileArr, propertyId, userId, cb) {
    propertyId = parseInt(propertyId);
    var params = {
        propertyId: propertyId
    }
    var query = "MATCH (prop:property) WHERE id(prop) = {propertyId}";

    for(var i = 0;i < taxBillFileArr.length;i++){

        taxBillFileArr[i].uuidFileName = "toBeGenerated";
        taxBillFileArr[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        taxBillFileArr[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        taxBillFileArr[i].createdBy = userId;
        taxBillFileArr[i].modifiedBy = userId;
        taxBillFileArr[i].isDeleted = false;
        query += `\nCREATE (tB` + i + `:taxBill{` + i + `})
            \nCREATE (prop)<-[relTB` + i + `:taxBill_OF]-(tB` + i + `)`;
        params[i] = taxBillFileArr[i];
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
// unlinkTaxBillsById 
// ---------------------------------------------
DAL.prototype.unlinkTaxBillsById = function(data, userId, cb) {

    var uploadDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    
    var query = `MATCH (user:user) WHERE id(user) = {userId}
        MATCH (taxBill:taxBill)-[rel2:taxBill_OF]->(prop) WHERE id(taxBill) IN ` + JSON.stringify(data.taxBillIds) + ` 
        MERGE (user)-[rel:unlinkedFilesNode]->(uF:unlinkedFiles)
        CREATE (taxBill)-[rel3:taxBill]->(uF)
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
// deleteTaxBillsById
// ---------------------------------------------
DAL.prototype.deleteTaxBillsById = function(data, userId, cb) {

    var deleteDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    
    var query = `MATCH (taxBill:taxBill) WHERE id(taxBill) IN ` + JSON.stringify(data.taxBillIds) + ` 
        SET taxBill.isDeleted = true
        SET taxBill.deleteDate = {deleteDate}
        SET taxBill.deletedBy = {deletedBy}`;

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