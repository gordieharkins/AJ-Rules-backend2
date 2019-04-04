

//var agGrid = require('agGrid');
_NewInvoice.$inject = ["$scope", "$stateParams", "$state", "NewInvoiceService", "$uibModal", "$timeout", "$filter"];
module.exports = _NewInvoice;

agGrid.initialiseAgGridWithAngular1(angular);
//angular.module('AOTC').controller('NewInvoice', _NewInvoice
//    );
function _NewInvoice($scope, $stateParams, $state, NewInvoiceService, $uibModal, $timeout, $filter) {
    ////////console.log("NewInvoice");

    //Local Variables
    var $ctrl = this;

    //Ag Grid
    var columnDefs = [
        { headerName: "Original Base Value before Re-Assessment", field: "originalValue", width: 110, cellRenderer: numberFormatter, cellClass: 'right-align-text' },
        { headerName: "New Value as of Re-Assessment (Pre-Appeal)", field: "newValue", width: 110, cellRenderer: numberFormatter, cellClass: 'right-align-text' },
        { headerName: "Value post Level 1 Appeal (Assessor Appeal)", field: "postLevel1", width: 110, cellRenderer: numberFormatter, cellClass: 'right-align-text' },
        { headerName: "Value post Level 2 Appeal (Board Appeal)", field: "postLevel2", width: 110, cellRenderer: numberFormatter, cellClass: 'right-align-text' },
        { headerName: "Tax Rate", field: "taxRate", width: 80, cellRenderer: numberFormatter, cellClass: 'right-align-text', cellClass: 'right-align-text' },
        { headerName: "Fee %", field: "feePercent", width: 80, cellClass: 'right-align-text' },
        { headerName: "Tax Bill Due Date", field: "taxBillDate", width: 100 },
        //summation fields
        { headerName: "Tax Bill", field: "taxBill", width: 110, cellRenderer: numberFormatter , cellClass: 'right-align-text' },
        { headerName: "Less Solid Waste", field: "lessSolidWaste", width: 100, cellRenderer: numberFormatter , cellClass: 'right-align-text' },
        { headerName: "Water Quality Protect Chg", field: "waterQuality", width: 100, cellRenderer: numberFormatter , cellClass: 'right-align-text' },
        { headerName: "Net Bill", field: "netBill", width: 110, cellClass: 'right-align-text' },
        //table fields
        { headerName: "Taxes Owed (Pre-Appeal)", field: "taxPreAppeal", width: 100, cellRenderer: numberFormatter , cellClass: 'right-align-text' },
        { headerName: "Taxes Owed (Post Level 1 (Assessor))", field: "taxLevel1", width: 100, cellRenderer: numberFormatter , cellClass: 'right-align-text' },
        { headerName: "Taxes Owed (Post Level 1 (Board))", field: "taxLevel2", width: 100, cellRenderer: numberFormatter , cellClass: 'right-align-text' },
        { headerName: "Tax Savings (Level 1)", field: "taxSavingLevel1", width: 100, cellRenderer: numberFormatter , cellClass: 'right-align-text' },
        { headerName: "Tax Savings (Level 2)", field: "taxSavingLevel2", width: 100, cellRenderer: numberFormatter , cellClass: 'right-align-text' },
        { headerName: "Fee Owed", field: "feeOwed", width: 100, cellRenderer: numberFormatter , cellClass: 'right-align-text' }
    ];
    var rowData = [];

    var gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        headerHeight: 60,
        suppressCellSelection: true,
        enableColResize: true,
    };


    //Bindable Members
    $ctrl.invoiceData = {
        master: {},
        details: []
    };
    $ctrl.singlePropertyData = {};
    //$ctrl.openInvoice = openInvoice;
    $ctrl.toggleView = toggleView;
    $ctrl.showGrid = true;
    $ctrl.totalItems = 0;
    $ctrl.pageSize = 1;
    $ctrl.currentPage = 1;
    $ctrl.pageChanged = function (page) {
        page = page || $ctrl.currentPage || 1;
        $ctrl.currentPage = page || 1;
        getPaginationData($ctrl.invoiceData.details, page);
    };

    //Starting Logic
    var getData = function () {
        var _data = {
            "propIds": [24497, 24498],
            "year": 2017,
            "contractId": 29744
        };
        $('#preloader').css('display', 'block');
        NewInvoiceService.getInvoiceByContractId(_data).then(function (_res) {
            $('#preloader').css('display', 'none');
            try {
                $ctrl.invoiceData = _res.result;
                getPaginationData($ctrl.invoiceData.details, 1);
                $ctrl.singlePropertyData = $ctrl.invoiceData.details[0];
                $ctrl.totalItems = $ctrl.invoiceData.details.length;
                gridOptions.rowData = $ctrl.invoiceData.details;
                $timeout(function () {
                    var gridDiv = document.querySelector('#myGrid');
                    new agGrid.Grid(gridDiv, gridOptions);
                });
            }
            catch (_e) {
            }

        });
    }();




    // Function Definitions
    function numberFormatter(params) {
        return '$'+ $filter('number')(params.value, 1);
    }

    function getPaginationData(_data, _page) {
        $ctrl.singlePropertyData = _data[_page - 1];
        $ctrl.PageStartCount = ((parseInt(_page) - 1) * parseInt(1)) + 1;
        $ctrl.PageEndCount = ($ctrl.PageStartCount + _data.length) - 1;
    };

    function toggleView(_type) {
        try {
            switch (_type) {
                case 'detail':
                    $ctrl.showGrid = false;

                    break;
                case 'grid':
                    $ctrl.showGrid = true;
                    $timeout(function () {
                        var gridDiv = document.querySelector('#myGrid');
                        new agGrid.Grid(gridDiv, gridOptions);
                    });
                    break;

            }
        }
        catch (_e) { }
    };

    
    ////Modal Open for a Property
    //function openInvoice(size, parentSelector) {
    //    var modalInstance = $uibModal.open({
    //        animation: true,
    //        templateUrl: 'modules/ContractModule/NewInvoice/invoice-dialogue.html',
    //        controller: 'InvoiceDialogueController',
    //        backdrop: 'static',
    //        controllerAs: '$ctrl',
    //        size: 'lg',
    //        resolve: {
    //        }
    //    });

    //    modalInstance.result.then(function (selectedItem) {
    //    }, function () {
    //    });
    //};

    //$scope.invoiceSpreadsheet = {
    //    original_value: 4000000,
    //    preappeal_value: 5837000,
    //    assessor_value: 5593800,
    //    board_value: 3388700,
    //    market_pre_appeal: 5837000,
    //    market_level1: 5593800,
    //    market_level2: 3388700,
    //    tax_rate: 1.2903,
    //    taxowed_pre_appeal: 0,
    //    taxowed_assessor: 0,
    //    taxowed_board: 0,
    //    tax_savings_level1: 0,
    //    tax_savings_level2: 0,
    //    fee_percentage: 25,
    //    fee_owed: 0,
    //    tax_due_date: ''
    //};

    //$scope.netBill = {
    //    tax_bill: 0,
    //    less_solid_waste: 0,
    //    water_quality: 0,
    //    net_bill: 0
    //}

    //$scope.calculatenetBill = function () {
    //    $scope.netBill.net_bill = '$' + ($scope.netBill.tax_bill - $scope.netBill.less_solid_waste - $scope.netBill.water_quality);
    //}

    //$scope.saveInvoice = function () {

    //    ////console.log('before');
    //    ////console.log($scope.invoiceSpreadsheet);

    //    $scope.invoiceSpreadsheet.original_value = parseFloat($scope.invoiceSpreadsheet.original_value.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.preappeal_value = parseFloat($scope.invoiceSpreadsheet.preappeal_value.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.assessor_value = parseFloat($scope.invoiceSpreadsheet.assessor_value.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.board_value = parseFloat($scope.invoiceSpreadsheet.board_value.toString().match(/\d/g).join(""));

    //    $scope.invoiceSpreadsheet.market_pre_appeal = $scope.invoiceSpreadsheet.preappeal_value;
    //    $scope.invoiceSpreadsheet.market_level1 = $scope.invoiceSpreadsheet.assessor_value;
    //    $scope.invoiceSpreadsheet.market_level2 = $scope.invoiceSpreadsheet.board_value;

    //    $scope.invoiceSpreadsheet.tax_rate = parseFloat($scope.invoiceSpreadsheet.tax_rate.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.taxowed_pre_appeal = parseFloat($scope.invoiceSpreadsheet.taxowed_pre_appeal.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.taxowed_assessor = parseFloat($scope.invoiceSpreadsheet.taxowed_assessor.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.taxowed_board = parseFloat($scope.invoiceSpreadsheet.taxowed_board.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.tax_savings_level1 = parseFloat($scope.invoiceSpreadsheet.tax_savings_level1.toString().match(/\d/g).join(""));

    //    $scope.invoiceSpreadsheet.tax_savings_level2 = parseFloat($scope.invoiceSpreadsheet.tax_savings_level2.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.fee_percentage = parseFloat($scope.invoiceSpreadsheet.fee_percentage.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.fee_owed = parseFloat($scope.invoiceSpreadsheet.fee_owed.toString().match(/\d/g).join(""));



    //    $scope.invoiceSpreadsheet.tax_bill = parseFloat($scope.netBill.tax_bill.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.less_solid_waste = parseFloat($scope.netBill.less_solid_waste.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.water_quality = parseFloat($scope.netBill.water_quality.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.net_bill = parseFloat($scope.netBill.net_bill.toString().match(/\d/g).join(""));
    //    $scope.invoiceSpreadsheet.contractId = parseFloat($stateParams.id);
    //    ////console.log($scope.invoiceSpreadsheet);
    //    $('#preloader').css('display', 'block');

    //    NewInvoiceService.saveInvoice($scope.invoiceSpreadsheet)
    //        .then(function (response) {
    //            ////console.log(response);
    //            $('#preloader').css('display', 'none');


    //        }, function (err) {
    //            $('#preloader').css('display', 'none');

    //            ////console.log(err);

    //        });

    //}

    //$scope.calculateSpreadsheet = function () {


    //    var calculatedValues = calculateSheet(angular.copy($scope.invoiceSpreadsheet));
    //    $scope.invoiceSpreadsheet = calculatedValues;

    //    $scope.invoiceSpreadsheet.taxowed_pre_appeal = '$' + parseFloat($scope.invoiceSpreadsheet.taxowed_pre_appeal).toFixed(2);
    //    $scope.invoiceSpreadsheet.taxowed_assessor = '$' + parseFloat($scope.invoiceSpreadsheet.taxowed_assessor).toFixed(2);
    //    $scope.invoiceSpreadsheet.taxowed_board = '$' + parseFloat($scope.invoiceSpreadsheet.taxowed_board).toFixed(2);
    //    $scope.invoiceSpreadsheet.tax_savings_level1 = '$' + parseFloat($scope.invoiceSpreadsheet.tax_savings_level1).toFixed(2);
    //    $scope.invoiceSpreadsheet.tax_savings_level2 = '$' + parseFloat($scope.invoiceSpreadsheet.tax_savings_level2).toFixed(2);
    //    $scope.invoiceSpreadsheet.fee_owed = '$' + parseFloat($scope.invoiceSpreadsheet.fee_owed).toFixed(2);
    //    ////console.log(calculatedValues);
    //}

    //function calculateSheet(invoiceSpreadsheet) {


    //    invoiceSpreadsheet.taxowed_pre_appeal = invoiceSpreadsheet.preappeal_value * (invoiceSpreadsheet.tax_rate / 100);

    //    invoiceSpreadsheet.taxowed_assessor = invoiceSpreadsheet.assessor_value * (invoiceSpreadsheet.tax_rate / 100);

    //    invoiceSpreadsheet.taxowed_board = invoiceSpreadsheet.board_value * (invoiceSpreadsheet.tax_rate / 100) - 0.01;

    //    invoiceSpreadsheet.tax_savings_level1 = invoiceSpreadsheet.taxowed_pre_appeal - invoiceSpreadsheet.taxowed_assessor;
    //    invoiceSpreadsheet.tax_savings_level2 = invoiceSpreadsheet.taxowed_assessor - invoiceSpreadsheet.taxowed_board;


    //    invoiceSpreadsheet.fee_owed = (invoiceSpreadsheet.tax_savings_level1 + invoiceSpreadsheet.tax_savings_level2) * (invoiceSpreadsheet.fee_percentage / 100);


    //    return invoiceSpreadsheet;
    //}


}