

//angular
//    .module('AOTC')
//    .filter('nameFilter',_nameFilter )
//    .directive('myDraggable', _myDraggable)
//    .component('arrangeSurveyComponent',_arrangeSurveyComponent);
function _nameFilter() {

    return function (objects) {
        var filterResult = new Array();
        var count = 0;
        var myArray = [];
        for (var obj in objects) {
            objects[obj].id = count;
            count++;
            myArray.push(objects[obj]);
        }



        return myArray;
    }
};
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

};

var _arrangeSurveyComponent = {
    templateUrl: 'modules/SurveyModule/Wizards/ArrangeSurvey/ArrangeSurvey.html',
    controllerAs: 'ArrangeSurveyCtrl',
    controller:
        ["$scope", "sharedService", "ArrangeSurveyService", "CreateSurveyService", "$state",
            function ($scope, sharedService, ArrangeSurveyService, CreateSurveyService, $state) {
                var vm = this;
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
                    console.log('aaaaaaaaaaaa')
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
                //     console.log($scope.sectionName);
                // };


                $scope.enableListFunction = function () {

                    console.log($scope.enableList)
                    if ($scope.enableList == true) {
                        $scope.enableList = false;
                    }
                    else {
                        $scope.enableList = true;
                    }


                }



                $scope.example1model = [];
                $scope.removed = [{}]
                $scope.example1data = [{}];
                getAllSections();
                function getAllSections() {
                    ArrangeSurveyService.getAllSections().
                        then(function (result) {
                            var serverData = result.data;
                            if (serverData.success) {
                                if (serverData) {
                                    vm.sections = serverData.result;
                                    //startAgain();
                                    console.log(vm.sections);
                                    for (var i = 0; i < vm.sections.length; ++i) {

                                        $scope.example1data[i] = ({ id: vm.sections[i].section, label: vm.sections[i].section, sectionId: vm.sections[i].sectionId })
                                    }

                                }

                            }
                        }, function (err) {
                            //some error
                            console.log("Error: ", err);
                            $("#preloader").css("display", "none");
                        })
                }

                if (!CreateSurveyService.questions) {
                    if (!CreateSurveyService.questions[0].question) {

                        var i = 0;
                        CreateSurveyService.questions.splice(i, 1);
                    }
                }


                $scope.init = function () {

                    console.log(CreateSurveyService.questions)

                    if (CreateSurveyService.questions) {

                        vm.data = CreateSurveyService.questions;
                        $scope.models2.lists.B = CreateSurveyService.questions;
                        console.log("question")

                    }
                    else {

                        $scope.error = 'You have not yet selected any question';

                    }

                };



                $scope.gotoSectionSettings = function () {

                    $state.go('SectionSettings')

                }



                //Library Integartion

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

                // Generate initial model
                $scope.restoreList = {

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
                $scope.len = 0;
                var restoreLen = 0;

                ArrangeSurveyService.selectQuestions = $scope.models.lists;


                $scope.onItemSelect = function (data, item) {

                    var startCount = 0;



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
                                    console.log(extractKey + data[k].id)
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
                                    console.log(deleteKey + extractKey)
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
                                    console.log('in-------')


                                    if (!$scope.models.lists[i]) {
                                        $scope.models.lists[i] = [{ "key": data[i].id, "sectionID": data[i].sectionId }]
                                        $scope.len = data.length


                                    }

                                }
                            }
                            run++

                        }
                    }
                    ArrangeSurveyService.selectQuestions = $scope.models.lists;
                }
                $scope.dragoverCallback = function (index, external, type, callback) {
                    $scope.logListEvent('dragged over', index, external, type);
                    // Invoke callback to origin for container types.
                    if (type == 'container' && !external) {
                        console.log('Container being dragged contains ' + callback() + ' items');
                    }
                    return index < 10; // Disallow dropping in the third row.
                };


                $scope.dropCallback = function (index, item, external, type) {
                    $scope.logListEvent('dropped at', index, external, type);
                    // Return false here to cancel drop. Return true if you insert the item yourself.
                    return item;
                };

                $scope.logEvent = function (message) {
                    console.log(message);
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
                    console.log(val.from + " " + val.to)
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
                    console.log('sss')
                    ArrangeSurveyService.addSection(data).then(function (result) {
                        var serverData = result.data;
                        console.log(serverData)
                        if (serverData.success) {
                            if (serverData) {
                                console.log('sss')
                                getAllSections();

                            }
                        }
                    }, function (err) {
                        //some error
                        console.log("Error: ", err);
                        $("#preloader").css("display", "none");
                    })

                }


                // $(function() {
                //     $( ".sortable_list" ).sortable({
                //         connectWith: ".connectedSortable",
                //
                //         drop: function (event, ui) {
                //             $(this).droppable('destroy');
                //         }
                //
                //     }).disableSelection();
                //
                // });
                //
                // $(".sortable_list").sortable({
                //     cancel: ".fixed"
                // });

                // Initialize model



            }],

};

module.exports = { nameFilter: _nameFilter, myDraggable: _myDraggable, arrangeSurveyComponent: _arrangeSurveyComponent };