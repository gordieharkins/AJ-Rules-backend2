'use strict';
_TabsViewerCtrl.$inject = ["User_Config", "$stateParams", "$anchorScroll", "$state", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _TabsViewerCtrl;

//angular.module('AOTC').controller('TabsViewerCtrl', _TabsViewerCtrl
//    );
function _TabsViewerCtrl(User_Config, $stateParams, $anchorScroll, $state, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    ////////console.log("TabsViewerCtrl controller", $stateParams);
    var vm = this;


    vm.isActive = isActive;
    vm.showPubPropertylist = showPubPropertylist;
    vm.showPriPropertylist = showPriPropertylist;
    vm.hideTabs = false;
    $("#preloader").css("display", "block");

    localStorage.removeItem('selectedScenario');

    var user = JSON.parse(localStorage.getItem('userJson'));
    //////console.log(user.userData.role);

    // user.userData.role = User_Config.AJ_USER;

    if (user.userData.role == User_Config.AJ_USER) {
        vm.hideTabs = true;
        $state.go('PropertyList.private_property_list');
    }

    function isActive(viewLocation) {
        return viewLocation === $location.path();
    }


    if ($stateParams.success) {
        $("div.success").fadeIn(1500).delay(500).fadeOut(1500, function () {
        });

    }


    function showPriPropertylist() {
        // $window.location.href = '#/detail/analytics';    
        $state.go('PropertyList.private_property_list');
        // //////console.log('showAnalytics clickd in homejs');
    }

    function showPubPropertylist() {
        // $window.location.href = '#/detail/analytics';    
        $state.go('PropertyList.pub_property_list');
        // $window.location.reload();

        // //////console.log('showAnalytics clickd in homejs');
    }

}