'use strict';

_viewAJData.$inject = ["User_Config", "$stateParams", "$anchorScroll", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _viewAJData;

//angular.module('AOTC').controller('viewAJData', _viewAJData);

function _viewAJData(User_Config, $stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    //////console.log("viewAJData controller", $stateParams);
    var vm = this;
    vm.tableData = [];
    $scope.$emit('error', "unable to parse")
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withDisplayLength(20)
        .withOption('lengthMenu', [
            [20, 50, 100, -1],
            [20, 50, 100, "All"]
        ])
        .withOption('order', [
            [3, 'desc']
        ])

        .withOption('columnDefs', [{
            'type': 'date-euro',
            'targets': 3
        }]);


    vm.dtColumnDefs = [];

    $('#preloader').css('display', 'block');

    AOTCService.getDataFromServer('/aJRules/getAllSurveysMetaData')
        .then(function (result) {
            //////console.log(result);
            var ServerData = result.data;
            if (ServerData.success) {
                vm.tableData = ServerData.result;
                if (vm.tableData.length == 0) {
                    $scope.$emit('error', User_Config.NO_DATA)
                }

            }
            $('#preloader').css('display', 'none');

        }, function (result) {
            //////console.log(result);
            $('#preloader').css('display', 'none');


        });

    angular.element(document).ready(function () {
        $.extend($.fn.dataTableExt.oSort, {
            "date-euro-pre": function (a) {
                return moment(a, 'DD-MM-YYYY HH:mm');
            },

            "date-euro-asc": function (a, b) {
               
                if (a.isBefore(b))
                    return -1;
                else if (b.isBefore(a))
                    return 1;
                else
                    return 0;
            },

            "date-euro-desc": function (a, b) {

                if (a.isBefore(b))
                    return 1;
                else if (b.isBefore(a))
                    return -1;
                else
                    return 0;
            }
        });
    });



}