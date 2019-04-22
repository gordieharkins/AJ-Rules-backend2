'use strict';

_UnlinkService.$inject = ["$http", "$q"];
module.exports = _UnlinkService;

//angular.module('AOTC')
//    .factory('UnlinkService', _UnlinkService
//    );
function _UnlinkService($http, $q) {

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




    function getUnlinkedFiles() {
        var url = '/unlinkedFiles/getUnlinkedFiles';
        //////console.log(url);

        var deferred = $q.defer();

        getDataFromServer(url)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                //////console.log(result);
            });
        return deferred.promise;
    }

    return {
        getUnlinkedFiles: getUnlinkedFiles,
        getDataFromServer: getDataFromServer,
        postDataToServer: postDataToServer,
        putDataToServer: putDataToServer

    };

}
