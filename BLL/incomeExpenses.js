const DATE_LABEL = "Income Expense Statement of";
const BASE_RENT_LABEL = "Base Rent";
const RENTAL_INCOME_LABEL = "Rental Income";
const MISC_INCOME_LABEL = "Miscellaneous Income";
const PARKING_INCOME_LABEL = "Parking Income";
const TOTAL_INCOME_LABEL = "Total Income";
const TOTAL_PERSONNEL_LABEL = "Total Personnel";
const TOTAL_UTILITIES_LABEL = "Total Utilities";
const TOTAL_ADMINISTRATIVE_LABEL = "Total Administrative";
const REAL_ESTATE_LABEL = "Real Estate Taxes";
const TOTAL_EXPENSES_LABEL = "Total Expenses";
const NET_INCOME_LABEL = "Cash Flow - Net Income";
const CONTRACTED_LABEL = "Total Contracted Services";
const TOTAL_MAINTENANCE_LABEL = "Total Maintenance";
const TAXES_INSURANCE_LABEL = "Total Taxes and Insurance";
const RECOVERABLE_LABEL = "Total Operating Exp-Recoverable";
const UN_RECOVERABLE_LABEL = "Total Operating Exp-Unrecoverable";

var path = require('path');
var stream = require('stream');
var busBoy = require('busboy');
var fs = require('fs');
var _ = require('lodash');
var cron = require('node-cron');
var async = require('async');
var PropertiesDALFile = require(path.resolve(__dirname, '../DAL/properties'));
var PropertiesDAL = new PropertiesDALFile();
var incomeExpensesDALFile = require(path.resolve(__dirname, '../DAL/incomeExpenses'));
var IEDAL = new incomeExpensesDALFile();
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var IncomeExpenseParserFile = require(path.resolve(__dirname, 'parsers/IE/incomeExpenseParser'));
var IncomeExpenseParser = new IncomeExpenseParserFile();
var IEFilesPath = path.resolve(__dirname, '../public/IE/');
var TaskManagerDAL = require(path.resolve(__dirname, '../DAL/taskManager'));
var ObjectStorage = require(path.resolve(__dirname, './util/objectStorage'));
var objectStorage = new ObjectStorage();
var Common = require(path.resolve(__dirname, './parsers/IE/common'));
var UtilityFunctions = require(path.resolve(__dirname, './util/functions'));
var util = new UtilityFunctions();
var taskManagerDAL = new TaskManagerDAL();
var loginUserName = 'Ali'; // Infutre will get logged in user name
var IE_FILE_TYPE = "IE";
var incomeExpenses = [];
const CONTAINER_NAME = 'IncomeExpense';

module.exports = BLL;

// Class Constructor
function BLL() {

}

//----------------------------------------------
// getPropertyIE
//----------------------------------------------
BLL.prototype.getPropertyIE = function(data, res) {             // user role to add
    if (!data || data == null || data == undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    // console.log(data.body);
    PropertiesDAL.getPropertySlavesID(data.body.propId, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            var ids = result[0].IDs;
            ids.push(parseInt(data.body.propId));
            // console.log(ids);
            IEDAL.getPropertyIE(ids, function(error, propertyIE) {
                if (error) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
                    Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                }else {
                    Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, propertyIE, res);
                }
            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// addPropertyIE
//----------------------------------------------
BLL.prototype.addPropertyIE = function(data, res) {           // user role to add
    var busboy = new busBoy({ 
        headers: data.headers, 
        limits  : {fileSize:5*1024*1024}
    });
    data.pipe(busboy);
    var userId = data.user[0].userId;
    var propertyId = data.query.propId;
    var files = [];

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        file.on('limit', function() {
            // this is where you would remove data from wherever you were
            // storing it up until this point.
            // e.g. if you were writing to disk, remove the temporary file
            console.log("limit reached");
          });
    
        try {
            var name = path.basename(filename);
            var date = new Date();
            var uniqueName = userId + '_' + date.getTime() + '_' + name;
            var fileStream = file.pipe(new stream.PassThrough());
            var fileBuffer = new Buffer('');

            file.on('data', function(data) {
                console.log("on data",data);
                fileBuffer = Buffer.concat([fileBuffer, data]);
            });

            file.on('end', function() {
                // File details
                console.log("on end");
                var details = {
                    name: uniqueName,
                    data: fileBuffer,
                    fileStream: fileStream,
                    originalName: name
                };

                files.push(details);
            });
        } catch(error) {
            // Log error and send response
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
        }
    });

    busboy.on('finish', function() {
        console.log("on finish");
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
                    addFiles(files, propertyId, userId);
                    Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_SUCCESS, null, res);
                }
            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// addPropertyIEManual
//----------------------------------------------
BLL.prototype.addPropertyIEManual = function(incomeExpense, res) {
    if (!incomeExpense || incomeExpense === null || incomeExpense === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    // if(!incomeExpense.user[0].roles.upload_property_data){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    var userId = incomeExpense.user[0].userId;
    var incomeExpense = incomeExpense.body;

    try{
        var IEYear = [];
        IEYear[0] = DATE_LABEL;
        IEYear[1] = incomeExpense.IEYear;
        incomeExpense.IEYear = IEYear;

        var baseRent = [];
        baseRent[0] = BASE_RENT_LABEL;
        baseRent[1] = incomeExpense.baseRent;
        baseRent[2] = '1';
        baseRent[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.baseRent = baseRent;

        var cashFlowNetIncome = [];
        cashFlowNetIncome[0] = NET_INCOME_LABEL;
        cashFlowNetIncome[1] = incomeExpense.cashFlowNetIncome;
        cashFlowNetIncome[2] = '16';
        cashFlowNetIncome[3] = Common.DATA_TYPE.CURRENCY;;
        incomeExpense.cashFlowNetIncome = cashFlowNetIncome;

        var miscellaneousIncome = [];
        miscellaneousIncome[0] = MISC_INCOME_LABEL;
        miscellaneousIncome[1] = incomeExpense.miscellaneousIncome;
        miscellaneousIncome[2] = '3';
        miscellaneousIncome[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.miscellaneousIncome = miscellaneousIncome;

        var parkingIncome = [];
        parkingIncome[0] = PARKING_INCOME_LABEL;
        parkingIncome[1] = incomeExpense.parkingIncome;
        parkingIncome[2] = '4';
        parkingIncome[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.parkingIncome = parkingIncome;

        var realEstateTaxes = [];
        realEstateTaxes[0] = REAL_ESTATE_LABEL;
        realEstateTaxes[1] = incomeExpense.realEstateTaxes;
        realEstateTaxes[2] = '11';
        realEstateTaxes[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.realEstateTaxes = realEstateTaxes;

        var rentalIncome = [];
        rentalIncome[0] = RENTAL_INCOME_LABEL;
        rentalIncome[1] = incomeExpense.rentalIncome;
        rentalIncome[2] = '2';
        rentalIncome[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.rentalIncome = rentalIncome;

        var totalAdministrative = [];
        totalAdministrative[0] = TOTAL_ADMINISTRATIVE_LABEL;
        totalAdministrative[1] = incomeExpense.totalAdministrative;
        totalAdministrative[2] = '10';
        totalAdministrative[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.totalAdministrative = totalAdministrative;

        var totalContractedServices = [];
        totalContractedServices[0] = CONTRACTED_LABEL;
        totalContractedServices[1] = incomeExpense.totalContractedServices;
        totalContractedServices[2] = '8';
        totalContractedServices[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.totalContractedServices = totalContractedServices;

        var totalExpenses = [];
        totalExpenses[0] = TOTAL_EXPENSES_LABEL;
        totalExpenses[1] = incomeExpense.totalExpenses;
        totalExpenses[2] = '15';
        totalExpenses[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.totalExpenses = totalExpenses;

        var totalIncome = [];
        totalIncome[0] = TOTAL_INCOME_LABEL;
        totalIncome[1] = incomeExpense.totalIncome;
        totalIncome[2] = '5';
        totalIncome[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.totalIncome = totalIncome;

        var totalMaintenance = [];
        totalMaintenance[0] = TOTAL_MAINTENANCE_LABEL;
        totalMaintenance[1] = incomeExpense.totalMaintenance;
        totalMaintenance[2] = '9';
        totalMaintenance[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.totalMaintenance = totalMaintenance;

        var totalOperatingExpRecoverable = [];
        totalOperatingExpRecoverable[0] = RECOVERABLE_LABEL;
        totalOperatingExpRecoverable[1] = incomeExpense.totalOperatingExpRecoverable;
        totalOperatingExpRecoverable[2] = '13';
        totalOperatingExpRecoverable[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.totalOperatingExpRecoverable = totalOperatingExpRecoverable;

        var totalOperatingExpUnRecoverable = [];
        totalOperatingExpUnRecoverable[0] = UN_RECOVERABLE_LABEL;
        totalOperatingExpUnRecoverable[1] = incomeExpense.totalOperatingExpUnRecoverable;
        totalOperatingExpUnRecoverable[2] = '14';
        totalOperatingExpUnRecoverable[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.totalOperatingExpUnRecoverable = totalOperatingExpUnRecoverable;

        var totalPersonnel = [];
        totalPersonnel[0] = TOTAL_PERSONNEL_LABEL;
        totalPersonnel[1] = incomeExpense.totalPersonnel;
        totalPersonnel[2] = '6';
        totalPersonnel[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.totalPersonnel = totalPersonnel;

        var totalTaxesAndInsurance = [];
        totalTaxesAndInsurance[0] = TAXES_INSURANCE_LABEL;
        totalTaxesAndInsurance[1] = incomeExpense.totalTaxesAndInsurance;
        totalTaxesAndInsurance[2] = '12';
        totalTaxesAndInsurance[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.totalTaxesAndInsurance = totalTaxesAndInsurance;

        var totalUtilities = [];
        totalUtilities[0] = TOTAL_UTILITIES_LABEL;
        totalUtilities[1] = incomeExpense.totalUtilities;
        totalUtilities[2] = '7';
        totalUtilities[3] = Common.DATA_TYPE.CURRENCY;
        incomeExpense.totalUtilities = totalUtilities;

        IEDAL.addPropertyIEManual(incomeExpense, userId, function(error, result){
            if(error) {
                error.userName = loginUserName;
                ErrorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
                return;
            }
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, null, res);
        });
    } catch(error) {
        error.userName = loginUserName;
        ErrorLogDAL.addErrorLog(error);
        Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
    }
}
// ---------------------END---------------------

//----------------------------------------------
// addBulkPropertyIE
//----------------------------------------------
BLL.prototype.addBulkPropertyIE = function(data, res) {

    // if(!data.user[0].roles.upload_property_data){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    var userId = data.user[0].userId;
    var files = [];
    var busboy = new busBoy({ headers: data.headers });
    data.pipe(busboy);

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
        } catch(error) {
            // Log error and send response
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
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
}
// ---------------------END---------------------

//----------------------------------------------
// Associates IE data with Properties
// based on address.
//----------------------------------------------
function associatePropertiesIE(userId, ieData, cb) {
    PropertiesDAL.getProperties(userId, function(error, properties) {
        if (error === null && properties.length > 0){
                var sheetData = ieData;
                // each file each sheet.
                for (var j = 0; j < sheetData.length; j++) {
                    var propertyId = -1;
                    var propertyAddress =(sheetData[j].address[1]? sheetData[j].address[1].toLowerCase() : '');
                    var isAssociationFound = false;
                    for (var count = 0; count < properties[0].prop.length; count++) {
                        var data = properties[0].prop[count].properties;
                        if (data.propertyName[1] == undefined) {
                            continue;
                        }
                        // Find from, property name, address, owner.
                        if (data.propertyName[1].toLowerCase().indexOf(propertyAddress) > -1 || data.streetAddress[1].toLowerCase().indexOf(propertyAddress) > -1 || data.recordOwnerName[1].toLowerCase().indexOf(propertyAddress) > -1) {
                            propertyId = properties[0].prop[count]._id;
                            isAssociationFound = true;
                            break;
                        }
                    }
                    sheetData[j].propertyId = propertyId;
                }
        }
        cb(error,isAssociationFound, ieData);
    });
}
// ---------------------END---------------------

//----------------------------------------------
// Data Reduction IEs
//----------------------------------------------
BLL.prototype.dataReductionIE = function(data, res, next) {
    // res.send(ieIds)
    var finalResult = {
        "yardiIEData" : [],
        "mriIEData" : []
    };
    var tempResult = [];

    try {
            IEDAL.getPropertyIEDataReduction(data.body, function(error, result) {
                if (error) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
                    Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                    return;
                }

                if(result.length === 0){
                    Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                } else {
                    // res.send(result);
                    for(var i = 0; i < result.length; i++){
                        tempResult.push(result[i].IE.properties);
                        delete tempResult[i].createdDate;
                        delete tempResult[i].uuidFileName;
                        delete tempResult[i].modifiedDate;
                        delete tempResult[i].modifiedBy;
                        delete tempResult[i].createdBy;
                        delete tempResult[i].filePath;
                        delete tempResult[i].fileName;
                        delete tempResult[i].address;
                        delete tempResult[i].sheetName;
                        delete tempResult[i].type;
                        delete tempResult[i].description;
                        // delete tempResult[i].IEYear;
                    }

                    for (var i = 0;i < tempResult.length;i++){
                        if(tempResult[i].format[1] === "MRI"){
                            finalResult.mriIEData.push(tempResult[i]);
                        } else if( tempResult[i].format[1] === "YARDI"){
                            finalResult.yardiIEData.push(tempResult[i]);
                        }
                    }

                    for (var i = 0; i < finalResult.yardiIEData.length; i++){
                        if(finalResult.yardiIEData[i].hasOwnProperty("rentalIncome")) {
                            delete finalResult.yardiIEData[i].rentalIncome;
                        }

                        if(finalResult.yardiIEData[i].hasOwnProperty("miscellaneousIncome")) {
                            delete finalResult.yardiIEData[i].miscellaneousIncome;
                        }

                        if(finalResult.yardiIEData[i].hasOwnProperty("parkingIncome")) {
                            delete finalResult.yardiIEData[i].parkingIncome;
                        }

                        if(finalResult.yardiIEData[i].hasOwnProperty("format")) {
                            delete finalResult.yardiIEData[i].format;
                        }

                    }

                    for (var i = 0; i < finalResult.yardiIEData.length; i++){
                        for (var j = 0; j < finalResult.yardiIEData.length; j++ ){
                            if(i == j) {
                                continue;
                            }
                            var diff = _.difference(_.keys(finalResult.yardiIEData[i]), _.keys(finalResult.yardiIEData[j]));
                            if(diff.length > 0) {
                                for (var k = 0; k < diff.length; k++){
                                    finalResult.yardiIEData[j][diff[k]] = "";
                                }
                            }
                        }
                    }

                    finalResult.yardiIEData = util.getReducedData(finalResult.yardiIEData);


                    for (var i = 0; i < finalResult.mriIEData.length; i++){
                        if(finalResult.mriIEData[i].hasOwnProperty("baseRent")){
                            delete finalResult.mriIEData[i].baseRent;
                        }

                        if(finalResult.mriIEData[i].hasOwnProperty("miscellaneousIncome")){
                            delete finalResult.mriIEData[i].miscellaneousIncome;
                        }

                        if(finalResult.mriIEData[i].hasOwnProperty("parkingIncome")){
                            delete finalResult.mriIEData[i].parkingIncome;
                        }

                        if(finalResult.mriIEData[i].realestatetaxes !== null){
                            // console.log("show me the json: ",JSON.stringify(finalResult.mriIEData[i]));
                            finalResult.mriIEData[i].totaltaxesandinsurance[1] = finalResult.mriIEData[i].totaltaxesandinsurance[1] - finalResult.mriIEData[i].realestatetaxes[1];
                            finalResult.mriIEData[i].totalexpenses[1] -= finalResult.mriIEData[i].realestatetaxes[1];
                            finalResult.mriIEData[i].cashflownetincome[1] += finalResult.mriIEData[i].realestatetaxes[1];
                            delete finalResult.mriIEData[i].realestatetaxes;
                        }

                        if(finalResult.mriIEData[i].hasOwnProperty("format")){
                            delete finalResult.mriIEData[i].format;
                        }
                    }

                    for (var i = 0; i < finalResult.mriIEData.length; i++){
                        for (var j = 0; j < finalResult.mriIEData.length; j++ ){
                            if(i == j) {
                                continue;
                            }
                            var diff = _.difference(_.keys(finalResult.mriIEData[i]), _.keys(finalResult.mriIEData[j]));
                            if(diff.length > 0) {
                                for (var k = 0; k < diff.length; k++){
                                    finalResult.mriIEData[j][diff[k]] = "";
                                }
                            }
                        }
                    }
                    finalResult.mriIEData = util.getReducedData(finalResult.mriIEData);
                    Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
                }
            });

        } catch (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        }
}
// ---------------------END---------------------

//----------------------------------------------
// Property Valuation IEs
//----------------------------------------------
BLL.prototype.propertyValuationIE = function(data, res, next) {
    // res.send(ieIds)
    var finalResult = {
        "yardiIEData" : [],
        "mriIEData" : []
    };
    var tempResult = [];

    try {
            IEDAL.getPropertyIEForValuation(data.body, function(error, result) {
                if (error) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
                    Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                    return;
                }

                if(result.length === 0){
                    Response.sendResponse(false, Response.REPLY_MSG.No_DATA_FOUND, null, res);
                } else {
                    // res.send(result);
                    for(var i = 0; i < result.length; i++){
                        tempResult.push(result[i].IE.properties);
                        delete tempResult[i].createdDate;
                        delete tempResult[i].uuidFileName;
                        delete tempResult[i].modifiedDate;
                        delete tempResult[i].modifiedBy;
                        delete tempResult[i].createdBy;
                        delete tempResult[i].filePath;
                        delete tempResult[i].fileName;
                        delete tempResult[i].address;
                        delete tempResult[i].sheetName;
                        delete tempResult[i].type;
                        delete tempResult[i].description;
                    }


                    for (var i = 0;i < tempResult.length;i++){
                        if(tempResult[i].format[1] === "MRI"){
                            finalResult.mriIEData.push(tempResult[i]);
                        } else if( tempResult[i].format[1] === "YARDI"){
                            finalResult.yardiIEData.push(tempResult[i]);
                        }
                    }

                    for (var i = 0; i < finalResult.yardiIEData.length; i++){
                        if(finalResult.yardiIEData[i].rentalIncome !== null){
                            delete finalResult.yardiIEData[i].rentalIncome;
                        }

                        if(finalResult.yardiIEData[i].baseRent !== null){
                            delete finalResult.yardiIEData[i].baseRent;
                        }

                        if(finalResult.yardiIEData[i].miscellaneousIncome !== null){
                            delete finalResult.yardiIEData[i].miscellaneousIncome;
                        }

                        if(finalResult.yardiIEData[i].parkingIncome !== null){
                            delete finalResult.yardiIEData[i].parkingIncome;
                        }

                        if(finalResult.yardiIEData[i].format !== null){
                            delete finalResult.yardiIEData[i].format;
                        }
                    }

                    for (var i = 0; i < finalResult.yardiIEData.length; i++){
                        for (var j = 0; j < finalResult.yardiIEData.length; j++ ){
                            if(i == j) {
                                continue;
                            }
                            var diff = _.difference(_.keys(finalResult.yardiIEData[i]), _.keys(finalResult.yardiIEData[j]));
                            if(diff.length > 0) {
                                for (var k = 0; k < diff.length; k++){
                                    finalResult.yardiIEData[j][diff[k]] = "";
                                }
                            }
                        }
                    }
                    finalResult.yardiIEData = util.getReducedData(finalResult.yardiIEData);

                    for (var i = 0; i < finalResult.mriIEData.length; i++){
                        if(finalResult.mriIEData[i].baseRent !== null){
                            delete finalResult.mriIEData[i].baseRent;
                        }

                        if(finalResult.mriIEData[i].miscellaneousIncome !== null){
                            delete finalResult.mriIEData[i].miscellaneousIncome;
                        }

                        if(finalResult.mriIEData[i].parkingIncome !== null){
                            delete finalResult.mriIEData[i].parkingIncome;
                        }

                        if(finalResult.mriIEData[i].realEstateTaxes !== null){
                            finalResult.mriIEData[i].totalTaxesAndInsurance[1] = finalResult.mriIEData[i].totalTaxesAndInsurance[1] - finalResult.mriIEData[i].realEstateTaxes[1];
                            finalResult.mriIEData[i].totalExpenses[1] -= finalResult.mriIEData[i].realEstateTaxes[1];
                            finalResult.mriIEData[i].cashFlowNetIncome[1] += finalResult.mriIEData[i].realEstateTaxes[1];
                            delete finalResult.mriIEData[i].realEstateTaxes;
                        }

                        if(finalResult.mriIEData[i].format !== null){
                            delete finalResult.mriIEData[i].format;
                        }
                    }

                    for (var i = 0; i < finalResult.mriIEData.length; i++){
                        for (var j = 0; j < finalResult.mriIEData.length; j++ ){
                            if(i == j) {
                                continue;
                            }
                            var diff = _.difference(_.keys(finalResult.mriIEData[i]), _.keys(finalResult.mriIEData[j]));
                            if(diff.length > 0) {
                                for (var k = 0; k < diff.length; k++){
                                    finalResult.mriIEData[j][diff[k]] = "";
                                }
                            }
                        }
                    }
                    finalResult.mriIEData = util.getReducedData(finalResult.mriIEData);
                    Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
                }
            });

        } catch (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        }
}
// ---------------------END---------------------

//----------------------------------------------
// addFiles
//----------------------------------------------
function addFiles(files, propertyId, userId) {
    var task = cron.schedule('* * * * * *', function() {
        var parsingFiles = [];
        var counter = 0;

        // Add all files to db
        for (var i = 0; i < files.length; i++) {
            var parsingFile = {
                userId: userId,
                type: IE_FILE_TYPE,
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
                    ErrorLogDAL.addErrorLog(error);
                }

                counter++;

                // Check if all files added
                if(counter >= files.length) {
                    // All files added, now parse these files.
                    if(propertyId !== null){
                        parseFiles(parsingFiles, propertyId, userId);
                    } else {
                        parseBulkFiles(parsingFiles, userId);
                    }
                }
            });
        }

        // Destroy the task as we are done
        task.destroy();
    }, false);
    task.start();
}

//----------------------------------------------
// parseFiles
//----------------------------------------------
function parseFiles(files, propertyId, userId) {
    var unParsedFiles = [];

    async.forEachOf(files, function(file, i, callbackMain) {
        var incomeExpenses = null;

        async.series([
            function(callback) {
                setTimeout(function() {
                    callback();
                }, 2500 * i);
            },
            function(callback) {
                file.isProcessed = 0;
                file.inProgress = 1;
                file.success = 0;
                file.message = Response.REPLY_MSG.PARSING_IN_PROGRESS;
                file.propertyId = propertyId;
                taskManagerDAL.update(file, function(error, result) {
                    if (error) {
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                    }
                    callback();
                });
            },
            function(callback) {
                try {
                    IncomeExpenseParser.parseIncomeExpenseFile(file.fileData, file.uniqueName, file.fileName, function(incomeExpense){
                        // console.log("result sdfaf:::::: ",incomeExpense);
                        // if (incomeExpense == "invalid file"){
                        //     message = Response.REPLY_MSG.FIELDS_NOT_FOUND;
                        //     var unParsedFile = {
                        //         fileName: file.fileName,
                        //         filePath: file.filePath,
                        //         fileType: IE_FILE_TYPE
                        //     };
        
                        //     unParsedFiles.push(unParsedFile);
        
                        //     file.isProcessed = 1;
                        //     file.inProgress = 0;
                        //     file.success = 0;
                        //     file.message = message;
                        //     propertyId = null;
        
                        //     taskManagerDAL.update(file, function(error, result) {
                        //         if (error) {
                        //             error.userName = loginUserName;
                        //             ErrorLogDAL.addErrorLog(error);
                        //         }
                        //     });



                        // }else 
                        if(incomeExpense && incomeExpense[0].parsed[1] == "false"){
                            incomeExpenses = incomeExpense;
                            // console.log("propertyId: ",propertyId);
                            IEDAL.addUnparsedPropertyIE(incomeExpenses, propertyId, userId, function(error, result) {
                                if (error) {
                                    error.userName = loginUserName;
                                    ErrorLogDAL.addErrorLog(error);
                                }else{
                                    // console.log("updating fields not found message");
                                    message = Response.REPLY_MSG.FIELDS_NOT_FOUND;
                                    var unParsedFile = {
                                        fileName: file.fileName,
                                        filePath: file.filePath,
                                        fileType: IE_FILE_TYPE
                                    };
                
                                    unParsedFiles.push(unParsedFile);
                
                                    file.isProcessed = 1;
                                    file.inProgress = 0;
                                    file.success = 0;
                                    file.message = message;
                                    file.propertyId = propertyId;
                
                                    taskManagerDAL.update(file, function(error, result) {
                                        if (error) {
                                            error.userName = loginUserName;
                                            ErrorLogDAL.addErrorLog(error);
                                        }
                                    });
                                }
                                
                            });
                        }else{
                        //
                        incomeExpenses = incomeExpense;
                        // console.log(" in BLL IE",incomeExpense);
                        // callback(null, incomeExpense);
                        try {
                            if(incomeExpenses != null && incomeExpenses.length > 0) {
                                async.series([
                                    function(callback) {
                                        IEDAL.addPropertyIE(incomeExpenses, propertyId, userId, function(error, result) {
                                            if (error) {
                                                error.userName = loginUserName;
                                                ErrorLogDAL.addErrorLog(error);
                                            }
                                            callback();
                                        });
                                    },
                                    function (callback) {
                                        file.isProcessed = 1;
                                        file.inProgress = 0;
                                        file.success = 1;
                                        file.message = Response.REPLY_MSG.PARSED_SUCCESSFULLY;
                                        file.propertyId = propertyId;
        
                                        taskManagerDAL.update(file, function(error, result) {
                                            if (error) {
                                                error.userName = loginUserName;
                                                ErrorLogDAL.addErrorLog(error);
                                            }
                                        });
        
                                        callback();
                                    }
                                ]);
                            }
                        } catch (error) {
                            error.userName = loginUserName;
                            ErrorLogDAL.addErrorLog(error);
                        }
                    }
                        callback();
                        callbackMain();
                    
                    });
                
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
                        fileType: IE_FILE_TYPE
                    };

                    unParsedFiles.push(unParsedFile);

                    file.isProcessed = 1;
                    file.inProgress = 0;
                    file.success = 0;
                    file.message = message;
                    propertyId = null;

                    taskManagerDAL.update(file, function(error, result) {
                        if (error) {
                            error.userName = loginUserName;
                            ErrorLogDAL.addErrorLog(error);
                        }
                    });
                }

                // try {
                //     if(incomeExpenses != null && incomeExpenses.length > 0) {
                //         async.series([
                //             function(callback) {
                //                 IEDAL.addPropertyIE(incomeExpenses, propertyId, userId, function(error, result) {
                //                     if (error) {
                //                         error.userName = loginUserName;
                //                         ErrorLogDAL.addErrorLog(error);
                //                     }
                //                     callback();
                //                 });
                //             },
                //             function (callback) {
                //                 file.isProcessed = 1;
                //                 file.inProgress = 0;
                //                 file.success = 1;
                //                 file.message = Response.REPLY_MSG.PARSED_SUCCESSFULLY;
                //                 file.propertyId = propertyId;

                //                 taskManagerDAL.update(file, function(error, result) {
                //                     if (error) {
                //                         error.userName = loginUserName;
                //                         ErrorLogDAL.addErrorLog(error);
                //                     }
                //                 });

                //                 callback();
                //             }
                //         ]);
                //     }
                // } catch (error) {
                //     error.userName = loginUserName;
                //     ErrorLogDAL.addErrorLog(error);
                // }

                // callback();
                // callbackMain();
            }
        ]);
    }, function() {
        // Save un-parsed files in db
        if (unParsedFiles.length > 0) {
            PropertiesDAL.addUnparsedFile(unParsedFiles, userId, function(error, result) {
                if (error) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
                }
            });
        }
    });
}
// ---------------------END---------------------

// //----------------------------------------------
// // Parse Bulk IE files
// //----------------------------------------------
// function parseBulkFiles(files, userId) {
//     var unParsedFiles = [];
//     async.forEachOf(files, function(file, i, callbackMain) {
//         var incomeExpenses = null;
//         var linkingStatus = false;

//         async.series([
//             function(callback) {
//                 setTimeout(function() {
//                     callback();
//                 }, 2500 * i);
//             },
//             function(callback) {
//                 file.isProcessed = 0;
//                 file.inProgress = 1;
//                 file.success = 0;
//                 file.message = Response.REPLY_MSG.PARSING_IN_PROGRESS;
//                 file.propertyId = -1;
//                 taskManagerDAL.update(file, function(error, result) {
//                     if (error) {
//                         error.userName = loginUserName;
//                         ErrorLogDAL.addErrorLog(error);
//                     }
//                     callback();
//                 });
//             },
//             function(callback) {
//                 try {
//                     IncomeExpenseParser.parseIncomeExpenseFile(file.fileData, file.uniqueName, file.fileName, function(incomeExpense){
//                         if(incomeExpense && incomeExpense[0].parsed[1] == "false"){
//                             console.log("propertyId: ",propertyId);
//                             IEDAL.addUnparsedPropertyIE(incomeExpense, propertyId, userId, function(error, result) {
//                                 if (error) {
//                                     error.userName = loginUserName;
//                                     ErrorLogDAL.addErrorLog(error);
//                                 }else{
//                                     console.log("updating fields not found message");
//                                     message = Response.REPLY_MSG.FIELDS_NOT_FOUND;
//                                     var unParsedFile = {
//                                         fileName: file.fileName,
//                                         filePath: file.filePath,
//                                         fileType: IE_FILE_TYPE
//                                     };
                
//                                     unParsedFiles.push(unParsedFile);
                
//                                     file.isProcessed = 1;
//                                     file.inProgress = 0;
//                                     file.success = 0;
//                                     file.message = message;
//                                     file.propertyId = propertyId;
                
//                                     taskManagerDAL.update(file, function(error, result) {
//                                         if (error) {
//                                             error.userName = loginUserName;
//                                             ErrorLogDAL.addErrorLog(error);
//                                         }
//                                     });
//                                 }
                                
//                             });
//                         }else{
//                         //
//                         incomeExpenses = incomeExpense;
//                         // console.log(" in BLL IE",incomeExpense);
//                         // callback(null, incomeExpense);
//                         try {
//                             if(incomeExpenses != null && incomeExpenses.length > 0) {
//                                 async.series([
//                                     function(callback) {
//                                         IEDAL.addPropertyIE(incomeExpenses, propertyId, userId, function(error, result) {
//                                             if (error) {
//                                                 error.userName = loginUserName;
//                                                 ErrorLogDAL.addErrorLog(error);
//                                             }
//                                             callback();
//                                         });
//                                     },
//                                     function (callback) {
//                                         file.isProcessed = 1;
//                                         file.inProgress = 0;
//                                         file.success = 1;
//                                         file.message = Response.REPLY_MSG.PARSED_SUCCESSFULLY;
//                                         file.propertyId = propertyId;
        
//                                         taskManagerDAL.update(file, function(error, result) {
//                                             if (error) {
//                                                 error.userName = loginUserName;
//                                                 ErrorLogDAL.addErrorLog(error);
//                                             }
//                                         });
        
//                                         callback();
//                                     }
//                                 ]);
//                             }
//                         } catch (error) {
//                             error.userName = loginUserName;
//                             ErrorLogDAL.addErrorLog(error);
//                         }
//                     }
//                         callback();
//                         callbackMain();
//                         // console.log("result",incomeExpense);
//                         // incomeExpenses = incomeExpense;
//                         // // console.log(" in BLL IE",incomeExpense);
//                         // // callback(null, incomeExpense);
//                         // try {
//                         //     if(incomeExpenses != null && incomeExpenses.length > 0) {
//                         //         async.series([
//                         //             function(callback) {
//                         //                 IEDAL.addPropertyIE(incomeExpenses, propertyId, userId, function(error, result) {
//                         //                     if (error) {
//                         //                         error.userName = loginUserName;
//                         //                         ErrorLogDAL.addErrorLog(error);
//                         //                     }
//                         //                     callback();
//                         //                 });
//                         //             },
//                         //             function (callback) {
//                         //                 file.isProcessed = 1;
//                         //                 file.inProgress = 0;
//                         //                 file.success = 1;
//                         //                 file.message = Response.REPLY_MSG.PARSED_SUCCESSFULLY;
//                         //                 file.propertyId = propertyId;
        
//                         //                 taskManagerDAL.update(file, function(error, result) {
//                         //                     if (error) {
//                         //                         error.userName = loginUserName;
//                         //                         ErrorLogDAL.addErrorLog(error);
//                         //                     }
//                         //                 });
        
//                         //                 callback();
//                         //             }
//                         //         ]);
//                         //     }
//                         // } catch (error) {
//                         //     error.userName = loginUserName;
//                         //     ErrorLogDAL.addErrorLog(error);
//                         // }
        
//                         // callback();
//                         // callbackMain();
//                     });
//                 } catch (error) {
//                     var message;
//                     if (!(error instanceof InvalidFileFormat)) {
//                         error.userName = loginUserName;
//                         ErrorLogDAL.addErrorLog(error);
//                         message = Response.REPLY_MSG.CORRUPT_FILE;
//                     } else {
//                         message = error.message;
//                     }

//                     var unParsedFile = {
//                         fileName: file.fileName,
//                         filePath: file.filePath,
//                         fileType: IE_FILE_TYPE
//                     };

//                     unParsedFiles.push(unParsedFile);

//                     file.isProcessed = 1;
//                     file.inProgress = 0;
//                     file.success = 0;
//                     file.message = message;
//                     file.propertyId = files.propertyId;

//                     taskManagerDAL.update(file, function(error, result) {
//                         if (error) {
//                             error.userName = loginUserName;
//                             ErrorLogDAL.addErrorLog(error);
//                         }
//                     });
//                 }

//                 try {
//                     if(incomeExpenses != null && incomeExpenses.length > 0) {
//                         async.series([
//                             function(callback) {
//                                 associatePropertiesIE(userId, incomeExpenses, function(error, association, result) {
//                                     if(error) {
//                                         error.userName = loginUserName;
//                                         ErrorLogDAL.addErrorLog(error);
//                                     }
//                                     linkingStatus = association;
//                                     incomeExpenses = result;
//                                     callback();
//                                 });
//                             },
//                             function(callback) {
//                                 IEDAL.addBulkPropertyIE(incomeExpenses, userId, function(error, result) {
//                                     if (error) {
//                                         error.userName = loginUserName;
//                                         ErrorLogDAL.addErrorLog(error);
//                                     }
//                                     callback();
//                                 });
//                             },
//                             function (callback) {
//                                 file.isProcessed = 1;
//                                 file.inProgress = 0;
//                                 file.success = 1;
//                                 file.propertyId = incomeExpenses[0].propertyId;
//                                 if(linkingStatus){
//                                     file.message = Response.REPLY_MSG.PARSED_LINKED_SUCCESSFULLY;
//                                 } else {
//                                     file.message = Response.REPLY_MSG.PARSED_LINKED_UNSUCCESSFULLY;
//                                 }

//                                 taskManagerDAL.update(file, function(error, result) {
//                                     if (error) {
//                                         error.userName = loginUserName;
//                                         ErrorLogDAL.addErrorLog(error);
//                                     }
//                                 });

//                                 callback();
//                             }
//                         ]);
//                     }
//                 } catch (error) {
//                     error.userName = loginUserName;
//                     ErrorLogDAL.addErrorLog(error);
//                 }

//                 callback();
//                 callbackMain();
//             }
//         ]);
//     }, function() {
//         // Save un-parsed files in db
//         if (unParsedFiles.length > 0) {
//             PropertiesDAL.addUnparsedFile(unParsedFiles, userId, function(error, result) {
//                 if (error) {
//                     error.userName = loginUserName;
//                     ErrorLogDAL.addErrorLog(error);
//                 }
//             });
//         }
//     });
// }
// // ---------------------END---------------------

//----------------------------------------------
// Parse Bulk IE files
//----------------------------------------------
function parseBulkFiles(files, userId) {
    var unParsedFiles = [];
    async.forEachOf(files, function(file, i, callbackMain) {
        var incomeExpenses = null;
        var linkingStatus = false;

        async.series([
            function(callback) {
                setTimeout(function() {
                    callback();
                }, 2500 * i);
            },
            function(callback) {
                file.isProcessed = 0;
                file.inProgress = 1;
                file.success = 0;
                file.message = Response.REPLY_MSG.PARSING_IN_PROGRESS;
                file.propertyId = -1;
                taskManagerDAL.update(file, function(error, result) {
                    if (error) {
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                    }
                    callback();
                });
            },
            function(callback) {
                try {
                    IncomeExpenseParser.parseIncomeExpenseFile(file.fileData, file.uniqueName, file.fileName, function(incomeExpense){
                        // console.log("result",incomeExpense);
                        incomeExpenses = incomeExpense;
                        // console.log(" in BLL IE",incomeExpense);
                        // callback(null, incomeExpense);
                        try {
                            if(incomeExpenses != null && incomeExpenses.length > 0) {
                                async.series([
                                    function(callback) {
                                        IEDAL.addPropertyIE(incomeExpenses, propertyId, userId, function(error, result) {
                                            if (error) {
                                                error.userName = loginUserName;
                                                ErrorLogDAL.addErrorLog(error);
                                            }
                                            callback();
                                        });
                                    },
                                    function (callback) {
                                        file.isProcessed = 1;
                                        file.inProgress = 0;
                                        file.success = 1;
                                        file.message = Response.REPLY_MSG.PARSED_SUCCESSFULLY;
                                        file.propertyId = propertyId;
        
                                        taskManagerDAL.update(file, function(error, result) {
                                            if (error) {
                                                error.userName = loginUserName;
                                                ErrorLogDAL.addErrorLog(error);
                                            }
                                        });
        
                                        callback();
                                    }
                                ]);
                            }
                        } catch (error) {
                            error.userName = loginUserName;
                            ErrorLogDAL.addErrorLog(error);
                        }
        
                        callback();
                        callbackMain();
                    });
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
                        fileType: IE_FILE_TYPE
                    };

                    unParsedFiles.push(unParsedFile);

                    file.isProcessed = 1;
                    file.inProgress = 0;
                    file.success = 0;
                    file.message = message;
                    file.propertyId = files.propertyId;

                    taskManagerDAL.update(file, function(error, result) {
                        if (error) {
                            error.userName = loginUserName;
                            ErrorLogDAL.addErrorLog(error);
                        }
                    });
                }

                try {
                    if(incomeExpenses != null && incomeExpenses.length > 0) {
                        async.series([
                            function(callback) {
                                associatePropertiesIE(userId, incomeExpenses, function(error, association, result) {
                                    if(error) {
                                        error.userName = loginUserName;
                                        ErrorLogDAL.addErrorLog(error);
                                    }
                                    linkingStatus = association;
                                    incomeExpenses = result;
                                    callback();
                                });
                            },
                            function(callback) {
                                IEDAL.addBulkPropertyIE(incomeExpenses, userId, function(error, result) {
                                    if (error) {
                                        error.userName = loginUserName;
                                        ErrorLogDAL.addErrorLog(error);
                                    }
                                    callback();
                                });
                            },
                            function (callback) {
                                file.isProcessed = 1;
                                file.inProgress = 0;
                                file.success = 1;
                                file.propertyId = incomeExpenses[0].propertyId;
                                if(linkingStatus){
                                    file.message = Response.REPLY_MSG.PARSED_LINKED_SUCCESSFULLY;
                                } else {
                                    file.message = Response.REPLY_MSG.PARSED_LINKED_UNSUCCESSFULLY;
                                }

                                taskManagerDAL.update(file, function(error, result) {
                                    if (error) {
                                        error.userName = loginUserName;
                                        ErrorLogDAL.addErrorLog(error);
                                    }
                                });

                                callback();
                            }
                        ]);
                    }
                } catch (error) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
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
                    ErrorLogDAL.addErrorLog(error);
                }
            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// linkIEFiles
//----------------------------------------------
BLL.prototype.linkIEFiles = function(data,res,next){

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    DAL.linkIEFiles(data.body, res ,function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.LINK_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.LINK_SUCCESS, finalResult, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// unlinkIEFiles
//----------------------------------------------
BLL.prototype.unlinkIEFiles = function(data,res,next){

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }
    var userId = data.user[0].userId;
    IEDAL.unlinkIEFiles(data.body, userId, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UNLINK_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.UNLINK_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// deleteIEById Soft Delete
//----------------------------------------------
BLL.prototype.deleteIEById = function(data, res, next){

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }
    var userId = data.user[0].userId;
    IEDAL.deleteIEById(data.body, userId, function(error, result){
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------
