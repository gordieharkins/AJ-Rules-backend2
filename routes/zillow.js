var express = require('express');
var router = express.Router();
// var path = require('path');
// var bllFile = require(path.resolve(__dirname, '../BLL/valuation')); //change this
// var BLL = new bllFile();
var Zillow = require("node-zillow");
var zillow = new Zillow('X1-ZWz197fgjg2ux7_9vdv4');
var parameters = {
    // zpid: 48749425,
    // zpid: 48689866,
    // zpid: 2128303876,
    rentzestimate:true,     // used to get rent details of prop if available
    // count: 2
    // address: "2114 Bigelow Ave",
    address: "9891 Broken Land Pkwy",
    citystatezip: "Columbia, MD"
    // address: "405 Hayes St",
    // citystatezip: "Seattle, WA"
};
router.get('/', function(req, res, next) {

    var parameters = {
        rentzestimate:true,                 // used to get rent details of prop if available
        address: "405 Hayes St",
        citystatezip: "Seattle, WA"
    };

    zillow.get('GetDeepSearchResults', parameters)
        .then(function(results) {
            console.log('result');
            res.send(results);
        });

    // var parameters = {
    //     zpid: 48749425
    // };

    // zillow.get('GetUpdatedPropertyDetails', parameters)
    //     .then(function(results) {
    //         console.log('result');
    //         res.send(results);
    //     });

    // var parameters = {
    //     rentzestimate:true,                 // used to get rent details of prop if available
    //     address: "405 Hayes St",
    //     citystatezip: "Seattle, WA",
    //     count: 10,
    //     zpid: 48689866
    // };

    // zillow.get('GetDeepComps', parameters)
    //     .then(function(results) {
    //         console.log('result');
    //         zillowToDB(results)
    //         res.send(results);
    //     });

    // var parameters = {
    //     rentzestimate:true,     // used to get rent details of prop if available
    //     state: "WA",
    // };

    // zillow.get('GetRegionChildren', parameters)
    //     .then(function(results) {
    //         console.log('result');
    //         res.send(results);
    //     });

    // var parameters = {
    //     address: "405 Hayes St",
    //     citystatezip: "Seattle, WA"
    // };

    // zillow.get('GetSearchResults', parameters)
    //     .then(function(results) {
    //         console.log('result');
    //         res.send(results);
    //     });

    // var parameters = {
    //     address: "9891 Broken Land Pkwy",
    //     citystatezip: "Columbia, MD"
    // };

    // zillow.get('GetZestimate', parameters)
    //     .then(function(results) {
    //         console.log('result');
    //         res.send(results);
    //     });

    // var parameters = {
    //     zpid: 48749425,
    //     "unit-type": "dollar",
    //     width: 300,
    //     height: 150,
    //     chartDuration: "2years"
    // };

    // zillow.get('GetChart', parameters)
    //     .then(function(results) {
    //         console.log('result');
    //         res.send(results);
    //     });

    // var parameters = {
    //     zpid: 48749425,
    //     rentzestimate: true,     // used to get rent details of prop if available
    //     count: 2,
    // };

    // zillow.get('GetComps', parameters)
    //     .then(function(results) {
    //         console.log('result');
    //         res.send(results);
    //     });

    // var parameters = {
    //     zpid: 48749425,
    //     "unit-type": "dollar",
    //     width: 300,
    //     height: 150,
    //     chartDuration: "2years",
    //     regionId: "59"
    // };

    // zillow.get('GetRegionChart', parameters)
    //     .then(function(results) {
    //         console.log('result');
    //         res.send(results);
    //     });

    /////////////////////////////////////////////////////

    // zillow.get('GetZestimate', parameters)
    // .then(function(results) {
    //     console.log('result');
    //     res.send(results);
    // });

    // zillow.get('GetSearchResults', parameters)
    //     .then(function(results) {
    //         console.log('result');
    //         res.send(results);
    //     });

    // zillow.get('GetComps', parameters)
    //     .then(function(results) {
    //         console.log('result');
    //         res.send(results);
    //     });
});


function zillowToDB(data){
    var props = data.response.properties.comparables[0].comp;

    var finalProps = [];
    
    for(var i = 0;i <= props.length;i++){
        var prop = {};
        prop.compScore = props[i].$.score;
        prop.zpid = props[i].zpid[0];
        var address = props[i].address[0].street[0] + ", " + props[i].address[0].city[0] + ", " + props[i].address[0].state[0] + ", " + props[i].address[0].zipcode[0];
        prop.taxAssessmentYear = props[i].taxAssessmentYear[0];
        prop.taxAssessment = props[i].taxAssessment[0];
        prop.yearBuilt = props[i].yearBuilt[0];
        prop.lotSizeSqFt = props[i].lotSizeSqFt[0];
        prop.finishedSqFt = address;
        // prop.streetAddress = address;
        // prop.streetAddress = address;
        // prop.streetAddress = address;
        // prop.streetAddress = address;
        // prop.streetAddress = address;
        // prop.streetAddress = address;
        // prop.streetAddress = address;
        // prop.zpid = props[i].zpid[0];
        // prop.compScore = props[0].$.score;
        finalProps.push(prop);
    console.log(finalProps);

    }

    console.log(finalProps);
    return;
    // var DBPropData = {
    //     "country": "United States",
    //     "fileName": "PMF Properties with TaxAccount.xlsx",
    //     "ppoName": "",
    //     "county": "Frederick County",
    //     "landSizeUnit": "",
    //     "section": "",
    //     "yearBuilt": "",
    //     "landSize": "",
    //     "assessmentRatio": "",
    //     "zoning": "",
    //     "far": "",
    //     "assetManagerFirm": "",
    //     "block": "",
    //     "propertyOwnerName": "",
    //     "state": 1,
    //     "assessorAddress": "",
    //     "longitude": -77.41224299999999,
    //     "zip": "21703",
    //     "parcel": "",
    //     "grossArea": "",
    //     "streetNumber": "5255",
    //     "netLeasableArea": "",
    //     "yearRenovated": "",
    //     "modifiedDate": "",
    //     "leasingAgentFirm": "",
    //     "aotcClientName": "",
    //     "countryState": "Maryland",
    //     "city": "Frederick",
    //     "latitude": 39.381582,
    //     "assessorAccountNo": "",
    //     "lot": "",
    //     "streetName": "Westview Drive",
    //     "formattedAddress": "5255 Westview Dr, Frederick, MD 21703, USA",
    //     "isDeleted": false,
    //     "lawFirmReleases": "",
    //     "countryCode": "US",
    //     "deedCitation": "",
    //     "propertyType": "Office",
    //     "taxingAuthority": "",
    //     "propertyTypeNote": "",
    //     "salesBrokerFirm": "",
    //     "modifiedBy": "",
    //     "assessingAuthority": "",
    //     "map": "",
    //     "recordOwnerName": "Gateway Franklin Inc.",
    //     "mapCitation": "",
    //     "parcelId": "",
    //     "createdDate": "2017-05-15 11:48:07",
    //     "propertyName": "Bechtel Campus, bld 3",
    //     "streetAddress": "5255 Westview Drive, Frederick, MD 21703",
    //     "createdBy": 5833,
    //     "grid": "",
    //     "taxAccountNo": "A000006",
    //     "propertyID": "LAC03801",
    //     "township": "2, Frederick",
    //     "propertyManagementFirm": "",
    //     "_id": 7306
    // }
}

module.exports = router;