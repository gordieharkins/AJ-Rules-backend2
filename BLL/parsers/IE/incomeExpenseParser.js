const UNKNOWN_FILE_TYPE = 0;
const YARDI_B_COMPARISON_12_13_14_FILE_TYPE = 1;
const YARDI_B_COMPARISON_17_FILE_TYPE = 2;
const YARDI_IE_17_FILE_TYPE = 3;
const MULTIPLE_SHEETS_FILE_TYPE = 4;
const MRI_16_17_FILE_TYPE = 5;
const SINGLE_COLUMN_FILE_TYPE = 6; 
const YARDI_IE_16_FILE_TYPE = 7;
const YARDI_B_COMPARISON_COLUMN_NAME = "YTD Actual";
const YARDI_IE_COULMN_NAME = "Year to Date";
const MRI_COLUMN_NAME = "Year-To-Date";
const STMT_SHEET_NAME = "stmt";
const SINGLE_COLUMN_NAME = "Total";

var async = require('async');
var path = require('path');

var InvalidFileFormat = require('../../errors/invalidFileFormat');
var YardiBComparison121314 = require(path.resolve(__dirname, './YARDI_B_COMPARISON_12_13_14'));
var YardiBComparison17 = require(path.resolve(__dirname, './YARDI_B_COMPARISON_17'));
var YardiIE17 = require(path.resolve(__dirname, './YARDI_IE_17'));
var SingleColumn = require(path.resolve(__dirname, './Single_Column'));
var MRI1617 = require(path.resolve(__dirname, './MRI_16_17'));
var MultipleSheet = require(path.resolve(__dirname, './MULTIPLE_SHEETS'));
var YardiIE16 = require(path.resolve(__dirname, './YARDI_IE_16'));
var Response = require(path.resolve(__dirname, '../../util/response'));

var multipleSheet = new MultipleSheet();
var mri1617 = new MRI1617();
var yardiIE17 = new YardiIE17();
var yardiIE16 = new YardiIE16();
var yardiBComparison17 = new YardiBComparison17();
var yardiBComparison121314 = new YardiBComparison121314();
var singleColumn = new SingleColumn();
var headersResult = [];
if(typeof require !== 'undefined') XLSX = require(path.resolve(__dirname, '../xlsx'));

module.exports = IncomeExpenseParser;

function IncomeExpenseParser(){

}

IncomeExpenseParser.prototype.parseIncomeExpenseFile = function (fileBuffer, fileName, originalFileName1, mycb) {
	var incomeExpense = {};
    var fileType = getFileType(fileBuffer);
	// console.log("fileType: ****",fileType);

	if (fileType == UNKNOWN_FILE_TYPE ){
		incomeExpense = [{IEYear:['Income Expense Statement of','unknown'],parsed:['Parsed Status','false'],originalFileName:["original filename",originalFileName1]}];
		mycb(incomeExpense);
	}
	else if (fileType == YARDI_IE_16_FILE_TYPE ){
		async.series([
			function(callback) {
				yardiIE17.getHeaders("YardiIE16",function(resultAbc){
					headersResult = resultAbc;
					callback(null, "result");
				});
			}
			,
			function(callback) {
				yardiIE17.parseFile(fileBuffer, fileName, originalFileName1,"YardiIE16", headersResult, function(incomeExpense){
					callback(null, incomeExpense);
				});
			}
		],
		function(err, results) {
			var incomeExpense = results[1];
			if(incomeExpense === null  || incomeExpense[0].IEYear === null || incomeExpense[0].address === null) {
				incomeExpense = [{IEYear:['Income Expense Statement of','unknown'],parsed:['Parsed Status','false'],originalFileName:["original filename",originalFileName1]}];
				mycb(incomeExpense);
			}else{
				incomeExpense[0].parsed = ['Parsed Status','true'];				
				mycb(incomeExpense);
			}
		});

	} else if (fileType == YARDI_IE_17_FILE_TYPE ){

		async.series([
			function(callback) {
				yardiIE17.getHeaders("YardiIE17",function(resultAbc){
					headersResult = resultAbc;
					callback(null, "result");
				});
			}
			,
			function(callback) {
				yardiIE17.parseFile(fileBuffer, fileName, originalFileName1,"YardiIE17", headersResult, function(incomeExpense){
					callback(null, incomeExpense);
				});
			}
		],
		function(err, results) {
			var incomeExpense = results[1];
			if(incomeExpense === null || incomeExpense[0].address === '' || incomeExpense[0].IEYear === null || incomeExpense[0].address === null) {
				incomeExpense = [{IEYear:['Income Expense Statement of','unknown'],parsed:['Parsed Status','false'],originalFileName:["original filename",originalFileName1]}];
				mycb(incomeExpense);
			}else{
				incomeExpense[0].parsed = ['Parsed Status','true'];				
				mycb(incomeExpense);
			}
			
		});
	}else if (fileType == YARDI_B_COMPARISON_17_FILE_TYPE){
		async.series([
			function(callback) {
				yardiIE17.getHeaders("YARDI_B_COMPARISON_17",function(resultAbc){
					headersResult = resultAbc;
					callback(null, "result");
				});
			}
			,
			function(callback) {
				yardiIE17.parseFile(fileBuffer, fileName, originalFileName1,"YARDI_B_COMPARISON_17", headersResult, function(incomeExpense){
					callback(null, incomeExpense);
				});
			}
		],
		function(err, results) {
			var incomeExpense = results[1];
			if(incomeExpense === null || incomeExpense[0].address === '' || incomeExpense[0].IEYear === null || incomeExpense[0].address === null) {
				incomeExpense = [{IEYear:['Income Expense Statement of','unknown'],parsed:['Parsed Status','false'],originalFileName:["original filename",originalFileName1]}];
				mycb(incomeExpense);
			}else{
				incomeExpense[0].parsed = ['Parsed Status','true'];				
				mycb(incomeExpense);
			}
		});
	}else if (fileType == YARDI_B_COMPARISON_12_13_14_FILE_TYPE){
		async.series([
			function(callback) {
				yardiIE17.getHeaders("YARDI_B_COMPARISON_12_13_14",function(resultAbc){
					headersResult = resultAbc;
					callback(null, "result");
				});
			}
			,
			function(callback) {
				yardiIE17.parseFile(fileBuffer, fileName, originalFileName1,"YARDI_B_COMPARISON_12_13_14", headersResult, function(incomeExpense){
					callback(null, incomeExpense);
				});
			}
		],
		function(err, results) {
			var incomeExpense = results[1];
			if(incomeExpense === null || incomeExpense[0].address === '' || incomeExpense[0].IEYear === null || incomeExpense[0].address === null) {
				incomeExpense = [{IEYear:['Income Expense Statement of','unknown'],parsed:['Parsed Status','false'],originalFileName:["original filename",originalFileName1]}];
				// console.log("IE parser.js" , incomeExpense);
				mycb(incomeExpense);
			// }else if(incomeExpense[0].IEYear != null && incomeExpense[0].address != null){
			// 	incomeExpense[0].parsed = ['Parsed Status','true'];
			// 	console.log("IE parser.js" , incomeExpense);
			// 	mycb(incomeExpense);
			// }else{
			}else{
				// console.log("IE parser.js" , incomeExpense);
				incomeExpense[0].parsed = ['Parsed Status','true'];				
				mycb(incomeExpense);
			}
		});
	}else if (fileType == SINGLE_COLUMN_FILE_TYPE){
		async.series([
			function(callback) {
				yardiIE17.getHeaders("SINGLE_COLUMN",function(resultAbc){
					headersResult = resultAbc;
					callback(null, "result");
				});
			}
			,
			function(callback) {
				yardiIE17.parseFile(fileBuffer, fileName, originalFileName1,"SINGLE_COLUMN", headersResult, function(incomeExpense){
					callback(null, incomeExpense);
				});
			}
		],
		function(err, results) {
			var incomeExpense = results[1];
			if(incomeExpense === null || incomeExpense[0].address === '' || incomeExpense[0].IEYear === null || incomeExpense[0].address === null) {
				incomeExpense = [{IEYear:['Income Expense Statement of','unknown'],parsed:['Parsed Status','false'],originalFileName:["original filename",originalFileName1]}];
				// console.log("IE parser.js" , incomeExpense);
				mycb(incomeExpense);
			// }else if(incomeExpense[0].IEYear != null && incomeExpense[0].address != null){
			// 	incomeExpense[0].parsed = ['Parsed Status','true'];
			// 	console.log("IE parser.js" , incomeExpense);
			// 	mycb(incomeExpense);
			// }else{
			}else{
				// console.log("IE parser.js" , incomeExpense);
				incomeExpense[0].parsed = ['Parsed Status','true'];				
				mycb(incomeExpense);
			}
		});
	} else if (fileType == MULTIPLE_SHEETS_FILE_TYPE){
		async.series([
			function(callback) {
				yardiIE17.getHeaders("MULTIPLE_SHEETS",function(resultAbc){
					headersResult = resultAbc;
					callback(null, "result");
				});
			}
			,
			function(callback) {
				yardiIE17.parseFile(fileBuffer, fileName, originalFileName1,"MULTIPLE_SHEETS", headersResult, function(incomeExpense){
					callback(null, incomeExpense);
				});
			}
		],
		function(err, results) {
			var incomeExpense = results[1];
			if(incomeExpense === null || incomeExpense[0].address === '' || incomeExpense[0].IEYear === null || incomeExpense[0].address === null) {
				incomeExpense = [{IEYear:['Income Expense Statement of','unknown'],parsed:['Parsed Status','false'],originalFileName:["original filename",originalFileName1]}];
				// console.log("IE parser.js" , incomeExpense);
				mycb(incomeExpense);
			// }else if(incomeExpense[0].IEYear != null && incomeExpense[0].address != null){
			// 	incomeExpense[0].parsed = ['Parsed Status','true'];
			// 	console.log("IE parser.js" , incomeExpense);
			// 	mycb(incomeExpense);
			// }else{
			}else{
				// console.log("IE parser.js" , incomeExpense);
				incomeExpense[0].parsed = ['Parsed Status','true'];				
				mycb(incomeExpense);
			}
		});
	} else if (fileType == MRI_16_17_FILE_TYPE){
		async.series([
			function(callback) {
				yardiIE17.getHeaders("MRI_16_17",function(resultAbc){
					headersResult = resultAbc;
					callback(null, "result");
				});
			}
			,
			function(callback) {
				mri1617.parseFile(fileBuffer, fileName, originalFileName1,"MRI_16_17", headersResult, function(incomeExpense){
					callback(null, incomeExpense);
				});
			}
		],
		function(err, results) {
			var incomeExpense = results[1];
			if(incomeExpense === null || incomeExpense[0].address === '' || incomeExpense[0].IEYear === null || incomeExpense[0].address === null) {
				incomeExpense = [{IEYear:['Income Expense Statement of','unknown'],parsed:['Parsed Status','false'],originalFileName:["original filename",originalFileName1]}];
				// console.log("IE parser.js" , incomeExpense);
				mycb(incomeExpense);
			// }else if(incomeExpense[0].IEYear != null && incomeExpense[0].address != null){
			// 	incomeExpense[0].parsed = ['Parsed Status','true'];
			// 	console.log("IE parser.js" , incomeExpense);
			// 	mycb(incomeExpense);
			// }else{
			}else{
				// console.log("IE parser.js" , incomeExpense);
				incomeExpense[0].parsed = ['Parsed Status','true'];				
				mycb(incomeExpense);
			}
		});
	}


	
	
    /*switch (fileType) {
        case YARDI_B_COMPARISON_12_13_14_FILE_TYPE:
            incomeExpense = yardiBComparison121314.parseFile(file);
            break;

        case YARDI_B_COMPARISON_17_FILE_TYPE:
            incomeExpense = yardiBComparison17.parseFile(file);
            break;

        case YARDI_IE_17_FILE_TYPE:
			incomeExpense = yardiIE17.parseFile(file,"YardiIE17");
			console.log("IE",incomeExpense);
            break;

        case MULTIPLE_SHEETS_FILE_TYPE:
            incomeExpense = multipleSheet.parseFile(file);
            break;

        case MRI_16_17_FILE_TYPE :
            incomeExpense = mri1617.parseFile(file);
            break;
        case SINGLE_COLUMN_FILE_TYPE:
			incomeExpense = singleColumn.parseFile(file);
			break;
		case YARDI_IE_16_FILE_TYPE:
			//incomeExpense = yardiIE16.parseFile(file);
			console.log("I am here in yardi ie 16");

			yardiIE17.getHeaders("YardiIE16",function(result){
				console.log("result",result);
				incomeExpense = yardiIE17.parseFile(file,"YardiIE16",result);
				console.log("IE",incomeExpense);
			break;
				
			});

			// var headers = yardiIE17.getHeaders("YardiIE16");
			// console.log(headers);
			// yardiIE17.parseFile(file,"YardiIE16",headers);
			// console.log("IE: ",incomeExpense);
			// break;
			// console.log(result);
			// incomeExpense = yardiIE17.parseFile(file,"YardiIE16");
			// yardiIE17.parseFile(file,"YardiIE16",function(incomeExpense){
			// 	console.log("IE",incomeExpense);
				
			// });
			
	}*/
	// if(incomeExpense === null || incomeExpense[0].address === null || incomeExpense[0].IEYear === null) {
	// 	console.log("in error 2");
	// 	throw new InvalidFileFormat(Response.REPLY_MSG.FIELDS_NOT_FOUND);
	// }
    // return incomeExpense;
}

function getFileType(fileBuffer) {
	var fileType = UNKNOWN_FILE_TYPE;
	var workbook = XLSX.read(fileBuffer, {type: 'buffer'});
	var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
	if(csv.length > 0) {
		var rows = csv.split("\n");
		for(var index = 0; index < rows.length; index++) {
			// Get cells
			var cells=rows[index].split("|");
			// console.log(cells);
			if(workbook.SheetNames.length > 2 && workbook.SheetNames[0] == STMT_SHEET_NAME){
				fileType = MULTIPLE_SHEETS_FILE_TYPE;
				return fileType;
			}
			else{
				for(cellIndex = 0; cellIndex < cells.length; cellIndex++){
					var cellValue = cells[cellIndex];
					// if(cellValue !== ''){
					// // console.log("cell value in get file type: ",cellValue);
					// }
					// console.log(cellValue.toLowerCase().trim(), cellIndex);
					if(cellValue.toLowerCase().trim() == YARDI_B_COMPARISON_COLUMN_NAME.toLowerCase()){
						var yardiOtherformat = "Base Rent Income";
						var yardi = "REVENUES";
						var newCells = rows[index + 1].split("|");
						for(cellIndex2 = 0; cellIndex2 < newCells.length; cellIndex2++){
							var cellValue = newCells[cellIndex2];
							if(cellValue.toLowerCase().trim() == yardiOtherformat.toLowerCase()){
								fileType = YARDI_B_COMPARISON_17_FILE_TYPE ;
								break;	
							}
							else if(cellValue.toLowerCase().trim() == yardi.toLowerCase()){
								fileType = YARDI_B_COMPARISON_12_13_14_FILE_TYPE;
								break;
							}
						}
					} else if(cellValue.toLowerCase().trim() == YARDI_IE_COULMN_NAME.toLowerCase()){
						var flag = true;
						var count = 1;
						do{
							var newCells = rows[index + count].split("|");
							for(cellIndex2 = 0; cellIndex2 < newCells.length; cellIndex2++){
								var cellValue = newCells[cellIndex2];
								if(cellValue.toLowerCase().trim() ==  "RENTAL REVENUE".toLowerCase()){
									fileType = YARDI_IE_16_FILE_TYPE;
									flag = false;
									break;	
								}
								else if(cellValue.toLowerCase().trim() == "RENTAL INCOME".toLowerCase()){
									fileType = YARDI_IE_17_FILE_TYPE;
									flag = false;
									break;
								}
							}
							count++;
						} while(flag);
					} else if(cellValue.toLowerCase().trim() == MRI_COLUMN_NAME.toLowerCase()){
						fileType = MRI_16_17_FILE_TYPE;
						break;
					} else if (cellValue.toLowerCase().trim() == SINGLE_COLUMN_NAME.toLowerCase()){
						fileType = SINGLE_COLUMN_FILE_TYPE;
						break;
					}
				}
			}
		}
		return fileType;
	}
}
