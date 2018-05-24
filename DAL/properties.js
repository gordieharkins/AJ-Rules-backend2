var moment = require('moment-timezone');
var path = require('path');
var InvalidFileFormat = require('../BLL/errors/invalidFileFormat');
var db = require(path.resolve(__dirname, './graphConnection'));
var func = require(path.resolve(__dirname, '../BLL/util/functions'));
var userRoles = require(path.resolve(__dirname, '../BLL/util/userRoles'));
var converter = new func();

module.exports = DAL;

// Class Constructor
function DAL() {

}

// ---------------------------------------------
// setMultiAccMasterSlave
// (by array with linked properties ID )
// ---------------------------------------------
DAL.prototype.setMultiAccMasterSlave = function(masterSlaveProperties, cb) {
    masterSlaveProperties = masterSlaveProperties.masterSlaveProperties;

    var query = "";
    var query2 = "";

    for (var i = 0; i < masterSlaveProperties.length; i++) {
        var master = "master" + i;
        query += `\nMATCH (` + master + `:property) WHERE id(` + master + `) = ` + masterSlaveProperties[i][0] + ``;
        for (var j = 1; j < masterSlaveProperties[i].length; j++) {
            var slave = "slave" + i + "" + j;
            var rel = "rel" + i + "" + j;
            var owns = "OWNS" + i + "" + j;
            query += `\nMATCH (` + slave + `:property)<-[` + owns + `:OWNS]-(user:user) WHERE id(` + slave + `) = ` + masterSlaveProperties[i][j] + ``;
            query2 += `\nDELETE ` + owns + `
            CREATE (` + master + `)-[` + rel + `:multiAcc]->(` + slave + `)`;
        }
    }
    query += query2;

    db.cypher({
        query: query

    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// get all properties Master and Slaves
// ---------------------------------------------
DAL.prototype.getProperties = function(userId, cb) {
    userId = parseInt(userId);

    var query = `MATCH (n:user)-[rel:OWNS]->(master:property)
        WHERE id(n)= {userId}
        OPTIONAL MATCH (master)-[:multiAcc|multipart]->(slave:property)
        RETURN master, slave, properties(rel) as roles`

        // RETURN collect(master) + collect(slave) as prop, properties(rel) as roles`;

    db.cypher({
        query: query,
        params:{
            userId:userId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// get all properties Master and Slaves
// ---------------------------------------------
DAL.prototype.getPropertiesById = function(data, cb) {
    var query = `MATCH (user)-[rel:OWNS]-(n:property) WHERE id(n) = {propertyId} RETURN n, properties(rel) as roles`;
    db.cypher({
        query: query,
        params:{
            propertyId: data.propId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// get all properties Master and Slaves
// ---------------------------------------------
DAL.prototype.getPropertyDetialsById = function(propertyId, cb) {
    propertyId = parseInt(propertyId);
    var query = `MATCH (master:property)
        WHERE id(master) = {propertyId} AND master.isDeleted = false
        OPTIONAL MATCH (master)-[rel2]->(slave:property)
        WHERE slave.isDeleted = false AND NOT(type(rel2) = "publicRelation")
        RETURN DISTINCT master AS masterProperty,
        collect(slave) AS slaveProperties,
        type(rel2) AS relationType`;

    db.cypher({
        query: query,
        params:{
            propertyId:propertyId
        }
    }, function(err, result) {

        var masterObj  = {};
        masterObj.masterProperty = result[0].masterProperty.properties;
        masterObj.masterProperty._id = result[0].masterProperty._id;
        masterObj.masterProperty.labels = result[0].masterProperty.labels;
        masterObj.masterProperty.relationType =  result[0].relationType;

        var slaveArr = [];

        for(var j = 0;j < result[0].slaveProperties.length;j++){

            var slaveObj = {};
            slaveObj = result[0].slaveProperties[j].properties;
            slaveObj._id = result[0].slaveProperties[j]._id;
            slaveObj.labels = result[0].slaveProperties[j].labels;
            slaveArr.push(slaveObj);
        }

        masterObj.masterProperty.slaveProperties = slaveArr;
        masterObj = masterObj.masterProperty;
        finalResult = [];
        finalResult.push(masterObj);
        cb(err, finalResult);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// get all properties Master and Slaves with pagination
// ---------------------------------------------
DAL.prototype.getMasterProperties = function(data, userId, relation, cb) {
    // console.log(relation);
    var skip = data.startRow;
    var queryOrders = `id(master)`;
    var queryFilters = "";

    // AND toLower(master.propertyName) CONTAINS toLower('woordmere')

    if(Object.keys(data.filterModel).length){
        var filters = data.filterModel;

        for(var key in filters){
            switch(filters[key].type) {

                case 'contains':

                    queryFilters += `\nAND toLower(master.` + key + `) CONTAINS toLower('`+ filters[key].filter +`')`;
                    break;
                case 'notContains':

                    queryFilters += `\nAND NOT(toLower(master.` + key + `) CONTAINS toLower('`+ filters[key].filter +`'))`;
                    break;
                case 'equals':

                    queryFilters += `\nAND toLower(master.` + key + `) = toLower('`+ filters[key].filter +`')`;
                    break;
                case 'notEqual':

                    queryFilters += `\nAND NOT(toLower(master.` + key + `) = toLower('`+ filters[key].filter +`'))`;
                    break;
                case 'startsWith':

                    queryFilters += `\nAND toLower(master.` + key + `)  =~ "(?i)`+ filters[key].filter +`.*"`;
                    break;
                case 'endsWith':

                    queryFilters += `\nAND toLower(master.` + key + `)  =~ "(?i).*`+ filters[key].filter +`"`;
                    break;
                default:
                    queryFilters = ""
            }
        }
    }

    if(Object.keys(data.sortModel).length){
        queryOrders = `master.` + data.sortModel.colId + ` ` + data.sortModel.sort;
    }

    // var query2 = `MATCH (n:user)-[rel:OWNS]->(master:property)
    //     WHERE id(n)={userId}
    //     AND master.isDeleted = false` + queryFilters + `
    //     WITH n, master
    //     ORDER BY ` + queryOrders + ` SKIP ` + skip + ` LIMIT ` + data.paginationPageSize + `
    //     OPTIONAL MATCH (n)-[rel]->(master)-[rel2]->(slave:property)
    //     WHERE slave.isDeleted = false AND NOT(type(rel2) = "publicRelation")
    //     RETURN DISTINCT master AS masterProperty,
    //     collect(slave) AS slaveProperties,
    //     type(rel2) AS relationType`;

    // var query2 = `MATCH (n:user)-[rel:`+relation+`]-(master:property)
    //     WHERE id(n)={userId}
    //     AND master.isDeleted = false` + queryFilters + `
    //     WITH n, master, rel
    //     OPTIONAL MATCH (master)-[rel2]->(slave:property)
    //     WHERE slave.isDeleted = false AND NOT(type(rel2) = "publicRelation")
    //     RETURN DISTINCT master AS masterProperty, properties(rel) as roles,
    //     collect(slave) AS slaveProperties,
    //     type(rel2) AS relationType
    //     ORDER BY ` + queryOrders + ` SKIP ` + skip + ` LIMIT ` + data.paginationPageSize+``;

    var query2 = `MATCH (n:user)-[rel:`+relation+`]-(master:property)
    WHERE id(n)={userId}
    AND master.isDeleted = false ` + queryFilters + `
    WITH n, master, rel
    OPTIONAL MATCH (master)-[rel2]->(slave:property)
    WHERE slave.isDeleted = false AND NOT(type(rel2) = "publicRelation")
    OPTIONAL MATCH (master)-[:publicRelation]->(public)
    RETURN DISTINCT master AS masterProperty, properties(rel) as roles,
    collect(slave) AS slaveProperties,
    type(rel2) AS relationType, id(public) as publicData
    ORDER BY ` + queryOrders + ` SKIP ` + skip + ` LIMIT ` + data.paginationPageSize+``;

    // Getting total records count from DB
    db.cypher({
        query: `MATCH (user:user)-[:`+relation+`]-(master)
            where id(user) = {userId}
            AND master.isDeleted = false` + queryFilters + `

            return count(master) AS totalMasterProperties`,
        params:{
            userId: userId
        }
    }, function(err, count) {
        if(err || count[0] === undefined){
            cb(err, count)
        } else{
            // Getting records from DB
            db.cypher({
                query: query2,
                params:{
                    userId: userId
                }
            }, function(err, result) {
                var finalResult = {
                    totalRecords: count[0].totalMasterProperties,
                    data:result
                }
                if(err || finalResult.data[0] === undefined){
                    cb(err, finalResult);
                } else {
                    var finalData = [];
                    for(var i = 0;i < result.length; i++){
                        var masterObj  = {};
                        masterObj.masterProperty = result[i].masterProperty.properties;
                        masterObj.masterProperty._id = result[i].masterProperty._id;
                        masterObj.masterProperty.labels = result[i].masterProperty.labels;
                        masterObj.masterProperty.roles = result[i].roles;
                        masterObj.masterProperty.relationType =  result[i].relationType;
                        masterObj.masterProperty.publicData = result[i].publicData;

                        var slaveArr = [];

                        for(var j = 0;j < result[i].slaveProperties.length;j++){

                            var slaveObj = {};
                            slaveObj = result[i].slaveProperties[j].properties;
                            slaveObj._id = result[i].slaveProperties[j]._id;
                            slaveObj.labels = result[i].slaveProperties[j].labels;
                            slaveArr.push(slaveObj);
                        }

                        masterObj.masterProperty.slaveProperties = slaveArr;
                        masterObj = masterObj.masterProperty;
                        finalData.push(masterObj);
                    }
                    finalResult.data = finalData;
                    cb(err, finalResult);
                }
            });
        }
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// get all properties Master and Slaves
// ---------------------------------------------
DAL.prototype.getPropertiesImagesByIds = function(propIds, cb) {

    var query = `MATCH (prop:property)
        WHERE id(prop) IN [` + propIds + `]
        WITH *
        OPTIONAL MATCH (prop)-[]->(:allImages)-[]-(image:masterImage)
        OPTIONAL MATCH (prop)-[:publicRelation]->(pubProp:property)
        RETURN image.fileName AS imageFileName, id(prop) AS propertyId, pubProp AS publicProperty`;

    db.cypher({
        query: query
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// get all properties Master and Slaves with pagination
// ---------------------------------------------
DAL.prototype.getAllProperties = function(data, cb) {
    data.userId = parseInt(data.userId);
    data.pageSize = parseInt(data.pageSize);
    data.pageNumber = parseInt(data.pageNumber);

    var skip = (data.pageNumber - 1) * data.pageSize;

    var query2 = `MATCH (n:user)-[rel:OWNS]->(master:property)
        WHERE id(n)= {userId} AND master.isDeleted = false
        WITH n, master
        ORDER BY id(master) DESC SKIP ` + skip + ` LIMIT ` + data.pageSize + `
        RETURN collect(master) AS properties, properies(rel) as roles`;

    // Getting total records count from DB
    db.cypher({
        query: `MATCH (user:user)-[:OWNS]->(prop:property) WHERE id(user) = {userId} AND prop.isDeleted = false
            RETURN count(prop) AS totalProperties`,
        params:{
            userId:data.userId
        }
    }, function(err, count) {
        if(err){
            // console.log(count);
            cb(err, count);
            return;
        } else if(count[0] === undefined){
            cb(new Error('totalProperties not Found'), count);
            return;
        }

        // Getting records from DB
        db.cypher({
            query: query2,
            params:{
                userId:data.userId
            }
        }, function(err, result) {
            result = {
                totalRecords: count[0].totalProperties,
                data:result
            }
            cb(err, result);
        });
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// get all properties for landing page
// (only gets master properties)
// ---------------------------------------------
DAL.prototype.getPropertiesLandingPage = function(userId, cb) {
    userId = parseInt(userId);

    var query = `MATCH (n:user)-[rel]-(master:property)
        WHERE id(n)= {userId} AND master.isDeleted = false
        OPTIONAL MATCH (master)-[]-(:allImages)-[]-(image:masterImage)
        WITH *
        ORDER BY id(master)
        RETURN master.recordOwnerName AS ownerName,
        master.taxAccountNo AS accNo,
        master.formattedAddress AS propertyAddress,
        master.propertyName AS propertyName,
        master.latitude AS lat,
        master.longitude AS lng,
        master.countryState AS countryState,
        master.county AS county,
        master.propertyType AS propertyType,
        id(master) AS id,
        image.fileName AS imageFileName`;

    // var query = `MATCH (n:user)-[rel:OWNS]->(master:property)
    //     WHERE id(n)= {userId} AND master.isDeleted = false
    //     OPTIONAL MATCH (master)-[]-(:allImages)-[]-(image:masterImage)
    //     WITH *
    //     ORDER BY id(master)
    //     RETURN
    //         properties(master) AS properties,
    //         id(master) AS id,
    //         image.fileName AS imageFileName`;


    // Getting records from DB
    db.cypher({
        query: query,
        params:{
            userId:userId
        }
    }, function(err, result) {
        var data = {
            data:result
        }
        cb(err, data);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// getSlavePropertiesByMasterId
// ---------------------------------------------
DAL.prototype.getSlavePropertiesByMasterId = function(masterPropId, cb) {
    masterPropId = parseInt(masterPropId);

    var query = `MATCH (master:property)
        WHERE id(master)= {masterPropId}
        OPTIONAL MATCH (master)-[:multiAcc|multipart]->(slave:property)
        RETURN master+collect(slave) AS prop`;

    db.cypher({
        query: query,
        params:{
            masterPropId:masterPropId
        }
    }, function(err, results) {
        cb(err,results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// get Slaves by property ID (Not user yet)
// ---------------------------------------------
DAL.prototype.getPropertySlavesID = function(propertyId, cb) {
    propertyId = parseInt(propertyId);

    var query = "MATCH (prop:property)-[:multiAcc|multipart]->(slave:property) where id(prop) = {propertyId} return collect(id(slave)) as IDs;";

    db.cypher({
        query: query,
        params:{
            propertyId:propertyId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// getPropertiesDataMapping
// ---------------------------------------------
DAL.prototype.getPropertiesDataMapping = function(cb) {
    //Future Get by USER or Jurisdiction
    var query = `MATCH (n:propertiesDataMapping) RETURN id(n) AS Id,properties(n) AS propertiesDataMapping`;

    db.cypher({
        query: query

    }, function(err, results) {
        if (err){
            cb(err, results); /*throw err;*/

        } else {
            if (results[0] === null || results[0] === undefined){
                saveInitialPropertiesDataMapping( function(error, propertiesDataMapping) {
                    cb(error, propertiesDataMapping);
                })
            } else{
                cb(err, results);
            }
        }
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// updatePropertiesDataMapping
// ---------------------------------------------
DAL.prototype.updatePropertiesDataMapping = function(newDataMapping, cb) {
    //Future Get by USER or Jurisdiction
    var query = `MATCH (n:propertiesDataMapping) SET n = ` + converter.cypherJsonConverter(newDataMapping) + ``;

    db.cypher({
        query: query

    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// updatePropertiesDataMapping
// ---------------------------------------------
DAL.prototype.updateTaxAccNo = function(propTaxAccNo, userId, cb) {
    userId = parseInt(userId);

    var query = `MATCH (prop:property) WHERE id(prop) = {propertyId}
        SET prop.taxAccountNo = {taxAccountNo},
        prop.modifiedBy = {userId},
        prop.modifiedDate = {modifiedDate}
        RETURN id(prop) AS propId`;

    db.cypher({
        query: query,
        params:{
            propertyId:parseInt(propTaxAccNo.propertyId),
            taxAccountNo:propTaxAccNo.taxAccountNumber,
            userId:userId,
            modifiedDate: moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss')
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// saveInitialPropertiesDataMapping
// ---------------------------------------------
var saveInitialPropertiesDataMapping = function(cb) {
    // Start - Set Indexes.
    var propertiesDataMapping = {
        "propertyName": "property name|property descrip",
        "propertyID": "property id",
        "recordOwnerName": "record owner name|owner name",
        "propertyType": "property type|type",
        "propertyTypeNote": "property type note",
        "aotcClientName": "aotc client name",
        "ppoName": "ppo name",
        "assetManagerFirm": "asset manager firm",
        "propertyManagementFirm": "property management firm",
        "leasingAgentFirm": "leasing agent firm",
        "salesBrokerFirm": "sales broker firm",
        "lawFirmReleases": "law firm releases",
        "propertyOwnerName": "property owner name",
        "streetAddress": "street address|street name",
        "assessorAddress": "assessor address",
        "city": "city",
        "state": "state",
        "zip": "zip|owner zip",
        "zoning": "zoning",
        "landSize": "land size|land area1",
        "landSizeUnit": "land size unit",
        "yearBuilt": "year built",
        "yearRenovated": "year renovated",
        "far": "far",
        "assessingAuthority": "assessing authority",
        "assessmentRatio": "assessment ratio",
        "assessorAccountNo": "assessor account no",
        "taxingAuthority": "taxing authority",
        "taxAccountNo": "tax account no|account number|accountnumber",
        "parcelId": "parcel id",
        "mapCitation": "map citation",
        "deedCitation": "deed citation|deed",
        "section": "section|section number",
        "block": "block|block number",
        "lot": "lot|lot number",
        "map": "map|map number",
        "grid": "grid|grid number",
        "parcel": "parcel",
        "grossArea": "gross area|encl area",
        "netLeasableArea": "net leasable area|bldg area"
    }
    var query = `CREATE (propDataMapping:propertiesDataMapping ` + converter.cypherJsonConverter(propertiesDataMapping) + `)
            RETURN id(propDataMapping) AS Id,properties(propDataMapping) AS propertiesDataMapping`;
    db.cypher({
        query: query
    }, function(err, results) {
        if (!results) {
            cb(new Error('No user found.'), results);
        } else {
            cb(err, results);
        }
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// addUnparsedFile
// ---------------------------------------------
DAL.prototype.addUnparsedFile = function(files, userId, cb) {
    var params = {};
    var query = `MATCH (user:user) WHERE id(user) = {userId}
        MERGE (user)-[rl:unParsedFiles]->(uF:unParsedFilesNode)`;

    for (var i = 0; i < files.length; i++) {
        files[i].userId = userId;
        files[i].createdBy = userId;
        files[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        params['file' + i] = files[i];
        query += `\nCREATE (fileNode` + i + `:unParsedFile{file` + i + `})
        CREATE (uF)-[rel` + i + `:unParsedFiles]->(fileNode` + i + `)`;
    }

    params.userId = userId;

    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// MultiPart Properties Linking
// ---------------------------------------------
DAL.prototype.multiPartLinking = function(properties, cb) {

    var params={
        masterPropertyId:properties[0]
    };
    var query1 = `Match (prop:property) where id(prop) = {masterPropertyId}`;
    var query2 = ``;
    for(var i = 1;i < properties.length; i++){
        params['prop'+i] = properties[i];
        query1 += `\nmatch (prop`+i+`)<-[owns`+i+`:OWNS]-(user)
        where id(prop`+i+`) = {prop` + i + `}`;
        query2 += ` create (prop`+(i)+`)<-[:multipart]-(prop)`;
    }
    query2 += ` delete owns1`;
    for(var i = 2;i < properties.length; i++){
        query2 += `,owns`+i;
    }

    query1 +=query2;
    db.cypher({
        query: query1,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// MultiAccount Properties Linking
// ---------------------------------------------
DAL.prototype.multiAccountLinking = function(properties, cb) {

    var params={
        masterPropertyId:properties[0]
    };
    var query1 = `Match (prop:property) where id(prop) = {masterPropertyId}`;
    var query2 = ``;
    for(var i = 1;i < properties.length; i++){
        params['prop'+i] = properties[i];
        query1 += `\nmatch (prop`+i+`)<-[owns`+i+`:OWNS]-(user)
        where id(prop`+i+`) = {prop` + i + `}`;
        query2 += ` create (prop`+(i)+`)<-[:multiaccount]-(prop)`;
    }
    query2 += ` delete owns1`;
    for(var i = 2;i < properties.length; i++){
        query2 += `,owns`+i;
    }
    query1 +=query2;

    db.cypher({
        query: query1,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// (TO BE USED IN addPropertiesList LATER)
// ---------------------------------------------
// get all properties Master and Slaves
// ---------------------------------------------
DAL.prototype.updateNodeAttributes = function(nodeData, userId, cb) {
    // We can also dump objects
    // LabelsInOurSystem: property,user,RR,IE,tenants,

    // Sample Data (Will be removed after finalizing)
    // nodeData = {
    //     nodeId:127,
    //     nodeLabel:"property",
    //     city:"abc3",
    //     zip:"44003"
    // }

    var params = JSON.stringify(nodeData);

    params = JSON.parse(params);
    params.dateTime = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    params.modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    params.modifiedBy = userId;

    var query = `MATCH (node:`+ nodeData.nodeLabel +`) WHERE id(node) = {nodeId}
        CREATE (copy:`+ nodeData.nodeLabel +`)
        SET copy = node
        CREATE (node)-[rel:PRECEDES{dateTime:{dateTime}}]->(copy)
        SET node.modifiedDate = {modifiedDate}
        SET node.modifiedBy = {modifiedBy}`;
    delete nodeData.nodeId;
    delete nodeData.nodeLabel;
    for (var element in nodeData) {
        query += `\nSET node.` + element + ` = {` +element+ `}`;
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
// get all properties Master and Slaves
// ---------------------------------------------
DAL.prototype.getUserRole = function(userId, cb) {
    userId = parseInt(userId);

    var query = `MATCH (user:user) WHERE id(user) = {userId}
        RETURN user.role AS role`;

    db.cypher({
        query: query,
        params:{
            userId:userId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// Add Bulk Properties and Assigned to User
// ---------------------------------------------
DAL.prototype.addProperty = function(properties, fileName, userId, cb) {
    userId = parseInt(userId);
    var userRoles = {
        "editValuationForm": true,
        "viewRentRolls": true,
        "viewIncomeExpense": true,
        "viewValuationForm": true,
        "viewPropertyPublicData": true,
        "unlinkPropertyData": true,
        "editValuationWorkspace": true,
        "viewTaxBills": true,
        "viewPropertyDetails": true,
        "attachFilesToProperty": true,
        "viewComparables": true,
        "assignProperty": true,
        "viewValuationWorkspace": true,
        "editPropertyImage": true
    };

    var params = {
        userId:userId,
        roles: userRoles
    }

    var prop = "";
    var query = "MATCH (user:user) WHERE id(user) = {userId}";
    for (var i = 0; i < properties.length; i++) {

        properties[i].createdDate = moment.utc(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        properties[i].modifiedDate = '';
        properties[i].createdBy = userId;
        properties[i].modifiedBy = '';
        properties[i].fileName = fileName;
        properties[i].isDeleted = false;

        params['propData'+i] = properties[i];
        params['taxAccountNo'+i] = properties[i].taxAccountNo;

        if (i > 0) {
            if (i === 1) {
                var masterProp = prop;
            }
            var rel_p = "rel_p" + i;

            prop = "prop" + i;
            query = query + "\n\nCREATE (" + prop + ":property{propData" + i + "})" +
                "\nCREATE (" + masterProp + ")-[" + rel_p + ":multipart]->(" + prop + ")";
        } else {

            prop = "prop" + i;
            query = query + "\n\nCREATE (" + prop + ":property{propData" + i + "})" +
                "\nCREATE (user)-[rel:OWNS {roles}]->(" + prop + ")";
        }

        query += `WITH *
                    OPTIONAL MATCH(public`+i+`:publicProperty) where public`+i+`.taxAccountNo = {taxAccountNo`+i+`}
                    FOREACH (o IN CASE WHEN public`+i+` IS NOT NULL THEN [public`+i+`] ELSE [] END |
                        CREATE(`+prop+`)-[:publicRelation]->(public`+i+`)
                    )`

    }
    query += `\nRETURN `;

    for(var j = 0; j < properties.length; j++){
        var prop = `id(prop` + j + `) +"||"+ prop`+ j +`.assessingAuthority  AS prop` + j + ``;
        query += ``+prop;
        if((j+1) !== properties.length){
            query += `,`;
        }
    }

    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        console.log(err);
        cb(err, results);
    });
};
// ---------------------END---------------------

// (TO BE USED IN addPropertiesList LATER)
// ---------------------------------------------
//checkExistingProperties
// ---------------------------------------------
DAL.prototype.checkExistingProperties = function(checkParameters, cb) {

    // Add this after Role to search on base of jurisdiction
    // AND AJ.aJName = {aJName}

    var query = `MATCH (AJ:user)-[:OWNS]-(publicProp:property)
        WHERE AJ.role = {role}
        AND publicProp.formattedAddress = {formattedAddress}
        AND publicProp.latitude = {latitude}
        AND publicProp.longitude = {longitude}
        RETURN id(publicProp) AS publicProp LIMIT 1`;

    db.cypher({
        query: query,
        params: checkParameters
    }, function(err, results) {
        // console.log(results)
        cb(err, results);
    });
};
// ---------------------END---------------------





// ---------------------------------------------
// linkExistingProperties
// ---------------------------------------------
DAL.prototype.linkExistingProperties = function(privateId, publicId, cb) {

    var query = `MATCH (publicProp:property)
        WHERE id(publicProp) = {publicId}
        WITH publicProp
        MATCH (privateProp:property)
        WHERE id(privateProp) = {privateId}
        CREATE (privateProp)-[:publicRelation]->(publicProp)
        RETURN publicProp,privateProp`;

    db.cypher({
        query: query,
        params:{
            privateId: privateId,
            publicId: publicId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// Delete multiple properties by ID
// ---------------------------------------------
DAL.prototype.deletePropertiesByIds = function(propertiesIds, userId, cb) {

    var deleteDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    var query = `MATCH (prop:property) WHERE id(prop) IN ` + JSON.stringify(propertiesIds.propertiesIds) + `
        SET prop.isDeleted = true
        SET prop.deleteDate = {deleteDate}
        SET prop.deletedBy = {deletedBy}`;
    db.cypher({
        query: query,
        params:{
            deletedBy:userId,
            deleteDate:deleteDate
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// assignPropertyToAgent
// ---------------------------------------------
DAL.prototype.assignPropertyToAgent = function(data, cb) {
    // console.log(data);
    var params = {
        propertyIds: data.propId,
        agentIds: data.agentId,
        roles: data.roles
    }
    var query = `MATCH (prop:property) WHERE id(prop) = {propertyIds}
                 MATCH (agent:user) where id(agent) IN {agentIds}
                 MERGE (prop)-[rel:ASSIGNED_TO]->(agent)
                 ON CREATE SET rel = {roles}
                 ON MATCH SET rel = {roles}
                 `;
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------


// ---------------------------------------------
// getAssignedUsers
// ---------------------------------------------
DAL.prototype.getAssignedUsers = function(data, cb) {
    // console.log(data);
    var params = {
        propertyIds: data.propId
    }
    var query = `MATCH (prop:property)-[rel:ASSIGNED_TO]-(user) WHERE id(prop) = {propertyIds}
                 return user, rel`;
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// removeAssignedUser
// ---------------------------------------------
DAL.prototype.removeAssignedUser = function(data, cb) {
    // console.log(data);
    var params = {
        propertyIds: data.propId,
        agentId: data.agentId
    }
    var query = `MATCH (prop:property)-[rel:ASSIGNED_TO]-(user) WHERE id(prop) = {propertyIds} 
                AND id(user) = {agentId} 
                 detach delete rel`;
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------


// ---------------------------------------------
// getPublicPropertyDetailsById
// ---------------------------------------------
DAL.prototype.getPublicPropertyDetailsById = function(data, cb) {
    //console.log(data);
    var params = {
        propId: data.publicPropertyId
    }
    var query = `MATCH (prop:publicProperty)-[:subNode]-(sub:subNode) WHERE id(prop) = {propId} 
                return collect(properties(sub)) as details
                 `;
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------


// ---------------------------------------------
// getPublicPropertyDetailsById
// ---------------------------------------------
DAL.prototype.getUsersJurisdictions = function(userId, cb) {
    var params = {
        userId: userId
    }
    var query = `MATCH (user:user)-[:OWNS]->(prop:property) where id(user) = {userId}
                AND prop.isDeleted = false
                return collect(DISTINCT(prop.assessingAuthority)) as jurisdictions
                 `;
    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// get all AJ's properties Master and Slaves with pagination
// ---------------------------------------------
DAL.prototype.getAJPublicProperties = function(data, cb) {
    
    // var skip = data.startRow;
    // var queryOrders = `id(master)`;
    // var queryFilters = "";
    
    // if(Object.keys(data.filterModel).length){
    //     var filters = data.filterModel;
        
    //     for(var key in filters){
    //         switch(filters[key].type) {

    //             case 'contains':

    //                 queryFilters += `\nAND toLower(master.` + key + `) CONTAINS toLower('`+ filters[key].filter +`')`;
    //                 break;
    //             case 'notContains':

    //                 queryFilters += `\nAND NOT(toLower(master.` + key + `) CONTAINS toLower('`+ filters[key].filter +`'))`;
    //                 break;
    //             case 'equals':

    //                 queryFilters += `\nAND toLower(master.` + key + `) = toLower('`+ filters[key].filter +`')`;
    //                 break;
    //             case 'notEqual':

    //                 queryFilters += `\nAND NOT(toLower(master.` + key + `) = toLower('`+ filters[key].filter +`'))`;
    //                 break;
    //             case 'startsWith':

    //                 queryFilters += `\nAND toLower(master.` + key + `)  =~ "(?i)`+ filters[key].filter +`.*"`;
    //                 break;
    //             case 'endsWith':

    //                 queryFilters += `\nAND toLower(master.` + key + `)  =~ "(?i).*`+ filters[key].filter +`"`;
    //                 break;
    //             default:
    //                 queryFilters = ""
    //         }
    //     }
    // }

    // if(Object.keys(data.sortModel).length){
    //     queryOrders = `master.` + data.sortModel.colId + ` ` + data.sortModel.sort;
    // }

    // var query2 = `MATCH (n:user)-[rel:OWNS]->(master:property)
    //     WHERE n.role = "Assessing Authority" 
    //     AND master.isDeleted = false` + queryFilters + `
    //     WITH n, master
    //     OPTIONAL MATCH (n)-[rel]->(master)-[rel2]->(slave:property)
    //     WHERE slave.isDeleted = false AND NOT(type(rel2) = "publicRelation")
    //     RETURN DISTINCT master AS masterProperty,
    //     collect(slave) AS slaveProperties,
    //     type(rel2) AS relationType
    //     ORDER BY ` + queryOrders + ` SKIP ` + skip + ` LIMIT ` + data.paginationPageSize+``;
    
    // // Getting total records count from DB
    // db.cypher({
    //     query: `MATCH (user:user)-[:OWNS]->(master) 
    //         WHERE user.role = "Assessing Authority" 
    //         AND master.isDeleted = false` + queryFilters + `
    //         RETURN count(master) AS totalMasterProperties`,
    //     params:{
    //         userId:data.userId
    //     }
    // }, function(err, count) {
    //     if(err || count[0] === undefined){
    //         cb(err, count)
    //     } else{
    //         // Getting records from DB
    //         db.cypher({
    //             query: query2,
    //             params:{
    //                 userId:data.userId
    //             }
    //         }, function(err, result) {
    //             var finalResult = {
    //                 totalRecords: count[0].totalMasterProperties,
    //                 data:result
    //             }
    //             if(err || finalResult.data[0] === undefined){
    //                 cb(err, finalResult);
    //             } else {
    //                 var finalData = [];
    //                 for(var i = 0;i < result.length; i++){
    //                     var masterObj  = {};
    //                     masterObj.masterProperty = result[i].masterProperty.properties;
    //                     masterObj.masterProperty._id = result[i].masterProperty._id;
    //                     masterObj.masterProperty.labels = result[i].masterProperty.labels;
    //                     masterObj.masterProperty.relationType =  result[i].relationType;

    //                     var slaveArr = [];

    //                     for(var j = 0;j < result[i].slaveProperties.length;j++){

    //                         var slaveObj = {};
    //                         slaveObj = result[i].slaveProperties[j].properties;
    //                         slaveObj._id = result[i].slaveProperties[j]._id;
    //                         slaveObj.labels = result[i].slaveProperties[j].labels;
    //                         slaveArr.push(slaveObj);
    //                     }

    //                     masterObj.masterProperty.slaveProperties = slaveArr;
    //                     masterObj = masterObj.masterProperty;
    //                     finalData.push(masterObj);
    //                 }
    //                 finalResult.data = finalData;
    //                 cb(err, finalResult);
    //             }
    //         });
    //     }
    // });
    // console.log("data:", data);
    var skip = data.startRow;
    var paginationPageSize = data.paginationPageSize;
    var query = "";
    params = {
        skip: data.startRow,
        page: data.paginationPageSize,
        state: data.state
    }
    if(data.state == null){
        query += `MATCH(prop:publicProperty) where prop.isDeleted = false 
        return prop
        ORDER BY id(prop) SKIP {skip} LIMIT {page}`;
    } else {
        query += `MATCH(prop:publicProperty) where prop.isDeleted = false
        AND prop.ownerState IN {state}
        return prop
        ORDER BY id(prop) SKIP {skip} LIMIT {page}`;
    }
    

    // console.log(query);
    db.cypher({
        query: query,
        params:params
    }, function(err, results1) {

        var query2 = "MATCH(prop:publicProperty) return count(prop) as count";
        db.cypher({
            query: query2,
        }, function(err, results2) {
            var results = {
                properties: results1,
                count: results2[0].count
            }
            cb(err, results);
        });
    });

};
// ---------------------END---------------------

// ---------------------------------------------
// get all IE files and their status against all properties
// ---------------------------------------------
DAL.prototype.getFileStatusIE = function(userId, cb) {
    // console.log("in DAL");
    userId = parseInt(userId);

    var query = `match(n:user) where id(n) = {userId}
    Match(n)-[:OWNS]-(p:property)
    OPTIONAL Match(p)-[rel:OF]-(ie:IE)
    return p.propertyName as property, p.formattedAddress as address, ie.IEYear[1] as year, ie.parsed[1] as status, ie.originalFileName[1] as fileName`


    db.cypher({
        query: query,
        params:{
            userId:userId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// get all RR files and their status against all properties
// ---------------------------------------------
DAL.prototype.getFileStatusRR = function(userId, cb) {
    // console.log("in DAL");
    userId = parseInt(userId);

    var query = `match(n:user) where id(n) = {userId}
    Match(n)-[:OWNS]-(p:property)
    OPTIONAL Match(p)-[rel:AS_OF]-(rr:RR)
    return p.propertyName as property, p.formattedAddress as address, rr.asOfDate[1] as year, rr.parsed[1] as status, rr.originalFileName[1] as fileName`
    db.cypher({
        query: query,
        params:{
            userId:userId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------
