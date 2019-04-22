'use strict';

_viewAJForm.$inject =  ["User_Config" , "$stateParams", "$anchorScroll", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _viewAJForm;

//angular.module('AOTC').controller('viewAJForm', _viewAJForm);

function _viewAJForm(User_Config, $stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    //////console.log("viewAJForm controller", $stateParams);

    var vm = this;
    vm.tableData = [];
    $scope.maximize1 = false;
    $scope.maximize2 = false;
    $scope.maximize3 = false;
    $scope.maximize4 = false;
    $scope.maximize5 = false;
    $scope.maximize6 = false;
    $scope.maximize7 = false;
    vm.hideBoardOfficeGrid = false;
    vm.hideAssessorOfficeGrid = false;

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withDisplayLength(5)
        .withOption('lengthMenu', [
            [5, 10, 15, -1],
            [5, 10, 15, "All"]
        ])
        .withOption('order', [
            [0, 'asc']
        ]);
    vm.dtColumnDefs = [];
    vm.ajRulesData = [];
    vm.AJData = {};

    if ($stateParams.AJData != null) {

        //////console.log('if')
        localStorage.setItem('AjData', angular.toJson($stateParams.AJData));
        vm.AJData = $stateParams.AJData

    } else {
        //////console.log('else')
        vm.AJData = JSON.parse(localStorage.getItem('AjData'));
    }

    //////console.log(vm.AJData)

    // setTimeout(function() {
    //     var id = 1;
    //     var answer = 2;
    //     $('#41').val(answer)
    // }, 200);

    $('#preloader').css('display', 'block');

    vm.AJQuestions = [];
    vm.assessorContacts = [];
    vm.boardContacts = [];
    vm.fiscalYearStartDate = "";
    vm.fiscalYearEndDate = "";
    vm.numberOfBills = [];

    AOTCService.getDataFromServer('/aJRules/getAllSurveysDataById?Id=' + vm.AJData.id)
        .then(function (result) {

            var serverData = result.data;
            if (serverData.success) {
                vm.AJQuestions = serverData.result;
                if (vm.AJQuestions.length == 0) {
                    $scope.$emit('danger', User_Config.NO_DATA);
                }
                for (var i = 0; i < vm.AJQuestions.length; i++) {
                    var question = vm.AJQuestions[i];

                    if (question.id == 38) {
                        var answerJson = question.answer;

                        //////console.log(JSON.parse(answerJson));
                        vm.numberOfBills = JSON.parse(answerJson);


                    }

                    if (question.id == 40) {
                        var fiscalYearDates = question.answer.split('|');
                        vm.fiscalYearStartDate = fiscalYearDates[0];
                        vm.fiscalYearEndDate = fiscalYearDates[1];

                        // //////console.log(fiscalYearDates);
                        // //////console.log(vm.fiscalYearStartDate);
                        // //////console.log(vm.fiscalYearEndDate);

                        $('#40a').text(vm.fiscalYearStartDate)
                        $('#40b').text(vm.fiscalYearEndDate)

                    }

                    if (question.id == 41 || question.id == 42) {

                        $('#' + question.id).val(question.answer)

                        //41 assessor
                        if (question.id == 41) {
                            vm.assessorContacts = question.contactDetails;
                            if (vm.assessorContacts.length == 0) {
                                vm.hideAssessorOfficeGrid = true;
                            }
                        }
                        //42 board
                        if (question.id == 42) {
                            vm.boardContacts = question.contactDetails;
                            if (vm.boardContacts.length == 0) {
                                vm.hideBoardOfficeGrid = true;


                            }
                        }

                    } else {

                        $('#' + question.id).text(question.answer)

                    }


                    //for checkboxes states


                    if (question.id == 43) {
                        if (question.answer == "yes") {
                            $(".survey").show();
                        } else {
                            $(".survey").hide();
                        }
                    }
                    if (question.id == 44) {
                        if (question.answer == "yes") {
                            $(".surveyrules").show();
                        } else {
                            $(".surveyrules").hide();
                        }
                    }

                    if (question.id == 45) {
                        if (question.answer == "yes") {
                            $(".surveyap").show();
                        } else {
                            $(".surveyap").hide();
                        }
                    }


                }

            }
            else {
                $scope.$emit('error', serverData.message);
            }


            // vm.tableData = result.data;
            $('#preloader').css('display', 'none');

        }, function (result) {
            //////console.log(result);
            $('#preloader').css('display', 'none');


        });

        angular.element(document).ready(function () {
            $("#no").click(function () {
                $(".survey").hide();
            });
            $("#yes").click(function () {
                $(".survey").show();
            });
            $("#norules1").click(function() {
                $(".surveyrules").hide();
            });
            $("#yesrules1").click(function() {
                $(".surveyrules").show();
            });
            $("#noap").click(function() {
                $(".surveyap").hide();
            });
            $("#yesap").click(function() {
                $(".surveyap").show();
            });  
            $("#norules").click(function() {
                $(".surveyrules").hide();
            });
            $("#yesrules").click(function() {
                $(".surveyrules").show();
            }); 
        }); 



}
