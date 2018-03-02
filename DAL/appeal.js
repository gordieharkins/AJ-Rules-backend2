var path = require('path');
var InvalidFileFormat = require('../BLL/errors/invalidFileFormat');
var db = require(path.resolve(__dirname, './graphConnection'));
var func = require(path.resolve(__dirname, '../BLL/util/functions'));

module.exports = DAL;

// Class Constructor
function DAL() {

}

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.getFormDataForJurisdiction = function(data, cb) {
	console.log("here it is00")
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