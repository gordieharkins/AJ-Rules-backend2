'use strict';

_unlinkedProperties.$inject = ["$stateParams", "$anchorScroll","$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _unlinkedProperties;

//angular.module('AOTC').controller('unlinkedProperties', _unlinkedProperties
//);
function _unlinkedProperties($stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    //////console.log("unlinkedProperties controller", $stateParams);

    var vm = this;

    vm.isActive = isActive;
    vm.showUnlinkedFiles = showUnlinkedFiles;
    vm.showCorruptFiles = showCorruptFiles;
    vm.showUnparsedFiles = showUnparsedFiles;

    function showUnlinkedFiles() {
        $state.go('unlinkedProperties.unlinkedFiles')
    }
    function showCorruptFiles() {
        $state.go('unlinkedProperties.corruptFiles')
    }
    function showUnparsedFiles() {
        $state.go('unlinkedProperties.unparsedFiles')
    }

    function isActive(viewLocation) {
        return viewLocation === $location.path();
    }

}
