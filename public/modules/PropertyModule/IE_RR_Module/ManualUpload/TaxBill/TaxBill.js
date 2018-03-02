'use strict';

_taxBill.$inject = ["$stateParams", "$anchorScroll", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _taxBill;

//angular.module('AOTC').controller('taxBill', _taxBill);
function _taxBill($stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    //////console.log("taxBill controller", $stateParams);

    var vm = this;

    vm.formData = {};
    vm.property = {};
    vm.propertyId = localStorage.getItem('propertyId')

    if ($stateParams.property) {
        localStorage.setItem('SelectedProperty', angular.toJson($stateParams.property));
        vm.property = $stateParams.property;
    } else {
        vm.property = JSON.parse(localStorage.getItem('propertyDetails'));
    }
    vm.resetForm = resetForm;
    vm.submitAccData = submitAccData;

    function submitAccData() {
        $("#preloader").css("display", "block");

        var url = '/properties/updateTaxAccNo';

        vm.formData.propId = vm.propertyId;

        // ////console.log(vm.formData);
        AOTCService.postDataToServer(url, vm.formData)
            .then(function (result) {
                ////console.log("updateTaxAccNo: ", result);

                if (result.data.success) {
                    $scope.accForm.$setPristine();
                    $scope.accForm.$setUntouched();
                    $('#successModal').modal('toggle');
                } else {
                    $scope.$emit('error', result.data.message);
                }
                $("#preloader").css("display", "none");

            }, function (result) {
                $("#preloader").css("display", "none");
            }
        );
    }

    vm.gotoupdateProperty = gotoupdateProperty;
    vm.modalYesbutton = modalYesbutton;

    function gotoupdateProperty() {
        $('#successModal').modal('hide');
        $state.go('updateIERR');
    }

    function modalYesbutton() {
        vm.formData = {};

        $scope.accForm.$setPristine();
        $scope.accForm.$setUntouched();

        $('#successModal').modal('toggle');
    }

    function resetForm() {
        vm.formData = {};
        $scope.accForm.$setPristine();
        $scope.accForm.$setUntouched();
    }
}
