
_AddQuestionCtrl.$inject = ["$scope", "AddQuestionService",  "User_Config", "$state"];
module.exports = _AddQuestionCtrl;


//angular
//    .module('AOTC')
//    .controller('AddQuestionCtrl', _AddQuestionCtrl
//    );
function _AddQuestionCtrl($scope, AddQuestionService, User_Config, $state) {
    //console.log("AddQuestionCtrl controller");

    $scope.dateFormat = User_Config.DATE_FORMAT;
    $scope.availableDateOptions = User_Config.AVAILABLE_DATE_OPTIONS;
    $scope.dropDownOptions = User_Config.DROPDOWN_OPTIONS_ANSWER_FIELD_TYPE;

    var vm = this;
    vm.questionOptions = [];

    $scope.newQuestion = {};
    vm.SaveNewQuestion = SaveNewQuestion;
    vm.editQuestion = false;

    var question = AddQuestionService.getSelectedQuestion();
    //console.log(question);

    if (question) {
        vm.editQuestion = true;
        $scope.newQuestion = question;
        if (question.options)
            vm.questionOptions = JSON.parse(question.options);
    }

    $scope.SaveEditQuestion = function (newquestion) {
        $("#preloader").css("display", "block");
        //console.log(newquestion)

        newquestion.options = JSON.stringify(vm.questionOptions);
        AddQuestionService.SaveEditedQuestion(newquestion)
            .then(function (result) {
                $("#preloader").css("display", "none");
                // //console.log("result: ", result);

                if (!result.data.success) {
                    $scope.$emit('error', result.data.message);
                    return;
                }

                $scope.$emit('success', result.data.message);
                vm.questionOptions = [];
                setTimeout(function () {
                    var route = AddQuestionService.routeDecider;
                    if (route != "Surveys") {
                        $state.go($state.go('EditSurvey', { id: route }));

                    }
                    else {
                        $state.go("Survey");

                    }

                }, 2000);

            },
            function (err) {
                //console.log("Error: ", err);
                $("#preloader").css("display", "none");
            });


    }


    $scope.valid = false
    $scope.questionText = '';

    function SaveNewQuestion(newquestion) {

        if (!newquestion.questionText) {
            $scope.valid = true;
        } else {
            $scope.valid = false;
            newquestion.options = JSON.stringify(vm.questionOptions);

            $("#preloader").css("display", "block");
            AddQuestionService.addNewQuestion(newquestion)
                .then(function (result) {
                    //console.log("result: ", result);
                    $("#preloader").css("display", "none");


                    if (!result.data.success) {
                        $scope.$emit('error', result.data.message);
                        return;
                    }

                    $scope.$emit('success', result.data.message);
                    vm.questionOptions = [];
                    setTimeout(function () {
                        var route = AddQuestionService.routeDecider
                        //console.log(route)
                        if (route != "Surveys") {
                            $state.go($state.go('EditSurvey', { id: route }));

                        }
                        else {
                            $state.go("Survey");

                        }
                    }, 2000);
                },
                function (err) {
                    //console.log("Error: ", err);
                    $("#preloader").css("display", "none");
                });
        }
    }

}