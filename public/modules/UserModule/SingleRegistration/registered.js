'use strict';

_Registered.$inject = ["$stateParams", "$rootScope", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _Registered;

//angular.module('AOTC').controller('Registered', _Registered
//    );
function _Registered($stateParams, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    ////console.log("Registered controller", $stateParams);
    var vm = this;

    if ($stateParams.messageFrom == "bulkUserRegistration") {
        $timeout(function () {
            $scope.$emit('success', 'Invitation sent successfully');
        }, 100);
    }

    //==========================Variables======================================//
    var userId = localStorage.getItem("userId");
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withDisplayLength(20)
        .withOption('lengthMenu', [
            [20, 50, 100, -1],
            [20, 50, 100, "All"]
        ])
        .withOption('order', [
            [2, 'desc']
        ]);
    vm.dtColumnDefs = [];
    //==========================Attributes======================================//
    vm.tableData = [];
    vm.emailSubject = "";
    vm.anotherUserActive = 0;
    vm.data = {
        name: "",
        lastName: "",
        company: "",
        city: "",
        email1: "",
        role: ""
    };

    //==========================Behaviour======================================//
    vm.showEmailPopup = showEmailPopup;
    vm.addNewUser = addNewUser;
    vm.anotherUserToggle = anotherUserToggle;

    getUsers();

    function getUsers() {
        var url = '/users/getAllInvitedUsers?adminId=' + userId;
        ////console.log(url);
        $("#preloader").css("display", "block");

        AOTCService.getDataFromServer(url)
            .then(function (result) {

                ////console.log('----------Serverdata : getAllInvitedUsers--------------');
                ////console.log(result);

                if (result.data.success) {
                    vm.tableData = result.data.result;

                    $("#preloader").css("display", "none");
                    if (vm.tableData.length == 0) {
                        $scope.$emit('error', 'No Data Found');
                    }


                } else {
                    $scope.$emit('error', result.data.message)
                }

            }, function (result) {
                //some error
                //////console.log(result);
            });
    }

    function showEmailPopup() {

        vm.emailSubject = "We'd like you to add as Designee";
        $('#myModal').modal('toggle');
        $('#myModalinvite').modal('toggle'); //email body modal

    }

    function addNewUser() {

        var url = '/users/addBulkUsersRef';
        $('#myModalinvite').modal('toggle');
        var arrOfUsers = [];
        arrOfUsers.push(vm.data); // because our endpoint receive array
        var toSend = {
            bulkUsers: arrOfUsers,
            emailSubject: vm.emailSubject
        };

        $("#preloader").css("display", "block");

        AOTCService.postDataToServer(url, toSend)
            .then(function (result) {
                ////console.log(result);
                if (result.data.success) {

                    $("#preloader").css("display", "none");

                    vm.data = {
                        name: "",
                        lastName: "",
                        company: "",
                        city: "",
                        email1: "",
                        role: ""
                    };
                    $scope.inviteForm.$setPristine();
                    $scope.inviteForm.$setUntouched();
                    // $scope.inviteForm.$setValidity();


                    if (vm.anotherUserActive) {
                        //close modal
                        $('#myModal').modal('toggle');
                        // $('modal').closeModal();
                    }

                    $scope.$emit('success', 'Invitation sent successfully');

                    getUsers();
                }

            }, function (result) {
                //////console.log(result);
                $("#preloader").css("display", "none");
            });

    }


    function anotherUserToggle() {
        vm.anotherUserActive = !+vm.anotherUserActive;
    }

    angular.element(document).ready(function () {
        $(".pushme").click(function() {
            $(this).text(function(i, v) {
                return v === 'Show less information' ? 'Show more information' : 'Show less information'
            })
        });
    });

}