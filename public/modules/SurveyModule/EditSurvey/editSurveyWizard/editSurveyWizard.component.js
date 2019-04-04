_editSurveyCtrl.$inject = ["$scope", "CreateSurveyService"];
module.exports = _editSurveyCtrl;

//angular
//    .module('AOTC')
//    .controller('editSurveyCtrl', _editSurveyCtrl
//    );
function _editSurveyCtrl($scope, CreateSurveyService) {
    //console.log('editSurvey')
    localStorage.removeItem("section")
    // CreateSurveyService.validateQuestions=[{}];
    // CreateSurveyService.editQuestions=[{}];
    if (CreateSurveyService.editQuestions[0]) {

        CreateSurveyService.editQuestions.length = 0;

    }
    if (CreateSurveyService.validateQuestions) {
        CreateSurveyService.validateQuestions.length = 0;
    }

    $scope.createSurveyRoute = true;
    $scope.viewSurveyRoute = false;
    $scope.arrangeQuestionsRoute = false;

    $scope.createSurvey = function () {
        // $state.go('Survey.CreateSurvey');
        // $scope.createSurvey=true;

        $scope.createSurveyRoute = true;
        $scope.viewSurveyRoute = false;
        $scope.arrangeQuestionsRoute = false

        $scope.loading = true;

    }

    $scope.viewSurvey = function () {
        //$state.go('Survey.ViewSurvey');

        $scope.createSurveyRoute = false;
        $scope.viewSurveyRoute = true;
        $scope.arrangeQuestionsRoute = false;

        $scope.loading = true;


    }

    $scope.arrangeQuestions = function () {
        //$state.go('Survey.ArrangeSurvey');
        //console.log('ss')
        $scope.createSurveyRoute = false;
        $scope.viewSurveyRoute = false;
        $scope.arrangeQuestionsRoute = true;

        $scope.loading = true;

    }

}