var moment = require('moment-timezone');
var path = require('path');
var execute_query = require(path.resolve(__dirname, './execute_sql'));
var db = require(path.resolve(__dirname, './graphConnection'));
var func = require(path.resolve(__dirname, '../BLL/util/functions'));
var userRoles = require(path.resolve(__dirname, '../BLL/util/userRoles'));
var converter = new func();

module.exports = DAL;

function DAL() {

}

// ---------------------------------------------
// getAllSurveysMetaData
// ---------------------------------------------
DAL.prototype.getAllSurveysMetaData = function(cb) {
    var counter = 1
    var getAllSurveysMetaDataQuery = `SELECT
	s.assessingAuthName,
	s.listRelevantWebsites,
	s.interviewer,
	s.phoneNumberCalled,
	CONVERT(VARCHAR(10),s.dateCalled,110) AS dateCalled,
	s.interviewee,
	s.intervieweeOfficeAddress,
	s.intervieweeOfficeEmail,
	s.createDate,
	s.id
	FROM surveyMetaData s
	ORDER BY
	s.dateCalled DESC`;
    execute_query(getAllSurveysMetaDataQuery, function(error, result) {
        cb(error, result)
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getAllSurveysDataById
// ---------------------------------------------
DAL.prototype.getAllSurveysDataById = function(id, cb) {
    var counter = 1
    var getAllSurveysDataByIdQuery = `SELECT
	s.[section],
	q.question,
	q.id,
	a.answer,
	a.surveyMetaDataId
	FROM sections s
	INNER JOIN dbo.questions q ON q.sectionId = s.id
	INNER JOIN dbo.answers a ON a.questionId = q.id
	WHERE a.surveyMetaDataId = ` + id + ``;
    execute_query(getAllSurveysDataByIdQuery, function(error, result1) {
        if (error !== null) {
            cb(error, result1)
        }
        // Query 2
        var query = `SELECT
		c.address,
		c.email,
		c.phone,
		a.questionId
		FROM
		answers a
		INNER JOIN contactDetails c ON c.answereId = a.id
		WHERE
		a.surveyMetaDataId = ` + id + ` AND
		a.questionId BETWEEN 41 AND 42
		ORDER BY
		a.questionId ASC`;
        execute_query(query, function(error, result2) {
            if (error !== null) {
                cb(error, result2)
            }
            //Accepted By Daniyal And Sir 
            var arr1 = [];
            var arr2 = [];
            for (var i = 0; i < result2.length; i++) {
                if (result2[i].questionId === 41)
                    arr1.push(result2[i]);
                if (result2[i].questionId === 42)
                    arr2.push(result2[i]);
            }
            result1[40].contactDetails = arr1;
            result1[41].contactDetails = arr2;

            cb(error, result1);
        });
        // Query 2 END
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// addAJRules
// ---------------------------------------------
DAL.prototype.addAJRules = function(aJRules, cb) {
    var counter = 1
    var createDate = moment.tz(Date.now(), "America/New_York").format('YYYY-MM-DD HH:mm:ss');

    var addAJRulesQuery = "DECLARE @SMD_ID INTEGER\
		\nDECLARE @ANS1_ID INTEGER\
		\nDECLARE @ANS2_ID INTEGER\
		\nINSERT INTO dbo.surveyMetaData VALUES\
		('" + aJRules.surveyMetaData.assessingAuthName + "',\
		'" + aJRules.surveyMetaData.listRelevantWebsites + "',\
		'" + aJRules.surveyMetaData.interviewer + "',\
		'" + aJRules.surveyMetaData.phoneNumberCalled + "',\
		'" + aJRules.surveyMetaData.dateCalled + "',\
		'" + aJRules.surveyMetaData.interviewee + "',\
		'" + aJRules.surveyMetaData.intervieweeOfficeAddress + "',\
		'" + aJRules.surveyMetaData.intervieweeOfficeEmail + "','" + createDate + "')\
		\nSELECT @SMD_ID = SCOPE_IDENTITY()";

    for (var i = 0; i < aJRules.questions.length; i++) {
        addAJRulesQuery = addAJRulesQuery + "\nINSERT INTO dbo.answers VALUES(" + aJRules.questions[i].qId + ",\
		'" + aJRules.questions[i].answer + "',@SMD_ID)";

        if (aJRules.questions[i].contactDetails) {
            addAJRulesQuery = addAJRulesQuery + "\nSELECT @ANS" + counter + "_ID = SCOPE_IDENTITY()";
            for (var j = 0; j < aJRules.questions[i].contactDetails.length; j++) {
                addAJRulesQuery = addAJRulesQuery + "\nINSERT INTO \
			dbo.contactDetails VALUES(@ANS" + counter + "_ID,\
			'" + aJRules.questions[i].contactDetails[j].address + "',\
			'" + aJRules.questions[i].contactDetails[j].email + "',\
			'" + aJRules.questions[i].contactDetails[j].phone + "')";
            }
            counter = counter + 1;
        }
    }
    execute_query(addAJRulesQuery, function(error, result) {
        cb(error, result);
    });
}
// ---------------------END---------------------



// ---------------------------------------------
// get all properties Master and Slaves with pagination
// ---------------------------------------------
// DAL.prototype.getAllAJProperties = function(data, cb) {
//     data.userId = parseInt(data.userId);
//     data.pageSize = parseInt(data.pageSize);
//     data.pageNumber = parseInt(data.pageNumber);
    
//     var skip = (data.pageNumber - 1) * data.pageSize;
    
//     var query2 = `MATCH (n:user)-[rel:OWNS]->(master:property)
//         WHERE n.role = "Assessing Authority" AND master.isDeleted = false
//         WITH n, master
//         ORDER BY id(master) DESC SKIP ` + skip + ` LIMIT ` + data.pageSize + `
//         RETURN collect(master) AS properties`;
    
//     // Getting total records count from DB
//     db.cypher({
//         query: `MATCH (user:user)-[:OWNS]->(prop:property) WHERE user.role = "Assessing Authority" AND prop.isDeleted = false
//             RETURN count(prop) AS totalProperties`,
//         params:{
//             userId:data.userId
//         }
//     }, function(err, count) {
//         if(err){
//             // console.log(count);
//             cb(err, count);
//             return;
//         } else if(count[0] === undefined){
//             cb(new Error('totalProperties not Found'), count);
//             return;
//         }

//         // Getting records from DB
//         db.cypher({
//             query: query2,
//             params:{
//                 userId:data.userId
//             }
//         }, function(err, result) {
//             result = {
//                 totalRecords: count[0].totalProperties,
//                 data:result
//             }
//             cb(err, result);
//         });
//     });
// };
// ---------------------END---------------------

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.updateJurisdictionRules = function(data, cb) {
	// console.log("here it is00")
    // var query = `MATCH(n:property)-[:publicRelation]->(publicProperty)<-[*]-(user:user)-[:appealForm]->(form)
    // 			 where id(n) = 115386 return DISTINCT(form), publicProperty.landArea as landArea,
	//             publicProperty.buildingArea as buildingArea`;
	var params = {};
	var query = "";
	// console.log(JSON.stringify(data));
	for(var i = 0; i < data.length; i++){
		var jurisdictionName = data[i].jurisdictionName;
		params["jurisdictionName" + i] = jurisdictionName;
		params["data" + i] = data[i];
		if(i > 0){
			query += "WITH * ";
		}

		query += `MERGE(n`+i+`:ajRUles{jurisdictionName: {jurisdictionName`+i+`}}) 
		ON MATCH SET n`+i+` = {data`+i+`}
		ON CREATE SET n`+i+` = {data`+i+`}`;

		// query += `MATCH(n`+i+`:ajRules) where n`+i+`.jurisdictionName = '`+jurisdictionName+`'
		// 		SET n`+i+` = {data`+i+`}\n`;
	}

    // var query = `MATCH(n:property)-[:publicRelation]->(publicProperty)-[*]-(user:user)-[:appealForm]->(form:appealForm)
    //  where id(n) = 115386 return form`;

	// console.log(JSON.stringify(params));
	console.log(query);
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
DAL.prototype.getFormSubmissions = function(cb) {
	var query = `MATCH a = (:surveyForm)-[:version]->(version:formVersion)-[:hasSubmission]-(:surveySubmission)
	with collect(a) as paths
	CALL apoc.convert.toTree(paths) yield value
	RETURN value`;
	db.cypher({
		query: query
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.addNewSubmission = function(cb) {
	var query = `MATCH a = (:surveyForm)-[:version]->(version:formVersion)-[:hasSubmission]-(:surveySubmission)
	with collect(a) as paths
	CALL apoc.convert.toTree(paths) yield value
	RETURN value`;
	db.cypher({
		query: query
    }, function(err, results) {
        cb(err, results);
    });
}

