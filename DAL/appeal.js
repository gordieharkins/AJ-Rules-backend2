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
    // console.log(userId);
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
// getJurisdictionTimelineData
//--------------------------------------------------------
DAL.prototype.getJurisdictionTimelineData = function(jurisdiction, cb) {
    var params = {
        jurisdiction: jurisdiction
    };
    console.log(params);
    // delete notification.remainingDays;
    var query = `MATCH(n:ajRUles) where n.jurisdictionName = {jurisdiction} return properties(n) as rules`;

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

//--------------------------------------------------------
// getJurisdictionTimelineData
//--------------------------------------------------------
DAL.prototype.getUsersforProperty = function(propertyId, cb) {
    var params = {
        propertyId: propertyId
    };
    // delete notification.remainingDays;
    var query = `MATCH(n:property) where id(n) = {propertyId}
                OPTIONAL MATCH(n)-[:OWNS]-(owner:user)
                OPTIONAL MATCH(n)-[:ASSIGNED_TO]-(agent:user)
                return collect(owner) as owner, collect(agent) as agent`;

    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}


DAL.prototype.getAlreadyCreadyInviteId = function(userIds, sendingDate, cb) {
    var params = {
        userIds: userIds,
        sendingDate: sendingDate
    };
    // delete notification.remainingDays;
    console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
    
    var query = `MATCH(users:user)-[]->(invite:calendarInvite)
                WHERE invite.start = {sendingDate} AND id(users) IN {userIds} AND invite.sent = false           
                MATCH(otherUsers:user)-[]->(invite)
                WITH invite, size({userIds}) as usersCount, count(DISTINCT users) as cnt, 
                count(DISTINCT otherUsers) as otherCount 
                WHERE cnt = otherCount AND usersCount = cnt
                RETURN invite
                `;
    // console.log(query);
    // console.log(params);
    // params.push("S");
    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        console.log("DALUseridsqdasdasdasdasd",userIds,results);
        // console.log("DALresults: ", );
        cb(err, results);
    });
}

DAL.prototype.addCalendarInvite = function(ownerIds, agentsIds, calendarInvite, cb) {
    
    var mainInvite = {
        start: calendarInvite.start,
        end: calendarInvite.end,
        title: calendarInvite.title,
        description: calendarInvite.description,
        location: calendarInvite.location,
        from: calendarInvite.from,
        to: calendarInvite.to,
        method: calendarInvite.method,
        uid: calendarInvite.uid,
        subject: calendarInvite.subject,
        text: calendarInvite.text,
        status: calendarInvite.status,
        alarmType: "audio",
        trigger: 60,
        sent: calendarInvite.sent,
        propertyCount: calendarInvite.propertyCount
    };


    // console.log(mainInvite);
    // var organizer = calendarInvite.organizer

    // var alarmSettings = {
    //     type: "audio",
    //     trigger: 60
    // }

    // var attendies = calendarInvite.attendies;

    var params = {
        ownerIds: ownerIds,
        agentsIds: agentsIds,
        mainInvite: mainInvite
    };


    // delete notification.remainingDays;
    var query = `MATCH(owner:user) where id(owner) IN {ownerIds}
                OPTIONAL MATCH(agents:user) where id(agents) IN {agentsIds}
                CREATE (invite:calendarInvite{mainInvite})
                CREATE (owner)-[rel:organizer]->(invite)
                FOREACH (o IN CASE WHEN agents IS NOT NULL THEN [agents] ELSE [] END |
                        CREATE(agents)-[:attends]->(invite)
                )
                RETURN id(invite)`;

    // console.log("aaaaaaaaaaa",ownerIds);
    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        // console.log("qaaaaaaaaaaaaaaaa", results);
        // console.log("AAAAAAAAAAAAAAAAA", params);
        cb(err, results);
    });
};

DAL.prototype.getCalendarInvite = function(cb) {
    var query = `MATCH(invites:calendarInvite) where invites.sent = false
                MATCH(invites)<-[:organizer]-(owner:user)
                OPTIONAL MATCH(invites)<-[:attends]-(agent:user)
                RETURN invites, owner.name as ownerName, owner.company as ownerEmail, collect(DISTINCT agent.company) as agentEmails`;

    db.cypher({
        query: query
    }, function(err, results) {
        cb(err, results);
    });
};

DAL.prototype.updateCalendarInvite = function(inviteId, data, cb) {
    var query = `MATCH(invite:calendarInvite) where id(invite) = {inviteId} SET invite = {data}`;

    db.cypher({
        query: query,
        params: {
            inviteId: inviteId,
            data: data
        }
    }, function(err, results) {
        cb(err, results);
    });
};