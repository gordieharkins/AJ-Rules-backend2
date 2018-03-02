'use strict';

_FillSurveyService.$inject = ["$q","AOTCService"];
module.exports = _FillSurveyService;

//angular.module('AOTC')
//    .service('FillSurveyService', _FillSurveyService
//    );
function _FillSurveyService($q, AOTCService) {

    function getSurveyDetails(id) {
        var url = '/surveys/getSurveyById?id=' + id;

        var deferred = $q.defer();

        AOTCService.getDataFromServer(url)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                console.log(result);
            });
        return deferred.promise;

    };

    function getEditSurveyDetails(id) {
        var url = '/surveys/getEditedSurveyById?id=' + id;

        var deferred = $q.defer();

        AOTCService.getDataFromServer(url)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                console.log(result);
            });
        return deferred.promise;

    };


    function saveSubmission(data) {
        var url = '/surveys/submitSurvey';

        var deferred = $q.defer();

        AOTCService.postDataToServer(url, data)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                console.log(result);
            });
        return deferred.promise;

    };



    return {
        getSurveyDetails: getSurveyDetails,
        saveSubmission: saveSubmission,
        getEditSurveyDetails: getEditSurveyDetails
    };
}
