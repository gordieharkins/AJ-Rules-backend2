//__SelectedComparable.$inject = ["ComparableSelectionService", "$scope", "User_Config","$state", "$timeout"];
//module.exports = _SelectedComparable;

_SelectedComparable.$inject = ["ComparableService", "$scope", "User_Config", "$state", "$timeout", "AOTCService", "$filter"];
module.exports = _SelectedComparable;

//'use strict';
//angular.module('AOTC')
//    .controller('SelectedComparable', _SelectedComparable
//    );

function _SelectedComparable(ComparableService, $scope, User_Config, $state, $timeout, AOTCService, $filter) {


    //console.log("SelectedComparables controller");
    var vm = this;
    $(document).on('click', '.col-select .dropdown-menu', function (e) {
        e.stopPropagation();
    });

    // variables
    vm.selectedComparables = [];
    vm.showGrid = true;
    vm.showCards = false;
    vm.showResidentialProps = false;
    vm.mainImage = '';
    vm.showResidentialProps = '';
    vm.selectedcomparablesFromTable = [];
    vm.searchWordAllFile = '';
    vm.searchWordSelectedFile = '';

    //GetComparablesdata
    ///salesComps/getComparables

    //var zillowData = JSON.parse(localStorage.getItem('zillowData'));
    //vm.PrinciplePropData = zillowData.principal;
    //vm.selectedComparables = zillowData.comparables;
    var zillowData;
    vm.PrinciplePropData;
    vm.selectedComparables;


    //methods
    vm.clickShowGrid = clickShowGrid;
    vm.clickShowCards = clickShowCards;
    vm.flipBack = flipBack;
    vm.flipFront = flipFront;
    vm.saveComparables = saveComparables;
    vm.deleteComparable = deleteComparable;
    //vm.checkBoxSelection = checkBoxSelection;
    vm.slideRight = slideRight;
    vm.slideLeft = slideLeft;
    vm.clickShowPropertyDetail = clickShowPropertyDetail;
    vm.clickShowPropertySummary = clickShowPropertySummary;
    vm.clickshowPropertyMap = clickshowPropertyMap;
    vm.markerClick = markerClick;
    vm.defaultComs = true;
    vm.currentCriteria = 'Viewing saved comparables';
    vm.PrinciplePropDataDetail = {
        PO: {
            "area": "",
            "bathrooms": "",
            "bedrooms": "",
            "buildingArea": "",
            "expenditure": ["", ""],
            "improvement": ["", ""],
            "location": "",
            "waterFront": "",
            "yearBuilt": ""
        }
    };

    var userRole = localStorage.getItem('role');
    var criteriaId = 1;
    vm.isResidential = (userRole == 'Residential User') ? true : false;





    setMainImg();
    checkResientialUser();
    //initColumnSelection();

    $timeout(function () {
        initializeCards();
    }, 200);

    // $(document).ready(function() {
    //     $scope.menuLeft = $('.pushmenu-left');
    //     $scope.nav_list = $('#nav_list');

    //     $scope.nav_list.click(function() {
    //         $(this).toggleClass('active');
    //         $('.pushmenu-push').toggleClass('pushmenu-push-toright');
    //         $scope.menuLeft.toggleClass('pushmenu-open');
    //     });
    // });
    vm.comparableDelete = '';
    vm.modelMessage = {
        title: "",
        message: ""
    };
    vm.deleteConfirmation = deleteConfirmation;
    vm.myModelCheck = myModelCheck;
    vm.createComparables = createComparables;

    vm.RemovePO = function (_itemName) {
        try {
            var _newVal = vm.PrinciplePropDataDetail.PO[_itemName];
            //var _item = vm.POCopy[_itemName];

            var _hasPO = _newVal.indexOf('(PO)');
            if (_hasPO == -1) {
                //$timeout(function () {
                //    _newVal = _newVal + ' (PO)';
                //    vm.PrinciplePropDataDetail.PO[_itemName] = _newVal;
                //    //vm.POCopy[_itemName] = _newVal;
                //});
            }
            else {
                var _res = _newVal.replace(" (PO)", "");
                $timeout(function () {
                    //_newVal = _res + ' (PO)';
                    vm.PrinciplePropDataDetail.PO[_itemName] = _res;

                    //vm.POCopy[_itemName] = _newVal;
                });
            }
        }
        catch (_e) { }


    };

    vm.AppendPO = function (_itemName) {
        try {
            var _newVal = vm.PrinciplePropDataDetail.PO[_itemName];
            //var _item = vm.POCopy[_itemName];

            var _hasPO = _newVal.indexOf('(PO)');
            if (_hasPO == -1) {
                $timeout(function () {
                    _newVal = _newVal + ' (PO)';
                    vm.PrinciplePropDataDetail.PO[_itemName] = _newVal;
                    //vm.POCopy[_itemName] = _newVal;
                });
            }
            else {
                var _res = _newVal.replace(" (PO)", "");
                $timeout(function () {
                    _newVal = _res + ' (PO)';
                    vm.PrinciplePropDataDetail.PO[_itemName] = _newVal;

                    //vm.POCopy[_itemName] = _newVal;
                });
            }
        }
        catch (_e) { }


    };


    vm.SaveJurisdictionData = function (_JurisdictionData) {

        //var _JurisdictionData = vm.JurisdictionCopy;
        $('#preloader').css('display', 'block');
        //console.log("saveComparables", jsonFormat)
        ComparableService.saveSubjectPropertyUpdatedData(_JurisdictionData)
            .then(function (result) {
                $('#preloader').css('display', 'none');
                //console.log('Server Data : saveComparablesToProperties', result);

                if (result.data.success) {
                    $scope.$emit('success', result.data.message);
                } else {
                    $scope.$emit('error', result.data.message);
                }
            }, function (err) {
                //console.log('error has occurred', err);
                $('#preloader').css('display', 'none');
            });

    };

    vm.SetLocality = function (_location, _val) {
        if (_val == 'Yes') var _option = 'No';
        else var _option = 'No';
        switch (_location) {
            case 'Rural':
                vm.PrinciplePropDataDetail.PO.Urban = _option;
                vm.PrinciplePropDataDetail.PO.SubUrban = _option;

                break;
            case 'Urban':
                vm.PrinciplePropDataDetail.PO.Rural = _option;
                vm.PrinciplePropDataDetail.PO.SubUrban = _option;
                break;
            case 'SubUrban':
                vm.PrinciplePropDataDetail.PO.Urban = _option;
                vm.PrinciplePropDataDetail.PO.Rural = _option;
                break;
        }
    };
    var gridOptions;
    var rowData = [];
    var columnDefs = [];
    if (vm.isResidential) {
        columnDefs = [
             { headerName: "", field: "imageFileName", width: 70, pinned: 'left', checkboxSelection: true, headerCheckboxSelection: true, minWidth: 25 },
             { headerName: "Address", field: "streetName", pinned: 'left' },
              { headerName: "<span title='Data from Assessing Jurisdiction'> District <br> Number <br> (Assr)</span>", field: "districtNumber", width: 110, hide: true },
             { headerName: "<span title='Data from Assessing Jurisdiction'>Tax Account No <br> (Assr)</span>", field: "taxAccountNo", width: 100, cellClass: 'right-align-text', hide: true },
             { headerName: "<span title='Data from Assessing Jurisdiction'>Record Owner <br> Name <br> (Assr)</span>", field: "recordOwnerName", hide: true },
             { headerName: "<span title='Data from Assessing Jurisdiction'>Owner City <br> (Assr)</span>", field: "ownerCity", hide: true },
             { headerName: "<span title='Data from Assessing Jurisdiction'>Owner State <br> (Assr) </span>", field: "ownerState", width: 110, hide: true },
             { headerName: "<span title='Data from Assessing Jurisdiction'>Zip Code <br> (Assr) </span>", field: "zipCode", width: 80, cellClass: 'right-align-text', hide: true }, //, cellClass: 
             { headerName: "<span title='Data from Assessing Jurisdiction'> Street <br> Number <br> (Assr)</span> </span>", field: "streetNumber", width: 110 },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Street <br> Direction <br> (Assr) </span>", field: "streetDirection", cellRenderer: formatNull },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Street Name <br> (Assr) </span>", field: "streetName" },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Street <br> Type <br> (Assr) </span>", field: "streetType" },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Reval <br> Year <br> (Assr) </span>", field: "revalYear", width: 110 },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Year <br> Built <br> (Assr) </span>", field: "yearBuilt", width: 110 },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Building <br> Area <br> (Assr) </span>", field: "buildingArea", width: 110, cellRenderer: formatNumber, cellClass: 'right-align-text' },
             { headerName: " <span title='Consideration equals sale price'>Consideration <br> (Assr) </span>", field: "consideration", width: 110, cellRenderer: currencyFormatter, cellClass: 'right-align-text' },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Sales Per<br> Sq Ft <br> (Assr)", field: "salesPerSqFt", width: 110, cellClass: 'right-align-text', cellRenderer: currencyFormatter, },
             {
                 headerName: "Transfer <br> Date <br> (Assr)", field: "transferDate", width: 110, hide: true,
                 headerCellTemplate: function () {
                     var eCell = document.createElement('span');
                     eCell.innerHTML =
                         '<div title="Data from Assessing Jurisdiction" style="text-align: left;">' +
                         '  <div style="padding: 4px; overflow: hidden; text-overflow: ellipsis;">' +
                         ' Transfer Date <br> (Assr)' +
                         '    <span id="myMenuButton"><i class="fa fa-toggle-off" aria-hidden="true"></i></span>' +
                         // everything inside agHeaderCellLabel gets actioned when the user clicks
                         '  </div>' +
                         '</div>';

                     // because the menu is not with agMenu id, it means grid is not going to tie logic to it
                     var eMenuButton = eCell.querySelector('#myMenuButton');
                     eMenuButton.addEventListener('click', function () {
                         {
                             var _index = findColIndex('transferDate');
                             columnDefs[_index].hide = true;
                             _index = findColIndex('transferYear');
                             columnDefs[_index].hide = false;
                             gridOptions.api.setColumnDefs(columnDefs);
                             autoFitColums();

                         }
                         function findColIndex(_ff) {
                             for (var i = 0; i < columnDefs.length; i++) {
                                 if (columnDefs[i].field.indexOf(_ff) != -1) {
                                     return i;
                                     break;
                                 }
                             }
                         }
                     });

                     return eCell;
                 }
             },
             {
                 headerName: "Transfer <br> Year <br> (Assr)", field: "transferYear", width: 110,
                 headerCellTemplate: function () {
                     var eCell = document.createElement('span');
                     eCell.innerHTML =
                         '<div title="Data from Assessing Jurisdiction" style="text-align: left;">' +
                         '  <div style="padding: 4px; overflow: hidden; text-overflow: ellipsis;">' +
                         ' Transfer Year <br> (Assr)' +
                         '    <span id="myMenuButton2"><i class="fa fa-toggle-on" aria-hidden="true"></i></span>' +
                         // everything inside agHeaderCellLabel gets actioned when the user clicks
                         '  </div>' +
                         '</div>';

                     // because the menu is not with agMenu id, it means grid is not going to tie logic to it
                     var eMenuButton = eCell.querySelector('#myMenuButton2');
                     eMenuButton.addEventListener('click', function () {
                         {
                             var _index = findColIndex('transferYear');
                             columnDefs[_index].hide = true;

                             _index = findColIndex('transferDate');
                             columnDefs[_index].hide = false;
                             gridOptions.api.setColumnDefs(columnDefs);
                             autoFitColums();

                         }
                         function findColIndex(_ff) {
                             for (var i = 0; i < columnDefs.length; i++) {
                                 if (columnDefs[i].field.indexOf(_ff) != -1) {
                                     return i;
                                     break;
                                 }
                             }
                         }
                     });

                     return eCell;
                 }
             },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Total <br> Value <br> (Assr) </span>", field: "totalValue", width: 110, cellRenderer: currencyFormatter, cellClass: 'right-align-text' },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Value Per <br> Sq Ft <br> (Assr) </span>", field: "valuePerSqFt", width: 110, cellRenderer: currencyFormatter, cellClass: 'right-align-text' },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Land <br> Area <br> (Assr) </span>", field: "landArea", width: 110, cellRenderer: formatNumber, cellClass: 'right-align-text' },
             {
                 headerName: "<span title='data from Zillow'> Bedroom <br> (Zillow)", field: "bedrooms", width: 80, cellClass: 'right-align-text'
             },
             {
                 headerName: "<span title='data from Zillow'> Bathroom <br> (Zillow)", field: "bathrooms", width: 80, cellClass: 'right-align-text'
             },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Condition <br> (Assr) </span>", field: "condition", width: 90 },
        ];
    }
    else {
        columnDefs = [
             { headerName: "", field: "imageFileName", width: 70, pinned: 'left', checkboxSelection: true, headerCheckboxSelection: true, minWidth: 25 },
             { headerName: "Address", field: "streetName", pinned: 'left' },
                              { headerName: "<span title='Data from Assessing Jurisdiction'> Street <br> Number <br> (Assr)</span> </span>", field: "streetNumber", width: 110 },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Street <br> Direction <br> (Assr) </span>", field: "streetDirection", cellRenderer: formatNull },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Street Name <br> (Assr) </span>", field: "streetName" },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Street <br> Type <br> (Assr) </span>", field: "streetType" },
             {
                 headerName: "Transfer <br> Date <br> (Assr)", field: "transferDate", width: 110, hide: true,
                 headerCellTemplate: function () {
                     var eCell = document.createElement('span');
                     eCell.innerHTML =
                         '<div title="Data from Assessing Jurisdiction" style="text-align: left;">' +
                         '  <div style="padding: 4px; overflow: hidden; text-overflow: ellipsis;">' +
                         ' Transfer Date <br> (Assr)' +
                         '    <span id="myMenuButton"><i class="fa fa-toggle-off" aria-hidden="true"></i></span>' +
                         // everything inside agHeaderCellLabel gets actioned when the user clicks
                         '  </div>' +
                         '</div>';

                     // because the menu is not with agMenu id, it means grid is not going to tie logic to it
                     var eMenuButton = eCell.querySelector('#myMenuButton');
                     eMenuButton.addEventListener('click', function () {
                         {
                             var _index = findColIndex('transferDate');
                             columnDefs[_index].hide = true;
                             _index = findColIndex('transferYear');
                             columnDefs[_index].hide = false;
                             gridOptions.api.setColumnDefs(columnDefs);
                             autoFitColums();

                         }
                         function findColIndex(_ff) {
                             for (var i = 0; i < columnDefs.length; i++) {
                                 if (columnDefs[i].field.indexOf(_ff) != -1) {
                                     return i;
                                     break;
                                 }
                             }
                         }
                     });

                     return eCell;
                 }
             },

             {
                 headerName: "Transfer <br> Year <br> (Assr)", field: "transferYear", width: 110,
                 headerCellTemplate: function () {
                     var eCell = document.createElement('span');
                     eCell.innerHTML =
                         '<div title="Data from Assessing Jurisdiction" style="text-align: left;">' +
                         '  <div style="padding: 4px; overflow: hidden; text-overflow: ellipsis;">' +
                         ' Transfer Year <br> (Assr)' +
                         '    <span id="myMenuButton2"><i class="fa fa-toggle-on" aria-hidden="true"></i></span>' +
                         // everything inside agHeaderCellLabel gets actioned when the user clicks
                         '  </div>' +
                         '</div>';

                     // because the menu is not with agMenu id, it means grid is not going to tie logic to it
                     var eMenuButton = eCell.querySelector('#myMenuButton2');
                     eMenuButton.addEventListener('click', function () {
                         {
                             var _index = findColIndex('transferYear');
                             columnDefs[_index].hide = true;

                             _index = findColIndex('transferDate');
                             columnDefs[_index].hide = false;
                             gridOptions.api.setColumnDefs(columnDefs);
                             autoFitColums();

                         }
                         function findColIndex(_ff) {
                             for (var i = 0; i < columnDefs.length; i++) {
                                 if (columnDefs[i].field.indexOf(_ff) != -1) {
                                     return i;
                                     break;
                                 }
                             }
                         }
                     });

                     return eCell;
                 }
             },
             { headerName: " <span title='Consideration equals sale price'>Consideration <br> (Assr) </span>", field: "consideration", width: 110, cellRenderer: currencyFormatter, cellClass: 'right-align-text' },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Sales Per<br> Sq Ft <br> (Assr)", field: "salesPerSqFt", width: 110, cellClass: 'right-align-text', cellRenderer: currencyFormatter, },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Year <br> Built <br> (Assr) </span>", field: "yearBuilt", width: 110 },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Building <br> Area <br> (Assr) </span>", field: "buildingArea", width: 110, cellRenderer: formatNumber, cellClass: 'right-align-text' },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Condition <br> (Assr) </span>", field: "condition", width: 90 },

             { headerName: "<span title='Data from Assessing Jurisdiction'> Reval <br> Year <br> (Assr) </span>", field: "revalYear", width: 110 },

             { headerName: "<span title='Data from Assessing Jurisdiction'> Total <br> Value <br> (Assr) </span>", field: "totalValue", width: 110, cellRenderer: currencyFormatter, cellClass: 'right-align-text' },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Value Per <br> Sq Ft <br> (Assr) </span>", field: "valuePerSqFt", width: 110, cellRenderer: currencyFormatter, cellClass: 'right-align-text' },
             { headerName: "<span title='Data from Assessing Jurisdiction'> Land <br> Area <br> (Assr) </span>", field: "landArea", width: 110, cellRenderer: formatNumber, cellClass: 'right-align-text' },


             // { headerName: "<span title='Data from Assessing Jurisdiction'> District <br> Number <br> (Assr)</span>", field: "districtNumber", width: 110, hide: true },
             //{ headerName: "<span title='Data from Assessing Jurisdiction'>Tax Account No <br> (Assr)</span>", field: "taxAccountNo", width: 100, cellClass: 'right-align-text', hide: true },
             //{ headerName: "<span title='Data from Assessing Jurisdiction'>Record Owner <br> Name <br> (Assr)</span>", field: "recordOwnerName", hide: true },
             //{ headerName: "<span title='Data from Assessing Jurisdiction'>Owner City <br> (Assr)</span>", field: "ownerCity", hide: true },
             //{ headerName: "<span title='Data from Assessing Jurisdiction'>Owner State <br> (Assr) </span>", field: "ownerState", width: 110, hide: true },
             //{ headerName: "<span title='Data from Assessing Jurisdiction'>Zip Code <br> (Assr) </span>", field: "zipCode", width: 80, cellClass: 'right-align-text', hide: true }, //, cellClass: 
             //{
             //    headerName: "<span title='data from Zillow'> Bedroom <br> (Zillow)", field: "bedrooms", width: 80, cellClass: 'right-align-text'
             //},
             //{
             //    headerName: "<span title='data from Zillow'> Bathroom <br> (Zillow)", field: "bathrooms", width: 80, cellClass: 'right-align-text'
             //},
        ];
    }



    function formatNull(params) {
        if (params.value == 'null' || params.value == null || params.value == 'undefined') return '';
    }

    function formatNumber(params) {
        return $filter('number')(params.value, 0);
    }
    function currencyFormatter(params) {
        // this puts commas into the number eg 1000 goes to 1,000,
        // i pulled this from stack overflow, i have no idea how it works

        return $filter('currency')(params.value, "$", 0);
    }


    gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        headerHeight: 60,
        rowHeight: 40,
        suppressCellSelection: true,
        rowSelection: 'multiple',
        enableColResize: true,
        onRowSelected: rowSelectedFunc,
        getRowStyle: function (params) {
            if (params.data.value === 'mid') {
                return { 'background-color': '#bbbbbb' }
            }
            else if (params.data.value === 'low') {
                return { 'background-color': '#ffa570' }
            }
            else if (params.data.value === 'high') {
                return { 'background-color': '#1dd490' }
            }
            return null;
        },
        domLayout: 'autoHeight'
    };

    function rowSelectedFunc(event) {
        var _id = event.node.data.id;
        if (event.node.selected == true) {
            vm.selectedcomparablesFromTable.push(_id);

        }
        else if (event.node.selected == false) {
            var _index = vm.selectedcomparablesFromTable.indexOf(_id);
            vm.selectedcomparablesFromTable.splice(_index);
        }
        //window.alert("row " + event.node.data.athlete + " selected = " + event.node.selected);

    };

    function saveComparables() {
        $('#preloader').css('display', 'block');
        var propId = parseInt(localStorage.getItem('propertyId'));
        var jsonFormat = {
            "propId": propId,
            "compIds": vm.selectedcomparablesFromTable
        };
        //console.log("saveComparables", jsonFormat)
        ComparableService.saveComparablesToProperties(jsonFormat)
            .then(function (result) {
                vm.selectedcomparablesFromTable = [];
                $('#preloader').css('display', 'none');

                getSavedComps();
                //console.log('Server Data : saveComparablesToProperties', result);

                if (result.data.success) {
                    $scope.$emit('success', result.data.message);
                } else {
                    $scope.$emit('error', result.data.message);
                }
            }, function (err) {
                //console.log('error has occurred', err);
                $('#preloader').css('display', 'none');
            });
    };

    vm.deleteComparables = function () {
        $('#preloader').css('display', 'block');
        var propId = parseInt(localStorage.getItem('propertyId'));
        var jsonFormat = {
            "propId": propId,
            "compIds": vm.selectedcomparablesFromTable
        };
        //console.log("saveComparables", jsonFormat)
        ComparableService.deleteCompsFromProperty(jsonFormat)
            .then(function (result) {
                $('#preloader').css('display', 'none');


                getSavedComps();
                vm.selectedcomparablesFromTable = [];

                //console.log('Server Data : saveComparablesToProperties', result);

                if (result.data.success) {
                    $scope.$emit('success', result.data.message);
                } else {
                    $scope.$emit('error', result.data.message);
                }
            }, function (err) {
                //console.log('error has occurred', err);
                $('#preloader').css('display', 'none');
            });
    }


    vm.ColumnAddRemove = function (_colName, _field, _width, _after, _val) {

        if (_val) {
            //var _obj = { headerName: _colName, field: _field, width: _width };
            var _index = findColIndex(_field);
            columnDefs[_index].hide = false;
            gridOptions.api.setColumnDefs(columnDefs);
            autoFitColums()
        }
        else {
            var _index = findColIndex(_field);
            columnDefs[_index].hide = true;
            gridOptions.api.setColumnDefs(columnDefs);
            autoFitColums()

        }
        function findColIndex(_ff) {
            for (var i = 0; i < columnDefs.length; i++) {
                if (columnDefs[i].field.indexOf(_ff) != -1) {
                    return i;
                    break;
                }
            }
        }

    };

    function getComparables(_query) {
        $('#preloader').css('display', 'block');
        _query = _query ? _query : 1;
        ComparableService.getComparables(_query).
        then(function (result) {
            var serverData = result.data;

            if (serverData.success) {
                if (serverData.result.subjectProperty) {
                    vm.defaultComs = false;
                    zillowData = {
                        principal: serverData.result.subjectProperty.jurisdictionData,
                        comparables: serverData.result
                    };
                    vm.PrinciplePropData = zillowData.principal;

                    vm.selectedComparables = serverData.result;
                    vm.PrinciplePropDataDetail = {
                        Jurisdiction: serverData.result.subjectProperty.jurisdictionData,
                        Zillow: serverData.result.subjectProperty.zillowData,
                        PO: serverData.result.subjectProperty.poData
                    }

                    $("#preloader").css('display', 'none');

                    function setPropValue(_item) {
                        serverData.result.highProperties[i].properties
                    };


                    gridOptions.rowData = [];
                    for (var i = 0; i < serverData.result.highProperties.length; i++) {
                        var _propItem = serverData.result.highProperties[i];
                        _propItem.properties['value'] = _propItem.value;
                        _propItem.properties['id'] = _propItem.id;
                        _propItem.properties['imageFileName'] = _propItem.zillow ? '(Z)' : '  ';

                        gridOptions.rowData.push(_propItem.properties);
                    }

                    var _propItem = serverData.result.subjectProperty;
                    //_propItem.properties['value'] = _propItem.value;
                    _propItem.properties = _propItem.properties || {}; 
                    _propItem.properties['id'] = parseInt(localStorage.getItem('propertyId'));
                    gridOptions.rowData.push(_propItem.properties);

                    for (var i = 0; i < serverData.result.lowProperties.length; i++) {
                        var _propItem = serverData.result.lowProperties[i];
                        _propItem.properties['value'] = _propItem.value;
                        _propItem.properties['id'] = _propItem.id;
                        _propItem.properties['imageFileName'] = _propItem.zillow ? '(Z)' : '  ';

                        gridOptions.rowData.push(_propItem.properties);

                    }
                    $timeout(function () {
                        gridOptions.api.destroy();
                        var gridDiv = document.querySelector('#myGridContracts');
                        new agGrid.Grid(gridDiv, gridOptions);
                        //gridOptions.api.redrawRows();
                        gridOptions.api.setRowData(gridOptions.rowData);
                        autoFitColums();
                    });
                    $timeout(function () {
                        var x = document.getElementsByClassName("ag-body-viewport");
                        var hasHorizontalScrollbar = x[0].scrollWidth > x[0].clientWidth;
                        if (!hasHorizontalScrollbar) {
                            gridOptions.api.sizeColumnsToFit();
                        }
                    }, 100);
                    vm.locations = [];
                    createMarkers('lowProperties');
                    createMarkers('highProperties');
                    setmarkers(serverData.result.subjectProperty);
                } else {

                    getDeepSearchResult();
                    $('#preloader').css('display', 'none');
                }
            }
            else {
                $('#preloader').css('display', 'none');
            }
        }, function (err) {
            console.log('err : ', err);
            $('#preloader').css('display', 'none');
        })

    };
    //getComparables(1);
    vm.updateComsData = function (_query, _caption) {
        vm.currentCriteria = _caption;
        criteriaId = _query;
        getComparables(_query);
    };


    function autoFitColums() {
        var allColumnIds = [];
        columnDefs.forEach(function (columnDef) {
            allColumnIds.push(columnDef.field);
        });
        gridOptions.columnApi.autoSizeColumns(allColumnIds);
    }

    function getSavedComps() {
        $('#preloader').css('display', 'block');
        //_query = _query ? _query : 1;
        ComparableService.getSavedComps().
        then(function (result) {
            var serverData = result.data;

            if (serverData.success) {
                if (serverData.result.subjectProperty) {
                    vm.currentCriteria = 'Viewing saved comparables';
                    vm.defaultComs = true;
                    zillowData = {
                        principal: serverData.result.subjectProperty.jurisdictionData,
                        comparables: serverData.result
                    };
                    vm.PrinciplePropData = zillowData.principal;

                    vm.selectedComparables = serverData.result;
                    vm.PrinciplePropDataDetail = {
                        Jurisdiction: serverData.result.subjectProperty.jurisdictionData,
                        Zillow: serverData.result.subjectProperty.zillowData,
                        PO: serverData.result.subjectProperty.poData
                    }

                    $("#preloader").css('display', 'none');


                    gridOptions.rowData = [];
                    var _propItem = serverData.result.subjectProperty;
                    //_propItem.properties['value'] = _propItem.value;
                    _propItem.properties = _propItem.properties || {};
                    _propItem.properties['id'] = parseInt(localStorage.getItem('propertyId'));
                    gridOptions.rowData.push(_propItem.properties);

                    for (var i = 0; i < serverData.result.comparables.length; i++) {
                        var _propItem = serverData.result.comparables[i];
                        _propItem.properties['value'] = _propItem.value;
                        _propItem.properties['id'] = _propItem.id;
                        _propItem.properties['imageFileName'] = _propItem.zillow ? '(Z)' : '  ';


                        gridOptions.rowData.push(_propItem.properties);
                    }



                    $timeout(function () {
                        try {
                            gridOptions.api.destroy();
                        }
                        catch (_e) { }
                        var gridDiv = document.querySelector('#myGridContracts');
                        new agGrid.Grid(gridDiv, gridOptions);


                        var allColumnIds = [];
                        columnDefs.forEach(function (columnDef) {
                            allColumnIds.push(columnDef.field);
                        });
                        gridOptions.columnApi.autoSizeColumns(allColumnIds);

                        //gridOptions.api.sizeColumnsToFit()
                    });
                    $timeout(function () {
                        var x = document.getElementsByClassName("ag-body-viewport");
                        var hasHorizontalScrollbar = x[0].scrollWidth > x[0].clientWidth;
                        if (!hasHorizontalScrollbar) {
                            gridOptions.api.sizeColumnsToFit();
                        }
                    }, 100);
                    vm.locations = [];
                    createMarkers('comparables');
                    setmarkers(serverData.result.subjectProperty);
                } else {

                    getDeepSearchResult();
                    $('#preloader').css('display', 'none');
                }
            }
            else {
                $('#preloader').css('display', 'none');
            }
        }, function (err) {
            console.log('err : ', err);
            $('#preloader').css('display', 'none');
        })

    };
    getSavedComps();

    vm.markerId = 0;

    function createMarkers(_propname) {
        for (var i = 0; i < vm.selectedComparables[_propname].length; i++) {

            if (vm.selectedComparables[_propname][i].properties.ownerAddress !== null) {
            }

            // infowWindowDetails.propertyName = vm.selectedComparables[i].propertyName ? vm.selectedComparables[i].propertyName : 'Not Specified';
            var marker = {
                id: vm.markerId++,
                coords: {
                    latitude: (vm.selectedComparables[_propname][i].properties.latitude) ? parseFloat(vm.selectedComparables[_propname][i].properties.latitude) : 0,
                    longitude: (vm.selectedComparables[_propname][i].properties.longitude) ? parseFloat(vm.selectedComparables[_propname][i].properties.longitude) : 0
                },
                description: {
                    propertyName: vm.selectedComparables[_propname][i].properties.ownerAddress, //// title:"<h1>Marker 0</h1><p>This is the home marker.</p>",,
                    amount: $filter('currency')(vm.selectedComparables[_propname][i].properties.totalAssessment),
                    appealStatus: "",
                    meritToAppealDetail: ""
                },
                icon: './assets/img/b (1).png',
                options: {
                    draggable: false,
                    //icon: './assets/img/mark.png'
                    // icon: "assets/img/" + vm.selectedComparables[i].meritToAppeal + ".png"
                }
            }
            if (vm.selectedComparables[_propname][i].value == 'high') {
                marker.icon = './assets/img/marker-high.png';
            }
            if (vm.selectedComparables[_propname][i].value == 'low')
            { marker.icon = './assets/img/marker-low.png'; }
            if (vm.selectedComparables[_propname][i].value == 'mid')
            { marker.icon = './assets/img/marker-mid.png'; }

            vm.locations.push(marker);
            // $scope.$apply();
        }

    }

    function setmarkers(_subjectProperty) {



        //latitude
        //longitude


        vm.locations.push({
            id: vm.markerId++,
            coords: {
                latitude: _subjectProperty.lat,
                longitude: _subjectProperty.lng
            },
            description: {
                propertyName: _subjectProperty.ownerAddress, //// title:"<h1>Marker 0</h1><p>This is the home marker.</p>",,
                amount: $filter('currency')(_subjectProperty.totalAssessment),
                appealStatus: "",
                meritToAppealDetail: ""
            },
            icon: './assets/img/marker.png',
            options: {
                //draggable: false,
                //icons: './assets/img/mark.png'
            }
        });
        vm.icon = './assets/img/mark.png';
        //Google Map
        vm.map = {
            center: {
                latitude: 47.634705,
                longitude: -122.350054
            },
            showOverlay: true,
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        vm.mapOptions = {
            maxZoom: 0
        };


    };


    //vm.showPropertyMap

    function markerClick(marker) {
        vm.selectedMarker = {};
        vm.selectedMarker = marker.model;
        vm.map.center.latitude = vm.selectedMarker.coords.latitude;
        vm.map.center.longitude = vm.selectedMarker.coords.longitude;
        vm.markerWindowShow = true;
    }

    function clickShowPropertyDetail() {
        vm.ShowPropertyDetail = true;

    };

    function clickShowPropertySummary() {
        vm.ShowPropertyDetail = false;
    };

    function createComparables() {
        //console.log('v')
        $state.go('createPrincipalForm')


    }
    function deleteConfirmation(comparable) {
        //console.log('comparable is ', comparable);
        vm.modelMessage.title = 'Delete Comparable';
        vm.modelMessage.message = 'Are you sure you want to delete this comparable from this property?';
        vm.comparableDelete = comparable;
    }

    function myModelCheck() {

        if (vm.comparableDelete != null) {
            deleteComparable(vm.comparableDelete)
        }
    }

    function setMainImg() {
        var propertyDetails = JSON.parse(localStorage.getItem('propertyDetails'));
        vm.mainImage = propertyDetails.imageFileName;
        //console.log('mainImage' + vm.mainImage)

        if (vm.mainImage == undefined || vm.mainImage == null) {
            vm.mainImage = "assets/img/noImageAvailable.jpg";
        }
    }

    function checkResientialUser() {
        var userRole = localStorage.getItem('role');
        if (userRole == User_Config.RESIDENTIAL_USER) {
            vm.showResidentialProps = true;
        }
    }

    function deleteComparable(comparable) {

        //delete this comparable from server if id exists

        if (comparable.id) {
            $('#preloader').css('display', 'block');
            //delete from server and 
            ComparableService.deleteCompsFromProperty(comparable.id)
                .then(function (result) {
                    //console.log('deleteComparables result is: ', result);
                    $('#preloader').css('display', 'none');

                }, function (err) {
                    //console.log('err is ', err);
                    $('#preloader').css('display', 'none');

                })
        }

        for (var i = 0; i < vm.selectedComparables.length; i++) {
            var comp = vm.selectedComparables[i];

            if (comp.zpid == comparable.zpid) {
                vm.selectedComparables.splice(i, 1);
            }
        }

        zillowData.comparables = vm.selectedComparables;
        localStorage.removeItem('zillowData');
        localStorage.setItem('zillowData', angular.toJson(zillowData));

        $scope.$emit('success', 'Record deleted successfully');
    }

    //function saveComparables() {
    //    $('#preloader').css('display', 'block');
    //    var jsonFormat = {
    //        principal: vm.PrinciplePropData,
    //        comps: vm.selectedComparables
    //    };
    //    //console.log("saveComparables", jsonFormat)
    //    ComparableService.saveComparablesToProperties(jsonFormat)
    //        .then(function (result) {
    //            $('#preloader').css('display', 'none');
    //            //console.log('Server Data : saveComparablesToProperties', result);

    //            if (result.data.success) {
    //                $scope.$emit('success', result.data.message);
    //            } else {
    //                $scope.$emit('error', result.data.message);
    //            }
    //        }, function (err) {
    //            //console.log('error has occurred', err);
    //            $('#preloader').css('display', 'none');
    //        });
    //}

    //toggles tabs -start
    function clickShowGrid() {
        vm.showGrid = true;
        vm.showCards = false;
        vm.showPropertyMap = false;
    }

    function clickShowCards() {
        vm.showGrid = false;
        vm.showCards = true;
        vm.showPropertyMap = false;
    }

    function clickshowPropertyMap() {
        vm.showGrid = false;
        vm.showCards = false;
        vm.showPropertyMap = true;
    };
    //toggles tabs -end

    //initialize data to show
    function initializeCards() {
        for (var i = 0; i < vm.selectedComparables.length; i++) {
            var id = '#card_' + i;
            $(id).flip({
                trigger: 'manual'
            });
        }
    }

    //====ui controls
    function flipBack(id) {
        $(id).flip(false);
    }

    function flipFront(id) {
        $(id).flip(true);
    }

    // table slider
    function slideRight() {
        var container = $('#container')
        sideScroll(container[0], 'right', 25, 100, 10);
    }

    function slideLeft() {
        var container = $('#container')
        sideScroll(container[0], 'left', 25, 100, 10);
    }

    function sideScroll(element, direction, speed, distance, step) {
        var scrollAmount = 0;
        var slideTimer = setInterval(function () {
            if (direction == 'left') {
                element.scrollLeft -= step;
            } else {
                element.scrollLeft += step;
            }
            scrollAmount += step;
            if (scrollAmount >= distance) {
                window.clearInterval(slideTimer);
            }
        }, speed);
    }







    //####START========================================================= Evidences Modal ==============================================================//

    //===============================   GETTING ALL EVIDENCE FILES ======================== //

    vm.selectedPropCaption = '';
    vm.popup = {
        title: "Please explain",
        improvementYes: false,
        expenditureYes: false,
        improvementReason: '',
        expenditureReason: '',
        //SaveOption: function (_param) {
        //    vm.popup[_param + 'Yes'] = false;
        //},
        templateUrl: 'modules/ComparableModule/SalesComparable/SelectedComparables/template.html',
        templateUrl2: 'modules/ComparableModule/SalesComparable/SelectedComparables/template2.html',
        OpenDialogue: function (_param) {
            $('#myModalEvidence').modal('show');
            vm.selectedPropCaption = _param;
        },
        CheckYes: function (_param, _val) {
            if (_val.indexOf('Yes') != -1) {
                //show modal #myModalEvidence
                $('#myModalEvidence').modal('show');
                vm.selectedPropCaption = _param;
                //m.popup[_param + 'Yes'] = true;
            }
            else {
                vm.PrinciplePropDataDetail.PO[_param].options = [];
            }
        }
    };

    vm.AddNewDescriptionRow = function () {
        var _obj = {
            explanation: "",
            evidenceId: []
        };
        if (vm.PrinciplePropDataDetail.PO[vm.selectedPropCaption].options) {
            vm.PrinciplePropDataDetail.PO[vm.selectedPropCaption].options.push(_obj);
        }
        else {
            vm.PrinciplePropDataDetail.PO[vm.selectedPropCaption].options = [];
            vm.PrinciplePropDataDetail.PO[vm.selectedPropCaption].options.push(_obj);

        }
    }

    //getAllEvidenceFiles();

    function getAllEvidenceFiles() {

        vm.allEvidenceFiles = [];
        var propId = parseInt(localStorage.getItem('propertyId'));

        //$("#preloader").css("display", "block");
        var url = '/valuation/get-evidence-files';
        var _data = {propId: propId};
        console.log(url)

        AOTCService.postDataToServer(url, _data)
            .then(function (result) {

                var serverData = result.data;
                console.log('All Evidences Receieved Server Data');
                console.log(serverData);

                if (serverData.success) {

                    vm.allEvidenceFiles = serverData.result[0].evidences;
                    //by default sort By date
                    // sortBy('createdDate');
                    localStorage.removeItem('evidenceFilesAtServer');
                    localStorage.setItem('evidenceFilesAtServer', angular.toJson(vm.allEvidenceFiles));

                    //for (var i = 0; i < vm.allEvidenceFiles.length; i++) {
                    //    var evidFile = vm.allEvidenceFiles[i];

                    //    for (var k = 0; k < vm.selectedEvidences.length; k++) {
                    //        var selectedEvid = vm.selectedEvidences[k];
                    //        if (selectedEvid._id == evidFile._id) {

                    //            vm.allEvidenceFiles.splice(i, 1);
                    //            i = i - 1;

                    //        }

                    //    }

                    //}

                }

                //$("#preloader").css("display", "none");


            }, function (result) {
                //some error
                console.log(result);
                // $("#preloader").css("display", "none");

            });
    };


    vm.sortedAndSearchedEvidences = sortedAndSearchedEvidences;
    vm.sortedAndSearchedSelectedEvidences = sortedAndSearchedSelectedEvidences;

    function sortedAndSearchedEvidences() {

        var searchItem = vm.searchWordAllFile.toLowerCase();

        if (searchItem.length > 0) {

        } else {
            // console.log('return all evidence\n', vm.allEvidenceFiles);
            return vm.allEvidenceFiles;

        }
    }

    function sortedAndSearchedSelectedEvidences() {

        var searchItem = vm.searchWordSelectedFile.toLowerCase();

        if (searchItem.length > 0) {
        } else {
            // console.log('----------------------------already selectedEvidences');
            // console.log(vm.selectedEvidences);
            return vm.selectedEvidences;
        }
    }



    //upon sort click

    function restoreAllEvidence() {
        var propEvidence = localStorage.getItem('evidenceFilesAtServer');
        vm.allEvidenceFiles = JSON.parse(propEvidence);
        //by default sort By date
        // sortBy('createdDate');

        //for (var i = 0; i < vm.allEvidenceFiles.length; i++) {
        //    var evidFile = vm.allEvidenceFiles[i];
        //    for (var k = 0; k < vm.selectedEvidences.length; k++) {
        //        var selectedEvid = vm.selectedEvidences[k];
        //        if (selectedEvid._id == evidFile._id) {
        //            vm.allEvidenceFiles.splice(i, 1);
        //            i = i - 1;
        //        }
        //    }
        //}
    }

    vm.currentPropSelected = {};
    vm.OpenEvidenceModal = function (__evidance) {
        $('#myModalEvidence2').modal('show');
        vm.currentPropSelected = __evidance;
        restoreAllEvidence();
        removeFromAllEvi();
    };

    // MOVE TO SELECTED LIST//

    function removeFromAllEvi() {

        for (var i = 0; i < vm.currentPropSelected.evidenceId.length; i++) {
            var propEvidenceId = vm.currentPropSelected.evidenceId[i];
            for (var k = 0; k < vm.allEvidenceFiles.length; k++) {
                var allEvidenceId = vm.allEvidenceFiles[k]
                if (allEvidenceId._id == propEvidenceId) {
                    vm.allEvidenceFiles.splice(k, 1);
                }

            }

        }


    };

    vm.addToSelectedFiles = function (evidence) {

        try {
            vm.currentPropSelected.evidenceId.push(evidence._id);
        }
        catch (_e) { }

        //vm.PrinciplePropDataDetail.PO.expenditure[2]


        for (var i = 0; i < vm.allEvidenceFiles.length; i++) {
            var allEvidence = vm.allEvidenceFiles[i]
            if (allEvidence._id == evidence._id) {
                vm.allEvidenceFiles.splice(i, 1);
                i = i - 1;
            }

        }

    }

    //MOVE TO ALL EVIDENCE LIST  FROM SELECTED//
    vm.removeFromSelectedFiles = function (evidence) {

        for (var i = 0; i < vm.currentPropSelected.evidenceId.length; i++) {
            var allEvidence = vm.currentPropSelected.evidenceId[i]

            if (allEvidence == evidence) {
                //console.log('true')
                vm.currentPropSelected.evidenceId.splice(i, 1);
                vm.allEvidenceFiles.push({ _id: evidence });
            }

        }
    }

    //======================= on input click => OPEN MODEL(myModalEvidence) TO SELECT EVIDENCES ================= //



    //####END========================================================= Evidences Modal ==============================================================//


    // select Columns
    //function initColumnSelection() {
    //    var checkboxModelData = JSON.parse(localStorage.getItem('checkboxModelData'));

    //    if (checkboxModelData === null) {
    //        $scope.checkboxCount = 21;
    //        $scope.checkboxModel = {
    //            value1: true,
    //            value2: true,
    //            value3: true,
    //            value4: true,
    //            value5: true,
    //            value6: true,
    //            value7: true,
    //            value8: true,
    //            value9: true,
    //            value10: true,
    //            value11: true,
    //            value12: true,
    //            value13: true,
    //            value14: true,
    //            value15: true,
    //            value16: true,
    //            value17: true,
    //            value18: true,
    //            value19: true,
    //            value20: true,
    //            value21: true,
    //        };
    //    } else {
    //        $scope.checkboxCount = checkboxModelData.count;
    //        $scope.checkboxModel = checkboxModelData.checkboxModel;
    //    }
    //}

    //function checkBoxSelection(value) {

    //    //console.log('checkbox' + value)
    //    var checkboxModel = $scope.checkboxModel;
    //    var count = 0;
    //    for (var element in checkboxModel) {
    //        if (checkboxModel[element]) {
    //            count++;
    //        }
    //    }
    //    $scope.checkboxCount = count;

    //    var checkboxModelData = {
    //        count: count,
    //        checkboxModel: checkboxModel
    //    };
    //    localStorage.setItem('checkboxModelData', angular.toJson(checkboxModelData));

    //    //  vm.createComparables=createComparables;

}
