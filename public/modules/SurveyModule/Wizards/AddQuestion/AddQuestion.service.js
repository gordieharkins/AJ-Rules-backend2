'use strict';

_AddQuestionService.$inject = ["$q","AOTCService"];
module.exports = _AddQuestionService;

//angular.module('AOTC')
//    .service('AddQuestionService', _AddQuestionService
//    );
function _AddQuestionService($q, AOTCService) {
    var selectedQuestion = null;
    var routeDecider = null;

    function setSelectedQuestion(question) {
        selectedQuestion = question;
    }

    function getSelectedQuestion() {
        return selectedQuestion;
    }

    function SaveEditedQuestion(data) {
        var url = '/surveys/updateQuestion';


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


    function addNewQuestion(data) {
        var url = '/surveys/addQuestion';

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
        setSelectedQuestion: setSelectedQuestion,
        getSelectedQuestion: getSelectedQuestion,
        addNewQuestion: addNewQuestion,
        SaveEditedQuestion: SaveEditedQuestion

    };
}
