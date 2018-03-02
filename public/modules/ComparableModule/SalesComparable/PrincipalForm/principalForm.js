'use strict';

_CreatePrincipalForm.$inject = ["$stateParams", "$anchorScroll", "sharedService", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _CreatePrincipalForm;

//angular.module('AOTC').controller('CreatePrincipalForm', _CreatePrincipalForm
//   )
//    .directive("fileinput", [_fileinput
//    ])
//    .directive("ngImageSelect",_ngImageSelect);

function _CreatePrincipalForm($stateParams, $anchorScroll,sharedService, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {

    $scope.imagePath = '';
    $scope.isSubmitting = false
    $scope.showComps = false;
    $scope.uploadPic = function (file) {
        ////console.log('submit' + file)

        ////console.log(file)
        ////console.log('submit')
        file.upload = Upload.upload({
            url: 'salesComps/addCompsImageManual',
            data: { file: file },
        });

        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
                $scope.isSubmitting = true;
                $scope.imagePath = file.result;
                submitManualData();
                ////console.log(file.result)
            });
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }


    ////console.log("updateIERR PrincipalForm", $stateParams);
    var vm = this;
    // $('#successModal').modal('close');

    vm.submitManualData = submitManualData;
    vm.property = JSON.parse(localStorage.getItem('propertyDetails'));
    ////console.log("vm.property in manualIE: ", vm.property)

    vm.formData = {

    };

    vm.modalYesbutton = modalYesbutton;
    vm.gotoPropertyDetails = gotoPropertyDetails;
    vm.resetForm = resetForm;

    function resetForm() {
        vm.formData = {};
        $scope.compForm.$setPristine();
        $scope.compForm.$setUntouched();

    }

    function gotoPropertyDetails() {
        $('#successModal').modal('hide');
        $state.go('updateIERR');
    }

    function modalYesbutton() {
        ////console.log('reset form');
        vm.formData = {};

        $scope.compForm.$setPristine();
        $scope.compForm.$setUntouched();

        $('#successModal').modal('toggle');

    }
    if (localStorage.getItem('principalForm')) {
        vm.PrinciplePropData = JSON.parse(localStorage.getItem('principalForm'));
        $scope.showComps = true;

    }



    function submitManualData() {


        ////console.log('appeal')
        ////console.log(vm.formData)

        vm.formData.rentAmount = vm.formData.rentEstimate.toString();
        vm.formData.amount = vm.formData.zEstimate.toString();
        vm.formData.valueChange = vm.formData.valueChange.toString();
        vm.formData.valueChangeDuration = vm.formData.valueChangeDuration.toString();
        vm.formData.valuationRangeHigh = vm.formData.valuationRangeHigh.toString();
        vm.formData.valuationRangeLow = vm.formData.valuationRangeLow.toString();
        vm.formData.lotSizeSqFt = vm.formData.lotSizeSf.toString();
        vm.formData.lastSoldDate = vm.formData.lastSoldDate.toString();
        vm.formData.lastSoldPrice = vm.formData.lastSoldPrice.toString();
        vm.formData.yearBuilt = vm.formData.yearBuilt.toString();
        vm.formData.imageFileName = $scope.imagePath
        sharedService.principalForm = vm.formData

        localStorage.setItem('principalForm', angular.toJson(vm.formData));
        $scope.showComps = true;

        vm.PrinciplePropData = JSON.parse(localStorage.getItem('principalForm'));

        $('#myModalquestion').modal('hide');


    }

    $scope.imageUpload = function () {


        $scope.imageSrc = [];
        $('#imageModal').modal('toggle');

        /* for (var i = 0; i < files.length; i++) {
             vm.IEFileNames.push({
                 name: files[i].name,
                 uploadStatus: true
             });
         }*/


    }

    // setTimeout(function() {
    //     vm.formData.baseRent = 2017;
    //     $scope.$apply();
    //     $('#successModal').modal('show');

    // }, 100);











    ///=================================date picker===========================//


    $('#sandbox-container input').datepicker({
        autoclose: true
    });


    $('#sandbox-container input').on('show', function (e) {
        console.debug('show', e.date, $(this).data('stickyDate'));

        if (e.date) {
            $(this).data('stickyDate', e.date);
        } else {
            $(this).data('stickyDate', null);
        }
    });

    $('#sandbox-container input').on('hide', function (e) {
        console.debug('hide', e.date, $(this).data('stickyDate'));
        var stickyDate = $(this).data('stickyDate');

        if (!e.date && stickyDate) {
            console.debug('restore stickyDate', stickyDate);
            $(this).datepicker('setDate', stickyDate);
            $(this).data('stickyDate', null);
        }
    });



}

function _ngImageSelect() {
    return {
        link: function ($scope, el) {
            el.bind("change", function (e) {
                $scope.file = (e.srcElement || e.target).files;
                var ctx = document.getElementById('myCanvas').getContext('2d');
                ctx.clearRect(0, 0, 300, 130);
                var img = new Image();
                img.src = scope.filepreview;
                img.onload = function () {
                    ctx.drawImage(img, 0, 0);

                }

            })
        }
    }
}
function _fileinput() {
    return {
        scope: {
            fileinput: "=",
            filepreview: "=",

        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.fileinput = changeEvent.target.files[0];
                scope.filepreview = '';

                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        ////console.log(scope.fileinput)


                        scope.filepreview = loadEvent.target.result;
                        var ctx = document.getElementById('myCanvas').getContext('2d');
                        ctx.clearRect(0, 0, 300, 130);
                        var img = new Image();
                        img.src = scope.filepreview;
                        img.onload = function () {
                            ctx.drawImage(img, 0, 0);

                        }


                    });
                }
                reader.readAsDataURL(scope.fileinput);
            });
        }
    }
}
