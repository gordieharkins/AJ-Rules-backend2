var path = require('path');
var InvalidFileFormat = require('../../errors/invalidFileFormat');
var Common = require(path.resolve(__dirname, '../RR/common'));
var Response = require(path.resolve(__dirname, '../../util/response'));

if (typeof require !== 'undefined') XLSX = require(path.resolve(__dirname, '../xlsx'));

module.exports = PropertiesParser;

var mapping = {};
var dictionary = {};
var savedMapping = {};
var rows;
var index = 0;
var result = [];
var targetDataFields = "";
var headers = "";
var isAllDataMapped = true;
var propertiesFilesPath = path.resolve(__dirname, '../../../public/properties/');

function PropertiesParser() {

}

//----------------------------------------------
// parsePropertiesFile
//----------------------------------------------
PropertiesParser.prototype.parsePropertiesFile = function(file, savedDataMapping) {
    targetDataFields = "";
    var workbook = XLSX.readFile(file);
    savedMapping = savedDataMapping[0].propertiesDataMapping;
    
    advancePropertyFileParser(workbook);
    
    var data = {};
    data.fileName = file;
    data.isAllDataMapped = isAllDataMapped;
    data.result = null;
    data.mapping = mapping;
    data.targetDataFields = targetDataFields;

    if (isAllDataMapped) {
        data.result = parseFile();
    }
    return data;
}
// ---------------------END---------------------

//----------------------------------------------
// mapAndParsePropertiesFile
//----------------------------------------------
PropertiesParser.prototype.mapAndParsePropertiesFile = function(fileName, mappingList) {
    
    result = [];
    var filePath = path.join(propertiesFilesPath, path.basename(fileName));
    var workbook = XLSX.readFile(filePath);
    
    advancePropertyFileParser(workbook);
    
    mapping = mappingList;
    savedMapping = mappingList;
    
    remappData(mapping);
    
    var data = parseFile();

    return data;
}
// ---------------------END---------------------

//----------------------------------------------
// Advance property file parser.
//----------------------------------------------
function advancePropertyFileParser(workbook) {

    // propertiesAttributes
    //----------------------------------------------
    dictionary['propertyName'] = -1;
    dictionary['propertyID'] = -1;
    dictionary['recordOwnerName'] = -1;
    dictionary['propertyType'] = -1;
    dictionary['propertyTypeNote'] = -1;

    // Constituents related to Property
    dictionary['aotcClientName'] = -1;
    dictionary['ppoName'] = -1;
    dictionary['assetManagerFirm'] = -1;
    dictionary['propertyManagementFirm'] = -1;
    dictionary['leasingAgentFirm'] = -1;
    dictionary['salesBrokerFirm'] = -1;
    dictionary['lawFirmReleases'] = -1;
    dictionary['propertyOwnerName'] = -1;
    dictionary['streetAddress'] = -1;
    dictionary['assessorAddress'] = -1;
    dictionary['city'] = -1;
    dictionary['state'] = -1;
    dictionary['zip'] = -1;
    dictionary['zoning'] = -1;
    dictionary['landSize'] = -1;
    dictionary['landSizeUnit'] = -1;
    dictionary['yearBuilt'] = -1;
    dictionary['yearRenovated'] = -1;
    dictionary['far'] = -1; // FAR Stands for?
    dictionary['assessingAuthority'] = -1;
    dictionary['assessmentRatio'] = -1;
    dictionary['assessorAccountNo'] = -1;
    dictionary['taxingAuthority'] = -1;
    dictionary['taxAccountNo'] = -1;
    dictionary['parcelId'] = -1;
    dictionary['mapCitation'] = -1;
    dictionary['deedCitation'] = -1;

    // (These are sometimes used by AAs)
    dictionary['section'] = -1;
    dictionary['block'] = -1;

    // LOT stands for?
    dictionary['lot'] = -1;
    dictionary['map'] = -1;

    // GRID stands for?
    dictionary['grid'] = -1;
    dictionary['parcel'] = -1;

    // In Sq Ft.
    dictionary['grossArea'] = -1;

    // In Sq Ft.
    dictionary['netLeasableArea'] = -1;
    // ---------------------END---------------------

    var isHeaderRowFound = 0;

    workbook.SheetNames.forEach(function(sheetName) {
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);

        if (csv.length === 0)
            return;

        rows = csv.split("\n");

        if (rows.length === 0)
            return;
        

        // Find header row.
        // Assuming any row which contains any of the following
        // data fields (Account Number, Owner Name, address) is header row.
        for (index = 0; index < rows.length; index++) {
            // Get columns
            var columns = rows[index].toLowerCase().split("|");
            
            // If not columns then don't proceed.
            if (columns.length === 0)
                continue;

            // If any of the following field exist then
            // assumption is this is header row.
            if (columns.indexOf("account number") > -1 ||
                columns.indexOf("accountnumber") > -1 ||
                columns.indexOf("owner name") > -1 ||
                columns.indexOf("ownername") > -1 ||
                columns.indexOf("address") > -1 ||
                columns.indexOf("type") > -1 ||
                columns.indexOf("reval year") > -1) {
                isHeaderRowFound = 1;

                if (columns.indexOf("address") === -1) {
                    isHeaderRowFound = 0;
                    throw new InvalidFileFormat(Response.REPLY_MSG.FIELDS_NOT_FOUND);
                }

                // Start - Set Indexes.
                dictionary['propertyName'] = getIndex('propertyName', columns, savedMapping.propertyName);
                dictionary['propertyID'] = getIndex('propertyID', columns, savedMapping.propertyID);
                dictionary['recordOwnerName'] = getIndex('recordOwnerName', columns, savedMapping.recordOwnerName);
                dictionary['propertyType'] = getIndex('propertyType', columns, savedMapping.propertyType);
                dictionary['propertyTypeNote'] = getIndex('propertyTypeNote', columns, savedMapping.propertyTypeNote);
                // Constituents related to Property
                dictionary['aotcClientName'] = getIndex('aotcClientName', columns, savedMapping.aotcClientName);
                dictionary['ppoName'] = getIndex('ppoName', columns, savedMapping.ppoName);
                dictionary['assetManagerFirm'] = getIndex('assetManagerFirm', columns, savedMapping.assetManagerFirm);
                dictionary['propertyManagementFirm'] = getIndex('propertyManagementFirm', columns, savedMapping.propertyManagementFirm);
                dictionary['leasingAgentFirm'] = getIndex('leasingAgentFirm', columns, savedMapping.leasingAgentFirm);
                dictionary['salesBrokerFirm'] = getIndex('salesBrokerFirm', columns, savedMapping.salesBrokerFirm);
                dictionary['lawFirmReleases'] = getIndex('lawFirmReleases', columns, savedMapping.lawFirmReleases);
                dictionary['propertyOwnerName'] = getIndex('propertyOwnerName', columns, savedMapping.propertyOwnerName);
                dictionary['streetAddress'] = getIndex('streetAddress', columns, savedMapping.streetAddress);
                dictionary['assessorAddress'] = getIndex('assessorAddress', columns, savedMapping.assessorAddress);
                dictionary['city'] = getIndex('city', columns, savedMapping.city);
                dictionary['state'] = getIndex('state', columns, savedMapping.state);
                dictionary['zip'] = getIndex('zip', columns, savedMapping.zip);
                dictionary['zoning'] = getIndex('zoning', columns, savedMapping.zoning);
                dictionary['landSize'] = getIndex('landSize', columns, savedMapping.landSize);
                dictionary['landSizeUnit'] = getIndex('landSizeUnit', columns, savedMapping.landSizeUnit);
                dictionary['yearBuilt'] = getIndex('yearBuilt', columns, savedMapping.yearBuilt);
                dictionary['yearRenovated'] = getIndex('yearRenovated', columns, savedMapping.yearRenovated);
                dictionary['far'] = getIndex('far', columns, savedMapping.far);
                dictionary['assessingAuthority'] = getIndex('assessingAuthority', columns, savedMapping.assessingAuthority);
                dictionary['assessmentRatio'] = getIndex('assessmentRatio', columns, savedMapping.assessmentRatio);
                dictionary['assessorAccountNo'] = getIndex('assessorAccountNo', columns, savedMapping.assessorAccountNo);
                dictionary['taxingAuthority'] = getIndex('taxingAuthority', columns, savedMapping.taxingAuthority);
                dictionary['taxAccountNo'] = getIndex('taxAccountNo', columns, savedMapping.taxAccountNo);
                dictionary['parcelId'] = getIndex('parcelId', columns, savedMapping.parcelId);
                dictionary['mapCitation'] = getIndex('mapCitation', columns, savedMapping.mapCitation);
                dictionary['deedCitation'] = getIndex('deedCitation', columns, savedMapping.deedCitation);
                // (These are sometimes used by AAs)
                dictionary['section'] = getIndex('section', columns, savedMapping.section);
                dictionary['block'] = getIndex('block', columns, savedMapping.block);
                dictionary['lot'] = getIndex('lot', columns, savedMapping.lot);
                dictionary['map'] = getIndex('map', columns, savedMapping.map);
                dictionary['grid'] = getIndex('grid', columns, savedMapping.grid);
                dictionary['parcel'] = getIndex('parcel', columns, savedMapping.parcel);
                dictionary['grossArea'] = getIndex('grossArea', columns, savedMapping.grossArea);
                dictionary['netLeasableArea'] = getIndex('netLeasableArea', columns, savedMapping.netLeasableArea);
                headers = columns;
                getUniqueTargetDataFields(headers);
                // When header row found then stop loop.
                break;
            }
        }
    });

    if(isHeaderRowFound === 0) {
        throw new InvalidFileFormat(Response.REPLY_MSG.FIELDS_NOT_FOUND);
    }
}
// ---------------------END---------------------

//----------------------------------------------
// remapp data.
// call this on complete mapping and
// then call
//----------------------------------------------
function remappData(data) {
    for (var key in data) {
        dictionary[key] = getIndex(key, headers, data[key]);
    }
}
// ---------------------END---------------------

//----------------------------------------------
// - gets unique target data fields.
//----------------------------------------------
function getUniqueTargetDataFields(columns) {
    for (c = 0; c < columns.length; c++) {
        if (targetDataFields.indexOf(columns[c]) === -1) {
            if (targetDataFields.length > 0) {
                targetDataFields = targetDataFields + "|" + columns[c];
            } else {
                targetDataFields = columns[c];
            }
        }
    }
}
// ---------------------END---------------------

//----------------------------------------------
// Find Index.
// Later we may need to extend this function to
// check other names for column.
//----------------------------------------------
function getIndex(columnName, columns, attributeName) {

    var position = -1;

    if (attributeName === null || attributeName === undefined || attributeName.length === 0) {
        mapping[columnName] = "";
        isAllDataMapped = false;
        return position;
    }

    var attributes = attributeName.split("|");
    var count = 0;

    while (position === -1 && count < attributes.length) {
        position = columns.indexOf(attributes[count].toLowerCase());
        count = count + 1;
    }

    if (position === -1) {
        mapping[columnName] = "";
        isAllDataMapped = false;
    } else {
        mapping[columnName] = columns[position];
    }

    return position;
}
// ---------------------END---------------------

//----------------------------------------------
// Find Index.
// Later we may need to extend this function to 
// check other names for column.
//----------------------------------------------
function parseFile() {
    // Index + 1 is because that index count already break on header so we will get data below header
    for (var count = index + 1; count < rows.length; count++) {

        var columns = rows[count].split("|");

        // If not columns then don't proceed.
        if (columns.length === 0)
            continue;

        var property = {};

        if (columns[dictionary['propertyName']] === undefined) {
            continue;
        }

        // Set propertyName.    
        if (dictionary['propertyName'] !== -1 && columns.length > dictionary['propertyName']) {
            property.propertyName = columns[dictionary['propertyName']];
        } else {
            property.propertyName = "";
        }

        // Set propertyID.  
        if (dictionary['propertyID'] !== -1 && columns.length > dictionary['propertyID']) {
            property.propertyID = columns[dictionary['propertyID']];
        } else {
            property.propertyID = "";
        }

        // Set recordOwnerName. 
        if (dictionary['recordOwnerName'] !== -1 && columns.length > dictionary['recordOwnerName']) {
            property.recordOwnerName = columns[dictionary['recordOwnerName']];
        } else {
            property.recordOwnerName = "";
        }

        // Set propertyType.    
        if (dictionary['propertyType'] !== -1 && columns.length > dictionary['propertyType']) {
            property.propertyType = columns[dictionary['propertyType']];
        } else {
            property.propertyType = "";
        }

        // Set propertyTypeNote.    
        if (dictionary['propertyTypeNote'] !== -1 && columns.length > dictionary['propertyTypeNote']) {
            property.propertyTypeNote = columns[dictionary['propertyTypeNote']];
        } else {
            property.propertyTypeNote = "";
        }

        // Constituents related to Property         
        // Set aotcClientName.  
        if (dictionary['aotcClientName'] !== -1 && columns.length > dictionary['aotcClientName']) {
            property.aotcClientName = columns[dictionary['aotcClientName']];
        } else {
            property.aotcClientName = "";
        }

        // Set ppoName. 
        if (dictionary['ppoName'] !== -1 && columns.length > dictionary['ppoName']) {
            property.ppoName = columns[dictionary['ppoName']];
        } else {
            property.ppoName = "";
        }

        // Set assetManagerFirm.    
        if (dictionary['assetManagerFirm'] !== -1 && columns.length > dictionary['assetManagerFirm']) {
            property.assetManagerFirm = columns[dictionary['assetManagerFirm']];
        } else {
            property.assetManagerFirm = "";
        }

        // Set propertyManagementFirm.  
        if (dictionary['propertyManagementFirm'] !== -1 && columns.length > dictionary['propertyManagementFirm']) {
            property.propertyManagementFirm = columns[dictionary['propertyManagementFirm']];
        } else {
            property.propertyManagementFirm = "";
        }

        // Set leasingAgentFirm.    
        if (dictionary['leasingAgentFirm'] !== -1 && columns.length > dictionary['leasingAgentFirm']) {
            property.leasingAgentFirm = columns[dictionary['leasingAgentFirm]']];
        } else {
            property.leasingAgentFirm = "";
        }

        // Set salesBrokerFirm. 
        if (dictionary['salesBrokerFirm'] !== -1 && columns.length > dictionary['salesBrokerFirm']) {
            property.salesBrokerFirm = columns[dictionary['salesBrokerFirm']];
        } else {
            property.salesBrokerFirm = "";
        }

        // Set lawFirmReleases. 
        if (dictionary['lawFirmReleases'] !== -1 && columns.length > dictionary['lawFirmReleases']) {
            property.lawFirmReleases = columns[dictionary['lawFirmReleases']];
        } else {
            property.lawFirmReleases = "";
        }

        // Set propertyManagementFirm.  
        if (dictionary['propertyOwnerName'] !== -1 && columns.length > dictionary['propertyOwnerName']) {
            property.propertyOwnerName = columns[dictionary['propertyOwnerName']];
        } else {
            property.propertyOwnerName = "";
        }

        // Set streetAddress.   
        if (dictionary['streetAddress'] !== -1 && columns.length > dictionary['streetAddress']) {
            property.streetAddress = columns[dictionary['streetAddress']];
        } else {
            property.streetAddress = "";
        }

        // Set assessorAddress. 
        if (dictionary['assessorAddress'] !== -1 && columns.length > dictionary['assessorAddress']) {
            property.assessorAddress = columns[dictionary['assessorAddress']];
        } else {
            property.assessorAddress = "";
        }

        // Set city.    
        if (dictionary['city'] !== -1 && columns.length > dictionary['city']) {
            property.city = columns[dictionary['city']];
        } else {
            property.city = "";
        }

        // Set state.   
        if (dictionary['state'] !== -1 && columns.length > dictionary['state']) {
            property.state = columns[dictionary['state']];
        } else {
            property.state = "";
        }

        // Set zip. 
        if (dictionary['zip'] !== -1 && columns.length > dictionary['zip']) {
            property.zip = columns[dictionary['zip']];
        } else {
            property.zip = "";
        }

        // Set zoning.  
        if (dictionary['zoning'] !== -1 && columns.length > dictionary['zoning']) {
            property.zoning = columns[dictionary['zoning']];
        } else {
            property.zoning = "";
        }

        // Set landSize.    
        if (dictionary['landSize'] !== -1 && columns.length > dictionary['landSize']) {
            property.landSize = columns[dictionary['landSize']];
        } else {
            property.landSize = "";
        }

        // Set landSizeUnit.    
        if (dictionary['landSizeUnit'] !== -1 && columns.length > dictionary['landSizeUnit']) {
            property.landSizeUnit = columns[dictionary['landSizeUnit']];
        } else {
            property.landSizeUnit = "";
        }

        // Set yearBuilt.   
        if (dictionary['yearBuilt'] !== -1 && columns.length > dictionary['yearBuilt']) {
            property.yearBuilt = columns[dictionary['yearBuilt']];
        } else {
            property.yearBuilt = "";
        }

        // Set yearRenovated.   
        if (dictionary['yearRenovated'] !== -1 && columns.length > dictionary['yearRenovated']) {
            property.yearRenovated = columns[dictionary['yearRenovated']];
        } else {
            property.yearRenovated = "";
        }

        // Set far. 
        if (dictionary['far'] !== -1 && columns.length > dictionary['far']) {
            property.far = columns[dictionary['far']];
        } else {
            property.far = "";
        }

        // Set assessingAuthority.  
        if (dictionary['assessingAuthority'] !== -1 && columns.length > dictionary['assessingAuthority']) {
            property.assessingAuthority = columns[dictionary['assessingAuthority']];
        } else {
            property.assessingAuthority = "";
        }

        // Set assessmentRatio. 
        if (dictionary['assessmentRatio'] !== -1 && columns.length > dictionary['assessmentRatio']) {
            property.assessmentRatio = columns[dictionary['assessmentRatio']];
        } else {
            property.assessmentRatio = "";
        }

        // Set assessorAccountNo.   
        if (dictionary['assessorAccountNo'] !== -1 && columns.length > dictionary['assessorAccountNo']) {
            property.assessorAccountNo = columns[dictionary['assessorAccountNo']];
        } else {
            property.assessorAccountNo = "";
        }

        // Set taxingAuthority. 
        if (dictionary['taxingAuthority'] !== -1 && columns.length > dictionary['taxingAuthority']) {
            property.taxingAuthority = columns[dictionary['taxingAuthority']];
        } else {
            property.taxingAuthority = "";
        }

        // Set taxAccountNo.
        if (dictionary['taxAccountNo'] !== -1 && columns.length > dictionary['taxAccountNo']) {
            property.taxAccountNo = columns[dictionary['taxAccountNo']];
        } else {
            property.taxAccountNo = "";
        }

        // Set parcelId.    
        if (dictionary['parcelId'] !== -1 && columns.length > dictionary['parcelId']) {
            property.parcelId = columns[dictionary['parcelId']];
        } else {
            property.parcelId = "";
        }

        // Set mapCitation. 
        if (dictionary['mapCitation'] !== -1 && columns.length > dictionary['mapCitation']) {
            property.mapCitation = columns[dictionary['mapCitation']];
        } else {
            property.mapCitation = "";
        }

        // Set deedCitation.    
        if (dictionary['deedCitation'] !== -1 && columns.length > dictionary['deedCitation']) {
            property.deedCitation = columns[dictionary['deedCitation']];
        } else {
            property.deedCitation = "";
        }

        // (These are sometimes used by AAs)            
        // Set section. 
        if (dictionary['section'] !== -1 && columns.length > dictionary['section']) {
            property.section = columns[dictionary['section']];
        } else {
            property.section = "";
        }

        // Set block.   
        if (dictionary['block'] !== -1 && columns.length > dictionary['block']) {
            property.block = columns[dictionary['block']];
        } else {
            property.block = "";
        }

        // Set lot. 
        if (dictionary['lot'] !== -1 && columns.length > dictionary['lot']) {
            property.lot = columns[dictionary['lot']];
        } else {
            property.lot = "";
        }

        // Set map. 
        if (dictionary['map'] !== -1 && columns.length > dictionary['map']) {
            property.map = columns[dictionary['map']];
        } else {
            property.map = "";
        }

        // Set grid.
        if (dictionary['grid'] !== -1 && columns.length > dictionary['grid']) {
            property.grid = columns[dictionary['grid']];
        } else {
            property.grid = "";
        }

        // Set parcel.  
        if (dictionary['parcel'] !== -1 && columns.length > dictionary['parcel']) {
            property.parcel = columns[dictionary['parcel']];
        } else {
            property.parcel = "";
        }

        // Set grossArea.   
        if (dictionary['grossArea'] !== -1 && columns.length > dictionary['grossArea']) {
            property.grossArea = columns[dictionary['grossArea']];
        } else {
            property.grossArea = "";
        }

        // Set netLeasableArea. 
        if (dictionary['netLeasableArea'] !== -1 && columns.length > dictionary['netLeasableArea']) {
            property.netLeasableArea = columns[dictionary['netLeasableArea']];
        } else {
            property.netLeasableArea = "";
        }
        property.state = 1;

        if(property.streetAddress !== '' && property.streetAddress.toLowerCase() !== 'grand total') {
            result.push(property);
        }
    }
    return result;
}
// ---------------------END---------------------
