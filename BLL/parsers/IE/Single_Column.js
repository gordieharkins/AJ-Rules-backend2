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

module.exports = SingleColumn;

function SingleColumn(){
    
}

SingleColumn.prototype.parseFile = function (fileBuffer, fileName, originalFileName){

    var targetColumn = "Total";
	var baseRentIncomeCol = "Base Rent Income";
    var totalRentIncomeCol = "Total Rent Income";
    var totalOtherIncomeCol = "Total Other Income";
	var totalIncomeCol = "Total Income";
	var totalPayrollCol = "Total Payroll";
    var totalMarketingCol = "Total Marketing";
    var totalGeneralAdminCol = "Total General & Administration";
    var totalManagementFeesCol = "Total Management Fees";
    var totalLandscapingGroundsCol = "Total Landscaping/Grounds";
    var totalRedecoratingCol = "Total Redecorating";
    var totalGeneralRMCol = "Total General R&M";
    var totalJanitorialCol = "Total Janitorial";
    var totalSecurityCol = "Total Security";
    var totalUtilitiesCol = "Total Utilities";
    var totalInsuranceCol = "Total Insurance";
    var totalTaxesCol = "Total Taxes";
    var totalReimbursableExpenseCol = "Total Reimbursable Expense";
    var totalNonReimbExpensesCol = "Total Non-Reimb Expenses - LL";
    var totalOperatingExpensesCol = "Total Operating Expenses";
    var netOperatingIncCol = "Net Operatg Inc/(Net Operating Loss)";
    var totalDebtCostsCol = "Total Debt Costs";
    var noiAfterDebtCostsCol = "NOI/(NOL) After Debt Costs";
    var totalOwnershipExpenseCol = "Total Ownership Expense";
    var noiAfterDebtOwnerExpCol = "NOI/(NOL) After Debt & Owner Exp";
    var totalAmortCol = "Total Amort/Deprec/Apprec";
    var netIncomeCol = "Net Income/(Net Loss)";

	var result = [];
    
    var workbook = XLSX.read(fileBuffer, {type: 'buffer'});
    
    workbook.SheetNames.forEach(function(sheetName){
        
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        
        if (csv.length > 0){

            var incomeExpense = {};
			incomeExpense.address = null;
            incomeExpense.IEYear = null;
            incomeExpense.totalPropertyTaxes = null;

            var filesName = [];
			var sheetsName = [];
			var format = [];
			var description = [];
            var type = [];

            var actualColumnIndex = null;
            var actualColumnFound = false;
            var isAddressFound = false;
            var isDateFound = false;
            var sequence = 1;
            
			var rows = csv.split("\n");
            
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
            incomeExpense.type = type; 
            
            
            for (var i=0; i<rows.length; i++){

                var cells = rows[i].split("|")
                
                if (cells.length===0){
					continue;
                }

                if (actualColumnFound){
                    
                    for (var j=0; j<cells.length; j++){
                       
                        if (cells[j].toLowerCase().trim() == baseRentIncomeCol.toLowerCase()){
                            
                            var baseRentIncome = [];
                            baseRentIncome[0] = baseRentIncomeCol;
                            baseRentIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            baseRentIncome[2] = (sequence++).toString();
                            baseRentIncome[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.baseRentIncome = baseRentIncome;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalRentIncomeCol.toLowerCase()){
                            
                            var totalRentIncome = [];
                            totalRentIncome[0] = totalRentIncomeCol;
                            totalRentIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalRentIncome[2] = (sequence++).toString();
                            totalRentIncome[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalRentIncome = totalRentIncome;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalOtherIncomeCol.toLowerCase()){
                            
                            var totalOtherIncome = [];
                            totalOtherIncome[0] = totalOtherIncomeCol;
                            totalOtherIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalOtherIncome[2] = (sequence++).toString();
                            totalOtherIncome[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalOtherIncome  = totalOtherIncome;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalIncomeCol.toLowerCase()){
                            
                            var totalIncome = [];
                            totalIncome[0] = totalIncomeCol;
                            totalIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalIncome[2] = (sequence++).toString();
                            totalIncome[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalIncome = totalIncome;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalPayrollCol.toLowerCase()){
                            
                            var  totalPayroll = [];
                            totalPayroll[0] = totalPayrollCol;
                            totalPayroll[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalPayroll[2] = (sequence++).toString();
                            totalPayroll[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalPayroll = totalPayroll;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalMarketingCol.toLowerCase()){
                            
                            var totalMarketing = [];
                            totalMarketing[0] = totalMarketingCol;
                            totalMarketing[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalMarketing[2] = (sequence++).toString();
                            totalMarketing[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalMarketing = totalMarketing;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalGeneralAdminCol.toLowerCase()){
                            
                            var  totalGeneralAdmin = [];
                            totalGeneralAdmin[0] = totalGeneralAdminCol;
                            totalGeneralAdmin[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalGeneralAdmin[2] = (sequence++).toString();
                            totalGeneralAdmin[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalGeneralAdmin = totalGeneralAdmin;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalManagementFeesCol.toLowerCase()){
                            
                            var totalManagementFees = [];
                            totalManagementFees[0] = totalManagementFeesCol;
                            totalManagementFees[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalManagementFees[2] = (sequence++).toString();
                            totalManagementFees [3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalManagementFees = totalManagementFees;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalLandscapingGroundsCol.toLowerCase()){
                            
                            var totalLandscapingGrounds = [];
                            totalLandscapingGrounds[0] = totalLandscapingGroundsCol;
                            totalLandscapingGrounds[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalLandscapingGrounds[2] = (sequence++).toString();
                            totalLandscapingGrounds[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalLandscapingGrounds = totalLandscapingGrounds;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalRedecoratingCol.toLowerCase()){
                            
                            var totalRedecorating = [];
                            totalRedecorating[0] = totalRedecoratingCol;
                            totalRedecorating[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalRedecorating[2] = (sequence++).toString();
                            totalRedecorating[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalRedecorating = totalRedecorating;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalGeneralRMCol.toLowerCase()){
                            
                            var totalGeneralRM = [];
                            totalGeneralRM[0] = totalGeneralRMCol;
                            totalGeneralRM[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalGeneralRM[2] = (sequence++).toString();
                            totalGeneralRM[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalGeneralRM = totalGeneralRM;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalJanitorialCol.toLowerCase()){
                            
                            var totalJanitorial = [];
                            totalJanitorial[0] = totalJanitorialCol;
                            totalJanitorial[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalJanitorial[2] = (sequence++).toString();
                            totalJanitorial[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalJanitorial = totalJanitorial;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalSecurityCol.toLowerCase()){
                            
                            var totalSecurity = [];
                            totalSecurity[0] = totalSecurityCol;
                            totalSecurity[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalSecurity[2] = (sequence++).toString();
                            totalSecurity[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalSecurity = totalSecurity;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalUtilitiesCol.toLowerCase()){
                            
                            var totalUtilities = [];
                            totalUtilities[0] = totalUtilitiesCol;
                            totalUtilities[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalUtilities[2] = (sequence++).toString();
                            totalUtilities[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalUtilities = totalUtilities;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalInsuranceCol.toLowerCase()){
                            
                            var totalInsurance = [];
                            totalInsurance[0] = totalInsuranceCol;
                            totalInsurance[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalInsurance[2] = (sequence++).toString();
                            totalInsurance[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalInsurance = totalInsurance;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalTaxesCol.toLowerCase()){
                            
                            var totalTaxes = [];
                            totalTaxes[0] = totalTaxesCol;
                            totalTaxes[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalTaxes[2] = (sequence++).toString();
                            totalTaxes[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalTaxes = totalTaxes;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalReimbursableExpenseCol.toLowerCase()){
                            
                            var totalReimbursableExpense = [];
                            totalReimbursableExpense[0] = totalReimbursableExpenseCol;
                            totalReimbursableExpense[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalReimbursableExpense[2] = (sequence++).toString();
                            totalReimbursableExpense[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalReimbursableExpense = totalReimbursableExpense;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalNonReimbExpensesCol.toLowerCase()){
                            
                            var totalNonReimbExpenses = [];
                            totalNonReimbExpenses[0] = totalNonReimbExpensesCol;
                            totalNonReimbExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalNonReimbExpenses[2] = (sequence++).toString();
                            totalNonReimbExpenses[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalNonReimbExpenses = totalNonReimbExpenses;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalOperatingExpensesCol.toLowerCase()){
                            
                            var totalOperatingExpenses = [];
                            totalOperatingExpenses[0] = totalOperatingExpensesCol;
                            totalOperatingExpenses[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalOperatingExpenses[2] = (sequence++).toString();
                            totalOperatingExpenses[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalOperatingExpenses = totalOperatingExpenses;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == netOperatingIncCol.toLowerCase()){
                            
                            var netOperatingInc = [];
                            netOperatingInc[0] = netOperatingIncCol;
                            netOperatingInc[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            netOperatingInc[2] = (sequence++).toString();
                            netOperatingInc[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.netOperatingInc = netOperatingInc;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalDebtCostsCol.toLowerCase()){
                            
                            var totalDebtCosts = [];
                            totalDebtCosts[0] = totalDebtCostsCol;
                            totalDebtCosts[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalDebtCosts[2] = (sequence++).toString();
                            totalDebtCosts[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalDebtCosts = totalDebtCosts;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == noiAfterDebtCostsCol.toLowerCase()){
                            
                            var noiAfterDebtCosts = [];
                            noiAfterDebtCosts[0] = noiAfterDebtCostsCol;
                            noiAfterDebtCosts[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            noiAfterDebtCosts[2] = (sequence++).toString();
                            noiAfterDebtCosts[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.noiAfterDebtCosts = noiAfterDebtCosts;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalOwnershipExpenseCol.toLowerCase()){
                            
                            var totalOwnershipExpense = [];
                            totalOwnershipExpense[0] = totalOwnershipExpenseCol;
                            totalOwnershipExpense[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalOwnershipExpense[2] = (sequence++).toString();
                            totalOwnershipExpense[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalOwnershipExpense = totalOwnershipExpense;
                            continue;
                        }
                        
                        if (cells[j].toLowerCase().trim() == noiAfterDebtOwnerExpCol.toLowerCase()){
                            
                            var noiAfterDebtOwnerExp = [];
                            noiAfterDebtOwnerExp[0] = noiAfterDebtOwnerExpCol;
                            noiAfterDebtOwnerExp[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            noiAfterDebtOwnerExp[2] = (sequence++).toString();
                            noiAfterDebtOwnerExp[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.noiAfterDebtOwnerExp = noiAfterDebtOwnerExp;
                            continue;
                        }

                        if (cells[j].toLowerCase().trim() == totalAmortCol.toLowerCase()){
                            
                            var totalAmort = [];
                            totalAmort[0] = totalAmortCol;
                            totalAmort[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            totalAmort[2] = (sequence++).toString();
                            totalAmort[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.totalAmort = totalAmort;
                            continue;
                        }
                        
                        if (cells[j].toLowerCase().trim() == netIncomeCol.toLowerCase()){
                            
                            var netIncome = [];
                            netIncome[0] = netIncomeCol;
                            netIncome[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            netIncome[2] = (sequence++).toString();
                            netIncome[3] = Common.DATA_TYPE.CURRENCY;
                            incomeExpense.netIncome = netIncome;
                            continue;
                        }
                    }
                    continue;
                }

                
                if (!isAddressFound){

                    for (var j=0; j<cells.length; j++){

                        if (cells[j]){
                            var address = [];
                            address[0] = ADDRESS_LABEL;
                            address[1] = cells[j].substring(0,cells[j].indexOf("(")).trim();
                            incomeExpense.address = address;
                            isAddressFound = true;
                            break;
                        }
                    }
                    continue;
                }

                if (!isDateFound){

                    for (var j=0; j<cells.length; j++){

						if (cells[j].toLowerCase().indexOf("period") > -1){
                            
                            var date =[];
							date[0] = DATE_LABEL;
							// date[1] = cells[j].substr(cells[j].indexOf("=")+1, cells[j.length]).trim();
                            var tempDate = cells[j].split(" ");
                            date[1] = tempDate[tempDate.length-1];

							incomeExpense.IEYear = date;
            				isDateFound = true;
            				break;
						}
                    }
                    // console.log(incomeExpense.IEYear);
                    continue;
                }

                if (!actualColumnFound){

					for (var j = 0; j < cells.length; j++){
                        
						if (cells[j].toLowerCase().trim() === targetColumn.toLowerCase()){

							actualColumnIndex = j;
                            actualColumnFound = true;
							break;
						}
                    }
                    continue;
                }

            }

            incomeExpense.IEYear[2] = (sequence++).toString();
            if (Object.keys(incomeExpense).length !== 0){
				result.push(incomeExpense);
			}
        }
    });

    return result;
}

