'use strict';

_WizardsViewerCtrl.$inject = ["$scope","$location","$state"];
module.exports = _WizardsViewerCtrl;

//angular.module('AOTC').controller('WizardsViewerCtrl', _WizardsViewerCtrl
//    );
function _WizardsViewerCtrl($scope, $location, $state) {
    console.log("WizardsViewerCtrl controller");
    var vm = this;
    vm.isActive = isActive;
    vm.arrangeQuestions = arrangeQuestions;
    vm.createSurvey = createSurvey;
    vm.viewSurvey = viewSurvey;
    $scope.loading=false;
    function isActive(viewLocation) {

        return viewLocation === $location.path();
    }
    $scope.createSurveyRoute=true;
    $scope.viewSurveyRoute=false;
    $scope.arrangeQuestionsRoute=false;

    function createSurvey() {
        // $state.go('Survey.CreateSurvey');
        // $scope.createSurvey=true;
        
        $scope.createSurveyRoute=true;
        $scope.viewSurveyRoute=false;
        $scope.arrangeQuestionsRoute=false

        $scope.loading=true;

    }

    function viewSurvey() {
        //$state.go('Survey.ViewSurvey');

        $scope.createSurveyRoute=false;
        $scope.viewSurveyRoute=true;
        $scope.arrangeQuestionsRoute=false;

        $scope.loading=true;


    }

    function arrangeQuestions() {
        //$state.go('Survey.ArrangeSurvey');
        console.log('ss')
        $scope.createSurveyRoute=false;
        $scope.viewSurveyRoute=false;
        $scope.arrangeQuestionsRoute=true;

        $scope.loading=true;

    }

}