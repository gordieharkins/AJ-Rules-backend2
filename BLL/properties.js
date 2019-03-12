var path = require('path');
var busBoy = require('busboy');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var cron = require('node-cron');
var nodeGeocoder = require('node-geocoder');
var PropertiesdalFile = require(path.resolve(__dirname, '../DAL/properties'));
var DAL = new PropertiesdalFile();
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var PropertiesParserBLL = require(path.resolve(__dirname, 'parsers/properties/propertiesParser'));
var PropertiesParser = new PropertiesParserBLL();
var PropertiesFilesPath = path.resolve(__dirname, '../public/properties/');
var TaskManagerDAL = require(path.resolve(__dirname, '../DAL/taskManager'));
var AppealBLL = require(path.resolve(__dirname, './appeal'));
var Appeal = new AppealBLL();

var taskManagerDAL = new TaskManagerDAL();

var UtilityFunctions = require(path.resolve(__dirname, '../BLL/util/functions'));
var util = new UtilityFunctions();
// var loginUserId = 0; // Infutre will get logged in user ID
var loginUserName = 'Ali'; // Infutre will get logged in user name
var addressIndex = 0;
var ltLngFoundCounter = 0;
var allAddresses;

var PARSING_FILE_TYPE = {};
PARSING_FILE_TYPE.PROPERTIES = "Properties";

module.exports = BLL;

// Class Constructor
function BLL() {

}

//----------------------------------------------
// getProperties
//----------------------------------------------
BLL.prototype.getProperties = function(data, res) {
    // if (!data || data === null || data === undefined) {
    //     Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
    //     return;
    // }
    // if(!data.user[0].roles.view_porperty_list){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    DAL.getProperties(data.user[0].userId, function(error, allProperties) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            var finalResult = {
                prop: []
            }

            var propIds = [];
            for(var i = 0; i < allProperties.length; i++){
                var master = allProperties[i].master;
                master.roles = allProperties[i].roles;
                if(propIds.indexOf(master._id) < 0){
                    finalResult.prop.push(master);
                    propIds.push(master._id);
                }
                if(allProperties[i].slave !== null){
                    if(propIds.indexOf(allProperties[i].slave._id) < 0){
                        finalResult.prop.push(allProperties[i].slave);
                        propIds.push(allProperties[i].slave._id);
                    }
                }

            }
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
        }
    });
}
// ---------------------END---------------------


//----------------------------------------------
// getProperties
//----------------------------------------------
BLL.prototype.getPropertiesById = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    // if(!data.user[0].roles.view_porperty_list){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    DAL.getPropertiesById(data.body, function(error, allProperties) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, allProperties, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getProperties
//----------------------------------------------
BLL.prototype.getPropertyDetialsById = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    // if(!data.user[0].roles.view_porperty_list){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    DAL.getPropertyDetialsById(data.body.propId, function(error, allProperties) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        }
        Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, allProperties, res);
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getProperties
//----------------------------------------------
BLL.prototype.getAllProperties = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    // if(!data.user[0].roles.view_porperty_list){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    DAL.getAllProperties(data.query, function(error, properties) {
    // DAL.getMasterProperties(data.query.id, function(error, properties) {
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
// getMasterProperties
//----------------------------------------------
BLL.prototype.getMasterProperties = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    var relation = "OWNS";
    if(data.user[0].roles.name == "Appeal Agent"){
        relation = "ASSIGNED_TO";
    } 

    DAL.getMasterProperties(data.body,data.user[0].userId, relation, function(error, properties) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        }
        // console.log("properties: ",JSON.stringify(properties));
        var propsIds = [];
        for(var i = 0;i < properties.data.length;i++){
            propsIds.push(properties.data[i]._id);
        }
        // getImagesOfProps
        DAL.getPropertiesImagesByIds(propsIds, function(error, images) {
            if (error) {
                error.userName = loginUserName;
                ErrorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                return;
            }

            // Adding each image to respective property
            for(var i = 0;i < images.length;i++){
                for(var j = 0;j < properties.data.length;j++){

                    if(properties.data[j]._id === images[i].propertyId){
                        properties.data[j].imageFileName = images[i].imageFileName;

                        if(images[i].publicProperty !== null){
                            properties.data[j].publicProperty = images[i].publicProperty.properties;
                            properties.data[j].publicProperty._id = images[i].publicProperty._id;
                        } else {
                            properties.data[j].publicProperty = null;
                        }
                    }
                }
            }
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, properties, res);
        });
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getSlavePropertiesByMasterId
//----------------------------------------------
BLL.prototype.getSlavePropertiesByMasterId = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.getSlavePropertiesByMasterId(data.query.id, function(error, slaveProperties) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, slaveProperties, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// setMultiAccMasterSlave
//----------------------------------------------
BLL.prototype.setMultiAccMasterSlave = function(data, res) {
    if (!data || data == null || data == undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.setMultiAccMasterSlave(data, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// uploadPropertyFiles
//----------------------------------------------
BLL.prototype.uploadPropertyFiles = function(data, res) {
    var files = [];
    var counter = 0;
    var busboy = new busBoy({ headers: data.headers });
    data.pipe(busboy);
    var userId = data.user[0].userId;

    // if(!data.user[0].roles.upload_property_data){
    //     Response.sendResponse(true, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        try {
            var saveTo = path.join(PropertiesFilesPath, path.basename(filename));
            file.pipe(fs.createWriteStream(saveTo));
            files[counter] = saveTo;
            counter++;
        } catch (error) {
            // Log error and send response
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
        }
    });

    busboy.on('finish', function() {
        var unParsedFiles = [];
        var failedFile = [];

        DAL.getPropertiesDataMapping(function(error, savedDataMapping) {
            if (error) {
                error.userName = loginUserName;
                ErrorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            } else {
                try {
                    if(savedDataMapping !== null) {
                        if(savedDataMapping[0] !== undefined){
                            var data = PropertiesParser.parsePropertiesFile(files[0], savedDataMapping);
                        } else {
                            throw new InvalidFileFormat("No Mapping Available");
                        }
                    } else {
                        throw new InvalidFileFormat("No Mapping Available");
                    }

                } catch (error) {

                    if (!(error instanceof InvalidFileFormat)) {
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                    }

                    var unParsedFile = {
                        fileName: path.basename(files[0]),
                        filePath: files[0],
                        fileType: PARSING_FILE_TYPE.PROPERTIES
                    };

                    unParsedFiles.push(unParsedFile);
                    failedFile.push(path.basename(files[0]));

                    // Save unparsed files in db
                    if (unParsedFile.length > 0) {
                        DAL.addUnparsedFile(unParsedFiles, userId, function(error, result) {
                            if (error) {
                                error.userName = loginUserName;
                                ErrorLogDAL.addErrorLog(error);
                            }
                        });
                    }
                    Response.sendResponse(false, error.message, failedFile, res);
                    return;
                }
                Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_SUCCESS, data, res);
            }
        });
    });
}
// ---------------------END---------------------

//----------------------------------------------
// mapPropertiesData
//----------------------------------------------
BLL.prototype.mapPropertiesData = function(data, res, userId) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    try {
        var mapping = data.mapping;
        var fileName = data.fileName;
        var filePath = path.join(PropertiesFilesPath, path.basename(fileName));
        Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_SUCCESS, null, res);

        var task = cron.schedule('* * * * * *', function() {
            var parsingFiles = [];

                var parsingFile = {
                    userId: userId,
                    type: PARSING_FILE_TYPE.PROPERTIES,
                    fileName: fileName,
                    filePath: filePath,
                    message: Response.REPLY_MSG.QUEUED_FOR_PARSING
                };

                parsingFiles.push(parsingFile);

                taskManagerDAL.add(parsingFile, function(error) {
                    if(error) {
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                    }

                    parseFiles(parsingFile, mapping, userId);
                });
            // Destroy the task as we are done
            task.destroy();
        }, false);
        task.start();
    } catch(error){

        // Log error and send response
        error.userName = loginUserName;
        ErrorLogDAL.addErrorLog(error);
        Response.sendResponse(false, error.message, null, res);
        return;
    }
}
// ---------------------END---------------------

//----------------------------------------------
// parseFiles
//----------------------------------------------
function parseFiles(file,  mapping, userId) {
    var unParsedFiles = [];
    var userRole = "";
    var parsedProperties;
    var calculationsError = false;
    var successPropsCount = 0;
    var totalProps = 0;

    async.series([

        function(callback) {    // Sample Time
            setTimeout(function() {
                // console.log('Testing + 1'); // to be removed after finalizing
                callback();
            }, 2500 * 1);
        },
        function(callback) {    // Status Update "Parsing in progress."
            file.isProcessed = 0;
            file.inProgress = 1;
            file.success = 0;
            file.message = Response.REPLY_MSG.PARSING_IN_PROGRESS;
            taskManagerDAL.update(file, function(error, result) {
                if (error) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
                }
                callback();
            });
        },
        function(callback) {    // Get the user role if private or public.
            DAL.getUserRole(userId, function(error, result) {
                if (error) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
                }
                if(result[0] === undefined || result[0].role === null)
                    userRole = "Not Available";
                else {
                    userRole = result[0].role;
                }
                // console.log(userRole);
                callback();
            });
        },
        function(callback) {    // parsing properties file
            try {

                // file.fileName = "abc.xlsx"; // for testing
                // console.log("fileName",file.fileName);   // to be removed after finalizing
                // console.log("mapping",mapping);  // to be removed after finalizing

                parsedProperties = PropertiesParser.mapAndParsePropertiesFile(file.fileName, mapping);
                if(parsedProperties.length > 0){
                    totalProps = parsedProperties.length;
                    callback();
                } else {
                    throw new Error(Response.REPLY_MSG.CORRUPT_FILE);
                }

            } catch (error) {
                var message;
                if (!(error instanceof InvalidFileFormat)) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
                    message = Response.REPLY_MSG.CORRUPT_FILE;
                } else {
                    message = error.message;
                }

                var unParsedFile = {
                    fileName: file.fileName,
                    filePath: file.filePath,
                    fileType: PARSING_FILE_TYPE.PROPERTIES
                };

                unParsedFiles.push(unParsedFile);

                DAL.addUnparsedFile(unParsedFiles, userId, function(error, result) {
                    if (error) {
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                    }
                });

                file.isProcessed = 1;
                file.inProgress = 0;
                file.success = 0;
                file.message = message;

                taskManagerDAL.update(file, function(error, result) {
                    if (error) {
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                    }
                });
            }
        },
        function(callback) {    // googleAPI
            addressIndex = 0;
            ltLngFoundCounter = 0;
            allAddresses = parsedProperties;
            batchGeoCode([allAddresses[0].streetAddress], callback);
        },
        function(callback) {    // MultiPart properties calculations
            parsedProperties = allAddresses;
            try {
                // parsedProperties = [];   // For testing
                if(parsedProperties !== null && parsedProperties.length > 0) {
                    // If only tax account no available
                    if(parsedProperties[0].taxAccountNo !== ''){
                        var arr = [];
                        arr.push([parsedProperties[0]]);
                        for (var i = 1; i < parsedProperties.length; i++) {
                            var flag = false;
                            for (var p = 0; p < arr.length; p++) {
                                if (parsedProperties[i].taxAccountNo == arr[p][0].taxAccountNo) {
                                    arr[p].push(parsedProperties[i]);
                                    flag = true;
                                }
                            }
                            if (flag == false) {
                                arr.push([parsedProperties[i]]);
                            }
                        }
                        parsedProperties = arr;
                    } else {
                        var arr = [];
                        for(var i = 0;i < parsedProperties.length;i++){
                            arr.push([parsedProperties[i]]);
                        }
                        parsedProperties = arr;
                    }
                    callback();
                } else {
                    throw new Error(Response.REPLY_MSG.NO_PROPERTIES);
                }
            } catch (error) {   // Error Handling remaining
                calculationsError = true;
                error.userName = loginUserName;
                ErrorLogDAL.addErrorLog(error);

                file.isProcessed = 1;
                file.inProgress = 0;
                file.success = 0;
                file.message = Response.REPLY_MSG.MULTIPART_ERROR;

                taskManagerDAL.update(file, function(error, result) {
                    if (error) {
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                    }
                });
            }
        },
        function(callbackSeriesLast) {    // Processing properties
            try {
                // parsedProperties = [];  // For testing
                if(parsedProperties !== null && parsedProperties.length > 0 && calculationsError === false) {

                    async.forEachOf(parsedProperties, function(propertyArr, i, callbackMain) {
                        var propertyIds;
                        // change file to property
                        async.series([
                            function(callback) {    // add group/single props (returns newAddedPropsIDs)

                                DAL.addProperty(propertyArr, file.fileName, userId, function(error, result) {
                                    var i = 0;
                                    var isError = false;
                                    var propertiesJurisdictions = [];
                                    if (error) {
                                        error.userName = loginUserName;
                                        ErrorLogDAL.addErrorLog(error);
                                        isError = true;
                                    }
                                    try {
                                        // result = [];
                                        if(result[0] !== undefined){
                                            result = result[0];
                                            for (var element in result){
                                                var tempPropData = result[element].split("||");
                                                var propertyJurisdiction = {
                                                    propId: tempPropData[0],
                                                    jurisdiction: tempPropData[1]
                                                }
                                                propertiesJurisdictions.push(propertyJurisdiction);
                                                propertyArr[i].propertyDBId = result[element];
                                                i++;
                                                successPropsCount ++;
                                            }
                                            // this code snippet adds the timeline data for everyproperty
                                            Appeal.addPropertyTimelineData(propertiesJurisdictions, function(timelineError){
                                                if (timelineError) {
                                                    error.userName = loginUserName;
                                                    ErrorLogDAL.addErrorLog(error);
                                                    isError = true;
                                                }
                                            });
                                        } else {
                                            isError = true;
                                        }
                                    } catch (error) {
                                        isError = true;
                                        error.userName = loginUserName;
                                        ErrorLogDAL.addErrorLog(error);
                                    }

                                    if(!isError){
                                        callback();
                                    } else {
                                        callbackMain();
                                    }
                                });
                            },
                            function(callback) {    // Check for AJ (public) existing properties based on formatted address and lt, lng
                                if(userRole !== "Assessing Authority"){
                                    // console.log("linking");

                                    async.forEachOf(propertyArr, function(property, k, callbackSub2) {

                                        var flagExistingProperties = false;
                                        var existingProperty = null;
                                        if(property.latitude && property.longitude && property.formattedAddress){
                                            async.series([
                                                function(callback) {    // Check Exisitng props
                                                    checkParameters = {
                                                        latitude: property.latitude,
                                                        longitude: property.longitude,
                                                        formattedAddress: property.formattedAddress,
                                                        aJName: "Mary Land",
                                                        role: "Assessing Authority"
                                                    };
                                                    DAL.checkExistingProperties(checkParameters, function(error, result){
                                                        var isError = false;
                                                        if (error) {
                                                            isError = true;
                                                            error.userName = loginUserName;
                                                            ErrorLogDAL.addErrorLog(error);
                                                        }
                                                        if(result[0] === undefined){ // to Be checked
                                                            flagExistingProperties = false;
                                                            isError = true;
                                                        }
                                                        if(!isError){
                                                            flagExistingProperties =  true;
                                                            existingProperty = result[0].publicProp;
                                                            callback();
                                                        } else {
                                                            callbackSub2();
                                                        }
                                                    });
                                                },
                                                function(callback) {    // linkExistingProperties
                                                    if(flagExistingProperties){
                                                        flagExistingProperties = false;

                                                        DAL.linkExistingProperties(property.propertyDBId, existingProperty, function(error, result) {
                                                            if (error) {
                                                                error.userName = loginUserName;
                                                                ErrorLogDAL.addErrorLog(error);
                                                            }
                                                            callback();
                                                            callbackSub2();
                                                        });
                                                    } else {
                                                        callback();
                                                        callbackSub2();
                                                    }
                                                }
                                            ]);
                                        } else {
                                            callbackSub2();
                                        }
                                    }, function() {
                                        callback();
                                        callbackMain();
                                    });
                                } else{
                                    callback();
                                    callbackMain();
                                }
                            }
                        ]);
                    }, function() {
                        // Save un-parsed files in db
                        var message = '';
                        var isSuccess = 0;
                        // console.log("successPropsCount",successPropsCount);
                        if(successPropsCount === totalProps){
                            isSuccess = 1;
                            message = Response.REPLY_MSG.PARSED_SUCCESSFULLY;
                        } else if(successPropsCount === 0){
                            isSuccess = 0;
                            message = Response.REPLY_MSG.SAVE_FAIL;
                        } else if(successPropsCount !== totalProps){
                            isSuccess = 1;
                            message = successPropsCount + Response.REPLY_MSG.PROPS_ADDED + totalProps + '.';

                        }
                        var unsuccessfullLtLng = totalProps - ltLngFoundCounter;
                        if(unsuccessfullLtLng > 0){
                            message += Response.REPLY_MSG.LAT_LNG + unsuccessfullLtLng + ' properties.';
                        }
                        if(isSuccess){
                            // Updating New Mapping (Currently Used)
                            updatePropertiesDataMapping(mapping, function(error, result) {
                                if (error) {
                                    error.userName = loginUserName;
                                    ErrorLogDAL.addErrorLog(error);
                                }
                            });
                        }

                        file.isProcessed = 1;
                        file.inProgress = 0;
                        file.success = isSuccess;
                        file.message = message;

                        taskManagerDAL.update(file, function(error, result) {
                            if (error) {
                                error.userName = loginUserName;
                                ErrorLogDAL.addErrorLog(error);
                            }
                        });
                    });
                } else {
                    throw new Error(Response.REPLY_MSG.NO_PROPERTIES);
                }
            } catch (error) {
                error.userName = loginUserName;
                ErrorLogDAL.addErrorLog(error);

                file.isProcessed = 1;
                file.inProgress = 0;
                file.success = 0;
                file.message = Response.REPLY_MSG.ERROR_PROPS;

                taskManagerDAL.update(file, function(error, result) {
                    if (error) {
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                    }
                });
            }
            callbackSeriesLast();
        }
    ]);
}
// ---------------------END---------------------

//----------------------------------------------
// updateTaxAccNo BLL
//----------------------------------------------
BLL.prototype.updateTaxAccNo = function(data, userId, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    try{
        DAL.updateTaxAccNo(data, userId, function(error, result){
            if(error) {
                error.userName = loginUserName;
                ErrorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
                return;
            }
            if(result[0] === undefined){
                Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
                return;
            }
            Response.sendResponse(true, Response.REPLY_MSG.UPDATE_SUCCESS, null, res);
        });
    } catch(error) {
        error.userName = loginUserName;
        ErrorLogDAL.addErrorLog(error);
        Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
    }
}
// ---------------------END---------------------

//----------------------------------------------
// updatePropertiesDataMapping BLL
//----------------------------------------------
var updatePropertiesDataMapping = function(newMapping, cb) {

    DAL.getPropertiesDataMapping(function(error, result) {
        if (error) {
            cb(error, result);
        } else {
            result = result[0].propertiesDataMapping;

            for (var element in newMapping) {
                if (result.hasOwnProperty(element) && newMapping[element] !== '') {
                    if (!result[element]) {
                        result[element] = newMapping[element];
                    } else {
                        var counter = 0;
                        var oldMappingElementArr = result[element].split("|");
                        for(var i = 0;i<oldMappingElementArr.length;i++){
                            if (oldMappingElementArr[i] !== (newMapping[element])) {
                                counter ++;
                            }
                        }
                        if(oldMappingElementArr.length === counter)
                            result[element] = result[element] + "|" + newMapping[element];
                    }
                } else {
                    result.element = newMapping[element];
                }
            }
            DAL.updatePropertiesDataMapping(result, function(error, results) {
                cb(error, results);
            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// MultiPart property linking
//----------------------------------------------
BLL.prototype.multiPartLinking = function(properties, res, next) {
    try {
        DAL.multiPartLinking(properties,  function(error, result) {
            if (error) {
                error.userName = loginUserName;
                ErrorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
                return;
            }
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, null, res);
        });
    } catch (error) {
        error.userName = loginUserName;
        ErrorLogDAL.addErrorLog(error);
        Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
    }
}
// ---------------------END---------------------

//----------------------------------------------
// MultiAccount property linking
//----------------------------------------------
BLL.prototype.multiAccountLinking = function(properties, res, next) {
    try {
        DAL.multiAccountLinking(properties, function(error, result) {
            if (error) {
                error.userName = loginUserName;
                ErrorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
                return;
            }
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, null, res);
        });
    } catch (error) {
        error.userName = loginUserName;
        ErrorLogDAL.addErrorLog(error);
        Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
    }
}
// ---------------------END---------------------

//----------------------------------------------
// updateNodeAttributes
//----------------------------------------------
BLL.prototype.updateNodeAttributes = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    // (TO BE USED IN addPropertiesList LATER)
    DAL.updateNodeAttributes(data, loginUserId, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
            return;
        }
        Response.sendResponse(true, Response.REPLY_MSG.UPDATE_SUCCESS, null, res);
    });
}
// ---------------------END---------------------

//----------------------------------------------
// Delete multiple properties by ID
//----------------------------------------------
BLL.prototype.deletePropertiesByIds = function(data, res, userId) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    var propertyIds = data.body.propIds;
    var userId = data.user[0].userId;
    DAL.deletePropertiesByIds(propertyIds, userId, function(error, slaveProperties) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, slaveProperties, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getProperties
//----------------------------------------------
BLL.prototype.getPropertiesLandingPage = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    var userId = data.user[0].userId;
    DAL.getPropertiesLandingPage(userId, function(error, properties) {
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

//----------------------------------------------
// googleApi
//----------------------------------------------
function batchGeoCode(address, callback) {
    var options = {
        provider: 'google',
        // Optional depending on the providers
        httpAdapter: 'https', // Default
        //apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
    };

    var geocoder = nodeGeocoder(options);
    geocoder.batchGeocode(address, function (error, result) {

        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
        } else {
            if(result[0].value !== null && result[0].value.length > 0){
                ltLngFoundCounter ++;

                // console.log("ltLngFoundCounter",ltLngFoundCounter);

                allAddresses[addressIndex].latitude = result[0].value[0].latitude;
                allAddresses[addressIndex].longitude = result[0].value[0].longitude;
                allAddresses[addressIndex].formattedAddress = result[0].value[0].formattedAddress;
                allAddresses[addressIndex].city = result[0].value[0].city;
                allAddresses[addressIndex].zip = result[0].value[0].zipcode;
                allAddresses[addressIndex].streetNumber = result[0].value[0].streetNumber;
                allAddresses[addressIndex].streetName = result[0].value[0].streetName;
                allAddresses[addressIndex].country = result[0].value[0].country;
                allAddresses[addressIndex].countryCode = result[0].value[0].countryCode;
                allAddresses[addressIndex].countryState = result[0].value[0].administrativeLevels.level1long;
                allAddresses[addressIndex].county = result[0].value[0].administrativeLevels.level2long;
                allAddresses[addressIndex].township = result[0].value[0].administrativeLevels.level3long;
            }
        }

        addressIndex++;
        // Console to be removed after final testing
        // console.log("allAddresses.length==>",allAddresses.length);
        // console.log("addressIndex==>",addressIndex);
        if(allAddresses.length > addressIndex) {

            batchGeoCode([allAddresses[addressIndex].streetAddress], callback);
        } else{
            callback();
        }
    });
}
// ---------------------END---------------------


//----------------------------------------------
// assignPropertyToAgent
//----------------------------------------------
BLL.prototype.assignPropertyToAgent = function(data, res) {
    if (!data || data == null || data == undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    

    DAL.assignPropertyToAgent(data.body, function(error, result) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.PROPERTY_ASSIGNED_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.PROPERTY_ASSIGNED_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getAssignedUsers
//----------------------------------------------
BLL.prototype.getAssignedUsers = function(data, res) {
    if (!data || data == null || data == undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    

    DAL.getAssignedUsers(data.body, function(error, result) {
        if (error) {
            console.log(error);
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
// removeAssignedUser
//----------------------------------------------
BLL.prototype.removeAssignedUser = function(data, res) {
    if (!data || data == null || data == undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    

    DAL.removeAssignedUser(data.body, function(error, result) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.RREPLY_MSG.DELETE_FAIL, null, res);
            return;
        } else{
            Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getPublicPropertyDetailsById
//----------------------------------------------
BLL.prototype.getPublicPropertyDetailsById = function(data, res) {
    if (!data || data == null || data == undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    

    DAL.getPublicPropertyDetailsById(data.body, function(error, result) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{

            // for(var i = 0; i < )
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------



//----------------------------------------------
// getAJPublicProperties
//----------------------------------------------
BLL.prototype.getAJPublicProperties = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    // console.log(data.body);
    var userId = data.user[0].userId;
    // console.log(userId);
    if(data.body.state == null){
        DAL.getUsersJurisdictions(userId, function(error, jurisdictions) {
            if (error) {
                console.log(error);
                error.userName = loginUserName;
                ErrorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                return;
            } else{
                // console.log(JSON.stringify(jurisdictions));
                data.body.state = jurisdictions[0].jurisdictions;
                console.log(data.body);
                DAL.getAJPublicProperties(data.body, function(error, properties) {
                    if (error) {
                        // console.log(error);
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                        Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                        return;
                    } else{

                        properties.jurisdictions = jurisdictions[0].jurisdictions;
                        // properties['jurisdictions'] = jurisdictions;
                        Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, properties, res);
                    }
                });
            }
        });
    } else {
        DAL.getAJPublicProperties(data.body, function(error, properties) {
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
    
}
// ---------------------END---------------------

BLL.prototype.getFileStatusIE = function(data, res) {
    // console.log("in func",data.user[0].userId);
    DAL.getFileStatusIE(data.user[0].userId, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else{
            // console.log("dadasd");
            var properties = [];
            var propertyNames = [];
            for(var i = 0;i < result.length; i++){
                var index = propertyNames.indexOf(result[i].property);
                if(index > -1){
                    if(properties[index].incomeExpense[result[i].year] == undefined){
                        properties[index].incomeExpense[result[i].year] = [{fileName: result[i].fileName, status: result[i].status}];
                    } else {
                        properties[index].incomeExpense[result[i].year].push({fileName: result[i].fileName, status: result[i].status});
                    }
                } else {
                    //comment
                    var property = {
                        propertyName: result[i].property,
                        address: result[i].address,
                        incomeExpense: {},
                        rentRoll: {}
                    };
                    propertyNames.push(result[i].property);
                    property.incomeExpense[result[i].year] = [{fileName: result[i].fileName, status: result[i].status}];
                    properties.push(property);
                }
            }
            // console.log("before DAL: ",properties);
            DAL.getFileStatusRR(data.user[0].userId, function(error, result2) {
                if (error) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
                    Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                    return;
                } else{
                    // console.log("result2: ",result2);
                    for(var i = 0;i < result2.length; i++){
                        var index = propertyNames.indexOf(result2[i].property);
                        if(index > -1){
                            var myYear = null;
                            // console.log("index: ",i)
                            if(result2[i].year !== "unknown"){
                                myYear = util.longToDate(result2[i].year).split("/")[2]
                            }else{
                                myYear = result2[i].year
                            }
                            // console.log("year: ",myYear)
                            if(properties[index]["rentRoll"][myYear] == undefined){
                                properties[index]["rentRoll"][myYear] = [{fileName: result2[i].fileName, status: result2[i].status}];
                            } else {
                                properties[index].rentRoll[myYear].push({fileName: result2[i].fileName, status: result2[i].status});
                            }
                        } else {
                            //comment
                            var property = {
                                propertyName: result[i].property,
                                address: result[i].address,
                                incomeExpense: {},
                                rentRoll: {}
                            };
                            propertyNames.push(result2[i].property);
                            property.rentRoll[myYear] = [{fileName: result2[i].fileName, status: result2[i].status}];
                            properties.push(property);
                        }
                    }
        
        
                    Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, properties, res);
                }
            });

            // Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, properties, res);
        }
    });
}
// ---------------------END---------------------