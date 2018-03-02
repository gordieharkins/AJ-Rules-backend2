'use strict';

_InvoiceListService.$inject = ["$http", "AOTCService", "$q"];
module.exports = _InvoiceListService;

//angular.module('AOTC')
//    .factory('InvoiceListService', _InvoiceListService

//    );
function _InvoiceListService($http, AOTCService, $q) {

    function updateContractTerms(data) {

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

    };

}