'use strict';

_ComparablePropService.$inject = ["$http", "$q", "AOTCService"];
module.exports = _ComparablePropService;

//angular.module('AOTC')
//    .factory('ComparablePropService', _ComparablePropService
//   );

function _ComparablePropService($http, $q, AOTCService) {

    return {
        getZillowProperties: getZillowProperties,
        getZillowPropImage: getZillowPropImage
    };

    function getZillowProperties() {
        var propertyDetails = JSON.parse(localStorage.getItem('propertyDetails'));
        var streetName = propertyDetails.streetAddress.split(',');
        var postData = {
            city: propertyDetails.city,
            state: propertyDetails.countryState,
            address: streetName[0]
        };

        var url = '/salesComps/getZDeepCompsProperties';
        var deferred = $q.defer();
        AOTCService.postDataToServer(url, postData)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
            });
        return deferred.promise;
    }

    function getZillowPropImage(propertyLink) {
        var postData = {
            propertyLink: propertyLink
        };
        var url = '/salesComps/getZillowPropImage';
        var deferred = $q.defer();
        AOTCService.postDataToServer(url, postData)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
            });
        return deferred.promise;
    }
}
