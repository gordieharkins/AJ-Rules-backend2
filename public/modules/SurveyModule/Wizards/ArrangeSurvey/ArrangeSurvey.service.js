'use strict';

_ArrangeSurveyService.$inject = ["$q","AOTCService"];
module.exports = _ArrangeSurveyService;


//angular.module('AOTC')
//    .service('ArrangeSurveyService', _ArrangeSurveyService
//    );

function _ArrangeSurveyService($q, AOTCService) {
    this.selectQuestions = {};


    function getAllSections() {
        var url = '/surveys/getSections';

        var deferred = $q.defer();

        AOTCService.getDataFromServer(url)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                //////console.log(result);
            });
        return deferred.promise;

    };

    function addSection(data) {
        var url = '/surveys/addSection';

        var deferred = $q.defer();

        AOTCService.postDataToServer(url, data)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                //////console.log(result);
            });
        return deferred.promise;
    }

    return {
        getAllSections: getAllSections,
        addSection: addSection

    };
}
