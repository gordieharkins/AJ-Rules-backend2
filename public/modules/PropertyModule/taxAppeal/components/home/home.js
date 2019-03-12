'use strict';

_appealHome.$inject = [];
module.exports = _appealHome;

//angular.module('AOTC')
//    .controller('updateIERR', _updateIERR
//    );
function _appealHome(UtilService, $stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    
    return {
        //scope: {
        //    'treeData': "=awtcTree",
        //    //'getCrewDetail': '&getCrewDetail'
        //},
        //controller: function ($scope, $rootScope) {
        //    $scope.getCrewDetail = function (_item) {
        //        $rootScope.$broadcast('crewUpdate', { crew: _item });
        //    }
        //},
        templateUrl: 'modules/PropertyModule/taxAppeal/components/home/home.html',
        link: function (scope, elem, attr) {
            console.log($location.path())
            scope.value = ''
            console.log(scope.data)
            
            scope.name= function() {
                scope.value = '123'
            }
          

        }
    }
  
}

