'use strict';

_sectionSettingsService.$inject = ["$q","AOTCService"];
module.exports = _sectionSettingsService;

//angular.module('AOTC')
//    .service('sectionSettingsService', _sectionSettingsService
//    );
function _sectionSettingsService($q, AOTCService) {
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
        var url = '/surveys/updateSection';

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

    function deleteSection(data) {
        var url = '/surveys/deleteSection';

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
        addSection: addSection,
        deleteSection: deleteSection

    };
}
