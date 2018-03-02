'use strict';

_ViewReportsCtrl.$inject = ["SurveylistService", "$scope", "Excel", "$timeout", "ReportService", "$stateParams"];
module.exports = _ViewReportsCtrl;
//angular.module('AOTC').controller('ViewReportsCtrl', _ViewReportsCtrl);

agGrid.initialiseAgGridWithAngular1(angular);

function _ViewReportsCtrl(SurveylistService, $scope, Excel, $timeout, ReportService, $stateParams) {

    var vm = this;
    $scope.data = null;
    $scope.switch = false;
    $scope.surveyName = 'Download';

    $scope.switchTable = function () {
        if ($scope.switch) {
            $scope.switch = false;
        }
        else {
            $scope.switch = true;
        }
    }

    $scope.exportToExcel = function () { // ex: '#my-table'
        var exportHref = Excel.tableToExcel('#myGridContracts', 'WireWorkbenchDataExport');
        $timeout(function () {
            var a = document.createElement('a');
            a.href = exportHref;
            a.download = $scope.surveyName + ".xls";
            document.body.appendChild(a);
            a.click();
            a.remove();

        }, 100); // trigger download
    }

    $scope.initTest = function () {

        $scope.surveyName = SurveylistService.name;
        $("#preloader").css("display", "block");
        ReportService.getSurveyReports($stateParams.id)
            .then(function (result) {

                $("#preloader").css("display", "none");

                if (!result.data.success) {
                    $scope.$emit('danger', result.data.message);
                } else {
                    $scope.data = result.data;
                    initGrid(angular.copy($scope.data.result));
                    //console.log($scope.data)
                }

            });

    };


    //New code for ag grid
    var rowData = [];
    var columnDefs = [];
    var gridOptions = {
        columnDefs: [],
        rowData: [],
        headerHeight: 25,
        rowHeight: 40,
        suppressCellSelection: true,
        enableColResize: true,
        getRowHeight: function (params) {
            // assuming 50 characters per line, working how how many lines we need
            return 21 * (Math.floor(params.data.question.length / 17) + 1);
        }
    };
    function initGrid(_data) {
        columnDefs = insertDefaultColumns(columnDefs);
        columnDefs = insertColumnsForJurs(_data, columnDefs);
        rowData = createDataForQuestion(_data);

        gridOptions.columnDefs = columnDefs;
        gridOptions.rowData = rowData;

        //rowData = createDataForAnswers(_data, rowData);
        $timeout(function () {
            var gridDiv = document.querySelector('#myGridContracts');
            new agGrid.Grid(gridDiv, gridOptions);
            //gridOptions.api.sizeColumnsToFit()
        });

    };


    function insertDefaultColumns(_columnDefs) {
        _columnDefs = [
            { headerName: "Question", field: "question", width: 250, pinned: 'left', cellStyle: { color: 'black', 'font-weight': 'bold', 'white-space': 'normal','border-right': '1px solid #d6d6d6' } },
            //{ headerName: "Actions", field: "abc", width: 260, cellRenderer: renderButtons }, //, cellClass: 'padding-normal'        
            { headerName: "Options", field: "options", width: 150, pinned: 'left', cellRenderer: renderOptions, cellStyle: { 'border-right': '1px solid #d6d6d6' } }];
        return _columnDefs;
    };
    function insertColumnsForJurs(_data, _columnDefs) {
        for (var i = 0; i < _data.jurisdictions.length; i++) {
            var _juridicrionKey = i + 'jur';
            var _temp = {
                headerName: _data.jurisdictions[i], field: _juridicrionKey, cellRenderer: renderAnswers};
            _columnDefs.push(_temp);
        }
        return _columnDefs;
    };

    function createDataForQuestion(_data) {
        var _dataArray = [];
        //var jurisdictionObj = createJursObj(_data.jurisdictions);
        for (var i = 0; i < _data.questions.length; i++) {
            var _temp = {
                question: _data.questions[i].question,
                options: _data.questions[i].options
            };
            for (var j = 0; j < _data.questions[i].answers.length; j++) {
                _temp[j + 'jur'] = _data.questions[i].answers[j];
            }
            _dataArray.push(_temp);
        }
        return _dataArray;

    };

    function renderOptions(params) {
        try {
            var _TemplateContainer = document.createElement('div');
            var _col  = params.column.colId;
            var _some = "";
            for(var i=0; i<params.data.options.length;  i++){
                _some += '<span class="fa fa-square fa-1x font-set" > &nbsp;<span style="font-family: Open Sans, Helvetica Neue,Arial"> ' + (params.data.options[i] || "")+ '</span>'+
                ' </span><br>';

            }

        _TemplateContainer.innerHTML = _some;
            return _TemplateContainer;

        }
        catch (_e) { return ""; }

    };


    $scope.exportReport = function(){

       // $scope.exportToExcel = function () { // ex: '#my-table'
        var exportHref = Excel.tableToExcel('#tableToExport1', 'WireWorkbenchDataExport');
            $timeout(function () {
                var a = document.createElement('a');
                a.href = exportHref;
                a.download = "Survey Report" + ".xls";
                document.body.appendChild(a);
                a.click();
                a.remove();

            }, 100); // trigger download
       // }
    };
    function formattingFunction(params) {
        //console.log(params)
        if ((params.column.getColId().indexOf('jur') != -1 || params.column.getColId() == 'options')  && params.value) {
            var _temppp = '';
            for (var i = 0; i < params.value.length; i++)
            {
                _temppp += params.value[i] + '\n'
            }
            return _temppp;
        } else {
            return params.value;
        }
    }

    function renderAnswers(params) {
        try {
            var _TemplateContainer = document.createElement('div');
            var _col = params.column.colId;
            var _some = '';
            for (var i = 0; i < params.data[_col].length; i++) {
                _some += '<span ng-show="val" class="fa fa-chevron-right"></span>&nbsp;' + (params.data[_col][i] || "") + '<br>';
                '  &nbsp;<br>' +
                    ' </span>';

            }
            _TemplateContainer.innerHTML = _some;
            return _TemplateContainer;

        }
        catch (_e) { return ""; }

    }

    // function createDataForAnswers(_data, _rowDataArray) {
    //     var _dataArray = [];
    //     var jurisdictionObj = createJursObj(_data.jurisdictions);

    //     for (var i = 0; i < _data.questions; i++) {

    //         for (var j = 0; j < _data.questions[i].question; j++) {
    //             _dataArray = _rowDataArray.map(function (_obj) {
    //                 _obj

    //             });
    //         }
    //         _dataArray.push(_temp);
    //     };



    //     return _dataArray;

    // };

    // function createJursObj(_jursdata) {
    //     var _tempjursobj = {};
    //     for (var k = 0; k < _jursdata.length; k++) {
    //         _tempjursobj[k+'jur'] = '';
    //     };
    //     return _tempjursobj;

    // };

    // function renderButtons(params) {
    //     try {
    //         var _TemplateContainer = document.createElement('div');
    //         var _editBtn = '<button class="btn btn-info edit-btn-grid btn-sm" style="margin-right: 10px; background: rgba(122, 218, 16, 0.82)"' +
    //             ' value="' + params.data.id + '"' +
    //             ' border: none;    padding: 4px;" data-toggle="tooltip" data-placement="right" title="Edit details">' +
    //             '  <i class="fa  fa-pencil fa-lg"></i> </button>';
    //         _TemplateContainer.innerHTML = _btns;
    //         return _TemplateContainer;

    //     }
    //     catch (_e) { return ""; }

    // };






};
