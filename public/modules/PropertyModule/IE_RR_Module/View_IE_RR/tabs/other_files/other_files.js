'use strict';

_other_files.$inject = ["$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _other_files;

//angular.module('AOTC').controller('other_files', _other_files
//    );

function _other_files($location, $scope, $http, __env, $log, AOTCService, $timeout) {
    ////console.log("other_files controller");

    var vm = this;

    vm.propertiesCount = localStorage.getItem('propertiesCount');
    vm.propertyId = JSON.parse(localStorage.getItem('propertyId'));
    vm.unlinkOtherFile = unlinkOtherFile;
    vm.deleteOtherFile = deleteOtherFile;
    vm.myModelCheck = myModelCheck;
    vm.modelMessage = {
        title: "",
        message: ""
    }

    vm.otherFileIds = [];
    vm.selection = -1;

    getOtherFiles();

    function unlinkOtherFile(otherFiles) {
        vm.modelMessage.title = 'Unlink ' + otherFiles.otherFileNodes.properties.fileName;
        vm.modelMessage.message = 'Are you sure to unlink file from this property?';
        vm.otherFileIds.push(otherFiles.otherFileNodes._id);
        vm.selection = 0;
    }

    function deleteOtherFile(otherFiles) {
        vm.modelMessage.title = 'Delete ' + otherFiles.otherFileNodes.properties.fileName;
        vm.modelMessage.message = 'Are you sure to delete file from this property?';
        vm.otherFileIds.push(otherFiles.otherFileNodes._id);
        vm.selection = 1;
    }

    function myModelCheck() {
        if (vm.selection === 1) {

            deleteOtherFiles();
        } else if (vm.selection === 0) {

            unlinkOtherFiles();
        }
        vm.selection = -1;
    }

    // getOther Files
    function getOtherFiles() {

        var url = '/otherfiles/getOtherFiles';
        var _data = {propId: vm.propertyId};
        $("#preloader").css("display", "block");

        AOTCService.postDataToServer(url, _data).then(function (result) {

            ////console.log("getOtherFiles: ", result);

            var serverData = result.data;

            if (serverData.success) {

                vm.tableData = serverData.result;

                $("#preloader").css("display", "none");

                setTimeout(function () {
                    $('[data-tooltip="tooltip"]').tooltip();
                }, 100);
            }
        }, function (result) {
            //some error
            ////console.log(result);
            $("#preloader").css("display", "none");
        });
    }

    // Unlink taxBill call
    function unlinkOtherFiles() {

        var url = '/otherFiles/unlinkOtherFilesById';

        $("#preloader").css("display", "block");

        vm.data = {
            propId:parseInt(localStorage.getItem('propertyId')),
            otherFileIds: vm.otherFileIds
        };

        AOTCService.postDataToServer(url, vm.data).then(function (result) {
            ////console.log(result);

            if (result.data.success) {
                $scope.$emit('success', result.data.message);
                getOtherFiles();
            } else {
                $scope.$emit('error', result.data.message);
            }
            vm.taxBillIds = [];

            $("#preloader").css("display", "none");
        }, function (result) {
            $("#preloader").css("display", "none");
            $scope.$emit('error', result.data.message);
        });
    }

    // Delete taxBill call
    function deleteOtherFiles() {

        var url = '/otherFiles/deleteOtherFilesById';

        $("#preloader").css("display", "block");

        vm.data = {
            otherFileIds: vm.otherFileIds
        };

        AOTCService.postDataToServer(url, vm.data).then(function (result) {
            ////console.log(result);

            if (result.data.success) {
                $scope.$emit('success', result.data.message);
                getOtherFiles();
            } else {
                $scope.$emit('error', result.data.message);
            }
            vm.taxBillIds = [];

            $("#preloader").css("display", "none");
        }, function (result) {
            $("#preloader").css("display", "none");
            $scope.$emit('error', result.data.message);
        });
    }
}
