'use strict';

_Map.$inject = ["$stateParams", "$anchorScroll", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _Map;

//angular.module('AOTC').controller('Map', _Map
//    );

function _Map($stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $http, __env, $log, AOTCService, $timeout) {
    //////console.log("Data Mapping controller");
    var vm = this;
    vm.fileName = localStorage.getItem("onlyFileName");

    // vm.targetFields = ["LAND USE CODE", "ZONING ", "ACCOUNT NUMBER ", "OWNER NAME ", "OWNER ADDRESS ", "OWNER CITY ", "OWNER STATE ", "OWNER ZIP ", "STREET NUMB ", "STREET DIRN ", "STREET NAME ", "STREET TYPE"];

    // Variables
    var targetDataFields = JSON.parse(localStorage.getItem("targetDataFields"));
    var mapping = JSON.parse(localStorage.getItem("mapData"));

    // ////console.log("targetDataFields: ",targetDataFields);
    // ////console.log("mapping: ",mapping);

    // Attributes
    vm.mappedData = mapping;
    vm.targetFields = targetDataFields.split('|');


    // Behaviour
    vm.completeMapping = function () {
        $("#preloader").css("display", "block");

        var url = '/properties/MapPropertiesData?userId=' + localStorage.getItem("userId");

        var formatedMapping = {
            mapping: vm.mappedData,
            fileName: vm.fileName
        };

        // ////console.log("formatedMapping: ",formatedMapping);

        AOTCService.postDataToServer(url, formatedMapping)
            .then(function (result) {
                $("#preloader").css("display", "none");
                ////console.log(result);

                if (result.data.success) {
                    //go to task manager
                    $state.go('TaskManager');

                } else {
                    ////console.log('show some error');
                }
            }, function (result) {
                $("#preloader").css("display", "none");
                ////console.log(result);
            }
        );
    }

    setTimeout(function () {
        var c = {};
        $(".inventor").draggable({
            helper: "clone",
            start: function (event, ui) {
                c.tr = this;
                c.helper = ui.helper;
            }
        });
        $(".invention").droppable({
            drop: function (event, ui) {
                var inventor = ui.draggable.text().trim();
                $(this).find("input").val(inventor);
                $(c.tr).add();
                $(c.helper).add();
                var key = event.target.getAttribute("id")
                vm.mappedData[key] = inventor;
                // ////console.log(vm.mappedData)
            }
        });
    }, 10);
}
