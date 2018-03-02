const IMAGES_DIR_NAME = 'CompsImages';
const THUMBNAILS_DIR_NAME = IMAGES_DIR_NAME + '/Thumbnails';
const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 300;

var path = require('path');
var busBoy = require('busboy');
var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require('request');
var url = require('url');
var async = require('async');
var _ = require('underscore');
var SalesCompsDAL = require(path.resolve(__dirname, '../DAL/salesComps'));
var DAL = new SalesCompsDAL();
var ErrorLogDALFile = require(path.resolve(__dirname, '../DAL/errorLog'));
var ErrorLogDAL = new ErrorLogDALFile();
var InvalidFileFormat = require('./errors/invalidFileFormat');
var Response = require(path.resolve(__dirname, './util/response'));
var Zillow = require("node-zillow");
// var zillow = new Zillow('X1-ZWz1fzofsvhrm3_91vx7');
// var zillow = new Zillow('X1-ZWz197fgjg2ux7_9vdv4');
var zillow = new Zillow('X1-ZWz1fzojqxpvkb_94p25');
var loginUserName = 'Ali'; // Infutre will get logged in user name
var propertyImagesPath = path.resolve(__dirname, '../public/' + IMAGES_DIR_NAME);
var thumbnailsPath = path.resolve(__dirname, '../public/' + THUMBNAILS_DIR_NAME);

module.exports = BLL;

// Class Constructor
function BLL() {

}


//----------------------------------------------
// getZillowProperties DeepComps
//----------------------------------------------
BLL.prototype.getZDeepCompsProperties = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    var parameters1st = {
        rentzestimate: true, // Used to get rent details of prop if available
        address: data.address,
        citystatezip: data.city + ", " + data.state,
    };

    var parameters2nd = {
        rentzestimate: true, // Used to get rent details of prop if available
        address: data.address,
        citystatezip: data.city + ", " + data.state,
        count: 25,
    };

    // First Call used to get zpid
    zillow.get('GetSearchResults', parameters2nd)
        .then(function(results) {

            // 2nd call used to get comps
            parameters2nd.zpid = results.response.results.result[0].zpid[0]
            if (parameters2nd.zpid) {

                zillow.get('GetDeepComps', parameters2nd)
                    .then(function(result2) {
                        try {
                            var data = {
                                principal: zillowObjectSimplifier(result2.response.properties.principal),
                                comparables: zillowObjectSimplifier(result2.response.properties.comparables[0].comp)
                            }
                            // result2 = zillowObjectSimplifier(result2)
                        } catch (error) {
                            error.userName = loginUserName;
                            ErrorLogDAL.addErrorLog(error);
                            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_FAIL, data, res);
                            return;
                        }
                        Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, data, res);
                    });
            } else {
                Response.sendResponse(false, Response.REPLY_MSG.ZILLOW_ID_NA, null, res);
            }
        });
}
// ---------------------END---------------------



//----------------------------------------------
// saveZillowProps agaist a property
//----------------------------------------------
BLL.prototype.addCompsToProp = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    var userId = data.user[0].userId;
    DAL.addCompsToProp(data.body, userId, function(error, propertyImages) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        }
        Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, null, res);
        // savePropertyImages(propertyImages, data.userId);
    });
}
// ---------------------END---------------------

//----------------------------------------------
// saveZillowProps agaist a property
//----------------------------------------------
BLL.prototype.addCompsToPropManual = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    data.userId = parseInt(data.userId);
    DAL.addCompsToPropManual(data, function(error, propertyImages) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        }
        Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, null, res);
        // savePropertyImages(propertyImages, data.userId);
    });
}
// ---------------------END---------------------

//----------------------------------------------
// deleteCompsFromProperty agaist a property
//----------------------------------------------
BLL.prototype.deleteCompsFromProperty = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.deleteCompsFromProperty(data.body, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
            return;
        }
        Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, result, res);
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getSavedComps
//----------------------------------------------
BLL.prototype.getZillowPropImage = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    request(data.propertyLink, function (error, response, body) {
        var result = {
            mainImage: null
        };

        body = JSON.stringify(body);

        var match = body.match(/<img[^>]+src=\\"(https:\/\/[^">]+)"/g);

            var mainImage = match[0].match(/https(.*?)(jpg|png)/g);
        // console.log(mainImage);
            result.mainImage = mainImage[0]



        Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
    });
}
// ---------------------END---------------------

function zillowObjectSimplifier(props) {
    var finalProps = [];

    for (var i = 0; i < props.length; i++) {

        var prop = initializeZillowObject();

        if (props[i].$ !== undefined) {
            prop.compScore = props[i].$.score;
        }

        prop.zpid = props[i].zpid !== undefined ? props[i].zpid[0] : "";

        if (props[i].address !== undefined && props[i].address[0].street !== undefined) {

            var zillowAddress = props[i].address[0];

            var address = zillowAddress.street[0] + ", " +
                (zillowAddress.city !== undefined ? zillowAddress.city[0] : "") + ", " +
                (zillowAddress.state !== undefined ? zillowAddress.state[0] : "") + ", " +
                (zillowAddress.zipcode !== undefined ? zillowAddress.zipcode[0] : "");

            prop.address = address;

            prop.latitude = zillowAddress.latitude !== undefined ? zillowAddress.latitude[0] : "";
            prop.longitude = zillowAddress.longitude !== undefined ? zillowAddress.longitude[0] : "";
        }

        if(props[i].links !== undefined){
            var links1 = props[i].links[0];

            prop.linksHomeDetails = links1.homedetails? links1.homedetails[0]: "";
            prop.linksGraphsAndData = links1.graphsanddata? links1.graphsanddata[0]: "";
            prop.linksMapThisHome = links1.mapthishome? links1.mapthishome[0]: "";
            prop.linksComparables = links1.comparables? links1.comparables[0]: "";
        }

        prop.taxAssessmentYear = props[i].taxAssessmentYear !== undefined ? props[i].taxAssessmentYear[0] : "";
        prop.taxAssessment = props[i].taxAssessment !== undefined ? props[i].taxAssessment[0] : "";
        prop.yearBuilt = props[i].yearBuilt !== undefined ? props[i].yearBuilt[0] : "";
        prop.lotSizeSqFt = props[i].lotSizeSqFt !== undefined ? props[i].lotSizeSqFt[0] : "";
        prop.finishedSqFt = props[i].finishedSqFt !== undefined ? props[i].finishedSqFt[0] : "";
        prop.bathrooms = props[i].bathrooms !== undefined ? props[i].bathrooms[0] : "";
        prop.bedrooms = props[i].bedrooms !== undefined ? props[i].bedrooms[0] : "";
        prop.lastSoldDate = props[i].lastSoldDate !== undefined ? props[i].lastSoldDate[0] : "";
        prop.lastSoldPrice = props[i].lastSoldPrice !== undefined ? props[i].lastSoldPrice[0]._ : "";

        // Zestimate
        if (props[i].zestimate !== undefined) {

            var zestimate = props[i].zestimate[0];

            prop.amount = zestimate.amount !== undefined ? zestimate.amount[0]._ : "";

            if (zestimate['last-updated'] !== undefined) {

                var lastUpdate = zestimate['last-updated'];
                prop.lastUpdate = lastUpdate !== undefined ? lastUpdate[0] : "";
            }

            prop.oneWeekChange = zestimate.oneWeekChange !== undefined ? zestimate.oneWeekChange[0].$.deprecated : "";
            prop.valueChange = zestimate.valueChange !== undefined ? zestimate.valueChange[0]._ : "";
            prop.valueChangeDuration = zestimate.valueChange !== undefined ? zestimate.valueChange[0].$.duration : "";


            if (zestimate.valuationRange !== undefined) {

                var valuationRangeLow = zestimate.valuationRange[0];

                prop.valuationRangeLow = valuationRangeLow.low !== undefined ? valuationRangeLow.low[0]._ : "";
                prop.valuationRangeHigh = valuationRangeLow.high !== undefined ? valuationRangeLow.high[0]._ : "";
            }

            prop.percentile = zestimate.percentile !== undefined ? zestimate.percentile[0] : "";
        }

        // RentZestimate
        if (props[i].rentzestimate !== undefined) {

            var rentZestimate = props[i].rentzestimate[0];
            prop.rentAmount = rentZestimate.amount !== undefined ? rentZestimate.amount[0]._ : "";

            if (rentZestimate['last-updated'] !== undefined) {

                var rentLastUpdate = rentZestimate['last-updated'];
                prop.rentLastUpdate = rentLastUpdate !== undefined ? rentLastUpdate[0] : "";
            }

            prop.restLastWeekChange = rentZestimate.oneWeekChange !== undefined ? rentZestimate.oneWeekChange[0].$.deprecated : "";
            prop.rentValueChange = rentZestimate.valueChange !== undefined ? rentZestimate.valueChange[0]._ : "";
            prop.rentValueChangeDuration = rentZestimate.valueChange !== undefined ? rentZestimate.valueChange[0].$.duration : "";

            if (rentZestimate.valuationRange !== undefined) {

                var rentValuationRange = rentZestimate.valuationRange[0]
                prop.rentValuationRangeLow = rentValuationRange.low !== undefined ? rentValuationRange.low[0]._ : "";
                prop.rentValuationRangeHigh = rentValuationRange.high !== undefined ? rentValuationRange.high[0]._ : "";
            }
        }

        // localRealEstate
        if (props[i].localRealEstate[0] !== undefined && props[i].localRealEstate[0].region[0] !== undefined) {

            var localRealEstate = props[i].localRealEstate[0].region[0]

            if (localRealEstate.$ !== undefined) {

                prop.localRealEstateRegionName = localRealEstate.$.name !== undefined ? localRealEstate.$.name : "";
                prop.localRealEstateRegionId = localRealEstate.$.id !== undefined ? localRealEstate.$.id : "";
                prop.localRealEstateRegionType = localRealEstate.$.type !== undefined ? localRealEstate.$.type : "";
            }

            prop.localRealEstateRegionZindexValue = localRealEstate.zindexValue[0] !== undefined ? localRealEstate.zindexValue[0] : "";

            if (localRealEstate.links[0] !== undefined) {

                var links = localRealEstate.links[0];

                prop.linksOverview = links.overview[0] !== undefined ? links.overview[0] : "";
                prop.linksForSaleByOwner = links.forSaleByOwner[0] !== undefined ? links.forSaleByOwner[0] : "";
                prop.linksForSale = links.forSale[0] !== undefined ? links.forSale[0] : "";
            }
        }

        finalProps.push(prop);
    }
    return finalProps;
}

function initializeZillowObject() {
    var prop = {};

    prop.compScore = "";
    prop.zpid = "";
    prop.address = "";
    prop.latitude = "";
    prop.longitude = "";
    prop.taxAssessmentYear = "";
    prop.taxAssessment = "";
    prop.yearBuilt = "";
    prop.lotSizeSqFt = "";
    prop.finishedSqFt = "";
    prop.bathrooms = "";
    prop.bedrooms = "";
    prop.lastSoldDate = ""
    prop.lastSoldPrice = ""
    prop.amount = "";
    prop.lastUpdate = "";
    prop.oneWeekChange = "";
    prop.valueChange = "";
    prop.valueChangeDuration = "";
    prop.valuationRangeLow = "";
    prop.valuationRangeHigh = "";
    prop.percentile = "";
    prop.bathrooms = "";
    prop.rentLastUpdate = "";
    prop.restLastWeekChange = "";
    prop.rentValueChange = "";
    prop.rentValueChangeDuration = "";
    prop.rentValuationRangeLow = "";
    prop.rentValuationRangeHigh = "";
    prop.localRealEstateRegionName = "";
    prop.localRealEstateRegionId = "";
    prop.localRealEstateRegionType = "";
    prop.localRealEstateRegionZindexValue = "";
    prop.linksHomeDetails = "";
    prop.linksGraphsAndData = "";
    prop.linksMapThisHome = "";
    prop.linksComparables = "";
    prop.linksOverview = "";
    prop.linksForSaleByOwner = "";
    prop.linksForSale = "";

    return prop;
}

function savePropertyImages(propertyImages, userId){

    if(propertyImages[0] !== undefined && propertyImages[0].propertyImages !== undefined && propertyImages[0].propertyImages.length > 0){
        try{
            var propertyImagesArr = propertyImages[0].propertyImages;

            async.forEachOf(propertyImagesArr, function(image, k, callbackAsync) {
                var img = image.imageFileName;

                if(img !== null && img.indexOf('PropertyImages')) {

                    var name = path.basename(img);
                    var date = new Date();
                    var uniqueName = userId + '_' + date.getTime() + '_' + name;

                    var mainFile = path.join(propertyImagesPath, uniqueName);
                    var thumbnailFile = path.join(thumbnailsPath, uniqueName);

                    var request = https.get(img, function(res){
                        var imagedata = '';
                        res.setEncoding('binary')

                        res.on('data', function(chunk){
                            imagedata += chunk;
                        })

                        res.on('end', function(){
                            fs.writeFile(mainFile, imagedata, 'binary', function(err){
                                if (err) throw err
                                var newFileName = path.join(IMAGES_DIR_NAME, uniqueName);

                                DAL.updatePropertyImageFileName(newFileName, image.id, function(error, result) {
                                    if (error) {
                                        error.userName = loginUserName;
                                        ErrorLogDAL.addErrorLog(error);
                                        return;
                                    }
                                    callbackAsync();
                                });
                            })
                        })
                    })
                } else {
                    callbackAsync();
                }
            }, function() {
                // console.log('All images saved.')
            });
        } catch(error){
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            return;
        }
    }
}

//----------------------------------------------
// getSavedComps
//----------------------------------------------
BLL.prototype.getSavedComps = function(data, res) {
    if (!data.body || data.body === null || data.body === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }


    DAL.getSubjectPropertyData(data.body, function(error, results) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, error, null, res);
            return;
        } else{

            var finalResult = {
                subjectProperty: {},
                comparables: []
            }

            finalResult.subjectProperty = createSubjectPropertyObject(results);
            // console.log(finalResult.subjectProperty);

            DAL.getSavedComps(data.body, function(error, result) {
                if (error) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
                    Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                    return;
                } else if (result.length == 0){
                    Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
                }else {
                    finalResult.comparables = result;
                    async.forEachOf(finalResult.comparables, function(property, i, callbackMain) {
                        var parameters1st = {
                            rentzestimate: true, // Used to get rent details of prop if available
                            address: property.properties.ownerAddress,
                            citystatezip: property.properties.zipCode,
                        };
                        zillow.get('GetDeepSearchResults', parameters1st)
                            .then(function(zillowResults) {
                                // console.log(zillowResults.response.results.result[0].address[0].street, zillowResults.response.results.result[0].bathrooms, zillowResults.response.results.result[0].bedrooms);
                                if(zillowResults.response != undefined){
                                    var zillowData = zillowResults.response.results.result[0];
                                    property.properties["bathrooms"] = zillowData.bathrooms !== undefined ? zillowData.bathrooms[0] : "";
                                    property.properties["bedrooms"] = zillowData.bedrooms !== undefined ? zillowData.bedrooms[0] : "";
                                    property.properties["salesPerSqFt"] = property.properties.consideration / property.properties.buildingArea;
                                }
                                callbackMain();
                        });
                    }, function (err) {
                            finalResult.comparables = finalizingComparables(finalResult.comparables, finalResult.subjectProperty);
                            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
                    });
                }
            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// getComparables
//----------------------------------------------
BLL.prototype.getComparables = function(data, res) {

    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getSubjectPropertyData(data.body, function(error, results) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, error, null, res);
            return;
        } else{

            var finalResult = {
                subjectProperty: {},
                highProperties: [],
                lowProperties: []
            }

            finalResult.subjectProperty = createSubjectPropertyObject(results);

            DAL.getComparables(results, data.body.queryCriteria, function(error, comparables) {
                if (error) {
                    error.userName = loginUserName;
                    ErrorLogDAL.addErrorLog(error);
                    Response.sendResponse(false, error, null, res);
                    return;
                } else{
                    finalResult.highProperties = comparables.highProperties;
                    finalResult.lowProperties = comparables.lowProperties;
                    var zillowHighData = [];
                    var zillowLowData = [];
                    var comparablesZpids = [];
                    var highPropertiesZpids = [];
                    var lowPropertiesZpids = [];

                    async.parallel([
                        function(callback) {

                            var parameters = {
                                rentzestimate: true, // Used to get rent details of prop if available
                                address: results[0].properties.ownerAddress,
                                citystatezip: results[0].properties.zipCode,
                            };

                            zillow.get('GetDeepSearchResults', parameters)
                            .then(function(zillowResults) {
                                try {
                                    parameters.zpid = zillowResults.response.results.result[0].zpid[0];
                                    parameters.count = 25;
                                    zillow.get('GetDeepComps', parameters)
                                    .then(function(zillowResults1) {
                                        try {
                                            var zillowComparables = zillowResults1.response.properties.comparables[0].comp;
                                            for(var i = 0; i < zillowComparables.length; i++){
                                                comparablesZpids.push(zillowComparables[i].zpid[0]);
                                            }
                                            callback();
                                        } catch (error) {
                                            console.log(error);
                                            callback();
                                        }
                                     });
                                } catch (error) {
                                    console.log(error);
                                    callback();
                                }
                            });
                        },
                        function(callback) {
                            var counter1 = 0;
                            var flag = true;
                            if(finalResult.highProperties.length == 0){
                                callback();
                            } else {
                                async.forEachOf(finalResult.highProperties, function(property, i, callbackMain) {
                                    var parameters1st = {
                                        rentzestimate: true, // Used to get rent details of prop if available
                                        address: property.properties.ownerAddress,
                                        citystatezip: property.properties.zipCode,
                                    };
                                    zillow.get('GetDeepSearchResults', parameters1st)
                                        .then(function(zillowResults) {
                                            if(zillowResults.response != undefined){
                                                var zillowData = zillowResults.response.results.result[0];
                                                property.properties["bathrooms"] = zillowData.bathrooms !== undefined ? zillowData.bathrooms[0] : "";
                                                property.properties["bedrooms"] = zillowData.bedrooms !== undefined ? zillowData.bedrooms[0] : "";
                                                property.properties["salesPerSqFt"] = property.properties.consideration / property.properties.buildingArea;
                                            }
                                            callbackMain();
                                    });
                                }, function (err) {
                                        callback();
                                });
                            }
                        },
                        function(callback) {
                            var counter = 0;
                            var flag = true;
                            if(finalResult.lowProperties.length == 0){
                                callback();
                            } else {
                                async.forEachOf(finalResult.lowProperties, function(property, i, callbackMain) {
                                    var parameters1st = {
                                        rentzestimate: true, // Used to get rent details of prop if available
                                        address: property.properties.ownerAddress,
                                        citystatezip: property.properties.zipCode,
                                    };
                                    zillow.get('GetDeepSearchResults', parameters1st)
                                        .then(function(zillowResults) {
                                            if(zillowResults.response != undefined){
                                                var zillowData = zillowResults.response.results.result[0];
                                                property.properties["bathrooms"] = zillowData.bathrooms !== undefined ? zillowData.bathrooms[0] : "";
                                                property.properties["bedrooms"] = zillowData.bedrooms !== undefined ? zillowData.bedrooms[0] : "";
                                                property.properties["salesPerSqFt"] = property.properties.consideration / property.properties.buildingArea;
                                            }
                                            callbackMain();
                                    });
                                }, function (err) {
                                        callback();
                                });
                            }
                        }
                    ],
                    function() {
                        finalResult.highProperties = finalizingComparables(finalResult.highProperties, finalResult.subjectProperty);
                        finalResult.lowProperties = finalizingComparables(finalResult.lowProperties, finalResult.subjectProperty);
                        Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
                    });
                }

            });
        }
    });
}
// ---------------------END---------------------

//----------------------------------------------
// saveSubjectPropertyUpdatedData
//----------------------------------------------
BLL.prototype.saveSubjectPropertyUpdatedData = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    var improvement = data.data.improvement.value;
    var expenditure = data.data.expenditure.value
    if(data.data.improvement.value == "Yes"){
        var improvementDetails = [];
        for(var i = 0; i < data.data.improvement.options.length; i++){
            var evidenceId = "";
            improvementDetails.push(data.data.improvement.options[i].explanation);
            for(var j = 0; j < data.data.improvement.options[i].evidenceId.length; j++){
                if(j == 0){
                    evidenceId += data.data.improvement.options[i].evidenceId[j];
                } else {
                    evidenceId += "," + data.data.improvement.options[i].evidenceId[j];
                }
            }

            if(evidenceId == ""){
                improvementDetails.push("");
            } else {
                improvementDetails.push(evidenceId);
            }
        }

        data.data["improvementDetails"] = improvementDetails;
    }

    if(data.data.expenditure.value == "Yes"){
        var expenditureDetails = [];
        for(var i = 0; i < data.data.expenditure.options.length; i++){
            var evidenceId = "";
            expenditureDetails.push(data.data.expenditure.options[i].explanation);

            for(var j = 0; j < data.data.expenditure.options[i].evidenceId.length; j++){
                if(j == 0){
                    evidenceId += data.data.expenditure.options[i].evidenceId[j];
                } else {
                    evidenceId += "," + data.data.expenditure.options[i].evidenceId[j];
                }
            }

            if(evidenceId == ""){
                expenditureDetails.push("");
            } else {
                expenditureDetails.push(evidenceId);
            }
        }

        data.data["expenditureDetails"] = expenditureDetails;
    }


    delete data.data.improvement;
    delete data.data.expenditure;

    data.data["improvement"] = improvement;
    data.data["expenditure"] = expenditure;

    data.userId = parseInt(data.userId);
    DAL.saveSubjectPropertyUpdatedData(data, function(error, propertyImages) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
            return;
        }
        Response.sendResponse(true, Response.REPLY_MSG.SAVE_SUCCESS, null, res);
        // savePropertyImages(propertyImages, data.userId);
    });
}
// ---------------------END---------------------

function createSubjectPropertyObject(results){
    var subjectProperty = {
                        jurisdictionData: {},
                        zillowData: {},
                        properties: results[0].properties
                    }
                    //
    if(results[0].address != null){
        var address = results[0].address.split(",");
        var street = address[0];
        var city = address[1].split(" ");
        var state = address[2].split(" ");
        var parameters1st = {
            rentzestimate: true, // Used to get rent details of prop if available
            address: street,
            citystatezip: city[1] + ", " + state[1],
        };
        var zillowResult = {};
        zillow.get('GetDeepSearchResults', parameters1st)
            .then(function(zillowResults) {
                // console.log(zillowResults.response.results.result);
                if(zillowResults.message.code == 0){
                    zillowResult = zillowResults.response.results.result;
                    subjectProperty.zillowData["yearBuilt"] = zillowResult[0].yearBuilt !== undefined ? zillowResult[0].yearBuilt[0] : "";
                    subjectProperty.zillowData["buildingArea"] = zillowResult[0].finishedSqFt !== undefined ? zillowResult[0].finishedSqFt[0] : "";
                    subjectProperty.zillowData["bathrooms"] = zillowResult[0].bathrooms !== undefined ? zillowResult[0].bathrooms[0] : "";
                    subjectProperty.zillowData["bedrooms"] = zillowResult[0].bedrooms !== undefined ? zillowResult[0].bedrooms[0] : "";
                    subjectProperty.properties["bedrooms"] = subjectProperty.zillowData.bedrooms;
                    subjectProperty.properties["bathrooms"] = subjectProperty.zillowData.bathrooms;
                    subjectProperty.properties["salesPerSqFt"] = subjectProperty.properties.consideration / subjectProperty.properties.buildingArea;

                } else {
                    subjectProperty.zillowData = {};
                }
            });
        }
        // console.log(results[0]);
        var zillowObject = {}
        subjectProperty.jurisdictionData["yearBuilt"] =results[0].properties.yearBuilt;
        subjectProperty.jurisdictionData["buildingArea"] = results[0].properties.buildingArea;
        subjectProperty.jurisdictionData["waterFront"] = results[0].properties.waterFront;

        if(results[0].poData == null){
            results[0].poData = {};
        }
        subjectProperty.poData = results[0].poData;
        var improvement = {
            value: subjectProperty.poData.improvement
        }

        if(subjectProperty.poData.improvementDetails != undefined){
            var options = [];
            for(var i = 0; i < subjectProperty.poData.improvementDetails.length; i += 2){
                var option = {
                    explanation: subjectProperty.poData.improvementDetails[i],
                    evidenceId: []
                }

                var evidences = subjectProperty.poData.improvementDetails[i+1].split(",");
                for(var j = 0; j < evidences.length; j++){
                    option.evidenceId.push(parseInt(evidences[j]));
                }

                options.push(option);
            }

            improvement["options"] = options;
        }

        var expenditure = {
            value: subjectProperty.poData.expenditure
        }

        if(subjectProperty.poData.expenditureDetails != undefined){
            var options = [];
            for(var i = 0; i < subjectProperty.poData.expenditureDetails.length; i += 2){
                var option = {
                    explanation: subjectProperty.poData.expenditureDetails[i],
                    evidenceId: []
                }

                var evidences = subjectProperty.poData.expenditureDetails[i+1].split(",");
                for(var j = 0; j < evidences.length; j++){
                    option.evidenceId.push(parseInt(evidences[j]));
                }

                options.push(option);
            }

            expenditure["options"] = options;
        }

        delete subjectProperty.poData.improvement;
        delete subjectProperty.poData.expenditure;
        delete subjectProperty.poData.improvementDetails;
        delete subjectProperty.poData.expenditureDetails;


        subjectProperty.poData["improvement"] = improvement;
        subjectProperty.poData["expenditure"] = expenditure;

        subjectProperty["lat"] = results[0].properties.latitude;
        subjectProperty["lng"] = results[0].properties.longitude;
        subjectProperty["ownerAddress"] = results[0].properties.ownerAddress;
        subjectProperty["totalAssessment"] = results[0].properties.totalAssessment;
        subjectProperty["valuePerSqFt"] = results[0].properties.valuePerSqFt;

        return subjectProperty;
}

function addZillowData(zillowLowData, properties, zpids){
    for(var i = 0; i < properties.length; i++){
        if(zpids.indexOf(zillowLowData[i].zpid[0]) > -1){
            properties[i]["zillow"] = true;
        } else {
            properties[i]["zillow"] = false;
        }

        for( var j = 0; j < zillowLowData.length; j++){
            var zillowAddress = zillowLowData[j].address[0].street[0].toUpperCase();
            if(properties[i].properties.ownerAddress == zillowAddress){
                properties[i].properties["bathrooms"] = zillowLowData[j].bathrooms !== undefined ? zillowLowData[j].bathrooms[0] : "";
                properties[i].properties["bedrooms"] = zillowLowData[j].bedrooms !== undefined ? zillowLowData[j].bedrooms[0] : "";
                zillowLowData.splice(j,1);
                break;
            }
        }
    }

    return properties;
}


function finalizingComparables(data, subjectProperty) {
    for(var i = 0; i < data.length; i++){
        if(data[i].properties.bedrooms != "" && data[i].properties.bathrooms != ""){

            if(data[i].properties.valuePerSqFt > subjectProperty.valuePerSqFt &&
                parseFloat(data[i].properties.bathrooms) > parseFloat(subjectProperty.zillowData.bathrooms) &&
                parseFloat(data[i].properties.bathrooms) > parseFloat(subjectProperty.zillowData.bathrooms)
            ){
                data[i]["value"] = "high";
            } else {
                data[i]["value"] = "low";
            }
        } else {
            data[i]["value"] = "mid";
        }
    }
    return data;
}

//----------------------------------------------
// getZillowProperties DeepComps
//----------------------------------------------
 function GetDeepSearchResults (parameters) {
}
// ---------------------END---------------------
