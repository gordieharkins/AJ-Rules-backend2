var _editCreateSurveyComponent = {};


//angular
//    .module('AOTC')
//    .component('editCreateSurveyComponent', _editCreateSurveyComponent);

_editCreateSurveyComponent = {
    templateUrl: 'modules/SurveyModule/EditSurvey/EditableSurveysMenu/EditCreateSurvey/EditCreateSurvey.component.html',
    controllerAs: 'EditCreateSurveyCtrl',
    controller:
        ["$scope", "sharedService", "CreateSurveyService", "FillSurveyService", "$timeout", "$stateParams", "AddQuestionService", "$state",
             function ($scope, sharedService, CreateSurveyService, FillSurveyService, $timeout, $stateParams, AddQuestionService, $state) {


                 var selectedQuestions = [];
                 var check;
                 $scope.questionOptions = [];
                 $scope.newQuestion = {};
                 $scope.editQuestion = false;
                 $scope.valid = false
                 $scope.questionText = '';
                 console.log(CreateSurveyService.editQuestions)
                 CreateSurveyService.selectedSections = $scope.viewQuestions;


                 function checkSelectedQuestions() {
                     $("#preloader").css("display", "block");
                     FillSurveyService.getSurveyDetails($stateParams.id)
                         .then(function (result) {
                             $("#preloader").css("display", "none");

                             if (!result.data.success) {
                                 $scope.$emit('error', result.data.message);
                                 return;
                             }

                             $scope.viewQuestions = result.data.result;
                             CreateSurveyService.selectedSections = $scope.viewQuestions;
                             console.log($scope.viewQuestions)

                             if (CreateSurveyService.editQuestions.length != 0) {

                                 for (var k = 0; k < $scope.data.length; k++) {
                                     for (var i = 0; i < CreateSurveyService.editQuestions.length; i++) {
                                         if (CreateSurveyService.editQuestions[i].id == $scope.data[k].id) {
                                             $scope.data[k].check = true;
                                             // console.log(CreateSurveyService.editQuestions[i].index);
                                         }
                                     }
                                 }

                             }
                             selectDefaultQuestions();

                         }, function (result) {
                             $("#preloader").css("display", "none");
                         });


                 }



                 function selectDefaultQuestions() {
                     var temp = $scope.viewQuestions;
                     var data = $scope.data;
                     var localCheck = JSON.parse(localStorage.getItem("section"))
                     $scope.localHedge = localCheck
                     console.log(localCheck)
                     if (!localStorage.getItem("section")) {

                         for (var i = 0; i < data.length; i++) {

                             for (var j = 0; j < temp.sections.length; j++) {

                                 for (var k = 0; k < temp.sections[j].questions.length; k++) {

                                     if (data[i].id == temp.sections[j].questions[k].questionId) {
                                         var mark = 0;
                                         for (var s = 0; s < CreateSurveyService.validateQuestions.length; s++) {
                                             if (CreateSurveyService.validateQuestions[s].id == data[i].id) {
                                                 data[i].check = false;
                                                 mark = 1;
                                             }
                                         }
                                         if (mark != 1) {
                                             data[i].check = true

                                         }
                                     }
                                 }
                             }
                         }
                     }
                     else {

                         for (var i = 0; i < $scope.data.length; i++) {

                             var found = 0;
                             for (var data in localCheck) {

                                 console.log(localCheck[data])

                                 for (var t = 0; t < localCheck[data].length; t++) {

                                     if (localCheck[data][t].question) {

                                         if ($scope.data[i].id == localCheck[data][t].id) {

                                             found = 1;
                                             $scope.data[i].check = true
                                             break;
                                         }

                                     }

                                 }

                             }
                             if (found == 0) {
                                 $scope.data[i].check = false
                                 console.log(data[i])

                             }
                         }
                         for (var k = 0; k < $scope.data.length; k++) {
                             for (var i = 0; i < CreateSurveyService.editQuestions.length; i++) {
                                 if (CreateSurveyService.editQuestions[i].id == $scope.data[k].id) {
                                     $scope.data[k].check = true;
                                     console.log($scope.data[k])
                                     // console.log(CreateSurveyService.editQuestions[i].index);
                                 }
                             }
                         }
                         for (var k = 0; k < $scope.data.length; k++) {
                             for (var i = 0; i < CreateSurveyService.validateQuestions.length; i++) {
                                 if (CreateSurveyService.validateQuestions[i].id == $scope.data[k].id) {
                                     $scope.data[k].check = false;
                                     // console.log(CreateSurveyService.editQuestions[i].index);
                                 }
                             }
                         }

                     }


                 }

                 getAllQuestions();
                 function getAllQuestions() {
                     $("#preloader").css("display", "block");

                     CreateSurveyService.getAllQuestions().
                         then(function (result) {


                             var serverData = result.data;

                             if (serverData.success) {
                                 if (serverData) {
                                     $scope.data = serverData.result;
                                     if (CreateSurveyService.editQuestions.length != 0) {
                                         if (CreateSurveyService.editQuestions && CreateSurveyService.editQuestions[0].question) {
                                             for (var i = 0; i < $scope.data.length; i++) {
                                                 var found = 0;
                                                 var index = 0;

                                                 for (var j = 0; j < CreateSurveyService.editQuestions.length; j++) {

                                                     if (CreateSurveyService.editQuestions[j].id == $scope.data[i].id) {
                                                         found = 1;
                                                         break;
                                                         // console.log(CreateSurveyService.editQuestions[i].index);
                                                     }
                                                 }
                                                 if (found == 0) {
                                                     $scope.data[i].check = false;
                                                 }
                                                 else {
                                                     $scope.data[i].check = true;
                                                 }
                                             }



                                         }
                                     }
                                     checkSelectedQuestions();

                                 }
                             }

                         }, function (err) {
                             //some error
                             // console.log("Error: ", err);
                             $("#preloader").css("display", "none");
                         });
                 }

                 $scope.selectAllQuestions = function (check) {
                     var q = $scope.data
                     if (check) {
                         for (var i = 0; i < q.length; i++) {


                             var temp = {};
                             temp.question = q[i].questionText;
                             temp.id = q[i].id;
                             temp.section = q[i].section;
                             temp.sectionId = q[i].sectionId;
                             temp.ref_id = q[i].ref_id
                             temp.check = true;
                             q[i].check = true

                             if (q[i].options) {
                                 temp.options = JSON.parse(q[i].options)
                             } else {
                                 temp.options = null;
                             }
                             temp.index = i;
                             CreateSurveyService.editQuestions[i] = temp;



                         }




                     }
                     else {

                         for (var i = 0; i < q.length; i++) {


                             var temp = {};
                             temp.question = q[i].questionText;
                             temp.id = q[i].id;
                             temp.section = q[i].section;
                             temp.sectionId = q[i].sectionId;
                             temp.ref_id = q[i].ref_id
                             temp.check = false;
                             q[i].check = false
                             if (q[i].options) {
                                 temp.options = JSON.parse(q[i].options)
                             } else {
                                 temp.options = null;
                             }
                             temp.index = i;
                             $scope.data[i].check = false;
                             CreateSurveyService.editQuestions.pop()



                         }
                     }

                 }

                 $scope.addNewQuestion = function () {
                     AddQuestionService.setSelectedQuestion(null);
                     AddQuestionService.routeDecider = $stateParams.id
                     $state.go('AddQuestion');

                 }

                 $scope.editQuestion = function (question) {
                     AddQuestionService.setSelectedQuestion(question);
                     AddQuestionService.routeDecider = $stateParams.id
                     $state.go('AddQuestion');

                 }

                 $scope.selectedCheckbox = function (q, c, index) {
                     var dataCheck = CreateSurveyService.editQuestions;
                     console.log(q.id)
                     if (c) {
                         var temp = {};
                         temp.question = q.questionText;
                         temp.id = q.id;
                         temp.section = q.section;
                         temp.sectionId = q.sectionId;
                         temp.ref_id = q.ref_id
                         temp.check = c;
                         if (q.options) {
                             temp.options = JSON.parse(q.options)
                         } else {
                             temp.options = null;
                         }
                         temp.index = index;
                         CreateSurveyService.editQuestions.splice(index, 0, temp)
                         for (var t = 0; t < CreateSurveyService.validateQuestions.length; t++) {
                             if (CreateSurveyService.validateQuestions[t].id == q.id) {
                                 CreateSurveyService.validateQuestions.splice(t, 1)
                             }

                         }
                     }
                     else {
                         for (var i = 0; i < dataCheck.length; i++) {
                             if (q.id == dataCheck[i].id) {


                                 CreateSurveyService.editQuestions.splice(i, 1);

                             }
                         }
                         var temp = {};
                         temp.question = q.questionText;
                         temp.id = q.id;
                         temp.section = q.section;
                         temp.sectionId = q.sectionId;
                         temp.ref_id = q.ref_id
                         temp.check = c;
                         if (q.options) {
                             temp.options = JSON.parse(q.options)
                         } else {
                             temp.options = null;
                         }
                         temp.index = index;
                         CreateSurveyService.validateQuestions.push(temp)
                         // console.log( CreateSurveyService.editQuestions);
                     }
                     console.log(CreateSurveyService.editQuestions);
                 }
             }]
};

module.exports = _editCreateSurveyComponent;