

angular.module('AOTC').controller('notificationsCtrl', function (newContractService , SavedContractListService , $stateParams, $anchorScroll, sharedService, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {

    //Bindable Members
    $scope.contractList = [];
    $scope.searchText = '';
    //$scope.viewInvoices = function (contract) {
    //    //console.log(contract)
    //    $state.go(
    //        'InvoiceList', { id: contract.id }
    //    );

    //}

    //Starting Logic
    getContracts();

    //Local variables
    var rowData = [];
    var columnDefs = [
        { headerName: "Name", field: "Name", width: 200 },
        { headerName: "Actions", field: "abc", maxWidth: 260, cellRenderer: renderButtons }, //, cellClass: 'padding-normal'
    ];
    function renderButtons(params) {
        try {
            var _TemplateContainer = document.createElement('div');
            var _editBtn = '<button class="btn btn-info edit-btn-grid btn-sm" style="margin-right: 10px; background: rgba(122, 218, 16, 0.82)"' +
                                ' value="' + params.data.id + '"' +
                               ' border: none;    padding: 4px;" data-toggle="tooltip" data-placement="right" title="Edit details">' +
                              '  <i class="fa  fa-pencil fa-lg"></i> </button>';
            var _viewBtn = '<button class="btn btn-info view-btn-grid btn-sm" style="margin-right: 10px; background: #3be4ff"' +
                                ' value="' + params.data.Name + '"' +
                               ' border: none;    padding: 4px;" data-toggle="tooltip" data-placement="right" title="View details">' +
                              '  <i class="fa  fa-eye fa-lg"></i> </button>';
            var _invoiceBtn = '<button class="btn btn-info invoice-btn-grid btn-sm" style="margin-right: 10px; background: rgb(255, 118, 0)"' +
                                ' value="' + params.data.id + '"' +
                               ' border: none;    padding: 4px;" data-toggle="tooltip" data-placement="right" title="Create Invoice">' +
                              '  <i class="fa  fa-list-alt fa-lg"></i> </button>';

            var _btns = '<span style="display:block; text-align:center;">' + _viewBtn + _editBtn + _invoiceBtn + '</span>';
            _TemplateContainer.innerHTML = _btns;
            //Add Listeners
            var _editBtnTag = _TemplateContainer.querySelector('.edit-btn-grid');
            var _viewBtnTag = _TemplateContainer.querySelector('.view-btn-grid');
            var _invoiceBtnTag = _TemplateContainer.querySelector('.invoice-btn-grid');

            _viewBtnTag.addEventListener('click', function (event) {
                //var _selected = event.currentTarget.value;
                $state.go('Events', { "jurisdiction": event.currentTarget.value });
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

        var url = 'timeline/getJurisdictions';
        AOTCService.getDataFromServer(url)
            .then(function (result) {
                ////console.log("CompForm: ", result);
                if (result.data.success) {
                    var response = result.data;
                    var _array = [];
                    for (var i = 0; i < response.result.length; i++) {
                        _array.push({
                            id: response.result[i].jurisdiction._id,
                            Name: response.result[i].jurisdiction.properties.name
                        })
                    }
                    gridOptions.rowData = _array;
                    //save data to fetch later
                    newContractService.saveContractData(response.result);

                    //show ag-grid
                    $timeout(function () {
                        var gridDiv = document.querySelector('#myGridContracts');
                        new agGrid.Grid(gridDiv, gridOptions);
                        gridOptions.api.sizeColumnsToFit()
                    });
                } else {
                    $scope.$emit('danger', result.data.message);
                }
                $("#preloader").css("display", "none");

            }, function (result) {
                ////console.log(result);
                $("#preloader").css("display", "none");
            });

    };

});