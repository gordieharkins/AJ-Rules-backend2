'use strict';

_multipleUploadIERR.$inject = ["UtilService", "$stateParams", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _multipleUploadIERR;

//angular.module('AOTC').controller('multipleUploadIERR', _multipleUploadIERR
//    );
function _multipleUploadIERR(UtilService, $stateParams, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    //////console.log("multipleUploadIERR controller");

    var vm = this;

    vm.showIEFile = false;
    vm.showRRFile = false;
    vm.IEFileName = "";
    vm.RRFileName = "";
    vm.uploadSelectedFiles = uploadSelectedFiles;
    vm.showMyModal = showMyModal;

    vm.propertyId = "";
    vm.RRFileUploadStatus = false;
    vm.IEFileUploadStatus = false;
    vm.property = {};

    vm.IERR_Result = {
        IEData: [],
        RRData: []
    };

    function showMyModal(selected) {

        UtilService.clearFile();

        vm.hideModalFormFillButton = false;
        vm.FileNames = [];
        vm.selected = selected;

        if (vm.selected == 0) {

            $scope.uploadFileLabel = 'Upload File(s)';
            $scope.formFillLabel = 'Fill Form';
            $scope.modalHeading = 'Income Expense Statement(s) or enter data manually';

        } else if (vm.selected == 1) {

            $scope.uploadFileLabel = 'Upload File(s)';
            $scope.formFillLabel = 'Fill Form';
            $scope.modalHeading = 'Rent Roll Report(s) or enter data manually';
        }
        $('#myModal').modal('toggle');
    }

    function sendRRData(callback) {

        var url = '/rentRolls/addBulkPropertyRR';

        $("#preloader").css("display", "block");

        AOTCService.uploadFiles(url, vm.RRData)
            .then(function (result) {

                $("#preloader").css("display", "none");

                ////console.log("addBulkPropertyRR result: ", result);
                var serverData = result.data;

                if (serverData.success) {
                    $('#myModal').modal('toggle');

                    setTimeout(function () {
                        $state.go('TaskManager', {
                            messageFrom: 'multipleUploadIERR',
                            message: serverData.message
                        });

                    }, 500);

                } else {
                    $scope.$emit('danger', serverData.message);
                }


                callback();

            }, function (result) {

                $("#preloader").css("display", "none");

            });
    }

    function sendIEData(callback) {
        $("#preloader").css("display", "block");

        var url = '/incomeExpenses/addBulkPropertyIE';

        AOTCService.uploadFiles(url, vm.IEData)
            .then(function (result) {
                $("#preloader").css("display", "none");

                ////console.log("addBulkPropertyIE result: ", result);
                var serverData = result.data;

                if (serverData.success) {
                    $('#myModal').modal('toggle');

                    setTimeout(function () {

                        $state.go('TaskManager', {
                            messageFrom: 'multipleUploadIERR',
                            message: serverData.message
                        });


                    }, 500);



                } else {
                    $scope.$emit('danger', serverData.message);
                }

                callback();

            }, function (result) {
                $("#preloader").css("display", "none");
            });
    }

    $scope.fileUploaded = function () {

        vm.FileNames = [];

        if (vm.selected == 0) { //IE
            var files = document.getElementById('files-IERR').files;
            vm.IEData = files;
            for (var i = 0; i < files.length; i++) {
                vm.FileNames.push({
                    name: files[i].name,
                    uploadStatus: true
                });
            }
        } else if (vm.selected == 1) { //RR
            var files = document.getElementById('files-IERR').files;
            vm.RRData = files;
            for (var i = 0; i < files.length; i++) {
                vm.FileNames.push({
                    name: files[i].name,
                    uploadStatus: true
                });
            }
        }



        // Parsing is done. Update UI.
        $scope.$apply();
    }

    function uploadSelectedFiles() {
        if (vm.selected == 0) {
            sendIEData(function () {
                ////console.log("sendIEData");
            });

        } else if (vm.selected == 1) {
            sendRRData(function () {
                ////console.log("sendRRData");
            });
        }
    }
}
