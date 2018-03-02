'use strict';
_NewInvoiceService.$inject = ["$http", "AOTCService", "$q"];
module.exports = _NewInvoiceService;


//angular.module('AOTC')
//    .factory('NewInvoiceService', _NewInvoiceService
//    );

function _NewInvoiceService($http, AOTCService, $q) {

    function saveInvoice(data) {

        var url = '/contracts/saveInvoice';
        var defer = $q.defer();

        AOTCService.postDataToServer(url, data).
        then(function (result) {
            defer.resolve(result.data);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    };

    function getInvoiceByContractId(data) {
        var url = '/contracts/getInvoiceByContractId';
        var defer = $q.defer();

        AOTCService.postDataToServer(url, data).then(function (result) {
            defer.resolve(result.data);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;

    };



    return {
        saveInvoice: saveInvoice,
        getInvoiceByContractId: getInvoiceByContractId

    };

}