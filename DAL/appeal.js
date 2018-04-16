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

//--------------------------------------------------------
// getFormDataForJurisdiction
//--------------------------------------------------------
DAL.prototype.getIESurveyInformation = function(data, cb) {
    // console.log("here it is00");
    // console.log(data.revalYear);
    var revalYear = new Date(data.revalYear).getTime().toString();
    console.log(revalYear);
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
        console.log(results);
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
        console.log(results);
        cb(err, results);
    });
}