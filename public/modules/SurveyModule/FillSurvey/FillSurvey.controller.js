'use strict';

_FillSurvey.$inject = ["$state", "$stateParams",  "$scope", "FillSurveyService", "SurveySubmissionsService"];
module.exports = _FillSurvey;

//angular.module('AOTC').controller('FillSurvey', _FillSurvey
//);
function _FillSurvey($state, $stateParams, $scope, FillSurveyService, SurveySubmissionsService) {
    //console.log("SurveyAnswer controller", $stateParams.id);


    $scope.viewQuestions = [];

    $scope.dateFormat = 'MM-dd-yyyy';
    $scope.opened = false;

    $scope.availableDateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        minDate: new Date(1975, 1, 1),
        maxDate: new Date(2030, 1, 1)
    };
    $scope.intervieweeInformation = {};


    getUSstates();

    function getUSstates() {
        $("#preloader").css("display", "block");
        SurveySubmissionsService.getUSstates()
            .then(function (result) {
                $("#preloader").css("display", "none");
                //console.log(result.data.result);
                $scope.states = result.data.result;
                $scope.intervieweeInformation.state = $scope.states[0].States;

            }, function (result) {
                //console.log(result);
                $("#preloader").css("display", "none");
            });
    }


    $scope.addCalenderFields = function (numberOfFields, options) {

        FillSurveyService.getSurveyDetails($stateParams.id)
            .then(function (result) {
                //console.log(result);

                var length = 0;

                if (options.length > numberOfFields) {
                    length = options.length - numberOfFields;
                    for (var i = 0; i < length; i++) {
                        options.splice(options.length - 1, 1);
                    }
                } else {
                    length = numberOfFields - options.length;
                    for (var i = 0; i < length; i++) {
                        var obj = { opened: false, value: '' }
                        options.push(obj);
                    }
                }

            });
    }

    $scope.setActive = function (data, options) {

        options.forEach(function (b) {
            if (b.id == 1 || b.id == 3 || b.id == 4 || b.id == 5)
                b.answer.state = data === b;
        });

    }

    $("#preloader").css("display", "block");


    FillSurveyService.getSurveyDetails($stateParams.id)
        .then(function (result) {
            //console.log(result);
            $("#preloader").css("display", "none");

            if (!result.data.success) {
                $scope.$emit('error', result.data.message);
                return;
            }

            $scope.$emit('success', result.data.message);
            $scope.viewQuestions = result.data.result;

        }, function (result) {
            //console.log(result);
            $("#preloader").css("display", "none");
        });


    $scope.intervieweeInformation = {};

    // $scope.showModalSubmissionName = function(infoForm){
    //      if (!infoForm.$valid) {
    //         angular.element("[name='" + infoForm.$name + "']").find('.ng-invalid:visible:first').focus();
    //         return false;
    //     }
    //     $('#myModalquestion').modal('toggle');
    // }
    $scope.saveSurveySubmission = function (name) {

        $("#preloader").css("display", "block");


        var postJSON = {
            surveyId: $stateParams.id,
            sections: $scope.viewQuestions.sections,
            information: $scope.intervieweeInformation
        };
        //console.log(postJSON);

        FillSurveyService.saveSubmission(postJSON)
            .then(function (result) {
                $("#preloader").css("display", "none");

                //console.log(result);

                if (!result.data.success) {
                    $scope.$emit('danger', result.data.message);
                    return;
                }


                $scope.$emit('success', result.data.message);
                setTimeout(function () {
                    $state.go('SubmissionList', { id: $stateParams.id });
                }, 2000);

            }, function (result) {
                //console.log(result);
                $("#preloader").css("display", "none");
            });

    }
    $scope.dropDownClose = function (data, value) {
        $scope.intervieweeInformation.state = value;
        $('#menu').hide();
        //console.log(data)

    }

}