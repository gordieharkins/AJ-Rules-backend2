'use strict';

_rent_role.$inject = ["$scope", "AOTCService", "UtilService", "$timeout"];
module.exports = _rent_role;

//angular.module('AOTC').controller('rent_role', _rent_role
//    );

function _rent_role($scope, AOTCService, UtilService, $timeout) {
    ////console.log("rent_role controller");
    var vm = this;
    // Variables Declaration
    vm.propertiesCount = localStorage.getItem('propertiesCount');
    vm.IERRProperty = JSON.parse(localStorage.getItem('propertyDetails'));
    vm.propertyId = JSON.parse(localStorage.getItem('propertyId'));
    // vm.selectedOtherFileToUnlink = {};       // To be made functional.
    // vm.selectedOtherFileToDelete = {};       // To be made functional.
    vm.modelMessage = {
        title: "",
        message: ""
    }

    // Functions Declaration
    vm.toggleActiveClass = toggleActiveClass;
    vm.unlinkRentRoll = unlinkRentRoll;
    vm.deleteRentRoll = deleteRentRoll;
    vm.myModelCheck = myModelCheck;
    vm.rentRollsIds = [];


    vm.numberFormatter = numberFormatter;
    vm.keyValMakerForGrid = keyValMakerForGrid;
    vm.keyValMaker = keyValMaker;

    // eg 29/08/2004 gets converted to 20040829
    function monthToComparableNumber(date) {
        if (date === undefined || date === null || date.length < 5) {
            return null;
        }
        var splitDate = date.split('/');
        if (splitDate.length != 3) {
            return null
        }

        // var result = (yearNumber * 10000) + (monthNumber * 100) + dayNumber;
        return splitDate;
    }

    function dateComparator(date1, date2) {
        var date1Number = monthToComparableNumber(date1[1]);
        var date2Number = monthToComparableNumber(date2[1]);

        if (date1Number === null && date2Number === null) {
            return 0;
        }
        if (date1Number === null) {
            return -1;
        }
        if (date2Number === null) {
            return 1;
        }

        var y1 = date1Number[2];
        var m1 = date1Number[0];
        var d1 = date1Number[1];

        var y2 = date2Number[2];
        var m2 = date2Number[0];
        var d2 = date2Number[1];

        var result = 0;
        if (y1 != y2) {
            result = y1 - y2;
        } else if (y1 == y2) {
            if (m1 != m2) {
                result = m1 - m2;
            } else if (m1 == m2) {
                result = d1 - d2;
            }
        }
        return result;
    }

    getPropertyRR();

    function getPropertyRR() {
        var url = '/rentRolls/getPropertyRR';
        //var url = '/properties/getPropertyRR?id=36';
        // ////console.log(url);
        var _data = {"propId": vm.propertyId};
        $("#preloader").css("display", "block");

        AOTCService.postDataToServer(url, _data)
            .then(function (result) {
                ////console.log("getPropertyRR Server result: ", result);
                var serverData = result.data;
                if (serverData.success) {
                    vm.tableData = serverData.result;
                    // ////console.log(vm.tableData);
                    //without timeout ng-grid donot render as DOM is rendered after some time
                    $timeout(function () {

                        for (var i = 0; i < vm.tableData.length; i++) {

                            var prop = vm.tableData[i];
                            //find best object
                            var tenant = keyValMakerForGrid(prop.tenants[0]);
                            var columnDefs = [];

                            for (var k = 0; k < tenant.length; k++) {
                                var obj = tenant[k];
                                var key = Object.keys(obj)[0];
                                // ////console.log('------keys--------', key);
                                var objValueArray = obj[key];
                                // ////console.log('------Field value is--------', objValueArray);

                                // ////console.log(objValueArray);
                                var myColumns = {
                                    headerName: obj[key][0],
                                    comparator: '',
                                    field: key,
                                    cellRenderer: '',
                                    suppressSorting: false
                                };
                                if (objValueArray[0] == "Start Date" || objValueArray[0] == "End Date") {
                                    myColumns.comparator = dateComparator;
                                    myColumns.cellRenderer = function (params) {
                                        if (params.value[1] == null) {
                                            params.value[1] = '';
                                        }
                                        return '<span class="pull-right">' + params.value[1] + '</span>';
                                    }

                                } else if (objValueArray[0] == "Tenant") {
                                    myColumns.cellRenderer = function (params) {
                                        var value = numberFormatter(params.value);
                                        if (value == null) {
                                            value = '';
                                        }
                                        return '<span class="pull-left">' + value + '</span>';
                                    }
                                } else {
                                    myColumns.suppressSorting = true;
                                    myColumns.cellRenderer = function (params) {
                                        var value = numberFormatter(params.value);
                                        if (value == null) {
                                            value = '';
                                        }
                                        return '<span class="pull-right">' + value + '</span>';
                                    };

                                }
                                columnDefs.push(myColumns);
                            }

                            if (prop.tenants.length > 0) {
                                var id = '#myGrid' + i;
                                var gridDiv = document.querySelector(id);
                                var gridOptions = {
                                    enableSorting: true,
                                    // pagination: true,
                                    // paginationAutoPageSize: true,
                                    columnDefs: columnDefs,
                                    rowData: prop.tenants,
                                    onGridReady: function (params) {
                                        // params.api.sizeColumnsToFit();
                                    },
                                    enableColResize: true
                                };
                                new agGrid.Grid(gridDiv, gridOptions);
                                // autoSizeAll(gridOptions, columnDefs);
                            }

                            //accordian controlling
                            prop.id = prop.RR._id;

                            if (i == 0) {
                                prop.isActive = true;
                                prop.activeClass = 'glyphicon-minus'
                            } else {
                                prop.isActive = false;
                                prop.activeClass = 'glyphicon-plus'
                            }

                            setTimeout(function () {
                                $('[data-tooltip="tooltip"]').tooltip();
                            }, 100);
                        }
                        $("#preloader").css("display", "none");

                    }, 500);

                }
            }, function (result) {
                //some error
                ////console.log(result);
                $("#preloader").css("display", "none");

            });
    }

    function autoSizeAll(gridOptions, columnDefs) {
        ////console.log('grid options', gridOptions);
        ////console.log('columnDefs', columnDefs);
        var allColumnIds = [];
        columnDefs.forEach(function (columnDef) {
            allColumnIds.push(columnDef.field);
        });
        gridOptions.columnApi.autoSizeColumns(allColumnIds);
    }

    function unlinkRentRoll(rentRolls) {
        vm.modelMessage.title = 'Unlink RentRoll: ' + rentRolls.RR.properties.fileName;
        vm.modelMessage.message = 'Are you sure to unlink RentRoll from this property?';
        vm.selection = 1;
        vm.rentRollsIds.push(rentRolls.RR._id);
    }

    function deleteRentRoll(rentRolls) {
        vm.modelMessage.title = 'Delete RentRoll: ' + rentRolls.RR.properties.fileName;
        vm.modelMessage.message = 'Are you sure to delete RentRoll from this property?';
        vm.selection = 0;
        vm.rentRollsIds.push(rentRolls.RR._id);
    }

    function myModelCheck() {
        if (vm.selection === 1) {

            unlinkRentRolls();
        } else if (vm.selection === 0) {

            deleteRentRolls();
        }
        vm.selection = -1;
    }

    function unlinkRentRolls() {
        var url = '/rentRolls/unlinkRentRollsById';

        $("#preloader").css("display", "block");

        vm.data = {
            propId:parseInt(localStorage.getItem('propertyId')),
            rentRollsIds: vm.rentRollsIds
        };

        AOTCService.postDataToServer(url, vm.data).then(function (result) {
            /////console.log(result);

            if (result.data.success) {
                $scope.$emit('success', result.data.message);
                getPropertyRR();
            } else {
                $scope.$emit('error', result.data.message);
            }
            vm.rentRolls = [];

            $("#preloader").css("display", "none");
        }, function (result) {
            $("#preloader").css("display", "none");
            $scope.$emit('error', result.data.message);
        });
    }

    // Delete taxBill call
    function deleteRentRolls() {

        var url = '/rentRolls/deleteRentRollsById';

        $("#preloader").css("display", "block");

        vm.data = {
            rentRollsIds: vm.rentRollsIds
        };

        AOTCService.postDataToServer(url, vm.data).then(function (result) {
            ////console.log(result);

            if (result.data.success) {
                $scope.$emit('success', result.data.message);
                getPropertyRR();
            } else {
                $scope.$emit('error', result.data.message);
            }
            vm.rentRolls = [];

            $("#preloader").css("display", "none");
        }, function (result) {
            $("#preloader").css("display", "none");
            $scope.$emit('error', result.data.message);
        });
    }

    function numberFormatter(keyArr) {
        var result = UtilService.numberFormatter(keyArr);
        return result;
    };

    function keyValMakerForGrid(object) {
        var result;
        result = UtilService.keyValMakerForGrid(object);
        return result;
    };

    function keyValMaker(object) {
        var result;
        result = UtilService.keyValMaker(object);
        return result;
    };

    function toggleActiveClass(property) {

        if (property.activeClass == "glyphicon-plus") {
            property.activeClass = "glyphicon-minus";
        } else {
            property.activeClass = "glyphicon-plus";
        }

        for (var i = 0; i < vm.tableData.length; i++) {
            var pr = vm.tableData[i];
            if (pr.id != property.id) {
                pr.activeClass = "glyphicon-plus";
            }
        }
    }
}
