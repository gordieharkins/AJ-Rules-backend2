'use strict';

_updateIERR.$inject = ["UtilService", "$stateParams", "$anchorScroll","$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _updateIERR;

//angular.module('AOTC')
//    .controller('updateIERR', _updateIERR
//    );
function _updateIERR(UtilService, $stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    ////console.log("updateIERR controller", $stateParams);
    var vm = this;
    // if($stateParams.id) {
    // console.log($stateParams.id)
    // }
    vm.property = {};
    vm.property = JSON.parse(localStorage.getItem('propertyDetails'));
    vm.propertyId = JSON.parse(localStorage.getItem('propertyId'));
    vm.userId = JSON.parse(localStorage.getItem('userId'));

    vm.FileNames = [];
    vm.selected = -1;

    vm.selection = [{
        id: 0,
        state: 'IE'
    }, {
        id: 1,
        state: 'RR'
    }, ];

    vm.uploadData = uploadData;
    vm.gotoManualUpload = gotoManualUpload;
    vm.images = [];

    vm.IERR_Result = {
        IEData: null,
        RRData: null
    };

    vm.otherData = [];
    $scope.uploadFileLabel = '';
    $scope.formFillLabel = '';
    $scope.modalHeading = '';
    vm.hideModalFormFillButton = false;

    vm.showMyModal = showMyModal;

    function gotoManualUpload() {

        $('#myModal').modal('toggle');
        setTimeout(function () {
            if (vm.selected == 0) //IE
            {
                $state.go('manualIE');

            } else if (vm.selected == 1) //RR
            {
                $state.go('manualRR');
            } else if (vm.selected == 3) // TaxBill
            {
                $state.go('taxBill');
            }
        }, 500);
    }

    function uploadData() {
        ////console.log('uploadData');
        if (vm.selected == 0) { // IE

            sendIEData();
        } else if (vm.selected == 1) { // RR

            sendRRData();
        } else if (vm.selected == 3) { // taxBills

            sendTaxBill();
        } else if (vm.selected == 4) { // moreFiles

            sendOthersData();
        }
    }

    function sendIEData() {
        if (vm.IEData) {
            $("#preloader").css("display", "block");
            var url = '/incomeExpenses/addPropertyIE?propId=' + vm.propertyId;
            ////console.log("==>", url);
            ////console.log("vm.IEData==>", vm.IEData);
            ////console.log("==>", url);
            // ////console.log("vm.IEData==>", vm.IEData);

            AOTCService.uploadFiles(url, vm.IEData)
                .then(function (result) {

                    ////console.log("addPropertyIE", result);

                    vm.IERR_Result.IEData = result.data;
                    $('#myModal').modal('toggle');
                    $timeout(function () {
                        ////console.log('task manager');
                        $state.go('TaskManager');

                    }, 500)

                    // checkResult();
                }, function (result) {
                    $("#preloader").css("display", "none");
                    ////console.log(result);
                });
        }
    }

    function sendRRData() {
        if (vm.RRData) {
            $("#preloader").css("display", "block");
            var url = '/rentRolls/addPropertyRR?propId=' + vm.propertyId;;
            $("#preloader").css("display", "block");
            ////console.log("==>", url);
            // ////console.log("vm.RRData==>", vm.RRData);

            AOTCService.uploadFiles(url, vm.RRData)
                .then(function (result) {

                    ////console.log("addPropertyRR: ", result);

                    vm.IERR_Result.RRData = result.data;
                    $('#myModal').modal('toggle');
                    $timeout(function () {
                        ////console.log('task manager');
                        $state.go('TaskManager');
                    }, 500);

                    // checkResult();
                }, function (result) {
                    $("#preloader").css("display", "none");
                    ////console.log(result);
                });
        }
    }

    function sendOthersData() {
        ////console.log('sendOthersData');
        ////console.log("vm.othersData==>", vm.othersData);

        if (vm.othersData) {
            $("#preloader").css("display", "block");

            var url = '/otherFiles/uploadOtherFiles?propId=' + vm.propertyId;

            var desc = '';

            for (var i = 0; i < vm.FileNames.length; i++) {
                if (i + 1 == vm.FileNames.length) {
                    desc += vm.FileNames[i].description;
                } else {
                    desc += vm.FileNames[i].description + ',';
                }
            }

            AOTCService.uploadFilesWithDescription(url, vm.othersData, desc)
                .then(function (result) {
                    ////console.log(result);

                    var serverData = result.data;
                    ////console.log(serverData);

                    if (serverData.success == true) {
                        $("#preloader").css("display", "none");
                        $('#myModal').modal('toggle');
                        $scope.$emit('success', serverData.message);
                        setTimeout(function () {
                            $state.go("viewIERR.other_files"); // Defined in
                        }, 500);
                    } else {

                        $("#preloader").css("display", "none");
                        // $(".dangerr").fadeIn(1500).delay(500).fadeOut(500);
                        $scope.$emit('danger', serverData.message);
                    }
                }, function (result) {
                    $("#preloader").css("display", "none");
                    ////console.log(result);
                });
        }
    }

    function sendTaxBill() {
        if (vm.taxBill) {
            $("#preloader").css("display", "block");

            var url = '/taxBills/uploadTaxBillFile?propId=' + vm.propertyId;

            var desc = '';

            for (var i = 0; i < vm.FileNames.length; i++) {
                if (i + 1 == vm.FileNames.length) {
                    desc += vm.FileNames[i].description;
                } else {
                    desc += vm.FileNames[i].description + ',';
                }
            }
            ////console.log(desc);

            AOTCService.uploadFilesWithDescription(url, vm.taxBill, desc)
                .then(function (result) {
                    ////console.log(result);

                    var serverData = result.data;
                    ////console.log(serverData);

                    if (serverData.success == true) {
                        $("#preloader").css("display", "none");
                        $('#myModal').modal('toggle');
                        $scope.$emit('success', serverData.message);
                        setTimeout(function () {
                            $state.go("viewIERR.tax_bills"); // Defined
                        }, 500);
                    } else {
                        $("#preloader").css("display", "none");
                        $(".dangerr").fadeIn(1500).delay(500).fadeOut(500);
                    }
                }, function (result) {
                    $("#preloader").css("display", "none");
                    ////console.log(result);
                });
        }
    }

    function showMyModal(selected) {

        UtilService.clearFile();

        vm.hideModalFormFillButton = false;
        vm.FileNames = [];
        vm.selected = selected;

        vm.IEData = [];
        vm.RRData = [];
        vm.taxBill = [];
        vm.othersData = [];

        if (vm.selected == 0) {

            $scope.uploadFileLabel = 'Upload File(s)';
            $scope.formFillLabel = 'Fill Form';
            $scope.modalHeading = 'Income Expense Statement(s) or enter data manually';

        } else if (vm.selected == 1) {

            $scope.uploadFileLabel = 'Upload File(s)';
            $scope.formFillLabel = 'Fill Form';
            $scope.modalHeading = 'Rent Roll Report(s) or enter data manually';

        } else if (vm.selected == 3) {

            $scope.uploadFileLabel = 'Upload File(s)';
            $scope.formFillLabel = 'Fill Form';
            $scope.modalHeading = 'Tax Bill(s) or enter data manually';

            // vm.hideModalFormFillButton = true;
        } else if (vm.selected == 4) {

            $scope.uploadFileLabel = 'Upload File(s)';
            vm.hideModalFormFillButton = true;
            $scope.modalHeading = 'More File(s)';

        }

        $('#myModal').modal('toggle');
    }

    $scope.fileUploaded = function (files) {

        var files = document.getElementById('file-1').files;
        vm.FileNames = [];


        if (vm.selected == 0) { //IE
            vm.IEData = files;
            for (var i = 0; i < files.length; i++) {
                vm.FileNames.push({
                    name: files[i].name,
                    uploadStatus: true
                });
            }
        } else if (vm.selected == 1) { //RR
            vm.RRData = files;
            for (var i = 0; i < files.length; i++) {
                vm.FileNames.push({
                    name: files[i].name,
                    uploadStatus: true
                });
            }
        } else if (vm.selected == 3) { // TaxBills
            vm.taxBill = files;
            for (var i = 0; i < files.length; i++) {
                vm.FileNames.push({
                    name: files[i].name,
                    description: '',
                    uploadStatus: true
                });
            }
        } else if (vm.selected == 4) { // others
            vm.othersData = files;
            for (var i = 0; i < files.length; i++) {
                vm.FileNames.push({
                    name: files[i].name,
                    description: '',
                    uploadStatus: true
                });
            }
        }
        // Parsing is done. Update UI.
        $scope.$apply();
    }


}