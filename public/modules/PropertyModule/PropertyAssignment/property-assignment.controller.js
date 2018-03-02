'use strict';

_PropAssignment.$inject = ["$state", "$timeout", "$rootScope", "$stateParams", "AOTCService", "$scope", "ValuationService", "UtilService"];
module.exports = _PropAssignment;
//angular.module('AOTC')
//    .controller('PropAssignment',_PropValuation );
function _PropAssignment($state, $timeout, $rootScope, $stateParams, AOTCService, $scope, ValuationService, UtilService) {
    ////console.log("PropValuation controller", $stateParams);

    var $ctrl = this;


    //===============================   variables ======================== //


    $ctrl.property = JSON.parse(localStorage.getItem('propertyDetails'));
    $ctrl.propertyId = JSON.parse(localStorage.getItem('propertyId'));

    $timeout(function () {
        $('#myModal').modal('show');
    });

    $ctrl.formsList = [];
    //==========================================Methods========================================= //
    //===============================   GETTING DATA ======================== //
    $ctrl.userRoles = JSON.parse(localStorage.getItem('propertyDetails')).roles || {};

    $ctrl.userByRole = [];

    $ctrl.getDatas = function (_value) {
        if (!_value) return;
        var url = '/users/getUserByRole';
        var _data = {
            "roleName": _value,
            "propId": parseInt(localStorage.getItem('propertyId'))
        };
        $("#preloader").css("display", "block");

        AOTCService.postDataToServer(url, _data)
            .then(function (response) {
                if (response.data.success) {
                    $ctrl.userByRole = response.data.result;
                    $('#myModal').modal('hide');
                    resetRolesData();

                }
                $("#preloader").css("display", "none");
                //$scope.$emit('success', response.data.message);



            }, function (result) {
                $("#preloader").css("display", "none");

                //some error
                ////console.log(result);
            });

    };
    $ctrl.selectedUsers = [];
    $ctrl.addToselectedUsers = function (_id, _val) {
        if (_val) {
            $ctrl.selectedUsers.push(_id);
        } else {
            var index = $ctrl.selectedUsers.indexOf(_id);
            $ctrl.selectedUsers.splice(index, 1);
        }

    };

    $ctrl.saveData = function () {
        var _data = {
            "propId": parseInt(localStorage.getItem('propertyId')),
            "agentId": $ctrl.selectedUsers,
            "roles": $ctrl.rolesForSelectedUsers
        };
        var url = '/properties/assignPropertyToAgent';
        $("#preloader").css("display", "block");

        AOTCService.postDataToServer(url, _data)
            .then(function (response) {
                if (response.data.success) {
                    resetRolesData();
                    $scope.$emit('success', response.data.message);
                    $timeout(function () {
                        $("#preloader").css("display", "none");
                        $state.go('assignedUsersList');
                    }, 2000);
                } else $scope.$emit('error', response.data.message);
                
                //$scope.$emit('success', response.data.message);
            }, function (result) {
                $("#preloader").css("display", "none");
                $scope.$emit('error', result.data.message);
                //some error
                ////console.log(result);
            });
    };

    //====================================================================================================================================//

    resetRolesData();

    function resetRolesData() {
        $ctrl.rolesForSelectedUsers = {
            "viewPropertyPublicData": false,
            "unlinkPropertyData": false,
            "viewRentRolls": false,
            "attachFilesToProperty": false,
            "viewIncomeExpense": false,
            "editValuationWorkspace": false,
            "editValuationForm": false,
            "viewValuationWorkspace": false,
            "editPropertyImage": false,
            "viewComparables": false,
            "viewValuationForm": false,
            "viewPropertyDetails": false,
            "viewTaxBills": false,
            "assignProperty": false
        };
        $ctrl.selectedUsers = [];
    }

    $scope.$on("$destroy", function handler() {
        $('#myModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

    });



}