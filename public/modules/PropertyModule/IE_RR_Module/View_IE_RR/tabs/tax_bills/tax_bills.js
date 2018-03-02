'use strict';

_tax_bills.$inject = ["$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _tax_bills;

//angular.module('AOTC').controller('tax_bills', _tax_bills
//    );
function _tax_bills($location, $scope, $http, __env, $log, AOTCService, $timeout) {
    ////console.log("tax_bills controller");

    var vm = this;

    vm.propertiesCount = localStorage.getItem('propertiesCount');
    vm.propertyId = JSON.parse(localStorage.getItem('propertyId'));
    vm.unlinkTaxBill = unlinkTaxBill;
    vm.deleteTaxBill = deleteTaxBill;
    vm.myModelCheck = myModelCheck;
    vm.modelMessage={
        title:"",
        message:""
    };
    vm.taxBillIds = [];
    vm.selection = -1;

    getTaxBills();

    function unlinkTaxBill(TaxBills) {
        vm.modelMessage.title = 'Unlink '+TaxBills.taxBills.properties.fileName;
        vm.modelMessage.message = 'Are you sure to unlink file from this property?';
        vm.selection = 1;
        vm.taxBillIds.push(TaxBills.taxBills._id);
    }

    function deleteTaxBill(TaxBills) {
        vm.modelMessage.title = 'Delete '+TaxBills.taxBills.properties.fileName;
        vm.modelMessage.message = 'Are you sure to delete file from this property?';
        vm.selection = 0;
        vm.taxBillIds.push(TaxBills.taxBills._id);
    }

    function myModelCheck(){
        if(vm.selection === 1){

            unlinkTaxBills();
        } else if(vm.selection === 0){

            deleteTaxBills();
        }
        vm.selection = -1;
    }

    // get taxBills
    function getTaxBills() {
        var _data = {propId:vm.propertyId };
        var url = '/taxBills/getTaxBills';
        $("#preloader").css("display", "block");

        AOTCService.postDataToServer(url, _data).then(function(result) {

            ////console.log("getTaxBills: ", result);

            var serverData = result.data;

            if (serverData.success) {

                vm.tableData = serverData.result;

                $("#preloader").css("display", "none");

                setTimeout(function() {
                    $('[data-tooltip="tooltip"]').tooltip();
                }, 100);
            }
        }, function(result) {
            //some error
            ////console.log(result);
            $("#preloader").css("display", "none");
        });
    }

    // Unlink taxBill call
    function unlinkTaxBills() {

        var url = '/taxBills/unlinkTaxBillsById';

        $("#preloader").css("display", "block");

        vm.data = {
            propId:parseInt(localStorage.getItem('propertyId')),
            taxBillIds:vm.taxBillIds
        };

        AOTCService.postDataToServer(url, vm.data).then(function(result) {
            ////console.log(result);

            if (result.data.success) {
                $scope.$emit('success',result.data.message);
                getTaxBills();
            } else {
                $scope.$emit('error',result.data.message);
            }
            vm.taxBillIds = [];

            $("#preloader").css("display", "none");
        }, function(result) {
            $("#preloader").css("display", "none");
            $scope.$emit('error',result.data.message);
        });
    }

    // Delete taxBill call
    function deleteTaxBills() {

        var url = '/taxBills/deleteTaxBillsById';

        $("#preloader").css("display", "block");

        vm.data = {
            taxBillIds:vm.taxBillIds
        };

        AOTCService.postDataToServer(url, vm.data).then(function(result) {
            ////console.log(result);
            
            if (result.data.success) {
                $scope.$emit('success',result.data.message);
                getTaxBills();
            } else{
                $scope.$emit('error',result.data.message);
            }
            vm.taxBillIds = [];

            $("#preloader").css("display", "none");
        }, function(result) {
            $("#preloader").css("display", "none");
            $scope.$emit('error',result.data.message);
        });
    }
}
