'use strict';

_newContractService.$inject = ["$http", "AOTCService", "$q"];
module.exports = _newContractService;

function _newContractService($http, AOTCService, $q) {
    var financialAndNonFinancialTerms = [];
    var financialTermsAdded = [];
    var dataContent = '';

    function getFinancialAndNonFinancialTerms() {
        return financialAndNonFinancialTerms;
    }

    function setFinancialAndNonFinancialTerms(terms) {
        financialAndNonFinancialTerms = terms;
    }


    function getFinancialTermsAdded() {
        return financialTermsAdded;
    }


    function setFinancialTermsAdded(terms) {
        financialTermsAdded = terms;
    }




    function getContracts() {

        var url = '/contracts/getContracts';
        var defer = $q.defer();

        AOTCService.getDataFromServer(url).
        then(function (result) {
            defer.resolve(result.data);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }


    function uploadContractsFiles(files) {

        var url = '/contracts/uploadContracts';

        var defer = $q.defer();
        AOTCService.uploadFiles(url, files).
        then(function (result) {
            defer.resolve(result);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }

    function addContractTemplate(data) {

        var url = '/contracts/addContractTemplate';
        var defer = $q.defer();

        AOTCService.postDataToServer(url, data).
        then(function (result) {
            defer.resolve(result.data);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }


    function addContract(data) {

        var url = '/contracts/addContract';
        var defer = $q.defer();

        AOTCService.postDataToServer(url, data).
        then(function (result) {
            defer.resolve(result.data);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }
    ///to be used to fetch saved contracts
    var savedContracts = {};
    //called from SavedContractListController
    function saveContractData(_data) {
        angular.forEach(_data, function (_item) {
            savedContracts[_item.id] = _item.contracts;
        });

    };
    //called from ContractEditorComponent
    function getContractData(_id) {
        if (!_id) return undefined;
        return savedContracts[_id];
    }
    var contractDataByUserId = {};
    function getContractsByUserId(_id) {
        var url = '/contracts/getContractsById';
        var defer = $q.defer();
        var _data = {
            "contractId": parseInt(_id)
        };
        AOTCService.postDataToServer(url, _data).
        then(function (result) {
            defer.resolve(result.data);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }

    return {
        addContract: addContract,
        getFinancialTermsAdded: getFinancialTermsAdded,
        setFinancialTermsAdded: setFinancialTermsAdded,
        getFinancialAndNonFinancialTerms: getFinancialAndNonFinancialTerms,
        setFinancialAndNonFinancialTerms: setFinancialAndNonFinancialTerms,
        getContracts: getContracts,
        uploadContractsFiles: uploadContractsFiles,
        addContractTemplate: addContractTemplate,
        saveContractData: saveContractData,
        getContractData: getContractData,
        getContractsByUserId: getContractsByUserId,
        contractDataByUserId: contractDataByUserId

    };

}



