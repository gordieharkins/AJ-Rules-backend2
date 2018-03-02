var path = require('path');
var InvalidFileFormat = require('../BLL/errors/invalidFileFormat');
var db = require(path.resolve(__dirname, './graphConnection'));
var func = require(path.resolve(__dirname, '../BLL/util/functions'));
var SQL = require('mssql');
var func = require(path.resolve(__dirname, '../BLL/util/functions'));
var converter = new func();

module.exports = DAL;

// Class Constructor
function DAL() {

}

//--------------------------------------------------------
// getTimelineForJurisdiction
//--------------------------------------------------------
DAL.prototype.getTimelineForJurisdiction = function(data, cb) {
    var getTimelineForJurisdiction = `SELECT
		dbo.surveySubmissions.assessingJurisdiction,
		dbo.responses.[value],
		dbo.questions.question
		FROM
		dbo.surveyList
		INNER JOIN dbo.surveySubmissions ON dbo.surveySubmissions.surveyListId = dbo.surveyList.id
		INNER JOIN dbo.responses ON dbo.responses.surveySubmissionId = dbo.surveySubmissions.id
		INNER JOIN dbo.questions ON dbo.responses.questionId = dbo.questions.id
		WHERE
		dbo.surveyList.id = 104 AND
		dbo.surveySubmissions.assessingJurisdiction = @jurisdiction AND
		dbo.responses.questionId IN (216, 217, 220, 226, 227) AND
		dbo.surveySubmissions.isDeleted = 0
		`;

    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("jurisdiction", SQL.VarChar(), data.jurisdiction);

    sqlRequest.query(getTimelineForJurisdiction).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        cb(err, null);
    });
}

//--------------------------------------------------------
// getTimelineForJurisdiction
//--------------------------------------------------------
DAL.prototype.getJurisdictions = function(data, cb) {
    var query = `Match(jurisdiction:jurisdiction) return jurisdiction`;
     db.cypher({
        query: query

    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getTimelineForJurisdiction
//--------------------------------------------------------
DAL.prototype.getAllPropertiesTimelineStatus = function(data, userId, cb) {
    var query = `Match(user:user)-[:OWNS]->(prop) where id(user) = {userId}
                OPTIONAL MATCH(prop)-[:Status]->(status)
                return id(prop) as propertyId, properties(status) as status, prop.propertyName as propertyName,
                prop.assessingAuthority as jurisdiction
                `;
     db.cypher({
        query: query,
        params: {
            userId: userId
        }

    }, function(err, results) {
        cb(err, results);
    });
}

// //--------------------------------------------------------
// // getTimelineForJurisdiction
// //--------------------------------------------------------
// DAL.prototype.getUserJurisdictions = function(userId, cb) {
//     var query = `Match(user:user)-[:OWNS]->(prop) where id(user) = {userId}
//                 return id(prop) as propertyId, prop.propertyName as propertyName,
//                 prop.assessingAuthority as jurisdiction
//                 `;
//      db.cypher({
//         query: query,
//         params: {
//             userId: userId
//         }

//     }, function(err, results) {
//         cb(err, results);
//     });
// }

//--------------------------------------------------------
// getTimelineForJurisdiction
//--------------------------------------------------------
DAL.prototype.getJurisdictionTimeline = function(data, userId, cb) {
    var query = `Match(jurisdiction:jurisdiction)-[:Timeline]->(timeline)-[:Event]->(events) where jurisdiction.name = {jurisdictionName}
                OPTIONAL MATCH(events)-[:DefaultInternalEvent]->(defaultInternalEvent)
                OPTIONAL MATCH(events)-[:HAS]->(internalEvents)<-[*]-(user:user) where id(user) = {userId}
                OPTIONAL MATCH(internalEvents)<-[*]-(prop:property)
                return events, internalEvents, collect(DISTINCT(prop.propertyName)) as propertyNames Order by Id(events)
                `;
                // return events, internalEvents, id(prop) Order by Id(events)
                // OPTIONAL MATCH(internalEvents)<-[:HAS]-(t)<-[:InternalEvents]-(timeline)<-[:Timeline]-(prop:property)


     db.cypher({
        query: query,
        params: {
            jurisdictionName: data.jurisdictionName,
            userId: userId
        }

    }, function(err, results) {
        cb(err, results);
    });
}

DAL.prototype.getNotifications = function(userId, cb) {
    var query = `match (u:user)-[notification:notification]->(notifications:notifications) where id(u) = {userId} return notification, notifications order by notification.readFlag,notification.daysLeft asc`;

     db.cypher({
        query: query,
        params: {
            userId: userId
        }

    }, function(err, results) {
        cb(err, results);
    });
}

DAL.prototype.markAsRead = function(notId, cb) {
    // console.log("noti id: ",notId);
    var query = `Match ()-[rel:notification]->(notification:notifications) where id(notification) = {notId} set rel.readFlag = 1 return notification`;

     db.cypher({
        query: query,
        params: {
            notId: notId
        }

    }, function(err, results) {
        cb(err, results);
    });
}


DAL.prototype.getUserIds = function(cb){
    var query =  `MATCH (u:user) return id(u) as id, u.role as role`;
    db.cypher({
        query: query

    }, function(err, results) {
        cb(err, results);
    });

}

//--------------------------------------------------------
// sendNotifications
//--------------------------------------------------------
//old query
// `Match (user) where id(user) = {userId}
// create (n: notifications{details})
// create (user)-[:notification]->(n)`;
DAL.prototype.sendNotifications = function(details,readFlag,daysLeft,userId,cb) {
    // console.log(JSON.stringify(details));
    // var query = `Match (user) where id(user) = {userId} 
    //             merge (n: notifications`+converter.cypherJsonConverter(details)+`)
    //             create unique(user)-[:notification]->(n)`;

                // var query = `Match (user) where id(user) = {userId} 
                // merge (n: notifications{details})
                // create unique(user)-[:notification]->(n)`;


    var query = `Match (user) where id(user)= {userId} 
                merge (user)-[rel:notification]-> (n: notifications`+converter.cypherJsonConverter(details)+`)
                ON MATCH SET rel.daysLeft = {daysLeft},rel.readFlag = {readFlag}
                ON CREATE SET rel.daysLeft = {daysLeft},rel.readFlag = {readFlag}`;

     db.cypher({
        query: query,
        params: {
            details: details,
            readFlag: readFlag,
            daysLeft: daysLeft,
            userId: userId
        }

    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getTimelineForJurisdiction
//--------------------------------------------------------
DAL.prototype.createNewInternalEvent = function(data, userId, cb) {
    var query = `MATCH (user:user) where id(user) = {userId}
                MERGE(user)-[:Timeline]->(timeline:timeline)-[:InternalEvents]->(event:internalEvents)
                CREATE(internalEvent:internalEvent{internalEvent})
                Create(event)-[:Has]->(internalEvent)
                `;
     db.cypher({
        query: query,
        params: {
            internalEvent: data.internalEvent,
            userId: userId
        }

    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getTimelineForJurisdiction
//--------------------------------------------------------
DAL.prototype.getInternalEvent = function(data, userId, cb) {
    var query = `MATCH (user:user) where id(user) = {userId}
                MATCH (user)-[:Timeline]->(timeline:timeline)-[*]->(internalEvents:internalEvent)
                return internalEvents
                `;
     db.cypher({
        query: query,
        params: {
            userId: userId
        }

    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getTimelineForJurisdiction
//--------------------------------------------------------
DAL.prototype.linkInternalEvent = function(data, cb) {
    var query = `MATCH (externalEvent) where id(externalEvent) = {externalId}
                MATCH (internalEvents) where id(internalEvents) IN {internalIds}
                MATCH (properties) where id(properties) IN {propertyIds}
                MERGE(properties)-[:Timeline]->(timeline:timeline)-[:InternalEvents]->(event:internalEvents)
                MERGE (externalEvent)-[:HAS]->(internalEvents)
                MERGE (event)-[:HAS]->(internalEvents)
                `;



     db.cypher({
        query: query,
        params: {
            externalId: data.externalId,
            internalIds: data.internalIds,
            propertyIds: data.propertyIds
        }

    }, function(err, results) {
        cb(err, results);
    });
}

// //--------------------------------------------------------
// // getTimelineForJurisdiction
// //--------------------------------------------------------
// DAL.prototype.linkInternalEvent = function(data, cb) {
//     console.log(data);
//     var query = `MATCH (externalEvent) where id(externalEvent) = {externalId}
//                 MATCH (internalEvents) where id(internalEvents) IN {internalIds}
//                 CREATE (externalEvent)-[:HAS]->(internalEvents)
//                 `;
//      db.cypher({
//         query: query,
//         params: {
//             externalId: data.externalId,
//             internalIds: data.internalIds
//         }

//     }, function(err, results) {
//         cb(err, results);
//     });
// }


//--------------------------------------------------------
// getTimelineForJurisdiction
//--------------------------------------------------------
DAL.prototype.addJurisdictionTimeline = function(data, cb) {
    var params = {
        jurisdictionName: data.jurisdictionName
    }
    var query = `MATCH(j:jurisdiction) where j.name = {jurisdictionName}\n`;
    query += `MERGE(j)-[:Timeline]-(t:timeline{})\n`
    for(var i = 0; i < data.events.length; i++){
        params['event'+i] = data.events[i];
        query += `Create(event`+i+`: Event{event`+i+`}) 
                CREATE(t)-[:Event]->(event`+i+`)`;
    }


     db.cypher({
        query: query,
        params: params

    }, function(err, results) {
        cb(err, results);
    });
}