'use strict';

_BrowserOptimizing.$inject = ["BrowserOptimizingService", "deviceDetector", "$scope", "$state"];
module.exports = _BrowserOptimizing;

//angular.module('AOTC')
//    .controller('BrowserOptimizing', _BrowserOptimizing);

function _BrowserOptimizing(BrowserOptimizingService, deviceDetector, $scope, $state) {
    ////console.log("BrowserOptimizing controller");

    var vm = this;

    vm.continueToLogin = continueToLogin;

    var browserNotification = localStorage.getItem('browserNotification');

    function continueToLogin() {
        localStorage.setItem('browserNotification', true);
        $state.go('login');
    }
}
