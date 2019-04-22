'use strict';

//var agGrid = require('agGrid');
_PropertyListCtrl.$inject = ["AOTCPermissions", "User_Config", "$timeout", "$compile", "PrivatePropertyService", "$state", "$scope", "$location"];
module.exports = _PropertyListCtrl;

agGrid.initialiseAgGridWithAngular1(angular);
//angular.module('AOTC').controller('PropertyListCtrl', _PropertyListCtrl
//    );

function _PropertyListCtrl(AOTCPermissions, User_Config, $timeout, $compile, PrivatePropertyService, $state, $scope, $location) {
    var vm = this;
    vm.userId = localStorage.getItem('userId');
    vm.paginationPageSize = 25;
    vm.pagesInCash = 1;

    vm.showDeleteButton = false;
    vm.showMultiPartAccount = false;
    vm.showContractButton = false;

    vm.userRole = localStorage.getItem('role');
    vm.hideButtons = false;
    vm.AJUser = false;
    vm.headingLabel = 'View Private Properties';


    if (vm.userRole == User_Config.AJ_USER) {
        vm.hideButtons = true;
        vm.AJUser = true;
        vm.headingLabel = 'View Properties in Your Jurisdiction';
    }

    var serverInProgress = 0;

    setTimeout(function () {
        $('[data-tooltip="tooltip"]').tooltip();
    }, 1000);

    var columnDefs = [{
        headerName: "",
        field: "",
        width: 50,
        suppressFilter: true,
        suppressSorting: true,
        headerCheckboxSelection: false,
        checkboxSelection: !vm.AJUser
    }, {
        headerName: "Images",
        field: "imageFileName",
        width: 65,
        suppressFilter: true,
        suppressSorting: true,
        cellRenderer: function (params) {

            if (params.data) {

                if (params.value) {
                    var imageHTML = '<img src="' + params.value + '" class="img-responsive">';
                } else {
                    var imageHTML = '<img src="assets/img/noImageAvailable.jpg" class="img-responsive">';
                }
                return imageHTML;
            }
        }
    }, {
        headerName: "Tax Account Number",
        field: "taxAccountNo",
        filterParams: {
            applyButton: true,
            clearButton: true
        },
        // headerCheckboxSelection: !vm.AJUser,
        // checkboxSelection: !vm.AJUser,
        cellRenderer: function (params) {
            if (params.data) {
                var finalVal = params.value;

                if (params.data.publicProperty != null) {
                    finalVal += '<img class="pull-right" title="Public Property" height="27" width="39" aria-hidden="true" src="assets/img/publicProperty.png">';
                }

                if (params.data.relationType == User_Config.MULTI_PART) {

                    finalVal += '<i class="fa fa-window-restore fa-lg pull-right my-center" title="Multi-Part" aria-hidden="true"></i> ';
                } else if (params.data.relationType == User_Config.MULTI_ACCOUNT) {
                    finalVal += '<i class="fa fa-puzzle-piece fa-lg pull-right my-center"  title="Multi-Account" aria-hidden="true"></i> ';
                }
                return finalVal;
            }
        }
    }, {
        headerName: "Property Name",
        field: "propertyName",
        filter: 'text',
        filterParams: {
            applyButton: true,
            clearButton: true
        }
    }, {
        headerName: "Property Address",
        field: "streetName",
        filterParams: {
            applyButton: true,
            clearButton: true
        }
    }, {
        headerName: "Owner Name",
        field: "recordOwnerName",
        filterParams: {
            applyButton: true,
            clearButton: true
        }
    }, {
        headerName: "Actions",
        width: 300,
        suppressResize: true,
        cellRenderer: MyCellRenderer,
        suppressFilter: true,
        suppressSorting: true
    }];

    var gridOptions = {
        floatingFilter: true,
        enableServerSideSorting: true,
        enableServerSideFilter: true,
        rowHeight: 40,
        enableColResize: true,
        rowSelection: 'multiple',
        rowDeselection: true,
        suppressRowClickSelection: vm.AJUser,
        columnDefs: columnDefs,
        rowModelType: 'infinite',
        paginationOverflowSize: 2,
        maxConcurrentDatasourceRequests: 2,
        infiniteInitialRowCount: 1,
        maxPagesInCache: vm.pagesInCash,
        getRowNodeId: function (item) {
            return item.id;
        },
        onGridReady: function (params) {
            params.api.sizeColumnsToFit();
        },
        onSelectionChanged: function (event) {
            var selectedProps = gridOptions.api.getSelectedRows();
            //////console.log('selectedProps', selectedProps.length);
            //////console.log('server in progress', selectedProps);
            if (serverInProgress != 1) {
                if (selectedProps.length > 0) {
                    vm.showContractButton = true;
                    $scope.$apply();
                    //////console.log('server in progress', vm.showContractButton);


                }

                if (selectedProps.length > 1) {
                    //////console.log('active delete button')
                    vm.showDeleteButton = true;
                    decideToShowMultiAccountMultiPart(selectedProps);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                } else if (serverInProgress == 0) {
                    if (selectedProps.length == 0) {
                        vm.showContractButton = false;
                        vm.showDeleteButton = false;
                        vm.showMultiPartAccount = false;
                    }


                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            }
        }
    };

    gridOptions.pagination = true;
    gridOptions.infiniteBlockSize = vm.paginationPageSize;
    gridOptions.paginationPageSize = vm.paginationPageSize;

    function getSelectedPropertiesId() {
        var propIdList = [];
        var selectedProps = gridOptions.api.getSelectedRows();
        for (var i = 0; i < selectedProps.length; i++) {
            var property = selectedProps[i];
            //////console.log(property)
            propIdList.push(property._id);
        }
        // //////console.log(propIdList);
        return propIdList;
    }


    $scope.createContract = function () {
        var propIdList = getSelectedPropertiesId();
        // ////console.log('propIdList' , propIdList);
        localStorage.setItem('selectedPopertiesId', angular.toJson(propIdList));
        PrivatePropertyService.selectedPropertyList = propIdList
        //console.log(PrivatePropertyService.selectedPropertyList)
        $state.go('Contract');
    }

    function moveToMultiAccount() {
        serverInProgress = 1;

        //send selected prop to multi-account url
        $("#preloader").css("display", "block");

        var url = '/properties/multiAccountLinking';
        var propIdList = getSelectedPropertiesId();

        var jsonFormat = {
            propIds: propIdList
        };
        //////console.log(jsonFormat);
        gridOptions.api.deselectAll();
        PrivatePropertyService.postDataToServer(url, jsonFormat)
            .then(function (result) {
                serverInProgress = 0;
                vm.showDeleteButton = false;
                vm.showMultiPartAccount = false;
                //////console.log(result);
                var serverData = result.data;
                $("#preloader").css("display", "none");

                if (serverData.success) {
                    setRowData([]);
                    $scope.$emit('success', serverData.message);

                } else {
                    $scope.$emit('error', serverData.message);
                }


            }, function (error) {

                //////console.log(error);
                $("#preloader").css("display", "none");
                // $scope.$emit('error',serverData.message);
            });
    }

    function moveToMultiPart() {
        serverInProgress = 1;
        //send selected prop to multi-part url
        // $("#preloader").css("display", "block");
        var url = '/properties/multiPartLinking';
        var propIdList = getSelectedPropertiesId();
        var jsonFormat = {
            propIds: propIdList
        };

        //////console.log(jsonFormat);
        gridOptions.api.deselectAll();
        PrivatePropertyService.postDataToServer(url, jsonFormat)
            .then(function (result) {
                serverInProgress = 0;
                //////console.log(result);
                var serverData = result.data;
                vm.showDeleteButton = false;
                vm.showMultiPartAccount = false;
                $("#preloader").css("display", "none");

                if (serverData.success) {
                    setRowData([]);
                    $scope.$emit('success', serverData.message);

                } else {
                    $scope.$emit('error', serverData.message);
                }

            }, function (error) {
                $("#preloader").css("display", "none");
                //////console.log(error);
            });
    }

    function deleteProperties() {
        //delete selected prop
        serverInProgress = 1;

        // $("#preloader").css("display", "block");

        var propIds = getSelectedPropertyIdsList();
        var selectedProps = gridOptions.api.getSelectedRows();

        if (selectedProps.length > 0) {
            gridOptions.api.deselectAll();
        }

        PrivatePropertyService.deleteProperties(propIds)
            .then(function (serverData) {
                serverInProgress = 0;
                //////console.log(serverData);
                $("#preloader").css("display", "none");
                if (serverData.success) {
                    setRowData([]);
                    vm.showDeleteButton = false;
                    vm.showMultiPartAccount = false;
                    $scope.$emit('success', serverData.message);

                } else {
                    $scope.$emit('error', serverData.message);
                }
            }, function (err) {
                serverInProgress = 0;
                //////console.log(err);
                $scope.$emit('error', err.message);
                $("#preloader").css("display", "none");
                //////console.log(error);
            });
    }

    function decideToShowMultiAccountMultiPart(selectedProps) {

        var multiPart_exist = false;
        var multiAccount_exist = false;

        for (var i = 0; i < selectedProps.length; i++) {
            var property = selectedProps[i];

            if (property.relationType == 'multiaccount') {
                multiAccount_exist = true;
            } else if (property.relationType == 'multipart') {
                multiPart_exist = true;
            }
        }

        if (multiAccount_exist && multiPart_exist) {
            vm.showMultiPartAccount = false;

        } else if (selectedProps.length > 1) {
            vm.showMultiPartAccount = true;

        } else {
            vm.showMultiPartAccount = false;
        }
    }

    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    setRowData([]);

    function setRowData(allOfTheData) {

        var dataSource = {
            rowCount: null, // behave as infinite scroll
            getRows: function (params) {
                //////console.log("\n\n***************GET ROWS ==> Params**********\n");
                //////console.log(params);
                serverInProgress = 1;

                var myParams = {
                    paginationPageSize: vm.paginationPageSize,
                    startRow: params.startRow,
                    sortModel: params.sortModel[0] ? params.sortModel[0] : {},
                    filterModel: params.filterModel
                };

                PrivatePropertyService.getProps(myParams)
                    .then(function (response) {
                        serverInProgress = 0;
                        var serverData = response.data;
                        //////console.log('\n=> Server response\n', serverData);
                        if (serverData.success) {
                            vm.tableData = serverData.result.data;
                            allOfTheData = vm.tableData;

                            for (var i = 0; i < allOfTheData.length; i++) {
                                var obj = allOfTheData[i];
                                obj.id = obj._id;
                            }

                            var lastRow;
                            var rowsThisPage = allOfTheData;
                            lastRow = serverData.result.totalRecords;
                            params.successCallback(rowsThisPage, lastRow);
                        }

                        $("#preloader").css("display", "none");
                        $("#pri-preloader").css("display", "none");

                    });
            }

        };
        gridOptions.api.setDatasource(dataSource);
    }

    //===================================== delete properties -start-=======================================//

    vm.deletePropAlert = deletePropAlert;
    vm.multiAccountAlert = multiAccountAlert;
    vm.multiPartAlert = multiPartAlert;
    vm.modalYesAction = modalYesAction;

    vm.modelMessage = {
        title: "",
        message: ""
    }

    function deletePropAlert() {
        vm.selectedOption = 0;
        if (getSelectedPropertyIdsList().length > 1) {
            vm.modelMessage.title = 'Delete Properties';
            vm.modelMessage.message = 'Are you sure you want to delete the selected properties?';
        } else {
            vm.modelMessage.title = 'Delete Property';
            vm.modelMessage.message = 'Are you sure you want to delete this property?';
        }
    }

    function multiAccountAlert() {
        vm.selectedOption = 1;
        vm.modelMessage.title = 'Multi Account Property';
        vm.modelMessage.message = 'Are you sure to link these properties?';
    }

    function multiPartAlert() {
        vm.selectedOption = 2;
        vm.modelMessage.title = 'Multi Part Property';
        vm.modelMessage.message = 'Are you sure to link these properties?';
    }

    function modalYesAction() {
        if (vm.selectedOption == 0) // 0  for delete
        {
            deleteProperties();

        }
        if (vm.selectedOption == 1) // 1  for multiaccount
        {
            moveToMultiAccount();
        }
        if (vm.selectedOption == 2) // 2  for multi part
        {
            moveToMultiPart();
        }
    }

    function getSelectedPropertyIdsList() {
        var propIdList = [];
        var selectedProps = gridOptions.api.getSelectedRows();
        //////console.log(selectedProps);
        for (var i = 0; i < selectedProps.length; i++) {
            propIdList.push(selectedProps[i]._id);
        }
        return propIdList;
    }



    $scope.viewEvaluation = function () {
        //////console.log('viewEvaluation');
        //////console.log(property);

        localStorage.setItem('propertyDetails', angular.toJson(property.properties));
        localStorage.setItem('propertyId', angular.toJson(property._id));


        property.prop = property.masterProperty;
        // //////console.log(property.prop._id);
        $state.go('propertyValuation', { //uploadIERR updateIERR
            property: property
        });

        // viewIERR.property_details({property : prop})

    }

    //===================================== delete properties -end-=======================================//
    //===================================== Table Actions Buttons -start-=================================//

    function MyCellRenderer() {}

    MyCellRenderer.prototype.init = function (params) {
        if (params.data) {
            this.eGui = document.createElement('span');
            if (vm.userRole == User_Config.AJ_USER) {
                // User is type AJ
                innerHtml = '<span style="display:block; text-align:center;"><button class="btn btn-info" style="background: #107dda;border: none;    padding: 4px;" data-toggle="tooltip" data-placement="right" title="View details" value="' + params.data._id + '" ><i class="fa  fa-eye fa-lg"></i></button></span>';
                this.eGui.innerHTML = innerHtml;
                this.viewButton = this.eGui.querySelectorAll('.btn-info')[0];

            } else {
                var viewBtnStatus = (params.data.roles.viewPropertyDetails) ? 'inline' : 'none';
                var comparableBtnStatus = (params.data.roles.viewComparables) ? 'inline' : 'none';
                var valuationBtnStatus = (params.data.roles.viewValuationForm) ? 'inline' : 'none';
                var attachBtnStatus = (params.data.roles.attachFilesToProperty) ? 'inline' : 'none';
                var assignBtnStatus = (params.data.roles.assignProperty) ? 'inline' : 'none';


                var innerHtml =
                    '<span style="display:block; text-align:center;">' +
                    '<button ' +
                    '           class="btn btn-info " style="margin-right: 10px; background: rgba(122, 218, 16, 0.82); ' +
                    '           border: none;    padding: 4px;display:' + viewBtnStatus + ';" data-toggle="tooltip" ' +
                    '           data-placement="right" title="View details" ' +
                    '           value=" ' + params.data._id + ' " > ' +
                    '           <i class="fa  fa-eye fa-lg"></i> </button> ' +
                    '       <button ' +
                    '           class="btn btn-info " style="margin-right: 10px; background: #3be4ff ; ' +
                    '           border: none;padding: 4px;display:' + attachBtnStatus + ';" data-toggle="tooltip" data-placement="right" ' + ' title="Attach files" ' +
                    '            value=" ' + params.data._id + ' " > ' +
                    '           <i class="fa fa-paperclip fa-lg"></i> </button> ' +

                    '       <button  class="btn btn-info " style="margin-right: 10px; background:#ff9800 ; ' +
                    '           border: none;    padding: 4px;display:' + valuationBtnStatus + ';" data-toggle="tooltip" data-placement="right" ' +
                    '           title="Valuation" ' +
                    '            value=" ' + params.data._id + ' "> ' +
                    '           <i class="fa fa-list-alt fa-lg"></i> </button> ' +
                    '       <button ' +
                    '           class="btn btn-info " style="margin-right: 10px; background: rgb(255, 118, 0); ' +
                    '           border: none;    padding: 4px;display:' + comparableBtnStatus + ';" data-toggle="tooltip" data-placement="right" ' + ' title="Comparables" ' +
                    '           value=" ' + params.data._id + ' " > ' +
                    '           <i class="fa fa-exchange fa-lg"></i> </button> ' +
                    '       <button ' +
                    '       class="btn btn-info " style="margin-right: 5px; background: #f44336;border: none;' +
                    '               padding: 4px;" data-toggle="tooltip" data-placement="right" title="Delete Property" ' +
                    '           value=" ' + params.data._id + ' " > ' +
                    '           <i class="fa fa-trash fa-lg"></i> </button> ' +
                    '       <button ' +
                    '       class="btn btn-info " style="margin-right: 5px; background:  rgba(122, 218, 16, 0.82);border: none;display:' + assignBtnStatus + ';' +
                    '               padding: 4px;" data-toggle="tooltip" data-placement="right" title="Assign" ' +
                    '           value=" ' + params.data._id + ' " > ' +
                    '           <i class="fa fa-hand-o-right fa-lg"></i> </button> ' +
                    '   </span>';

                this.eGui.innerHTML = innerHtml;

                this.viewButton = this.eGui.querySelectorAll('.btn-info')[0];
                this.attachButton = this.eGui.querySelectorAll('.btn-info')[1];
                this.valuationButton = this.eGui.querySelectorAll('.btn-info')[2];
                this.comparablesButton = this.eGui.querySelectorAll('.btn-info')[3];
                this.deleteButton = this.eGui.querySelectorAll('.btn-info')[4];
                this.assignButton = this.eGui.querySelectorAll('.btn-info')[5];


            }

            if (vm.userRole != User_Config.AJ_USER) {
                // add event listener to button
                this.valuationEventListener = function (event) {
                    // //////console.log('eventListener 1 button was clicked!!', this.value);
                    var property = getPropertyObjectFromList(this.value);
                    if (property) {
                        //set permissions
                        AOTCPermissions.setPermissions(property.roles, 'permissionPerPropertyObj');
                        localStorage.setItem('propertyDetails', angular.toJson(property));
                        localStorage.setItem('propertyId', angular.toJson(parseInt(this.value)));
                        $timeout(function(){
                            $state.go('propertyValuation');
                        });
                        
                    }
                };

                this.attachEventListener = function (event) {
                    // //////console.log('eventListener 3 button was clicked!!', this.value);
                    var property = getPropertyObjectFromList(this.value);
                    if (property) {
                        //set permissions
                        AOTCPermissions.setPermissions(property.roles, 'permissionPerPropertyObj');
                        localStorage.setItem('propertyDetails', angular.toJson(property));
                        localStorage.setItem('propertyId', angular.toJson(parseInt(this.value)));
                        $timeout(function(){
                            $state.go('updateIERR');
                        });

                    }
                };

                this.comparableEventListener = function (event) {
                    // //////console.log('eventListener 4 button was clicked!!', this.value);
                    var property = getPropertyObjectFromList(this.value);
                    if (property) {
                        //set permissions
                        AOTCPermissions.setPermissions(property.roles, 'permissionPerPropertyObj');
                        localStorage.setItem('propertyDetails', angular.toJson(property));
                        localStorage.setItem('propertyId', angular.toJson(parseInt(this.value)));
                        $timeout(function(){
                            $state.go('comparableSelection');
                        });
                    }
                };

                this.deleteEventListener = function (event) {

                    //////console.log('eventListener 5 button was clicked!!', this.value);
                    deletePropAlert();
                    $('#myModalquestion').modal('toggle');

                };

                this.valuationButton.addEventListener('click', this.valuationEventListener);
                this.attachButton.addEventListener('click', this.attachEventListener);
                this.deleteButton.addEventListener('click', this.deleteEventListener);
                this.comparablesButton.addEventListener('click', this.comparableEventListener);
            }

            this.assignEventListener = function (event) {
                var property = getPropertyObjectFromList(this.value);

                if (property) {
                    AOTCPermissions.setPermissions(property.roles, 'permissionPerPropertyObj');
                    localStorage.setItem('propertyDetails', angular.toJson(property));
                    localStorage.setItem('propertyId', angular.toJson(parseInt(this.value)));
                    // $state.go('viewIERR.property_details');
                    $timeout(function(){
                        $state.go('assignedUsersList');
                    });
                }

            };
            this.assignButton.addEventListener('click', this.assignEventListener);



            this.viewEventListener = function (event) {
                //////console.log('eventListener 2 button was clicked!!', this.value);
                var property = getPropertyObjectFromList(this.value);

                if (property) {
                    //set permissions
                    AOTCPermissions.setPermissions(property.roles, 'permissionPerPropertyObj');
                    localStorage.setItem('propertyDetails', angular.toJson(property));
                    localStorage.setItem('propertyId', angular.toJson(parseInt(this.value)));
                    // $state.go('viewIERR.property_details');
                    $timeout(function(){
                        $state.go('viewIERR.propertyDetailsTab');
                    });
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

    // gets called when the cell is removed from the grid
    //     MyCellRenderer.prototype.destroy = function() {
    //         // do cleanup, remove event listener from button
    //         this.eButton.removeEventListener('click', this.eventListener);
    //     };


    //===================================== Table Actions Buttons -end-=================================//

    function getPropertyObjectFromList(id) {
        var propFound = null;
        angular.forEach(vm.tableData, function (value, key) {
            if (value._id == id) {
                propFound = value;
            }
        });
        return propFound;
    }

    String.prototype.startsWith = function (needle) {
        return (this.indexOf(needle) == 0);
    };
}