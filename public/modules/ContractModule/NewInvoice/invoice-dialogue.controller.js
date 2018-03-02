'use strict';
angular.module('AOTC').controller('InvoiceDialogueController', function ($scope, $stateParams, $state, NewInvoiceService, $uibModalInstance) {
    //console.log("NewInvoice");

    //Local Variables
    var $ctrl = this;

    //Bindable Members


    //Function Definitions



    $scope.invoiceSpreadsheet = {
        original_value: 4000000,
        preappeal_value: 5837000,
        assessor_value: 5593800,
        board_value: 3388700,
        market_pre_appeal: 5837000,
        market_level1: 5593800,
        market_level2: 3388700,
        tax_rate: 1.2903,
        taxowed_pre_appeal: 0,
        taxowed_assessor: 0,
        taxowed_board: 0,
        tax_savings_level1: 0,
        tax_savings_level2: 0,
        fee_percentage: 25,
        fee_owed: 0,
        tax_due_date: ''
    };

    $scope.netBill = {
        tax_bill: 0,
        less_solid_waste: 0,
        water_quality: 0,
        net_bill: 0
    }

    $scope.calculatenetBill = function() {
        $scope.netBill.net_bill = '$' + ($scope.netBill.tax_bill - $scope.netBill.less_solid_waste - $scope.netBill.water_quality);
    }

    $scope.saveInvoice = function() {

        //console.log('before');
        //console.log($scope.invoiceSpreadsheet);

        $scope.invoiceSpreadsheet.original_value = parseFloat($scope.invoiceSpreadsheet.original_value.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.preappeal_value = parseFloat($scope.invoiceSpreadsheet.preappeal_value.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.assessor_value = parseFloat($scope.invoiceSpreadsheet.assessor_value.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.board_value = parseFloat($scope.invoiceSpreadsheet.board_value.toString().match(/\d/g).join(""));

        $scope.invoiceSpreadsheet.market_pre_appeal = $scope.invoiceSpreadsheet.preappeal_value;
        $scope.invoiceSpreadsheet.market_level1 = $scope.invoiceSpreadsheet.assessor_value;
        $scope.invoiceSpreadsheet.market_level2 = $scope.invoiceSpreadsheet.board_value;

        $scope.invoiceSpreadsheet.tax_rate = parseFloat($scope.invoiceSpreadsheet.tax_rate.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.taxowed_pre_appeal = parseFloat($scope.invoiceSpreadsheet.taxowed_pre_appeal.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.taxowed_assessor = parseFloat($scope.invoiceSpreadsheet.taxowed_assessor.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.taxowed_board = parseFloat($scope.invoiceSpreadsheet.taxowed_board.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.tax_savings_level1 = parseFloat($scope.invoiceSpreadsheet.tax_savings_level1.toString().match(/\d/g).join(""));

        $scope.invoiceSpreadsheet.tax_savings_level2 = parseFloat($scope.invoiceSpreadsheet.tax_savings_level2.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.fee_percentage = parseFloat($scope.invoiceSpreadsheet.fee_percentage.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.fee_owed = parseFloat($scope.invoiceSpreadsheet.fee_owed.toString().match(/\d/g).join(""));



        $scope.invoiceSpreadsheet.tax_bill = parseFloat($scope.netBill.tax_bill.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.less_solid_waste = parseFloat($scope.netBill.less_solid_waste.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.water_quality = parseFloat($scope.netBill.water_quality.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.net_bill = parseFloat($scope.netBill.net_bill.toString().match(/\d/g).join(""));
        $scope.invoiceSpreadsheet.contractId = parseFloat($stateParams.id);
        //console.log($scope.invoiceSpreadsheet);
        $('#preloader').css('display', 'block');

        NewInvoiceService.saveInvoice($scope.invoiceSpreadsheet)
            .then(function(response) {
                //console.log(response);
                $('#preloader').css('display', 'none');


            }, function(err) {
                $('#preloader').css('display', 'none');

                //console.log(err);

            });

    }

    $scope.calculateSpreadsheet = function() {


        var calculatedValues = calculateSheet(angular.copy($scope.invoiceSpreadsheet));
        $scope.invoiceSpreadsheet = calculatedValues;

        $scope.invoiceSpreadsheet.taxowed_pre_appeal = '$' + parseFloat($scope.invoiceSpreadsheet.taxowed_pre_appeal).toFixed(2);
        $scope.invoiceSpreadsheet.taxowed_assessor = '$' + parseFloat($scope.invoiceSpreadsheet.taxowed_assessor).toFixed(2);
        $scope.invoiceSpreadsheet.taxowed_board = '$' + parseFloat($scope.invoiceSpreadsheet.taxowed_board).toFixed(2);
        $scope.invoiceSpreadsheet.tax_savings_level1 = '$' + parseFloat($scope.invoiceSpreadsheet.tax_savings_level1).toFixed(2);
        $scope.invoiceSpreadsheet.tax_savings_level2 = '$' + parseFloat($scope.invoiceSpreadsheet.tax_savings_level2).toFixed(2);
        $scope.invoiceSpreadsheet.fee_owed = '$' + parseFloat($scope.invoiceSpreadsheet.fee_owed).toFixed(2);
        //console.log(calculatedValues);
    }

    function calculateSheet(invoiceSpreadsheet) {


        invoiceSpreadsheet.taxowed_pre_appeal = invoiceSpreadsheet.preappeal_value * (invoiceSpreadsheet.tax_rate / 100);

        invoiceSpreadsheet.taxowed_assessor = invoiceSpreadsheet.assessor_value * (invoiceSpreadsheet.tax_rate / 100);

        invoiceSpreadsheet.taxowed_board = invoiceSpreadsheet.board_value * (invoiceSpreadsheet.tax_rate / 100) - 0.01;

        invoiceSpreadsheet.tax_savings_level1 = invoiceSpreadsheet.taxowed_pre_appeal - invoiceSpreadsheet.taxowed_assessor;
        invoiceSpreadsheet.tax_savings_level2 = invoiceSpreadsheet.taxowed_assessor - invoiceSpreadsheet.taxowed_board;


        invoiceSpreadsheet.fee_owed = (invoiceSpreadsheet.tax_savings_level1 + invoiceSpreadsheet.tax_savings_level2) * (invoiceSpreadsheet.fee_percentage / 100);


        return invoiceSpreadsheet;
    }

    //Modal Open for a Property

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


});