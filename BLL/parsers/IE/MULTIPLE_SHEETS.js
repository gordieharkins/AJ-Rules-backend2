const ADDRESS_LABEL = "Address";
const DATE_LABEL = "Income Expense Statement of";
const FILE_PATH_LABEL = "File Path";
const FILE_NAME_LABEL = "File Name";
const SHEET_NAME_LABEL = "Sheet Name";
const FORMAT_LABEL = "Format";
const DESCRIPTION_LABEL = "Description";
const TYPE_LABEL = "File Type";
const ORIGINAL_FILE_NAME = 'Original File Name';

const FILE_FORMAT = "YARDI";
const FILE_TYPE = "Income Expense Statement";

var path = require('path');
var Common = require(path.resolve(__dirname, './common'));
var UtilityFunctions = require(path.resolve(__dirname, '../../util/functions'));
var util = new UtilityFunctions();

module.exports = MultipleSheet;

// Class Constructor
function MultipleSheet() {

}

MultipleSheet.prototype.parseFile = function(fileBuffer, fileName, originalFileName) {
    var sheet3ColumnName = "YTD";
    var rentalIncomeColumnName = "Rental Income";
    var totalIncomeColumnName = "Total Income";
    var totalUtilitiesColumnName = "Utilities";
    var totalAdministrativeColumnName = "Administrative";
    var realEstateTaxesColumnName = "Taxes  -  real estate";
    var totalExpensesColumnName = "Total Expenses";
    var cashFlowNetIncomeColumnName = "Net Income (Loss)";
    var totalBuildingRepairsColumnName = "Outside Maintenance";
    var totalCommonAreaMaintenanceColumnName = "Repairs and Maintenance";
    var totalTaxesAndInsuranceColumnName = "Taxes and Insurance";
    var statementOfOperations = "statement of operations (cash)";
    var actual = "Actual";
    var schOfExp = "sch of exp";
    var statement = "stmt";
    var actualColumnIndex = null;
    var tempIncomeExpense = {};
    var result = [];
    var workbook = XLSX.read(fileBuffer, {type: 'buffer'});

    workbook.SheetNames.forEach(function(sheetName) {
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        if (csv.length > 0) {
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
            sheetsName[1] = sheetName
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

            var rows = csv.split("\n");
            var actualColumnsFound = false;
            var isAddressFound = false;
            var isDateFound = false;
            var addressIndex = -1;

            for (var index = 0; index < rows.length; index++) {
                var cells = rows[index].toLowerCase().split("|");

                if (cells.length === 0) {
                	continue;
                }

                if (!isAddressFound) {
                    addressIndex = cells.indexOf(statementOfOperations);
                    if (addressIndex > -1) {
                        var address = [];
                        address[0] = ADDRESS_LABEL;
                        address[1] = rows[index - 1].split("|")[addressIndex];
                        incomeExpense.address = address;
                        isAddressFound = true;
                    }
                }

                if(!isDateFound) {		
                	if(addressIndex > -1) {
                        var date = [];
                        date[0] = DATE_LABEL;
                		date[1] = rows[index + 1].split("|")[addressIndex];
                        date[1] = date[1].split(" ");
                        date[1] = date[1][date[1].length - 1];
                        date[2] = '11';
                        incomeExpense.IEYear = date;
                        isDateFound = true;
                	}
                }

                if (!actualColumnsFound) {
                    for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                        var cellValue = cells[cellIndex];
                        if (cellValue.toLowerCase().trim() === sheet3ColumnName.toLowerCase()) {

                            var cellNextRow = rows[index + 1].split("|");
                            cellValue = cellNextRow[cellIndex];
                            if (cellValue.toLowerCase().trim() === actual.toLowerCase()) {
                                actualColumnIndex = cellIndex;
                                actualColumnsFound = true;
                                break;
                            }
                        }
                    }
                }

                if (actualColumnsFound) {
                    if (sheetName == statement) {
                        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                            var valueCell = cells[cellIndex].toLowerCase().trim();
                            if (valueCell === rentalIncomeColumnName.toLowerCase()) {
                                var rentalIncome = [];
                                rentalIncome[0] = rentalIncomeColumnName;
                                rentalIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                                rentalIncome[2] = '1';
                                rentalIncome[3] = Common.DATA_TYPE.CURRENCY;;
                                incomeExpense.rentalIncome = rentalIncome;
                            } else if (valueCell === totalIncomeColumnName.toLowerCase()) {
                                var totalIncome = [];
                                totalIncome[0] = totalIncomeColumnName;
                                totalIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                                totalIncome[2] = '2';
                                totalIncome[3] = Common.DATA_TYPE.CURRENCY;;
                                incomeExpense.totalIncome = totalIncome;
                            } else if (valueCell === totalUtilitiesColumnName.toLowerCase()) {
                                var totalUtilities = [];
                                totalUtilities[0] = totalUtilitiesColumnName;
                                totalUtilities[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                                totalUtilities[2] = '4';
                                totalUtilities[3] = Common.DATA_TYPE.CURRENCY;;
                                incomeExpense.totalUtilities = totalUtilities;
                            } else if (valueCell === totalBuildingRepairsColumnName.toLowerCase()) {
                                var totalBuildingRepairs = [];
                                totalBuildingRepairs[0] = totalBuildingRepairsColumnName;
                                totalBuildingRepairs[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                                totalBuildingRepairs[2] = '5';
                                totalBuildingRepairs[3] = Common.DATA_TYPE.CURRENCY;;
                                incomeExpense.totalBuildingRepairs = totalBuildingRepairs;
                            } else if (valueCell === totalCommonAreaMaintenanceColumnName.toLowerCase()) {
                                var totalCommonAreaMaintenance = [];
                                totalCommonAreaMaintenance[0] = totalCommonAreaMaintenanceColumnName;
                                totalCommonAreaMaintenance[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                                totalCommonAreaMaintenance[2] = '6';
                                totalCommonAreaMaintenance[3] = Common.DATA_TYPE.CURRENCY;;
                                incomeExpense.totalCommonAreaMaintenance = totalCommonAreaMaintenance
                            } else if (valueCell === totalAdministrativeColumnName.toLowerCase()) {
                                var totalAdministrative = [];
                                totalAdministrative[0] = totalAdministrativeColumnName;
                                totalAdministrative[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                                totalAdministrative[2] = '3';
                                totalAdministrative[3] = Common.DATA_TYPE.CURRENCY;;
                                incomeExpense.totalAdministrative = totalAdministrative;
                            } else if (valueCell === realEstateTaxesColumnName.toLowerCase()) {
                                var realEstateTaxes = [];
                                realEstateTaxes[0] = realEstateTaxesColumnName;
                                realEstateTaxes[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                                realEstateTaxes[2] = '7';
                                realEstateTaxes[3] = Common.DATA_TYPE.CURRENCY;;
                                incomeExpense.realEstateTaxes = realEstateTaxes;
                            } else if (cells[cellIndex].toLowerCase() === totalTaxesAndInsuranceColumnName.toLowerCase()) {
                                var totalTaxesAndInsurance = [];
                                totalTaxesAndInsurance[0] = totalTaxesAndInsuranceColumnName;
                                totalTaxesAndInsurance[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                                totalTaxesAndInsurance[2] = '8';
                                totalTaxesAndInsurance[3] = Common.DATA_TYPE.CURRENCY;;
                                incomeExpense.totalTaxesAndInsurance = totalTaxesAndInsurance;
                            } else if (valueCell === totalExpensesColumnName.toLowerCase()) {
                                var totalExpenses = [];
                                totalExpenses[0] = totalExpensesColumnName;
                                totalExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                                totalExpenses[2] = '9';
                                totalExpenses[3] = Common.DATA_TYPE.CURRENCY;;
                                incomeExpense.totalExpenses = totalExpenses;
                            } else if (valueCell === cashFlowNetIncomeColumnName.toLowerCase()) {
                                var cashFlowNetIncome = [];
                                cashFlowNetIncome[0] = cashFlowNetIncomeColumnName;
                                cashFlowNetIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                                cashFlowNetIncome[2] = '10';
                                cashFlowNetIncome[3] = Common.DATA_TYPE.CURRENCY;;
                                incomeExpense.cashFlowNetIncome = cashFlowNetIncome;
                            }
                        }
                        tempIncomeExpense = incomeExpense;
                    } else if (sheetName === schOfExp) {
                        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                            var valueCell = cells[cellIndex].toLowerCase().trim();
                            if (valueCell === realEstateTaxesColumnName.toLowerCase()) {
                                var realEstateTaxes = [];
                                realEstateTaxes[0] = realEstateTaxesColumnName;
                                realEstateTaxes[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                                tempIncomeExpense.realEstateTaxes = realEstateTaxes;
                            }
                        }
                        result[0] = tempIncomeExpense;
                    }
                }
            }
        }
    });
    JSON.stringify("myresult: ",result);
    // return result;
}
