'use strict';
angular.module('AOTC').controller('ContractWizardCtrl', function($scope, $location, $state, AOTCService) {
        //console.log("ContractWizardCtrl")
        var userid = localStorage.getItem('userId');
        $scope.options = 'Select Options'
        $scope.templateData = [];
        $scope.addContractFlag = false;
        var contractId = null;
        $scope.contractList = true;
        $scope.contracts = [];
        get();
        $scope.models2 = {
            selected: null,
            lists: { "B": [] }
        };

        $scope.models = {
            selected: null,
            lists: []
        };


        // Editor options.
        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false
        };

        // Called when the editor is completely ready.
        $scope.onReady = function() {
            // ...
        };


        $scope.addContract = function() {
            $scope.models.lists.unshift({
                "sectionId": null,
                "editable": true,
                "name": "Section Name",
                "title": "Section Title",
                "label": "Section Label",
                "type": "Section Type",
                "data": null,
            });
            $scope.addContractFlag = true;

            //console.log($scope.models.lists);
        }

        $scope.selectOptions = function(index, data) {
            $scope.models.lists[index].type = data;
        };

        $scope.saveSingleContract = function(index, data) {
            //console.log(data)
            var userid = localStorage.getItem('userId');
            data[index].editable = true;
            $scope.postContract = { contractId: contractId, userId: userid, sections: data };
            post($scope.postContract)
        };

        $scope.editSingleContract = function(index, data) {
            var userid = localStorage.getItem('userId');
            data[index].editable = true;
            $scope.models.lists = data;
        };

        $scope.saveContract = function(data) {
            for (var i = 0; i < data.length; i++) {
                data[i].editable = true
            }
            $scope.postContract = { contractId: contractId, userId: userid, sections: data };
            post($scope.postContract)
            //$scope.models.lists=data;

            //console.log("saving" + $scope.postContract);
        }

        $scope.editContract = function(data) {
            for (var i = 0; i < data.length; i++) {
                data[i].editable = true;
            }

        }

        $scope.saveAsTemplate = function(data) {
            //console.log(data)
            for (var i = 0; i < $scope.templateData.length; i++) {
                if (!$scope.templateData[i]) {
                    $scope.templateData[i] = data
                }
            }
            if ($scope.templateData.length == 0) {
                $scope.templateData = data
            }
        }

        $scope.addNewContract = function(data) {
            $scope.contractList = !($scope.contractList);
            $scope.models.lists = [];
            // //console.log(data)
            // for (var i = 0; i < $scope.templateData.length; i++) {
            //     if (!$scope.templateData[i]) {
            //         $scope.templateData[i] = data
            //     }
            // }
            // if ($scope.templateData.length == 0)
            // {
            //     $scope.templateData=data
            // }
        }



        $scope.index = 0;

        $scope.$on('my-sorted', function(ev, val) {
            $scope.models.lists.splice(val.to, 0, $scope.models.lists.splice(val.from, 1)[0]);
        })

        $scope.$on('my-created', function(ev, val) {
            //console.log('draggable' + val.name)

            $scope.index = val.to
            $scope.models.lists.push(val.to, 0, JSON.parse(val.name));


        })


        function post(data) {
            //console.log("posoting" + data)
            $("#preloader").css("display", "block");

            var url = 'contracts/addContracts';
            AOTCService.postDataToServer(url, data)
                .then(function(repsonse) {
                    //console.log("ContractWizard: ", repsonse);
                    if (repsonse.data.message) {
                        //console.log(repsonse.data.result.contractId)

                        contractId = repsonse.data.result.contractId;
                        $scope.models.lists = repsonse.data.result.sections;
                        for (var i = 0; i < $scope.models.lists.length; i++) {
                            $scope.models.lists[i].editable = false
                        }
                    } else {;
                    }
                    get();
                    $("#preloader").css("display", "none");

                }, function(result) {
                    ////console.log(result);
                    $("#preloader").css("display", "none");
                });

        }

        function get() {
            $("#preloader").css("display", "block");

            var url = 'contracts/getContracts';
            //console.log(url);
            AOTCService.getDataFromServer(url)
                .then(function(response) {
                    //console.log(response);
                    $scope.contracts = response.data.result;
                    //console.log($scope.contracts);
                    $("#preloader").css("display", "none");

                }, function(result) {
                    ////console.log(result);
                    $("#preloader").css("display", "none");
                });
        }



    })
    .directive('mySortable', function() {
        return {
            link: function(scope, el, attrs) {
                el.sortable({
                    revert: true
                });
                el.disableSelection();
                //console.log("p")

                el.on("sortdeactivate", function(event, ui) {
                    var from = angular.element(ui.item).scope().$index;
                    var to = el.children().index(ui.item);
                    if (to >= 0) {
                        scope.$apply(function() {
                            if (from >= 0) {
                                scope.$emit('my-sorted', { from: from, to: to });
                            } else {
                                //console.log("data---" + from)
                                scope.$emit('my-created', { to: to, "name": ui.item.text() });
                                ui.item.remove();
                            }
                        })
                    }
                });
            }
        }
    })

    .directive('myDraggable', function() {

        return {
            link: function(scope, el, attrs) {
                //console.log('draggable')
                el.draggable({
                    connectToSortable: attrs.myDraggable,
                    helper: "clone",
                    revert: "invalid"
                });
                el.disableSelection();
            }
        }

    })

;