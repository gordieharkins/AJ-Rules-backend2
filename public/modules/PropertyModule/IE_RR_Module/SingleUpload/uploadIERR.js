'use strict';

_uploadIERR.$inject = ["$stateParams", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _uploadIERR;

//angular.module('AOTC').controller('uploadIERR', _uploadIERR
//    );
function _uploadIERR($stateParams, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    ////////console.log("UploadIERR controller", $stateParams.property);

    var vm = this;
    vm.showIEFile = false;
    vm.showRRFile = false;
    vm.IEFileName = "";
    vm.RRFileName = "";
    vm.sendData = sendData;

    vm.propertyId = "";
    vm.property = {};

    vm.RRFileUploadStatus = false;
    vm.IEFileUploadStatus = false;

    vm.IERR_Result = {
        IEData: null,
        RRData: null
    };

    if ($stateParams.property) {
        localStorage.setItem('SelectedProperty', angular.toJson($stateParams.property));
        vm.property = $stateParams.property;
        vm.propertyId = $stateParams.property.prop._id;
    } else {
        vm.property = JSON.parse(localStorage.getItem('SelectedProperty'));
        vm.propertyId = vm.property.prop._id;
    }

    //////console.log(vm.property);


    function sendData() {

        if (vm.showRRFile) {
            //////console.log('rr data')
            sendRRData();
        }
        if (vm.showIEFile) {
            //////console.log('ie data')

            sendIEData();
        }
    }

    function sendRRData() {

        var url = '/rentRolls/addPropertyRR?propId=' + vm.propertyId;
        $("#preloader").css("display", "block");
        //////console.log("==>", url);
        //////console.log("vm.RRData==>", vm.RRData);

        ///========================================================/ //

        AOTCService.uploadFiles(url, vm.RRData)
            .then(function (result) {
                //////console.log(result);
                vm.IERR_Result.RRData = result.data;

                if (vm.RRData && vm.IEData) {
                    //////console.log('wait');
                    vm.RRFileUploadStatus = true;
                    if (vm.IEFileUploadStatus) {
                        checkResult();
                    }

                } else {
                    //////console.log('dont wait');
                    checkResult();
                }

            }, function (result) {
                $("#preloader").css("display", "none");
                //////console.log(result);
            });

    }

    function sendIEData() {
        $("#preloader").css("display", "block");
        var url = '/incomeExpenses/addPropertyIE?propId=' + vm.propertyId;
        //////console.log("==>", url);
        //////console.log("vm.IEData==>", vm.IEData);

        ///========================================================/ //

        AOTCService.uploadFiles(url, vm.IEData)
            .then(function (result) {
                //////console.log("sendIEData result");

                //////console.log(result);
                vm.IERR_Result.IEData = result.data;

                if (vm.RRData && vm.IEData) {
                    vm.IEFileUploadStatus = true;
                    if (vm.RRFileUploadStatus) {
                        checkResult();
                    }

                } else {
                    checkResult();
                }

            }, function (result) {
                $("#preloader").css("display", "none");
                //////console.log(result);
            });

    }

    function checkResult() {

        //////console.log(vm.IERR_Result);

        if (vm.IERR_Result.IEData && vm.IERR_Result.RRData) {
            //////console.log('IE RR Both Data checking');
            var IE_Result = vm.IERR_Result.IEData;
            var RR_Result = vm.IERR_Result.RRData;


            if (IE_Result.success == true && IE_Result.result && IE_Result.result.length == 0 &&
                RR_Result.success == true && RR_Result.result.length == 0) {
                //////console.log('every thing successfull and length is zero');
                $state.go('listProperties', { messageFrom: "uploadIERR" });

            } else {
                //show un parsed files in result
                //////console.log('show un parsed files');
                for (var i = 0; i < vm.IEFileNames.length; i++) {
                    var RRFile = vm.IEFileNames[i].name;
                    for (var k = 0; k < IE_Result.result.length; k++) {
                        if (RRFile == IE_Result.result[k]) {
                            vm.IEFileNames[i].uploadStatus = false;
                        }
                    }
                }

                for (var i = 0; i < vm.RRFileNames.length; i++) {
                    var RRFile = vm.RRFileNames[i].name;
                    for (var k = 0; k < RR_Result.result.length; k++) {
                        if (RRFile == RR_Result.result[k]) {
                            vm.RRFileNames[i].uploadStatus = false;
                        }
                    }
                }

                //////console.log(vm.RRFileNames);

                //////console.log(vm.IEFileNames);
                $("#preloader").css("display", "none");
                $(".dangerr").fadeIn(1500).delay(500).fadeOut(500);





            }


        } else if (vm.IERR_Result.IEData) {

            //////console.log('IE Data checking');
            var IE_Result = vm.IERR_Result.IEData;
            //////console.log(IE_Result)
            if (IE_Result.result == null) {
                IE_Result.result = [];
            }

            if (IE_Result.success == true && IE_Result.result.length == 0) {
                //////console.log('every thing successfull and length is zero');
                $state.go('listProperties', { messageFrom: "uploadIERR" });

            } else {
                //show un parsed files in result
                //////console.log('show un parsed files in result key');
                //////console.log("vm.IEFileNames");
                //////console.log(vm.IEFileNames);

                for (var i = 0; i < vm.IEFileNames.length; i++) {
                    var RRFile = vm.IEFileNames[i].name;
                    for (var k = 0; k < IE_Result.result.length; k++) {
                        if (RRFile == IE_Result.result[k]) {
                            vm.IEFileNames[i].uploadStatus = false;
                        }
                    }
                }
                $("#preloader").css("display", "none");
                $(".dangerr").fadeIn(1500).delay(500).fadeOut(500);

            }
        } else if (vm.IERR_Result.RRData) {
            //////console.log('RR Data checking');
            var RR_Result = vm.IERR_Result.RRData;
            //////console.log(RR_Result)

            if (RR_Result.success == true && RR_Result.result && RR_Result.result.length == 0) {
                //////console.log('every thing successfull and length is zero');
                $state.go('listProperties', { messageFrom: "uploadIERR" });

            } else {
                //show un parsed files in reult
                //////console.log('show un parsed files in result key');
                //////console.log("vm.RRFileNames");
                //////console.log(vm.RRFileNames);


                for (var i = 0; i < vm.RRFileNames.length; i++) {
                    var RRFile = vm.RRFileNames[i].name;
                    for (var k = 0; k < RR_Result.result.length; k++) {
                        if (RRFile == RR_Result.result[k]) {
                            vm.RRFileNames[i].uploadStatus = false;
                        }
                    }
                }
                // //////console.log(vm.RRFileNames);


                $("#preloader").css("display", "none");
                $(".dangerr").fadeIn(1500).delay(500).fadeOut(500);

            }

        }

    }

    vm.IEFileNames = [];
    vm.RRFileNames = [];

    $scope.IEfileUploaded = function () {


        // //////console.log(vm.IEFileNames)

    }

    vm.removeIEFile = removeIEFile;

    function removeIEFile(file) {
        // //////console.log(vm.IEFileNames);

        // for (var i = 0; i < vm.IEFileNames.length; i++) {
        //     var obj = vm.IEFileNames[i];
        //     if(obj.name == file.name){
        //         vm.IEFileNames.splice(i,1)
        //     }
        // }
    }


    $scope.RRfileUploaded = function () {

        //////console.log('RRfileUploaded used');
        vm.RRFileNames = [];




        var files = document.getElementById('file-rr').files;
        vm.RRData = files;

        //////console.log(files);
        // vm.RRFileName = file.name;
        for (var i = 0; i < files.length; i++) {
            vm.RRFileNames.push({
                name: files[i].name,
                uploadStatus: true
            });
        }

        vm.showRRFile = true;

        // Parsing is done. Update UI.
        // $scope.parsingComplete = true;
        $scope.$digest();

    }

}

