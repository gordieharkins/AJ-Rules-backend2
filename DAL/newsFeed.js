var path = require('path');
var InvalidFileFormat = require('../BLL/errors/invalidFileFormat');
var db = require(path.resolve(__dirname, './graphConnection'));

module.exports = DAL;

// Class Constructor
function DAL() {

}

//--------------------------------------------------------
//      Neo4j EPs
//--------------------------------------------------------
DAL.prototype.getNewsFeed = function(userId, cb) {
    var query = `MATCH (user:user)-[:OWNS]->(property) where id(user) = {userId}
                RETURN property.countryState as state, property.county as county, property.city as city`;

     db.cypher({
        query: query,
        params: { userId: userId}
    }, function(err, results) {
        cb(err, results);
    });
}
