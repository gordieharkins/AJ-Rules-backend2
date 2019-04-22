//Users DAL
var moment = require('moment-timezone');
var path = require('path');
var db = require(path.resolve(__dirname, './graphConnection'));
var SQL = require('mssql');
var func = require(path.resolve(__dirname, '../BLL/util/functions'));
var converter = new func();

module.exports = DAL;

//Class Constructor
function DAL() {

}

// ---------------------------------------------
// userSignIn
// ---------------------------------------------
DAL.prototype.userSignIn = function(data, cb) {
    var query = `MATCH (user:user)
        WHERE user.email1= {email} AND user.password =  {password}
        MATCH (role:UserRole) WHERE role.name=user.role
        RETURN id(user) AS userId, properties(user) AS userData, properties(role) as roles`;
    db.cypher({
        query: query,
        params:{
            email:data.email,
            password:data.password
        }
    }, function(err, results) {
        cb(err,results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// getAllInvitedUsers
// ---------------------------------------------
DAL.prototype.getAllInvitedUsers = function(data, cb) {
    var query = "MATCH (admin:user)-[rel:REFERRED]->(user:user)" +
        "\nWHERE id(admin) = " + data + "" +
        "\nRETURN id(user) AS userId,user.name AS userName,user.email1 AS email," +
        "user.status AS status, rel.inviteDate AS inviteDate, user.action AS action";
    db.cypher({
        query: query
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// getUserDataByToken
// ---------------------------------------------
DAL.prototype.getUserDataByToken = function(data, cb) {
    var query = "Match (user:user)<-[rel:REFERRED]-(admin:user) " +
        "\nWHERE user.status = \"pending\" AND user.token = " + data + "" +
        "\nRETURN id(admin) AS ID,admin.name AS Referred_By,user.token AS Token, user, id(user) AS user_id";
    db.cypher({
        query: query
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// addSingleUserNonRef
// ---------------------------------------------
DAL.prototype.addSingleUserNonRef = function(data, cb) {
    // //console.log("data:",data);
    data.createdDate = moment.tz(Date.now(), config.timezone_str).format('MM-DD-YYYY HH:mm:ss');
    data.modifiedDate = moment.tz(Date.now(), config.timezone_str).format('MM-DD-YYYY HH:mm:ss');
    data.createdBy = "";
    data.modifiedBy = "";
    var query = "CREATE (user:user " + converter.cypherJsonConverter(data) + ") RETURN id(user) AS userId ";
    db.cypher({
        query: query
    }, function(err, results) {
        cb(err);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// addBulkUsersRef
// ---------------------------------------------
DAL.prototype.addBulkUsersRef = function(data, cb) {
    var query = "MATCH (admin:user) WHERE id(admin) = " + data.userId + "";
    for (var i = 0; i < data.bulkUsers.length; i++) {
        var user = "user" + i;
        var rel = "rel" + i;
        data.bulkUsers[i].token = "toBeGenerated";
        data.bulkUsers[i].status = "Pending";
        data.bulkUsers[i].action = "Resend";
        data.bulkUsers[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        data.bulkUsers[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        inviteDate = moment.tz(Date.now(), config.timezone_str).format('MM-DD-YYYY');
        data.bulkUsers[i].createdBy = data.userId;
        data.bulkUsers[i].modifiedBy = data.userId;
        query = query + "\n\nCREATE (" + user + ":user " + converter.cypherJsonConverter(data.bulkUsers[i]) + ")" +
            "\nCREATE (admin)-[" + rel + ":REFERRED{inviteDate:\"" + inviteDate + "\"}]->(" + user + ")";
    }
    db.cypher({
        query: query
    }, function(err, results) {
        cb(err, data);
    });
};
// ---------------------END---------------------


// ---------------------------------------------
// getUserByRole
// ---------------------------------------------
DAL.prototype.getUserByRole = function(data, cb) {
    // //console.log("data:",data);
    // data.createdDate = moment.tz(Date.now(), config.timezone_str).format('MM-DD-YYYY HH:mm:ss');
    // data.modifiedDate = moment.tz(Date.now(), config.timezone_str).format('MM-DD-YYYY HH:mm:ss');
    // data.createdBy = "";
    // data.modifiedBy = "";
    var query = `MATCH(prop:property) where id(prop) = {propertyId}
                MATCH(user:user) where not ((user)<-[:ASSIGNED_TO]-(prop)) 
                AND user.role = {roleName} return user`;
    db.cypher({
        query: query,
        params: {
            roleName: data.roleName,
            propertyId: data.propId
        }
    }, function(err, results) {
        if(err){
            cb(err,null);
        } else {
            cb(null, results)
        }
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// getUserRoles
// ---------------------------------------------
DAL.prototype.getUserRoles = function(cb) {
    var query = `MATCH(roles:UserRole) return collect(roles.name) as role`;
    db.cypher({
        query: query
    }, function(err, results) {
        if(err){
            cb(err,null);
        } else {
            cb(null, results)
        }
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// getUSstates
// ---------------------------------------------
DAL.prototype.getUSstates = function(data, cb) {
    var getStates = `SELECT (s.state_name+ ' '+ s.state_code) AS States FROM states s;`;

    var sqlRequest = new SQL.Request();
    sqlRequest = sqlRequest.input("id", SQL.Int, data.id);

    sqlRequest.query(getStates).then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        // //console.log("Error : "+err);
        cb(err, null);
    });
    // execute_query(deleteSection, function(error, result) {
    //     cb(error, result)
    // });
}
// ---------------------END---------------------

// ---------------------------------------------
// getUSstates
// ---------------------------------------------
DAL.prototype.getAllUsers = function(cb) {
    var query = `MATCH(n:user)-[]->(:property) return DISTINCT(id(n)) as id`;

    db.cypher({
        query: query
    }, function(err, results) {
        if(err){
            cb(err,null);
        } else {
            cb(null, results)
        }
    });
}
// ---------------------END---------------------

