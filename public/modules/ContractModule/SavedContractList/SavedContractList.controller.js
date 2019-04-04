'use strict';

//var agGrid = require('agGrid');
_SavedContractList.$inject = ["$scope", "$location", "$state", "SavedContractListService", "$timeout", "newContractService", "$compile"];
module.exports = _SavedContractList;

agGrid.initialiseAgGridWithAngular1(angular);
//angular.module('AOTC').controller('SavedContractList', _SavedContractList
//    );

function _SavedContractList($scope, $location, $state, SavedContractListService, $timeout, newContractService, $compile) {
    //////console.log("SavedContractList");
    $scope.contractList = [];
    $scope.searchText = '';
    $scope.viewInvoices = function (contract) {
        ////console.log(contract)
        $state.go(
            'InvoiceList', { id: contract.id }
        );

    }

    //Starting Logic
    getContracts();

    //Local variables
    var rowData = [];
    var columnDefs = [
        { headerName: "Contract Name", field: "contractName", width: 200 },
        { headerName: "Creation Date", field: "createdDate", width: 200 },
        { headerName: "Agent Name", field: "agentName", width: 140 },
        { headerName: "Status", field: "status", width: 110 },
        { headerName: "Actions", field: "abc", width: 260, cellRenderer: renderButtons }, //, cellClass: 'padding-normal'
    ];
    function renderButtons(params) {
        try {
            var _TemplateContainer = document.createElement('div');
            var _editBtn = '<button class="btn btn-info edit-btn-grid btn-sm" style="margin-right: 10px; background: rgba(122, 218, 16, 0.82)"' +
                                ' value="' + params.data.id + '"' +
                               ' border: none;    padding: 4px;" data-toggle="tooltip" data-placement="right" title="Edit details">' +
                              '  <i class="fa  fa-pencil fa-lg"></i> </button>';
            var _viewBtn = '<button class="btn btn-info view-btn-grid btn-sm" style="margin-right: 10px; background: #3be4ff"' +
                                ' value="' + params.data.id + '"' +
                               ' border: none;    padding: 4px;" data-toggle="tooltip" data-placement="right" title="View details">' +
                              '  <i class="fa  fa-eye fa-lg"></i> </button>';
            var _invoiceBtn = '<button class="btn btn-info invoice-btn-grid btn-sm" style="margin-right: 10px; background: rgb(255, 118, 0)"' +
                                ' value="' + params.data.id + '"' +
                               ' border: none;    padding: 4px;" data-toggle="tooltip" data-placement="right" title="Create Invoice">' +
                              '  <i class="fa  fa-list-alt fa-lg"></i> </button>';
            switch (params.data.status) {
                case 'NotStarted':
                    var _btns = '<span style="display:block; text-align:center;">' + _viewBtn + _editBtn + _invoiceBtn + '</span>';
                    break;
                case 'InProgress':
                    var _btns = '<span style="display:block; text-align:center;">' + _viewBtn + '</span>';
                    break;
                case 'Complete':
                    var _btns = '<span style="display:block; text-align:center;">' + _viewBtn + _invoiceBtn + '</span>';
                    break;
            }
            _TemplateContainer.innerHTML = _btns;
            //Add Listeners
            var _editBtnTag = _TemplateContainer.querySelector('.edit-btn-grid');
            var _viewBtnTag = _TemplateContainer.querySelector('.view-btn-grid');
            var _invoiceBtnTag = _TemplateContainer.querySelector('.invoice-btn-grid');

            _viewBtnTag.addEventListener('click', function (event) {
                var _selected = event.currentTarget.value;
                $state.go('ViewContract', { id: _selected });
            });
            _editBtnTag.addEventListener('click', function (event) {
                var _selected = event.currentTarget.value;
                $state.go('ViewContract', { id: _selected });
            });
            _invoiceBtnTag.addEventListener('click', function (event) {
                var _selected = event.currentTarget.value;
                $state.go('NewInvoice', { id: 1 });
            });
            return _TemplateContainer;

        }
        catch (_e) { return ""; }

    };

    var gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        headerHeight: 25,
        rowHeight: 40,
        suppressCellSelection: true,
        enableColResize: true
    };

    //Function definition
    function getContracts() {
        $('#preloader').css('display', 'block');

        SavedContractListService.getContracts()
            .then(function (response) {
                $('#preloader').css('display', 'none');
                //copy id to contracts objects
                gridOptions.rowData = addID(response.result);
                //save data to fetch later
                newContractService.saveContractData(response.result);
                //show ag-grid
                $timeout(function () {
                    var gridDiv = document.querySelector('#myGridContracts');
                    new agGrid.Grid(gridDiv, gridOptions);
                    gridOptions.api.sizeColumnsToFit()
                });

            }, function (err) {
                ////console.log(err);
            });
    };

    function addID(_data) {
        var _tempArray = [];
        angular.forEach(_data, function (_item) {
            _item.contracts['id'] = _item.id;
            _tempArray.push(_item.contracts);
        });
        return _tempArray;
    }


}