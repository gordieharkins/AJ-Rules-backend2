_SurveylistService.$inject = ["$q","AOTCService"];
module.exports = _SurveylistService;

//angular.module('AOTC')
//    .service('SurveylistService', _SurveylistService
//    );
function _SurveylistService($q, AOTCService) {
    var SurveyName;

    function getAllSurvey() {
        var url = '/surveys/getSurveysList';

        var deferred = $q.defer();

        AOTCService.getDataFromServer(url)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
            });
        return deferred.promise;

    };


    function deleteSurvey(data) {
        var url = '/surveys/deleteSurvey';

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
        getAllSurvey: getAllSurvey,
        deleteSurvey: deleteSurvey
    };
}
