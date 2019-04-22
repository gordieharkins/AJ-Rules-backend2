var path = require('path');
var Common = require(path.resolve(__dirname, './common'));
var UtilityFunctions = require(path.resolve(__dirname, '../../util/functions'));
var util = new UtilityFunctions();
if(typeof require !== 'undefined') XLSX = require(path.resolve(__dirname, '../xlsx'));

module.exports = yardi121417_RR_1_16_18;

function yardi121417_RR_1_16_18() {

}

// Parses Yardi Tenancy Schedule 2017 files.
yardi121417_RR_1_16_18.prototype.parseFile = function (fileBuffer, fileName, originalFileName) {
	var workbook = XLSX.read(fileBuffer, {type: 'buffer'});
    // //console.log("Umar here in new parser");
    // Columns
	var sheetHeader = "Rent Roll - Lease Charges";
    var asOfColumnName = "Date:";
    
    var unitsColumnName = "Unit(s)";
    var leaseColumnName = "Lease";
    var leaseTypeColumnName = "Lease Type";
    var leaseFromColumnName = "Lease From";
    var leaseToColumnName = "Lease To";
    var securityDepositColumnName = "Security Deposit";
    var letterOfCreditAmountColumnName = "Letter of Credit Amount";
    var amendmentTypeColumnName = "Amendment Type";
    var areaLabelColumnName = "Area Label";
    var areaColumnName = "Area";
    var termColumnName = "Term";
    var amendmentFromColumnName = "Amendment From";
    var amendmentToColumnName = "Amendment To";
    var chargeCodeColumnName = "Charge Code";
    var chargeFromColumnName = "Charge From";
    var chargeToColumnName = "Charge To";
    var monthlyAmountColumnName = "Monthly Amount";
    var mgmtFeeColumnName = "Mgmt Fee";
    var grossAmountColumnName = "Gross Amount";
    var amt_perAreaColumnName = "Amt. per Area";
    var annualizedGrossAmountColumnName = "Annualized Gross Amount";
    var amtPerAreaColumnName= "Amt per Area";



  //Column Numbers
    
    var unitsColumnNumber =  -1;
    var leaseColumnNumber = -1;
    var leaseTypeColumnNumber = -1;
    var leaseFromColumnNumber = -1;
    var leaseToColumnNumber = -1;
    var securityDepositColumnNumber =  -1;
    var letterOfCreditAmountColumnNumber = -1;
    var amendmentTypeColumnNumber =  -1;
    var areaLabelColumnNumber = -1;
    var areaColumnNumber = -1;
    var termColumnNumber =  -1;
    var amendmentFromColumnNumber = -1;
    var amendmentToColumnNumber = -1;
    var chargeCodeColumnNumber = -1;
    var chargeFromColumnNumber = -1;
    var chargeToColumnNumber = -1;
    var monthlyAmountColumnNumber = -1;
    var mgmtFeeColumnNumber = -1;
    var grossAmountColumnNumber = -1;
    var amt_perAreaColumnNumber =  -1;
    var annualizedGrossAmountColumnNumber =  -1;
    var amtPerAreaColumnNumber =  -1;



    var rentRollsList = [];

	workbook.SheetNames.forEach(function(sheetName) {
		var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);


		var vacantRecordIndication = "VACANT";
		var rentRoll = {};
		rentRoll.sheetName = [];
		rentRoll.sheetName[0] = Common.LABEL.SHEET_NAME;
		rentRoll.sheetName[1] = sheetName;

		rentRoll.description = [];
		rentRoll.description[0] = Common.LABEL.DESCRIPTION;
		rentRoll.description[1] = "";

		rentRoll.type = [];
		rentRoll.type[0] = Common.LABEL.TYPE;
		rentRoll.type[1] = "Rent Roll"; // for filters on frontend

        rentRoll.tenants = [];
        rentRoll.parsed = ["Parse Status","true"];
        

		if(csv.length > 0) {
            var rows = csv.split("\n");
            var orderCount = 0;
            for(var index = 0; index < rows.length; index++) { // rows loop ******************
                // //console.log("rows loop");
                var leaseCharge = {};
				var cells=rows[index].split("|");

				if(cells.length === 0) {
					continue;
				}
                if (unitsColumnNumber === -1 || leaseColumnNumber === -1 || leaseTypeColumnNumber === -1 || areaColumnNumber === -1 || leaseFromColumnNumber === -1 || leaseToColumnNumber === -1 || securityDepositColumnNumber === -1 || letterOfCreditAmountColumnNumber === -1 || amendmentTypeColumnNumber === -1 || areaLabelColumnNumber === -1 || termColumnNumber === -1 || amendmentFromColumnNumber === -1 || amendmentToColumnNumber === -1 ||chargeCodeColumnNumber === -1 || chargeFromColumnNumber === -1 || chargeToColumnNumber === -1 || monthlyAmountColumnNumber === -1 || mgmtFeeColumnNumber === -1 || grossAmountColumnNumber === -1 || amt_perAreaColumnNumber === -1 || annualizedGrossAmountColumnNumber ===-1 || amtPerAreaColumnNumber === -1)
                { 
                    //Finding Headers
                    // //console.log("finding headers");
                    for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) { //columns loop ******************
                        var cellValue = cells[cellIndex];
                       
                        if(cellValue.toLowerCase().trim().indexOf(asOfColumnName.toLowerCase().trim())> -1){
                            var asOfIndex = cellValue.toLowerCase().indexOf(asOfColumnName.toLowerCase());
                            var test = cellValue.substring(asOfIndex + asOfColumnName.length + 1);
                            var test2 = test.split(" ");
                                rentRoll.asOfDate = [];
                                rentRoll.asOfDate[0] = Common.LABEL.AS_OF_DATE;
                                rentRoll.asOfDate[1] = util.dateToLong(test2[0]);
                                rentRoll.asOfDate[2] = '1'; // Order (used in front end)
                                rentRoll.asOfDate[3] = Common.DATA_TYPE.DATE;

                                // var test = "Property: oe3620 From Date: 05/31/2017 By Property";
                                // var propertyNameIndex = test.toLowerCase().indexOf("Property:".toLowerCase());
                                // var test1 = test.substring(propertyNameIndex + propertyNameIndex.length + 1);
                                // var test2 = test1.split(" ");


                            
                                var propertyNameIndex = cellValue.toLowerCase().indexOf("Property: ".toLowerCase());
                                var test = cellValue.substring(propertyNameIndex + propertyNameIndex.length + 1);
                                var test2 = test.split(" ");
                                ////console.log("test2: ",test2[1]);
                                rentRoll.propertyName = [];
                                rentRoll.propertyName [0] = "Property Name";
                                rentRoll.propertyName [1] = test2[1];
                            
                        }else if(unitsColumnName.toLowerCase().trim() == cellValue.toLowerCase().trim()) {
                            if (unitsColumnNumber === -1){
                                unitsColumnNumber = cellIndex;
                            }
                            
                        }else if(cellValue.toLowerCase().trim().indexOf("Lease".toLowerCase().trim()) > -1) {
                            var bottomCells=rows[index+1].split("|");
                           if (bottomCells[cellIndex].toLowerCase().trim() == "Type".toLowerCase().trim()){
                                if (leaseTypeColumnNumber === -1){
                                    leaseTypeColumnNumber = cellIndex;
                                }
                                
                            } else if (bottomCells[cellIndex].toLowerCase().trim() == "From".toLowerCase().trim()){
                                if (leaseFromColumnNumber === -1){
                                    leaseFromColumnNumber = cellIndex;
                                }
                                
                            } else if (bottomCells[cellIndex].toLowerCase().trim() == "To".toLowerCase().trim()){
                                if (leaseToColumnNumber === -1){
                                    leaseToColumnNumber = cellIndex;
                                }
                                
                            } else if(cellValue.toLowerCase().trim() == leaseColumnName.toLowerCase().trim()){
                                 if (leaseColumnNumber === -1){
                                     leaseColumnNumber = cellIndex;
                                 }
                            }
                            
                        }
                        /*else if(cellValue.toLowerCase().trim().indexOf("Lease".toLowerCase().trim()) > -1) {
                         
                            if(cellValue.toLowerCase().trim() == leaseColumnName.toLowerCase().trim()){
                                if (leaseColumnNumber === -1){
                                    leaseColumnNumber = cellIndex;
                                }
                                
                            } else if(cellValue.toLowerCase().trim() == leaseTypeColumnName.toLowerCase().trim()){
                                if (leaseTypeColumnNumber === -1){
                                    leaseTypeColumnNumber = cellIndex;
                                }
                                
                            } else if(cellValue.toLowerCase().trim() == leaseFromColumnName.toLowerCase().trim()){
                                if (leaseFromColumnNumber === -1){
                                    leaseFromColumnNumber = cellIndex;
                                }
                                
                            } else if(cellValue.toLowerCase().trim() == leaseToColumnName.toLowerCase().trim()){
                                if (leaseToColumnNumber === -1){
                                    leaseToColumnNumber = cellIndex;
                                }
                                
                            }
                            
                          
                        }*/
                        else if(cellValue.toLowerCase().trim().indexOf("Area".toLowerCase().trim()) > -1) {
                            var bottomCells=rows[index+1].split("|");
                          
                            if (bottomCells[cellIndex].toLowerCase().trim() == ("Label".toLowerCase().trim())){
                                if (areaLabelColumnNumber === -1){
                                    areaLabelColumnNumber = cellIndex;
                                }
                                
                            } else{
                                if (areaColumnNumber === -1){
                                    areaColumnNumber = cellIndex;
                                }
                                
                            }
                        }
                       

                        else if(letterOfCreditAmountColumnName.toLowerCase().trim() == cellValue.toLowerCase().trim()  ) {
                            if (letterOfCreditAmountColumnNumber === -1){
                                letterOfCreditAmountColumnNumber = cellIndex;
                            }
                            
                        }/*
                        else if(cellValue.toLowerCase().trim().indexOf("Monthly".toLowerCase().trim()) > -1) {
                            var bottomCells=rows[index+1].split("|");
                          
                            if (bottomCells[cellIndex].toLowerCase().trim() == ("Rent".toLowerCase().trim())){
                                monthlyRentColumnNumber = cellIndex;
                            } else if (bottomCells[cellIndex].toLowerCase().trim() == "Rent/Area".toLowerCase().trim()){
                                monthlyRentAreaColumnNumber = cellIndex;
                            }
                        }
                        */
                        else if(cellValue.toLowerCase().trim().indexOf("Amendment".toLowerCase().trim()) > -1) {
                            var bottomCells=rows[index+1].split("|");
                          
                            if (bottomCells[cellIndex].toLowerCase().trim() == "Type".toLowerCase().trim()){
                                if (amendmentTypeColumnNumber === -1){
                                    amendmentTypeColumnNumber = cellIndex;
                                }
                                
                            } else if (bottomCells[cellIndex].toLowerCase().trim() == "From".toLowerCase().trim()){
                                if (amendmentFromColumnNumber === -1){
                                    amendmentFromColumnNumber = cellIndex;
                                }
                                
                            } else if (bottomCells[cellIndex].toLowerCase().trim() == "To".toLowerCase().trim()){
                                if (amendmentToColumnNumber === -1){
                                    amendmentToColumnNumber = cellIndex;
                                }
                                
                            }
                            
                        }else if(cellValue.toLowerCase().trim() == "Charge".toLowerCase().trim()){
                            if (chargeCodeColumnNumber === -1){
                                chargeCodeColumnNumber = cellIndex;
                            }
                            
                        }else if(cellValue.toLowerCase().trim() == "Security".toLowerCase().trim()){
                            if (securityDepositColumnNumber === -1){
                                securityDepositColumnNumber = cellIndex;
                            }
                            
                        }else if(cellValue.toLowerCase().trim() == chargeFromColumnName.toLowerCase().trim()){
                            if (chargeFromColumnNumber === -1){
                                chargeFromColumnNumber = cellIndex;
                            }
                            
                        }else if(cellValue.toLowerCase().trim() == chargeToColumnName.toLowerCase().trim()){
                            if (chargeToColumnNumber === -1){
                                chargeToColumnNumber = cellIndex;
                            }
                            
                        }else if(cellValue.toLowerCase().trim() == monthlyAmountColumnName.toLowerCase().trim()){
                            if (monthlyAmountColumnNumber === -1){
                                monthlyAmountColumnNumber = cellIndex;
                            }
                           
                        }else if(cellValue.toLowerCase().trim() == "Mgmt".toLowerCase().trim()){
                            if (mgmtFeeColumnNumber === -1){
                                mgmtFeeColumnNumber = cellIndex;
                            }
                           
                        }else if(cellValue.toLowerCase().trim() == termColumnName.toLowerCase().trim()){
                            if (termColumnNumber === -1){
                                termColumnNumber = cellIndex;
                            }
                           
                        }
                        else if(grossAmountColumnName.toLowerCase().trim() == cellValue.toLowerCase().trim()) {
                            if (grossAmountColumnNumber === -1){
                                grossAmountColumnNumber = cellIndex;
                            }
                            
                        }else if(cellValue.toLowerCase().trim() == "Amt.".toLowerCase().trim()){
                            if (amt_perAreaColumnNumber === -1){
                                amt_perAreaColumnNumber = cellIndex;
                            }
                            
                        }
                        else if(cellValue.toLowerCase().trim() == "Annualized".toLowerCase().trim()) {
                            if (annualizedGrossAmountColumnNumber === -1){
                                annualizedGrossAmountColumnNumber = cellIndex;
                            }
                            
                           
                        }
                        else if(cellValue.toLowerCase().trim() == "Amt".toLowerCase().trim()){
                            if (amtPerAreaColumnNumber === -1){
                                amtPerAreaColumnNumber = cellIndex;
                            }
                            
                        }
                         
                    }
                } else { //traversing through data
                 
                        if (cells[unitsColumnNumber]){ //checks if the cell has a valid value
                            /*
                                leaseCharge.name = [];
                                leaseCharge.name[0] = propertyColumnName;
                                leaseCharge.name[1] = cells[propertyColumnNumber];
                                leaseCharge.name[2] = orderCount.toString();
                                leaseCharge.name[3] = Common.DATA_TYPE.STRING;//.DATA_TYPE.STRING;
*/
                                leaseCharge.units = [];
                                leaseCharge.units[0] = unitsColumnName;
                                leaseCharge.units[1] = cells[unitsColumnNumber];
                                leaseCharge.units[2] = orderCount.toString();
                                leaseCharge.units[3] = Common.DATA_TYPE.STRING;

                                leaseCharge.lease = [];
                                leaseCharge.lease [0] = leaseColumnName;
                                leaseCharge.lease [1] = cells[leaseColumnNumber];
                                leaseCharge.lease [2] = orderCount.toString();
                                leaseCharge.lease [3] = Common.DATA_TYPE.STRING; 

                                leaseCharge.leaseType = [];
                                leaseCharge.leaseType[0] = leaseTypeColumnName;
                                leaseCharge.leaseType[1] = cells[leaseTypeColumnNumber];
                                leaseCharge.leaseType[2] = orderCount.toString();
                                leaseCharge.leaseType[3] = Common.DATA_TYPE.STRING;

                                leaseCharge.area = [];
                                leaseCharge.area[0] = areaColumnName;
                                leaseCharge.area[1] = cells[areaColumnNumber];
                                leaseCharge.area[2] = orderCount.toString();
                                leaseCharge.area[3] = Common.DATA_TYPE.NUMERIC;

                                //date
                                leaseCharge.startDate = [];
                                leaseCharge.startDate[0] = leaseFromColumnName;
                                leaseCharge.startDate[1] = util.dateToLong(cells[leaseFromColumnNumber].trim());
                                leaseCharge.startDate[2] = orderCount.toString();
                                leaseCharge.startDate[3] = Common.DATA_TYPE.DATE;

                                //date
                                leaseCharge.endDate = [];
                                leaseCharge.endDate[0] = leaseToColumnName;
                                leaseCharge.endDate[1] = util.dateToLong(cells[leaseToColumnNumber].trim());
                                leaseCharge.endDate[2] = orderCount.toString();
                                leaseCharge.endDate[3] = Common.DATA_TYPE.DATE;

                                leaseCharge.securityDeposit = [];
                                leaseCharge.securityDeposit[0] = securityDepositColumnName;
                                leaseCharge.securityDeposit[1] =  cells[securityDepositColumnNumber];
                                leaseCharge.securityDeposit[2] = orderCount.toString();
                                leaseCharge.securityDeposit[3] = Common.DATA_TYPE.NUMERIC;
                                
                                leaseCharge.letterOfCreditAmount = [];
                                leaseCharge.letterOfCreditAmount[0] = letterOfCreditAmountColumnName;
                                leaseCharge.letterOfCreditAmount[1] = cells[letterOfCreditAmountColumnNumber];
                                leaseCharge.letterOfCreditAmount[2] = orderCount.toString();
                                leaseCharge.letterOfCreditAmount[3] = Common.DATA_TYPE.NUMERIC;
                                
                                leaseCharge.amendmentType = [];
                                leaseCharge.amendmentType[0] = amendmentTypeColumnName;
                                leaseCharge.amendmentType[1] =  cells[amendmentTypeColumnNumber];
                                leaseCharge.amendmentType[2] = orderCount.toString();
                                leaseCharge.amendmentType[3] = Common.DATA_TYPE.STRING;

                                leaseCharge.areaLabel = [];
                                leaseCharge.areaLabel[0] = areaLabelColumnName;
                                leaseCharge.areaLabel[1] = cells[areaLabelColumnNumber];
                                leaseCharge.areaLabel[2] = orderCount.toString();
                                leaseCharge.areaLabel[3] = Common.DATA_TYPE.STRING;

                                leaseCharge.term = [];
                                leaseCharge.term[0] = termColumnName
                                leaseCharge.term[1] = cells[termColumnNumber];
                                leaseCharge.term[2] = orderCount.toString();
                                leaseCharge.term[3] = Common.DATA_TYPE.NUMERIC;
                                
                                leaseCharge.amendmentFrom = []; 
                                leaseCharge.amendmentFrom[0] = amendmentFromColumnName;
                                leaseCharge.amendmentFrom[1] = util.dateToLong(cells[amendmentFromColumnNumber].trim());
                                leaseCharge.amendmentFrom[2] = orderCount.toString();
                                leaseCharge.amendmentFrom[3] = Common.DATA_TYPE.DATE;

                                leaseCharge.amendmentTo = [];
                                leaseCharge.amendmentTo[0] = amendmentToColumnName;
                                leaseCharge.amendmentTo[1] =  util.dateToLong(cells[amendmentToColumnNumber].trim());
                                leaseCharge.amendmentTo[2] = orderCount.toString();
                                leaseCharge.amendmentTo[3] = Common.DATA_TYPE.DATE;

                                leaseCharge.chargeCode = [];
                                leaseCharge.chargeCode[0] = chargeCodeColumnName;
                                leaseCharge.chargeCode[1] = cells[chargeCodeColumnNumber];
                                leaseCharge.chargeCode[2] = orderCount.toString();
                                leaseCharge.chargeCode[3] = Common.DATA_TYPE.STRING;

                                leaseCharge.chargeFrom = [];
                                leaseCharge.chargeFrom[0] = chargeFromColumnName;
                                leaseCharge.chargeFrom[1] = util.dateToLong(cells[chargeFromColumnNumber].trim());
                                leaseCharge.chargeFrom[2] = orderCount.toString();
                                leaseCharge.chargeFrom[3] = Common.DATA_TYPE.DATE;

                                leaseCharge.chargeTo = [];
                                leaseCharge.chargeTo[0] = chargeToColumnName;
                                leaseCharge.chargeTo[1] = util.dateToLong(cells[chargeToColumnNumber].trim());
                                leaseCharge.chargeTo[2] = orderCount.toString();
                                leaseCharge.chargeTo[3] = Common.DATA_TYPE.DATE;

                                leaseCharge.monthlyAmount = [];
                                leaseCharge.monthlyAmount[0] = monthlyAmountColumnName;
                                leaseCharge.monthlyAmount[1] = cells[monthlyAmountColumnNumber];
                                leaseCharge.monthlyAmount[2] = orderCount.toString();
                                leaseCharge.monthlyAmount[3] = Common.DATA_TYPE.NUMERIC;

                                leaseCharge.mgmtFee = [];
                                leaseCharge.mgmtFee[0] = mgmtFeeColumnName;
                                leaseCharge.mgmtFee[1] = cells[mgmtFeeColumnNumber];
                                leaseCharge.mgmtFee[2] = orderCount.toString();
                                leaseCharge.mgmtFee[3] = Common.DATA_TYPE.NUMERIC;

                                leaseCharge.grossAmount = [];
                                leaseCharge.grossAmount[0] = grossAmountColumnName;
                                leaseCharge.grossAmount[1] = cells[grossAmountColumnNumber];
                                leaseCharge.grossAmount[2] = orderCount.toString();
                                leaseCharge.grossAmount[3] = Common.DATA_TYPE.NUMERIC;

                                leaseCharge.amt_perArea = [];
                                leaseCharge.amt_perArea[0] = amt_perAreaColumnName;
                                leaseCharge.amt_perArea[1] = cells[amt_perAreaColumnNumber];
                                leaseCharge.amt_perArea[2] = orderCount.toString();
                                leaseCharge.amt_perArea[3] = Common.DATA_TYPE.NUMERIC;

                                leaseCharge.annualizedGrossAmount = [];
                                leaseCharge.annualizedGrossAmount[0] = annualizedGrossAmountColumnName;
                                leaseCharge.annualizedGrossAmount[1] = cells[annualizedGrossAmountColumnNumber];
                                leaseCharge.annualizedGrossAmount[2] = orderCount.toString();
                                leaseCharge.annualizedGrossAmount[3] = Common.DATA_TYPE.NUMERIC;

                                leaseCharge.amtPerArea = [];
                                leaseCharge.amtPerArea[0] = amtPerAreaColumnName;
                                leaseCharge.amtPerArea[1] = cells[amtPerAreaColumnNumber];
                                leaseCharge.amtPerArea[2] = orderCount.toString();
                                leaseCharge.amtPerArea[3] = Common.DATA_TYPE.NUMERIC;

                                rentRoll.tenants.push(leaseCharge);
                                orderCount++;

                        }
                }
        // //console.log("unitsColumnNumber ",unitsColumnNumber);
        // //console.log("leaseColumnNumber ",leaseColumnNumber);
        // //console.log("leaseTypeColumnNumber ",leaseTypeColumnNumber);
        // //console.log("areaColumnNumber ",areaColumnNumber);
        // //console.log("leaseFromColumnNumber ",leaseFromColumnNumber);
        // //console.log("leaseToColumnNumber ",leaseToColumnNumber);
        // //console.log("termColumnNumber ", termColumnNumber);
        // //console.log("securityDepositColumnNumber ", securityDepositColumnNumber);
        // //console.log(" letterOfCreditAmountColumnNumber ",letterOfCreditAmountColumnNumber);
        // //console.log("amendmentTypeColumnNumber: ",amendmentTypeColumnNumber);
        // //console.log("areaLabelColumnNumber: ",areaLabelColumnNumber);
        // // //console.log("monthlyRentAreaColumnNumber ", monthlyRentAreaColumnNumber);
        // //console.log("amendmentFromColumnNumber: ",amendmentFromColumnNumber);
        // //console.log("amendmentToColumnNumber: ",amendmentToColumnNumber);
        // //console.log("chargeFromColumnNumber: ",chargeFromColumnNumber);
        // //console.log("chargeCodeColumnNumber: ",chargeCodeColumnNumber);
        // //console.log("chargeToColumnNumber ",chargeToColumnNumber);

        // //console.log("monthlyAmountColumnNumber ",monthlyAmountColumnNumber);
        // //console.log("mgmtFeeColumnNumber ",mgmtFeeColumnNumber);
        // //console.log("grossAmountColumnNumber ",grossAmountColumnNumber);
        // //console.log("amt_perAreaColumnNumber ",amt_perAreaColumnNumber);

        // //console.log("annualizedGrossAmountColumnNumber ",annualizedGrossAmountColumnNumber);
        // //console.log("amtPerAreaColumnNumber",amtPerAreaColumnNumber);
                
            }
		}
        // //console.log("before logs");
		rentRoll.fileName = [];
		rentRoll.fileName[0] = Common.LABEL.FILE_NAME;
		rentRoll.fileName[1] = fileName;

		rentRoll.originalFileName = [];
		rentRoll.originalFileName[0] = Common.LABEL.ORIGINAL_FILE_NAME;
        rentRoll.originalFileName[1] = originalFileName;
 
        // rentRoll.propertyName = [];
        // rentRoll.propertyName [0] = "Property Name";
        // rentRoll.propertyName [1] = rentRoll.leaseCharges[0].name[1];
        try{
        rentRoll.address = [];
        rentRoll.address[0] = "Address";
        rentRoll.address[1] = rentRoll.tenants[0].units[1].split("-")[1].trim();
        }catch(err){
            rentRoll.address = null;
        }

        
        
        // //console.log("unitsColumnNumber ",unitsColumnNumber);
        // //console.log("leaseColumnNumber ",leaseColumnNumber);
        // //console.log("leaseTypeColumnNumber ",leaseTypeColumnNumber);
        // //console.log("areaColumnNumber ",areaColumnNumber);
        // //console.log("leaseFromColumnNumber ",leaseFromColumnNumber);
        // //console.log("leaseToColumnNumber ",leaseToColumnNumber);
        // //console.log("termColumnNumber ", termColumnNumber);
        // //console.log("securityDepositColumnNumber ", securityDepositColumnNumber);
        // //console.log(" letterOfCreditAmountColumnNumber ",letterOfCreditAmountColumnNumber);
        // //console.log("amendmentTypeColumnNumber: ",amendmentTypeColumnNumber);
        // //console.log("areaLabelColumnNumber: ",areaLabelColumnNumber);
        // //console.log("monthlyRentAreaColumnNumber ", monthlyRentAreaColumnNumber);
        // //console.log("amendmentFromColumnNumber: ",amendmentFromColumnNumber);
        // //console.log("amendmentToColumnNumber: ",amendmentToColumnNumber);
        // //console.log("chargeFromColumnNumber: ",chargeFromColumnNumber);
        // //console.log("chargeCodeColumnNumber: ",chargeCodeColumnNumber);
        // //console.log("chargeToColumnNumber ",chargeToColumnNumber);

        // //console.log("monthlyAmountColumnNumber ",monthlyAmountColumnNumber);
        // //console.log("mgmtFeeColumnNumber ",mgmtFeeColumnNumber);
        // //console.log("grossAmountColumnNumber ",grossAmountColumnNumber);
        // //console.log("amt_perAreaColumnNumber ",amt_perAreaColumnNumber);

        // //console.log("annualizedGrossAmountColumnNumber ",annualizedGrossAmountColumnNumber);
        // //console.log("amtPerAreaColumnNumber",amtPerAreaColumnNumber);
        
        // //console.log("test");
        // //console.log("final: ",JSON.stringify(rentRoll));
		rentRollsList.push(rentRoll);
	});
	// //console.log("final: ",JSON.stringify(rentRollsList));
	return rentRollsList;
};
