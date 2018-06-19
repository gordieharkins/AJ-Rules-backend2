'use strict';

_settings.$inject = ["UtilService", "$stateParams", "$scope", "AOTCService"];
module.exports = _settings;

//angular.module('AOTC')
//    .directive('inputFocusFunction', _inputFocusFunction
//    )
//    .controller('PropValuation',_PropValuation );

Object.defineProperty(Array.prototype, 'remove', {
    enumerable: false,
    value: function (from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    }
});

function _settings(UtilService, $stateParams, $scope, AOTCService) {


    $scope.error_check = false;
    $scope.timezones = ["Timezone 1", "Timezone 2", "Timezone 3", "Timezone 4"]
    $scope.data = {}
    $scope.data["sms"] = { "flag": true, "verified": false }
    $scope.data["email"] = { "flag": true, "verified": false }
    $scope.data["blackouts"] = [];

    $scope.time_data = {};

    $scope.time_data.intervals = [{ startTime: moment(), endTime: moment().add(10, 'hours') }]

    $scope.set_new_time = function () {
        var day = [];
        if ($scope.time_data.mon) {
            day.push("Monday")
        }

        if ($scope.time_data.tue) {
            day.push("Tuesday")
        }

        if ($scope.time_data.wed) {
            day.push("Wednesday")
        }

        if ($scope.time_data.thur) {
            day.push("Thursday")
        }

        if ($scope.time_data.fri) {
            day.push("Friday")
        }

        if ($scope.time_data.sat) {
            day.push("Saturday")
        }

        if ($scope.time_data.sun) {
            day.push("Sunday")
        }

        if (day.length == 0) {
            $scope.time_data_error = true;
            return;
        }

        $scope.data.blackouts.push({ days: day, intervals: JSON.parse(JSON.stringify($scope.time_data.intervals)), checked: true, span:$scope.time_data.span })
        $scope.dismiss();
    }
    $scope.save_settings = function (form_alert_type) {
        $scope.error_check = true;
        
        if($scope.data.email.flag || $scope.data.sms.flag){
            if(!form_alert_type.$valid){
                return
            }else{
                console.log("Called")
                AOTCService.postDataToServer("/alerts/saveSettings", $scope.data)
                .then(
                function successCallback(response) {
                    console.log(response)
                },
                function errorCallback(response) {
                    console.log(response)
                })
            }
            
        }else{
            $scope.email_sms_error = true;
        }
        // console.log($scope.data)
    }

    $scope.ischecked = function (d) {
        if (d) {
            return "checked"
        }
        return "";
    }

    $scope.change_timezone = function (t) {
        $scope.data.timezone = t;
    }

    $scope.all_changed = function () {

        if ($scope.time_data.all) {
            $scope.time_data.mon = true;
            $scope.time_data.tue = true;
            $scope.time_data.wed = true;
            $scope.time_data.thur = true;
            $scope.time_data.fri = true;
            $scope.time_data.sat = true;
            $scope.time_data.sun = true;
        } else {
            $scope.time_data.mon = false;
            $scope.time_data.tue = false;
            $scope.time_data.wed = false;
            $scope.time_data.thur = false;
            $scope.time_data.fri = false;
            $scope.time_data.sat = false;
            $scope.time_data.sun = false;
        }

        $scope.error_reset();
    }

    $scope.single_changed = function () {
        if ($scope.time_data.mon == true && $scope.time_data.tue == true && $scope.time_data.wed == true && $scope.time_data.thur == true && $scope.time_data.fri == true && $scope.time_data.sat == true && $scope.time_data.sun == true) {
            $scope.time_data.all = true;
        } else {
            $scope.time_data.all = false;
        }

        $scope.error_reset();

        
    }

    $scope.error_reset = function(){
        if ($scope.time_data.mon == true || $scope.time_data.tue == true || $scope.time_data.wed == true || $scope.time_data.thur == true || $scope.time_data.fri == true || $scope.time_data.sat == true || $scope.time_data.sun == true) {
            $scope.time_data_error = false;
        }
    }

    $scope.none_selected_error_reset = function(){
        if($scope.data.email.flag || $scope.data.email.sms){
            $scope.email_sms_error = false;
        }else{
            $scope.email_sms_error = true;            
        }
    }

    $scope.dropdown_label = function () {
        var str = ""
        if ($scope.time_data.all) {
            return "All Week days"
        }

        if ($scope.time_data.mon) {
            str += "Monday"
        }

        if ($scope.time_data.tue) {
            if (str.length > 0) {
                str += ", ";
            }
            str += "Tuesday"
        }

        if ($scope.time_data.wed) {
            if (str.length > 0) {
                str += ", ";
            }
            str += "Wednesday"
        }

        if ($scope.time_data.thur) {
            if (str.length > 0) {
                str += ", ";
            }
            str += "Thursday"
        }

        if ($scope.time_data.fri) {
            if (str.length > 0) {
                str += ", ";
            }
            str += "Friday"
        }

        if ($scope.time_data.sat) {
            if (str.length > 0) {
                str += ", ";
            }
            str += "Saturday"
        }

        if ($scope.time_data.sun) {
            if (str.length > 0) {
                str += ", ";
            }
            str += "Sunday"
        }

        if (str.length > 0) {
            return str
        }
        return "Choose week days";
    }

    $scope.newTimeAlert = function(reset){

        $('#myModal').modal('show');
        
        if(reset){
            $scope.time_data = {};
            $scope.time_data.intervals = [{ startTime: moment(), endTime: moment().add(10, 'hours') }]
            $scope.time_data_error = false;
            $scope.time_data.span = "specific_time";
            
        }
    }

    $scope.add_time = function () {
        $scope.time_data.intervals.push({ startTime: moment(), endTime: moment().add(10, 'hours') })
    }
    $scope.delete_time = function (index) {
        $scope.time_data.intervals.remove(index)
        // delete obj;
    }

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

}