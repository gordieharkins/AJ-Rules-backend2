var os = require('os');
console.log(os.platform());
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var busBoy = require('busboy');
// var office2pdf = require('office2pdf');
// var pdfmerge = require('easy-pdf-merge');
// var imagepack = require('pdf-image-pack');
// var unoconv = require('unoconv');
var ValuationdalFile = require(path.resolve(__dirname, '../DAL/valuation'));
var IEdalFile = require(path.resolve(__dirname, '../DAL/incomeExpenses'));
var IEDAL = new IEdalFile();
var DAL = new ValuationdalFile();
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var AppealFilesPath = path.resolve(__dirname, '../public/Appeal/');
var loginUserName = 'Ali'; // Infutre will get logged in user name
var date = new Date();
var projectPath = path.resolve(__dirname, '../')+ "/";
// var msopdf = require('node-msoffice-pdf');
// var PDFImagePack = require("pdf-image-pack");
// var merge = require('easy-pdf-merge');
var mime = require('mime');
// var toPdf = require("office-to-pdf");
// var converter = require('office-converter')();
// var slide = new PDFImagePack();
var office = null;
var ObjectStorage = require(path.resolve(__dirname, './util/objectStorage'));
var objectStorage = new ObjectStorage();
var RRFilesPath = path.resolve(__dirname, '../public/RR/');
var RR_CONTAINER_NAME = 'RentRoll';
var FormData = require('form-data');

// var generatePdf = office2pdf.generatePdf;

// var poi = require("poi-converter-node");

// console.log("******************",projectPath);
// var listener = unoconv.listen({ port: 2002 });
// msopdf(null, function(error, res) { 
 
//     if (error) { 
//       	console.log("Init failed", error);
//       	return;
//   	} else {
//   		office = res;
//   	}

// });


module.exports = BLL;

// Class Constructor
function BLL() {

}

//----------------------------------------------
// Get Valuation Data
//----------------------------------------------
BLL.prototype.getValuationData = function(data, res) {
	if (!data || data === null || data === undefined) {
		Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
		return;
	}

	// if(!data.user[0].roles.view_valuations){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }

	var data = data.body;
	var propertyId = data.propertyId;
	var yearIE = data.year;
	var yearRR = data.year;
	var valuationRRData = {
		"foundData":false,
		"year": yearRR,
		"differentData":false,
		"data":{}
	}
	// console.log(yearIE);
	//    while(true){
	//     DAL.getValuationIEData(propertyId, yearIE, res,function(error, valuationData) {
	//         if (error) {
	//             error.userName = loginUserName;
	//             ErrorLogDAL.addErrorLog(error);
	//             Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
	//             return;
	//         } else if (valuationData === null){
	//         	continue;
	//         } else {
	//             var valuationIEData = valuationData;
	//             break;
	//         }
	//     });
	// }


	async.whilst(
		function () {
			return valuationRRData.foundData === false;
		},
		function (callback) {
			// console.log(yearRR);

			var dateNow = new Date(yearRR.toString()).getTime();
			var dateAfter = new Date((yearRR+1).toString()).getTime();
			// console.log(dateNow);
			// console.log(dateAfter);

			if(yearRR < 2011) {
				Response.sendResponse(false, Response.REPLY_MSG.No_DATA_FOUND, null, res);
			} else {

				DAL.getValuationRRData(propertyId, dateNow, dateAfter, res, function(error, valuationData) {
					if (error) {
						error.userName = loginUserName;
						ErrorLogDAL.addErrorLog(error);
						Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
						callback();
						return;
					} else if (valuationData.length == 0){
						yearRR -= 1;
						valuationRRData.year = yearRR;
						valuationRRData.differentData = true;
						callback();
					} else {
						valuationRRData.foundData = true;
						valuationRRData.data = valuationData[0];
						Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, valuationRRData, res);
						callback();
					}
				});
			}
		},
		function () {
			console.log("1");
		}
	);
}

//----------------------------------------------
// Add Valuation form
//----------------------------------------------
BLL.prototype.addValuationForm = function(data, res) {

	// if(!data.user[0].roles.create_edit_valuation){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }
	var userId = data.user[0].userId;
	DAL.checkValuationFormExistence(data.body, function(error, result) {
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
		} else {
			if(result.length > 0){
				Response.sendResponse(false,Response.REPLY_MSG.ALREADY_EXISTS, null, res);
			}
			else {
				DAL.addValuationForm(data.body, userId, function(error, result) {
					if (error) {
						error.userName = loginUserName;
						ErrorLogDAL.addErrorLog(error);
						Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
					} else {
						Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
					}
				});
			}
		}
	});

}

//----------------------------------------------
// Replace already existing form
//----------------------------------------------
BLL.prototype.replaceValuationForm = function(req, res) {

	// if(!data.user[0].roles.create_edit_valuation){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }
	var userId = req.user[0].userId;
	DAL.replaceValuationForm(req.body, userId, function(error, result) {
		if (error) {
			console.log(error);
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
		} else {
			Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
		}
	});
}


//----------------------------------------------
// Get Modal Data
//----------------------------------------------
BLL.prototype.getModalData = function(req, res) {

	// if(!data.user[0].roles.view_valuations){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }

	DAL.getModalData(req.body.id,function(error, result) {
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
		} else {
			Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
		}
	});
}

BLL.prototype.getEvidenceFiles = function(req, res) {

	// if(!req.user[0].roles.view_valuations){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }

	DAL.getEvidenceFiles(req.body.propId, function(error, result) {
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
		} else {
			Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
		}
	});
}


BLL.prototype.getEvidenceFilesById = function(req, res) {

	// if(!data.user[0].roles.view_valuations){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }

	DAL.getEvidenceFilesById(req.body.fileIds, function(error, result) {
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
		} else {
			Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
		}
	});
}

BLL.prototype.getFormsByPropertyId = function(req, res) {

	// if(!req.user[0].roles.view_valuations){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }

	DAL.getFormsByPropertyId(req.body, function(error, result) {
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
		} else {
			Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
		}
	});
}

BLL.prototype.getFormsByFormId = function(req, res) {

	// if(!data.user[0].roles.view_valuations){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }

	DAL.getFormsByFormId(req.body, function(error, result) {
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
		} else {
			Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
		}
	});
}

BLL.prototype.saveWorkSpace = function(req, res) {

	// if(!data.user[0].roles.edit_create_valuation_workspace){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }
	var userId = req.user[0].userId;
	var alreadyExists = {
		"userId":req.user[0].userId,
		"formId":req.body.formId,
		"name":[],
		"sensitivityCaluations":[{
			"marketPerSF":[],
			"vacancyPercent":[],
			"expensePerSF":[],
			"BaseCapRate":[]
		}],
		"scenarios":[]
	}
	DAL.saveWorkSpace(req.body, userId, function(error, result) {
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
		} else {
			Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, alreadyExists, res);
		}
	});

	// DAL.checkWorkSpaceDataExistence(req, function(error, result) {
	// 	if (error) {
	// 		error.userName = loginUserName;
	// 		ErrorLogDAL.addErrorLog(error);
	// 		Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
	// 	} else {
	// 		if(result[0].name.length > 0){
	// 			for(var i = 0;i < result[0].name.length;i++){
	// 				for(var j = 0;j < req.scenarios.length;j++){
	// 					if(result[0].name[i] === req.scenarios[j].name){
	// 						alreadyExists.scenarios.push(req.scenarios[j]);
	// 						alreadyExists.name.push(result[0].name[i]);
	// 						req.scenarios.splice(j,1);
	// 						result[0].name.splice(i,1);
	// 						i -= 1;
	// 						j -= 1;
	// 					}
	// 				}
	//
	// 				for(var j = 0;j < req.sensitivityCaluations[0].marketPerSF.length;j++){
	// 					if(result[0].name[i] === req.sensitivityCaluations[0].marketPerSF[j].name){
	// 						alreadyExists.sensitivityCaluations[0].marketPerSF.push(req.sensitivityCaluations[0].marketPerSF[j]);
	// 						alreadyExists.name.push(result[0].name[i]);
	// 						req.sensitivityCaluations[0].marketPerSF.splice(j,1);
	// 						result[0].name.splice(i,1);
	// 						i -= 1;
	// 						j -= 1;
	// 					}
	// 				}
	//
	// 				for(var j = 0;j < req.sensitivityCaluations[0].vacancyPercent.length;j++){
	// 					if(result[0].name[i] === req.sensitivityCaluations[0].vacancyPercent[j].name){
	// 						alreadyExists.sensitivityCaluations[0].vacancyPercent.push(req.sensitivityCaluations[0].vacancyPercent[j]);
	// 						alreadyExists.name.push(result[0].name[i]);
	// 						req.sensitivityCaluations[0].vacancyPercent.splice(j,1);
	// 						result[0].name.splice(i,1);
	// 						i -= 1;
	// 						j -= 1;
	// 					}
	// 				}
	//
	// 				for(var j = 0;j < req.sensitivityCaluations[0].expensePerSF.length;j++){
	// 					if(result[0].name[i] === req.sensitivityCaluations[0].expensePerSF[j].name){
	// 						alreadyExists.sensitivityCaluations[0].expensePerSF.push(req.sensitivityCaluations[0].expensePerSF[j]);
	// 						alreadyExists.name.push(result[0].name[i]);
	// 						req.sensitivityCaluations[0].expensePerSF.splice(j,1);
	// 						result[0].name.splice(i,1);
	// 						i -= 1;
	// 						j -= 1;
	// 					}
	// 				}
	//
	// 				for(var j = 0;j < req.sensitivityCaluations[0].BaseCapRate.length;j++){
	// 					if(result[0].name[i] === req.sensitivityCaluations[0].BaseCapRate[j].name){
	// 						alreadyExists.sensitivityCaluations[0].BaseCapRate.push(req.sensitivityCaluations[0].BaseCapRate[j]);
	// 						alreadyExists.name.push(result[0].name[i]);
	// 						req.sensitivityCaluations[0].BaseCapRate.splice(j,1);
	// 						result[0].name.splice(i,1);
	// 						i -= 1;
	// 						j -= 1;
	// 					}
	// 				}
	// 			}
	// 		}
	// 		if(req.scenarios.length > 0
	// 			|| req.sensitivityCaluations[0].marketPerSF.length > 0
	// 			|| req.sensitivityCaluations[0].vacancyPercent.length > 0
	// 			|| req.sensitivityCaluations[0].expensePerSF.length > 0
	// 			|| req.sensitivityCaluations[0].BaseCapRate.length > 0
	// 		){
	// 			DAL.saveWorkSpace(req, function(error, result) {
	// 				if (error) {
	// 					error.userName = loginUserName;
	// 					ErrorLogDAL.addErrorLog(error);
	// 					Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
	// 				} else {
	// 					Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, alreadyExists, res);
	// 				}
	// 			});
	// 		} else {
	// 			Response.sendResponse(true, Response.REPLY_MSG.ALREADY_EXISTS, alreadyExists, res);
	//
	// 		}
	//
	// 	}
	// });
}

//----------------------------------------------
// Replace already existing data in workspace
//----------------------------------------------
BLL.prototype.replaceWorkSpace = function(req, res) {

	// if(!data.user[0].roles.edit_create_valuation_workspace){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }
	DAL.replaceWorkSpace(req.body, function(error, result) {
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
		} else {
			Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, result, res);
		}
	});
}

//----------------------------------------------
// Get workspace data
//----------------------------------------------
BLL.prototype.getWorkSpace = function(req, res) {

	// if(!data.user[0].roles.view_valuation_workspace){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }

	var finalResult = {
		"sensitivityCaluations":[],
		"scenarios":[]
	}
	DAL.getWorkSpace(req.body, function(error, result) {
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
		} else if(result[0].marketPerSF.length === 0
			&& result[0].vacancyPercent.length === 0
			&& result[0].expensePerSF.length === 0
			&& result[0].BaseCapRate.length === 0
			&& result[0].scenarios.length === 0) {
			Response.sendResponse(true, Response.REPLY_MSG.No_DATA_FOUND, result, res);
		} else {

			for(var i = 0;i < result[0].marketPerSF.length; i++){

			}
			Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
		}
	});
}

BLL.prototype.appeal = function(req, res) {
	DAL.appeal(req.body, function(error, result) {
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.APPEAL_FAIL, null, res);
		} else {
			Response.sendResponse(true, Response.REPLY_MSG.APPEAL_SUCCESS, result, res);
		}
	});
}


BLL.prototype.deleteValuationForm = function(req, res) {

	// if(!data.user[0].roles.create_edit_valuation){
	// 		Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
	// 		return;
	// }

	DAL.deleteValuationForm(req.body, function(error, result) {
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.APPEAL_FAIL, null, res);
		} else {
			Response.sendResponse(true, Response.REPLY_MSG.APPEAL_SUCCESS, result, res);
		}
	});
}

BLL.prototype.createAppealPackage = function(req, res) {
	// Response.sendResponse(false, Response.REPLY_MSG.APPEAL_FAIL, null, res);
	// return;
		
	var files = [];
	var counter = 0;
	var userId = req.user[0].userId;
    var busboy = new busBoy({ headers: req.headers });
    req.pipe(busboy);
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    	var valuationFileTime = new Date().getTime() + "" + userId+ ".pdf";
        try {
            var saveTo = path.join(AppealFilesPath, path.basename(valuationFileTime));
            file.pipe(fs.createWriteStream(saveTo));
            files[counter] = saveTo;
            counter++;
        } catch(error) {
            // Log error and send response
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
        }
    });

    busboy.on('finish', function() {
        if(files.length <= 0) {
        	console.log("Error: No file found!");
            Response.sendResponse(false, Response.REPLY_MSG.NO_FILE_UPLOADED, null, res);
        } else {
            DAL.getFormsByFormId(req.query, function(error, result) {
				// console.log("Form: ", JSON.stringify(result));
		if (error) {
			error.userName = loginUserName;
			ErrorLogDAL.addErrorLog(error);
			Response.sendResponse(false, Response.REPLY_MSG.APPEAL_FAIL, null, res);
		} else {
			var formData =  result[0].valuationForm.properties;
			var evidenceIds = formData.addBackExcessRentEvidence
							.concat(formData.vacancyPercentageEvidence)
							.concat(formData.otherIncomeEvidence)
							.concat(formData.effectiveTaxRateEvidence)
							.concat(formData.expensePerSFEvidence)
							.concat(formData.totalDeductionsAddtionsEvidence)
							.concat(formData.baseCapRateEvidence)
							.concat(formData.freeRentEvidence)
							.concat(formData.tenantsImprovementsEvidence)
							.concat(formData.leasingCommissionEvidence)
							.concat(formData.expensePercentageEvidence)
							.concat(formData.lostRentEvidence)
							.concat(formData.marketRentPerSFEvidence);

				async.parallel([
				    function(callback) {
				        DAL.getIEERRAppealPackage(req.query, function(error, result) {
									if (error) {
										console.log("error: ", error);
										error.userName = loginUserName;
										ErrorLogDAL.addErrorLog(error);
										callback(error, null);
									} else {
										var ierrPaths = {
											iePaths: _.uniq(result[0].iePaths),
											rrPaths: _.uniq(result[0].rrPaths) 
										}

										callback(null, ierrPaths);
										// if(result.length > 0){
										// 	ierrPaths.iePaths = _.uniq(result[0].iePaths);
										// 	var rrPaths = _.uniq(result[0].rrPaths);
										// 	async.forEachOf(rrPaths, function (value, key, rrCallback) {
										// 		outputFilePath = path.join(RRFilesPath, value);
										// 	    objectStorage.downloadFile(value, RR_CONTAINER_NAME, outputFilePath, function(error, fileDetails) {
							            //             if(error) {
							            //             	console.log("error: ", error);
							            //                 error.userName = loginUserName;
							            //                 errorLogDAL.addErrorLog(error);
							            //                 isError = true;
							            //             } else {
							            //             	ierrPaths.rrPaths.push(outputFilePath);
							            //             }
							            //             rrCallback();
							            //         });
										// 	}, function (err) {
										// 	    if (err){
										// 	    	console.error(err.message);
										// 	    	callback(null, ierrPaths);
										// 	    } 
										// 	    callback(null, ierrPaths);
											    
										// 	});
										// } else {
										// 	callback(null, ierrPaths);
										// }
									}
								});	
				    },
				    function(callback) {
						console.log("E",evidenceIds);
				        DAL.getEvidenceFilesPathById(evidenceIds, function(error, result) {
							console.log("R",JSON.stringify(result));
							if (error) {
								console.log(error);
								error.userName = loginUserName;
								ErrorLogDAL.addErrorLog(error);
								callback(error, null);
							} else {
								var evidencePaths = {
									addBackExcessRentEvidence: [],
									vacancyPercentageEvidence: [],
									otherIncomeEvidence: [],
									effectiveTaxRateEvidence: [],
									expensePerSFEvidence: [],
									totalDeductionsAddtionsEvidence: [],
									baseCapRateEvidence: [],
									freeRentEvidence: [],
									tenantsImprovementsEvidence: [],
									leasingCommissionEvidence: [],
									expensePercentageEvidence: [],
									lostRentEvidence: [],
									marketRentPerSFEvidence: []
								};

								var evidencePathsCollected = result[0].ieFiles.concat(result[0].rrFiles)
													.concat(result[0].tbFiles)
													.concat(result[0].ofFiles);

								evidencePathsCollected = _.uniq(evidencePathsCollected);
								for(var i = 0; i < evidencePathsCollected.length; i++){
									var tempData = evidencePathsCollected[i].split("||");
									if(formData.addBackExcessRentEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.addBackExcessRentEvidence.push(tempData[0]);
									} 

									if(formData.vacancyPercentageEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.vacancyPercentageEvidence.push(tempData[0]);
									} 

									if(formData.otherIncomeEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.otherIncomeEvidence.push(tempData[0]);
									}

									if(formData.effectiveTaxRateEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.effectiveTaxRateEvidence.push(tempData[0]);
									}

									if(formData.expensePerSFEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.expensePerSFEvidence.push(tempData[0]);
									}

									if(formData.totalDeductionsAddtionsEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.totalDeductionsAddtionsEvidence.push(tempData[0]);
									}

									if(formData.baseCapRateEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.baseCapRateEvidence.push(tempData[0]);
									}

									if(formData.freeRentEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.freeRentEvidence.push(tempData[0]);
									}

									if(formData.tenantsImprovementsEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.tenantsImprovementsEvidence.push(tempData[0]);
									}

									if(formData.leasingCommissionEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.leasingCommissionEvidence.push(tempData[0]);
									}

									if(formData.expensePercentageEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.expensePercentageEvidence.push(tempData[0]);
									}

									if(formData.lostRentEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.lostRentEvidence.push(tempData[0]);
									}

									if(formData.marketRentPerSFEvidence.indexOf(parseInt(tempData[1])) > -1){
										evidencePaths.marketRentPerSFEvidence.push(tempData[0]);
									}
								}
								callback(null, evidencePaths);
				    		}
				    	});
				    }
				],
				function(err, result) {
					var evidencePaths = result[1];
					evidencePaths.incomeExpensesFiles = result[0].iePaths;
					evidencePaths.rentRollFiles = result[0].rrPaths;
					evidencePaths.valuationFormFiles = files;
					remotePdfConverter(evidencePaths, userId, function(error, response){
						var appealPackagePath = AppealFilesPath+'/Appeal Package.pdf';
						if(error){
							Response.sendResponse(false, Response.REPLY_MSG.APPEAL_FAIL, JSON.stringify(error), res);
						} else {
							fs.writeFile(appealPackagePath, response, (err) => {
								if(err){
									Response.sendResponse(false, Response.REPLY_MSG.APPEAL_FAIL, JSON.stringify(err), res);
								} else {
									Response.sendResponse(true, Response.REPLY_MSG.APPEAL_SUCCESS, appealPackagePath, res);
								}
							});
						}
					});
				});
			}
		});
        }
    });
}

function remotePdfConverter(filePaths, userId, cb){
	// console.log("here");
	console.log(filePaths);
	var form = new FormData();
	console.log(filePaths.valuationFormFiles[0]);
	try{
		form.append('valuationFormFiles', fs.createReadStream(filePaths.valuationFormFiles[0]));
		delete filePaths.valuationFormFiles;
		// console.log("here", filePaths);
		for(var key in filePaths){
			// console.log("herer2");
			// if(key == "rentRollFiles"){
				for(var i = 0; i < filePaths[key].length; i++){
					console.log(key,": ", filePaths[key][i]);
					form.append(key, filePaths[key][i]);		
				}
			// }
		}
		// form.append('filePaths', filePaths);
	} catch(err){
		console.log("Error: ",err);
	}
	
	// for(var key in filePaths){
	// 	if(filePaths[key].length > 0){
	// 		// form.append()
	// 		console.log(key);
	// 		for(var i = 0; i < filePaths[key].length; i++){
	// 			var filePath = filePaths[key][i];
	// 			// filePath = filePath.replace("/home/vcap/app/",projectPath);
	// 			try{
	// 				form.append(key, fs.createReadStream(filePath));
	// 			} catch(err){
	// 				console.log(err);
	// 			}
	// 		}

	// 	}
	// // console.log("jere");
		
	// }
	//
	try{
		console.log("here");
	form.submit('http://172.19.44.41:4000/converter', function(err, response) {
		// form.submit('http://202.69.61.244:4000/converter', function(err, response) {
	// form.submit('http://localhost:3000/converter', function(err, response) {
			
			var str = [];
			if(err){
				// console.log(err);
				cb(err, null);
			} else {
				response.on('data', function(chunk){
					str.push(chunk) ;
				});

				response.on('end', function(){
					str = Buffer.concat(str);
					cb(null, str);
				});
			}
		});
	} catch (error){
		console.log("error: ",err);
		cb(err, null);
	}
	
}
// function pdfConverter(filePathsTemp, userId, cb){
// 	var paths = {
// 			valuationFormFiles: [],
// 			addBackExcessRentEvidence: [],
// 			vacancyPercentageEvidence: [],
// 			otherIncomeEvidence: [],
// 			effectiveTaxRateEvidence: [],
// 			expensePerSFEvidence: [],
// 			totalDeductionsAddtionsEvidence: [],
// 			baseCapRateEvidence: [],
// 			freeRentEvidence: [],
// 			tenantsImprovementsEvidence: [],
// 			leasingCommissionEvidence: [],
// 			expensePercentageEvidence: [],
// 			lostRentEvidence: [],
// 			marketRentPerSFEvidence: [],
// 			incomeExpensesFiles: [],
// 			rentRollFiles: []

// 	};
// 	var alreadyConverted = [];
// 	var alreadyConvertedfileNames = [];

// 	async.forEachOf(filePathsTemp, function (valueTemp, index, callbackMain) {
// 		filePaths = _.uniq(filePathsTemp[index]);
// 		console.log(filePaths);
// 		async.forEachOf(filePaths, function (value, key, callback) {
// 			if(key == 0){
// 				paths[index].push(AppealFilesPath+"/"+index+".pdf");
// 			}
// 	    	var filePath = value;
// 			var time = date.getTime();
// 			var fileName = AppealFilesPath+"/"+time+""+key+index+userId;
// 			filePath = filePath.replace("/home/vcap/app/",projectPath);
// 			var fileIndex = alreadyConverted.indexOf(filePath);
// 			if(fileIndex > -1){
// 				paths[index].push(alreadyConvertedfileNames[fileIndex]+".pdf");
// 				callback();
// 			} else {
// 				alreadyConverted.push(filePath);
// 				alreadyConvertedfileNames.push(fileName);
// 				var split = filePath.split(".")
// 				var fileType = split[split.length-1];
// 				// if(fileType == "xlsx"){
// 				// 	msopdf(null, function(error, office) { 
					 
// 				// 	    if (error) { 
// 				// 	      	console.log("Init failed", error);
// 				// 	      	return;
// 				// 	  	} else {
// 				// 	  		office.excel({input: filePath, output: fileName}, function(error, pdf) { 
// 				// 		      	if(error) { 
// 				// 		           console.log("Woops", filePath, error);
// 				// 		           callback(error);

// 				// 			   	} else { 
// 				// 		           paths[index].push(fileName+".pdf");
// 				// 		           	office.close(null, function(error) { 
// 				// 				       if(error) { 
// 				// 				           console.log("Woops", "error onclosing", error);
// 				// 				           cb(error);
// 				// 				       	} else { 
// 				// 				           console.log("Finished & closed");
// 				// 				       	}
// 				// 				   	});
// 				// 		           callback();
// 				// 		       	}
// 			   	// 			});
// 				// 	  	}
// 				// 	});
					
// 				// } else if(fileType == "docx"){
// 				// 	msopdf(null, function(error, office) { 
// 				// 		if(error){
// 				// 	      	console.log("Init failed", error);
// 				// 	      	return;
// 				// 	  	} else {
// 				// 	  		office.word({input: filePath, output: fileName}, function(error, pdf) { 
// 				// 		      	if(error) { 
// 				// 		           console.log("Woops", filePath, error);
// 				// 		           callback(error);
// 				// 			   	} else { 
// 				// 		           paths[index].push(fileName+".pdf");
// 				// 		           	office.close(null, function(error) { 
// 				// 				       if(error) { 
// 				// 				           console.log("Woops", "error onclosing", error);
// 				// 				           cb(error);
// 				// 				       	} else { 
// 				// 				           console.log("Finished & closed");
// 				// 				       	}
// 				// 				   	});
// 				// 		           callback();
// 				// 		       	}
// 			   	// 			});
// 				// 	  	}
// 				// 	});
// 				// } else if(fileType == "pptx"){
// 				// 	msopdf(null, function(error, office) { 
// 				// 	    if (error) { 
// 				// 	      	console.log("Init failed", error);
// 				// 	      	return;
// 				// 	  	} else {
// 				// 	  		office.powerPoint({input: filePath, output: fileName}, function(error, pdf) { 
// 				// 		      	if(error) { 
// 				// 		           console.log("Woops", filePath, error);
// 				// 		           callback(error);
// 				// 			   	} else { 
// 				// 		           paths[index].push(fileName+".pdf");
// 				// 		           	office.close(null, function(error) { 
// 				// 				       if(error) { 
// 				// 				           console.log("Woops", "error onclosing", error);
// 				// 				           cb(error);
// 				// 				       	} else { 
// 				// 				           console.log("Finished & closed");
// 				// 				       	}
// 				// 				   	});
// 				// 		           callback();
// 				// 		       	}
// 			   	// 			});
			   				
// 				// 	  	}

// 				// 	});

// 				if(fileType == "xlsx" || fileType == "docx" || fileType == "pptx"){
// 					console.log("work in progress...");
// 					callback();
// 					// unoconv.convert(filePath, 'pdf', false , function (err, result) { 
// 				    //   	if(error) { 
// 				    //        console.log("Woops", filePath, err);
// 				    //        callback(err);

// 					//    	} else { 
// 				    //        	paths[index].push(fileName+".pdf");
// 					// 		fs.writeFile(fileName, result);
// 				    //        	callback();
// 				    //    	}
// 	   				// });
// 	   				// console.log("filePath: ", filePath);
// 	   				// var wordBuffer = fs.readFileSync(filePath);
// 					// toPdf(wordBuffer).then(
// 					//   (pdfBuffer) => {
// 					//     fs.writeFileSync(fileName, pdfBuffer);
// 					//     paths[index].push(fileName+".pdf");
// 					//     callback();
// 					//   }, (err) => {
// 					//     console.log(err);
// 					//     callback(err);
// 					//   }
// 					// );


// 					// poi.to(filePath, fileName+".pdf", function(err, out, result){
// 					// 	if(result.success){
// 					// 		// console.log('Output File located at ' + result.outputFile);
// 					// 		console.log("*********",result,err, "**************");
// 					//       	paths[index].push(fileName);
// 					//       	callback();
// 					// 	} else{
// 					// 		console.log("EERRROORRR",err);
// 					//     	console.log("REESSSSSULT",result);
// 					//     	callback();
// 					// 	}
// 					// });
// 					// converter.generatePdf(filePath, function(err, result) {
// 					//     // Process result if no error
// 					//     if(err){
// 					//     	console.log("EERRROORRR",err);
// 					//     	console.log("REESSSSSULT",result);
// 					//     	callback();
// 					//     } else if (result.status === 0) {
// 					//       console.log('Output File located at ' + result.outputFile);
// 					//       paths[index].push(result.outputFile);
// 					//       callback();
// 					//     } else {
// 					    	// callback();					    }
// 					//   });
// 				} else if(fileType == "JPG" || fileType == "jpg"){
// 					var imgs = [filePath];
// 					fileName += ".pdf";
// 					slide.output(imgs, fileName, function(err, pdf){
// 				  		paths[index].push(fileName);
// 				  		callback();
// 					});
// 				} else if(fileType == "PNG" || fileType == "png"){
// 					var imgs = [filePath];
// 					fileName += ".pdf";
// 					slide.output(imgs, fileName, function(err, pdf){
// 				  		paths[index].push(fileName);
// 				  		callback();
// 					});
// 				} else if(fileType == "pdf"){
// 					paths[index].push(filePath);
// 					callback();
// 				} 
// 			}
			
// 			}, function (err) {
// 			    if (err){
// 			    	console.log(err.message);	
// 			    }
// 			    callbackMain();
// 		});
    
// 	}, function (err) {
// 		if (err){
// 		    	cb(err.message);	
// 	    } else {
// 	    	var fileNames = [];
// 		   	for(key in paths){
// 		   		fileNames = fileNames.concat(paths[key]);
// 		   	}
// 	    	cb(fileNames);
// 	    }
// 	});
	
// }

