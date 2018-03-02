

//angular
//    .module('AOTC')
//    .component('editViewSurveyComponent', _editViewSurveyComponent);

var _editViewSurveyComponent = {
    templateUrl: 'modules/SurveyModule/EditSurvey/EditableSurveysMenu/EditViewSurvey/EditViewSurvey.component.html',
    controllerAs: 'EditViewSurveyCtrl',
    controller:
    ["$scope", "sharedService", "CreateSurveyService", "ArrangeSurveyService", "AOTCService", "$timeout", "$state", "$stateParams",
                    function ($scope, sharedService, CreateSurveyService, ArrangeSurveyService, AOTCService, $timeout, $state, $stateParams) {
                        $scope.viewQuestions = [];
                        $scope.viewQuestions = ArrangeSurveyService.selectQuestions
                        $scope.sectionData = CreateSurveyService.editQuestions
                        console.log($scope.sectionData)
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




                        this.opneSaveSurveyModal = function () {
                            $('#confirmUpdateModal').modal('show');
                        };

                        this.UpdateSubmissions = function (_option) {
                            $scope.saveSurvey(_option);
                            $('#confirmUpdateModal').modal('hide');
                        };


                        $scope.saveSurvey = function (_updateSubmissions) {
                            $("#preloader").css("display", "block");
                            var user = localStorage.getItem('userId')
                            var temp = $scope.viewQuestions;
                            var sectionOrder = []
                            var surveyItems = [];

                            //if (_updateSubmissions)

                            for (i in temp) {
                                if (temp[i][temp[i].length - 1].sectionID) {
                                    sectionOrder[i] = { sectionId: temp[i][temp[i].length - 1].sectionID, sectionOrder: parseInt(i) }
                                }
                            }

                            var count = 0;

                            for (var i in temp) {
                                console.log(temp[i])
                                for (var j = 0; j < temp[i].length; j++) {


                                    if (temp[i][j].id) {

                                        surveyItems[count] = { questionId: [temp[i][j].id, temp[i][j].ref_id], questionOrder: count, sectionId: temp[i][temp[i].length - 1].sectionID }
                                        count += 1;
                                    }
                                }
                            }


                            var postData = { 'surveyId': $stateParams.id, 'surveyName': $scope.surveyName, 'modifiedBy': user, link: 'link', sectionOrder: sectionOrder, surveyItems: surveyItems, updateSubmissions: _updateSubmissions };
                            $scope.postData(postData)
                            console.log(postData)
                        }

                        $scope.setActive = function (data, options) {

                            console.log(options)
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
                            console.log(data)
                        }
                        $scope.postData = function (postData) {

                            var url = 'surveys/updateSurvey';
                            AOTCService.postDataToServer(url, postData)
                                .then(function (result) {
                                    $("#preloader").css("display", "none");
                                    console.log("Survwey: ", result);
                                    $scope.surveyName = ''
                                    localStorage.removeItem("section")

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
module.exports = _editViewSurveyComponent;