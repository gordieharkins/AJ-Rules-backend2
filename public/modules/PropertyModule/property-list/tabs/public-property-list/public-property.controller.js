'use strict';

_PublicPropertyCtrl.$inject = ["User_Config", "PublicPropertyService", "$http", "$timeout", "$compile", "$state", "$scope", "$location", "AOTCService"];
module.exports = _PublicPropertyCtrl;

agGrid.initialiseAgGridWithAngular1(angular);
//angular.module('AOTC').controller('PublicPropertyCtrl', _PublicPropertyCtrl
//    );
function _PublicPropertyCtrl(User_Config, PublicPropertyService, $http, $timeout, $compile, $state, $scope, $location, AOTCService) {
    var vm = this;
    vm.userId = localStorage.getItem('userId');

    vm.paginationPageSize = 25;
    vm.pagesInCash = 1;

    vm.showDeleteButton = false;
    vm.showMultiPartAccount = false;
    var serverInProgress = 0;
    $("#preloader").css("display", "none");
    $("#pri-preloader").css("display", "none");

    // vm.moveToMultiAccount = moveToMultiAccount;
    // vm.moveToMultiPart = moveToMultiPart;

    $scope.showInfo = true;
    var columnDefs = [{
            headerName: "Tax Account Number",
            field: "taxAccountNo",
            filterParams: {
                applyButton: true,
                clearButton: true
            },
            cellRenderer: function (params) {
                if (params.data) {
                    if (params.data.relationType == User_Config.MULTI_PART)
                        return params.value + '<i class="fa fa-window-restore fa-lg pull-right my-center" aria-hidden="true"></i> ';
                    else if (params.data.relationType == User_Config.MULTI_ACCOUNT) {
                        return params.value + '<i class="fa fa-puzzle-piece fa-lg pull-right my-center" aria-hidden="true"></i> ';

                    } else {
                        return params.value;
                    }
                } else {
                    return 'No data found';
                }
            }
        }, {
            headerName: "Property Name",
            filterParams: {
                applyButton: true,
                clearButton: true
            },
            field: "propertyName"
        }, {
            headerName: "Property Address",
            filterParams: {
                applyButton: true,
                clearButton: true
            },
            field: "streetName"
        }, {
            headerName: "Owner Name",
            filterParams: {
                applyButton: true,
                clearButton: true
            },
            field: "recordOwnerName"
        }, {
            headerName: "Actions",
            width: 100,
            suppressResize: true,
            cellRenderer: MyCellRenderer,
            suppressFilter: true,
            suppressSorting: true
        }

    ];



    var gridOptions = {
        floatingFilter: true,
        enableServerSideSorting: true,
        enableServerSideFilter: true,
        rowHeight: 40,
        enableColResize: true,
        // rowSelection: 'multiple',
        suppressPaginationPanel: true,
        rowDeselection: false,
        columnDefs: columnDefs,
        rowModelType: 'infinite',
        //paginationOverflowSize: 2,
        maxConcurrentDatasourceRequests: 2,
        infiniteInitialRowCount: 1,
        maxPagesInCache: vm.pagesInCash,
        getRowNodeId: function (item) {
            return item.id;
        },
        onGridReady: function (params) {
            // ////console.log('grid is ready')
            params.api.sizeColumnsToFit();
            // params.api.angularCompileRows = true;

        },
        onSelectionChanged: function (event) {
            // ////console.log('onSelectionChanged event', event);
            var selectedProps = gridOptions.api.getSelectedRows();
            ////console.log('selectedProps', selectedProps);
            ////console.log('server in progress', serverInProgress);
            if (serverInProgress == 1) {
                // gridOptions.api.deselectAll();
            }
            if (selectedProps.length > 0) {
                ////console.log('active delete button')
                vm.showDeleteButton = true;
                decideToShowMultiAccountMultiPart(selectedProps);
                $scope.$apply();
            } else if (serverInProgress == 0) {
                vm.showDeleteButton = false;
                vm.showMultiPartAccount = false;
                $scope.$apply();
            }
        }
    };
    gridOptions.pagination = true;
    gridOptions.paginationPageSize = vm.paginationPageSize;
    gridOptions.infiniteBlockSize = vm.paginationPageSize;

    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    setRowData(1, 5);
    vm.totalItems = 0;
    vm.pageSize = 5;
    vm.currentPage = 1;
    vm.pageChanged = function(page, size) {
      size = size || vm.pageSize || 5;
      page = page || vm.currentPage || 1;
      vm.currentPage = page || 1;
      setRowData(page, size);
    };
    function setRowData(_page, _size) {
        
        var dataSource = {
            rowCount: null, // behave as infinite scroll
            getRows: function (params) {
                serverInProgress = 1;

                $("#pri-preloader").css("display", "block");

                var _url = '/properties/getAJPublicProperties';

                var _data= {
                    "startRow": (_page-1)*_size,
                    "paginationPageSize": _size,
                    "state": null
                };
            
                AOTCService.postDataToServer(_url, _data)
                    .then(function (response) {
                        //$("#pri-preloader").css("display", "none");
                        if (response.data.success) {
                            //var serverData = response.data;
                            var serverData = response.data.result;
                            var rowsThisPage = [];
                            for (var i = 0; i < serverData.properties.length; i++) {
                                var obj = {};
                                obj.id = serverData.properties[i].prop._id;
                                angular.extend(obj, serverData.properties[i].prop.properties);
                                rowsThisPage[i] = obj;
                            }
                            vm.tableData = rowsThisPage;
                            var lastRow;
                            //var rowsThisPage = allOfTheData;
                            lastRow = serverData.count;
                            vm.totalItems = lastRow;
                            vm.PageStartCount = ((parseInt(_page) - 1) * parseInt(_size)) + 1;
                            vm.PageEndCount = (vm.PageStartCount + serverData.properties.length) - 1;

                            params.successCallback(rowsThisPage, serverData.properties.length);

                        } else {
                            $scope.$emit('danger', response.data.message);
                        }
                        $("#pri-preloader").css("display", "none");

                    }, function (result) {
                        $("#pri-preloader").css("display", "none");
                    });
            }

        };
        gridOptions.api.setDatasource(dataSource);

    }




    function MyCellRenderer() {}

    MyCellRenderer.prototype.init = function (params) {
        if (params.data) {
            this.eGui = document.createElement('span');

            var innerHtml = '<span style="display:block; text-align:center;"><button class="btn btn-info " style="margin-right: 18px; background: rgba(122, 218, 16, 0.82);border: none;padding: 4px;" data-toggle="tooltip" data-placement="right" title="View details" value="' + params.data.id + '" ><i class="fa  fa-eye fa-lg"></i> </button></span>';

            this.eGui.innerHTML = innerHtml;
            this.viewButton = this.eGui.querySelectorAll('.btn-info')[0];


            this.viewEventListener = function (event) {
                ////console.log('viewEventListener was clicked!!', this.value);
                var property = getPropertyObjectFromList(this.value);

                if (property) {
                    localStorage.setItem('propertyDetails', angular.toJson(property));
                    localStorage.setItem('propertyId', angular.toJson(parseInt(this.value)));
                    // $state.go('viewIERR.property_details');
                    $state.go('publicPropertyDetailsTab');
                }

            };

            this.viewButton.addEventListener('click', this.viewEventListener);
        }
    };

    // gets called once when grid ready to insert the element
    MyCellRenderer.prototype.getGui = function () {
        return this.eGui;
    };

    // gets called whenever the user gets the cell to refresh
    MyCellRenderer.prototype.refresh = function (params) {
        // set value into cell again
        this.eValue.innerHTML = params.valueFormatted ? params.valueFormatted : params.value;
    };

    function getPropertyObjectFromList(id) {
        var propFound = null;
        angular.forEach(vm.tableData, function (value, key) {
            if (value.id == id) {
                propFound = value;
            }
        });
        return propFound;
    }

}