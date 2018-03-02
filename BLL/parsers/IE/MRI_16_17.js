const ADDRESS_LABEL = "Address";
const DATE_LABEL = "Income Expense Statement of";
const FILE_PATH_LABEL = "File Path";
const FILE_NAME_LABEL = "File Name";
const SHEET_NAME_LABEL = "Sheet Name";
const FORMAT_LABEL = "Format";
const DESCRIPTION_LABEL = "Description";
const TYPE_LABEL = "File Type";
const ORIGINAL_FILE_NAME = 'Original File Name';

const FILE_FORMAT = "MRI";
const FILE_TYPE = "Income Expense Statement";

var path = require('path');
var Common = require(path.resolve(__dirname, './common'));
var UtilityFunctions = require(path.resolve(__dirname, '../../util/functions'));
var util = new UtilityFunctions();

module.exports = MRI1617;
function MRI1617() {

}

MRI1617.prototype.parseFile = function (fileBuffer, fileName, originalFileName, type,result,cb) {
	// console.log("result::: ",JSON.stringify(result));
	var count = 0;
	// var yardiType = type;
	// var baseRentColumnName = "Base Rent";
	// var rentalIncomeColumnName = "Rental Income";
	// var misIncomeColumnName = "Miscellaneous Income";
	// var parkingIncomeColumnName = "Parking Income";
	// var totalIncomeColumnName = "Total Income";
	// var totalPersonnelColumnName = "Total Personnel";
	// var totalUtilitiesColumnName = "Total Utilities";
	// var totalAdministrativeColumnName = "Total Administrative";
	// var realEstateTaxesColumnName = "Real Estate Taxes";
	// var totalExpensesColumnName = "Total Expenses";
	// var cashFlowNetIncomeColumnName = "Cash Flow - Net Income";
	// var totalContractedServicesColumnName = "Total Contracted Services";
	// var totalMaintenanceColumnName = "Total Maintenance";
	// var totalTaxesAndInsuranceColumnName = "Total Taxes and Insurance";
	// var totalOperatingRecColumnName = "Total Operating Exp-Recoverable";
	// var totalOperatingUnRecColumnName = "Total Operating Exp-Unrecoverable";
	// var actualColumnName = "Actual";
	// var yearToDateColumnName = "Year-To-Date";
	result[0].n.properties.columnHeaders = result[0].n.properties.columnHeaders.map(function (e) { 
		return e.toLowerCase()
	});
	result[0].n.properties.rowHeaders = result[0].n.properties.rowHeaders.map(function (e) { 
		return e.toLowerCase()
	});
	var actualColumnName = result[0].n.properties.rowHeaders[0];
	var yearToDateColumnName = result[0].n.properties.rowHeaders[1];

	var yearToDateColumnIndex = null;
	var actualColumnIndex = null;
	var result2 = [];

	var workbook = XLSX.read(fileBuffer, {type: 'buffer'});
	workbook.SheetNames.forEach(function(sheetName) {
		var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);

		if(csv.length > 0) {
			// IE object
			var incomeExpense = {};
            var filesName = [];
            var sheetsName = [];
            var format = [];
            var description = [];
            var type = [];

            incomeExpense.originalFileName = [];
            incomeExpense.originalFileName[0] = ORIGINAL_FILE_NAME;
            incomeExpense.originalFileName[1] = originalFileName;
            
            filesName[0] = FILE_NAME_LABEL;
            filesName[1] = fileName;
            incomeExpense.fileName = filesName;

            sheetsName[0] = SHEET_NAME_LABEL;
            sheetsName[1] = sheetName;
            incomeExpense.sheetName = sheetsName;

            format[0] = FORMAT_LABEL;
            format[1] = FILE_FORMAT;
            incomeExpense.format = format;

            description[0] = DESCRIPTION_LABEL;
            description[1] = "";
            incomeExpense.description = description;

            type[0] = TYPE_LABEL;
            type[1] = FILE_TYPE;
            incomeExpense.type = type; //for danyal's filters on frontend

            incomeExpense.address = null;
            incomeExpense.IEYear = null;

			var yearToDateColumnFound = false;
			var actualColumnsFound = false;
			var rows = csv.split("\n");

			var isAddressFound = false;
			var isDateFound = false;

			for(var index = 0; index < rows.length; index++) {

				// Get cells
				var cells=rows[index].toLowerCase().split("|");
				if(cells.length===0) {
					continue;
				}
				
				// check if address and date found or not.
				if (!isAddressFound) {
                    for(cellIndex = 0; cellIndex < cells.length; cellIndex++){
						var cellValue = cells[cellIndex];
						if(cellValue.indexOf("accrual") > -1){
							var address = [];
                            address[0] = ADDRESS_LABEL;
							address[1] = rows[index - 1].split("|")[cellIndex + 1];
                            incomeExpense.address = address;
                        	isAddressFound = true;
                        	break;
						}
                	}
                }

                if (!isDateFound) {
                    for(cellIndex = 0; cellIndex < cells.length; cellIndex++){
						var cellValue = cells[cellIndex];
						if(cellValue.indexOf("actual") > -1){
                            var date = [];
                            date[0] = DATE_LABEL;
							date[1] = rows[index + 1].split("|")[cellIndex].trim();
							date[1] = date[1].split(" ");
                            date[1] = date[1][date[1].length - 1];
                            date[2] = '17';
                            incomeExpense.IEYear = date;
            				isDateFound = true;
            				break;
						}
                	}
                }
				//-------------------------------
				var newPageStarted = false;

				if(yearToDateColumnFound && actualColumnsFound) {
					for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
						if(cells[cellIndex].toLowerCase() === yearToDateColumnName.toLowerCase()) {
							newPageStarted = true;
							actualColumnsFound = false;
							break;
						}
					}
				}

				// Find Year-To-Date and Actual columns
				if((!yearToDateColumnFound || !actualColumnsFound) || newPageStarted) {
					var actual1Index = null;
					var actual2Index = null;
					for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
						var cellValue = cells[cellIndex];
						if(cellValue.toLowerCase() === yearToDateColumnName.toLowerCase()) {
							yearToDateColumnFound = true;
							yearToDateColumnIndex = cellIndex;
						}
						if(cellValue.toLowerCase() === actualColumnName.toLowerCase()) {
							if(actual1Index !== null) {
								actual2Index = cellIndex;
								actualColumnsFound = true;
								date =rows[index+1].split("|")[actual2Index];
							} else {
								actual1Index = cellIndex;
							}
						}
					}

					if(actualColumnsFound) {
						// console.log("actualColumnsFound: ",actual1Index);
						// console.log("actual2Index: ",actual2Index);
						var actual1IndexDifference = yearToDateColumnIndex - actual1Index;
						var actual2IndexDifference = yearToDateColumnIndex - actual2Index;
						if(actual1IndexDifference < actual2IndexDifference) {
							actualColumnIndex = actual1Index;
						} else {
							actualColumnIndex = actual2Index;
						}
					}
				}

				if(!yearToDateColumnFound || !actualColumnsFound) {
					continue;
				}

				for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
					var valueCell = cells[cellIndex].trim();
					// console.log("heading: ",valueCell);
					// console.log("col values: ",cells[actualColumnIndex]);
				   
					if (result[0].n.properties.columnHeaders.indexOf(valueCell)>-1)
					{
						// console.log("heading: ",valueCell);
						// console.log("col values: ",cells[actualColumnIndex]);

						var a = valueCell.toLowerCase().replace(/\s/g, '');
						a = a.replace(/[^a-zA-Z ]/g, "");
						// console.log("found!!: ",a);
						incomeExpense[a]=[];
						incomeExpense[a][0] = result[0].n.properties.columnHeaders[result[0].n.properties.columnHeaders.indexOf(valueCell)];
							
						
						
						if (cells[actualColumnIndex]){
							if(cells[actualColumnIndex].trim() !== "-" && cells[actualColumnIndex].indexOf("-")>-1){
								incomeExpense[a][1] = (util.getFloatValue(cells[actualColumnIndex])*-1).toString();
							}else if(cells[actualColumnIndex].trim() !== "-"){
								incomeExpense[a][1] = (util.getFloatValue(cells[actualColumnIndex])).toString();
							}
						}else{
							incomeExpense[a][1] = (util.getFloatValue("0.00")).toString();
						}
						// incomeExpense[a][1] = util.getFloatValue(cells[actualColumnIndex]).toString();
						// incomeExpense[a][1] = cells[actualColumnIndex];
						incomeExpense[a][2] = (count++).toString();
						incomeExpense[a][3] = Common.DATA_TYPE.CURRENCY;
						
					}
					
				}

				// for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
				// 	if(cells[cellIndex].toLowerCase() === baseRentColumnName.toLowerCase()) {
                //         var baseRent = [];
                //         baseRent[0] = baseRentColumnName;
                //         baseRent[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		baseRent[2] = '1';
				// 		baseRent[3] = Common.DATA_TYPE.CURRENCY; // unit;
                //         incomeExpense.baseRent = baseRent;
				// 	} else if(cells[cellIndex].toLowerCase() === rentalIncomeColumnName.toLowerCase()) {
                //         var rentalIncome = [];
                //         rentalIncome[0] = rentalIncomeColumnName;
                //         rentalIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		rentalIncome[2] = '2';
				// 		rentalIncome[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.rentalIncome = rentalIncome;
				// 	} else if(cells[cellIndex].toLowerCase() === misIncomeColumnName.toLowerCase()) {
                //         var miscellaneousIncome = [];
                //         miscellaneousIncome[0] = misIncomeColumnName;
                //         miscellaneousIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		miscellaneousIncome[2] = '3';
				// 		miscellaneousIncome[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.miscellaneousIncome = miscellaneousIncome;
				// 	} else if(cells[cellIndex].toLowerCase() === parkingIncomeColumnName.toLowerCase()) {
                //         var parkingIncome = [];
                //         parkingIncome[0] = parkingIncomeColumnName;
                //         parkingIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		parkingIncome[2] = '4';
				// 		parkingIncome[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.parkingIncome = parkingIncome;
				// 	} else if(cells[cellIndex].toLowerCase() === totalIncomeColumnName.toLowerCase()) {
                //         var totalIncome = [];
                //         totalIncome[0] = totalIncomeColumnName;
                //         totalIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		totalIncome[2] = '5';
				// 		totalIncome[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.totalIncome = totalIncome;
				// 	} else if(cells[cellIndex].toLowerCase() === totalPersonnelColumnName.toLowerCase()) {
                //         var totalPersonnel = [];
                //         totalPersonnel[0] = totalPersonnelColumnName;
                //         totalPersonnel[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		totalPersonnel[2] = '6';
				// 		totalPersonnel[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.totalPersonnel = totalPersonnel;
				// 	} else if(cells[cellIndex].toLowerCase() === totalUtilitiesColumnName.toLowerCase()) {
                //         var totalUtilities = [];
                //         totalUtilities[0] = totalUtilitiesColumnName;
                //         totalUtilities[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		totalUtilities[2] = '7';
				// 		totalUtilities[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.totalUtilities = totalUtilities;
				// 	} else if(cells[cellIndex].toLowerCase() === totalContractedServicesColumnName.toLowerCase()) {
                //         var totalContractedServices = [];
                //         totalContractedServices[0] = totalContractedServicesColumnName;
                //         totalContractedServices[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		totalContractedServices[2] = '8';
				// 		totalContractedServices[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.totalContractedServices = totalContractedServices;
				// 	} else if(cells[cellIndex].toLowerCase() === totalMaintenanceColumnName.toLowerCase()) {
                //         var totalMaintenance = [];
                //         totalMaintenance[0] = totalMaintenanceColumnName;
                //         totalMaintenance[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		totalMaintenance[2] = '9';
				// 		totalMaintenance[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.totalMaintenance = totalMaintenance;
				// 	} else if(cells[cellIndex].toLowerCase() === totalAdministrativeColumnName.toLowerCase()) {
                //         var totalAdministrative = [];
                //         totalAdministrative[0] = totalAdministrativeColumnName;
                //         totalAdministrative[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		totalAdministrative[2] = '10';
				// 		totalAdministrative[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.totalAdministrative = totalAdministrative;
				// 	} else if(cells[cellIndex].toLowerCase() === realEstateTaxesColumnName.toLowerCase()) {
                //         var realEstateTaxes = [];
                //         realEstateTaxes[0] = realEstateTaxesColumnName;
                //         realEstateTaxes[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		realEstateTaxes[2] = '11';
				// 		realEstateTaxes[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.realEstateTaxes = realEstateTaxes;
				// 	} else if(cells[cellIndex].toLowerCase() === totalTaxesAndInsuranceColumnName.toLowerCase()) {
                //         var totalTaxesAndInsurance = [];
                //         totalTaxesAndInsurance[0] = totalTaxesAndInsuranceColumnName;
                //         totalTaxesAndInsurance[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		totalTaxesAndInsurance[2] = '12';
				// 		totalTaxesAndInsurance[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.totalTaxesAndInsurance = totalTaxesAndInsurance;
				// 	} else if(cells[cellIndex].toLowerCase() === totalOperatingRecColumnName.toLowerCase()) {
                //         var totalOperatingExpRecoverable = [];
                //         totalOperatingExpRecoverable[0] = totalOperatingRecColumnName;
                //         totalOperatingExpRecoverable[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                //         totalOperatingExpRecoverable[2] = '13';
				// 		totalOperatingExpRecoverable[3] = Common.DATA_TYPE.CURRENCY;
				// 		incomeExpense.totalOperatingExpRecoverable = totalOperatingExpRecoverable;
				// 	} else if(cells[cellIndex].toLowerCase() === totalOperatingUnRecColumnName.toLowerCase()) {
                //         var totalOperatingExpUnRecoverable = [];
                //         totalOperatingExpUnRecoverable[0] = totalOperatingUnRecColumnName;
                //         totalOperatingExpUnRecoverable[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		totalOperatingExpUnRecoverable[2] = '14';
				// 		totalOperatingExpUnRecoverable[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.totalOperatingExpUnRecoverable = totalOperatingExpUnRecoverable;
				// 	} else if(cells[cellIndex].toLowerCase() === totalExpensesColumnName.toLowerCase()) {
                //         var totalExpenses = [];
                //         totalExpenses[0] = totalExpensesColumnName;
                //         totalExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		totalExpenses[2] = '15';
				// 		totalExpenses[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.totalExpenses = totalExpenses;
				// 	} else if(cells[cellIndex].toLowerCase() === cashFlowNetIncomeColumnName.toLowerCase()) {
                //         var cashFlowNetIncome = [];
                //         cashFlowNetIncome[0] = cashFlowNetIncomeColumnName;
                //         cashFlowNetIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
				// 		cashFlowNetIncome[2] = '16';
				// 		cashFlowNetIncome[3] = Common.DATA_TYPE.CURRENCY;
                //         incomeExpense.cashFlowNetIncome = cashFlowNetIncome;
				// 	}
				// }
			}
		}

		if(Object.keys(incomeExpense).length !== 0){
			incomeExpense.IEYear[2] = (count++).toString();
			result2.push(incomeExpense);
		}
	});

	// return result2;
	// console.log("umar here 001: ",JSON.stringify(result2));
	cb(result2)
}
