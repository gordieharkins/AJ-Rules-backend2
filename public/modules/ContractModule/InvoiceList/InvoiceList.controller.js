'use strict';

_InvoiceList.$inject = ["$scope", "$stateParams", "$location", "$state", "SampleCalculationService"];
module.exports = _InvoiceList;

//angular.module('AOTC').controller('InvoiceList', _InvoiceList
//    );
function _InvoiceList($scope, $stateParams, $location, $state, SampleCalculationService) {
    ////console.log("InvoiceList", $stateParams.id)

    $scope.gotoAddNewInvoice = function () {
        $state.go('NewInvoice', { id: $stateParams.id });
    }


}