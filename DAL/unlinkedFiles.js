//Unlinked files DAL
var moment = require('moment-timezone');
var path = require('path');
var db = require(path.resolve(__dirname, './graphConnection'));

module.exports = DAL;

//Class Constructor
function DAL() {

}

// ---------------------------------------------
// Get Unlinked Files
// ---------------------------------------------
DAL.prototype.getUnlinkedFiles = function(data, cb) {
    var query = `MATCH (n:user)-[:unlinkedFilesNode]->()<-[]-(files) WHERE id(n) = `+data.userId+` RETURN files`;
    db.cypher({
        query: query,
        params:{
            userId:data.userId
        }
    }, function(err, results) {
        cb(err,results);
    });
};
// --