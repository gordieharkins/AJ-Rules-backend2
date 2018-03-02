var moment = require('moment-timezone');
var path = require('path');
var db = require(path.resolve(__dirname, './graphConnection'));

module.exports = DAL;

// Class Constructor 
function DAL() {

}

// ---------------------------------------------
// Create an errorLog node
// ---------------------------------------------
DAL.prototype.addErrorLog = function(error) {
    error.createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');

    var query = `CREATE (node:errorLog{userName:{userName},
    		errorType:{errorType},stackTrace:{stackTrace},
    		message:{message},createdDate:{createdDate}})`;

    db.cypher({
        query: query,
        params: {
            userName: (error.userName === undefined ? null : error.userName),
            errorType: error.name,
            stackTrace: error.stack,
            message: error.message,
            createdDate:error.createdDate
        }
    }, function(err, results) {
        if(err) {
            console.log(err);
        }
    });
};
// ---------------------END---------------------
