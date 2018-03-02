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
DAL.prototype.getFieldValues = function(data,cb) {

    var query = `match(n:`+data+`) return n`;
    // console.log(query);

     db.cypher({
        query: query,
        params: {
        	fileType: data
        }
    }, function(err, results) {
        cb (null,results);
    });
}