'use strict';

_ComparableSelectionService.$inject = ["$http", "$q", "AOTCService"];
module.exports = _ComparableSelectionService;

//angular.module('AOTC')
//    .factory('ComparableSelectionService', _ComparableSelectionService
//   );

function _ComparableSelectionService($http, $q, AOTCService) {

    // function getDataFromServer(apiUrl) {
    //     // ////console.log(apiUrl);
    //     var token = localStorage.getItem('token');

    //     var req = $http({
    //         method: "GET",
    //         url: apiUrl,
    //         headers: {
    //             "Access-Control-Allow-Origin": "*",
    //             "Content-Type": "application/json",
    //             "Authorization": token

    //         }

    //     });

    //     return req;

    // }

    // function putDataToServer(url, userData) {
    //     var token = localStorage.getItem('token');

    //     var request = $http({
    //         method: "PUT",
    //         url: url,
    //         data: userData,
    //         headers: {
    //             "Access-Control-Allow-Origin": "*",
    //             "Content-Type": "application/json",
    //             "Authorization": token
    //         }

    //     });

    //     return request;

    // }

    // function postDataToServer(url, userData) {
    //     var token = localStorage.getItem('token');

    //     var request = $http({
    //         method: "POST",
    //         url: url,
    //         data: userData,
    //         headers: {
    //             "Access-Control-Allow-Origin": "*",
    //             "Content-Type": "application/json",
    //             "Authorization": token
    //         }

    //     });
    //     return request;

    // }
    function getDeepSearchResult() {

        var propertyDetails = JSON.parse(localStorage.getItem('propertyDetails'));
        var streetName = propertyDetails.streetAddress.split(',');
        var postData = {
            city: propertyDetails.city,
            state: propertyDetails.countryState,
            address: streetName[0]
        };

        var url = '/salesComps/GetDeepSearchResults';
        var deferred = $q.defer();
        ////console.log(url);


        AOTCService.postDataToServer(url, postData)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                ////console.log(result);
            });
        return deferred.promise;
    }

    function getSavedComparables() {

        var propId = parseInt(localStorage.getItem('propertyId'));
        var url = '/salesComps/getSavedComps';
        var _data = {propId: propId};
        var deferred = $q.defer();
        console.log(url);
        AOTCService.postDataToServer(url, _data)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                ////console.log(result);
            });
        return deferred.promise;
    }

    return {
        getSavedComparables: getSavedComparables,
        getDeepSearchResult: getDeepSearchResult
    };

}
