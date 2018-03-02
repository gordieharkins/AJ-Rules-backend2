'use strict';

_SubmissionList.$inject = ["$stateParams", "$scope", "$state", "SubmissionListService"];
module.exports = _SubmissionList;

//angular.module('AOTC').controller('SubmissionList', _SubmissionList
//    );
function _SubmissionList($stateParams, $scope, $state, SubmissionListService) {


    $scope.GotoSurveySubmission = function (data) {
        console.log('212' + data.id)
        $state.go('SurveySubmissions', { id: data.id, surveyId: $stateParams.id });
    }

    $scope.GotoSurveyDeletion = function (_data) {
        $("#preloader").css("display", "block");
        var _obj = {
            "id": _data.id
        };
        SubmissionListService.deleteSubmission(_obj)
            .then(function (result) {

                if (!result.data.success) {
                    $scope.$emit('error', result.data.message);

                }
                else {
                    $scope.getSubmissions();
                }

                //$("#preloader").css("display", "none");

            }, function (result) {
                $("#preloader").css("display", "none");
            });
    };

    $scope.gotoSurveyAnswers = function () {

        $state.go('FillSurvey', { id: $stateParams.id });
    }

    $scope.getSubmissions = function () {
        $("#preloader").css("display", "block");

        SubmissionListService.getSubmissions($stateParams.id)
            .then(function (result) {
                //console.log(result);

                if (!result.data.success) {
                    $scope.$emit('error', result.data.message);
                }

                $scope.submissionData = result.data.result;

                $("#preloader").css("display", "none");

            }, function (result) {
                console.log(result);
                $("#preloader").css("display", "none");
            });
    }

}
