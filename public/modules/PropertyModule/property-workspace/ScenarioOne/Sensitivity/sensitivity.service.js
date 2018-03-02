'use strict';

_SensitivityService.$inject = ["$http", "$q", "AOTCService"];
module.exports = _SensitivityService;

//angular.module('AOTC')
//    .factory('SensitivityService', _SensitivityService
//    );
function _SensitivityService($http, $q, AOTCService) {

    return {
        saveWorkSpace: saveWorkSpace,
        replaceWorkSpace: replaceWorkSpace,
        getWorkspace: getWorkspace

    };

    function saveWorkSpace(workspace) {
        ////console.log('workspace', workspace)

        var url = '/valuation/save-work-space' ;
        var deferred = $q.defer();

        AOTCService.postDataToServer(url, workspace)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
            });
        return deferred.promise;

    }

    function getWorkspace() {

        var postData = {
            "propId":parseInt(localStorage.getItem('propertyId')),
            "formId": parseInt(localStorage.getItem('formId'))
        };

        var url = '/valuation/get-work-space';
        var deferred = $q.defer();
        ////console.log(postData);

        AOTCService.postDataToServer(url, postData)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
            });

        return deferred.promise;

    }


    function replaceWorkSpace(workspace) {

        var url = '/valuation/replace-work-space';
        var deferred = $q.defer();

        AOTCService.postDataToServer(url, workspace)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
            });
        return deferred.promise;

    }

}
