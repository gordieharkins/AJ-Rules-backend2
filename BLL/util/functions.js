var numberFormatter = require('number-formatter');
var moment = require('moment-timezone');
var path = require('path');
var db = require(path.resolve(__dirname, '../../DAL/graphConnection'));
var propertyUserRoles = require(path.resolve(__dirname, './propertyUserRoles'));


function UtilityFunctions() {

}

UtilityFunctions.prototype.cypherJsonConverter = function (data){
	data = JSON.stringify(data);
	data = data.replace(/{"/g,'{');
	data = data.replace(/":/g,':');
	data = data.replace(/,"/g,',');
	return data;
};

UtilityFunctions.prototype.getFloatValue = function (value) {
	if(value !== null) {
		value = value.trim().replace(/ /g, "").replace(/,/g, "").replace(/-/g, "").replace(/%/g, "");
		if(value.indexOf('(') > -1 && value.indexOf(')') > -1 ) {
			value = '-' + value.replace(/\(/g, "").replace(/\)/g, "");
		}
	}

	if(value === null || value === '') {
		return null;
	} else {
		return parseFloat(value);
	}
};

UtilityFunctions.prototype.getReducedData = function (finalResult) {
	var finalArray = [];
    var tempArray = [];
    var keysArray = [];
    var count = 0;
	for(element in finalResult[0]){
        // if(element === "IEYear"){
            
        // }
        tempArray = [];
        tempArray.push(finalResult[0][element][0]);
        finalArray[finalResult[0][element][2]-1] = (tempArray);
        for(var i = 0 ; i < finalResult.length;i++){
        	var value = parseFloat(finalResult[i][element][1]);
        	if(element === "IEYear"){
        		finalArray[finalResult[0][element][2]-1].push(finalResult[i][element][1]);
        	} else if (value > 0) {
            	finalArray[finalResult[0][element][2]-1].push("$"+numberFormatter('#,###.',value));
        	} else if (value < 0) {
        		finalArray[finalResult[0][element][2]-1].push("$("+numberFormatter('#,###.',value*(-1))+")");
        	} else if (value === 0) {
        		finalArray[finalResult[0][element][2]-1].push("$0");
        	}
        }
        count++;
    }

    for (var i = 0; i < finalArray.length; i++){
        if(!finalArray[i]){
            finalArray.splice(i,1);
            i -= 1;
        }
    }

    return finalArray;
}

UtilityFunctions.prototype.dateToLong = function (rawDate) {
    rawDate = rawDate.replace("AM"," AM").replace("PM"," PM");
    var date = new Date(rawDate);
    var resultLongDate = date.getTime();
    
    if(isNaN(resultLongDate)){
        resultLongDate = "";
    }
    return resultLongDate + "";
}

UtilityFunctions.prototype.longToDate = function (value) {

    var val = new Date(parseInt(value));
        if(!isNaN(val.getDate())){
            var finalDate = (val.getMonth()+1)+"/"+val.getDate()+"/"+val.getFullYear();
            value = finalDate;
        } else {
            value = "";
        }
    return value;
}

UtilityFunctions.prototype.getPropertyUserRoles = function (userId, propertyId, endPoint, cb) {

    var status = true;

    if (propertyUserRoles.hasOwnProperty(endPoint))
    {
        var query = `MATCH(user:user)-[rel]-(prop:property) 
                     where id(user) = {userId} AND id(prop) = {propertyId}
                     return rel.${propertyUserRoles[endPoint]} as right`;

        db.cypher({
                query: query,
                params:{userId: userId,propertyId: propertyId}
            }, function(err, results) {
                if (err){
                    status = false;
                }   
                if (!results || results.length==0) {                   // if right/role is not set in db
                    status = true;
                }
                else {
                    if (!results[0].right) {
                        status = false;                      // user is not allowed to perform action                                  
                    }
                }     
                cb(null, status);
        });
    }
    else {
        cb(null, status);
    }   
}


module.exports = UtilityFunctions;
