var path = require('path');
var Common = require(path.resolve(__dirname, './common'));
var UtilityFunctions = require(path.resolve(__dirname, '../../util/functions'));
var util = new UtilityFunctions();
if(typeof require !== 'undefined') XLSX = require(path.resolve(__dirname, '../xlsx'));

const MONTHS_PER_YEAR = 12;

module.exports = Mri17;

function Mri17() {

}

// Parses MRI 2017 files.
Mri17.prototype.parseFile = function (fileBuffer, fileName, originalFileName) {
	var workbook = XLSX.read(fileBuffer, {type: 'buffer'});

	var pageHeader = "Rent Roll";
	var reportDateColumnName = "Date:";
	var reportTimeColumnName = "Time:";
	var suitIdColumnName = "Suit Id";
	var occupantColumnName = "Occupant Name";
	var rentStartColumnName = "Rent Start";
	var expirationColumnName = "Expiration";
	var sqftColumnName = "Sqft";
	var baseRentColumnName = "Base Rent";
	var ratePsfColumnName = "Rate PSF";
	var monthlyAmountColumnName = "Monthly Amount";
	var psfColumnName = "PSF";
	var occupiedSqftColumnName = "Occupied Sqft:";
	var vacantSqftColumnName = "Vacant Sqft:";
	var totalSqftColumnName = "Total Sqft:";

	var pageHeaderIndex = null;
	var suitIdColumnIndex = null;
	var occupantColumnIndex = null;
	var rentStartColumnIndex = null;
	var expirationColumnIndex = null;
	var sqftColumnIndex = null;
	var baseRentColumnIndex = null;
	var ratePsfColumnIndex = null;
	var monthlyAmountColumnIndex = null;
	var psfColumnIndex = null;
	var summaryStarted = false;
	var rentRollsList = [];
	
	workbook.SheetNames.forEach(function(sheetName) {
		var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);

		if(csv.length > 0) {
			var rentRoll = {};
			initRentRoll(rentRoll, fileName, originalFileName, sheetName);

			var rows = csv.split("\n");
			var pageHeaderFound = false;
			var headerRowFound = false;
	
			for(var index = 0; index < rows.length; index++) {
				// Get cells
				var cells=rows[index].split("|");

				if(cells.length === 0) {
					continue;
				}

				var isPageHeader = false;

				// Find page header
				for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
					var cellValue = cells[cellIndex];
					if(cellValue.toLowerCase().indexOf(pageHeader.toLowerCase()) > -1) {
						pageHeaderFound = true;
						isPageHeader = true;
						pageHeaderIndex = cellIndex;

						// Next page started therefore we need to find header row again
						headerRowFound = false;
						break;
					}
				}

				if(!pageHeaderFound || isPageHeader) {
					continue;
				}

				// Find property name if not found yet
				// Property name is in the next row after page header
				// As of date is in the next row after property name
				if(!rentRoll.propertyName) {
					rentRoll.propertyName = [];
					rentRoll.propertyName[0] = Common.LABEL.PROPERTY_NAME;
					rentRoll.propertyName[1] = cells[pageHeaderIndex];

					rentRoll.address = [];
					rentRoll.address[0] = Common.LABEL.ADDRESS;
					rentRoll.address[1] = cells[pageHeaderIndex];

					rentRoll.propertyId = [];
					rentRoll.propertyId[0] = Common.LABEL.PROPERTY_ID;
					rentRoll.propertyId[1] = '-1';
				} else if(!rentRoll.asOfDate) {
					rentRoll.asOfDate = [];
					rentRoll.asOfDate[0] = Common.LABEL.AS_OF_DATE;
					rentRoll.asOfDate[1] = util.dateToLong(cells[pageHeaderIndex]);
					rentRoll.asOfDate[2] = '1'; // Order (used in front end)
					rentRoll.asOfDate[3] = Common.DATA_TYPE.DATE; // unit
					// rentRoll.asOfDate[1] = cells[pageHeaderIndex];
				}

				var isHeaderRow = false;

				// Find header row columns
				for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
					var cellValue = cells[cellIndex];
					if(cellValue.toLowerCase().indexOf(reportDateColumnName.toLowerCase()) > -1) {
						rentRoll.reportCreationDate = [];
						rentRoll.reportCreationDate[0] = Common.LABEL.REPORT_CREATION_DATE;
						rentRoll.reportCreationDate[1] = cells[cellIndex + 1];
						rentRoll.reportCreationDate[2] = '2'; // Order (used in front end)
						rentRoll.reportCreationDate[3] = Common.DATA_TYPE.DATE; // unit
						break;
					} else if(cellValue.toLowerCase().indexOf(reportTimeColumnName.toLowerCase()) > -1) {
						rentRoll.reportCreationDate[1] = util.dateToLong(rentRoll.reportCreationDate[1] + ' ' + cells[cellIndex + 1]);
						break;
					} else if(cellValue.toLowerCase().indexOf(suitIdColumnName.toLowerCase()) > -1) {
						isHeaderRow = true;
						headerRowFound = true;
						suitIdColumnIndex = cellIndex;
					} else if(occupantColumnIndex === null && cellValue.toLowerCase().indexOf(occupantColumnName.toLowerCase()) > -1) {
						occupantColumnIndex = cellIndex;
					} else if(rentStartColumnIndex === null && cellValue.toLowerCase().indexOf(rentStartColumnName.toLowerCase()) > -1) {
						rentStartColumnIndex = cellIndex;
					} else if(expirationColumnIndex === null && cellValue.toLowerCase().indexOf(expirationColumnName.toLowerCase()) > -1) {
						expirationColumnIndex = cellIndex;
					} else if(sqftColumnIndex === null && cellValue.toLowerCase().indexOf(sqftColumnName.toLowerCase()) > -1) {
						sqftColumnIndex = cellIndex;
					} else if(baseRentColumnIndex === null && cellValue.toLowerCase().indexOf(baseRentColumnName.toLowerCase()) > -1) {
						baseRentColumnIndex = cellIndex;
					} else if(ratePsfColumnIndex === null && cellValue.toLowerCase().indexOf(ratePsfColumnName.toLowerCase()) > -1) {
						ratePsfColumnIndex = cellIndex;
					} else if(monthlyAmountColumnIndex === null && cellValue.toLowerCase().indexOf(monthlyAmountColumnName.toLowerCase()) > -1) {
						monthlyAmountColumnIndex = cellIndex;
					} else if(psfColumnIndex === null && cellValue.toLowerCase().indexOf(psfColumnName.toLowerCase()) > -1) {
						psfColumnIndex = cellIndex;
					}
				}

				if(!headerRowFound) {
					continue;
				}

				// Check whether summary rows started
				if(suitIdColumnIndex !== null && cells[suitIdColumnIndex]) {
					if(cells[suitIdColumnIndex].toLowerCase().replace(/ /g, "") === occupiedSqftColumnName.toLowerCase().replace(/ /g, "")) {
						summaryStarted = true;
						rentRoll.totalBaseRent = [];
						rentRoll.totalBaseRent[0] = Common.LABEL.BASE_RENT_MONTHLY;
						rentRoll.totalBaseRent[1] = util.getFloatValue(cells[baseRentColumnIndex]) + '';
						rentRoll.totalBaseRent[2] = '3'; // Order (used in front end)
						rentRoll.totalBaseRent[3] = Common.DATA_TYPE.CURRENCY; // unit
					}

					if(summaryStarted) {
						if(cells[suitIdColumnIndex].toLowerCase().indexOf(vacantSqftColumnName.toLowerCase()) > -1) {
							// Vacant percentage is in the Rent Start column
							rentRoll.vacantPercentage = [];
							rentRoll.vacantPercentage[0] = Common.LABEL.VACANT_PERCENTAGE;
							rentRoll.vacantPercentage[1] = util.getFloatValue(cells[rentStartColumnIndex]) + '';
							rentRoll.vacantPercentage[2] = '8'; // Order (used in front end)
							rentRoll.vacantPercentage[3] = Common.DATA_TYPE.PERCENTAGE; // unit

							rentRoll.vacantSF = [];
							rentRoll.vacantSF[0] = vacantSqftColumnName.replace(':', '');
							rentRoll.vacantSF[1] = util.getFloatValue(cells[sqftColumnIndex]) + '';
							rentRoll.vacantSF[2] = '7'; // Order (used in front end)
							rentRoll.vacantSF[3] = Common.DATA_TYPE.NUMERIC; // unit
						} else if(cells[suitIdColumnIndex].toLowerCase().indexOf(totalSqftColumnName.toLowerCase()) > -1) {
							rentRoll.totalSF = [];
							rentRoll.totalSF[0] = totalSqftColumnName.replace(':', '');
							rentRoll.totalSF[1] = util.getFloatValue(cells[sqftColumnIndex]) + '';
							rentRoll.totalSF[2] = '6'; // Order (used in front end)
							rentRoll.totalSF[3] = Common.DATA_TYPE.NUMERIC; // unit

							// All information completed for the current record
							// Therefore add current rent roll to the list
							rentRollsList.push(rentRoll);

							// Reset variables for the next record
							pageHeaderFound = false;
							summaryStarted = false;
							suitIdColumnIndex = null;
							rentRoll = {};
							rentRoll.propertyName = null;
							initRentRoll(rentRoll, fileName, originalFileName, sheetName);
						}
					}
				}

				if(suitIdColumnIndex !== null && cells[suitIdColumnIndex] && !summaryStarted && !isHeaderRow) {
					var suitId = cells[suitIdColumnIndex];
					if(suitId.replace(/ /g, "") === "") {
						continue;
					}

					var tenant = {};
					tenant.tenant = [];
					tenant.tenant[0] = occupantColumnName;
					tenant.tenant[1] = cells[occupantColumnIndex];
					tenant.tenant[2] = '2';
					tenant.tenant[3] = Common.DATA_TYPE.STRING;

					tenant.unit = [];
					tenant.unit[0] = suitIdColumnName;
					tenant.unit[1] = suitId.replace(/ /g, "") === "" ? '' : suitId.replace(/ /g, "");
					tenant.unit[2] = '1';
					tenant.unit[3] = Common.DATA_TYPE.STRING;

					tenant.startDate = [];
					tenant.startDate[0] = rentStartColumnName;
					tenant.startDate[1] = util.dateToLong(cells[rentStartColumnIndex].replace(/ /g, "") === "" ? '' : cells[rentStartColumnIndex].replace(/ /g, ""));
					tenant.startDate[2] = '4';
					tenant.startDate[3] = Common.DATA_TYPE.DATE; // unit

					tenant.endDate = [];
					tenant.endDate[0] = expirationColumnName;
					tenant.endDate[1] = util.dateToLong(cells[expirationColumnIndex].replace(/ /g, "") === "" ? '' : cells[expirationColumnIndex].replace(/ /g, ""));
					tenant.endDate[2] = '5';
					tenant.endDate[3] = Common.DATA_TYPE.DATE; // unit

					tenant.squareFeet = [];
					tenant.squareFeet[0] = Common.LABEL.GLA_SQFT;
					tenant.squareFeet[1] = util.getFloatValue(cells[sqftColumnIndex]) + '';
					tenant.squareFeet[2] = '3';
					tenant.squareFeet[3] = Common.DATA_TYPE.NUMERIC; // unit

					tenant.baseRentMonthly = [];
					tenant.baseRentMonthly[0] = baseRentColumnName;
					tenant.baseRentMonthly[1] = util.getFloatValue(cells[baseRentColumnIndex]) + '';
					tenant.baseRentMonthly[2] = '6';
					tenant.baseRentMonthly[3] = Common.DATA_TYPE.CURRENCY; // unit

					tenant.baseRentPerSquareFeetPerYear = [];
					tenant.baseRentPerSquareFeetPerYear[0] = Common.LABEL.ANNUAL_RATE_PSF;
					tenant.baseRentPerSquareFeetPerYear[1] = util.getFloatValue(cells[ratePsfColumnIndex]) + '';
					tenant.baseRentPerSquareFeetPerYear[2] = '8';
					tenant.baseRentPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY; // unit

					tenant.grossRentMonthly = [];
					tenant.grossRentMonthly[0] = monthlyAmountColumnName;
					tenant.grossRentMonthly[1] = util.getFloatValue(cells[monthlyAmountColumnIndex]) + '';
					tenant.grossRentMonthly[2] = '12';
					tenant.grossRentMonthly[3] = Common.DATA_TYPE.CURRENCY; // unit

					tenant.grossRentPerSquareFeetPerYear = [];
					tenant.grossRentPerSquareFeetPerYear[0] = psfColumnName;
					tenant.grossRentPerSquareFeetPerYear[1] = util.getFloatValue(cells[psfColumnIndex]) + '';
					tenant.grossRentPerSquareFeetPerYear[2] = '13';
					tenant.grossRentPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY; // unit

					var baseRentAnnualized = '';
					if(tenant.baseRentMonthly[1] !== null) {
						baseRentAnnualized = tenant.baseRentMonthly[1] !== 'null' ? (parseFloat(tenant.baseRentMonthly[1]) * MONTHS_PER_YEAR) + '' : '';
					}

					tenant.baseRentAnnualized = [];
					tenant.baseRentAnnualized[0] = Common.LABEL.BASE_RENT_ANNUALIZED;
					tenant.baseRentAnnualized[1] = baseRentAnnualized;
					tenant.baseRentAnnualized[2] = '7';
					tenant.baseRentAnnualized[3] = Common.DATA_TYPE.CURRENCY; // unit

					// We could not identify the following fields in the RR-MRI sample files.
					tenant.baseRentPercentRentBump = [];
					tenant.baseRentPercentRentBump[0] = Common.LABEL.PERCENT_RENT_BUMP;
					tenant.baseRentPercentRentBump[1] = '';
					tenant.baseRentPercentRentBump[2] = '9';
					tenant.baseRentPercentRentBump[3] = Common.DATA_TYPE.PERCENTAGE; // unit

					tenant.rolling12Months = [];
					tenant.rolling12Months[0] = Common.LABEL.ROLLING_12_MONTHS;
					tenant.rolling12Months[1] = '';
					tenant.rolling12Months[2] = '10';
					tenant.rolling12Months[3] = Common.DATA_TYPE.CURRENCY; // unit

					tenant.rollingPerSquareFeetPerYear = [];
					tenant.rollingPerSquareFeetPerYear[0] = Common.LABEL.ROLLING_PER_SF_YEAR;
					tenant.rollingPerSquareFeetPerYear[1] = '';
					tenant.rollingPerSquareFeetPerYear[2] = '11';
					tenant.rollingPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY; // unit

					rentRoll.totalGrossRentMonthly[1] = (parseFloat(rentRoll.totalGrossRentMonthly[1]) + (tenant.grossRentMonthly[1] === 'null' ? 0 : parseFloat(tenant.grossRentMonthly[1]))) + '';
					rentRoll.totalGrossRentPerSquareFeetPerYear[1] = (parseFloat(rentRoll.totalGrossRentPerSquareFeetPerYear[1]) + (tenant.grossRentPerSquareFeetPerYear[1] === 'null' ? 0 : parseFloat(tenant.grossRentPerSquareFeetPerYear[1]))) + '';

					rentRoll.tenants.push(tenant);
				}
            }
		}
	});
	
	return rentRollsList;
}

function initRentRoll(rentRoll, fileName, originalFileName, sheetName) {
	rentRoll.fileName = [];
	rentRoll.fileName[0] = Common.LABEL.FILE_NAME;
	rentRoll.fileName[1] = fileName;

	rentRoll.originalFileName = [];
	rentRoll.originalFileName[0] = Common.LABEL.ORIGINAL_FILE_NAME;
	rentRoll.originalFileName[1] = originalFileName;

	rentRoll.totalGrossRentMonthly = [];
	rentRoll.totalGrossRentMonthly[0] = Common.LABEL.GROSS_RENT_MONTHLY;
	rentRoll.totalGrossRentMonthly[1] = "0.0";
	rentRoll.totalGrossRentMonthly[2] = '4'; // Order (used in front end)
	rentRoll.totalGrossRentMonthly[3] = Common.DATA_TYPE.CURRENCY; // unit

	rentRoll.totalGrossRentPerSquareFeetPerYear = [];
	rentRoll.totalGrossRentPerSquareFeetPerYear[0] = Common.LABEL.GROSS_RENT_PER_SF_YEAR;
	rentRoll.totalGrossRentPerSquareFeetPerYear[1] = "0.0";
	rentRoll.totalGrossRentPerSquareFeetPerYear[2] = '5'; // Order (used in front end)
	rentRoll.totalGrossRentPerSquareFeetPerYear[3] = Common.DATA_TYPE.CURRENCY; // unit

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
}