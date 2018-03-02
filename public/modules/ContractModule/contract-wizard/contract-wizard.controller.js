'use strict';

_ContractWizardCtrl.$inject = ["$scope", "$location", "$state"];
module.exports = {ContractWizardCtrl: _ContractWizardCtrl, mySortable: _mySortable, myDraggable: _myDraggable };

//angular.module('AOTC').controller('ContractWizardCtrl', _ContractWizardCtrl
//    )

//    .directive('mySortable', _mySortable
//    )

//    .directive('myDraggable', _myDraggable
//    );
function _ContractWizardCtrl($scope, $location, $state) {
    ////console.log("ContractWizardCtrl")

    $scope.options = 'Select Options'
    $scope.templateData = []

    $scope.models2 = {
        selected: null,
        lists: { "B": [] }
    };

    $scope.models = {
        selected: null,
        lists: []
    };


    $scope.addContract = function () {
        $scope.models.lists.unshift({
            "id": null, "editable": true, "name": "Section Name", "title": "Section Title", "label": "Section Label",
            "type": "Section Type", "text": "Section Data",
        })

        ////console.log($scope.models.lists);
    }

    $scope.selectOptions = function (index, data) {
        $scope.models.lists[index].type = data;
    };

    $scope.saveSingleContract = function (index, data) {
        var userid = localStorage.getItem('userId');
        data[index].editable = false;
        $scope.models.lists = data;
        $scope.saveAsTemplate(data);

    };

    $scope.editSingleContract = function (index, data) {
        var userid = localStorage.getItem('userId');
        data[index].editable = true;
        $scope.models.lists = data;
    };

    $scope.saveContract = function (data) {
        var userid = localStorage.getItem('userId');
        for (var i = 0; i < data.length; i++) {
            data[i].editable = false;
            ////console.log(data[i])
        }
        $scope.postContract = { id: null, userId: userid, contracts: data };
        $scope.models.lists = data;

        ////console.log("saving" + $scope.postContract);
    }

    $scope.editContract = function (data) {
        for (var i = 0; i < data.length; i++) {
            data[i].editable = true;
        }

    }

    $scope.saveAsTemplate = function (data) {
        ////console.log(data)
        for (var i = 0; i < $scope.templateData.length; i++) {
            if (!$scope.templateData[i]) {
                $scope.templateData[i] = data
            }
        }
        if ($scope.templateData.length == 0) {
            $scope.templateData = data
        }
    }


    $scope.index = 0;

    $scope.$on('my-sorted', function (ev, val) {
        $scope.models.lists.splice(val.to, 0, $scope.models.lists.splice(val.from, 1)[0]);
    })

    $scope.$on('my-created', function (ev, val) {
        ////console.log('draggable' + val.name)
        $scope.index = val.to
        $scope.models.lists.splice(val.to, 0, val.name);
        JSON.parse($scope.models.lists[val.to])

    })

}
function _myDraggable() {

    return {
        link: function (scope, el, attrs) {
            ////console.log('draggable')
            el.draggable({
                connectToSortable: attrs.myDraggable,
                helper: "clone",
                revert: "invalid"
            });
            el.disableSelection();
        }
    }

}
function _mySortable() {
    return {
        link: function (scope, el, attrs) {
            el.sortable({
                revert: true
            });
            el.disableSelection();
            ////console.log("p")

            el.on("sortdeactivate", function (event, ui) {
                var from = angular.element(ui.item).scope().$index;
                var to = el.children().index(ui.item);
                if (to >= 0) {
                    scope.$apply(function () {
                        if (from >= 0) {
                            scope.$emit('my-sorted', { from: from, to: to });
                        } else {
                            ////console.log("data---" + from)
                            scope.$emit('my-created', { to: to, "name": ui.item.text() });
                            ui.item.remove();
                        }
                    })
                }
            });
        }
    }
}
