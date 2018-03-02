'use strict';


_ajheader.$inject = ["User_Config", "$state"];
module.exports = _ajheader;

//angular.module('AOTC')
//    .directive('ajheader', _ajheader);

function _ajheader(User_Config, $state) {
    var controller = ['$scope', '$location', function ($scope, $location) {
        ////console.log('AJhead controller');
        if (!localStorage.getItem('userJson')) {
            $state.go('login');
        } else {
            var userResult = JSON.parse(localStorage.getItem('userJson'));
            $scope.name = userResult.userData.name

        }

    }];
    return {
        templateUrl: 'modules/AJModules/AJHeader/header.html',
        restrict: 'EA',
        controller: controller,
        controllerAs: 'head',
        bindToController: true

    };
}