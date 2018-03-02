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
module.exports = YardiIE17;

//Class Constructor 
function YardiIE17() {

}

YardiIE17.prototype.parseFile = function (fileBuffer, fileName, originalFileName) {
    var yardiColumnName = "Year to Date";
    var netRentalRevenueColumnName = "NET RENTAL REVENUE";
    var totalTenantServicesColumnName = "TOTAL TENANT SERVICES";
    var totalPassthroughIncomeColumnName = "TOTAL PASSTHROUGH INCOME";
    var totalOtherRevenueColumnName = "TOTAL OTHER REVENUE";
    var totalRevenueColumnName = "TOTAL REVENUE";
    var totalManagementFeesColumnName = "TOTAL MANAGEMENT FEE EXPENSE";
    var totalCompensationFeesColumnName = "TOTAL COMPENSATION EXPENSE";
    var totalSuppliesExpensesColumnName = "TOTAL SUPPLIES EXPENSE";
    var totalContractServicesColumnName = "TOTAL CONTRACT SERVICES";
    var totalRepairsMentainanceColumnName = "TOTAL REPAIRS & MAINTENANCE";
    var totalUtilitiesExpensesColumnName = "TOTAL UTILITIES EXPENSE";
    var totalMarketingExpensesColumnName = "TOTAL MARKETING EXPENSE";
    var totalProfessionalServicesColumnName = "TOTAL PROFESSIONAL SERVICES";
    var totalAdministrativeExpensesColumnName = "TOTAL ADMINISTRATIVE EXPENSE";
    var totalInsuranceExpensesColumnName = "TOTAL INSURANCE EXPENSE";
    var totalTaxFeesColumnName = "TOTAL TAXES & FEES";
    var totalNonContrableColumnName = "TOTAL NON-CONTROLLABLE EXPENSE";
    var totalTenantOpertingExpensesColumnName = "TOTAL TENANT OPERATING EXPENSE";
    var totalNonRecoverableExpensesColumnName = "TOTAL NON-RECOVERABLE EXPENSE";
    var totalOwnerOperatingExpensesColumnName = "TOTAL OWNER OPERATING EXPENSE";
    var netOperatingIncomeColumnName = "NET OPERATING INCOME (LOSS)";
    var totalOtherIncomeColumnName = "TOTAL OTHER INCOME / (EXP)";
    var netIncomeColumnName = "NET INCOME";
    var actualColumnIndex = null;
    var result = [];

    var workbook = XLSX.read(fileBuffer, {type: 'buffer'});
    workbook.SheetNames.forEach(function(sheetName) {
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);

        if (csv.length > 0) {
            // IE object
            var incomeExpense = {};
            incomeExpense.address = null;
            incomeExpense.IEYear = null;
            incomeExpense.totalPropertyTaxes = null;

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
            
            var actualColumnsFound = false;
            var rows = csv.split("\n");
            var isAddressFound = false;
			var isDateFound = false;
            var sequence = 1;
            for (var index = 0; index < rows.length; index++) {
                // Get cells
                var cells = rows[index].toLowerCase().split("|");
                if (cells.length === 0) {
                    continue;
                }

                // check if address found or not.
                if (!isAddressFound) {
                    for(cellIndex = 0; cellIndex < cells.length; cellIndex++){
                        var cellValue = cells[cellIndex];
                        if(cellValue.indexOf("income") > -1){
                            var address = [];
                            address[0] = ADDRESS_LABEL;
                            address[0] = rows[index - 1].split("|")[cellIndex];
                            incomeExpense.address = address;
                            isAddressFound = true;
                            break;
                        }
                    }
                }

                // check if Date found or not.
                if (!isDateFound) {
                    for(cellIndex = 0; cellIndex < cells.length; cellIndex++){
                        var cellValue = cells[cellIndex];
                        if(cellValue.indexOf("period") > -1){
                            var date = [];
                            date[0] = DATE_LABEL;
                            date[1] = cellValue;
                            date[1] = date[1].split(" ");
                            date[1] = date[1][date[1].length - 1];
                            incomeExpense.IEYear = date;
                            isDateFound = true;
                            break;
                        }
                    }
                }

                if (!actualColumnsFound) {
                    for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                        var cellValue = cells[cellIndex];
                        if (cellValue.toLowerCase().trim() === yardiColumnName.toLowerCase()) {
                            actualColumnIndex = cellIndex;
                            actualColumnsFound = true;
                            break;
                        }
                    }
                }

                if (!actualColumnsFound) {
                    continue;
                }

                for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                    var valueCell = cells[cellIndex].toLowerCase().trim();
                    if(valueCell === netRentalRevenueColumnName.toLowerCase()) {
                        var netRentalRevenue = [];
                        netRentalRevenue[0] = netRentalRevenueColumnName;
                        netRentalRevenue[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        netRentalRevenue[2] = (sequence++).toString();
                        netRentalRevenue[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.netRentalRevenue = netRentalRevenue;
                    } else if(valueCell === totalTenantServicesColumnName.toLowerCase()) {
                        var totalTenantServices = [];
                        totalTenantServices[0] = totalTenantServicesColumnName;
                        totalTenantServices[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalTenantServices[2] = (sequence++).toString();
                        totalTenantServices[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalTenantServices = totalTenantServices;
                    } else if(valueCell === totalPassthroughIncomeColumnName.toLowerCase()) {
                        var totalPassthroughIncome = [];
                        totalPassthroughIncome[0] = totalPassthroughIncomeColumnName;
                        totalPassthroughIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalPassthroughIncome[2] = (sequence++).toString();
                        totalPassthroughIncome[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalPassthroughIncome = totalPassthroughIncome;
                    } else if(valueCell === totalOtherRevenueColumnName.toLowerCase()) {
                        var totalOtherRevenue = [];
                        totalOtherRevenue[0] = totalOtherRevenueColumnName;
                        totalOtherRevenue[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalOtherRevenue[2] = (sequence++).toString();
                        totalOtherRevenue[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalOtherRevenue = totalOtherRevenue;
                    } else if(valueCell === totalRevenueColumnName.toLowerCase()) {
                        var totalRevenue = [];
                        totalRevenue[0] = totalRevenueColumnName;
                        totalRevenue[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalRevenue[2] = (sequence++).toString();
                        totalRevenue[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalRevenue = totalRevenue;
                    } else if(valueCell === totalManagementFeesColumnName.toLowerCase()) {
                        var totalManagementFees = [];
                        totalManagementFees[0] = totalManagementFeesColumnName;
                        totalManagementFees[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalManagementFees[2] = (sequence++).toString();
                        totalManagementFees[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalManagementFees = totalManagementFees;
                    } else if(valueCell === totalCompensationFeesColumnName.toLowerCase()) {
                        var totalCompensationFees = [];
                        totalCompensationFees[0] = totalCompensationFeesColumnName;
                        totalCompensationFees[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalCompensationFees[2] = (sequence++).toString();
                        totalCompensationFees[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.baseRent = totalCompensationFees;
                    } else if(valueCell === totalSuppliesExpensesColumnName.toLowerCase()) {
                        var totalSuppliesExpenses = [];
                        totalSuppliesExpenses[0] = totalSuppliesExpensesColumnName;
                        totalSuppliesExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalSuppliesExpenses[2] = (sequence++).toString();
                        totalSuppliesExpenses[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalSuppliesExpenses = totalSuppliesExpenses;
                    } else if(valueCell === totalContractServicesColumnName.toLowerCase()) {
                        var totalContractServices = [];
                        totalContractServices[0] = totalContractServicesColumnName;
                        totalContractServices[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalContractServices[2] = (sequence++).toString();
                        totalContractServices[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalContractServices = totalContractServices;
                    } else if(valueCell === totalRepairsMentainanceColumnName.toLowerCase()) {
                        var totalRepairsMentainance = [];
                        totalRepairsMentainance[0] = totalRepairsMentainanceColumnName;
                        totalRepairsMentainance[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalRepairsMentainance[2] = (sequence++).toString();
                        totalRepairsMentainance[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalRepairsMentainance = totalRepairsMentainance;
                    } else if(valueCell === totalUtilitiesExpensesColumnName.toLowerCase()) {
                        var totalUtilitiesExpenses = [];
                        totalUtilitiesExpenses[0] = totalUtilitiesExpensesColumnName;
                        totalUtilitiesExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalUtilitiesExpenses[2] = (sequence++).toString();
                        totalUtilitiesExpenses[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalUtilitiesExpenses = totalUtilitiesExpenses;
                    } else if(valueCell === totalMarketingExpensesColumnName.toLowerCase()) {
                        var totalMarketingExpenses = [];
                        totalMarketingExpenses[0] = totalMarketingExpensesColumnName;
                        totalMarketingExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalMarketingExpenses[2] = (sequence++).toString();
                        totalMarketingExpenses[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalMarketingExpenses = totalMarketingExpenses;
                    } else if(valueCell === totalProfessionalServicesColumnName.toLowerCase()) {
                        var totalProfessionalServices = [];
                        totalProfessionalServices[0] = totalProfessionalServicesColumnName;
                        totalProfessionalServices[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalProfessionalServices[2] = (sequence++).toString();
                        totalProfessionalServices[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalProfessionalServices = totalProfessionalServices;
                    } else if(valueCell === totalAdministrativeExpensesColumnName.toLowerCase()) {
                        var totalAdministrativeExpenses = [];
                        totalAdministrativeExpenses[0] = totalAdministrativeExpensesColumnName;
                        totalAdministrativeExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalAdministrativeExpenses[2] = (sequence++).toString();
                        totalAdministrativeExpenses[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalAdministrativeExpenses = totalAdministrativeExpenses;
                    } else if(valueCell === totalInsuranceExpensesColumnName.toLowerCase()) {
                        var totalInsuranceExpenses = [];
                        totalInsuranceExpenses[0] = totalInsuranceExpensesColumnName;
                        totalInsuranceExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalInsuranceExpenses[2] = (sequence++).toString();
                        totalInsuranceExpenses[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalInsuranceExpenses = totalInsuranceExpenses;
                    } else if(valueCell === totalTaxFeesColumnName.toLowerCase()) {
                        var totalTaxFees = [];
                        totalTaxFees[0] = totalTaxFeesColumnName;
                        totalTaxFees[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalTaxFees[2] = (sequence++).toString();
                        totalTaxFees[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalTaxFees = totalTaxFees;
                    } else if(valueCell === totalNonContrableColumnName.toLowerCase()) {
                        var totalNonContrable = [];
                        totalNonContrable[0] = totalNonContrableColumnName;
                        totalNonContrable[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalNonContrable[2] = (sequence++).toString();
                        totalNonContrable[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalNonContrable = totalNonContrable;
                    } else if(valueCell === totalTenantOpertingExpensesColumnName.toLowerCase()) {
                        var totalTenantOpertingExpenses = [];
                        totalTenantOpertingExpenses[0] = totalTenantOpertingExpensesColumnName;
                        totalTenantOpertingExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalTenantOpertingExpenses[2] = (sequence++).toString();
                        totalTenantOpertingExpenses[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalTenantOpertingExpenses = totalTenantOpertingExpenses;
                    } else if(valueCell === totalNonRecoverableExpensesColumnName.toLowerCase()) {
                        var totalNonRecoverableExpenses = [];
                        totalNonRecoverableExpenses[0] = totalNonRecoverableExpensesColumnName;
                        totalNonRecoverableExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalNonRecoverableExpenses[2] = (sequence++).toString();
                        totalNonRecoverableExpenses[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalNonRecoverableExpenses = totalNonRecoverableExpenses;
                    } else if(valueCell === totalOwnerOperatingExpensesColumnName.toLowerCase()) {
                        var totalOwnerOperatingExpenses = [];
                        totalOwnerOperatingExpenses[0] = totalOwnerOperatingExpensesColumnName;
                        totalOwnerOperatingExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalOwnerOperatingExpenses[2] = (sequence++).toString();
                        totalOwnerOperatingExpenses[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalOwnerOperatingExpenses = totalOwnerOperatingExpenses;
                    } else if(valueCell === netOperatingIncomeColumnName.toLowerCase()) {
                        var netOperatingIncome = [];
                        netOperatingIncome[0] = netOperatingIncomeColumnName;
                        netOperatingIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        netOperatingIncome[2] = (sequence++).toString();
                        netOperatingIncome[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.netOperatingIncome = netOperatingIncome;
                    } else if(valueCell === totalOtherIncomeColumnName.toLowerCase()) {
                        var totalOtherIncome = [];
                        totalOtherIncome[0] = totalOtherIncomeColumnName;
                        totalOtherIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        totalOtherIncome[2] = (sequence++).toString();
                        totalOtherIncome[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.totalOtherIncome = totalOtherIncome;
                    } else if(valueCell === netIncomeColumnName.toLowerCase()) {
                        var netIncome = [];
                        netIncome[0] = netIncomeColumnName;
                        netIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                        netIncome[2] = (sequence++).toString();
                        netIncome[3] = Common.DATA_TYPE.CURRENCY;
                        incomeExpense.netIncome = netIncome;
                    } 
                }
            }
        }

        if(incomeExpense.totalTaxFees !== null){
            incomeExpense.totalOtherIncome[1] = (parseFloat(incomeExpense.totalOtherIncome[1]) - parseFloat(incomeExpense.totalTaxFees[1])).toString();
            incomeExpense.totalTenantOpertingExpenses[1] = (parseFloat(incomeExpense.totalTenantOpertingExpenses[1]) - parseFloat(incomeExpense.totalTaxFees[1])).toString();
            incomeExpense.netIncome[1] = (parseFloat(incomeExpense.netIncome[1]) + parseFloat(incomeExpense.totalTaxFees[1])).toString();
        }

        

        incomeExpense.IEYear[2] = (sequence++).toString();

        if(Object.keys(incomeExpense).length !== 0){
            result.push(incomeExpense);
        }
    });

    return result;
}
