var path = require('path');
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var aJRulesDALFile = require(path.resolve(__dirname, '../DAL/aJRules'));
var AJRulesFilePath = path.resolve(__dirname, '../public/AJRules/');
var Busboy = require('busboy');
var fs = require('fs');
if(typeof require !== 'undefined') xlsx = require(path.resolve(__dirname, './parsers/xlsx'));
var DAL = new aJRulesDALFile();
var loginUserName = 'Ali'; // Infutre will get logged in user name


module.exports = BLL;


//Class Constructor 
function BLL() {

}

// ---------------------------------------------
// getAllSurveysMetaData
// ---------------------------------------------
BLL.prototype.getAllSurveysMetaData = function(res) {
    DAL.getAllSurveysMetaData(function(error, allSurveysMetaData) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, allSurveysMetaData, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// getAllSurveysDataById
// ---------------------------------------------
BLL.prototype.getAllSurveysDataById = function(id, res) {
    if (!id || id === null || id === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.getAllSurveysDataById(id, function(error, surveyMetaData){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, surveyMetaData, res);
        }
    });
}
// ---------------------END---------------------

// ---------------------------------------------
// addAJRules
// ---------------------------------------------
BLL.prototype.addAJRules = function(rules, res) {
    if (!rules || rules === null || rules === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.addAJRules(rules, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------



//----------------------------------------------
// getAJPublicProperties
//----------------------------------------------
BLL.prototype.getAllAJProperties = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.getAllAJProperties(data.query, function(error, properties) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, properties, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getAJPublicProperties
//----------------------------------------------
BLL.prototype.updateJurisdictionRules = function(req, res) {
    // if (!data || data === null || data === undefined) {
    //     Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
    //     return;
    // }



    var busboy = new Busboy({ headers: req.headers });
    req.pipe(busboy);
    dir = AJRulesFilePath;
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        // var saveTo = path.join('.', filename);
        console.log('Uploading: ' + filename);
        date = new Date();

        dir += date.getTime() + filename;
        file.pipe(fs.createWriteStream(dir));
    });
    busboy.on('finish', function() {
        fs.stat(dir, function(err, stat) {
            if (err == null) {
                console.log('File exists');
                var workbook = xlsx.readFile(dir);
                console.log(workbook.SheetNames);

                finalResult = []
                for (var sheet in workbook.SheetNames) {
                    var data = workbook.Sheets[workbook.SheetNames[sheet]];
                    // console.log(data)
                    max_row_in_data = max_row(data);
                    if (max_row_in_data > 0 && workbook.SheetNames[sheet] != "default") {
                        current_json = { jurisdictionName: workbook.SheetNames[sheet], status: "Not Started", message: "", warning: "", order: 1 };

                        list_type = false;
                        list_var_name = "";
                        for (var i = 0; i <= max_row_in_data; i++) {
                            var_name = "";
                            try {
                                var_name = questions_to_variable_name(data["A" + i].v);
                            } catch (err) {
                                var_name = null
                            }
                            if (var_name) {
                                // console.log(var_name)
                                if (var_name != "requiredItemsList") {
                                    // if(data[])
                                    if(!is_type_date(var_name)){
                                        current_json[var_name] = data["B" + i].v;
                                    } else {
                                        current_json[var_name] = data["B" + i].w;
                                    }
                                    try{
                                        if(current_json[var_name].toLowerCase() == "yes"){
                                            current_json[var_name] = true;
                                        } else if(current_json[var_name].toLowerCase() == "no"){
                                            current_json[var_name] = false;
                                        }
                                    } catch (err) {

                                    }

                                    list_type = false;
                                } else {
                                    list_type = true;
                                    list_var_name = var_name;
                                }
                            } else if (list_type) {
                                if (current_json[list_var_name]) {

                                } else {
                                    current_json[list_var_name] = [];
                                }
                                var str = "";
                                try {
                                    if (str != "") {
                                        str += "||";
                                    }
                                    str += data["B" + i].v
                                } catch (err) {}
                                try {
                                    if (str != "") {
                                        str += "||";
                                    }
                                    str += data["C" + i].v
                                } catch (err) {}
                                try {
                                    if (str != "") {
                                        str += "||";
                                    }
                                    str += data["D" + i].v
                                } catch (err) {}

                                current_json[list_var_name].push(str);
                            }
                        }
                        finalResult.push(current_json)
                    }


                    console.log(finalResult);
                }

                fs.unlink(dir, function(err) {
                    if (err) {
                        console.log("Err")
                        console.log(err)
                        Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                    } else {
                        DAL.updateJurisdictionRules(finalResult, function(error, properties) {
                            if (error) {
                                console.log(error);
                                error.userName = loginUserName;
                                ErrorLogDAL.addErrorLog(error);
                                Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                                return;
                            } else{
                                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, properties, res);
                            }
                        });
                    }
                });

                

            } else if (err.code == 'ENOENT') {
                console.log("Error file not found");
                Response.sendResponse(false, "Error file not found", null, res);
            } else {
                console.log('Some other error: ', err.code);
                Response.sendResponse(false, 'Some other error: '+ err.code, null, res);
            }

            // Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        });

    });
        // return req.pipe(busboy);
    
}
// ---------------------END---------------------

function questions_to_variable_name(d, val) {
    if (d == "what is the type of this process?") {
        return "type"
    } else if (d == "what is the name of this process?") {
        return "name"
    } else if (d == "Is this process obligatory?") {
        return "obligatory"
    } else if (d == "in which paradigm does this process occur?") {
        return "paradigm"
    } else if (d == "does this process include a form?") {
        return "form"
    } else if (d == "how the form is obtained?") {
        return "formObtain"
    } else if (d == "are there any required item(s) in this process?") {
        return "requiredItems"
    } else if (d == "how will you assemble required item(s)?") {
        return "requiredItemsForm"
    } else if (d == "what are the required item(s)?") {
        return "requiredItemsList"
    } else if (d == "does this process require signature?") {
        return "signature"
    } else if (d == "what type of signature is required?") {
        return "signatureType"
    } else if (d == "does this process include submission of form?") {
        return "submission"
    } else if (d == "how is the form submitted?") {
        return "submissionType"
    } else if (d == "What is start date of this process?") {
        return "startDate"
    } else if (d == "What is the end date of this process?") {
        return "deadline"
    }
}

function max_row(data) {
    JsonArray = {}
    max = -1;
    for (key in data) {
        if (key == undefined) {
            continue;
        }

        if (key.includes('!')) {
            continue;
        }
        var splitedkey = key.split(/([A-Za-z]+)([0-9]+)/);
        var current = parseInt(splitedkey[2]);
        if (max == -1) {
            max = current;
        } else if (current > max) {
            max = current;
        }
    }
    return max;
}

function is_type_date(name){
    if(name == "startDate" || name == "deadline"){
        return true
    }
    return false;
}

//----------------------------------------------
// getFormSubmissions
//----------------------------------------------
BLL.prototype.getFormSubmissions = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.getFormSubmissions(function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getFormSubmissions
//----------------------------------------------
BLL.prototype.addNewSubmission = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.addNewSubmission(function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------