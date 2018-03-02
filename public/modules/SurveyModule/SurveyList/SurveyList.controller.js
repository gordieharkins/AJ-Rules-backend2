'use strict';

_SurveyList.$inject = ["$scope", "$location",  "$state", "SurveylistService"];
module.exports = _SurveyList;

//angular.module('AOTC').controller('SurveyList', _SurveyList
//    );
function _SurveyList($scope, $location, $state, SurveylistService) {
    console.log("SurveyList controller");
    $scope.surveyData=[];
    $scope.searchText='';

    $scope.getSurveyList=function () {
        $("#preloader").css("display", "block");

        SurveylistService.getAllSurvey().
        then(function(result) {
            $("#preloader").css("display", "none");

            var serverData = result.data;
            console.log(serverData)

            if (serverData.success) {
                if (serverData) {
                    $scope.surveyData=serverData.result;
                }
            }

        }, function(err) {
            //some error
            // console.log("Error: ", err);
            $("#preloader").css("display", "none");
        });
    }
    //==============================================DELETE SURVEY==========================
    $scope.selectedSurvey = {};
    
    $scope.onClickDeleteSurvey = function(survey){
        $scope.selectedSurvey = survey;
        $('#ConfirmModalquestion').modal('toggle');

    };

    $scope.GotoViewReports=function (data) {
        SurveylistService.name=data.surveyName;
        $state.go('Reports',{id:data.id});
    }

    $scope.deleteSurvey=function () {
        var json= {
            id:$scope.selectedSurvey.id
        };
        $("#preloader").css("display", "block");

        SurveylistService.deleteSurvey(json).
        then(function(result) {
            $("#preloader").css("display", "none");
            var serverData = result.data;

            if (serverData.success) {
                if (serverData) {
                    $scope.getSurveyList();
                    $scope.$emit('success',serverData.message);
                    return;
                }
                $scope.$emit('danger',serverData.message);

            }

        }, function(err) {
            //some error
            // console.log("Error: ", err);
            $("#preloader").css("display", "none");
        });
    }


    //==============================================DELETE SURVEY==========================
    
    $scope.GotoEditSurvey=function (data) {
        localStorage.removeItem("section")
        $state.go('EditSurvey',{id:data.id});
    }
    $scope.GotoSubmitAnswer = function(data){
        $state.go('FillSurvey',{id:data.id});
    }

    $scope.GotoViewSubmission = function(data){
        console.log(data)
        $state.go('SubmissionList',{id:data.id});
    }

}
