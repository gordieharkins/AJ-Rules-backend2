var moment = require('moment-timezone');
var path = require('path');
var InvalidFileFormat = require('../BLL/errors/invalidFileFormat');
var db = require(path.resolve(__dirname, './graphConnection'));
var func = require(path.resolve(__dirname, '../BLL/util/functions'));
var Zillow = require("node-zillow");
var zillow = new Zillow('X1-ZWz197fgjg2ux7_9vdv4');
// var zillow = new Zillow('X1-ZWz1fzofsvhrm3_91vx7');
// var zillow = new Zillow('X1-ZWz1fzojqxpvkb_94p25');

//
var converter = new func();
var Busboy = require('busboy');
var fs = require('fs');
var async = require('async');
const IMAGES_DIR_NAME = 'CompsImages';
var propertyImagesPath = path.resolve(__dirname, '../public/' + IMAGES_DIR_NAME);
module.exports = DAL;

// Class Constructor 
function DAL() {

}

// ---------------------------------------------
// getSavedComps
// ---------------------------------------------
DAL.prototype.getSavedComps = function(data, cb) {
    // propertyId = parseInt(propertyId);
    if(data.propId == undefined){
        var propertyId = data.propertyId;
    } else {
        var propertyId = data.propId;
    }
    // var query = `MATCH (prop:property) WHERE id(prop)= {propertyId}
    //     OPTIONAL MATCH (prop)-[rel:allSalesCompsRel]->(allSalesComps:allSalesComps)-[]->(salesComp:salesComp)
    //     OPTIONAL MATCH (allSalesComps)-[]->(salesCompPrincipal:salesCompPrincipal)
    //     RETURN salesCompPrincipal AS principal, collect(salesComp) as comparables`;

    var query = `MATCH(n:property)-[:comps]->(compsMeta)-[]->(comps) where id(n) = {propertyId}
                 return id(comps) as id, properties(comps) as properties`;

    db.cypher({
        query: query,
        params: {
            propertyId: propertyId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// addCompsToProp
// ---------------------------------------------
// DAL.prototype.addCompsToProp = function(data, cb) {
//     var params = {
//         propertyId: parseInt(data.propertyId),
//         principal: data.principal[0]
//     }

//     // Delete all previous comparables 
//     var query1 = `MATCH (prop:property) WHERE id(prop) = {propertyId}
//         OPTIONAL MATCH (prop)-[rel1:allSalesCompsRel]->(allSalesComps:allSalesComps)-[*0..]->(x)
//         DETACH DELETE x`;

//     var query = `MATCH (prop:property) WHERE id(prop) = {propertyId}
//         MERGE (prop)-[rel:allSalesCompsRel]->(allSalesComps:allSalesComps)
//         CREATE (salesCompPrincipal:salesCompPrincipal{principal})
//         CREATE (allSalesComps)-[relPrincipal:salesComp]->(salesCompPrincipal)`;

//     for (var i = 0; i < data.comps.length; i++) {

//         data.comps[i].createdDate = moment.utc(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
//         data.comps[i].modifiedDate = '';
//         data.comps[i].createdBy = data.userId;
//         data.comps[i].modifiedBy = '';

//         params['comp' + i] = data.comps[i];

//         query += `\nCREATE (salesComp` + i + `:salesComp{comp` + i + `})
//         CREATE (allSalesComps)-[rel` + i + `:salesComp]->(salesComp` + i + `)`;
//     }
//     query +=`WITH * 
//         MATCH (allSalesComps)-[]->(SC:salesComp)
//         RETURN collect({id:id(SC), imageFileName:SC.imageFileName}) AS propertyImages`; 

//     db.cypher({
//         query: query1,
//         params: {
//             propertyId: parseInt(data.propertyId)
//         }
//     }, function(err, results) {

//         db.cypher({
//             query: query,
//             params: params
//         }, function(err, results) {
//             cb(err, results);
//         });
//     });
// };
DAL.prototype.addCompsToProp = function(data, userId, cb) {
    if(data.propId == undefined){
        var propertyId = data.propertyId;
    } else {
        var propertyId = data.propId;
    }
    var query = `MATCH(n:property) where id(n) = {propertyId}
                MERGE(n)-[:comps]->(comps:Comps)
                WITH *
                MATCH(m:publicProperty) where id(m) IN {compIds}
                MERGE(comps)-[:comp]->(m)`

    db.cypher({
        query: query,
        params: {
            propertyId: propertyId,
            compIds: data.compIds
        }
    }, function(err, results) {
        cb(err, results);
    });
};

// ---------------------END---------------------

// ---------------------------------------------
// addCompsToProp
// ---------------------------------------------
DAL.prototype.addCompsImage = function(data, cb) {
    //console.log("posting")
    var filePath;

    var busboy = new Busboy({ headers: req.headers });
    var uniqueName = "";
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var date = new Date();
        uniqueName = req.params.id + '_' + date.getTime() + '_' + fieldname;

        var mainFile = path.join(propertyImagesPath, uniqueName);
        //console.log(propertyImagesPath);
        //console.log(mainFile)
        // filePath=mainFile
        filePath=mainFile
        file.pipe(fs.createWriteStream(mainFile));
    });
    busboy.on('finish', function() {
        res.writeHead(200, { 'Connection': 'close' });
        var filePath2 = IMAGES_DIR_NAME + '/' + uniqueName;
        //console.log(filePath2);
        res.end(filePath2);
    });
    return req.pipe(busboy);



};


DAL.prototype.addCompsToPropManual = function(data, userId, cb) {
    if(data.propId == undefined){
        var propertyId = data.propertyId;
    } else {
        var propertyId = data.propId;
    }
    var params = {
        propertyId: parseInt(propertyId),
        principal: data.principal[0]
    }

    // Delete all previous comparables 
    var query1 = `MATCH (prop:property) WHERE id(prop) = {propertyId}
        OPTIONAL MATCH (prop)-[rel1:allSalesCompsRel]->(allSalesComps:allSalesComps)-[*0..]->(x)
        DETACH DELETE x`;

    var query = `MATCH (prop:property) WHERE id(prop) = {propertyId}
        MERGE (prop)-[rel:allSalesCompsRel]->(allSalesComps:allSalesComps)
        CREATE (salesCompPrincipal:salesCompPrincipal{principal})
        CREATE (allSalesComps)-[relPrincipal:salesComp]->(salesCompPrincipal)`;

    for (var i = 0; i < data.comps.length; i++) {

        data.comps[i].createdDate = moment.utc(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.comps[i].modifiedDate = '';
        data.comps[i].createdBy = userId;
        data.comps[i].modifiedBy = '';

        params['comp' + i] = data.comps[i];

        query += `\nCREATE (salesComp` + i + `:salesComp{comp` + i + `})
        CREATE (allSalesComps)-[rel` + i + `:salesComp]->(salesComp` + i + `)`;
    }
    // query +=`WITH * 
    //     MATCH (allSalesComps)-[]->(SC:salesComp)
    //     RETURN collect({id:id(SC), imageFileName:SC.imageFileName}) AS propertyImages`; 
    db.cypher({
        query: query1,
        params: {
            propertyId: parseInt(data.propId)
        }
    }, function(err, results) {

        db.cypher({
            query: query,
            params: params
        }, function(err, results) {
            cb(err, results);
        });
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// deleteCompsFromProperty
// ---------------------------------------------
DAL.prototype.deleteCompsFromProperty = function(data, cb) {
    var query = `MATCH (prop:property)<-[comp:comp]-(MetaComp)<-[:comps]-(privateProp)
                WHERE id(prop) IN {compIds} AND id(privateProp) = {propertyId} 
                DETACH DELETE comp`;

    db.cypher({
        query: query,
        params: {
            compIds: data.compIds,
            propertyId: data.propId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// deleteCompsFromProperty
// ---------------------------------------------
DAL.prototype.updatePropertyImageFileName = function(newImgFileName, salesCompId, cb) {

    var query = `MATCH (salesComp:salesComp) WHERE id(salesComp) = {salesCompId} 
        SET salesComp.imageFileName = {newImgFileName}`;

    db.cypher({
        query: query,
        params:{
            newImgFileName:newImgFileName,
            salesCompId:salesCompId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------


// ---------------------------------------------
// getComparables
// ---------------------------------------------
DAL.prototype.getComparables = function(results, queryCriteria, cb) {

    var finalResult = {
        highProperties: [],
        lowProperties: []
    }

    var queryValuePerSF = [`MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {revalYearMax} >= toInt(n.revalYear[0]) >= {revalYearMin} AND toInt(n.valuePerSqFt) > {vSF} RETURN id(n) as id, properties(n) as properties ORDER BY toFloat(n.valuePerSqFt) LIMIT 10 `,
                            `MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {revalYearMax} >= toInt(n.revalYear[0]) >= {revalYearMin} AND toInt(n.valuePerSqFt) < {vSF} RETURN id(n) as id, properties(n) as properties ORDER BY toFloat(n.valuePerSqFt) DESC LIMIT 10 `]

    var queryAssessedValue = [`MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {revalYearMax} >= toInt(n.revalYear[0]) >= {revalYearMin} AND toInt(n.totalAssessment) > {assessedValue} RETURN id(n) as id, properties(n) as properties ORDER BY toInt(n.totalAssessment) LIMIT 10 `,
        `MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {revalYearMax} >= toInt(n.revalYear[0]) >= {revalYearMin} AND toInt(n.totalAssessment) < {assessedValue} RETURN id(n) as id, properties(n) as properties ORDER BY toInt(n.totalAssessment) DESC LIMIT 10 `]

    var queryConsideration = [`MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {transferYearMax} >= toInt(n.transferYear[0]) >= {transferYearMin} AND toInt(n.consideration) > {assessedValue} RETURN id(n) as id, properties(n) as properties ORDER BY toInt(n.consideration) LIMIT 10 `,
        `MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {transferYearMax} >= toInt(n.transferYear[0]) >= {transferYearMin} AND toInt(n.consideration) < {assessedValue} RETURN id(n) as id, properties(n) as properties ORDER BY toInt(n.consideration) DESC LIMIT 10 `]

    var queryConsiderationPerSF = [`MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {transferYearMax} >= toInt(n.transferYear[0]) >= {transferYearMin} AND toInt(n.buildingArea) > 0 AND (toInt(n.consideration) / toInt(n.buildingArea)) > ({assessedValue} / {buildingArea}) RETURN id(n) as id, properties(n) as properties ORDER BY (toInt(n.consideration) / toInt(n.buildingArea)) LIMIT 10 `,
        `MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {transferYearMax} >= toInt(n.transferYear[0]) >= {transferYearMin} AND toInt(n.buildingArea) > 0 AND (toInt(n.consideration) / toInt(n.buildingArea)) < ({assessedValue} / {buildingArea}) RETURN id(n) as id, properties(n) as properties ORDER BY (toInt(n.consideration) / toInt(n.buildingArea)) DESC LIMIT 10 `]

    var queryValuePerSFRevalYear = [`MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {revalYearMax} = toInt(n.revalYear[0]) AND toInt(n.valuePerSqFt) > {vSF} RETURN id(n) as id, properties(n) as properties ORDER BY toFloat(n.valuePerSqFt) LIMIT 10 `,
                            `MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {revalYearMax} = toInt(n.revalYear[0]) AND toInt(n.valuePerSqFt) < {vSF} RETURN id(n) as id, properties(n) as properties ORDER BY toFloat(n.valuePerSqFt) DESC LIMIT 10 `]

    var queryAssessedValueRevalYear = [`MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {revalYearMax} = toInt(n.revalYear[0]) AND toInt(n.totalAssessment) > {assessedValue} RETURN id(n) as id, properties(n) as properties ORDER BY toInt(n.totalAssessment) LIMIT 10 `,
        `MATCH(n:publicProperty) where n.zipCode = {zipCode} AND {revalYearMax} = toInt(n.revalYear[0]) AND toInt(n.totalAssessment) < {assessedValue} RETURN id(n) as id, properties(n) as properties ORDER BY toInt(n.totalAssessment) DESC LIMIT 10 `]

    var querybuildingArea = [`MATCH(n:publicProperty) where n.zipCode = {zipCode} AND toInt(n.buildingArea) > {buildingArea} RETURN id(n) as id, properties(n) as properties ORDER BY toInt(n.buildingArea) LIMIT 10 `,
        `MATCH(n:publicProperty) where n.zipCode = {zipCode} AND toInt(n.buildingArea) < {buildingArea} RETURN id(n) as id, properties(n) as properties ORDER BY toInt(n.buildingArea) DESC LIMIT 10 `]    
    
    var query = "";
    if(queryCriteria == 1){
        query = queryValuePerSF;
    } else if(queryCriteria == 2){
        query = queryAssessedValue;
    } else if(queryCriteria == 3){
        query = queryConsideration;
    } else if(queryCriteria == 4){
        query = queryConsiderationPerSF;
    } else if(queryCriteria == 5){
        query = queryAssessedValueRevalYear;
    } else if(queryCriteria == 6){
        query = queryValuePerSFRevalYear;
    } else if(queryCriteria == 7){
        query = querybuildingArea;
    } else {
        query = queryValuePerSF;
    }

    var query1 = query[0];
    // //console.log(query1);
    var params1 = {
        zipCode: results[0].properties.zipCode,
        revalYearMax: parseInt(results[0].properties.revalYear),
        revalYearMin: parseInt(results[0].properties.revalYear) - 2,
        transferYearMax: parseInt(results[0].properties.transferYear),
        transferYearMin: parseInt(results[0].properties.transferYear) - 2,
        taxAccNo: results[0].properties.taxAccountNo,
        vSF: parseInt(results[0].properties.valuePerSqFt),
        assessedValue: parseInt(results[0].properties.totalAssessment),
        buildingArea: parseInt(results[0].properties.buildingArea)
    }

    db.cypher({
        query: query1,
        params: params1
    }, function(err, results1) {
        //console.log("here");
        finalResult.highProperties = results1.reverse();
        var query2 = query[1];
        db.cypher({
            query: query2,
            params: params1
        }, function(err, results2) {
        //console.log("here1");

            finalResult.lowProperties = results2;
            cb(err, finalResult);
        });    
    });

};

// ---------------------------------------------
// saveSubjectPropertyUpdatedData
// ---------------------------------------------
DAL.prototype.saveSubjectPropertyUpdatedData = function(data, cb) {
    if(data.propId == undefined){
        var propertyId = data.propertyId;
    } else {
        var propertyId = data.propId;
    }
    var params = {
        propertyId: propertyId,
        data: data.data
    }
    var query = `MATCH(n:property)-[:publicRelation]->(m) where id(n) = {propertyId}
                MERGE (m)-[:POData]->(poData:POData)
                ON MATCH SET poData = {data}
                ON CREATE SET poData = {data}`;

    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// getSubjectPropertyData
// ---------------------------------------------

DAL.prototype.getSubjectPropertyData = function(data, cb) {
    if(data.propId == undefined){
        var propertyId = data.propertyId;
    } else {
        var propertyId = data.propId;
    }

    var params = {
        propertyId: propertyId
    }

    var query = `MATCH(n)-[:publicRelation]->(m) where id(n) = {propertyId} 
                    OPTIONAL MATCH(m)-[:POData]->(poData)
                    RETURN properties(m) as properties, n.formattedAddress as address, properties(poData) as poData`;;

    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
};

// ---------------------END---------------------
