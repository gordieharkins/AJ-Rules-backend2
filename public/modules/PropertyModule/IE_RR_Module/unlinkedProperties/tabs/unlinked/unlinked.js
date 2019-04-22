'use strict';

_unlinkedFiles.$inject = ["UnlinkService"];
module.exports = _unlinkedFiles;

//angular.module('AOTC').controller('unlinkedFiles', _unlinkedFiles
//);

function _unlinkedFiles(UnlinkService) {
    ////////console.log("unlinkedFiles controller");

    var vm = this;
    vm.tableData = [];
    $("#preloader").css("display", "block");

    UnlinkService.getUnlinkedFiles()
        .then(function (result) {

            //////console.log("\n=>server result\n");
            // //////console.log(result);
            vm.tableData = result.data.result;
            //////console.log(vm.tableData);

            $("#preloader").css("display", "none");


        }, function (err) {
            $("#preloader").css("display", "none");
            //////console.log("\n=>server error\n");
            //////console.log(err);


        });
}
