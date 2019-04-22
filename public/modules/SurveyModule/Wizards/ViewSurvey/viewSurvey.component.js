


//angular
//    .module('AOTC')
//    .component('viewSurveyController', _viewSurveyController);

var _viewSurveyController = {
    templateUrl: 'modules/SurveyModule/Wizards/ViewSurvey/ViewSurvey.html',
    controllerAs: 'ViewSurveyCtrl',
    controller:
        ["$scope", "sharedService", "CreateSurveyService", "ArrangeSurveyService", "AOTCService", "$timeout", "$state",
            function ($scope, sharedService, CreateSurveyService, ArrangeSurveyService, AOTCService, $timeout, $state) {
                $scope.viewQuestions = [];
                $scope.viewQuestions = ArrangeSurveyService.selectQuestions
                $scope.surveyName = ''
                $scope.noticesNumber = 0;
                $scope.noticesDates = [];
                var length = 0;

                $scope.dateFormat = 'MM-dd-yyyy';

                $scope.availableDateOptions = {
                    formatYear: 'yy',
                    startingDay: 1,
                    minDate: new Date(1975, 1, 1),
                    maxDate: new Date(2030, 1, 1)
                };



                $scope.saveSurvey = function () {
                    $("#preloader").css("display", "block");
                    var user = localStorage.getItem('userId')
                    var temp = $scope.viewQuestions;
                    var sectionOrder = []
                    var surveyItems = []

                    for (i in temp) {
                        if (temp[i][temp[i].length - 1].sectionID) {
                            sectionOrder[i] = { sectionId: temp[i][temp[i].length - 1].sectionID, sectionOrder: parseInt(i) }
                        }
                    }

                    var count = 0;

                    for (var i in temp) {
                        //console.log(temp[i])
                        for (var j = 0; j < temp[i].length; j++) {


                            if (temp[i][j].id) {

                                surveyItems[count] = { questionId: temp[i][j].id, questionOrder: count, sectionId: temp[i][temp[i].length - 1].sectionID }
                                count += 1;
                            }
                        }
                    }

                    $('#myModalquestion').modal('toggle');

                    var postData = { 'surveyName': $scope.surveyName, 'createdBy': user, link: 'link', sectionOrder: sectionOrder, surveyItems: surveyItems }
                    $scope.postData(postData)
                    //console.log(postData)
                }

                $scope.setActive = function (data, options) {

                    //console.log(options)
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


                $scope.dateValidation = function (data) {
                    //console.log(data)
                }
                $scope.postData = function (postData) {

                    var url = 'surveys/addSurvey';
                    AOTCService.postDataToServer(url, postData)
                        .then(function (result) {
                            $("#preloader").css("display", "none");
                            //console.log("Survwey: ", result);
                            $scope.surveyName = ''

                            if (result.data.success) {
                                $scope.$emit('success', result.data.message);
                                $state.go('SurveyList')
                            } else {
                                $scope.$emit('danger', result.data.message);
                            }
                            $("#preloader").css("display", "none");

                        }, function (result) {
                            $("#preloader").css("display", "none");
                        });
                }


                $scope.setNotices = function (data) {
                    if ($scope.noticesDates.length > data) {
                        length = $scope.noticesDates.length - data;
                        for (var i = 0; i < length; i++) {
                            $scope.noticesDates.splice(i, 1);
                        }
                    } else {
                        length = data - $scope.noticesDates.length;
                        for (var i = 0; i < length; i++) {
                            var obj = { opened: false, value: '' }
                            $scope.noticesDates.push(obj);
                        }
                    }

                }





            }]



};

module.exports = _viewSurveyController;
