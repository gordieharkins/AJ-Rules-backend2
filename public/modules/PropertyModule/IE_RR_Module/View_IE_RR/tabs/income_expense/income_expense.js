'use strict';


_income_expense.$inject = ["$stateParams","$location", "$scope", "$http", "__env", "$log", "AOTCService","UtilService", "$timeout"];
module.exports = _income_expense;

//angular.module('AOTC').controller('income_expense', _income_expense
//    );
function _income_expense($stateParams, $location, $scope, $http, __env, $log, AOTCService, UtilService, $timeout) {
    //////console.log("income_expense  controller", $stateParams);

    var vm = this;
    // $scope.user = {
    //     name: 'awesome user'
    // };

    vm.numberFormatter = function (val) {
        var result = UtilService.numberFormatter(val);
        return result
    };

    vm.keyValMaker = function (object) {
        var result;
        result = UtilService.keyValMaker(object);
        return result;
    };

    vm.reducedData = function (object) {
        var result;
        result = UtilService.reducedData(object);
        return result;
    };

    // vm.IERRProperty = JSON.parse(localStorage.getItem('viewIERRProperty'));
    vm.propertiesCount = localStorage.getItem('propertiesCount');
    vm.IERRProperty = JSON.parse(localStorage.getItem('propertyDetails'));
    vm.propertyId = JSON.parse(localStorage.getItem('propertyId'));

    setTimeout(function () {
        $('#paragraphs').cascadingDivs();

    }, 200);


    // //////console.log(vm.IERRProperty)

    vm.toggleActiveClass = toggleActiveClass;

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

    getPropertyIE();
    getPropertyDataReduction();

    vm.hideYardiTable = false;


    function getPropertyIE() {
        var url = '/incomeExpenses/getPropertyIE';
        //var url = '/properties/getPropertyIE?id=36';
        //////console.log(url)
        var _data = {"propId": vm.propertyId};
        $("#preloader").css("display", "block");

        AOTCService.postDataToServer(url, _data)
            .then(function (result) {
                var serverData = result.data;
                //////console.log('getPropertyIE server data', result);

                if (serverData.success) {

                    vm.tableData = serverData.result;
                    //////console.log(vm.tableData)

                    if (vm.tableData.length == 0) {
                        vm.hideYardiTable = true;

                    }


                    for (var i = 0; i < vm.tableData.length; i++) {
                        var prop = vm.tableData[i];

                        prop.id = prop.IE._id;
                        if (i == 0) {
                            prop.isActive = true;
                            prop.activeClass = 'glyphicon-minus'
                        } else {
                            prop.isActive = false;
                            prop.activeClass = 'glyphicon-plus'
                        }

                    }
                    $("#preloader").css("display", "none");
                }

                // id: 'collapseOne',
                //     acc_heading: 'first record',
                //     isActive: true,
                //     activeClass: 'glyphicon-minus'



            }, function (result) {
                //some error
                //////console.log(result);
                $("#preloader").css("display", "none");

            });
    }
    vm.mriShow = true;
    vm.yardiShow = true;

    function getPropertyDataReduction() {
        vm.mriShow = true;
        vm.yardiShow = true;

        var url = '/incomeExpenses/dataReductionIE';
        //var url = '/properties/getPropertyIE?id=36';
        // //////console.log(url)
        $("#preloader").css("display", "block");
        var metaData = {
            propId: vm.propertyId,
            year: 2017
        };

        AOTCService.postDataToServer(url, metaData)
            .then(function (result) {
                //////console.log('dataReductionIE server data:', result);
                if (result.data.success) {
                    var serverData = result.data;
                    vm.yardiIEData = serverData.result.yardiIEData;
                    vm.yardiIEYear = vm.yardiIEData[vm.yardiIEData.length - 1];
                    vm.mriIEData = serverData.result.mriIEData;
                    vm.mriIEYear = vm.mriIEData[vm.mriIEData.length - 1];

                    if (vm.mriIEData.length == 0) {
                        vm.mriShow = false;
                    } else if (vm.yardiIEData.length == 0) {
                        vm.yardiShow = false;
                    }
                }



            }, function (result) {
                //////console.log(result);
            });
    }

    vm.unlinkIncomeExpense = unlinkIncomeExpense;
    vm.deleteIncomeExpense = deleteIncomeExpense;
    vm.myModelCheck = myModelCheck;
    vm.modelMessage = {
        title: "",
        message: ""
    };

    vm.incomeExpenseIds = [];
    vm.selection = -1;


    function unlinkIncomeExpense(incomeExpense) {
        vm.modelMessage.title = 'Unlink ' + incomeExpense.IE.properties.fileName;
        vm.modelMessage.message = 'Are you sure to unlink file from this property?';
        vm.selection = 1;
        vm.incomeExpenseIds.push(incomeExpense.IE._id);
    }

    function deleteIncomeExpense(incomeExpense) {
        //////console.log("here it is")

        vm.modelMessage.title = 'Delete ' + incomeExpense.IE.properties.fileName;
        vm.modelMessage.message = 'Are you sure to delete file from this property?';
        vm.selection = 0;
        vm.incomeExpenseIds.push(incomeExpense.IE._id);
    }

    function myModelCheck() {
        if (vm.selection === 1) {

            unlinkIncomeExpenses();
        } else if (vm.selection === 0) {

            deleteIncomeExpenses();
        }
        vm.selection = -1;
    }


    // Unlink taxBill call
    function unlinkIncomeExpenses() {

        var url = '/incomeExpenses/unlinkIEFiles';

        $("#preloader").css("display", "block");

        vm.data = {
            propId:parseInt(localStorage.getItem('propertyId')),
            incomeExpenseIds: vm.incomeExpenseIds
        };

        AOTCService.postDataToServer(url, vm.data).then(function (result) {
            //////console.log(result);

            if (result.data.success) {
                $scope.$emit('success', result.data.message);
                getPropertyIE();
                getPropertyDataReduction();
            } else {
                $scope.$emit('error', result.data.message);
            }
            vm.incomeExpenseIds = [];

            $("#preloader").css("display", "none");
        }, function (result) {
            $("#preloader").css("display", "none");
            $scope.$emit('error', result.data.message);
        });
    }

    // Delete taxBill call
    function deleteIncomeExpenses() {

        var url = '/incomeExpenses/deleteIEById';

        $("#preloader").css("display", "block");

        vm.data = {
            incomeExpenseIds: vm.incomeExpenseIds
        };

        AOTCService.postDataToServer(url, vm.data).then(function (result) {
            //////console.log(result);

            if (result.data.success) {
                $scope.$emit('success', result.data.message);
                getPropertyIE();
            } else {
                $scope.$emit('error', result.data.message);
            }
            vm.incomeExpenseIds = [];

            $("#preloader").css("display", "none");
        }, function (result) {
            $("#preloader").css("display", "none");
            $scope.$emit('error', result.data.message);
        });
    }
}
