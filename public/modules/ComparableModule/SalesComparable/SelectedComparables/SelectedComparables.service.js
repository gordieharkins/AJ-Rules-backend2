'use strict';

_ComparableService.$inject = ["$http", "$q"];
module.exports = _ComparableService;

//angular.module('AOTC')
//    .factory('ComparableService', _ComparableService);

function _ComparableService($http, $q) {

    function getDataFromServer(apiUrl) {
        // //////console.log(apiUrl);
        var token = localStorage.getItem('token');

        var req = $http({
            method: "GET",
            url: apiUrl,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        return req;
    }

    function putDataToServer(url, userData) {
        var token = localStorage.getItem('token');

        var request = $http({
            method: "PUT",
            url: url,
            data: userData,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Authorization": token
            }

        });

        return request;

    }

    function postDataToServer(url, userData) {
        var token = localStorage.getItem('token');

        var request = $http({
            method: "POST",
            url: url,
            data: userData,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Authorization": token
            }

        });
        return request;

    }

    function saveComparablesToProperties(comparables) {
        //var jsonFormat = {
        //    propertyId: parseInt( localStorage.getItem('propertyId') ),
        //    comps: comparables.comps,
        //    principal: [comparables.principal]
        //};

        //////console.log(jsonFormat)


        var url = '/salesComps/addCompsToProp';
        var deferred = $q.defer();

        postDataToServer(url, comparables)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                //////console.log(result);
            });
        return deferred.promise;
    }

    function deleteComparables(id) {
        var jsonFormat = {
            salesComps: [id]
        };
        //////console.log(jsonFormat);
        var url = '/salesComps/deleteCompsFromProperty';

        var deferred = $q.defer();

        postDataToServer(url, jsonFormat)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                ////console.log(result);
            });
        return deferred.promise;
    }

    ///salesComps/getComparables
    function getComparables(_query) {

        var propId = parseInt(localStorage.getItem('propertyId'));
        //var url = '/salesComps/getSavedComps?propertyId=' + propId;
        var _dataobj = {
            "propId": propId,
            "queryCriteria": _query
        };
        var deferred = $q.defer();
        var url = '/salesComps/getComparables';
        postDataToServer(url, _dataobj)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                ////console.log(result);
            });
        return deferred.promise;
    };

    function getSavedComps(_query) {

        var propId = parseInt(localStorage.getItem('propertyId'));
        //var url = '/salesComps/getSavedComps?propertyId=' + propId;
        var _dataobj = {
            "propertyId": propId,
        };
        var deferred = $q.defer();
        var url = '/salesComps/getSavedComps';
        //console.log("here is url: ",url);
        postDataToServer(url, _dataobj)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                ////console.log(result);
            });
        return deferred.promise;
    };

    function saveSubjectPropertyUpdatedData(_data) {
        var propId = parseInt(localStorage.getItem('propertyId'));
        var url = '/salesComps/saveSubjectPropertyUpdatedData';
        var _dataobj = {
            "propertyId": propId,
            "data": _data
        }
        var deferred = $q.defer();
        //var url = '/salesComps/getComparables';
        postDataToServer(url, _dataobj)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                ////console.log(result);
            });
        return deferred.promise;
    };


    function deleteCompsFromProperty(_data) {
        //var propId = parseInt(localStorage.getItem('propertyId'));
        var url = '/salesComps/deleteCompsFromProperty';
        //var _dataobj = {
        //    "propertyId": propId,
        //    "data": _data
        //}
        var deferred = $q.defer();
        //var url = '/salesComps/getComparables';
        postDataToServer(url, _data)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                ////console.log(result);
            });
        return deferred.promise;
    };


    return {
        saveComparablesToProperties: saveComparablesToProperties,
        deleteComparables: deleteComparables,
        getComparables: getComparables,
        saveSubjectPropertyUpdatedData: saveSubjectPropertyUpdatedData,
        getSavedComps: getSavedComps,
        deleteCompsFromProperty: deleteCompsFromProperty
    };

}