
var _editArrangeSurveyComponent = {};


//angular
//    .module('AOTC')
//        .directive('myDraggable', _myDraggable
//)
//    .filter('nameFilter',_nameFilter
//)
//    .component('editArrangeSurveyComponent', _editArrangeSurveyComponent);

function _myDraggable() {

    return {
        link: function (scope, el, attrs) {
            el.draggable({
                connectToSortable: attrs.myDraggable,
                helper: "clone",
                revert: "invalid"
            });
            el.disableSelection();
        }
    }

}

function _nameFilter() {

    return function (objects) {
        var filterResult = new Array();
        var count = 0;
        var myArray = [];
        for (var obj in objects) {
            if (objects[obj]) {
                objects[obj].id = count;
                count++;
                myArray.push(objects[obj]);
            }
        }



        return myArray;
    }
}

_editArrangeSurveyComponent = {
    templateUrl: 'modules/SurveyModule/EditSurvey/EditableSurveysMenu/EditArrangeSurvey/EditArrangeSurvey.component.html',
    controllerAs: 'EditArrangeSurveyCtrl',
    controller:
    ["$scope", "sharedService", "ArrangeSurveyService", "CreateSurveyService", "$state", "FillSurveyService", "$stateParams",

        function ($scope, sharedService, ArrangeSurveyService, CreateSurveyService, $state, FillSurveyService, $stateParams) {
            var vm = this;
            //console.log($scope.tempSelections)
            $scope.tempSelections = null
            var globalSet = null
            $scope.models = {
                selected: null,
                lists: {},
                restoreList: {}
            };

            $scope.len = 0;
            $scope.example1data = [{}];
            $scope.example1model = [];

            $scope.setSections = { "A": [] }
            $scope.models = {
                selected: null,
                lists: {},
                restoreList: {}
            };

            $scope.models2 = {
                selected: null,
                lists: { "B": [] }
            };


            if (localStorage.getItem("section")) {
                //console.log(localStorage.getItem("section"))
                var temp = JSON.parse(localStorage.getItem("section"))
                $scope.models.lists = temp
                $scope.tempSelections = temp
                //console.log($scope.models.lists)
                var temp = $scope.models.lists

                for (var data in temp) {

                    for (var i = 0; i < temp[data].length; i++) {
                        for (var j = 0; j < CreateSurveyService.validateQuestions.length; j++) {
                            if (temp[data][i]) {
                                if (temp[data][i].id == CreateSurveyService.validateQuestions[j].id) {
                                    //console.log(temp[data][i])
                                    temp[data].splice(i, 1)

                                }
                            }
                        }

                    }
                }
                initModel();


            }
            else {
                checkSelectedQuestions();
            }
            $scope.service = CreateSurveyService.validateQuestions

            function checkSelectedQuestions() {
                $("#preloader").css("display", "block");

                FillSurveyService.getEditSurveyDetails($stateParams.id)
                    .then(function (result) {
                        //console.log(result);


                        if (!result.data.success) {
                            $scope.$emit('error', result.data.message);
                            return;
                        }
                        $("#preloader").css("display", "none");
                        //console.log(CreateSurveyService.selectQuestions)
                        $scope.tempSelections = result.data.result;
                        $scope.models.lists = $scope.tempSelections


                        globalSet = $scope.models.lists

                        initModel();

                    }, function (result) {
                        $("#preloader").css("display", "none");
                    });


            }
            $scope.enableList = true;
            $scope.user = {
                name: ''
            };
            // $(document).click(function(){
            //     $("#dropOut").hide('slow');
            // });

            $("#dropOut").click(function (e) {
                e.stopPropagation();
            });


            $scope.sectionData = {
                sectionText: ''
            };
            $scope.example14settings = {
                externalIdProp: "",
                closeOnBlur: true
            };
            $scope.killDropDown = function () {
                $(".dropdown ul").remove();

                // $('#dropOut').dropdown("toggle");
                /*
                 $("#dropOut").empty();

                 */
            }
            $scope.name = '';
            $scope.sectionName = [];
            $scope.loadings = false;
            // $scope.addDiv=function(){
            //     $scope.sectionName.push($scope.name);
            //     //console.log($scope.sectionName);
            // };


            $scope.enableListFunction = function () {

                if ($scope.enableList == true) {
                    $scope.enableList = false;
                }
                else {
                    $scope.enableList = true;
                }


            }



            $scope.removed = [{}]
            getAllSections();
            function getAllSections() {
                ArrangeSurveyService.getAllSections().
                    then(function (result) {
                        var serverData = result.data;
                        if (serverData.success) {
                            if (serverData) {
                                vm.sections = serverData.result;
                                //startAgain();
                                for (var i = 0; i < vm.sections.length; ++i) {

                                    $scope.example1data[i] = ({ id: vm.sections[i].section, label: vm.sections[i].section, sectionId: vm.sections[i].sectionId })
                                }

                            }

                        }
                    }, function (err) {
                        //some error
                        //console.log("Error: ", err);
                        $("#preloader").css("display", "none");
                    })
            }

            if (!CreateSurveyService.editQuestions) {
                if (!CreateSurveyService.editQuestions[0].question) {

                    var i = 0;
                    CreateSurveyService.editQuestions.splice(i, 1);
                }
            }


            $scope.inits = function () {

                if (CreateSurveyService.editQuestions) {

                    vm.data = CreateSurveyService.editQuestions;
                    $scope.models2.lists.B = CreateSurveyService.editQuestions;

                }
                else {

                    $scope.error = 'You have not yet selected any question';

                }
                //console.log($scope.service)

            };



            $scope.gotoSectionSettings = function () {

                $state.go('SectionSettings')

            }



            //Library Integartion



            // Generate initial model

            function initModel() {
                var tempSelections = $scope.tempSelections


                if (tempSelections[0]) {
                    for (var item in tempSelections) {



                        $scope.example1model.push({
                            "id": tempSelections[item][tempSelections[item].length - 1].key,
                            "label": tempSelections[item][tempSelections[item].length - 1].key,
                            "sectionId": tempSelections[item][tempSelections[item].length - 1].sectionID
                        })


                    }

                }
                $scope.len = $scope.example1model.length
                //console.log($scope.len)
            }

            function startAgain() {

                $('#btnget').click(function () {

                    alert($('#chkveg').val());


                });
            }
            $(function () {
                $(".grid").sortable({
                });
            });

            list = [];




            $scope.onItemSelect = function (data, item) {

                var startCount = 0;

                //console.log($scope.len)

                if (data.length < $scope.len) {

                    var checkExist = 0;



                    if (checkExist == 0) {
                        var indexList = 0;

                        for (var listMaker in $scope.models.lists) {
                            var matched = 0;
                            restoreLen = 0;
                            for (var k in $scope.models.restoreList) {
                                var tempArr = $scope.models.lists[listMaker];
                                var tempArr2 = $scope.models.restoreList[k];

                                if (tempArr && tempArr2 && tempArr[tempArr.length - 1].key == tempArr2[tempArr2.length - 1].key) {
                                    matched = 1;
                                    break;
                                }
                                restoreLen++
                            }
                            if (matched == 1) {

                                $scope.models.restoreList[restoreLen] = $scope.models.lists[indexList]
                                indexList++
                                restoreLen++
                            }
                            else {
                                $scope.models.restoreList[restoreLen] = $scope.models.lists[indexList]
                                indexList++
                                restoreLen++
                            }

                        }


                        if ($scope.removed) {
                            var temp = $scope.removed.length;
                        }
                        else {
                            var temp = 0
                        }


                        $scope.removed[temp] = data

                        for (var i = 0; i < $scope.len; i++) {
                            var check = 0;
                            for (var k = 0; k < data.length; k++) {


                                for (var s = 0; s < $scope.models.lists[i].length; s++) {
                                    var extractKey = $scope.models.lists[i][s].key;

                                    if (extractKey) {
                                        break;
                                    }
                                }
                                if (extractKey == data[k].id) {

                                    check = 1;
                                    break;
                                }


                                //  $scope.models.lists[data[i].id.toString()]=[{}]
                                // $scope.len=$scope.models.lists.length

                            }
                            if (data.length == 0) {

                                for (var s = 0; s < $scope.models.lists[i].length; s++) {

                                    var extractKey = $scope.models.lists[i][s].key

                                    if (extractKey) {
                                        break;
                                    }
                                }

                            }
                            if (check == 0) {

                                var found = false;
                                var list = $scope.models.lists;
                                //get the length to properly iterate, requires proper keys e.g. 0,1,2,3
                                var length = +Object.keys(list).sort().reverse()[0] + 1;
                                //iterate over
                                for (var i = 0; i < length - 1; i++) {


                                    for (var s = 0; s < list[i].length; s++) {

                                        var tempArr4 = $scope.models.lists[s];
                                        var extractKey2 = list[i][s].key

                                        if (extractKey2) {

                                            if (extractKey === extractKey2 || found) {
                                                //if found override current with next
                                                found = true;
                                                list[i] = list[i + 1];


                                            }
                                        }


                                    }
                                }
                                //delete last one if weve found sth before, or if the last is the one to be deleted

                                for (var k in list[i]) {
                                    if (list[i][k].key) {
                                        var deleteKey = (list[i][k].key)
                                        break;

                                    }
                                }
                                if (deleteKey === extractKey || found) {


                                    // $scope.models.restoreList=$scope.models.lists[i][s]

                                    delete list[i];
                                }
                                $scope.models.lists = list
                                $scope.len--
                                break;

                            }

                        }
                        if (data.length == 0) {
                            $scope.models.lists = {}
                            $scope.len = 0;

                        }
                    }
                }
                else {
                    checkExist = 0;
                    var run = 0
                    if (run == 0) {
                        for (var k in $scope.models.restoreList) {
                            var tempArr3 = $scope.models.restoreList[k];


                            if (tempArr3 && data[data.length - 1] && tempArr3[tempArr3.length - 1].key == data[data.length - 1].id) {
                                var y = 0;
                                checkExist = 1;
                                var levelFound = 0;

                                for (s in $scope.models.lists) {
                                    var tempArr4 = $scope.models.lists[s];

                                    if (tempArr4[tempArr4.length - 1].key == data[data.length - 1].id) {
                                        levelFound = 1;

                                    }
                                    y++
                                }
                                if (levelFound == 0) {
                                    $scope.models.lists[y] = tempArr3
                                    $scope.len = data.length
                                    checkExist = y++
                                    break;
                                }
                            }
                            run++
                        }
                        var lastindx = 0;
                        var restoreIndex = 0
                        var newIndex = 0;
                        var replacable = $scope.models.restoreList;
                        if (checkExist == 0) {
                            for (var i = 0; i < data.length; i++) {


                                if (!$scope.models.lists[i]) {
                                    $scope.models.lists[i] = [{ "key": data[i].id, "sectionID": data[i].sectionId }]
                                    $scope.len = data.length


                                }

                            }
                        }
                        run++

                    }
                }
                globalSet = $scope.models.lists
                CreateSurveyService.variableSelected = $scope.models.restoreList;
                localStorage.setItem('section', angular.toJson(globalSet))
                ArrangeSurveyService.selectQuestions = $scope.models.lists;

            }
            $scope.dragoverCallback = function (index, external, type, callback) {
                $scope.logListEvent('dragged over', index, external, type);
                // Invoke callback to origin for container types.
                if (type == 'container' && !external) {
                    //console.log('Container being dragged contains ' + callback() + ' items');
                }
                return index < 10; // Disallow dropping in the third row.
            };

            $scope.dropCallback = function (index, item, external, type) {
                $scope.logListEvent('dropped at', index, external, type);
                // Return false here to cancel drop. Return true if you insert the item yourself.
                return item;
            };

            $scope.logEvent = function (message) {
                //console.log(message);
            };

            $scope.logListEvent = function (action, index, external, type) {
                var message = external ? 'External ' : '';
                message += type + ' element was ' + action + ' position ' + index;
            };

            $scope.save = function () {

            }

            Array.prototype.insert = function (index, item) {
                this.splice(index, 0, item);
            };


            $scope.$on('my-sorted', function (ev, val) {
                //console.log(val.from + " " + val.to)
                var temp = [];
                $scope.myObj = $scope.models.lists;
                $scope.model3 = []
                for (var i in $scope.myObj) {
                    if ($scope.myObj.hasOwnProperty(i)) {
                        $scope.model3.push($scope.myObj[i]);
                    }
                }

                temp = $scope.model3.splice(parseInt(val.from), 1);
                $scope.model3.insert(parseInt(val.to), temp[0]);
                for (var i = 0; i < $scope.model3.length; i++) {
                    $scope.myObj[i] = $scope.model3[i];
                }
                // $scope.models.lists.splice(val.to, 0,val.name);

            })

            $scope.$on('my-created', function (ev, val) {


            })


            $scope.addSection = function (data) {
                ArrangeSurveyService.addSection(data).then(function (result) {
                    var serverData = result.data;

                    if (serverData.success) {
                        if (serverData) {
                            getAllSections();

                        }
                    }
                }, function (err) {
                    //some error
                    //console.log("Error: ", err);
                    $("#preloader").css("display", "none");
                })

            }


            $(function () {
                $(".sortable_list").sortable({
                    connectWith: ".connectedSortable",

                    drop: function (event, ui) {
                        $(this).droppable('destroy');
                    }

                }).disableSelection();

            });

            $(".sortable_list").sortable({
                cancel: ".fixed"
            });

            // Initialize model



        }],
}

_myDraggable.$inject = [];
_nameFilter.$inject = [];
module.exports = { myDraggable: _myDraggable, nameFilter: _nameFilter, editArrangeSurveyComponent: _editArrangeSurveyComponent };


