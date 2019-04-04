'use strict';

_manualRR.$inject = ["$rootScope", "$stateParams", "$anchorScroll", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _manualRR;


//angular.module('AOTC').controller('manualRR', _manualRR
//    );

function _manualRR($rootScope, $stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    ////////console.log("manualRR Controller");

    var vm = this;
    // $('#myModalquestion').modal('toggle');

    vm.property = {};
    vm.tenants = [];

    vm.formData = {};

    $(document).on('focus', ".datepicker_recurring_start", function () {
        $(this).datepicker();
    });

    if ($stateParams.property) {
        localStorage.setItem('SelectedProperty', angular.toJson($stateParams.property));
        vm.property = $stateParams.property;
    } else {
        vm.property = JSON.parse(localStorage.getItem('propertyDetails'));
    }
    // //////console.log("vm.property in RRmanual: ", vm.property);

    vm.addNewTenant = addNewTenant;
    vm.removeTenant = removeTenant;
    vm.allSelected = 0;
    vm.selectAll = selectAll;
    vm.submitRRForm = submitRRForm;
    vm.resetForm = resetForm;
    vm.gotoPropertyDetails = gotoPropertyDetails;
    vm.toggleSelection = toggleSelection;
    vm.dateFormat = 'MM/dd/yyyy';


    // $timeout(function() {
    // $('#successModal').modal('toggle');

    // }, 500);

    function gotoPropertyDetails() {
        $('#successModal').modal('toggle');

        $timeout(function () {
            $state.go('updateIERR');
        }, 500);
    }

    function attachValidTenants() {
        var validTenants = [];
        for (var i = 0; i < vm.tenants.length; i++) {
            var validObj = false;
            var obj = vm.tenants[i];
            for (var key in obj) {
                if (obj[key] && obj[key].toString().indexOf("object:") < 0) {
                    validObj = true;
                    obj[key] = obj[key].toString();
                }
            }
            if (validObj) {
                validTenants.push(obj);
            }
        }

        return validTenants;
    }

    function submitRRForm() {
        var url = '/rentRolls/addPropertyRRManual';
        $("#preloader").css("display", "block");

        vm.formData.propId = localStorage.getItem("propertyId");
        vm.formData.baseRent = vm.formData.baseRent.toString();
        vm.formData.totalGrossRentMonthly = vm.formData.totalGrossRentMonthly.toString();
        vm.formData.totalGrossRentPerSquareFeetPerYear = vm.formData.totalGrossRentPerSquareFeetPerYear.toString();
        vm.formData.totalSF = vm.formData.totalSF.toString();
        vm.formData.vacantPercentage = vm.formData.vacantPercentage.toString();
        vm.formData.vacantSF = vm.formData.vacantSF.toString();

        vm.formData.tenants = attachValidTenants();

        //////console.log('submitted form : func=> submitRRForm', url);
        //////console.log(vm.formData)

        AOTCService.postDataToServer(url, vm.formData).then(function (result) {
            //////console.log('Server Data  :');
            //////console.log(result);

            $scope.rentRollForm.$setPristine();
            $scope.rentRollForm.$setUntouched();

            $scope.tenantForm.$setPristine();
            $scope.tenantForm.$setUntouched();

            if (result.data.success) {
                $scope.$emit('success', result.data.message);
                $('#successModal').modal('toggle');
            } else {
                $scope.$emit('danger', result.data.message);

            }

            $("#preloader").css("display", "none");

        }, function (result) {

            $("#preloader").css("display", "none");
        });
    }

    function selectAll() {

        vm.allSelected = +!vm.allSelected;
        for (var i = 0; i < vm.tenants.length; i++) {
            var tenant = vm.tenants[i];
            if (vm.allSelected == 0) {
                tenant.selected = 0;
            } else {
                tenant.selected = 1;
            }
        }
        // vm.showRemoveButton =  vm.allSelected;
        checkTenantSelection();
    }

    function toggleSelection(tenant) {
        tenant.selected = +!tenant.selected;
        checkTenantSelection();
    }
    vm.showRemoveButton = false;

    function checkTenantSelection() {
        var active = false;
        for (var i = 0; i < vm.tenants.length; i++) {
            var tenant = vm.tenants[i];
            if (tenant.selected) {
                active = true;
            }
        }
        vm.showRemoveButton = active;


        var allActive = true;
        for (var i = 0; i < vm.tenants.length; i++) {
            var tenant = vm.tenants[i];
            if (!tenant.selected) {
                allActive = false;
            }
        }
        //if no one is active then un-select all
        vm.allSelected = allActive;
    }

    // $timeout(function() {
    //     addNewTenant();

    // }, 500);



    function addNewTenant() {

        vm.tenants.push({
            selected: 0,
            unit: '',
            tenant: '',
            squareFeet: '',
            startDate: '',
            endDate: '',
            baseRentMonthly: '',
            baseRentAnnualized: '',
            baseRentPerSquareFeetPerYear: '',
            baseRentPercentRentBump: '',
            rolling12Months: '',
            rollingPerSquareFeetPerYear: '',
            grossRentMonthly: '',
            grossRentPerSquareFeetPerYear: ''
        });

        $scope.tenantForm.$setPristine();
        $scope.tenantForm.$setUntouched();
    }


    function resetForm() {
        vm.formData = {};
        vm.tenants = [];
        vm.showRemoveButton = false;

        $scope.rentRollForm.$setPristine();
        $scope.rentRollForm.$setUntouched();

        $scope.tenantForm.$setPristine();
        $scope.tenantForm.$setUntouched();

        $('#successModal').modal('hide');

    }

    function removeTenant() {
        var unSelectedTenants = [];
        for (var i = 0; i < vm.tenants.length; i++) {
            var tenant = vm.tenants[i];
            if (tenant.selected == 0) {
                unSelectedTenants.push(tenant);
            }
        }

        vm.tenants = unSelectedTenants;
        if (vm.tenants.length == 0) {
            vm.allSelected = 0;
            vm.showRemoveButton = false;
        }
    }

    vm.datePickers = {
        asOfDate: false,
        reportCreationDate: false

    };
    vm.openDatePicker = function(_name){
        vm.datePickers[_name] = true;
    };

    // $('#sandbox-container input').datepicker({
    //     autoclose: true
    // });

    // $('#sandbox-container input').on('show', function (e) {
    //     console.debug('show', e.date, $(this).data('stickyDate'));

    //     if (e.date) {
    //         $(this).data('stickyDate', e.date);
    //     } else {
    //         $(this).data('stickyDate', null);
    //     }
    // });

    // $('#sandbox-container input').on('hide', function (e) {
    //     console.debug('hide', e.date, $(this).data('stickyDate'));
    //     var stickyDate = $(this).data('stickyDate');

    //     if (!e.date && stickyDate) {
    //         console.debug('restore stickyDate', stickyDate);
    //         $(this).datepicker('setDate', stickyDate);
    //         $(this).data('stickyDate', null);
    //     }
    // });
}
