var path = require('path');
var Common = require(path.resolve(__dirname, './common'));
var UtilityFunctions = require(path.resolve(__dirname, '../../util/functions'));
var util = new UtilityFunctions();
if(typeof require !== 'undefined') XLSX = require(path.resolve(__dirname, '../xlsx'));

module.exports = Yardi121417;

function Yardi121417() {

}

Yardi121417.prototype.parseFile = function (fileBuffer, fileName, originalFileName) {
	var workbook = XLSX.read(fileBuffer, {type: 'buffer'});

	var sheetHeader = "Rent Roll";
	var asOfColumnName = "As of";
	var reportCreationColumnName = "Report Created";
	var totalBaseRentColumnName = "Total - Base Rent";
	var totalColumnName = "Total";
	var totalGrossRentColumnName = "- Total";
	var grossRentColumnName = "Gross Rent";
	var monthlyColumnName = "Monthly";
	var physicalOccupancyColumnName = "Physical Occupancy";
	var vacantColumnName = "Vacant";
	var percentageColumnName = "%";
	var squareFeetColumnName = "Square Feet";
	var unitsColumnName = "Unit(s)";
	var startDateColumnName = "Start Date";
	var endDateColumnName = "End Date";
	var baseRentAnnualizedColumnName = "Annualized";
	var perSfPerYearColumnName = "PerSF/Year";
	var percentRentBumpColumnName = "% RentBump";
	var rolling12MonthsColumnName = "Rolling12 Months";
	var summarySheetName = "Summary";
	var rentRollsList = [];

	workbook.SheetNames.forEach(function(sheetName) {
		var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);

		// Skip summary sheet
		if(summarySheetName.toLowerCase() === sheetName.toLowerCase()) {
			return;
		}
		
		var vacantRecordIndication = "- Vacant";
		var currentRecordIndication = "- Current";
		var futureRecordIndication = "- Future";
	
		var accountNumber = null;
		var grossRentColumnIndex = null;
		var monthlyColumnIndex = null;
		var vacantColumnIndex = null;
		var physicalOccupancyColumnIndex = null;
		var squareFeetColumnIndex = null;
		var unitsColumnIndex = null;
		var startDateColumnIndex = null;
		var endDateColumnIndex = null;
		var baseRentAnnualizedColumnIndex = null;
		var perSfPerYearColumnIndex = null;
		var percentRentBumpColumnIndex = null;
		var rolling12MonthsColumnIndex = null;
		var percentageIndices = [];
		var totalColumnIndices = [];
		var tenantInfoCompleted = false;
		var summaryStarted = false;

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
			var tenant = {};
			var rows = csv.split("\n");
			var sheetHeaderFound = false;

			for(var index = 0; index < rows.length; index++) {
				// Get cells
				var cells=rows[index].split("|");

				if(cells.length === 0) {
					continue;
				}

				// Find sheet header
				if(!sheetHeaderFound) {
					for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
						var cellValue = cells[cellIndex];
						if(cellValue.toLowerCase().indexOf(sheetHeader.toLowerCase()) > -1) {
							sheetHeaderFound = true;
							break;
						}
					}

					// If sheet header found then search next row (this row has only sheet header)
					if(sheetHeaderFound) {
						continue;
					}
				}

				if(!sheetHeaderFound) {
					continue;
				}

				// Check whether summary rows started
				if(squareFeetColumnIndex !== null && cells[squareFeetColumnIndex].toLowerCase().indexOf((accountNumber + ' - ' + totalColumnName).toLowerCase()) > -1) {
					summaryStarted = true;
				}

				// There are three rows ("[AccountNo] - Vancant", "[AccountNo] - Current" and "[AccountNo] - Future",) that just indicate start of various types of records
				// So we will ignore these records (not storing in the database)
				if(squareFeetColumnIndex !== null && (cells[squareFeetColumnIndex].toLowerCase().indexOf(vacantRecordIndication.toLowerCase()) > -1 ||
					cells[squareFeetColumnIndex].toLowerCase().indexOf(currentRecordIndication.toLowerCase()) > -1 ||
					cells[squareFeetColumnIndex].toLowerCase().indexOf(futureRecordIndication.toLowerCase()) > -1)) {
					continue;
				}

				// We don't have further tenants after 'Total Base Rent' field
				if(squareFeetColumnIndex !== null && !summaryStarted) {
					var cellValue = cells[squareFeetColumnIndex];
					if(tenantInfoCompleted && cellValue.replace(/ /g, "") !== "") {
						// New tenant started
						tenant = {};
						tenantInfoCompleted = false;
					} else if (cellValue.replace(/ /g, "").replace(/-/g, "") !== "") {
						if(isNaN(parseFloat(cellValue.replace(/ /g, "").replace(/,/g, "")))) {
							// New tenant started
							tenant = {};
						}
					}

					if(!tenant.tenant && cellValue.replace(/ /g, "") !== "") {
						tenant.tenant = [];
						tenant.tenant[0] = Common.LABEL.TENANT_NAME;
						tenant.tenant[1] = cellValue;
						tenant.tenant[2] = '2';
						tenant.tenant[3] = Common.DATA_TYPE.STRING;

						tenant.unit = [];
						tenant.unit[0] = unitsColumnName;
						tenant.unit[1] = cells[unitsColumnIndex].replace(/ /g, "") === "" ? '' : cells[unitsColumnIndex].replace(/ /g, "");
						tenant.unit[2] = '1';
						tenant.unit[3] = Common.DATA_TYPE.STRING;

						tenant.startDate = [];
						tenant.startDate[0] = startDateColumnName;
						tenant.startDate[1] = util.dateToLong(cells[startDateColumnIndex].replace(/ /g, "") === "" ? '' : cells[startDateColumnIndex].replace(/ /g, ""));
						tenant.startDate[2] = '4';
						tenant.startDate[3] = Common.DATA_TYPE.DATE;

						tenant.endDate = [];
						tenant.endDate[0] = endDateColumnName;
						tenant.endDate[1] = util.dateToLong(cells[endDateColumnIndex].replace(/ /g, "") === "" ? '' : cells[endDateColumnIndex].replace(/ /g, ""));
						tenant.endDate[2] = '5';
						tenant.endDate[3] = Common.DATA_TYPE.DATE;

						tenant.baseRentMonthly = [];
						tenant.baseRentMonthly[0] = Common.LABEL.BASE_RENT_MONTHLY;
						tenant.baseRentMonthly[1] = util.getFloatValue(cells[monthlyColumnIndex]) + '';
						tenant.baseRentMonthly[2] = '6';
						tenant.baseRentMonthly[3] = Common.DATA_TYPE.CURRENCY;

						tenant.baseRentAnnualized = [];
						tenant.baseRentAnnualized[0] = Common.LABEL.BASE_RENT_ANNUALIZED;
						tenant.baseRentAnnualized[1] = util.getFloatValue(cells[baseRentAnnualizedColumnIndex]) + '';
						tenant.baseRentAnnualized[2] = '7';
						tenant.baseRentAnnualized[3] = Common.DATA_TYPE.CURRENCY;

						tenant.baseRentPerSquareFeetPerYear = [];
						tenant.baseRentPerSquareFeetPerYear[0] = Common.LABEL.BASE_RENT_PER_SF_YEAR;
						tenant.baseRentPerSquareFeetPerYear[1] = util.getFloatValue(cells[perSfPerYearColumnIndex]) + '';
						tenant.baseRentPerSquareFeetPerYear[2] = '8';
						tenant.baseRentPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY;

						tenant.baseRentPercentRentBump = [];
						tenant.baseRentPercentRentBump[0] = Common.LABEL.PERCENT_RENT_BUMP;
						tenant.baseRentPercentRentBump[1] = util.getFloatValue(cells[percentRentBumpColumnIndex]) + '';
						tenant.baseRentPercentRentBump[2] = '9';
						tenant.baseRentPercentRentBump[3] = Common.DATA_TYPE.PERCENTAGE;

						tenant.rolling12Months = [];
						tenant.rolling12Months[0] = Common.LABEL.ROLLING_12_MONTHS;
						tenant.rolling12Months[1] = util.getFloatValue(cells[rolling12MonthsColumnIndex]) + '';
						tenant.rolling12Months[2] = '10';
						tenant.rolling12Months[3] = Common.DATA_TYPE.CURRENCY;

						tenant.rollingPerSquareFeetPerYear = [];
						tenant.rollingPerSquareFeetPerYear[0] = Common.LABEL.ROLLING_PER_SF_YEAR;
						tenant.rollingPerSquareFeetPerYear[1] = util.getFloatValue(cells[rolling12MonthsColumnIndex + 2]) + '';
						tenant.rollingPerSquareFeetPerYear[2] = '11';
						tenant.rollingPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY;

						tenant.grossRentMonthly = [];
						tenant.grossRentMonthly[0] = Common.LABEL.GROSS_RENT_MONTHLY;
						tenant.grossRentMonthly[1] = util.getFloatValue(cells[grossRentColumnIndex]) + '';
						tenant.grossRentMonthly[2] = '12';
						tenant.grossRentMonthly[3] = Common.DATA_TYPE.CURRENCY;

						tenant.grossRentPerSquareFeetPerYear = [];
						tenant.grossRentPerSquareFeetPerYear[0] = Common.LABEL.GROSS_RENT_PER_SF_YEAR;
						tenant.grossRentPerSquareFeetPerYear[1] = util.getFloatValue(cells[grossRentColumnIndex + 1]) + '';
						tenant.grossRentPerSquareFeetPerYear[2] = '13';
						tenant.grossRentPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY;

						tenant.squareFeet = [];
						tenant.squareFeet[0] = Common.LABEL.SQUARE_FEET;
						tenant.squareFeet[1] = ''; // It will be overwritten in the next iteration if we find its value.
						tenant.squareFeet[2] = '3';
						tenant.squareFeet[3] = Common.DATA_TYPE.NUMERIC;

						rentRoll.tenants.push(tenant);
					} else {
						cellValue = cellValue.replace(/ /g, "").replace(/,/g, "").replace(/-/g, "");
						if(cellValue !== "") {
							tenant.squareFeet[1] = util.getFloatValue(cellValue) + '';
							tenantInfoCompleted = true;
						}
					}
				}

				// Check each cell of the row
				for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
					var cellValue = cells[cellIndex];

					// Find property name if not found yet
					if(!rentRoll.propertyName) {
						// After sheet header/title if we find anything that will be the property/building name
						if(cellValue && cellValue.length > 0) {
							rentRoll.propertyName = [];
							rentRoll.propertyName[0] = Common.LABEL.PROPERTY_NAME;
							rentRoll.propertyName[1] = cellValue;

							// Find property account number
							// Account number is at the end of the property name in parenthesis like "XYZ Building 1 (abcd01203)"
							var startIndex = cellValue.lastIndexOf("("); // Index of '('
							var endIndex = cellValue.lastIndexOf(")"); // Index of ')'
							
							// only get address/property name, remove property number.
							// e.g. from Prince Street Plaza (f0901501), get Prince Street Plaza.
							rentRoll.address = [];
							rentRoll.address[0] = Common.LABEL.ADDRESS;
							rentRoll.address[1] = cellValue.substring(0, startIndex).trim();

							rentRoll.propertyId = [];
							rentRoll.propertyId[0] = Common.LABEL.PROPERTY_ID;
							rentRoll.propertyId[1] = '-1';

							accountNumber = cellValue.substring(startIndex + 1, endIndex);
							totalBaseRentColumnName = accountNumber + ' - ' +  totalBaseRentColumnName;
							totalGrossRentColumnName = accountNumber + ' ' + totalGrossRentColumnName;
							vacantRecordIndication = accountNumber + ' ' + vacantRecordIndication;
							currentRecordIndication = accountNumber + ' ' + currentRecordIndication;
							futureRecordIndication = accountNumber + ' ' + futureRecordIndication;

							break;
						}
					}

					// Find 'As of Date' and 'Report Creation Date' if not already found
					if(!rentRoll.asOfDate || !rentRoll.reportCreationDate) {
						var asOfIndex = cellValue.toLowerCase().indexOf(asOfColumnName.toLowerCase());
						var reportCreationIndex = cellValue.toLowerCase().indexOf(reportCreationColumnName.toLowerCase());
						if(asOfIndex > -1) {
							rentRoll.asOfDate = [];
							rentRoll.asOfDate[0] = Common.LABEL.AS_OF_DATE;
							rentRoll.asOfDate[1] = util.dateToLong(cellValue.substring(asOfIndex + asOfColumnName.length + 1));
							rentRoll.asOfDate[2] = '1'; // Order (used in front end)
							rentRoll.asOfDate[3] = Common.DATA_TYPE.DATE;
						} else if(reportCreationIndex > -1) {
							rentRoll.reportCreationDate = [];
							rentRoll.reportCreationDate[0] = Common.LABEL.REPORT_CREATION_DATE;
							rentRoll.reportCreationDate[1] = util.dateToLong(cellValue.substring(reportCreationIndex + reportCreationColumnName.length + 1));
							rentRoll.reportCreationDate[2] = '2'; // Order (used in front end)
							rentRoll.reportCreationDate[3] = Common.DATA_TYPE.DATE;
						}
					}

					// Find 'Monthly' column index
					if(monthlyColumnIndex === null) {
						if(cellValue.toLowerCase().indexOf(monthlyColumnName.toLowerCase()) > -1) {
							monthlyColumnIndex = cellIndex;
						}
					} else {
						// Find total base rent
						if(cellValue.toLowerCase().indexOf(totalBaseRentColumnName.toLowerCase()) > -1) {
							// Get total base rent
							rentRoll.totalBaseRent = [];
							rentRoll.totalBaseRent[0] = Common.LABEL.BASE_RENT;
							rentRoll.totalBaseRent[1] = util.getFloatValue(cells[monthlyColumnIndex]) + '';
							rentRoll.totalBaseRent[2] = '3'; // Order (used in front end)
							rentRoll.totalBaseRent[3] = Common.DATA_TYPE.CURRENCY; // DataType (used in front end)
						}
					}

					// Find 'Gross Rent' column index
					if(grossRentColumnIndex === null) {
						if(cellValue.toLowerCase().indexOf(grossRentColumnName.toLowerCase()) > -1) {
							grossRentColumnIndex = cellIndex;
						}
					} else {
						// Find gross rent
						if(cellValue.replace(/ /g, "").toLowerCase().lastIndexOf(totalGrossRentColumnName.replace(/ /g, "").toLowerCase()) > -1) {
							// Get gross rent
							rentRoll.totalGrossRentMonthly = [];
							rentRoll.totalGrossRentMonthly[0] = Common.LABEL.GROSS_RENT_MONTHLY;
							rentRoll.totalGrossRentMonthly[1] = util.getFloatValue(cells[grossRentColumnIndex]) + '';
							rentRoll.totalGrossRentMonthly[2] = '4'; // Order (used in front end)
							rentRoll.totalGrossRentMonthly[3] = Common.DATA_TYPE.CURRENCY; // DataType (used in front end)

							rentRoll.totalGrossRentPerSquareFeetPerYear = [];
							rentRoll.totalGrossRentPerSquareFeetPerYear[0] = Common.LABEL.GROSS_RENT_PER_SF_YEAR;
							rentRoll.totalGrossRentPerSquareFeetPerYear[1] = util.getFloatValue(cells[grossRentColumnIndex + 1]) + '';
							rentRoll.totalGrossRentPerSquareFeetPerYear[2] = '5'; // Order (used in front end)
							rentRoll.totalGrossRentPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY; // DataType (used in front end)
						}
					}

					// Find 'Physical Occupancy' column
					if(cellValue.toLowerCase().indexOf(physicalOccupancyColumnName.toLowerCase()) > -1) {
						physicalOccupancyColumnIndex = cellIndex;
					}

					// Find 'Square Feet' columns
					if(squareFeetColumnIndex === null) {
						if(cellValue.toLowerCase().replace("\r", "").replace(/ /g, "").indexOf(squareFeetColumnName.toLowerCase().replace(/ /g, "")) > -1) {
							squareFeetColumnIndex = cellIndex;
						}
					}

					if(unitsColumnIndex === null) {
						if(cellValue.toLowerCase().indexOf(unitsColumnName.toLowerCase()) > -1) {
							unitsColumnIndex = cellIndex;
						}
					} else if(startDateColumnIndex === null) {
						if(cellValue.toLowerCase().replace("\r", "").indexOf(startDateColumnName.replace(' ', '').toLowerCase()) > -1) {
							startDateColumnIndex = cellIndex;
						}
					} else if(endDateColumnIndex === null) {
						if(cellValue.toLowerCase().replace("\r", "").indexOf(endDateColumnName.replace(' ', '').toLowerCase()) > -1) {
							endDateColumnIndex = cellIndex;
						}
					} else if(baseRentAnnualizedColumnIndex === null) {
						if(cellValue.toLowerCase().indexOf(baseRentAnnualizedColumnName.toLowerCase()) > -1) {
							baseRentAnnualizedColumnIndex = cellIndex;
						}
					} else if(perSfPerYearColumnIndex === null) {
						if(cellValue.toLowerCase().replace("\r", "").indexOf(perSfPerYearColumnName.toLowerCase()) > -1) {
							perSfPerYearColumnIndex = cellIndex;
						}
					} else if(percentRentBumpColumnIndex === null) {
						if(cellValue.toLowerCase().replace("\r", "").indexOf(percentRentBumpColumnName.toLowerCase()) > -1) {
							percentRentBumpColumnIndex = cellIndex;
						}
					} else if(rolling12MonthsColumnIndex === null) {
						if(cellValue.toLowerCase().replace("\r", "").indexOf(rolling12MonthsColumnName.toLowerCase()) > -1) {
							rolling12MonthsColumnIndex = cellIndex;
						}
					}

					if(physicalOccupancyColumnIndex !== null) {
						// Find 'Vacant' column
						if(cellValue.toLowerCase().indexOf(vacantColumnName.toLowerCase()) > -1) {
							vacantColumnIndex = cellIndex;
						}

						// Find 'Total' columns (handling multiple total columns)
						if(cellValue.toLowerCase().indexOf(totalColumnName.toLowerCase()) > -1) {
							totalColumnIndices.push(cellIndex);
						}

						// Find 'Percentage' columns (handling multiple percentage columns)
						if(cellValue.toLowerCase().indexOf(percentageColumnName.toLowerCase()) > -1) {
							percentageIndices.push(cellIndex);
						}

						if(cellValue.toLowerCase().indexOf(squareFeetColumnName.toLowerCase()) > -1) {
							// Find vacant percentage column (there are multiple percentage columns)
							var vacantPercentageIndex = null;
							for(var i=0; i<percentageIndices.length; i++) {
								if(percentageIndices[i] > vacantColumnIndex) {
									vacantPercentageIndex = percentageIndices[i];
									break;
								}
							}

							// Find total column of physical occupancy (there are two columns)
							// Most probably the nearest total column is the physical occupancy total
							var totalColumnIndex = null;
							var prevDifference = null;
							var prevIndex = null;
							for(var i=0; i<totalColumnIndices.length; i++) {
								var difference = Math.abs(totalColumnIndices[i] - physicalOccupancyColumnIndex);
								if(prevDifference !== null) {
									if(prevDifference < difference) {
										totalColumnIndex = prevIndex;
									} else {
										totalColumnIndex = totalColumnIndices[i];
									}
								} else {
									prevDifference = difference;
									prevIndex = totalColumnIndices[i];
								}
							}

							rentRoll.totalSF = [];
							rentRoll.totalSF[0] = Common.LABEL.TOTAL_SF;
							rentRoll.totalSF[1] = util.getFloatValue(cells[totalColumnIndex]) + '';
							rentRoll.totalSF[2] = '6'; // Order (used in front end)
							rentRoll.totalSF[3] = Common.DATA_TYPE.NUMERIC; // DataType (used in front end)

							rentRoll.vacantSF = [];
							rentRoll.vacantSF[0] = Common.LABEL.VACANT_SF;
							rentRoll.vacantSF[1] = util.getFloatValue(cells[vacantColumnIndex]) + '';
							rentRoll.vacantSF[2] = '7'; // Order (used in front end)
							rentRoll.vacantSF[3] = Common.DATA_TYPE.NUMERIC; // DataType (used in front end)

							rentRoll.vacantPercentage = [];
							rentRoll.vacantPercentage[0] = Common.LABEL.VACANT_PERCENTAGE;
							rentRoll.vacantPercentage[1] = util.getFloatValue(cells[vacantPercentageIndex]) + '';
							rentRoll.vacantPercentage[2] = '8'; // Order (used in front end)
							rentRoll.vacantPercentage[3] = Common.DATA_TYPE.PERCENTAGE; // DataType (used in front end)
						}
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

		rentRollsList.push(rentRoll);
	});
	
	return rentRollsList;
};
