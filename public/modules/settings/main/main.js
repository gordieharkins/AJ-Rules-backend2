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
    $scope.data["sms"] = { "flag": false, "verified": false }
    $scope.data["email"] = { "flag": false, "verified": false }
    $scope.data["blackouts"] = [];

    $scope.min_date = moment().startOf('day').subtract(1,'hours');

    $scope.max_date = moment().endOf('day');
    $scope.time_data = {};

    $scope.time_data.intervals = [{ startTime:  moment().startOf('day'), endTime:  moment().startOf('day').add(8,'hours') }]

    $scope.sending_email_code = false;

    $scope.send_code_to_email = function(){
        $scope.sending_email_code = true;
        
        AOTCService.postDataToServer("/alerts/saveEmailCode", {email:$scope.data.email.details})
            .then(
            function successCallback(response) {
                console.log(response)
                $scope.sending_email_code = false;
            },
            function errorCallback(response) {
                console.log(response)
                $scope.sending_email_code = false;
            })
    }

    $scope.sending_sms_code = false;

    $scope.send_code_to_sms = function(){
        $scope.sending_sms_code = true;
        
        AOTCService.postDataToServer("/alerts/savePhoneCode", {email:$scope.data.email})
            .then(
            function successCallback(response) {
                console.log(response)
                $scope.sending_sms_code = false;
            },
            function errorCallback(response) {
                console.log(response)
                $scope.sending_sms_code = false;
            })
    }

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

        
        if($scope.editing){
            $scope.data.blackouts[$scope.edit_index] = { days: day, intervals: JSON.parse(JSON.stringify($scope.time_data.intervals)), checked: true, span:$scope.time_data.span }
            
            $scope.editing = false;
            // $scope.dismiss();
            setTimeout(function(){
                $('#myModal').modal('hide');
            }, 500)

            return;
        }

        $scope.data.blackouts.push({ days: day, intervals: JSON.parse(JSON.stringify($scope.time_data.intervals)), checked: true, span:$scope.time_data.span })
        $scope.dismiss();
    }
    
    $scope.toggle_input = function(index){
        $scope.data.blackouts[index].checked  = !$scope.data.blackouts[index].checked;
        // console.log("Working", d)
        // d.checked = !d.checked;
        console.log("Working", $scope.data)
        
    }

    $scope.select_timezone_label = function(){
        if($scope.data.timezone){
            return $scope.data.timezone;
        }

        return "Select timezone"
    }

    $scope.save_settings = function (form_alert_type) {
        $scope.saving = true;
        $scope.error_check = true;
        console.log($scope.data)
        if($scope.data.email.flag || $scope.data.sms.flag){
            if(!form_alert_type.$valid){
                return
            }else{
                console.log("Called")

                var data = JSON.parse(JSON.stringify($scope.data));
                if(data.sms.flag){
                    data.sms.flag = "true";
                }else{
                    data.sms.flag = "false"
                }

                if(data.email.flag){
                    data.email.flag = "true"
                }else{
                    data.email.flag = "false"
                }

                if(data.email.verified){
                    data.email.verified = "true"
                }else{
                    data.email.verified = "false"
                }

                if(data.sms.verified){
                    data.sms.verified = "true"
                }else{
                    data.sms.verified = "false"
                }

                for(var i =0; i< data.blackouts.length;i++){
                    if(data.blackouts[i].checked == true){
                        data.blackouts[i].checked = "true";
                    }else{
                        data.blackouts[i].checked = "false";
                    }
                }

                AOTCService.postDataToServer("/alerts/saveSettings", data)
                .then(
                function successCallback(response) {
                    console.log(response)
                    $scope.saving = false;
                },
                function errorCallback(response) {
                    console.log(response)
                    $scope.saving = false;
                })
            }
            
        }else{
            $scope.email_sms_error = true;
        }
        // console.log($scope.data)
    }

    $scope.ischecked = function (d) {
        if (d.checked && d.checked == true) {
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
        if($scope.data.email.flag || $scope.data.sms.flag){
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

    $scope.editing = false;
    $scope.newTimeAlert = function(reset, elem, index){
        $scope.editing = false;
        
        $('#myModal').modal('show');
        
        if(reset){
            $scope.time_data = {};
            $scope.time_data.intervals = [{ startTime:  moment().startOf('day'), endTime:  moment().startOf('day').add(8,'hours') }]
            $scope.time_data_error = false;
            $scope.time_data.span = "specific_time";
            
        }else if (elem){
            $scope.editing = true;
            $scope.edit_index = index;
            $scope.time_data = null;
            $scope.time_data = JSON.parse(JSON.stringify(elem));
            var a_check = false;
            if($.inArray('Monday', elem.days) > -1){
                $scope.time_data.mon = true;
            }else{
                a_check = true;
            }

            if($.inArray('Tuesday', elem.days) > -1){
                $scope.time_data.tue = true;
            }else{
                a_check = true;
            }

            if($.inArray('Wednesday', elem.days) > -1){
                $scope.time_data.wed = true;
            }else{
                a_check = true;
            }

            if($.inArray('Thursday', elem.days) > -1){
                $scope.time_data.thur = true;
            }else{
                a_check = true;
            }

            if($.inArray('Friday', elem.days) > -1){
                $scope.time_data.fri = true;
            }else{
                a_check = true;
            }

            if($.inArray('Saturday', elem.days) > -1){
                $scope.time_data.sat = true;
            }else{
                a_check = true;
            }

            console.log($.inArray("Sunday", elem.days))
            if($.inArray("Sunday", elem.days) > -1){
                $scope.time_data.sun = true;
            }else{
                a_check = true;
            }

            if(!a_check){
                $scope.time_data.all = true;
            }

            console.log(elem)
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


    // hello
    $scope.open_dialog = function(modal){
        $('#'+modal).modal('show');
    }

    $scope.isSelected = function(item){
        if($scope.data.timezone == item){
            return "selected-option";
        }
    }

    $scope.toggle_dropdown = function(id){
        $("#"+id).toggle();
    }


    $scope.delete_interval = function(index){
        $scope.data.blackouts.remove(index);
    }




    AOTCService.getDataFromServer('/alerts/getSettings')
        .then(function (result) {
            ////console.log(result);
            console.log("Batista",result.data.result);

            if(!result.data.result.settings){
                return
            }
            $scope.data =  result.data.result.settings

            if($scope.data.sms.flag == "true"){
                $scope.data.sms.flag = true;
            }else{
                $scope.data.sms.flag = false;
            }

            if($scope.data.email.flag == "true"){
                $scope.data.email.flag = true;
            }else{
                $scope.data.email.flag = false;
            }

            if($scope.data.email.verified == "true"){
                $scope.data.email.verified = true;
            }else{
                $scope.data.email.verified = false;
            }

            if($scope.data.sms.verified == "true"){
                $scope.data.sms.verified = true;
            }else{
                $scope.data.sms.verified = false;
            }
            // $scope.data.email.verified = false
            // $scope.data.sms.verified = true;

            for(var i =0; i< $scope.data.blackouts.length;i++){
                if($scope.data.blackouts[i].checked == "true"){
                    $scope.data.blackouts[i].checked = true;
                }else if($scope.data.blackouts[i].checked=="false"){
                    $scope.data.blackouts[i].checked = false;
                }
                // console.log($scope.data.blackouts[i].checked);
                
            }

        }, function (result) {
            ////console.log(result);
            console.log("error", result)


        });


        $(".digit").keyup(function () {
              if (this.value.length == this.maxLength) {
                $(this).next('.digit').focus();
              }
        });


}