'use strict';

_newContractTermsService.$inject = ["$http", "AOTCService", "$q"];
module.exports = _newContractTermsService;

//angular.module('AOTC')
//    .factory('newContractTermsService', _newContractTermsService
//   );

function _newContractTermsService($http, AOTCService, $q) {

    function getContractTerms(data) {

        var url = '/contracts/getContractTerms';
        var defer = $q.defer();

        AOTCService.getDataFromServer(url).
        then(function (result) {
            defer.resolve(result.data);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }


    function addContractTerms(data) {

        var url = '/contracts/addContractTerms';
        var defer = $q.defer();

        AOTCService.postDataToServer(url, data).
        then(function (result) {
            defer.resolve(result.data);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }

    function updateContractTerms(data) {
        //
        var url = '/contracts/updateContractTerms';
        var defer = $q.defer();

        AOTCService.postDataToServer(url, data).
        then(function (result) {
            defer.resolve(result.data);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }





    return {
        updateContractTerms: updateContractTerms,
        getContractTerms: getContractTerms,
        addContractTerms: addContractTerms

    };

}