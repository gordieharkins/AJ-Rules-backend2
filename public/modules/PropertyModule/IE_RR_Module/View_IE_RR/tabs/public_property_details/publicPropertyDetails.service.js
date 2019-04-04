'use strict';

_PublicPropertyDetailsTabService.$inject = ["$http", "$q", "AOTCService"];
module.exports = _PublicPropertyDetailsTabService;

//angular.module('AOTC')
//    .factory('PublicPropertyDetailsTabService', _PublicPropertyDetailsTabService
//    );

function _PublicPropertyDetailsTabService($http, $q, AOTCService) {

    return {
        getAllImages: getAllImages,
        getProperty: getProperty,
        deleteImageById: deleteImageById,
        setMainImage: setMainImage
    };

    function getAllImages() {

        var propId = parseInt(localStorage.getItem('propertyId'));
        var _data = {propId: propId};
        var url = '/propertyImages/getAllImages';
        // var url = '/propertyImages/getAllImages?id=7647';

        var deferred = $q.defer();

        AOTCService.postDataToServer(url, _data)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                //////console.log(result);
            });
        return deferred.promise;
    }

    function getProperty() {

        var propId = parseInt(localStorage.getItem('propertyId'));
        var _data = {propId:propId };        
        var url = '/properties/getSlavePropertiesByMasterId';

        var deferred = $q.defer();
        $("#preloader").css("display", "block");

        AOTCService.postDataToServer(url, _data)
            .then(function (result) {
                deferred.resolve(result);
            }, function (result) {
                deferred.reject(result);
                //////console.log(result);
            });
        return deferred.promise;
    }

    function deleteImageById(imageId, tag) {
        var jsonFormat = {
            imageId: imageId,
            tag: tag
        };
        var url = '/propertyImages/deleteImageById';

        var deferred = $q.defer();

        AOTCService.postDataToServer(url, jsonFormat)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                //////console.log(result);
            });
        return deferred.promise;
    }

    function setMainImage(propertyId, imageId) {
        var jsonFormat = {
            propId: propertyId,
            imageId: imageId
        };
        var url = '/propertyImages/setMainImage';

        var deferred = $q.defer();

        AOTCService.postDataToServer(url, jsonFormat)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                //////console.log(result);
            });
        return deferred.promise;
    }
}
