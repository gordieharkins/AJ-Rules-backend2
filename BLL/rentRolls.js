var path = require('path');
var stream = require('stream');
var busBoy = require('busboy');
var PropertiesDALFile = require(path.resolve(__dirname, '../DAL/properties'));
var PropertiesDAL = new PropertiesDALFile();
var RentRollDALFile = require(path.resolve(__dirname, '../DAL/rentRolls'));
var RRDAL = new RentRollDALFile();
var ErrorLogDAL = require(path.resolve(__dirname, '../DAL/errorLog'));
var errorLogDAL = new ErrorLogDAL();
var TaskManagerDAL = require(path.resolve(__dirname, '../DAL/taskManager'));
var taskManagerDAL = new TaskManagerDAL();
var ObjectStorage = require(path.resolve(__dirname, './util/objectStorage'));
var objectStorage = new ObjectStorage();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var RentRollParser = require(path.resolve(__dirname, 'parsers/RR/rentRollParser'));
var Response = require(path.resolve(__dirname, './util/response'));
var rentRollParser = new RentRollParser();
var Common = require(path.resolve(__dirname, './parsers/RR/common'));
var utilFile = require(path.resolve(__dirname, './util/functions'));
var util = new utilFile();
var cron = require('node-cron');
var async = require('async');
var loginUserName = 'Ali'; // In future will get logged in user name

const RR_FILE_TYPE = "RR";
const CONTAINER_NAME = 'RentRoll';

module.exports = BLL;

// Class Constructor
function BLL() {

}

//----------------------------------------------
// getPropertyRR
//----------------------------------------------
BLL.prototype.getPropertyRR = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    PropertiesDAL.getPropertySlavesID(data.body.propId, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            var ids = result[0].IDs;
            ids.push(parseInt(data.body.propId));
            // res.send(ids);
            RRDAL.getPropertyRR(ids, function(error, propertyRR) {
                if (error) {
                    error.userName = loginUserName;
                    errorLogDAL.addErrorLog(error);
                    Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                } else {

                    // //console.log("hi i am here: ",JSON.stringify(propertyRR));
                    ////console.log(propertyRR[propertyRR.length].tenants.length)
                    for(var i = 0;i < propertyRR.length;i++){
                        // handled on FE
                        // propertyRR[i].RR.properties.asOfDate[1] = dateConverter(propertyRR[0].RR.properties.asOfDate[1]);
                        // propertyRR[i].RR.properties.reportCreationDate[1] = dateConverter(propertyRR[0].RR.properties.reportCreationDate[1]);

                        for(var j = 0;j < propertyRR[i].tenants.length;j++){
                            var tenant = propertyRR[i].tenants[j];
                            ////console.log("end Date: ",tenant.endDate[1]);

                            try{
                                tenant.endDate[1] = util.longToDate(parseInt(tenant.endDate[1]));
                                ////console.log("done");
                             }catch(e){
                                //tenant.endDate[1] = "";
                                // //console.log("YO",e)
                             }

                             try{
                                tenant.startDate[1] = util.longToDate(parseInt(tenant.startDate[1]));
                             }catch(e){
                                //tenant.startDate[1]="";
                                ////console.log("YO1",j)
                             }
                            
                        }
                    }
                    Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, propertyRR, res);
                }
            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// addPropertyRR
//----------------------------------------------
BLL.prototype.addPropertyRR = function(data, res) {

    // if(!data.user[0].roles.upload_property_data){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }
    // //console.log("herere");
    try{
        var timelineDataid = data.query.tId;
    } catch(error){ 
        var timelineDataid = null;
    }
    var propertyId = data.query.propId;
    var userId = data.user[0].userId;
    var files = [];
    var busboy = new busBoy({ headers: data.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        // //console.log("here2");
        try {
            // //console.log("here2gdfds");
            var name = path.basename(filename);
            var date = new Date();
            var uniqueName = userId + '_' + date.getTime() + '_' + name;
            var fileStream = file.pipe(new stream.PassThrough());
            var fileBuffer = new Buffer('');

            file.on('data', function(data) {
                // //console.log("here2hhghg");
                //added this comment for a latest commit
                fileBuffer = Buffer.concat([fileBuffer, data]);
            });

            file.on('end', function() {
                // //console.log("endddddd");
                // File details
                var details = {
                    name: uniqueName,
                    data: fileBuffer,
                    fileStream: fileStream,
                    originalName: name
                };

                files.push(details);
            });
        } catch (error) {
            // Log error and send response
            // //console.log("here2 error");
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
        }
    });

    busboy.on('finish', function() {
        // //console.log("here2341");
        if(files.length <= 0) {
            Response.sendResponse(false, Response.REPLY_MSG.NO_FILE_UPLOADED, null, res);
        } else {
            var isError = false;
            async.forEachOf(files, function(file, i, callback) {
                if(!isError) {
        // //console.log("here1435676");

                    objectStorage.uploadFile(file.fileStream, file.name, CONTAINER_NAME, function(error, fileDetails) {
                        if(error) {
                            error.userName = loginUserName;
                            errorLogDAL.addErrorLog(error);
                            isError = true;
                        }

                        callback();
                    });
                }
            }, function() {
                if(isError) {
                    //console.log("upload fail");
                    Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
                } else {
                    if(timelineDataid == null){
                        addFiles(files, propertyId, userId, null);
                        Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_SUCCESS, null, res);
                    } else {
                        //console.log("here is tafkasf44444444444444444444");
                        addFiles(files, propertyId, userId, res);
                    }
                }
            });
        }
    });

    data.pipe(busboy);
}
// ---------------------END---------------------

//----------------------------------------------
// addPropertyRRManual
//----------------------------------------------
BLL.prototype.addPropertyRRManual = function(rentRoll, res) {
    if (!rentRoll || rentRoll === null || rentRoll === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    // if(!rentRoll.user[0].roles.upload_property_data){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    var userId = rentRoll.user[0].userId;
    var rentRoll = rentRoll.body;

    try {
        var asOfDate = rentRoll.asOfDate;
        rentRoll.asOfDate = [];
        rentRoll.asOfDate[0] = Common.LABEL.AS_OF_DATE;
        rentRoll.asOfDate[1] = asOfDate;
        rentRoll.asOfDate[2] = '1'; // Order (used in front end)
        rentRoll.asOfDate[3] = Common.DATA_TYPE.DATE;

        var reportCreationDate = rentRoll.reportCreationDate;
        rentRoll.reportCreationDate = [];
        rentRoll.reportCreationDate[0] = Common.LABEL.REPORT_CREATION_DATE;
        rentRoll.reportCreationDate[1] = reportCreationDate;
        rentRoll.reportCreationDate[2] = '2'; // Order (used in front end)
        rentRoll.reportCreationDate[3] = Common.DATA_TYPE.DATE;

        var totalBaseRent = rentRoll.baseRent;
        rentRoll.totalBaseRent = [];
        rentRoll.totalBaseRent[0] = Common.LABEL.BASE_RENT;
        rentRoll.totalBaseRent[1] = totalBaseRent;
        rentRoll.totalBaseRent[2] = '3'; // Order (used in front end)
        rentRoll.totalBaseRent[3] = Common.DATA_TYPE.CURRENCY;

        var totalGrossRentMonthly = rentRoll.totalGrossRentMonthly;
        rentRoll.totalGrossRentMonthly = [];
        rentRoll.totalGrossRentMonthly[0] = Common.LABEL.GROSS_RENT_MONTHLY;
        rentRoll.totalGrossRentMonthly[1] = totalGrossRentMonthly;
        rentRoll.totalGrossRentMonthly[2] = '4'; // Order (used in front end)
        rentRoll.totalGrossRentMonthly[3] = Common.DATA_TYPE.CURRENCY;

        var totalGrossRentPerSquareFeetPerYear = rentRoll.totalGrossRentPerSquareFeetPerYear;
        rentRoll.totalGrossRentPerSquareFeetPerYear = [];
        rentRoll.totalGrossRentPerSquareFeetPerYear[0] = Common.LABEL.GROSS_RENT_PER_SF_YEAR;
        rentRoll.totalGrossRentPerSquareFeetPerYear[1] = totalGrossRentPerSquareFeetPerYear;
        rentRoll.totalGrossRentPerSquareFeetPerYear[2] = '5'; // Order (used in front end)
        rentRoll.totalGrossRentPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY;

        var totalSF = rentRoll.totalSF;
        rentRoll.totalSF = [];
        rentRoll.totalSF[0] = Common.LABEL.TOTAL_SF;
        rentRoll.totalSF[1] = totalSF;
        rentRoll.totalSF[2] = '6'; // Order (used in front end)
        rentRoll.totalSF[3] = Common.DATA_TYPE.NUMERIC;

        var vacantSF = rentRoll.vacantSF;
        rentRoll.vacantSF = [];
        rentRoll.vacantSF[0] = Common.LABEL.VACANT_SF;
        rentRoll.vacantSF[1] = vacantSF;
        rentRoll.vacantSF[2] = '7'; // Order (used in front end)
        rentRoll.vacantSF[3] = Common.DATA_TYPE.NUMERIC;

         var vacantPercentage = rentRoll.vacantPercentage;
        rentRoll.vacantPercentage = [];
        rentRoll.vacantPercentage[0] = Common.LABEL.VACANT_PERCENTAGE;
        rentRoll.vacantPercentage[1] = vacantPercentage;
        rentRoll.vacantPercentage[2] = '8'; // Order (used in front end)
        rentRoll.vacantPercentage[3] = Common.DATA_TYPE.PERCENTAGE;

        if(rentRoll.tenants) {
            for (var i = 0; i < rentRoll.tenants.length; i++) {
                var tenant = rentRoll.tenants[i].tenant;
                rentRoll.tenants[i].tenant = [];
                rentRoll.tenants[i].tenant[0] = Common.LABEL.TENANT_NAME;
                rentRoll.tenants[i].tenant[1] = tenant;
                rentRoll.tenants[i].tenant[2] = '2';
                rentRoll.tenants[i].tenant[3] = Common.DATA_TYPE.STRING;

                var unit = rentRoll.tenants[i].unit;
                rentRoll.tenants[i].unit = [];
                rentRoll.tenants[i].unit[0] = Common.LABEL.UNIT;
                rentRoll.tenants[i].unit[1] = unit;
                rentRoll.tenants[i].unit[2] = '1';
                rentRoll.tenants[i].unit[3] = Common.DATA_TYPE.STRING;

                var startDate = rentRoll.tenants[i].startDate;
                rentRoll.tenants[i].startDate = [];
                rentRoll.tenants[i].startDate[0] = Common.LABEL.START_DATE;
                rentRoll.tenants[i].startDate[1] = startDate;
                rentRoll.tenants[i].startDate[2] = '4';
                rentRoll.tenants[i].startDate[3] = Common.DATA_TYPE.DATE;

                var endDate = rentRoll.tenants[i].endDate;
                rentRoll.tenants[i].endDate = [];
                rentRoll.tenants[i].endDate[0] = Common.LABEL.END_DATE;
                rentRoll.tenants[i].endDate[1] = endDate;
                rentRoll.tenants[i].endDate[2] = '5';
                rentRoll.tenants[i].endDate[3] = Common.DATA_TYPE.DATE;

                var baseRentMonthly = rentRoll.tenants[i].baseRentMonthly;
                rentRoll.tenants[i].baseRentMonthly = [];
                rentRoll.tenants[i].baseRentMonthly[0] = Common.LABEL.BASE_RENT_MONTHLY;
                rentRoll.tenants[i].baseRentMonthly[1] = baseRentMonthly;
                rentRoll.tenants[i].baseRentMonthly[2] = '6';
                rentRoll.tenants[i].baseRentMonthly[3] = Common.DATA_TYPE.CURRENCY;

                var baseRentAnnualized = rentRoll.tenants[i].baseRentAnnualized;
                rentRoll.tenants[i].baseRentAnnualized = [];
                rentRoll.tenants[i].baseRentAnnualized[0] = Common.LABEL.BASE_RENT_ANNUALIZED;
                rentRoll.tenants[i].baseRentAnnualized[1] = baseRentAnnualized;
                rentRoll.tenants[i].baseRentAnnualized[2] = '7';
                rentRoll.tenants[i].baseRentAnnualized[3] = Common.DATA_TYPE.CURRENCY;

                var baseRentPerSquareFeetPerYear = rentRoll.tenants[i].baseRentPerSquareFeetPerYear;
                rentRoll.tenants[i].baseRentPerSquareFeetPerYear = [];
                rentRoll.tenants[i].baseRentPerSquareFeetPerYear[0] = Common.LABEL.BASE_RENT_PER_SF_YEAR;
                rentRoll.tenants[i].baseRentPerSquareFeetPerYear[1] = baseRentPerSquareFeetPerYear;
                rentRoll.tenants[i].baseRentPerSquareFeetPerYear[2] = '8';
                rentRoll.tenants[i].baseRentPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY;

                var baseRentPercentRentBump = rentRoll.tenants[i].baseRentPercentRentBump;
                rentRoll.tenants[i].baseRentPercentRentBump = [];
                rentRoll.tenants[i].baseRentPercentRentBump[0] = Common.LABEL.PERCENT_RENT_BUMP;
                rentRoll.tenants[i].baseRentPercentRentBump[1] = baseRentPercentRentBump;
                rentRoll.tenants[i].baseRentPercentRentBump[2] = '9';
                rentRoll.tenants[i].baseRentPercentRentBump[3] = Common.DATA_TYPE.PERCENTAGE;

                var rolling12Months = rentRoll.tenants[i].rolling12Months;
                rentRoll.tenants[i].rolling12Months = [];
                rentRoll.tenants[i].rolling12Months[0] = Common.LABEL.ROLLING_12_MONTHS;
                rentRoll.tenants[i].rolling12Months[1] = rolling12Months;
                rentRoll.tenants[i].rolling12Months[2] = '10';
                rentRoll.tenants[i].rolling12Months[3] = Common.DATA_TYPE.CURRENCY;

                var rollingPerSquareFeetPerYear = rentRoll.tenants[i].rollingPerSquareFeetPerYear;
                rentRoll.tenants[i].rollingPerSquareFeetPerYear = [];
                rentRoll.tenants[i].rollingPerSquareFeetPerYear[0] = Common.LABEL.ROLLING_PER_SF_YEAR;
                rentRoll.tenants[i].rollingPerSquareFeetPerYear[1] = rollingPerSquareFeetPerYear;
                rentRoll.tenants[i].rollingPerSquareFeetPerYear[2] = '11';
                rentRoll.tenants[i].rollingPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY;

                var grossRentMonthly = rentRoll.tenants[i].grossRentMonthly;
                rentRoll.tenants[i].grossRentMonthly = [];
                rentRoll.tenants[i].grossRentMonthly[0] = Common.LABEL.GROSS_RENT_MONTHLY;
                rentRoll.tenants[i].grossRentMonthly[1] = grossRentMonthly;
                rentRoll.tenants[i].grossRentMonthly[2] = '12';
                rentRoll.tenants[i].grossRentMonthly[3] = Common.DATA_TYPE.CURRENCY;

                var grossRentPerSquareFeetPerYear = rentRoll.tenants[i].grossRentPerSquareFeetPerYear;
                rentRoll.tenants[i].grossRentPerSquareFeetPerYear = [];
                rentRoll.tenants[i].grossRentPerSquareFeetPerYear[0] = Common.LABEL.GROSS_RENT_PER_SF_YEAR;
                rentRoll.tenants[i].grossRentPerSquareFeetPerYear[1] = grossRentPerSquareFeetPerYear;
                rentRoll.tenants[i].grossRentPerSquareFeetPerYear[2] = '13';
                rentRoll.tenants[i].grossRentPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY;

                var squareFeet = rentRoll.tenants[i].squareFeet;
                rentRoll.tenants[i].squareFeet = [];
                rentRoll.tenants[i].squareFeet[0] = Common.LABEL.SQUARE_FEET;
                rentRoll.tenants[i].squareFeet[1] = squareFeet;
                rentRoll.tenants[i].squareFeet[2] = '3';
                rentRoll.tenants[i].squareFeet[3] = Common.DATA_TYPE.NUMERIC;
            }
        }

        RRDAL.addPropertyRRManual(rentRoll, userId, function(error, result) {
            if(error) {
                error.userName = loginUserName;
                errorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
                return;
            }
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, null, res);
        });
    } catch(error) {
        error.userName = loginUserName;
        errorLogDAL.addErrorLog(error);
        Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
    }
}
// ---------------------END---------------------

//----------------------------------------------
// addBulkPropertyRR
//----------------------------------------------
BLL.prototype.addBulkPropertyRR = function(data, res) {

    // if(!data.user[0].roles.upload_property_data){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    var userId = data.user[0].userId;
    var files = [];
    var busboy = new busBoy({ headers: data.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        try {
            var name = path.basename(filename);
            var date = new Date();
            var uniqueName = userId + '_' + date.getTime() + '_' + name;
            var fileStream = file.pipe(new stream.PassThrough());
            var fileBuffer = new Buffer('');
            file.on('data', function(data) {
                fileBuffer = Buffer.concat([fileBuffer, data]);
            });

            file.on('end', function() {
                // File details
                var details = {
                    name: uniqueName,
                    data: fileBuffer,
                    fileStream: fileStream,
                    originalName: name
                };

                files.push(details);
            });
        } catch (error) {
            // Log error and send response
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
        }
    });

    busboy.on('finish', function() {
        if(files.length <= 0) {
            Response.sendResponse(false, Response.REPLY_MSG.NO_FILE_UPLOADED, null, res);
        } else {
            var isError = false;
            async.forEachOf(files, function(file, i, callback) {
                if(!isError) {
                    objectStorage.uploadFile(file.fileStream, file.name, CONTAINER_NAME, function(error, fileDetails) {
                        if(error) {
                            error.userName = loginUserName;
                            errorLogDAL.addErrorLog(error);
                            isError = true;
                        }

                        callback();
                    });
                }
            }, function() {
                if(isError) {
                    Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
                } else {
                    addFiles(files, null, userId);
                    Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_SUCCESS, null, res);
                }
            });
        }
    });

    data.pipe(busboy);
}
// ---------------------END---------------------

//----------------------------------------------
// Associates RR data with Properties
// based on address.
//----------------------------------------------
function associatePropertiesRR(userId, rrData, cb) {

    // Now get properties list.
    PropertiesDAL.getProperties(userId, function(error, properties, status) {
        var linkingStatus = false;
        if (error === null) {
            // for each file.
            for (var i = 0; i < rrData.length; i++) {
                var sheetData = rrData[i];
                var propertyId = -1;
                var propertyAddress = (sheetData.address[1] ? sheetData.address[1].toLowerCase() : '');

                for (var count = 0; count < properties[0].prop.length; count++) {
                    var data = properties[0].prop[count].properties;

                    if (data.propertyName === undefined) {
                        continue;
                    }
                    // Find from, property name, address, owner.
                    if (data.propertyName[1].toLowerCase().indexOf(propertyAddress) > -1 || data.streetAddress[1].toLowerCase().indexOf(propertyAddress) > -1 || data.recordOwnerName[1].toLowerCase().indexOf(propertyAddress) > -1) {
                        propertyId = properties[0].prop[count]._id;
                        linkingStatus= true;
                        break;
                    }
                }
                rrData[i].propertyId = propertyId;
            }
        }
        cb(error, rrData, linkingStatus);
    });
}
// ---------------------END---------------------

//----------------------------------------------
// addFiles
//----------------------------------------------
function addFiles(files, propertyId, userId, res) {
    var task = cron.schedule('* * * * * *', function() {
        var parsingFiles = [];
        var counter = 0;

        // Add all files to db
        for (var i = 0; i < files.length; i++) {
            var parsingFile = {
                userId: userId,
                type: RR_FILE_TYPE,
                fileName: files[i].originalName,
                uniqueName: files[i].name,
                fileData: files[i].data,
                message: Response.REPLY_MSG.QUEUED_FOR_PARSING,
                propertyId: propertyId
            };

            parsingFiles.push(parsingFile);
            taskManagerDAL.add(parsingFile, function(error) {
                if(error) {
                    error.userName = loginUserName;
                    errorLogDAL.addErrorLog(error);
                }

                counter++;

                // Check if all files added
                if(counter >= files.length) {
                    // All files added, now parse these files.
                    if(propertyId) {
                        // //console.log("calling parseFiles");
                        parseFiles(parsingFiles, propertyId, userId);
                    } else {
                        parseBulkFiles(parsingFiles, userId);
                    }
                }
            });
        }
        if(res != null){
            //console.log("here is tafkasf44444444====================444444444444");
            Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_SUCCESS, null, res);
        }
        // Destroy the task as we are done
        task.destroy();
    }, false);
    task.start();
}
// ---------------------END---------------------

//----------------------------------------------
// parseFiles
//----------------------------------------------
function parseFiles(files, propertyId, userId) {
    var unParsedFiles = [];

    async.forEachOf(files, function(file, i, callbackMain) {
        var rentRolls = null;

        async.series([
            function(callback) {
                setTimeout(function() {
                    // //console.log('Testing + ' + (i + 1));
                    callback();
                }, 2500 * i);
            },
            function(callback) {
                updateFileStatus(file, 1, 0, 0, Response.REPLY_MSG.PARSING_IN_PROGRESS, propertyId, function() {
                    callback();
                });
            },
            function(callback) {
                try {
                    // //console.log("calling parseRentRollFile");
                    rentRolls = rentRollParser.parseRentRollFile(file.fileData, file.uniqueName, file.fileName);
                    // //console.log("in BLL: ",rentRolls)
                } catch (error) {
                    var message;
                    if (!(error instanceof InvalidFileFormat)) {
                        error.userName = loginUserName;
                        errorLogDAL.addErrorLog(error);
                        message = Response.REPLY_MSG.CORRUPT_FILE;
                    } else {
                        message = error.message;
                    }

                    var unParsedFile = {
                        fileName: file.uniqueName,
                        fileOriginalName: file.fileName,
                        fileType: RR_FILE_TYPE
                    };

                    unParsedFiles.push(unParsedFile);
                    updateFileStatus(file, 0, 1, 0, message, propertyId);
                }

                try {
                    if(rentRolls != null && rentRolls.length > 0) {
                        // //console.log("in BLL: ",rentRolls)
                        // //console.log("in 2nd try");
                        if(rentRolls[0].address == null || rentRolls[0].asOfDate[1] === "unknown"){
                            // //console.log("in unknown");
                            var isSuccess = 0;
                            async.series([
                                function(callback) {
                                    // //console.log("RR: ",rentRolls)
                                    // //console.log("propertyId: ", propertyId);
                                    // //console.log("userId: ", userId);
                                    RRDAL.addUnparsedPropertyRR(rentRolls, propertyId, userId, function(error, result) {
                                        if (error) {
                                            error.userName = loginUserName;
                                            errorLogDAL.addErrorLog(error);
                                            isSuccess = 0;
                                            // //console.log("isSuccess1", isSuccess);
                                        } else {
                                            isSuccess = 0;
                                            // //console.log("isSuccess2", isSuccess);
                                        }
                                        // //console.log("isSuccess3", isSuccess);
                                        callback();
                                    });
                                },
                                function (callback) {
                                    // //console.log("isSuccess", isSuccess);
                                    var message = (Response.REPLY_MSG.FIELDS_NOT_FOUND);
                                    updateFileStatus(file, 0, 1, isSuccess, message, propertyId);
                                    callback();
                                }
                            ]);


                            // //console.log("unknown");
                            // RRDAL.addUnparsedPropertyRR(rentRolls, propertyId, userId, function(error, result) {
                            //     if (error) {
                            //         error.userName = loginUserName;
                            //         errorLogDAL.addErrorLog(error);
                            //         // //console.log("isSuccess1", isSuccess);
                            //     } else {
                            //         // //console.log("isSuccess2", isSuccess);
                            //     }
                            //     var message = ( Response.REPLY_MSG.FIELDS_NOT_FOUND);
                            //     //console.log("updated 0");
                            //     updateFileStatus(file, 0, 1, isSuccess, message, propertyId);
                            //     // throw new InvalidFileFormat(Response.REPLY_MSG.FIELDS_NOT_FOUND);
                            //     //console.log("updated");
                            //     // callback();
                            // });
                        }else{
                        var isSuccess = 0;
                        async.series([
                            function(callback) {
                                // //console.log("RR: ",rentRolls)
                                // //console.log("propertyId: ", propertyId);
                                // //console.log("userId: ", userId);
                                RRDAL.addPropertyRR(rentRolls, propertyId, userId, function(error, result) {
                                    if (error) {
                                        error.userName = loginUserName;
                                        errorLogDAL.addErrorLog(error);
                                        isSuccess = 0;
                                        // //console.log("isSuccess1", isSuccess);
                                    } else {
                                        isSuccess = 1;
                                        // //console.log("isSuccess2", isSuccess);
                                    }
                                    // //console.log("isSuccess3", isSuccess);
                                    callback();
                                });
                            },
                            function (callback) {
                                // //console.log("isSuccess", isSuccess);
                                var message = (isSuccess ? Response.REPLY_MSG.PARSED_SUCCESSFULLY : Response.REPLY_MSG.SAVE_FAIL);
                                updateFileStatus(file, 0, 1, isSuccess, message, propertyId);
                                callback();
                            }
                        ]);
                    }
                    }
                } catch (error) {
                    error.userName = loginUserName;
                    errorLogDAL.addErrorLog(error);
                }

                callback();
                callbackMain();
            }
        ]);
    }, function() {
        // Save un-parsed files in db
        if (unParsedFiles.length > 0) {
            PropertiesDAL.addUnparsedFile(unParsedFiles, userId, function(error, result) {
                if (error) {
                    error.userName = loginUserName;
                    errorLogDAL.addErrorLog(error);
                }
            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// parseBulkFiles
//----------------------------------------------
function parseBulkFiles(files, userId) {
    var unParsedFiles = [];

    async.forEachOf(files, function(file, i, callbackMain) {
        var rentRolls = null;

        async.series([
            function(callback) {
                setTimeout(function() {
                    // //console.log('Testing + ' + (i + 1));
                    callback();
                }, 2500 * i);
            },
            function(callback) {
                updateFileStatus(file, 1, 0, 0, Response.REPLY_MSG.PARSING_IN_PROGRESS, -1, function() {
                    callback();
                });
            },
            function(callback) {
                try {
                    rentRolls = rentRollParser.parseRentRollFile(file.fileData, file.uniqueName, file.fileName);
                    
                } catch (error) {
                    var message;
                    if (!(error instanceof InvalidFileFormat)) {
                        error.userName = loginUserName;
                        errorLogDAL.addErrorLog(error);
                        message = Response.REPLY_MSG.CORRUPT_FILE;
                    } else {
                        message = error.message;
                    }

                    var unParsedFile = {
                        fileName: file.uniqueName,
                        fileOriginalName: file.fileName,
                        fileType: RR_FILE_TYPE
                    };

                    unParsedFiles.push(unParsedFile);
                    updateFileStatus(file, 0, 1, 0, message, -1);
                }

                try {
                    if(rentRolls != null && rentRolls.length > 0) {
                        associatePropertiesRR(userId, rentRolls, function(error, linkResult, linkingStatus) {
                            if (error) {

                                // Add error log
                                error.userName = loginUserName;
                                errorLogDAL.addErrorLog(error);

                                // Update file status
                                updateFileStatus(file, 0, 1, 0, Response.REPLY_MSG.SAVE_FAIL, -1);
                            } else {
                                // Add rent rolls
                                RRDAL.addBulkPropertyRR(linkResult, userId, function(error, result, linkedUnlinkedFiles) {
                                    if (error) {
                                        // Add error log
                                        error.userName = loginUserName;
                                        errorLogDAL.addErrorLog(error);

                                        // Update file status
                                        updateFileStatus(file, 0, 1, 0, Response.REPLY_MSG.SAVE_FAIL, linkResult[0].propertyId);
                                    } else if(linkingStatus){
                                        updateFileStatus(file, 0, 1, 1, Response.REPLY_MSG.PARSED_LINKED_SUCCESSFULLY, linkResult[0].propertyId);
                                    } else {
                                        updateFileStatus(file, 0, 1, 1, Response.REPLY_MSG.PARSED_LINKED_UNSUCCESSFULLY, linkResult[0].propertyId);
                                    }
                                });
                            }
                        });
                    }
                } catch (error) {
                    error.userName = loginUserName;
                    errorLogDAL.addErrorLog(error);
                }

                callback();
                callbackMain();
            }
        ]);
    }, function() {
        // Save un-parsed files in db
        if (unParsedFiles.length > 0) {
            PropertiesDAL.addUnparsedFile(unParsedFiles, userId, function(error, result) {
                if (error) {
                    error.userName = loginUserName;
                    errorLogDAL.addErrorLog(error);
                }
            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// updateFileStatus
//----------------------------------------------
function updateFileStatus(file, inProgress, isProcessed, success, message, propertyId, callback) {
    file.inProgress = inProgress;
    file.isProcessed = isProcessed;
    file.success = success;
    file.message = message;
    file.propertyId = propertyId;

    taskManagerDAL.update(file, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
        }

        if(callback) {
            callback();
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// unlinkRentRollsById
//----------------------------------------------
BLL.prototype.unlinkRentRollsById = function(data, res){

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }
    var userId = data.user[0].userId;
    RRDAL.unlinkRentRollsById(data.body, userId, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UNLINK_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.UNLINK_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// deleteRentRollsById Soft Delete
//----------------------------------------------
BLL.prototype.deleteRentRollsById = function(data, res){

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }
    var userId = data.user[0].userId;
    RRDAL.deleteRentRollsById(data.body, userId, function(error, result){
        if (error) {
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------
