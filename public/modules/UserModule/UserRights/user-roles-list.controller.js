_userRolesListCtrl.$inject = ["$stateParams", "$state", "$location", "$scope", "AOTCService", "$timeout", "$filter", "$q"];
module.exports = _userRolesListCtrl;

//angular.module('AOTC').controller('UserRolesListCtrl',
//    _userRolesListCtrl);

function _userRolesListCtrl($stateParams, $state, $location, $scope, AOTCService, $timeout, $filter, $q) {

    //Bindable Members
    var $ctrl = this;
    var sendFile = null;
    $scope.fileName = ''
    $ctrl.showNewRightModal = function () {
        $('#newRightModal').modal('show');
    };

    $ctrl.allUserRoles = [];
    //========================Starting Logic =======================//

    $scope.uRole = {
        "contracts": false,
        "createContract": false,
        "masterSlave": false,
        "name": "",
        "newsFeed": false,
        "properties": false,
        "publicData": false,
        "surveys": false,
        "taskmanager": false,
        "timeline": false,
        "uploadProperties": false
    };

    getContracts();

    function getContracts() {

        var url = '/admin/getAllUserRoles';
        //var defer = $q.defer();
        $('#preloader').css("display", "block");

        AOTCService.getDataFromServer(url).
        then(function (result) {
            if (result.data.success) {
                $ctrl.allUserRoles = result.data.result;

            }
            $('#preloader').css("display", "none");

        }, function (err) {
            $('#preloader').css("display", "none");

        });

        //return defer.promise;
    }

    $ctrl.updateUserRole = function (_data, _id, _form) {
        var _objData = {
            "roleId": _id,
            "role": _data
        };
        var _url = '/admin/updateUserRole';
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
                    $scope.$emit('success', serverData.message);
                } else {
                    $scope.$emit('danger', serverData.message);
                }


            }, function errorCallback(response) {
                $('#preloader').css("display", "none");
            });

    };

    $scope.uplaodFile = function(file) {
        //console.log(file.files)
        $("#preloader").css("display", "block");
        sendFile = null;
        var files = file.files;
        $scope.fileName = files[0].name
        var FileNames = [];
        var selected  = 0;
        sendFile = files
         $scope.fileName = files[0].name
       
        var url = '/aJRules/updateJurisdictionRules'
        AOTCService.uploadFiles(url, sendFile)
        .then(function (result) {
            $("#preloader").css("display", "none");
   
            $scope.$emit('error', result.data.message)
            $scope.fileName = ''
            sendFile = null;

        }, function (result) {
            $("#preloader").css("display", "none");
            $scope.$emit('error', result.data.message)
            sendFile = null;
            $scope.fileName = ''
            //////console.log(result);
        });
        
  }

    $ctrl.addNewRole = function (_data, _form) {
        //if(!_form.name) return;
        var _objData = _data;
        var _url = '/admin/addNewRole';
        $('#preloader').css("display", "block");

        AOTCService.postDataToServer(_url, _objData)
            .then(function successCallback(response) {
                $('#preloader').css("display", "none");

                //////console.log("result is ", response);
                var serverData = response.data;
                //set token
                if (serverData.success) {
                    $('#newRightModal').modal('hide');
                    getContracts();
                    $scope.$emit('success', serverData.message);
                } else {
                    $scope.$emit('danger', serverData.message);
                }


            }, function errorCallback(response) {
                $('#preloader').css("display", "none");
            });

    };

}