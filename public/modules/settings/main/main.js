'use strict';

_settings.$inject =["UtilService", "$stateParams", "$scope"];
module.exports = _settings;

//angular.module('AOTC')
//    .directive('inputFocusFunction', _inputFocusFunction
//    )
//    .controller('PropValuation',_PropValuation );

Object.defineProperty(Array.prototype, 'remove', {
    enumerable: false,
    value: function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    }
});

function _settings(UtilService, $stateParams, $scope) {
    ////console.log("PropValuation controller", $stateParams);
    $scope.hello122 = "world";
    // console.log( $scope.hello122)
    // var vm = this;
    $scope.data = {}

    $scope.dropdown_label = function(){
        var str = ""
        if($scope.data.all){
            return "All days"
        }
        
        
        if($scope.data.mon){
            str += "Monday"
        }
        

        if($scope.data.tue){
            if (str.length > 0){
                str += ", ";
            }

            str += "Tuesday"
        }

        if($scope.data.wed){
            if (str.length > 0){
                str += ", ";
            }
            str += "Wednesday"
        }

        if($scope.data.thur){
            if (str.length > 0){
                str += ", ";
            }
            str += "Thursday"
        }

        if($scope.data.fri){
            if (str.length > 0){
                str += ", ";
            }
            str += "Friday"
        }

        if($scope.data.sat){
            if (str.length > 0){
                str += ", ";
            }
            str += "Saturday"
        }

        if($scope.data.sun){
            if (str.length > 0){
                str += ", ";
            }
            str += "Sunday"
        }

        if (str.length > 0){
            return str
        }
        return "Choose week days";
    }
    $scope.start = moment();
    $scope.end = moment().add(1, 'days').add(1, 'hours');
    
    $scope.user_times = [{start:moment(),end:moment().add(1, 'days').add(1, 'hours')},{start:moment(),end:moment().add(1, 'days').add(1, 'hours')}]

    $scope.changed = function () {
        console.log('changed start or end datetime objects');
      };
      $scope.changedStart = function () {
        console.log('changed start datetime object');
      };
      $scope.changedEnd = function () {
        console.log('changed end datetime object');
      };
      $scope.closed = function () {
        console.log('edit popover closed');
      };
      $scope.add_time = function(){
        $scope.user_times.push({start:moment(),end:moment().add(1, 'days').add(1, 'hours')})
      }

      $scope.delete_time = function(index){

        $scope.user_times.remove(index)
        // delete obj;
      }
}