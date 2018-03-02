


//angular
//    .module('AOTC')
//    .component('createSurveyComponent', _createSurveyComponent);

var _createSurveyComponent = {
    templateUrl: 'modules/SurveyModule/Wizards/CreateSurvey/CreateSurvey.html',
    controllerAs: 'CreateSurveyCtrl',
    controller:
       ["$scope", "$state", "CreateSurveyService", "$timeout", "AddQuestionService",
           function ($scope, $state, CreateSurveyService, $timeout, AddQuestionService) {
               console.log("Create Survey controller");
               var vm = this;
               getAllQuestions();


               function getAllQuestions() {
                   $("#preloader").css("display", "block");

                   CreateSurveyService.getAllQuestions().
                       then(function (result) {
                           $("#preloader").css("display", "none");

                           var serverData = result.data;

                           if (serverData.success) {
                               if (serverData) {
                                   vm.data = serverData.result;
                                   console.log(CreateSurveyService.questions)
                                   console.log(vm.data)
                                   if (CreateSurveyService.questions.length != 0) {
                                       if (CreateSurveyService.questions && CreateSurveyService.questions[0].question) {
                                           for (var i = 0; i < vm.data.length; i++) {
                                               var found = 0;
                                               var index = 0;

                                               for (var j = 0; j < CreateSurveyService.questions.length; j++) {

                                                   if (CreateSurveyService.questions[j].id == vm.data[i].id) {
                                                       console.log(i)
                                                       found = 1;
                                                       break;
                                                       // console.log(CreateSurveyService.questions[i].index);
                                                   }
                                               }
                                               if (found == 0) {
                                                   vm.data[i].check = false;
                                               }
                                               else {
                                                   vm.data[i].check = true;
                                               }
                                           }



                                       }
                                   }
                               }
                           }

                       }, function (err) {
                           //some error
                           // console.log("Error: ", err);
                           $("#preloader").css("display", "none");
                       });
               }
               $scope.selectAll = false;
               $scope.selectAllQuestions = function (check) {

                   var q = vm.data
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
                           CreateSurveyService.questions[i] = temp;



                       }



                   }
                   else {
                       console.log("untick")

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
                           vm.data[i].check = false;
                           console.log(vm.data[i])

                           CreateSurveyService.questions.pop()



                       }
                   }

               }

               vm.selectedCheckbox = function (q, c, index) {
                   var dataCheck = CreateSurveyService.questions;
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
                       CreateSurveyService.questions.splice(index, 0, temp)
                       console.log("inserting:---" + temp.question + " " + index)
                   }
                   else {
                       console.log(index)
                       for (var i = 0; i < dataCheck.length; i++) {
                           if (q.id == dataCheck[i].id) {
                               console.log(q)
                               console.log(i)

                               CreateSurveyService.questions.splice(i, 1);

                           }
                       }

                       // console.log( CreateSurveyService.questions);


                   }
                   console.log(CreateSurveyService.questions);

               }

               $scope.deleteQuestions = function (q) {
                   $("#preloader").css("display", "none");
                   CreateSurveyService.deleteQuestion(q)
                       .then(function (result) {
                           console.log("result: ", result);

                           if (!result.data.success) {
                               $scope.$emit('error', result.data.message);
                               return;
                           }
                           $scope.$emit('success', result.data.message);
                           getAllQuestions()
                       },
                       function (err) {
                           console.log("Error: ", err);
                           $("#preloader").css("display", "none");
                       });

               }

               $scope.addNewQuestion = function () {
                   AddQuestionService.setSelectedQuestion(null);
                   AddQuestionService.routeDecider = "Surveys"
                   $state.go('AddQuestion');

               }

               $scope.editQuestion = function (question) {
                   AddQuestionService.setSelectedQuestion(question);
                   AddQuestionService.routeDecider = "Surveys"
                   $state.go('AddQuestion');

               }


               $('#closemodal').click(function () {
                   $('#modalwindow').modal('hide');
               });
           }],



}
module.exports = _createSurveyComponent;