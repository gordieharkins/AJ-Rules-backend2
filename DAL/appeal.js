var path = require('path');
var InvalidFileFormat = require('../BLL/errors/invalidFileFormat');
var db = require(path.resolve(__dirname, './graphConnection'));
var func = require(path.resolve(__dirname, '../BLL/util/functions'));
var func = require(path.resolve(__dirname, '../BLL/util/functions'));
var converter = new func();

module.exports = DAL;

// Class Constructor
function DAL() {

}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.getFormDataForJurisdiction = function(data, cb) {
	// console.log("here it is00")
    var query = `MATCH(n:property)-[:publicRelation]->(publicProperty)<-[*]-(user:user)-[:appealForm]->(form)
    			 where id(n) = 115386 return DISTINCT(form), publicProperty.landArea as landArea,
                publicProperty.buildingArea as buildingArea`;

    // var query = `MATCH(n:property)-[:publicRelation]->(publicProperty)-[*]-(user:user)-[:appealForm]->(form:appealForm)
    //  where id(n) = 115386 return form`;

     db.cypher({
        query: query,
        params: {
        	propertyId: parseInt(data.propertyId)
        }
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.getIESurveyInformation = function(data, cb) {
    // console.log("here it is00");
    // console.log(data.revalYear);
    var revalYear = new Date(data.revalYear).getTime().toString();
    // console.log(revalYear);
    // console.log(data.propId);
    var query = `MATCH(n:property)-[:revalYear]->(revalNode: revalYear)<-[:OF]-(ie:IEsurvey)<-[:OF]-(data) 
                where id(n) IN {propId} AND revalNode.year = {revalYear}
                return ie, collect(data) as submodules, id(n) as propertyId`;

    db.cypher({
        query: query,
        params: {
            propId: data.propId,
            revalYear: revalYear
        }
    }, function(err, results) {
        // console.log(results);
        cb(err, results);
    });
}

//--------------------------------------------------------
// updateIESurveyInformation
//--------------------------------------------------------
DAL.prototype.updateIESurveyInformation = function(data, cb) {
    // console.log("here it is00");
    // console.log(data.revalYear);
    params = {};
    var query = "";
    for(var i = 0; i < data.length; i++){
        params['data' + i] = data[i].properties;
        params['label' + i] = data[i].labels[0];
        params['id' + i] = data[i]._id;
        query += `MATCH(n:{label`+i+`}) where id(n) = {id+`+i+`} 
                SET n = {data`+i+`} `;
    }
    // console.log(data.propId);
    // var query = `MATCH(n:property)-[:revalYear]->(revalNode: revalYear)<-[:OF]-(ie:IEsurvey)<-[:OF]-(data) 
    //             where id(n) IN {propId} AND revalNode.year = {revalYear}
    //             return ie, collect(data) as submodules, id(n) as propertyId`;

    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        // console.log(results);
        cb(err, results);
    });
}


//--------------------------------------------------------
// addPropertyTimelineData
//--------------------------------------------------------
DAL.prototype.addPropertyTimelineData = function(data, timeline, year, cb) {
 
    var params = {};
    var query = ``;
    for(var i = 0; i < data.length; i++){
        params["propId"+i] = parseInt(data[i].propId);
        params["year"] = year;
        var tempTimeline = timeline;
        query += `MATCH(n`+i+`:property) where id(n`+i+`) = {propId`+i+`}
                CREATE(t`+i+`:timeline{})
                CREATE(n`+i+`)-[tRel`+i+`:revalYear{revalYear: {year}}]->(t`+i+`)`;

        for(var j in tempTimeline){
            
            params["event" +i+""+j] = tempTimeline[j].main;
            // delete tempTimeline[j].main; 
            query += `\nCREATE(e`+i+""+j+`:event{event`+i+""+j+`})`;
            query += `\nCREATE(t`+i+`)-[:Event]->(e`+i+""+j+`)`;
            for(var k in tempTimeline[j]){
                if(k == "main"){
                    continue;
                }
                params["subevent"+i+j+k+""] = tempTimeline[j][k]
                query += `\nCREATE(se`+i+j+k+""+`:subEvent{subevent`+i+j+k+""+`})`;
                query += `\nCREATE(e`+i+""+j+`)-[:subEvent]->(se`+i+j+k+""+`)`;
            }
        }

    }
    // console.log(params);
    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        // console.log(results);
        cb(err, results);
    });
}


//--------------------------------------------------------
// getPropertyTimelineData
//--------------------------------------------------------
DAL.prototype.getPropertyTimelineData = function(userId, appealYear, cb) {
    var query = `MATCH(n:user)-[:OWNS]->(prop:property) where id(n) = {userId} AND prop.isDeleted <> true
    OPTIONAL MATCH (prop)-[revalYear:revalYear]->(t:timeline)-[:Event]->(event:event)
    OPTIONAL MATCH (event)-[:subEvent]->(subevent:subEvent)
    OPTIONAL MATCH (event)-[:additional_item]->(otherFile: otherFileNode)
    return id(prop) as propertyId, prop.assessingAuthority as jurisdiction, prop.propertyName as propertyName, prop.formattedAddress as address, prop.streetAddress as streetAddress,  
    prop.recordOwnerName as ownerName, prop.zip as zipCode, prop.taxAccountNo as taxAccountNo, event, collect(subevent) as subEvent, collect(DISTINCT otherFile) as additionalItems ORDER BY id(event)`;

    var params = {
        userId: userId
    };

    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}


//--------------------------------------------------------
// getPropertyTimelineData
//--------------------------------------------------------
DAL.prototype.updateData = function(data, id, cb) {
    // console.log(JSON.stringify(data));
    var params = {};
    var query = "";
    if(Array.isArray(data)){
        for(var i = 0; i < data.length; i++){
            if(i > 0){
                query += " WITH *";
            }
            params['data'+i] = data[i].properties;
            params['id'+i] = data[i]._id;
            query += `MATCH(n`+i+`) where id(n`+i+`) = {id`+i+`} SET n`+i+` = {data`+i+`}\n`;
        }
    } else {
        params = {
            data: data,
            id: id
        }
        query = `MATCH(n) where id(n) = {id} SET n = {data}`;
    }

    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// generateNotification
//--------------------------------------------------------
DAL.prototype.generateNotification = function(notification, eventId, cb) {
    var params = {
        eventId: eventId,
        remainingDays: notification.remainingDays
    };

    delete notification.remainingDays;
    var query = `MATCH(n) where id(n) = {eventId}
                MERGE(n)-[rel:notification]->(notification:notification`+converter.cypherJsonConverter(notification)+`)
                ON MATCH SET rel.remainingDays = {remainingDays}
                ON CREATE SET rel.remainingDays = {remainingDays}`;

    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// getNotification
//--------------------------------------------------------
DAL.prototype.getNotification = function(userId, cb) {
    var query = `MATCH(n:user) where id(n) = {userId}
    MATCH (n)-[:OWNS]-(p:property) where p.isDeleted <> true
    MATCH (p)-[]->(:timeline)-[]->(event:event)
    OPTIONAL MATCH (event)-[:subEvent]->(subEvent:subEvent)
    OPTIONAL MATCH (event)-[days:notification]-(notification:notification) Where event.status <> "Done"
    OPTIONAL MATCH (subEvent)-[days1:notification]-(notification1:notification) Where subEvent.status <> "Done"
    RETURN properties(notification) as notification, 
    properties(notification1) as notification1, days1.remainingDays as remainingDays`;

    var params = {
        userId: userId
    };

    // console.log(query);
    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
// executeSignature
//--------------------------------------------------------
DAL.prototype.executeSignature = function(userId, cb) {
    var query = `MATCH(n:user) where id(n) = {userId} return n.pin as pin`;
    var params = {
        userId: userId
    };

    // console.log(query);
    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}