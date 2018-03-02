'use strict';

_SurveySubmissions.$inject = ["$state", "User_Config", "$q", "$stateParams", "$scope", "SurveySubmissionsService", "FillSurveyService"];
module.exports = _SurveySubmissions;

//angular.module('AOTC').controller('SurveySubmissions', _SurveySubmissions
//);
function _SurveySubmissions($state, User_Config, $q, $stateParams, $scope, SurveySubmissionsService, FillSurveyService) {
    console.log('SurveySubmissions', $stateParams)
    $scope.states = [];
    $scope.opened = false;

    $scope.availableDateOptions = User_Config.AVAILABLE_DATE_OPTIONS;
    $scope.dateFormat = User_Config.DATE_FORMAT;

    $scope.surveyId = $stateParams.surveyId;
    $scope.enableEdit = false;
    $scope.selectedNewOrUpdate = 0;

    $scope.Date = function (arg) {
        if (!arg) return;
        return new Date(arg);
    };

    $scope.setActive = function (data, options) {
        options.forEach(function (b) {
            if (b.id == 1 || b.id == 3 || b.id == 4 || b.id == 5)
                b.answer.state = data === b;
        });
    }

    $scope.addCalenderFields = function (numberOfFields, options) {

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

    }


    function getSubmissions() {

        $("#preloader").css("display", "block");
        SurveySubmissionsService.getSurveySubmissions($stateParams.id)
            .then(function (result) {

                $("#preloader").css("display", "none");

                if (!result.data.success) {
                    $scope.$emit('danger', result.data.message);
                } else {
                    // $scope.$emit('success', result.data.message);
                    $scope.submissionData = result.data.result;
                    $scope.submissionData.information.dateCalled = new Date($scope.submissionData.information.dateCalled)
                }

            });

    }

    $scope.fetchData = function () {
        $("#preloader").css("display", "block");
        $q.all([
            SurveySubmissionsService.getSurveySubmissions($stateParams.id),
            SurveySubmissionsService.getUSstates()
        ])
            .then(function (data) {

                $("#preloader").css("display", "none");
                console.log(data);
                var result = data[0];
                if (!result.data.success) {
                    $scope.$emit('danger', result.data.message);
                } else {
                    // $scope.$emit('success', result.data.message);
                    $scope.submissionData = result.data.result;
                    $scope.submissionData.information.dateCalled = new Date($scope.submissionData.information.dateCalled)
                }

                $scope.states = data[1].data.result;
            });

    }



    function getUSstates() {
        SurveySubmissionsService.getUSstates()
            .then(function (result) {
                $scope.states = result.data.result;

            });
    }

    // $scope.askForName = function(infoForm) {
    //
    //     if (!infoForm.$valid) {
    //         angular.element("[name='" + infoForm.$name + "']").find('.ng-invalid:visible:first').focus();
    //         return false;
    //     }
    //     $('#myModalquestion').modal('toggle');
    //
    // }

    $scope.AddNewSurveyMetaData = function () {


        console.log('AddMewSurveyMetaData');
        console.log($scope.submissionData);

        var postJSON = {
            surveyId: $scope.surveyId,
            sections: $scope.submissionData.sections,
            information: $scope.submissionData.information
        };


        $("#preloader").css("display", "block");


        FillSurveyService.saveSubmission(postJSON)
            .then(function (result) {
                $("#preloader").css("display", "none");
                console.log(result);

                if (!result.data.success) {
                    $scope.$emit('danger', result.data.message);
                    return;
                }

                $scope.$emit('success', result.data.message);


                setTimeout(function () {
                    $state.go('SubmissionList', { id: $scope.surveyId });
                }, 2000);

            }, function (result) {
                console.log(result);
                $("#preloader").css("display", "none");
            });


    }


    $scope.UpdateSurveyMetaData = function (infoForm) {
        console.log('UpdateSurveyMetaData');


        if (!infoForm.$valid) {
            angular.element("[name='" + infoForm.$name + "']").find('.ng-invalid:visible:first').focus();
            return false;
        }
        console.log($scope.submissionData);

        $("#preloader").css("display", "block");
        SurveySubmissionsService.updateSubmittedForm($scope.submissionData)
            .then(function (result) {
                $("#preloader").css("display", "none");

                console.log(result);
                if (!result.data.success) {
                    $scope.$emit('danger', result.data.message);
                } else {
                    $scope.$emit('success', result.data.message);
                    getSubmissions();

                }

            }, function (result) {
                console.log(result);
                $("#preloader").css("display", "none");
            });
    }


    $scope.dropDownClose = function (data, value) {
        $scope.submissionData.information.state = value;
        $('#menu').hide();
        console.log(data)

    }
}
