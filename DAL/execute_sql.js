var SQL = require('mssql');

module.exports = function(query,callBack)
{
	new SQL.Request().query(query).then(function(recordset) {
		callBack(null,recordset);
	}).catch(function(err) {
		//console.log("error" + err);
		callBack(err);
	});
};