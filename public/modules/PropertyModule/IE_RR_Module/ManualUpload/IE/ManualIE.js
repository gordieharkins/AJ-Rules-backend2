'use strict';

_manualIE.$inject = ["$stateParams", "$anchorScroll", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _manualIE;

//angular.module('AOTC').controller('manualIE', _manualIE
//    );
function _manualIE($stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    ////////console.log("updateIERR controller", $stateParams);
    var vm = this;
    // $('#successModal').modal('close');

    vm.submitManualData = submitManualData;
    vm.property = JSON.parse(localStorage.getItem('propertyDetails'));
    ////////console.log("vm.property in manualIE: ", vm.property)

    vm.formData = {

    };

    vm.modalYesbutton = modalYesbutton;
    vm.gotoPropertyDetails = gotoPropertyDetails;
    vm.resetForm = resetForm;

    vm.datePickers = {
        asOfDate: false,
        reportCreationDate: false

    };
    vm.openDatePicker = function (_name) {
        vm.datePickers[_name] = true;
    };

    vm.dateFormat = 'MM/dd/yyyy';

    var initModal = function () {
        $("#myModal").modal('show');
    }();

    function resetForm() {
        vm.formData = {};
        $scope.manualForm.$setPristine();
        $scope.manualForm.$setUntouched();

    }

    function gotoPropertyDetails() {
        //$('#successModal').modal('hide');
        $state.go('updateIERR');
    }

    function modalYesbutton() {
        //////console.log('reset form');
        vm.formData = {};

        $scope.manualForm.$setPristine();
        $scope.manualForm.$setUntouched();

        //$('#successModal').modal('toggle');

    }


    function submitManualData() {
        var url = '/incomeExpenses/addPropertyIEManual';
        $("#preloader").css("display", "block");

        vm.formData.propId = localStorage.getItem("propertyId");
        vm.formData.baseRent = vm.formData.baseRent.toString();
        vm.formData.cashFlowNetIncome = vm.formData.cashFlowNetIncome.toString();
        vm.formData.miscellaneousIncome = vm.formData.miscellaneousIncome.toString();
        vm.formData.parkingIncome = vm.formData.parkingIncome.toString();
        vm.formData.realEstateTaxes = vm.formData.realEstateTaxes.toString();
        vm.formData.rentalIncome = vm.formData.rentalIncome.toString();
        vm.formData.totalAdministrative = vm.formData.totalAdministrative.toString();
        vm.formData.totalContractedServices = vm.formData.totalContractedServices.toString();
        vm.formData.totalExpenses = vm.formData.totalExpenses.toString();
        vm.formData.totalIncome = vm.formData.totalIncome.toString();
        vm.formData.totalMaintenance = vm.formData.totalMaintenance.toString();
        vm.formData.totalOperatingExpRecoverable = vm.formData.totalOperatingExpRecoverable.toString();
        vm.formData.totalOperatingExpUnRecoverable = vm.formData.totalOperatingExpUnRecoverable.toString();
        vm.formData.totalPersonnel = vm.formData.totalPersonnel.toString();
        vm.formData.totalTaxesAndInsurance = vm.formData.totalTaxesAndInsurance.toString();
        vm.formData.totalUtilities = vm.formData.totalUtilities.toString();

        //////console.log(vm.formData);

        AOTCService.postDataToServer(url, vm.formData)
            .then(function (result) {
                //////console.log("addPropertyIEManual: ", result);
                if (result.data.success) {
                    $scope.$emit('success', result.data.message);
                    $scope.manualForm.$setPristine();
                    $scope.manualForm.$setUntouched();
                    //$state.go('updateIERR');
                    //$('#successModal').modal('toggle'); // Success Model
                     $state.go('PropertyList.private_property_list');
                } else {
                    $scope.$emit('danger', result.data.message);
                }
                $("#preloader").css("display", "none");

            }, function (result) {
                ////////console.log(result);
                $("#preloader").css("display", "none");
            });




        //call to server
        //
    }

    // setTimeout(function() {
    //     vm.formData.baseRent = 2017;
    //     $scope.$apply();
    //     $('#successModal').modal('show');

    // }, 100);











    ///=================================date picker===========================//


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