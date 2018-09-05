var SQL = require('mssql');

var connectionString = "mssql://sa:Spring!@2018@71.114.64.10/aotc";
// var connectionString = "mssql://admin:root@172.19.44.41/aotc";

// var connectionString = "mssql://admin:root@208.109.52.74/aotc_mvp";
//test push

module.exports = function(callBack)
{
    SQL.connect(connectionString).then(function() {
        // Query
        console.log("Connected to SQL database.");
        callBack(null,"connect")
    }).catch(function(err) {
        console.log("Connection error in SQL DB-" + err);
        callBack(err,null);
    });
}