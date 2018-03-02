'use strict';

_ValuationService.$inject = ["$http", "$q"];
module.exports = _ValuationService;

//angular.module('AOTC')
//    .factory('ValuationService', _ValuationService
//    );
function _ValuationService($http, $q) {

    function getDataFromServer(apiUrl) {
        // ////console.log(apiUrl);
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

    function getValuationForms(url, formData) {
        ////console.log(url);
        var token = localStorage.getItem('token');

        var req = $http({
            method: "POST",
            url: url,
            data: formData,
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

    function appeal(url, formData) {
        var token = localStorage.getItem('token');
        var request = $http({
            method: "POST",
            url: url,
            data: formData,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Authorization": token
            }

        });
        return request;

    }

    function deleteForm(url, formData) {
        var token = localStorage.getItem('token');
        var request = $http({
            method: "POST",
            url: url,
            data: formData,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        return request;
    }

    function replaceValuationForm(url, formData) {
        var token = localStorage.getItem('token');

        var request = $http({
            method: "POST",
            url: url,
            data: formData,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Authorization": token
            }

        });
        return request;

    }

    function uploadFiles(uploadUrl, files) {
        // ////console.log(jsonForm);

        var token = localStorage.getItem('token');

        var fd = new FormData();

        for (var i = 0; i < files.length; i++) {
            fd.append('file', files[i]);

        }

        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                "Authorization": token
            }
        });

    }

    function getEvaluationData(metaData) {

        var serverData = {};
        var url = '/valuation';
        var deferred = $q.defer();

        postDataToServer(url, metaData)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                ////console.log(result);
            });
        return deferred.promise;
    }

    function getConsolidatedData(metaData) {

        var serverData = {};
        var url = '/incomeExpenses/propertyValuationIE';
        var deferred = $q.defer();
        postDataToServer(url, metaData)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                ///console.log(result);
            });
        return deferred.promise;
    }

    function getPetitionerModalsData() {

        var serverData = {};
        var url = '/valuation/get-modal';
        ////console.log(url);
        var deferred = $q.defer();
        var _data = {
            id: localStorage.getItem('formId'),
            propId: parseInt(localStorage.getItem('propertyId'))
        };
        // ////console.log("This: ",url);

        postDataToServer(url, _data)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                ////console.log(result);
                deferred.reject(result);
            });
        return deferred.promise;
    }


    function getFormById() {


        var url = 'valuation/get-forms-by-formId';
        ////console.log(url);
        var deferred = $q.defer();
        var _data = {
            formId: localStorage.getItem('formId'),
            propId:parseInt(localStorage.getItem('propertyId'))
        };
        // ////console.log("This: ",url);

        postDataToServer(url, _data)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                ////console.log(result);
                deferred.reject(result);
            });
        return deferred.promise;
    }

    return {
        getFormById: getFormById,
        getPetitionerModalsData: getPetitionerModalsData,
        getConsolidatedData: getConsolidatedData,
        getEvaluationData: getEvaluationData,
        getDataFromServer: getDataFromServer,
        uploadFiles: uploadFiles,
        postDataToServer: postDataToServer,
        putDataToServer: putDataToServer,
        getValuationForms: getValuationForms,
        replaceValuationForm: replaceValuationForm,
        appeal: appeal,
        deleteForm: deleteForm

    };

}