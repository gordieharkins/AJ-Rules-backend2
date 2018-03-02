var path = require('path');
var fs = require('fs');
var busBoy = require('busboy');
var mammoth = require("mammoth");
var async = require('async');
// var converter = require('office-converter')();

var contracts = require(path.resolve(__dirname, '../DAL/contracts'));
var DAL = new contracts();
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var Response = require(path.resolve(__dirname, './util/response'));
var loginUserName = 'Ali'; // Infutre will get logged in user name
var contractsFilePath = path.resolve(__dirname, '../public/contracts/');

module.exports = BLL;

// Class Constructor
function BLL() {

}

// BLL.prototype.addContracts = function(data,res,next){
//     var finalResult = {
//         contractId: "",
//         sections:[]
//     }
//     DAL.addContracts(data ,function(error, result){
//         if (error) {
//             error.userName = loginUserName;
//             ErrorLogDAL.addErrorLog(error);
//             Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
//             return;
//         } else {
//             if(result.length > 0){
//                 finalResult.contractId = result[0].contractId;
//                 finalResult.sections = result;
//                 Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, finalResult, res);
//             } else {
//                 Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
//             }
//         }
//     });
// }

BLL.prototype.addSectionTemplate = function(data,res,next){
    DAL.addSectionTemplate(data ,function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}

// BLL.prototype.getContracts = function(data,res,next){
//     DAL.getContracts(data ,function(error, result){
//         if (error) {
//             error.userName = loginUserName;
//             ErrorLogDAL.addErrorLog(error);
//             Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
//             return;
//         } else {
//             var finalResult = [];
//             for(var i = 0;i < result.length; i++){
//                 var contractExists = false;
//                 var contract = {
//                     contractId: "",
//                     sections:[]
//                 }
//                 for(var j = 0; j < finalResult.length;j++){
//                     if(finalResult[j].contractId == result[i].contractId){
//                         delete result[i].contractId;
//                         finalResult[j].sections.push(result[i]);
//                         contractExists = true;
//                     }
//                 }
//
//                 if(contractExists){
//                     continue;
//                 } else {
//                     contract.contractId = result[i].contractId;
//                     delete result[i].contractId;
//                     contract.sections.push(result[i]);
//                     finalResult.push(contract);
//                 }
//             }
//             Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
//         }
//     });
// }

BLL.prototype.getParticularContract = function(data,res,next){
    var finalResult = {
        contractId: "",
        sections:[]
    }
    DAL.getParticularContract(data ,function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            if(result.length > 0){
                finalResult.contractId = result[0].contractId;
                finalResult.sections = result;
                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
            } else {
                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
            }
        }
    });
}

BLL.prototype.deleteContractSection = function(data,res,next){
    DAL.deleteContractSection(data ,function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, result, res);
        }
    });
}

BLL.prototype.deleteSectionTemplate = function(data,res,next){
    DAL.deleteSectionTemplate(data ,function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, result, res);
        }
    });
}

//----------------------------------------------
// addPropertyIE
//----------------------------------------------
BLL.prototype.uploadContracts = function(data, res) {
    var userId = data.user[0].userId;
    var files = [];
    var fileNames = [];
    var counter = 0;
    var busboy = new busBoy({ headers: data.headers });
    data.pipe(busboy);

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        try {
            // filename = filename + "x";
            var saveTo = path.join(contractsFilePath, path.basename(filename));
            file.pipe(fs.createWriteStream(saveTo));

            files[counter] = saveTo;

            fileNames[counter] = filename;
            counter++;
        } catch(error) {
            // Log error and send response
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
        }
    });


    //test commit
    busboy.on('finish', function() {
        if(files.length <= 0) {
            Response.sendResponse(false, Response.REPLY_MSG.NO_FILE_UPLOADED, null, res);
        } else {
            // console.log("here for parsing");
            addFiles(files,fileNames, function (contracts) {
                // console.log(contracts);
            // console.log("here 2");
                DAL.uploadContracts(contracts, userId, function(error, result){
                // console.log("here 3");
                    if (error) {
                        console.log(error)
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                        Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
                        return;
                    } else {
                        Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
                    }
                });
            });
        }
    });
}
// ---------------------END---------------------


function addFiles(files, fileNames ,callback){
    var contracts = [];
    async.forEachOf(files, function(file, i, callbackMain) {
       var contract = {
            fileName : "",
            body: ""
        }
        // console.log(files[i]);
        contract.fileName = fileNames[i];
        mammoth.convertToHtml({path: files[i]})
            .then(function(result){
                contract.body = result.value; // The generated HTML
                contracts.push(contract);
                callbackMain();
            });

    }, function() {
        callback(contracts);
    });

}

BLL.prototype.getContracts = function(data,res,next){
    var userId = data.user[0].userId;
    DAL.getContracts(userId ,function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            // result = result.contracts;
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result[0].contracts, res);
        }
    });
}

BLL.prototype.addContractTemplate = function(data,res,next){
    console.log(data);
    DAL.addContractTemplate(data.body ,function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}

BLL.prototype.getContractTerms = function(data,res,next){
    DAL.getContractTerms(function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            // console.log(result);
            // Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
            if(result[0].contractTerms.length > 0){
                result = result[0].contractTerms;
                var columns = JSON.parse(result[0].columns);
                // console.log(result[0].columns);
                for(var i = 0; i < result.length; i++){
                    if(result[i].hasLevels){
                        result[i].value = JSON.parse(result[i].value);
                    }
                    result[i].columns = JSON.parse(result[i].columns);
                }
            }
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}

BLL.prototype.addContractTerms = function(data,res,next){
    DAL.addContractTerms(data, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}

BLL.prototype.updateContractTerms = function(data,res,next){
    DAL.updateContractTerms(data, function(error, result){
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.UPDATE_SUCCESS, result, res);
        }
    });
}

BLL.prototype.addContract = function(data, res, next){

    // if(!data.user[0].roles.create_agent_contract){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    var userId = data.user[0].userId;

    DAL.addContract(data.body, userId, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}


BLL.prototype.getContractsByUserId = function(data,res,next){           //need to confirm for user role

    var userId = data.user[0].userId;
    DAL.getContractsByUserId(data.body, userId, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}

BLL.prototype.getContractsById = function(data,res,next){              //need to confirm for user role
    DAL.getContractsById(data, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            // dadsd
            console.log(result)
            var finalResult = {
                contract: result[0].contract,
                financialTerms: [],
                nonFinancialTerms: result[0].nonFinancialTerms
            }
            var propertyData = {
                propIds: [],
                year: 2017
            }
            if(Array.isArray(result[0].financialTerms[0].propertyId)){

                var financialTerm = {
                    fee: result[0].financialTerms[0]
                }

                result[0].financialTerms.splice(0, 1);
                result[0].financialTerms.push(financialTerm);
                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result[0], res);
            } else {
                for(var i = 0;i < result[0].financialTerms.length; i++){
                    propertyData.propIds.push(result[0].financialTerms[i].propertyId);
                }
                // console.log(propertyData);
                DAL.getDataforSampleCalculations(propertyData, function(error, result1){
                    if (error) {
                        error.userName = loginUserName;
                        ErrorLogDAL.addErrorLog(error);
                        Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                        return;
                    } else {

                        for(var i = 0;i < result1.length;i++){
                            var financialTerm = {
                                fee: result[0].financialTerms[propertyData.propIds.indexOf(result1[i].propertyId)],
                                assessment: result1[i].assessment
                            }

                            finalResult.financialTerms.push(financialTerm);
                        }
                        // console.log(result);
                        Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
                    }
                });
            }
        }
    });
}

BLL.prototype.saveInvoice = function(data,res,next){

    // if(!data.user[0].roles.invoice){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    DAL.saveInvoice(data.body, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
        }
    });
}

BLL.prototype.getDataforSampleCalculations = function(data,res,next){       //user role to add
    if(data.propIds == undefined){
        data["propIds"] = [];
    }
    DAL.getDataforSampleCalculations(data.body, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            // console.log(result);
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}

BLL.prototype.getInvoiceByContractId = function(data,res,next){

    // if(!data.user[0].roles.invoice){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    DAL.getInvoiceByContractId(data.body, function(error, result){
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        } else {
            // console.log(result);
            var masterInvoice = {
                totalProperties: 0,
                totalFee:0,
                AgentName: "Paul",
                Date: "8/11/2017"
            };

            var finalInvoice = {
                master: "",
                details:[]
            };


            for(var i = 0; i < result.length; i++){
                var invoice = {
                    propertyId:"",
                    originalValue:"",
                    newValue:"",
                    postLevel1:"",
                    postLevel2:"",
                    marketPreAppeal:"",
                    marketLevel1:"",
                    marketLevel2:"",
                    taxRate:"",
                    taxPreAppeal:"",
                    taxLevel1:"",
                    taxLevel2:"",
                    taxSavingLevel1:"",
                    taxSavingLevel2:"",
                    feePercent:"",
                    feeOwed:"",
                    taxBillDate:"",
                    taxBill:"",
                    lessSolidWaste:"",
                    waterQuality:"",
                    netBill:""
                };
                invoice.propertyId = result[i].propertyId;
                invoice.originalValue = parseInt(result[i].assessment.properties.newAssessorValue[0]);
                invoice.newValue = parseInt(result[i].assessment.properties.newAssessorValue[0]);
                invoice.postLevel1 = parseInt(result[i].assessment.properties.postAppeal1[0]);
                invoice.postLevel2 = parseInt(result[i].assessment.properties.postAppeal2[0]);
                invoice.marketPreAppeal = parseInt(result[i].assessment.properties.newAssessorValue[0]);
                invoice.marketLevel1 = parseInt(result[i].assessment.properties.postAppeal1[0]);
                invoice.marketLevel2 = parseInt(result[i].assessment.properties.postAppeal2[0]);
                invoice.taxRate = parseInt(result[i].assessment.properties.taxRate[0]);
                invoice.taxPreAppeal = invoice.newValue * (invoice.taxRate / 100);
                invoice.taxLevel1 = invoice.postLevel1 * (invoice.taxRate / 100);
                invoice.taxLevel2 = invoice.postLevel2 * (invoice.taxRate / 100);
                invoice.taxSavingLevel1 = invoice.taxPreAppeal - invoice.taxLevel1;
                invoice.taxSavingLevel2 = invoice.taxLevel1 - invoice.taxLevel2;
                invoice.feePercent = result[i].fee.properties.fee[result[i].fee.properties.propertyId.indexOf(result[i].propertyId)];
                invoice.feeOwed = (invoice.taxSavingLevel1 + invoice.taxSavingLevel2) * (invoice.feePercent / 100);
                invoice.taxBillDate = "8/25/2017";
                invoice.taxBill = "49355.33";
                invoice.lessSolidWaste = "2146.14";
                invoice.waterQuality = "3484.8";
                invoice.netBill = "43,724.39";
                masterInvoice.totalProperties += 1;
                masterInvoice.totalFee += invoice.feeOwed;

                finalInvoice.details.push(invoice);
            }

            finalInvoice.master = masterInvoice;
            Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, finalInvoice, res);
        }
    });
}
