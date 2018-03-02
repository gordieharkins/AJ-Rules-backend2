'use strict';


_addSurveyDemo.$inject = ["$stateParams", "$anchorScroll", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "HackathonService", "$timeout"];
module.exports = _addSurveyDemo;

//angular.module('AOTC').controller('addSurveyDemo', _addSurveyDemo);

function _addSurveyDemo($stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, HackathonService, $timeout) {
    ////console.log("addSurvey controller", $stateParams);
    var vm = this;
    vm.assessorDetails = [];
    vm.boardDetails = [];
    vm.fiscalStartDate = "";
    vm.fiscalEndDate = "";



    $scope.showUrl = false;
    $scope.maximize1 = false;
    $scope.maximize2 = false;
    $scope.maximize3 = false;
    $scope.maximize4 = false;
    $scope.maximize5 = false;
    $scope.maximize6 = false;
    $scope.maximize7 = false;





    // setTimeout(function() {
    //     $scope.messageForPop = "sucess";
    //     $scope.$apply();
    //     $("#popup_success").fadeIn(500).delay(3500).fadeOut(2500);

    // }, 2000);
    // $('#preloader').css('display', 'block');
    vm.surveyData = {
        surveyMetaData: {
            assessingAuthName: "",
            listRelevantWebsites: "",
            interviewer: "",
            phoneNumberCalled: "",
            dateCalled: "",
            interviewee: "",
            intervieweeOfficeAddress: "",
            intervieweeOfficeEmail: ""
        },
        questions: [{ //assessment questions started from here
            qId: 1,
            answer: ''

        }, {
            qId: 2,
            answer: ''

        }, {
            qId: 3,
            answer: ''
        }, {
            qId: 4,
            answer: ''
        }, { //Income survey questions started from here
            qId: 5,
            answer: ''
        }, {
            qId: 6,
            answer: ''
        }, {
            qId: 7,
            answer: ''
        }, {
            qId: 8,
            answer: ''
        }, {
            qId: 9,
            answer: ''
        }, {
            qId: 10,
            answer: ''
        }, {
            qId: 11,
            answer: ''
        }, {
            qId: 12,
            answer: ''
        }, {
            qId: 13,
            answer: ''
        }, {
            qId: 14,
            answer: ''
        }, { //appeal process - first level appeal
            qId: 15,
            answer: ''
        }, {
            qId: 16,
            answer: ''
        }, {
            qId: 17,
            answer: ''
        }, {
            qId: 18,
            answer: ''
        }, {
            qId: 19,
            answer: ''
        }, {
            qId: 20,
            answer: ''
        }, {
            qId: 21,
            answer: ''
        }, {
            qId: 22,
            answer: ''
        }, {
            qId: 23,
            answer: ''
        }, {
            qId: 24,
            answer: ''
        }, { //appeal process - second level appeal
            qId: 25,
            answer: ''
        }, {
            qId: 26,
            answer: ''
        }, {
            qId: 27,
            answer: ''
        }, {
            qId: 28,
            answer: ''
        }, {
            qId: 29,
            answer: ''
        }, {
            qId: 30,
            answer: ''
        }, {
            qId: 31,
            answer: ''
        }, {
            qId: 32,
            answer: ''
        }, { //appeal process - third level appeal
            qId: 33,
            answer: ''
        }, {
            qId: 34,
            answer: ''
        }, {
            qId: 35,
            answer: ''
        }, {
            qId: 36,
            answer: ''
        }, {
            qId: 37,
            answer: ''
        }, { //tax authority
            qId: 38,
            answer: ''
        }, {
            qId: 39,
            answer: ''
        }, {
            qId: 40,
            answer: ''
        }, {
            qId: 41,
            answer: '',
            contactDetails: [{
                email: "",
                address: "",
                phone: ""
            }]
        }, { //contact info
            qId: 42,
            answer: '',
            contactDetails: [{
                email: "",
                address: "",
                phone: ""
            }]
        }, { //Does the Jurisdiction have an Income Survey process?
            qId: 43,
            answer: "no"
        }, { //Are there special rules related to evidence at the board?
            qId: 44,
            answer: 'no'
        }, { //Is there a 3rd level of appeal?
            qId: 45,
            answer: 'no'
        }]

    };



    $scope.typed = 1;
    $scope.typing = 1;

    $scope.typed2 = 1;
    $scope.typing2 = 1;

    $scope.$watch('typing2', debounce(function () {
        // $scope.$watch(vm.surveyData.questions[40].answer, debounce(function() {
        $scope.typed2 = $scope.typing2;
        vm.surveyData.questions[41].answer = $scope.typed2;
        ////console.log($scope.typed2);

        $scope.boardContactDetails = [];

        for (var k = 0; k < $scope.typed2; k++) {
            var details = {
                'phone': '',
                'email': '',
                'address': ''

            };
            $scope.boardContactDetails.push(details);

        }
        vm.boardDetails = $scope.boardContactDetails;

        $scope.$apply();
    }, 500));




    $scope.$watch('typing', debounce(function () {
        // $scope.$watch(vm.surveyData.questions[40].answer, debounce(function() {
        $scope.typed = $scope.typing;
        vm.surveyData.questions[40].answer = $scope.typed;
        ////console.log($scope.typed);

        $scope.contactDetails = [];

        for (var k = 0; k < $scope.typed; k++) {
            var details = {
                'phone': '',
                'email': '',
                'address': ''

            };
            $scope.contactDetails.push(details);

        }
        vm.assessorDetails = $scope.contactDetails;

        $scope.$apply();
    }, 500));


    $scope.numberOfBills = 1;


    $scope.$watch('numberOfBills', debounce(function () {
        // $scope.$watch(vm.surveyData.questions[40].answer, debounce(function() {
        //vm.surveyData.questions[40].answer = $scope.numberOfBills;
        ////console.log($scope.numberOfBills);

        $scope.numberOfBillsHtmlFields = [];

        for (var k = 0; k < $scope.numberOfBills; k++) {
            var billDate = {
                'billDate': ''

            };

            $scope.numberOfBillsHtmlFields.push(billDate);

        }
        vm.billDueDates = $scope.numberOfBillsHtmlFields;

        $scope.$apply();
    }, 500));

    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }














    vm.addAJSurvey = addAJSurvey;

    function addAJSurvey() {
        // ////console.log(vm.assessorDetails);
        vm.surveyData.questions[40].contactDetails = vm.assessorDetails;
        vm.surveyData.questions[41].contactDetails = vm.boardDetails;
        vm.surveyData.questions[39].answer = vm.fiscalStartDate + '|' + vm.fiscalEndDate;
        vm.surveyData.questions[37].answer = JSON.stringify(vm.billDueDates);
        ////console.log(vm.surveyData);

        var url = '/aJRules/addAJRules';

        $("#preloader").css("display", "block");

        HackathonService.postDataToServer(url, vm.surveyData)
            .then(function (result) {
                ////console.log(result);
                $("#preloader").css("display", "none");

                $("#popup_success").fadeIn(500).delay(1000).fadeOut(500, function () {
                    $state.go('viewAJData');

                });



            }, function (result) {
                //some error
                ////console.log(result);
            });



    }

    vm.togglePlusMinus = togglePlusMinus;

    function togglePlusMinus(maximize1) {
        maximize1 = !maximize1;



    }




    $('#sandbox-container input').datepicker({
        autoclose: true
    });


    $('#sandbox-container input').on('show', function (e) {
        console.debug('show', e.date, $(this).data('stickyDate'));

        if (e.date) {
            $(this).data('stickyDate', e.date);
        } else {
            $(this).data('stickyDate', null);
        }
    });

    $('#sandbox-container input').on('hide', function (e) {
        console.debug('hide', e.date, $(this).data('stickyDate'));
        var stickyDate = $(this).data('stickyDate');

        if (!e.date && stickyDate) {
            console.debug('restore stickyDate', stickyDate);
            $(this).datepicker('setDate', stickyDate);
            $(this).data('stickyDate', null);
        }
    });




}
