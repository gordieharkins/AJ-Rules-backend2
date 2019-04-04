_assignedUsersListCtrl.$inject = ["$stateParams", "$state", "$location", "$scope", "AOTCService", "$timeout", "$filter", "$q"];
module.exports = _assignedUsersListCtrl;

//angular.module('AOTC').controller('AssignedUsersListCtrl',
//    _assignedUsersListCtrl);

function _assignedUsersListCtrl($stateParams, $state, $location, $scope, AOTCService, $timeout, $filter, $q) {

    //Bindable Members
    var $ctrl = this;
    $ctrl.property = JSON.parse(localStorage.getItem('propertyDetails'));
    $ctrl.propertyId = JSON.parse(localStorage.getItem('propertyId'));
    $ctrl.showRightsModal = function () {
        $('#mySelectModal').modal('show');
    };

    $ctrl.allUserRoles = [];
    //========================Starting Logic =======================//

    getAssignedUsers();

    function getAssignedUsers() {

        var url = '/properties/getAssignedUsers';
        var _data = {
            "propId":parseInt(localStorage.getItem('propertyId'))
        };
        //var defer = $q.defer();
        $('#preloader').css("display", "block");

        AOTCService.postDataToServer(url, _data).
        then(function (result) {
            if (result.data.success) {
                $ctrl.assignedUsers = result.data.result;

            }
            $('#preloader').css("display", "none");

        }, function (err) {
            $('#preloader').css("display", "none");

        });

        //return defer.promise;
    }

    $ctrl.updateUserRole = function (_data, _id, _form) {
        var _objData = {
            // "roleId": _id,
            // "role": _data,
            "propId":parseInt(localStorage.getItem('propertyId')),
            "agentId":[_id],
            "roles":_data 
        };
        var _url = '/properties/assignPropertyToAgent';
        $('#preloader').css("display", "block");

        AOTCService.postDataToServer(_url, _objData)
            .then(function successCallback(response) {
                $('#preloader').css("display", "none");

                //////console.log("result is ", response);
                var serverData = response.data;
                //set token
                if (serverData.success) {
                    //_form.$setPristine();
                    _form.$setPristine();
                    $scope.$emit('success',serverData.message);
                } else {
                     $scope.$emit('danger', serverData.message);
                }


            }, function errorCallback(response) {
                $('#preloader').css("display", "none");
            });

    };

    $ctrl.deleteUserRole = function(_data, _id, _index){
        var _objData = {
            "propId":parseInt(localStorage.getItem('propertyId')),
            "agentId":[_id]
        };
        var _url = '/properties/removeAssignedUser';
        $('#preloader').css("display", "block");

        AOTCService.postDataToServer(_url, _objData)
            .then(function successCallback(response) {
                $('#preloader').css("display", "none");

                //////console.log("result is ", response);
                var serverData = response.data;
                //set token
                if (serverData.success) {
                    $timeout(function(){
                        $ctrl.assignedUsers.splice(_index, 1);                        
                    });
                    $scope.$emit('success',serverData.message);
                } else {
                     $scope.$emit('danger', serverData.message);
                }


            }, function errorCallback(response) {
                $('#preloader').css("display", "none");
            });

    };

}