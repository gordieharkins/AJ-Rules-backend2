'use strict';

_UserRegistration.$inject = ["$anchorScroll", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _UserRegistration;


//angular.module('AOTC').controller('UserRegistration', _UserRegistration
//    );
function _UserRegistration($anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    //////console.log("UserRegistration controller");
    var vm = this;
    //==========================Variables======================================//
    $scope.popup_custom_success = "";
    var userId = localStorage.getItem("userId");
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('order', [
            [1, 'asc']
        ])
        .withOption('lengthMenu', [
            [20, 50, 100, -1],
            [20, 50, 100, "All"]
        ])
        .withDisplayLength(20);
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notSortable()
    ];
    //==========================Attributes======================================//
    vm.showTableRelatedDivs = false;
    vm.old = $location.hash();
    vm.myFile = "";
    vm.fileName = "";
    vm.checkAll = 1;
    vm.emailSubject = "We'd like you to add as designee";
    vm.usersToBeRegistered = [];
    vm.data = 'none';
    //==========================Behaviour======================================//


    vm.toggleCheckAll = toggleCheckAll;
    vm.toggleState = toggleState;
    vm.submitUserRegistrationData = submitUserRegistrationData;

    vm.upload = function (data) {
        //////console.log(vm.myFile);
        //////console.log(data);
    }

    $scope.fileNameChanged = function () {
        //////console.log('file used');
        vm.usersToBeRegistered = [];
        var result = [];
        $scope.$digest();
        var files = document.getElementById('file-1').files;
        vm.fileName = files[0].name;
        var url = '/users/uploadUserFile';
        $scope.$apply();


        AOTCService.uploadFiles(url, files)
            .then(function (result) {
                ////console.log(result);

                if (result.data.success) {
                    //////console.log('show mee')
                    vm.showTableRelatedDivs = true;
                    vm.usersToBeRegistered = result.data.result;
                    // $scope.popup_custom_success= "File  successfully";
                    // $scope.$digest();
                    // $scope.$apply();
                    // $("#popup_custom_success").fadeIn(1500).delay(500).fadeOut(500);


                } else {
                    //show error
                    vm.showTableRelatedDivs = false;
                    $("#error_main").fadeIn(1500).delay(500).fadeOut(500);
                }
                //$anchorScroll();
                $("#preloader").css("display", "none");

            }, function (result) {
                $("#preloader").css("display", "none");
                //////console.log(file);
                vm.fileName = file.name;

            });
    }

    function submitUserRegistrationData() {
        $('#myModalinvite').modal("toggle");
        $("#preloader").css("display", "block");

        // //////console.log(vm.usersToBeRegistered);
        var now = new Date;

        var utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
            now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

        var arrOfUsers = [];

        for (var i = 0; i < vm.usersToBeRegistered.length; i++) {
            var obj = vm.usersToBeRegistered[i]

            if (obj.state == 1) {

                var data = {
                    name: obj.firstName,
                    lastName: obj.lastName,
                    company: obj.company,
                    city: obj.city,
                    email1: obj.userEmail,
                    role: obj.role
                };

                arrOfUsers.push(data);
            }
        }

        var toSend = {
            bulkUsers: arrOfUsers,
            emailSubject: vm.emailSubject
        };

        //////console.log(toSend);

        var url = '/users/addBulkUsersRef';

        AOTCService.postDataToServer(url, toSend)
            .then(function (result) {
                //////console.log(result);

                if (result.data.success) {

                    $("#preloader").css("display", "none");
                    $state.go('Registered', { messageFrom: "bulkUserRegistration" });

                }



            }, function (result) {
                //some error
                $("#preloader").css("display", "none");

                //////console.log(result);
            });

    }
    //-----------------------------------------------
    // upload file 
    //-----------------------------------------------

    $scope.uploadFile = function (event) {
        //////console.log(event);

    }
    //-----------------------------------------------
    // ui manipulation
    //-----------------------------------------------

    function toggleCheckAll() {
        $timeout(function () {

            vm.checkAll = +!vm.checkAll;
            if (vm.checkAll) {
                setDataState(vm.usersToBeRegistered, 1);

            } else {
                setDataState(vm.usersToBeRegistered, 0);
            }
        }, 100);
    }

    function setDataState(users, state) {

        for (var i = 0; i < users.length; i++) {
            users[i].state = state;
        }
    }

    function toggleState(user) {
        user.state = +!user.state;
        vm.checkAll = 0; //future change this one
        //if all user have this state stateof th will be that one also
    }
}
