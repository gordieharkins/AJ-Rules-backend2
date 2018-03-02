'use strict';

_SubmissionListService.$inject = ["$q","AOTCService"];
module.exports = _SubmissionListService;

//angular.module('AOTC')
//    .service('SubmissionListService', _SubmissionListService
//    );
function _SubmissionListService($q, AOTCService) {

    function getSubmissionDetails(id) {
        // var url = '/surveys/getSurveyById?id='+id;
        var url = '/surveys/getSubmittedSurveys?id=' + id
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

    function deleteSubmission(data) {
        var url = '/surveys/deleteSubmission';

        var deferred = $q.defer();

        AOTCService.postDataToServer(url, data)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
            });
        return deferred.promise;

    };



    return {
        getSubmissions: getSubmissionDetails,
        deleteSubmission: deleteSubmission
    };
}
