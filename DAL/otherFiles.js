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
// uploadOtherFiles
// ---------------------------------------------
DAL.prototype.uploadOtherFiles = function(otherFileDetails, propertyId, userId, description, timelineDataId, cb) {
    //console.log(otherFileDetails);
    propertyId = parseInt(propertyId);
    var params = {
        propertyId:propertyId,
        tId: parseInt(timelineDataId)
    };
    var query = `MATCH (prop:property) WHERE id(prop) = {propertyId}
        MERGE (prop)-[rel:otherFilesMetaRel]->(metaNode:otherFilesMetaNode)`;

    if(timelineDataId != null){
        query += ` WITH * MATCH(timeline) where id(timeline) = {tId} `
    }

    for(var i = 0;i<otherFileDetails.length;i++){
        var node = "node" + i;

        otherFileDetails[i].uuidFileName = "toBeGenerated";
        otherFileDetails[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        otherFileDetails[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        otherFileDetails[i].createdBy = userId;
        otherFileDetails[i].modifiedBy = userId;
        otherFileDetails[i].isDeleted = false;
        if(timelineDataId == null){
            otherFileDetails[i].description = description[i];
        }
        params['otherFileDetails' + i] = otherFileDetails[i];
        query += `CREATE (` + node + `:otherFileNode{otherFileDetails` + i + `})
            CREATE (` + node + `)-[otherFile` + i + `:otherFile]->(metaNode)`;

        if(timelineDataId != null){
            query += `CREATE(timeline)-[:additional_item]->(`+ node +`) `;
        }
    }
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

DAL.prototype.getOtherFiles = function(data, res,cb){

    var param = {
            propertyId: data.propId
        }
    var query = `Match (prop:property)-[meta:otherFilesMetaRel]->
                (metaNode:otherFilesMetaNode)<-[otherFile:otherFile]-(otherFileNodes:otherFileNode)
                where id(prop) = {propertyId} AND otherFileNodes.isDeleted = false return otherFileNodes`;
    // res.send(query)
    db.cypher({
        query: query,
        params: param
    }, function(err, results) {
        cb(err, results);
    });
};

// ---------------------------------------------
// unlinkOtherFilesById files from a property 
// ---------------------------------------------
DAL.prototype.unlinkOtherFilesById = function(data, userId, cb) {

    var uploadDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    
    var query = `MATCH (user:user) WHERE id(user) = {userId}
        MATCH (otherFileNode:otherFileNode)-[rel2:otherFile]->(metaNode)<-[relOFMR:otherFilesMetaRel]-(prop:property)
        WHERE id(otherFileNode) IN ` + JSON.stringify(data.otherFileIds) + ` 
        MERGE (user)-[rel:unlinkedFilesNode]->(uF:unlinkedFiles)
        CREATE (otherFileNode)-[rel3:otherFileNode]->(uF)
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
// deleteOtherFilesById
// ---------------------------------------------
DAL.prototype.deleteOtherFilesById = function(data, userId, cb) {

    var deleteDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    
    var query = `MATCH (otherFileNode:otherFileNode) WHERE id(otherFileNode) IN ` + JSON.stringify(data.otherFileIds) + ` 
        SET otherFileNode.isDeleted = true
        SET otherFileNode.deleteDate = {deleteDate}
        SET otherFileNode.deletedBy = {deletedBy}`;
    
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