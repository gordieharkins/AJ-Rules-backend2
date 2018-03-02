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
var parser = require(path.resolve(__dirname, '../../../DAL/parser'));
var ErrorLogDALFile = require(path.resolve(__dirname, '../../../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var DAL = new parser();
var count = 0;
var util = new UtilityFunctions();
module.exports = YardiIE17;

//Class Constructor 
function YardiIE17() {

}

YardiIE17.prototype.getHeaders = function (yardiType,callback) {
    // console.log("in getting headers DAL");
    DAL.getFieldValues(yardiType, function(error, result) {
        if (error) {
        	console.log(error);
            ErrorLogDAL.addErrorLog(error);
        } else {
            // console.log("get field values result: ", result);
            callback(result);
        }
    }
)};

YardiIE17.prototype.parseFile = function (fileBuffer, fileName, originalFileName,type,result,cb) {
    var result2 = [];
    var yardiType = type;
    // var incomeExpense = {};
    // incomeExpense.address = null;
    // incomeExpense.IEYear = null;
    // incomeExpense.propertytaxes = null;

    // console.log("testing");
    // console.log("result::: ",JSON.stringify(result));
            // console.log(JSON.stringify(result[0]));
            //console.log("result::: ",JSON.stringify(result));
            // console.log("in array test: ",result[0].n.properties.columnHeaders.indexOf("Total Administrative Expenses"));
            // console.log("Row Headers: ",result[0].n.properties.rowHeaders[0].toLowerCase());
            result[0].n.properties.columnHeaders = result[0].n.properties.columnHeaders.map(function (e) { 
                return e.toLowerCase()
            });
            result[0].n.properties.rowHeaders = result[0].n.properties.rowHeaders.map(function (e) { 
                return e.toLowerCase()
            });
            
            var actualColumnIndex = null;

            var workbook = XLSX.read(fileBuffer, {type: 'buffer'});
            workbook.SheetNames.forEach(function(sheetName) {
                var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                var incomeExpense = {};
                incomeExpense.address = null;
                incomeExpense.IEYear = null;
                incomeExpense.propertytaxes = null;
                if (yardiType == "MULTIPLE_SHEETS" && (sheetName == "sch of exp" || sheetName == "cash flow")){
                    if (sheetName == "sch of exp"){
                        if (csv.length > 0) {
                            var rows = csv.split("\n");
                            for (var index = 0; index < rows.length; index++) {
                                // Get cells
                                var cells = rows[index].toLowerCase().split("|");
                                if (cells.length === 0) {
                                    continue;
                                }
                                var a;
                        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                            var valueCell = cells[cellIndex].toLowerCase().trim();
                            if (result[0].n.properties.columnHeaders.indexOf(valueCell)>-1)
                            {
                                // console.log("heading: ",valueCell);
                                // console.log("col values: ",cells[actualColumnIndex]);

                                a = valueCell.toLowerCase().replace(/\s/g, '');
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
                                // console.log(incomeExpense[a]);
                            }
                            // if (valueCell === taxesrealestate.toLowerCase()) {
                            //     var realEstateTaxes = [];
                            //     realEstateTaxes[0] = "Taxes  -  real estate";
                            //     realEstateTaxes[1] = util.getFloatValue(cells[actualColumnIndex]).toString();
                            //     tempIncomeExpense.realEstateTaxes = realEstateTaxes;
                            // }
                        }
                        // console.log("IE:::::::",JSON.stringify(incomeExpense));
                        //result2[0] = incomeExpense.taxesrealestate;
                    }
                }
                }else{
                    //cb(result2);
                }

                }else{
        
                if (csv.length > 0) {
                    // IE object
                    
                    
        
                    var filesPath = [];
                    // incomeExpense.address = null;
                    // incomeExpense.IEYear = null;
                    // incomeExpense.totalPropertyTaxes = null;
                    
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

                    // if(!isAddressFound && !isDateFound){
                    //     incomeExpense.address = null;
                    //     incomeExpense.IEYear = null;
                    //     incomeExpense.propertytaxes = null;
                    // }
        
                    for (var index = 0; index < rows.length; index++) {
                        // Get cells
                        var cells = rows[index].toLowerCase().split("|");
                        if (cells.length === 0) {
                            continue;
                        }
                        if (yardiType == "MULTIPLE_SHEETS"){
                            
                            addressIndex = cells.indexOf("statement of operations (cash)");
                            // console.log("address Index: ",addressIndex);
                            if (addressIndex > -1) {
                                var address = [];
                                address[0] = ADDRESS_LABEL;
                                address[1] = rows[index - 1].split("|")[addressIndex];
                                incomeExpense.address = address;
                                isAddressFound = true;
                            }
                            
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
                        
                    }else {
                        // check if address found or not.
                        if (!isAddressFound) {
                            for(cellIndex = 0; cellIndex < cells.length; cellIndex++){
                                var cellValue = cells[cellIndex].toLowerCase().trim();
                                // console.log("address: ",cellValue+" "+cellValue.indexOf("income"));
                                if(cellValue.indexOf("period") > -1){
                                    // console.log("found income, moving up");
                                    var address = [];
                                    address[0] = ADDRESS_LABEL;
                                    address[0] = rows[index - 2].split("|")[cellIndex];
                                    incomeExpense.address = address;
                                    incomeExpense.address
                                    isAddressFound = true;
                                    break;
                                }
                            }
                        }
        
                        // check if Date found or not.
                        if (!isDateFound) {
                            for(cellIndex = 0; cellIndex < cells.length; cellIndex++){
                                var cellValue = cells[cellIndex].toLowerCase().trim();
                                // console.log("IEYear: ",cellValue+" index of period: "+cellValue.indexOf("period"));
                                if(cellValue.indexOf("period") > -1){
                                    // console.log("found period, date found");
                                    var date = [];
                                    date[0] = DATE_LABEL;
                                    date[1] = cellValue;
                                    date[1] = date[1].split(" ");
                                    date[1] = date[1][date[1].length - 1];
                                    date[2] = '20';
                                    incomeExpense.IEYear = date;
                                    // console.log("extracted date: ",incomeExpense.IEYear);
                                    isDateFound = true;
                                    break;
                                }
                            }
                        }
                    }
                        if (!actualColumnsFound) {
                            for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                                var cellValue = cells[cellIndex];
                                // console.log("mytesting: ",JSON.stringify(result));
                                if (cellValue.toLowerCase().trim() === result[0].n.properties.rowHeaders[0].toLowerCase()) {
                                    // console.log("headers found!!",cellIndex);
                                    actualColumnIndex = cellIndex;
                                    actualColumnsFound = true;
                                    break;
                                }
                            }
                        }
        
                        if (!actualColumnsFound) {
                            continue;
                        }
                        // console.log("*checks*:actual,date,address ",actualColumnsFound+":"+isDateFound+":"+isAddressFound)
                        // console.log("date check: ",incomeExpense.IEYear);
                        // console.log("check address: ",incomeExpense.address);
                        for(var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                            var valueCell = cells[cellIndex].trim();
                           
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
                    }
                }
            }
                if(yardiType == "YardiIE17" && incomeExpense.propertytaxes !== null){
                    // console.log(yardiType);
                    // console.log("in not null if 001");
                    // console.log("incomeExpense.totalrealestatetaxes[1]",incomeExpense.totalrealestatetaxes[1]);
                    // console.log("incomeExpense.propertytaxes[1]",incomeExpense.propertytaxes[1]);
                    // console.log("incomeExpense.totalpropertyexpenses[1]",incomeExpense.totalpropertyexpenses[1]);
                    // console.log("incomeExpense.netincome[1]",incomeExpense.netincome[1]);
                    try{
                        incomeExpense.totalrealestatetaxes[1] = (parseFloat(incomeExpense.totalrealestatetaxes[1]) - parseFloat(incomeExpense.propertytaxes[1])).toString();
                        incomeExpense.totalpropertyexpenses[1] = (parseFloat(incomeExpense.totalpropertyexpenses[1]) - parseFloat(incomeExpense.propertytaxes[1])).toString();
                        incomeExpense.netincome[1] = (parseFloat(incomeExpense.netincome[1]) + parseFloat(incomeExpense.propertytaxes[1])).toString();
                    } catch(err){
                        console.log("Error: ", err);
                    }
                }

                else if(yardiType == "YardiIE16" && incomeExpense.totaltaxesfees !== null){
                    // console.log(yardiType);
                    // console.log(incomeExpense.totaltaxesfees);
                    // console.log("in not null if 002");
                    incomeExpense.totalotherincomeexp[1] = (parseFloat(incomeExpense.totalotherincomeexp[1]) - parseFloat(incomeExpense.totaltaxesfees[1])).toString();
                    incomeExpense.totaltenantoperatingexpense[1] = (parseFloat(incomeExpense.totaltenantoperatingexpense[1]) - parseFloat(incomeExpense.totaltaxesfees[1])).toString();
                    incomeExpense.netincome[1] = (parseFloat(incomeExpense.netincome[1]) + parseFloat(incomeExpense.totaltaxesfees[1])).toString();
                }
                else if(yardiType == "YARDI_B_COMPARISON_17" && incomeExpense.propertytaxes !== null){
                    // console.log(yardiType);
                    // console.log("myarr: ",incomeExpense);
                    incomeExpense.realestateothertaxes[1] = (parseFloat(incomeExpense.realestateothertaxes[1]) - parseFloat(incomeExpense.propertytaxes[1])).toString();
                    incomeExpense.totalexpenses[1] = (parseFloat(incomeExpense.totalexpenses[1]) - parseFloat(incomeExpense.propertytaxes[1])).toString();
                    incomeExpense.noinol[1] = (parseFloat(incomeExpense.noinol[1]) + parseFloat(incomeExpense.propertytaxes[1])).toString();
                }
                else if(yardiType == "YARDI_B_COMPARISON_12_13_14" && incomeExpense.propertytaxes !== null){
                    // console.log(yardiType);
                    incomeExpense.totalrealestatetaxes[1] = (parseFloat(incomeExpense.totalrealestatetaxes[1]) - parseFloat(incomeExpense.propertytaxes[1])).toString();
                    incomeExpense.totalpropertyexpenses[1] = (parseFloat(incomeExpense.totalpropertyexpenses[1]) - parseFloat(incomeExpense.propertytaxes[1])).toString();
                    incomeExpense.propertynetoperatingincome[1] = (parseFloat(incomeExpense.propertynetoperatingincome[1]) + parseFloat(incomeExpense.propertynetoperatingincome[1])).toString();
                }
                
                else{
                    // console.log("in else off 002");
                    // console.log(yardiType);
                    // console.log(incomeExpense.totaltaxesfees);
                }
        
                /**************************
                 * 
                 * add if else for yardi ie 16
                 * 
                 * 
                 * 
                 */


                if(Object.keys(incomeExpense).length !== 0){
                    try{
                        incomeExpense.IEYear[2] = (count++).toString();
                    } catch(err){
                        console.log("IE YEAR not found");
                    }
                    result2.push(incomeExpense);
                }
            });
            // console.log("umar here 001: ",JSON.stringify(result2));
            cb(result2);
}
