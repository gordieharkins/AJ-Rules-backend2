var path = require('path');
var Common = require(path.resolve(__dirname, './common'));
var UtilityFunctions = require(path.resolve(__dirname, '../../util/functions'));
var util = new UtilityFunctions();
if(typeof require !== 'undefined') XLSX = require(path.resolve(__dirname, '../xlsx'));

module.exports = yardi121417_TS;

function yardi121417_TS() {

}

// Parses Yardi Tenancy Schedule 2017 files.
yardi121417_TS.prototype.parseFile = function (fileBuffer, fileName, originalFileName) {
	var workbook = XLSX.read(fileBuffer, {type: 'buffer'});

    // Columns
	var sheetHeader = "Tenancy Schedule I";
	var asOfColumnName = "Date:";
    var propertyColumnName = "Property";
    var unitsColumnName = "Unit(s)";
    var leaseColumnName = "Lease";
    var leaseTypeColumnName = "Lease Type";
    var areaColumnName = "Area";
    var leaseFromColumnName = "Lease From";
    var leaseToColumnName = "Lease To";
    var termColumnName = "Term";
    var tenancyYearsColumnName = "Tenancy Years";
    var monthlyRentColumnName = "Monthly Rent";
    var monthlyRentAreaColumnName = "Monthly Rent/Area";
    var annualRentColumnName = "Annual Rent";
    var annualRentAreaColumnName = "Annual Rent/Area";
    var annualRecAreaColumnName = "Annual Rec./Area";
    var annualMiscAreaColumnName = "Annual Misc./Area";
    var securityDepositReceivedColumnName = "Security Deposit Received";
    var LocAmountBankGuaranteeColumnName = "LOC Amount/Bank Guarantee";


    //Column Numbers
    var propertyColumnNumber = -1;
    var unitsColumnNumber = -1;
    var leaseColumnNumber = -1;
    var leaseTypeColumnNumber = -1;
    var areaColumnNumber = -1;
    var leaseFromColumnNumber = -1;
    var leaseToColumnNumber = -1;
    var termColumnNumber = -1;
    var tenancyYearsColumnNumber = -1;
    var monthlyRentColumnNumber = -1;
    var monthlyRentAreaColumnNumber = -1;
    var annualRentColumnNumber = -1;
    var annualRentAreaColumnNumber = -1;
    var annualRecAreaColumnNumber = -1;
    var annualMiscAreaColumnNumber = -1;
    var securityDepositReceivedColumnNumber = -1;
    var LocAmountBankGuaranteeColumnNumber = -1;

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
        
        

		if(csv.length > 0) {
            var rows = csv.split("\n");
            var orderCount = 0;
            for(var index = 0; index < rows.length; index++) { // rows loop ******************
                var tenant = {};
				var cells=rows[index].split("|");

				if(cells.length === 0) {
					continue;
				}
                if (propertyColumnNumber === -1 || unitsColumnNumber === -1 || leaseColumnNumber === -1 || leaseTypeColumnNumber === -1 || areaColumnNumber === -1 || leaseFromColumnNumber === -1 || leaseToColumnNumber === -1 || termColumnNumber === -1 || tenancyYearsColumnNumber === -1 || monthlyRentColumnNumber === -1 || monthlyRentAreaColumnNumber === -1 || annualRentColumnNumber === -1 || annualRentAreaColumnNumber === -1 || annualRecAreaColumnNumber === -1 ||annualMiscAreaColumnNumber === -1 || securityDepositReceivedColumnNumber === -1 || LocAmountBankGuaranteeColumnNumber === -1)
                { 
                    //Finding Headers
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
                            
                        }else if(propertyColumnName.toLowerCase().trim().indexOf(cellValue.toLowerCase().trim()) > -1) {
                            propertyColumnNumber = cellIndex;
                        }else if(unitsColumnName.toLowerCase().trim() == cellValue.toLowerCase().trim()) {
                            unitsColumnNumber = cellIndex;
                        }else if(cellValue.toLowerCase().trim().indexOf("Lease".toLowerCase().trim()) > -1) {
                         
                            if(cellValue.toLowerCase().trim() == leaseColumnName.toLowerCase().trim()){
                                leaseColumnNumber = cellIndex;
                            } else if(cellValue.toLowerCase().trim() == leaseTypeColumnName.toLowerCase().trim()){
                                leaseTypeColumnNumber = cellIndex;
                            } else if(cellValue.toLowerCase().trim() == leaseFromColumnName.toLowerCase().trim()){
                                leaseFromColumnNumber = cellIndex;
                            } else if(cellValue.toLowerCase().trim() == leaseToColumnName.toLowerCase().trim()){
                                leaseToColumnNumber = cellIndex;
                            }
                            
                          
                        }else  if(areaColumnName.toLowerCase().trim() == cellValue.toLowerCase().trim() ) {
                            areaColumnNumber = cellIndex;
                        }
                       
                        else  if(tenancyYearsColumnName.toLowerCase().trim().indexOf(cellValue.toLowerCase().trim()) > -1) {
                            tenancyYearsColumnNumber = cellIndex;
                        }else if(cellValue.toLowerCase().trim().indexOf("Monthly".toLowerCase().trim()) > -1) {
                            var bottomCells=rows[index+1].split("|");
                          
                            if (bottomCells[cellIndex].toLowerCase().trim() == ("Rent".toLowerCase().trim())){
                                monthlyRentColumnNumber = cellIndex;
                            } else if (bottomCells[cellIndex].toLowerCase().trim() == "Rent/Area".toLowerCase().trim()){
                                monthlyRentAreaColumnNumber = cellIndex;
                            }
                        }else if(cellValue.toLowerCase().trim().indexOf("Annual".toLowerCase().trim()) > -1) {
                            var bottomCells=rows[index+1].split("|");
                          
                            if (bottomCells[cellIndex].toLowerCase().trim() == "Rent".toLowerCase().trim()){
                                annualRentColumnNumber = cellIndex;
                            } else if (bottomCells[cellIndex].toLowerCase().trim() == "Rent/Area".toLowerCase().trim()){
                                annualRentAreaColumnNumber = cellIndex;
                            } else if (bottomCells[cellIndex].toLowerCase().trim() == "Rec./Area".toLowerCase().trim()){
                                annualRecAreaColumnNumber = cellIndex;
                            } else if (bottomCells[cellIndex].toLowerCase().trim() == "Misc/Area".toLowerCase().trim()){
                                annualMiscAreaColumnNumber = cellIndex;
                            }
                            
                        }else if(securityDepositReceivedColumnName.toLowerCase().trim().indexOf(cellValue.toLowerCase().trim()) > -1) {
                            securityDepositReceivedColumnNumber = cellIndex;
                            
                            
                        }
                        else if(termColumnName.toLowerCase().trim().indexOf(cellValue.toLowerCase().trim()) > -1) {
                            termColumnNumber = cellIndex;
                           
                            
                        }
                        else if(cellValue.toLowerCase().trim().indexOf("LOC".toLowerCase().trim()) > -1) {
                            LocAmountBankGuaranteeColumnNumber = cellIndex;                          
                        }
                         
                    }
                } else { //traversing through data
                 
                        if (cells[propertyColumnNumber]){ //checks if the cell has a valid value
                            
                                tenant.name = [];
                                tenant.name[0] = propertyColumnName;
                                tenant.name[1] = cells[propertyColumnNumber];
                                tenant.name[2] = orderCount.toString();
                                tenant.name[3] = Common.DATA_TYPE.STRING;//.DATA_TYPE.STRING;

                                tenant.units = [];
                                tenant.units[0] = unitsColumnName;
                                tenant.units[1] = cells[unitsColumnNumber];
                                tenant.units[2] = orderCount.toString();
                                tenant.units[3] = Common.DATA_TYPE.NUMERIC;

                                tenant.lease = [];
                                tenant.lease [0] = leaseColumnName;
                                tenant.lease [1] = cells[leaseColumnNumber];
                                tenant.lease [2] = orderCount.toString();
                                tenant.lease [3] = Common.DATA_TYPE.STRING; 

                                tenant.leaseType = [];
                                tenant.leaseType[0] = leaseTypeColumnName;
                                tenant.leaseType[1] = cells[leaseTypeColumnNumber];
                                tenant.leaseType[2] = orderCount.toString();
                                tenant.leaseType[3] = Common.DATA_TYPE.STRING;

                                tenant.area = [];
                                tenant.area[0] = areaColumnName;
                                tenant.area[1] = cells[areaColumnNumber];
                                tenant.area[2] = orderCount.toString();
                                tenant.area[3] = Common.DATA_TYPE.NUMERIC;

                                //date
                                tenant.startDate = [];
                                tenant.startDate[0] = leaseFromColumnName;
                                tenant.startDate[1] = util.dateToLong(cells[leaseFromColumnNumber].trim());
                                tenant.startDate[2] = orderCount.toString();
                                tenant.startDate[3] = Common.DATA_TYPE.DATE;

                                //date
                                tenant.endDate = [];
                                tenant.endDate[0] = leaseToColumnName;
                                tenant.endDate[1] = util.dateToLong(cells[leaseToColumnNumber].trim());
                                tenant.endDate[2] = orderCount.toString();
                                tenant.endDate[3] = Common.DATA_TYPE.DATE;

                                tenant.term = [];
                                tenant.term[0] = termColumnName;
                                tenant.term[1] =  cells[termColumnNumber];
                                tenant.term[2] = orderCount.toString();
                                tenant.term[3] = Common.DATA_TYPE.NUMERIC;
                                
                                tenant.tenancyYears = [];
                                tenant.tenancyYears[0] = tenancyYearsColumnName;
                                tenant.tenancyYears[1] = cells[tenancyYearsColumnNumber];
                                tenant.tenancyYears[2] = orderCount.toString();
                                tenant.tenancyYears[3] = Common.DATA_TYPE.NUMERIC;
                                
                                tenant.monthlyRent = [];
                                tenant.monthlyRent[0] = monthlyRentColumnName;
                                tenant.monthlyRent[1] =  cells[monthlyRentColumnNumber];
                                tenant.monthlyRent[2] = orderCount.toString();
                                tenant.monthlyRent[3] = Common.DATA_TYPE.NUMERIC;

                                tenant.monthlyRentArea = [];
                                tenant.monthlyRentArea[0] = monthlyRentAreaColumnName;
                                tenant.monthlyRentArea[1] = cells[monthlyRentAreaColumnNumber];
                                tenant.monthlyRentArea[2] = orderCount.toString();
                                tenant.monthlyRentArea[3] = Common.DATA_TYPE.NUMERIC;

                                tenant.annualRent = [];
                                tenant.annualRent[0] = annualRentColumnName
                                tenant.annualRent[1] = cells[annualRentColumnNumber];
                                tenant.annualRent[2] = orderCount.toString();
                                tenant.annualRent[3] = Common.DATA_TYPE.NUMERIC;
                                
                                tenant.annualRentArea = []; 
                                tenant.annualRentArea[0] = annualRentAreaColumnName;
                                tenant.annualRentArea[1] = cells[annualRentAreaColumnNumber];
                                tenant.annualRentArea[2] = orderCount.toString();
                                tenant.annualRentArea[3] = Common.DATA_TYPE.NUMERIC;

                                tenant.annualRecArea = [];
                                tenant.annualRecArea[0] = annualRecAreaColumnName;
                                tenant.annualRecArea[1] = cells[annualRecAreaColumnNumber];
                                tenant.annualRecArea[2] = orderCount.toString();
                                tenant.annualRecArea[3] = Common.DATA_TYPE.NUMERIC;

                                tenant.annualMiscArea = [];
                                tenant.annualMiscArea[0] = annualMiscAreaColumnName;
                                tenant.annualMiscArea[1] = cells[annualMiscAreaColumnNumber];
                                tenant.annualMiscArea[2] = orderCount.toString();
                                tenant.annualMiscArea[3] = Common.DATA_TYPE.NUMERIC;

                                tenant.securityDepositReceived = [];
                                tenant.securityDepositReceived[0] = securityDepositReceivedColumnName;
                                tenant.securityDepositReceived[1] = cells[securityDepositReceivedColumnNumber];
                                tenant.securityDepositReceived[2] = orderCount.toString();
                                tenant.securityDepositReceived[3] = Common.DATA_TYPE.NUMERIC;

                                tenant.LocAmountBankGuarantee = [];
                                tenant.LocAmountBankGuarantee[0] = LocAmountBankGuaranteeColumnName;
                                tenant.LocAmountBankGuarantee[1] = cells[LocAmountBankGuaranteeColumnNumber];
                                tenant.LocAmountBankGuarantee[2] = orderCount.toString();
                                tenant.LocAmountBankGuarantee[3] = Common.DATA_TYPE.NUMERIC;
                                rentRoll.tenants.push(tenant);
                                orderCount++;

                        }
                }

                
            }
		}

		rentRoll.fileName = [];
		rentRoll.fileName[0] = Common.LABEL.FILE_NAME;
		rentRoll.fileName[1] = fileName;

		rentRoll.originalFileName = [];
		rentRoll.originalFileName[0] = Common.LABEL.ORIGINAL_FILE_NAME;
        rentRoll.originalFileName[1] = originalFileName;
        
        rentRoll.propertyName = [];
        rentRoll.propertyName [0] = "Property Name";
        rentRoll.propertyName [1] = rentRoll.tenants[0].name[1];
        
        rentRoll.parsed = ["Parse Status","true"];
        // rentRoll.address = [];
        // rentRoll.address[0] = "Address";
        // rentRoll.address[1] = rentRoll.tenants[0].name[1].split("(")[0].trim();


        try{
            rentRoll.address = [];
            rentRoll.address[0] = "Address";
            rentRoll.address[1] = rentRoll.tenants[0].name[1].split("(")[0].trim();
            }catch(err){
                rentRoll.address = null;
            }
        
/*
        
        //console.log("propertyColumnNumber ",propertyColumnNumber);
        //console.log("unitsColumnNumber ",unitsColumnNumber);
        //console.log("leaseColumnNumber ",leaseColumnNumber);
        //console.log("leaseTypeColumnNumber ",leaseTypeColumnNumber);
        //console.log("areaColumnNumber ",areaColumnNumber);
        //console.log("leaseFromColumnNumber ",leaseFromColumnNumber);
        //console.log("leaseToColumnNumber ",leaseToColumnNumber);
        //console.log("termColumnNumber ", termColumnNumber);
        //console.log("tenancyYearsColumnNumber ", tenancyYearsColumnNumber);
        //console.log(" monthlyRentColumnNumber ",monthlyRentColumnNumber);
        //console.log("monthlyRentAreaColumnNumber ", monthlyRentAreaColumnNumber);
        //console.log("annualRentColumnNumber: ",annualRentColumnNumber);
        //console.log("annualRentAreaColumnNumber: ",annualRentAreaColumnNumber);
        //console.log("annualRecAreaColumnNumber: ",annualRecAreaColumnNumber);
        //console.log("annualMiscAreaColumnNumber: ",annualMiscAreaColumnNumber);
        //console.log("securityDepositReceivedColumnNumber: ",securityDepositReceivedColumnNumber);
        //console.log("LocAmountBankGuaranteeColumnNumber: ",LocAmountBankGuaranteeColumnNumber);
*/
        ////console.log("final: ",JSON.stringify(rentRoll));
		rentRollsList.push(rentRoll);
	});
	// //console.log("final: ",JSON.stringify(rentRollsList));
	return rentRollsList;
};
