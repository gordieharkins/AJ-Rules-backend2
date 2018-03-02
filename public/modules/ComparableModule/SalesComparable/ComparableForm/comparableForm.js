'use strict';

_CreateComparablesForm.$inject = ["$stateParams", "$anchorScroll", "sharedService", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _CreateComparablesForm;


//angular.module('AOTC').controller('CreateComparablesForm', _CreateComparablesForm
//    );

function _CreateComparablesForm($stateParams, $anchorScroll, sharedService, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    ////console.log("updateIERR CreateComparablesForm", $stateParams);
    var vm = this;
    // $('#successModal').modal('close');
    $('#preloader').css('display', 'none');
    vm.submitManualData = submitManualData;
    vm.property = JSON.parse(localStorage.getItem('propertyDetails'));
    ////console.log("vm.property in manualIE: ", vm.property)

    vm.formData = {

    };
    vm.PrinciplePropData = JSON.parse(localStorage.getItem('principalForm'));
    ////console.log("key" + vm.PrinciplePropData);

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


    function submitManualData() {

        $("#preloader").css("display", "block");
        ////console.log('appeal')

        vm.formData.compScore = vm.formData.compScore;
        vm.formData.taxAssessment = vm.formData.taxAssessment.toString();
        vm.formData.percentile = vm.formData.percentileValue.toString();
        vm.formData.rentLastUpdate = vm.formData.rentLastUpdate.toString();
        vm.formData.rentValueChangeDuration = vm.formData.rentValueChangeDuration.toString();
        vm.formData.taxAssessmentYear = vm.formData.taxAssessmentYear.toString();
        vm.formData.rentValueChange = vm.formData.rentValueChange.toString();
        vm.formData.finishedSqFt = vm.formData.finishedSqFt.toString();
        vm.formData.lastUpdate = vm.formData.lastUpdate.toString();
        vm.formData.rentAmount = vm.PrinciplePropData.rentEstimate.toString();
        vm.formData.amount = vm.PrinciplePropData.zEstimate.toString();
        vm.formData.valueChange = vm.PrinciplePropData.valueChange.toString();
        vm.formData.valueChangeDuration = vm.PrinciplePropData.valueChangeDuration.toString();
        vm.formData.valuationRangeHigh = vm.PrinciplePropData.valuationRangeHigh.toString();
        vm.formData.valuationRangeLow = vm.PrinciplePropData.valuationRangeLow.toString();
        vm.formData.lotSizeSqFt = vm.PrinciplePropData.lotSizeSf.toString();
        vm.formData.lastSoldDate = vm.PrinciplePropData.lastSoldDate.toString();
        vm.formData.lastSoldPrice = vm.PrinciplePropData.lastSoldPrice.toString();
        vm.formData.yearBuilt = vm.PrinciplePropData.yearBuilt.toString();
        vm.formData.imageFileName = vm.PrinciplePropData.imageFileName
        vm.PrinciplePropData.imageFileName = ''
        vm.PrinciplePropData.valueChangeDuration = vm.formData.valueChangeDuration;
        vm.PrinciplePropData.rentValueChangeDuration = vm.formData.rentValueChangeDuration;
        vm.PrinciplePropData.valueChangeDuration = vm.formData.valueChangeDuration;




        var data = {}
        data.principal = []
        data.comps = []
        data.principal.push(vm.PrinciplePropData)
        data.comps.push(vm.formData)
        data.propId = localStorage.getItem("propertyId");
        ////console.log(data);
        var url = 'salesComps/addCompsToPropManual';
        AOTCService.postDataToServer(url, data)
            .then(function (result) {
                ////console.log("CompForm: ", result);
                if (result.data.success) {
                    $scope.$emit('success', result.data.message);
                    $scope.compForm.$setPristine();
                    $scope.compForm.$setUntouched();
                    $('#successModal').modal('toggle'); // Success Model
                    // $state.go('TaskManager');
                } else {
                    $scope.$emit('danger', result.data.message);
                }
                $("#preloader").css("display", "none");

            }, function (result) {
                //////console.log(result);
                $("#preloader").css("display", "none");
            });


        /* var url2 = 'salesComps/addCompsImageManual';
         AOTCService.postDataToServer(url,image)
             .then(function(result) {
                 ////console.log("Po: ",result);
 
                     // $state.go('TaskManager');
 
             }, function(result) {
                 //////console.log(result);
 
             });
 
 
 |*/

        //call to server
        //
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
    angular.element(document).ready(function () {
        $("#myModal").modal('show');
        
        });



}
