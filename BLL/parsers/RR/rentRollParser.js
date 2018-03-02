const UNKNOWN_FILE_TYPE = 0;
const YARDI_12_14_17_FILE_TYPE = 1;
const MRI_17_FILE_TYPE = 2;
const YARDI_TS_12_14_17_FILE_TYPE = 3;
const yardi121417_RR_1_16_18_FILE_TYPE = 4;

const UNITS_COLUMN_NAME = "Unit(s)";
const SUIT_ID_COLUMN_NAME = "Suit Id";
const SUMMARY_SHEET_NAME = "Summary";
const TENANCY_SCHEDULE = "Tenancy";
const LEASE_CHARGES = "Lease Charges";

var path = require('path');

var InvalidFileFormat = require('../../errors/invalidFileFormat');
var Yardi121417 = require(path.resolve(__dirname, './RR_Yardi_12_14_17'));
var Yardi121417_TS = require(path.resolve(__dirname, './RR_Yardi_TS_12_22_17'));
var yardi121417_RR_1_16_18 = require(path.resolve(__dirname, './RR_Yardi_RR_1_16_18'));
var Mri17 = require(path.resolve(__dirname, './RR_MRI_17'));
var Response = require(path.resolve(__dirname, '../../util/response'));

var yardi121417 = new Yardi121417();
var yardi121417_TS = new Yardi121417_TS();
var mri17 = new Mri17();
var yardi121417_RR_1_16_18 = new yardi121417_RR_1_16_18();

if(typeof require !== 'undefined') XLSX = require(path.resolve(__dirname, '../xlsx'));

module.exports = RentRollParser;

function RentRollParser() {

}

RentRollParser.prototype.parseRentRollFile = function (fileBuffer, fileName, originalFileName) {
	// console.log("parsing rent roll files");
	var rentRolls = null;
	var fileType = getFileType(fileBuffer);
	console.log("fileType & name",fileType+":::"+fileName);
	switch (fileType) {

		case UNKNOWN_FILE_TYPE:
			console.log("unknown file type");
			// console.log("rentRollsParser.js" , rentRolls);
			// rentRolls = [{"asOfDate":["As of Date","unknown","1","4"],"fileName":["File Name",fileName]}]
			// throw new InvalidFileFormat(Response.REPLY_MSG.FIELDS_NOT_FOUND_SHEET);
			break;

		case YARDI_TS_12_14_17_FILE_TYPE:
			rentRolls = yardi121417_TS.parseFile(fileBuffer, fileName, originalFileName);
			break;

		case YARDI_12_14_17_FILE_TYPE:
			rentRolls = yardi121417.parseFile(fileBuffer, fileName, originalFileName);
			break;

		case MRI_17_FILE_TYPE:
			rentRolls = mri17.parseFile(fileBuffer, fileName, originalFileName);
			break;
		
		case yardi121417_RR_1_16_18_FILE_TYPE:
			console.log("in suspect filetype");
			rentRolls = yardi121417_RR_1_16_18.parseFile(fileBuffer, fileName, originalFileName);
			// console.log("here asdf: ",rentRolls);
			break;
	}
	// console.log("check check");
	// console.log("rentRollsParser.js" , rentRolls);
	if(rentRolls !== null && rentRolls.length > 0) {
		// Check whether required fields found.
		for(var i=0; i<rentRolls.length; i++) {
			var rentRoll = rentRolls[i];
			// console.log("in loop: ",rentRoll);
			if(rentRoll.propertyName === null || rentRoll.address === null || rentRoll.asOfDate === null) {
				// console.log("in null");
				// console.log("rent rolls: ",rentRolls);
				
				rentRoll["asOfDate"] = ["As of Date","unknown","1","4"];
				rentRoll.parsed[1] = "false";
				
				// console.log(rentRolls);
				// throw new InvalidFileFormat(Response.REPLY_MSG.FIELDS_NOT_FOUND_SHEET + rentRoll.sheetName + "'.");
			}else{
				// rentRolls.asOfDate = ["As of Date","unknown","1","4"]
				// rentRolls.fileName = ["File Name",fileName]
				// console.log("success");
				// rentRolls.parsed[1] = "true";
			}
		}
	} else {
		// console.log("not check and unknown");
		// console.log("rent rolls: ",rentRolls);
		rentRolls = [{"asOfDate":["As of Date","unknown","1","4"],"fileName":["File Name",fileName],"parsed":["Parse Status","false"]}]
		// throw new InvalidFileFormat(Response.REPLY_MSG.FIELDS_NOT_FOUND);
	}
	// console.log("returning");
	// console.log("RentRolls: ",JSON.stringify(rentRolls));
	return rentRolls;
}

function getFileType(fileBuffer) {
	var fileType = UNKNOWN_FILE_TYPE;
	var workbook = XLSX.read(fileBuffer, {type: 'buffer'});
	var sheetName = workbook.SheetNames[0];

	// If first sheet name is 'Summary' then use second sheet
	if(sheetName.toLowerCase() === SUMMARY_SHEET_NAME.toLowerCase()) {
		sheetName = workbook.SheetNames[1];
	}

	var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
	if(csv.length > 0) {
		var rows = csv.split("\n");

		for(var index = 0; index < rows.length; index++) {
			// Get cells
			var cells=rows[index].split("|");

			// Check each cell of the row
			for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
				var cellValue = cells[cellIndex];
				if(cellValue.toLowerCase().indexOf(UNITS_COLUMN_NAME.toLowerCase()) > -1) {
					fileType = YARDI_12_14_17_FILE_TYPE;
					break;
				} else if(cellValue.toLowerCase().indexOf(SUIT_ID_COLUMN_NAME.toLowerCase()) > -1) {

					fileType = MRI_17_FILE_TYPE;
					break;
				} else if (cellValue.toLowerCase().indexOf(TENANCY_SCHEDULE.toLowerCase())>-1) {
					fileType = YARDI_TS_12_14_17_FILE_TYPE;
					break;
				} else if (cellValue.toLowerCase().indexOf(LEASE_CHARGES.toLowerCase())>-1) {
					fileType = yardi121417_RR_1_16_18_FILE_TYPE;
					break;
				}
			}

			if(fileType !== UNKNOWN_FILE_TYPE) {
				break;
			}
		}
	}

	return fileType;
}