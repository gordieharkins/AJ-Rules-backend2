'use strict';

_SavedContractListService.$inject = ["$http", "AOTCService", "$q"];
module.exports = _SavedContractListService;

//angular.module('AOTC')
//    .factory('SavedContractListService', _SavedContractListService
//    );

function _SavedContractListService($http, AOTCService, $q) {

    function getContracts(data) {

        var _data = {};

        var url = '/contracts/getContractsByUserId';
        var defer = $q.defer();

        AOTCService.postDataToServer(url, _data).
        then(function (result) {
            defer.resolve(result.data);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }





    return {

        getContracts: getContracts,

    };

}