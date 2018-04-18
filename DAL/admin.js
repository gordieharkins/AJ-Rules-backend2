var moment = require('moment-timezone');
var path = require('path');
var InvalidFileFormat = require('../BLL/errors/invalidFileFormat');
var db = require(path.resolve(__dirname, './graphConnection'));
var execute_query = require(path.resolve(__dirname, './execute_sql'));
var SQL = require('mssql');


module.exports = DAL;

// Class Constructor starts
function DAL() {

}

//--------------------------------------------------------
//      Neo4j EPs
//--------------------------------------------------------
DAL.prototype.getAllUserRoles = function(cb) {
    var query = `MATCH(roles:UserRole) return roles`;

     db.cypher({
        query: query
    }, function(err, results) {
        cb(err, results);
    });
}

DAL.prototype.updateUserRole = function(data, cb) {
    console.log(data);
    var query = `MATCH(role:UserRole) where id(role) = {roleId} SET role = {role}`;

     db.cypher({
        query: query,
        params:{
            roleId: parseInt(data.roleId),
            role: data.role
        }
    }, function(err, results) {
        cb(err, results);
    });
}


DAL.prototype.addNewRole = function(data, cb) {
    var query = `CREATE(role:UserRole{userRole})`;

     db.cypher({
        query: query,
        params:{
            userRole: data
        }
    }, function(err, results) {
        cb(err, results);
    });
}






