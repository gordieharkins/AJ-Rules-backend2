'use strict';

_SurveySubmissionsService.$inject = ["$q","AOTCService"];
module.exports = _SurveySubmissionsService;

//angular.module('AOTC')
//    .service('SurveySubmissionsService', _SurveySubmissionsService
//    );
function _SurveySubmissionsService($q, AOTCService) {

    function getSurveySubmissions(id) {
        var url = '/surveys/getSubmittedSurveyById?id=' + id
        var deferred = $q.defer();

        AOTCService.getDataFromServer(url)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
            });
        return deferred.promise;

    };


    function updateSubmittedForm(data) {
        var url = '/surveys/updateSubmittedForm'
        var deferred = $q.defer();

        AOTCService.postDataToServer(url, data)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
            });
        return deferred.promise;

    };


    function getUSstates() {
        var url = '/surveys/getUSstates'
        var deferred = $q.defer();

        AOTCService.getDataFromServer(url)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
            });
        return deferred.promise;

    };



    return {
        updateSubmittedForm: updateSubmittedForm,
        getSurveySubmissions: getSurveySubmissions,
        getUSstates: getUSstates
    };
}
