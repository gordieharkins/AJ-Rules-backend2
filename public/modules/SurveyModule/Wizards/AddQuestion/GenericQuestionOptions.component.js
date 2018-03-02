


//angular
//    .module('AOTC')
//    .component('inputFields', _inputFields);

var _inputFields =  {
    templateUrl: 'modules/SurveyModule/Wizards/AddQuestion/generic-question-options.component.html',
    controllerAs: 'inputFields',
    bindings: {
        questionOptions: '='
    },
    controller: 
       ["$scope", "sharedService", "CreateSurveyService",
            function ($scope, sharedService, CreateSurveyService) {
                var vm = this;

                var selectedQuestions = [];
                var check;
                // vm.questionOptions = [];



                $scope.addOption = function (type) {

                    var option = {};

                    switch (type) {

                        case 0:
                            option = {
                                id: type,
                                inputValue: ''
                            }
                            break;

                        case 1:
                            option = {
                                id: type,
                                radioLabel: 'Text',
                            }
                            break;

                        case 2:
                            option = {
                                id: type,
                                checkboxLabel: 'Text',
                            }
                            break;

                        case 3:
                            option = {
                                id: type,
                                radioLabel: 'Text',
                                inputValue: ''
                            }
                            break;

                        case 4:
                            option = {
                                id: type,
                                radioLabel1: 'Text',
                                inputValue: '',
                                radioLabel2: 'Text',
                            }
                            break;

                        case 5:
                            option = {
                                id: type,
                                radioLabel: 'Text',
                                dropDownOptions: []
                            }
                            break;

                        case 6:
                            option = {
                                id: type,
                                checkboxLabel: 'Text',
                                dropDownOptions: []
                            }
                            break;

                        case 7:
                            option = {
                                id: type,
                                label: 'Text',
                                inputValue: ''
                            }
                            break;

                        case 8:
                            option = {
                                id: type,
                                inputValue: ''
                            }
                            break;

                        case 9:
                            option = {
                                id: type,
                                label: 'Text',
                                radioLabel1: 'Text',
                                radioLabel2: 'Text',
                            }
                            break;

                        case 10:
                            option = {
                                id: type,
                                label1: 'Text',
                                inputValue: '',
                                label2: 'Text',
                                radioLabel1: 'Text',
                                radioLabel2: 'Text'
                            }
                            break;



                        default:
                            break;

                    }

                    vm.questionOptions.push(option);
                }

            }]
};
module.exports = _inputFields;