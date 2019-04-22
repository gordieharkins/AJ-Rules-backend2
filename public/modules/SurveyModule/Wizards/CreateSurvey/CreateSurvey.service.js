'use strict';

_CreateSurveyService.$inject = ["$q","AOTCService"];
module.exports = _CreateSurveyService;

//angular.module('AOTC')
//    .factory('CreateSurveyService', _CreateSurveyService
//    );
function _CreateSurveyService($q, AOTCService) {
    this.selectQuestions = {};

    function getAllQuestions() {
        var url = '/surveys/getQuestions';

        var deferred = $q.defer();

        AOTCService.getDataFromServer(url)
            .then(function(result) {
                deferred.resolve(result);

            }, function(result) {
                deferred.reject(result);
                //console.log(result);
            });
        return deferred.promise;
    }

       

    function deleteQuestion(data) {
        var url = '/surveys/deleteQuestion';

        var deferred = $q.defer();

        AOTCService.postDataToServer(url , data)
            .then(function(result) {
                deferred.resolve(result);

            }, function(result) {
                deferred.reject(result);
                //console.log(result);
            });
        return deferred.promise;
    }

    return {
        getAllQuestions: getAllQuestions,
        deleteQuestion:deleteQuestion,
        questions: [{}],
        editQuestions: [{}],
        selectedSections: [{}],
        defaultModel:{},
        validateQuestions: [],
        variableSelected: [{}],

    };
}
