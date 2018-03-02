'use strict';

_viewIERR.$inject = ["$stateParams", "$anchorScroll", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _viewIERR;

//angular.module('AOTC').controller('viewIERR', _viewIERR
//    );
function _viewIERR($stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    ////console.log("ViewIERR controller", $stateParams);
    var vm = this;

    vm.IERRProperty = {};

    // if ($stateParams.property) {
    //     localStorage.setItem('viewIERRProperty', angular.toJson($stateParams.property));
    //     vm.IERRProperty = $stateParams.property;


    // } else {

    //     vm.IERRProperty = JSON.parse(localStorage.getItem('viewIERRProperty'));

    // }
    //publicProperty
    vm.IERRProperty = JSON.parse(localStorage.getItem('propertyDetails'));
    vm.propertyId = JSON.parse(localStorage.getItem('propertyId'));
    var userRole = localStorage.getItem('role');

    if (userRole === "Assessing Authority") {
        vm.hideTabs = false;
    } else {
        vm.hideTabs = true;
    }

    ////console.log(vm.IERRProperty);

    // vm.propertyId = $stateParams.property.prop._id;

    vm.isActive = isActive
    vm.showRentRole = showRentRole;
    vm.showIncomeExpense = showIncomeExpense;
    vm.showOtherFiles = showOtherFiles;
    vm.showTaxBills = showTaxBills;
    vm.showPublicProperty = showPublicProperty;
    
    

    function isActive(viewLocation) {
        // ////console.log("viewLocation",viewLocation);
        return viewLocation === $location.path();
    }


    if ($stateParams.success) {
        $("div.success").fadeIn(1500).delay(500).fadeOut(1500, function () { });

    }
    vm.showPropertyDetails = showPropertyDetails;

    function showPropertyDetails() {
        // $window.location.href = '#/detail/analytics';    
        // $state.go('viewIERR.property_details');
        $state.go('viewIERR.propertyDetailsTab');
        // $window.location.reload();

        // ////console.log('showAnalytics clickd in homejs');
    }

    function showIncomeExpense() {
        // $window.location.href = '#/detail/analytics';    
        $state.go('viewIERR.income_expense');
        // $window.location.reload();

        // ////console.log('showAnalytics clickd in homejs');
    }
    function showPublicProperty() {
        // $window.location.href = '#/detail/analytics';    
        $state.go('viewIERR.public_property_tab');
        // $window.location.reload();

        // ////console.log('showAnalytics clickd in homejs');
    }

    function showRentRole() {
        // $window.location.href = '#/home/posts';    
        // $state.go('detail.logs');
        $state.go('viewIERR.rent_role');

        // $window.location.href = '#/detail/logs';    
        // ////console.log('showLogs clickd in homejs');
    }

    function showOtherFiles() {
        $state.go('viewIERR.other_files');
    }

    function showTaxBills() {
        ////console.log("showTaxBills Called");
        $state.go('viewIERR.tax_bills');
    }
}
