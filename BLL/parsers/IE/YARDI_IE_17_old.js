// const ADDRESS_LABEL = "Address";
// const DATE_LABEL = "Income Expense Statement of";
// const FILE_PATH_LABEL = "File Path";
// const FILE_NAME_LABEL = "File Name";
// const SHEET_NAME_LABEL = "Sheet Name";
// const FORMAT_LABEL = "Format";
// const DESCRIPTION_LABEL = "Description";
// const TYPE_LABEL = "File Type";

// const FILE_FORMAT = "YARDI";
// const FILE_TYPE = "Income Expense Statement";

// var path = require('path');
// var Common = require(path.resolve(__dirname, './common'));
// var UtilityFunctions = require(path.resolve(__dirname, '../../util/functions'));
// var util = new UtilityFunctions();
// module.exports = YardiIE17;

// //Class Constructor 
// function YardiIE17() {

// }

// YardiIE17.prototype.parseFile = function (file) {
//     var yardiColumnName = "Year to Date";
//     var baseRentColumnName = "Base Rental Income";
//     var rentalIncomeColumnName = "Total Rental Income";
//     var misIncomeColumnName = "Miscellaneous Income";
//     var parkingIncomeColumnName = "Parking Income";
//     var totalIncomeColumnName = "Total Income";
//     var totalPersonnelColumnName = "Total Payroll";
//     var totalUtilitiesColumnName = "Total Utilities";
//     var totalAdministrativeColumnName = "Total Administrative Expenses";
//     var realEstateTaxesColumnName = "Total Real Estate Taxes";
//     var totalExpensesColumnName = "Total Property Expenses";
//     var cashFlowNetIncomeColumnName = "Net Income";
//     var totalBuildingRepairsColumnName = "Total Building Repairs & Maintenance";
//     var totalJanitorialColumnName = "Total Janitorial";
//     var totalCommonAreaMaintenanceColumnName = "Total Common Area Maintenance";
//     var totalInsuraceColumnName = "Total Insurance";
//     var propertyTaxes = "Property Taxes";
//     var totalManagementFeesColumnName = "Total Property Management Fees";
//     var totalMarketingExpensesColumnName = "Total Marketing Expenses";
//     var totalRevenuesColumnName = "Total Revenues";
//     var actualColumnIndex = null;
//     var filePath = file;
//     var fileName = path.basename(file);
//     var result = [];

//     var workbook = XLSX.readFile(file);
//     workbook.SheetNames.forEach(function(sheetName) {
//         var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);

//         if (csv.length > 0) {
//             // IE object
//             var incomeExpense = {};
//             incomeExpense.address = null;
//             incomeExpense.IEYear = null;
//             incomeExpense.totalPropertyTaxes = null;

//             var filesPath = [];
//             var filesName = [];
//             var sheetsName = [];
//             var format = [];
//             var description = [];
//             var type = [];

//             filesPath[0] = FILE_PATH_LABEL;
//             filesPath[1] = filePath;
//             incomeExpense.filePath = filesPath;

//             filesName[0] = FILE_NAME_LABEL;
//             filesName[1] = fileName;
//             incomeExpense.fileName = filesName;

//             sheetsName[0] = SHEET_NAME_LABEL;
//             sheetsName[1] = sheetName;
//             incomeExpense.sheetName = sheetsName;

//             format[0] = FORMAT_LABEL;
//             format[1] = FILE_FORMAT;
//             incomeExpense.format = format;

//             description[0] = DESCRIPTION_LABEL;
//             description[1] = "";
//             incomeExpense.description = description;

//             type[0] = TYPE_LABEL;
//             type[1] = FILE_TYPE;
//             incomeExpense.type = type; //for danyal's filters on frontend
            
//             var actualColumnsFound = false;
//             var rows = csv.split("\n");
//             var isAddressFound = false;
// 			var isDateFound = false;

//             for (var index = 0; index < rows.length; index++) {
//                 // Get cells
//                 var cells = rows[index].toLowerCase().split("|");
//                 if (cells.length === 0) {
//                     continue;
//                 }

//                 // check if address found or not.
//                 if (!isAddressFound) {
//                     for(cellIndex = 0; cellIndex < cells.length; cellIndex++){
//                         var cellValue = cells[cellIndex];
//                         if(cellValue.indexOf("income") > -1){
//                             var address = [];
//                             address[0] = ADDRESS_LABEL;
//                             address[0] = rows[index - 1].split("|")[cellIndex];
//                             incomeExpense.address = address;
//                             isAddressFound = true;
//                             break;
//                         }
//                     }
//                 }

//                 // check if Date found or not.
//                 if (!isDateFound) {
//                     for(cellIndex = 0; cellIndex < cells.length; cellIndex++){
//                         var cellValue = cells[cellIndex];
//                         if(cellValue.indexOf("period") > -1){
//                             var date = [];
//                             date[0] = DATE_LABEL;
//                             date[1] = cellValue;
//                             date[1] = date[1].split(" ");
//                             date[1] = date[1][date[1].length - 1];
//                             date[2] = '20';
//                             incomeExpense.IEYear = date;
//                             isDateFound = true;
//                             break;
//                         }
//                     }
//                 }

//                 if (!actualColumnsFound) {
//                     for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {
//                         var cellValue = cells[cellIndex];
//                         if (cellValue.toLowerCase().trim() === yardiColumnName.toLowerCase()) {
//                             actualColumnIndex = cellIndex;
//                             actualColumnsFound = true;
//                             break;
//                         }
//                     }
//                 }

//                 if (!actualColumnsFound) {
//                     continue;
//                 }

//                 for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
//                     var valueCell = cells[cellIndex].toLowerCase().trim();
//                     if(valueCell === baseRentColumnName.toLowerCase()) {
//                         var baseRent = [];
//                         baseRent[0] = baseRentColumnName;
//                         baseRent[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         baseRent[2] = '1';
//                         baseRent[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.baseRent = baseRent;
//                     } else if(valueCell === rentalIncomeColumnName.toLowerCase()) {
//                         var rentalIncome = [];
//                         rentalIncome[0] = rentalIncomeColumnName;
//                         rentalIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         rentalIncome[2] = '2';
//                         rentalIncome[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.rentalIncome = rentalIncome;
//                     } else if(valueCell === misIncomeColumnName.toLowerCase()) {
//                         var miscellaneousIncome = [];
//                         miscellaneousIncome[0] = misIncomeColumnName;
//                         miscellaneousIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         miscellaneousIncome[2] = '3';
//                         miscellaneousIncome[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.miscellaneousIncome = miscellaneousIncome;
//                     } else if(valueCell === parkingIncomeColumnName.toLowerCase()) {
//                         var parkingIncome = [];
//                         parkingIncome[0] = parkingIncomeColumnName;
//                         parkingIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         parkingIncome[2] = '4';
//                         parkingIncome[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.parkingIncome = parkingIncome;
//                     } else if(valueCell === totalIncomeColumnName.toLowerCase()) {
//                         var totalIncome = [];
//                         totalIncome[0] = totalIncomeColumnName;
//                         totalIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalIncome[2] = '5';
//                         totalIncome[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalIncome = totalIncome;
//                     } else if(valueCell === totalPersonnelColumnName.toLowerCase()) {
//                         var totalPersonnel = [];
//                         totalPersonnel[0] = totalPersonnelColumnName;
//                         totalPersonnel[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalPersonnel[2] = '11';
//                         totalPersonnel[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalPersonnel = totalPersonnel;
//                     } else if(valueCell === totalUtilitiesColumnName.toLowerCase()) {
//                         var totalUtilities = [];
//                         totalUtilities[0] = totalUtilitiesColumnName;
//                         totalUtilities[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalUtilities[2] = '10';
//                         totalUtilities[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalUtilities = totalUtilities;
//                     } else if(valueCell === totalBuildingRepairsColumnName.toLowerCase()) {
//                         var totalBuildingRepairs = [];
//                         totalBuildingRepairs[0] = totalBuildingRepairsColumnName;
//                         totalBuildingRepairs[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalBuildingRepairs[2] = '7';
//                         totalBuildingRepairs[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalBuildingRepairs = totalBuildingRepairs;
//                     } else if(valueCell === totalJanitorialColumnName.toLowerCase()) {
//                         var totalJanitorial = [];
//                         totalJanitorial[0] = totalJanitorialColumnName;
//                         totalJanitorial[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalJanitorial[2] = '8';
//                         totalJanitorial[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalJanitorial = totalJanitorial;
//                     } else if(valueCell === totalCommonAreaMaintenanceColumnName.toLowerCase()) {
//                         var totalCommonAreaMaintenance = [];
//                         totalCommonAreaMaintenance[0] = totalCommonAreaMaintenanceColumnName;
//                         totalCommonAreaMaintenance[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalCommonAreaMaintenance[2] = '9';
//                         totalCommonAreaMaintenance[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalCommonAreaMaintenance = totalCommonAreaMaintenance
//                     } else if(valueCell === totalAdministrativeColumnName.toLowerCase()) {
//                         var totalAdministrative = [];
//                         totalAdministrative[0] = totalAdministrativeColumnName;
//                         totalAdministrative[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalAdministrative[2] = '16';
//                         totalAdministrative[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalAdministrative = totalAdministrative;
//                     } else if(valueCell === totalInsuraceColumnName.toLowerCase()) {
//                         var totalTaxesAndInsurance = [];
//                         totalTaxesAndInsurance[0] = totalInsuraceColumnName;
//                         totalTaxesAndInsurance[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalTaxesAndInsurance[2] = '14';
//                         totalTaxesAndInsurance[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalTaxesAndInsurance = totalTaxesAndInsurance;
//                     } else if(valueCell === realEstateTaxesColumnName.toLowerCase()) {
//                         var realEstateTaxes = [];
//                         realEstateTaxes[0] = "Total Other";
//                         realEstateTaxes[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         realEstateTaxes[2] = '13';
//                         realEstateTaxes[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalOther = realEstateTaxes;
//                     } else if(valueCell === totalExpensesColumnName.toLowerCase()) {
//                         var totalExpenses = [];
//                         totalExpenses[0] = totalExpensesColumnName;
//                         totalExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalExpenses[2] = '17';
//                         totalExpenses[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalExpenses = totalExpenses;
//                     } else if(valueCell === cashFlowNetIncomeColumnName.toLowerCase()) {
//                         var cashFlowNetIncome = [];
//                         cashFlowNetIncome[0] = cashFlowNetIncomeColumnName;
//                         cashFlowNetIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         cashFlowNetIncome[2] = '19';
//                         cashFlowNetIncome[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.cashFlowNetIncome = cashFlowNetIncome;
//                     } else if(valueCell === totalManagementFeesColumnName.toLowerCase()) {
//                         var totalManagementFees = [];
//                         totalManagementFees[0] = totalManagementFeesColumnName;
//                         totalManagementFees[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalManagementFees[2] = '12';
//                         totalManagementFees[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalManagementFees = totalManagementFees;
//                     } else if(valueCell === totalMarketingExpensesColumnName.toLowerCase()) {
//                         var totalMarketingExpenses = [];
//                         totalMarketingExpenses[0] = totalMarketingExpensesColumnName;
//                         totalMarketingExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalMarketingExpenses[2] = '15';
//                         totalMarketingExpenses[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalMarketingExpenses = totalMarketingExpenses;
//                     } else if(valueCell === totalRevenuesColumnName.toLowerCase()) {
//                         var totalRevenues = [];
//                         totalRevenues[0] = totalRevenuesColumnName;
//                         totalRevenues[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalRevenues[2] = '6';
//                         totalRevenues[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalRevenues = totalRevenues;
//                     } else if(valueCell === propertyTaxes.toLowerCase()) {
//                         var totalPropertyTaxes = [];
//                         totalPropertyTaxes[0] = propertyTaxes;
//                         totalPropertyTaxes[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
//                         totalPropertyTaxes[2] = '18';
//                         totalPropertyTaxes[3] = Common.DATA_TYPE.CURRENCY;
//                         incomeExpense.totalPropertyTaxes = totalPropertyTaxes;
//                     }
//                 }
//             }
//         }

//         if(incomeExpense.totalPropertyTaxes !== null){
//             incomeExpense.totalOther[1] = (parseFloat(incomeExpense.totalOther[1]) - parseFloat(incomeExpense.totalPropertyTaxes[1])).toString();
//             incomeExpense.totalExpenses[1] = (parseFloat(incomeExpense.totalExpenses[1]) - parseFloat(incomeExpense.totalPropertyTaxes[1])).toString();
//             incomeExpense.cashFlowNetIncome[1] = (parseFloat(incomeExpense.cashFlowNetIncome[1]) + parseFloat(incomeExpense.totalPropertyTaxes[1])).toString();
//         }

//         if(Object.keys(incomeExpense).length !== 0){
//             result.push(incomeExpense);
//         }
//     });

//     return result;
// }
