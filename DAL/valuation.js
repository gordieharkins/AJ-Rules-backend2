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
// Fetching IE for valuation process
// ---------------------------------------------
// DAL.prototype.getValuationIEData = function(propertyId, year, res,cb) {

// 	var query = `MATCH (prop:property)<-[year:OF]-(ie:IE) 
// 				WHERE year.year =~ '.*`+data.year+`.*' AND id(prop) = {propertyId} return rr.totalSF`;
// 	//console.log(data);
// 	// var query = `MATCH (prop:property)<-[year:AS_OF]-(rr:RR) 
// 	//  			WHERE year.year =~ '.*`+data.year+`.*' AND id(prop) = `+data.propertyId+` return rr.totalSF`;
// 	// res.send(query)
//     db.cypher({
//         query: query,
//         params:{
//             propertyId: data.propertyId,
//             year: data.year
//         }
//     }, function(err, results) {
//         cb(err, results);
//     });
// };

// ---------------------------------------------
// Fetching RR for valuation process
// ---------------------------------------------
DAL.prototype.getValuationRRData = function(propertyId, yearNow, yearNext, res, cb) {
    var query = `MATCH (prop:property)<-[year:AS_OF]-(rr:RR) 
	 			WHERE `+yearNow+` < toInt(rr.asOfDate[1]) AND `+yearNext+` > toInt(rr.asOfDate[1]) AND id(prop) = `+propertyId+` return rr.totalSF as totalSF`;
    db.cypher({
        query: query
        // params:{
        //     propertyId: propertyId
        // }
    }, function(err, results) {
        // //console.log(results)
        cb(err, results);
    });
};

DAL.prototype.addValuationForm = function(data, userId, cb){
    data.valuationData.createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    data.valuationData.modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    data.valuationData.createdBy = userId;
    data.valuationData.modifiedBy = userId;
    data.valuationData.isDeleted = "false";
    var query = `MATCH (prop:property) where id(prop) = {propertyId}
                MERGE (prop)<-[rl:OF{valuationYear:{valuationYear}}]-(valuation:valuationNode)
                CREATE (valuationForm:valuationForm {valuationData})
                CREATE (valuationForm)-[rel:FormName{name:{formName},appealStatus:{appealStatus}}]->(valuation)
                RETURN valuationForm`;

    db.cypher({
        query: query,
        params:{
            propertyId: data.propId,
            valuationYear: data.valuationYear,
            valuationData: data.valuationData,
            formName: data.name,
            appealStatus: data.status,
        }
    }, function(err, results) {
        cb(err, results);
    })

};

DAL.prototype.checkValuationFormExistence = function(data, cb){
    var query = `Match (prop:property)-[rel:OF]-(valuation:valuationNode)-[rel2:FormName]-(valuationForm:valuationForm) 
                WHERE id(prop) = {propertyId}  
                AND rel.valuationYear = {valuationYear}
                AND rel2.name = {formName}
                AND NOT(valuationForm.isDeleted = "true")
                return valuationForm`;
    db.cypher({
        query: query,
        params:{
            propertyId: data.propId,
            valuationYear: data.valuationYear,
            formName: data.name
        }
    }, function(err, results) {
        cb(err, results);
    });
};

DAL.prototype.replaceValuationForm = function(data, userId, cb){
    data.valuationData.createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    data.valuationData.modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    data.valuationData.createdBy = userId;
    data.valuationData.modifiedBy = userId;
    data.valuationData.isDeleted = "false";
    // //console.log(data);
    var query = `Match (prop:property)-[rel:OF]-(valuation:valuationNode)-[rel2:FormName]-(valuationForm:valuationForm) 
                WHERE id(prop) = {propertyId}  
                AND rel.valuationYear = {valuationYear}
                AND rel2.name = {formName}                
                AND NOT(valuationForm.isDeleted = "true")
                SET valuationForm = {valuationData}`;
    db.cypher({
        query: query,
        params:{
            propertyId: data.propId,
            valuationYear: data.valuationYear,
            valuationData: data.valuationData,
            formName: data.name
        }
    }, function(err, results) {
        // //console.log(results)
        cb(err, results);
    });

};

DAL.prototype.getModalData = function(data,cb){
    var formId = parseInt(data);
    var query = `MATCH(n:scenario)-[rel:OF]->(form) WHERE id(form)= {formId} return collect(properties(n)) as models`;
    // res.send(query)
    db.cypher({
        query: query,
        params: {
            formId: formId
        }
    }, function(err, results) {
        // //console.log(results)
        cb(err, results);
    });
};


DAL.prototype.getEvidenceFiles = function(propId, cb){
    var query = `MATCH (user:user)-[owns:OWNS]->(prop:property)
                WHERE id(prop) = `+propId+`
                OPTIONAL MATCH (prop)-[]-(ie:IE)
                OPTIONAL MATCH (prop)-[]-(rr:RR)
                OPTIONAL MATCH (prop)-[]->()<-[]-(other:otherFileNode)
                OPTIONAL MATCH (prop)<-[]-(taxBill:taxBill)
                return  collect(DISTINCT(ie)) + collect(DISTINCT(rr)) + collect(DISTINCT(other)) + collect(DISTINCT(taxBill)) as evidences`;
    db.cypher({
        query: query,
        params: {
            propertyId: propId
        }
    }, function(err, results) {
        // //console.log(results)
        cb(err, results);
    });
};


DAL.prototype.getEvidenceFilesById = function(fileIds,cb){
    var query = `MATCH (files) where id(files) IN {fileIds} return files`;
    db.cypher({
        query: query,
        params: {
            fileIds:fileIds
        }
    }, function(err, results) {
        // //console.log(results)
        cb(err, results);
    });
};

DAL.prototype.getFormsByPropertyId = function(data,cb){
    var query = `Match (prop:property)-[rel:OF]-(valuation:valuationNode)-[rel2:FormName]-(valuationForm:valuationForm) 
                WHERE id(prop) = {propertyId}
                AND rel.valuationYear = {valuationYear}
                AND valuationForm.isDeleted = "false"
                return rel2.name as name,rel2.status as status, valuationForm`;
    db.cypher({
        query: query,
        params: {
            propertyId:data.propId,
            valuationYear: data.valuationYear
        }
    }, function(err, results) {
        // //console.log(results)
        cb(err, results);
    });
};

DAL.prototype.getFormsByFormId = function(data,cb){
    var query = `MATCH (valuation:valuationNode)-[rel:FormName]-(valuationForm:valuationForm)
                where id(valuationForm) = `+data.formId+` return rel.name as name,valuationForm`;
    db.cypher({
        query: query,
        params: {
            formId:data.formId
        }
    }, function(err, results) {
        cb(err, results);
    });
};


DAL.prototype.checkWorkSpaceDataExistence = function(data, cb){
    var query = `Match (valuationForm:valuationForm)<-[]-(data)
                WHERE id(valuationForm) = {formId}
                AND data.name IN {name}
                return collect(data.name) as name`;
    db.cypher({
        query: query,
        params:{
            formId: data.formId,
            valuationYear: data.valuationYear,
            name: data.name,
        }
    }, function(err, results) {
        cb(err, results);
    });
};

DAL.prototype.replaceWorkSpace = function(data,cb){
    var params = {
        formId: data.formId
    };
    var query = `MATCH (valuationForm:valuationForm) 
                WHERE id(valuationForm) = {formId}`;

    for(var i = 0;i < data.scenarios.length;i++){
        data.scenarios[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.scenarios[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.scenarios[i].createdBy = data.userId;
        data.scenarios[i].modifiedBy = data.userId;
        params["scenario"+ i] = data.scenarios[i];
        params["scenarioName"+ i] = data.scenarios[i].name;
        query += `\n  WITH valuationForm MATCH(valuationForm)<-[]-(scenarioData`+ i +`) WHERE scenarioData`+ i +`.name = {scenarioName`+ i +`}
                    SET scenarioData`+ i +` = {scenario`+ i +`}`;
    }

    for(var i = 0;i < data.sensitivityCaluations[0].marketPerSF.length;i++){
        data.sensitivityCaluations[0].marketPerSF[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].marketPerSF[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].marketPerSF[i].createdBy = data.userId;
        data.sensitivityCaluations[0].marketPerSF[i].modifiedBy = data.userId;
        params["marketPerSF"+ i] = data.sensitivityCaluations[0].marketPerSF[i];
        params["marketPerSFName"+ i] = data.sensitivityCaluations[0].marketPerSF[i].name;
        query += `\n WITH valuationForm  MATCH(valuationForm)<-[]-(marketPerSFData`+ i +`) WHERE marketPerSFData`+ i +`.name = {marketPerSFName`+ i +`}
                    SET marketPerSFData`+ i +` = {marketPerSF`+ i +`}`;
    }

    for(var i = 0;i < data.sensitivityCaluations[0].vacancyPercent.length;i++){
        data.sensitivityCaluations[0].vacancyPercent[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].vacancyPercent[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].vacancyPercent[i].createdBy = data.userId;
        data.sensitivityCaluations[0].vacancyPercent[i].modifiedBy = data.userId;
        params["vacancyPercent"+ i] = data.sensitivityCaluations[0].vacancyPercent[i];
        params["vacancyPercentName"+ i] = data.sensitivityCaluations[0].vacancyPercent[i];
        query += `\n WITH valuationForm MATCH(valuationForm)<-[]-(vacancyPercentData`+ i +`) WHERE vacancyPercentData`+ i +`.name = {vacancyPercentName`+ i +`}
                    SET vacancyPercentData`+ i +` = {vacancyPercent`+ i +`}`;
    }

    for(var i = 0;i < data.sensitivityCaluations[0].expensePerSF.length;i++){
        data.sensitivityCaluations[0].expensePerSF[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].expensePerSF[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].expensePerSF[i].createdBy = data.userId;
        data.sensitivityCaluations[0].expensePerSF[i].modifiedBy = data.userId;
        params["expensePerSF"+ i] = data.sensitivityCaluations[0].expensePerSF[i];
        params["expensePerSFName"+ i] = data.sensitivityCaluations[0].expensePerSF[i].name;
        query += `\n WITH valuationForm  MATCH(valuationForm)<-[]-(expensePerSFData`+ i +`) WHERE expensePerSFData`+ i +`.name = {expensePerSFName`+ i +`}
                    SET expensePerSFData`+ i +` = {expensePerSF`+ i +`}`;
    }

    for(var i = 0;i < data.sensitivityCaluations[0].BaseCapRate.length;i++){
        data.sensitivityCaluations[0].BaseCapRate[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].BaseCapRate[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].BaseCapRate[i].createdBy = data.userId;
        data.sensitivityCaluations[0].BaseCapRate[i].modifiedBy = data.userId;
        params["BaseCapRate"+ i] = data.sensitivityCaluations[0].BaseCapRate[i];
        params["BaseCapRateName"+ i] = data.sensitivityCaluations[0].BaseCapRate[i].name;
        query += `\n WITH valuationForm  MATCH(valuationForm)<-[]-(BaseCapRateData`+ i +`) WHERE BaseCapRateData`+ i +`.name = {BaseCapRateName`+ i +`}
                    SET BaseCapRateData`+ i +` = {BaseCapRate`+ i +`}`;
    }

    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        //console.log(err);
        cb(err, results);
    });
};

DAL.prototype.saveWorkSpace = function(data, userId,cb){
    var params = {
        formId: data.formId
    };
    var query1 = `MATCH (valuationForm:valuationForm)<-[:OF]-(workspace) 
                WHERE id(valuationForm) = {formId}
                detach delete workspace`;
    var query = `MATCH (valuationForm:valuationForm) 
                WHERE id(valuationForm) = {formId}`;

    for(var i = 0;i < data.scenarios.length;i++){
        data.scenarios[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.scenarios[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.scenarios[i].createdBy = userId;
        data.scenarios[i].modifiedBy = userId;
        params["scenario"+ i] = data.scenarios[i];
        // query += `\nCREATE(scenario`+ i +`:scenario{scenario`+ i +`})
        params["scenarioName"+ i] = data.scenarios[i].name;
        query += `\n MERGE (valuationForm)<-[scenarioRel`+ i +`:OF]-(scenario`+ i +`:scenario{name:{scenarioName`+ i +`}})
                    ON CREATE SET scenario`+ i +` = {scenario`+ i +`}
                    ON MATCH SET scenario`+ i +` = {scenario`+ i +`}`

    }

    for(var i = 0;i < data.sensitivityCaluations[0].marketPerSF.length;i++){
        data.sensitivityCaluations[0].marketPerSF[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].marketPerSF[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].marketPerSF[i].createdBy = data.userId;
        data.sensitivityCaluations[0].marketPerSF[i].modifiedBy = data.userId;
        params["marketPerSF"+ i] = data.sensitivityCaluations[0].marketPerSF[i];
        params["marketPerSFName"+ i] = data.sensitivityCaluations[0].marketPerSF[i].name;
        query += `\nMERGE (valuationForm)<-[marketPerSFRel`+ i +`:OF]-(marketPerSF`+ i +`:marketPerSF{name:{marketPerSFName`+ i +`}})
                    ON CREATE SET marketPerSF`+ i +` = {marketPerSF`+ i +`}
                    ON MATCH SET marketPerSF`+ i +` = {marketPerSF`+ i +`}`;
    }

    for(var i = 0;i < data.sensitivityCaluations[0].vacancyPercent.length;i++){
        data.sensitivityCaluations[0].vacancyPercent[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].vacancyPercent[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].vacancyPercent[i].createdBy = data.userId;
        data.sensitivityCaluations[0].vacancyPercent[i].modifiedBy = data.userId;
        params["vacancyPercent"+ i] = data.sensitivityCaluations[0].vacancyPercent[i];
        params["vacancyPercentName"+ i] = data.sensitivityCaluations[0].vacancyPercent[i].name;
        query += `\nMERGE (valuationForm)<-[vacancyPercentRel`+ i +`:OF]-(vacancyPercent`+ i +`:vacancyPercent{name:{vacancyPercentName`+ i +`}})
                    ON CREATE SET vacancyPercent`+ i +` = {vacancyPercent`+ i +`}
                    ON MATCH SET vacancyPercent`+ i +` = {vacancyPercent`+ i +`}`;
    }

    for(var i = 0;i < data.sensitivityCaluations[0].expensePerSF.length;i++){
        data.sensitivityCaluations[0].expensePerSF[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].expensePerSF[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].expensePerSF[i].createdBy = data.userId;
        data.sensitivityCaluations[0].expensePerSF[i].modifiedBy = data.userId;
        params["expensePerSF"+ i] = data.sensitivityCaluations[0].expensePerSF[i];
        params["expensePerSFName"+ i] = data.sensitivityCaluations[0].expensePerSF[i].name;
        query += `\nMERGE (valuationForm)<-[expensePerSFRel`+ i +`:OF]-(expensePerSF`+ i +`:expensePerSF{name:{expensePerSFName`+ i +`}})
                    ON CREATE SET expensePerSF`+ i +` = {expensePerSF`+ i +`}
                    ON MATCH SET expensePerSF`+ i +` = {expensePerSF`+ i +`}`;
    }

    for(var i = 0;i < data.sensitivityCaluations[0].BaseCapRate.length;i++){
        data.sensitivityCaluations[0].BaseCapRate[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].BaseCapRate[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.sensitivityCaluations[0].BaseCapRate[i].createdBy = data.userId;
        data.sensitivityCaluations[0].BaseCapRate[i].modifiedBy = data.userId;
        params["BaseCapRate"+ i] = data.sensitivityCaluations[0].BaseCapRate[i];
        params["BaseCapRateName"+ i] = data.sensitivityCaluations[0].BaseCapRate[i].name;
        query += `\nMERGE (valuationForm)<-[BaseCapRateRel`+ i +`:OF]-(BaseCapRate`+ i +`:BaseCapRate{name:{BaseCapRateName`+ i +`}})
                    ON CREATE SET BaseCapRate`+ i +` = {BaseCapRate`+ i +`}
                    ON MATCH SET BaseCapRate`+ i +` = {BaseCapRate`+ i +`}`;
    }
    // //console.log(query);

    db.cypher({
        query: query1,
        params: params
    }, function(err, results) {
        db.cypher({
            query: query,
            params: params
        }, function(err, results) {
            //console.log(err);
            cb(err, results);
        });
        //console.log(err);
        // cb(err, results);
    });


};

DAL.prototype.getWorkSpace = function(data, cb){
    var query = `MATCH (valuationForm:valuationForm) 
                WHERE id(valuationForm) = {formId}
                OPTIONAL MATCH (valuationForm)<-[]-(marketPerSF:marketPerSF)
                OPTIONAL MATCH (valuationForm)<-[]-(vacancyPercent:vacancyPercent)
                OPTIONAL MATCH (valuationForm)<-[]-(expensePerSF:expensePerSF)
                OPTIONAL MATCH (valuationForm)<-[]-(BaseCapRate:BaseCapRate)
                OPTIONAL MATCH (valuationForm)<-[]-(scenario:scenario)
                with *
                ORDER BY marketPerSF.name
                with *
                ORDER BY vacancyPercent.name
                with *
                ORDER BY expensePerSF.name
                with *
                ORDER BY BaseCapRate.name
                with *
                ORDER BY scenario.name
                return collect (DISTINCT properties(marketPerSF)) as marketPerSF,collect (DISTINCT properties(vacancyPercent)) as vacancyPercent,
                collect (DISTINCT properties(expensePerSF)) as expensePerSF,
                collect (DISTINCT properties(BaseCapRate)) as BaseCapRate,collect (DISTINCT properties(scenario)) as scenarios`;

    db.cypher({
        query: query,
        params:{
            formId: data.formId
        }
    }, function(err, results) {
        cb(err, results);
    });
};

DAL.prototype.appeal = function(data, cb){
    var query = `MATCH(n:valuationForm)-[rel:FormName]-() WHERE id(n) = {formId}
                    SET rel.status = "true"`;
    db.cypher({
        query: query,
        params:{
            formId: data.formId
        }
    }, function(err, results) {
        cb(err, results);
    });
};

DAL.prototype.deleteValuationForm = function(data, cb){
    var query = `MATCH(n:valuationForm) WHERE id(n) = {formId}
                    SET n.isDeleted = "true"`;
    db.cypher({
        query: query,
        params:{
            formId: data.formId
        }
    }, function(err, results) {
        cb(err, results);
    });
};

DAL.prototype.getEvidenceFilesPathById = function(fileIds, cb){
    var query = `OPTIONAL MATCH(ie:IE) where id(ie) IN {fileIds} 
                OPTIONAL MATCH(rr:RR) where id(rr) IN {fileIds}
                OPTIONAL MATCH(tb:taxBill) where id(tb) IN {fileIds}
                OPTIONAL MATCH(of:otherFileNode) where id(of) IN {fileIds}
                return collect(ie.fileName[1]+'||'+id(ie)) as ieFiles, collect(rr.fileName[1]+'||'+id(rr)) as rrFiles, collect(tb.fileName+'||'+id(tb)) as tbFiles, collect(of.fileName+'||'+id(of)) as ofFiles`;
    db.cypher({
        query: query,
        params:{
            fileIds: fileIds
        }
    }, function(err, results) {
        cb(err, results);
    });
};


DAL.prototype.getIEERRAppealPackage = function(data, cb){
    // //console.log(fileIds);
    var rrMaxTime = new Date((data.year)+1).getTime();
    var rrMinTime = new Date(parseInt(data.year)-2).getTime();
    //console.log(rrMaxTime);
    //console.log(rrMinTime);
    // var query = `MATCH(prop:property) where id(prop) = {propId}
    //             MATCH(prop)<-[rel:OF]-(ie:IE)
    //             where ie.isDeleted = false
    //             AND {year} >= toInt(ie.IEYear[1]) >= ({year} - 2)
    //             return collect(ie.filePath[1]) as iePaths`;
    var query = `MATCH(prop:property) where id(prop) = {propId}
                MATCH(prop)<-[rel:OF]-(ie:IE)
                where ie.isDeleted = false
                AND {year} >= toInt(ie.IEYear[1]) >= ({year} - 2)
                MATCH(prop)<-[rel1:AS_OF]-(rr:RR)
                where rr.isDeleted = false
                AND {rrMaxTime} >= toInt(rr.asOfDate[1]) >= {rrMinTime}
                return collect(rr.fileName[1]) as rrPaths, collect(ie.fileName[1]) as iePaths`;
        db.cypher({
        query: query,
        params:{
            propId: parseInt(data.propId),
            formId: parseInt(data.formId),
            rrMinTime: rrMinTime,
            rrMaxTime: rrMaxTime,
            year: parseInt(data.year)
        }
    }, function(err, results) {
        cb(err, results);
    });
};
