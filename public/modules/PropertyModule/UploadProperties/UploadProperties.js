'use strict';


_Properties.$inject = ["UtilService", "$anchorScroll", "$stateParams", "$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "__env", "$log", "AOTCService", "$timeout"];
_upload.$inject = ["$http"];
module.exports = {Properties: _Properties, upload: _upload};

//angular.module('AOTC')
//    .directive('upload', ['$http',
//        _upload
//    ])

//    .controller('Properties', _Properties
//    );
function _upload($http) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        require: '?ngModel',
        template: '<div class="asset-upload">Drag here to upload</div>',
        link: function (scope, element, attrs, ngModel) {

            // Code goes here
            element.on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            element.on('dragenter', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            element.on('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();

                //////console.log(e.originalEvent.dataTransfer.files);
                // if (e.originalEvent.dataTransfer) {
                //     if (e.originalEvent.dataTransfer.files.length > 0) {
                //         upload(e.originalEvent.dataTransfer.files);
                //     }
                // }
                //      for (var i = 0, f; f = files[i]; i++) {
                //     var reader = new FileReader();
                //     reader.readAsArrayBuffer(f);

                //     reader.onload = (function(theFile) {
                //         return function(e) {
                //             var newFile = { name : theFile.name,
                //                 type : theFile.type,
                //                 size : theFile.size,
                //                 lastModifiedDate : theFile.lastModifiedDate
                //             }

                //             scope.addfile(newFile);
                //         };
                //     })(f);
                // }
                return false;
            });
        }
    };
}
function _Properties(UtilService, $anchorScroll, $stateParams, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, __env, $log, AOTCService, $timeout) {
    // //////console.log("Properties controller", $stateParams);
    var vm = this;

    //=========Variables
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('lengthMenu', [
            [20, 50, 100, -1],
            [20, 50, 100, "All"]
        ])
        .withOption('order', [
            [2, 'asc']
        ])
        .withDisplayLength(20);

    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notSortable(),
        DTColumnDefBuilder.newColumnDef(1).notSortable()
    ];
    var userIdls = localStorage.getItem("userId");
    var isAllDataMapped = true;
    var targetDataFields = "";
    var mapping = {};
    var result = [];
    vm.old = $location.hash();

    //=========Attributes

    vm.showTableRelatedDivs = false;
    vm.showFileUploadFields = true;
    vm.mappingNeeded = false;
    vm.checkAll = 0;
    vm.data = 'none';
    vm.myFile = "";
    vm.fileName = "";
    vm.myFile = [];
    vm.propertiesToBeRegistered = [];
    vm.onlyFileName = "";

    //========= Data Mapping page redirected to this logic

    if ($stateParams) {

        if ($stateParams.message == "from data mapping") {

            // //////console.log($stateParams.mappedData);
            vm.showFileUploadFields = false;
            mapping = $stateParams.mappedData.mapping;
            result = $stateParams.mappedData.result;

            $timeout(function() {
                vm.propertiesToBeRegistered = [];

                vm.onlyFileName = localStorage.getItem("onlyFileName");
                vm.propertiesToBeRegistered = result;
                vm.fileName = localStorage.getItem("propertyFileName");
                vm.showTableRelatedDivs = true;
                vm.checkAll = 1;

                // //////console.log(vm.fileName);
                // //////console.log("==> updated propertiesToBeRegistered");
                // //////console.log(vm.propertiesToBeRegistered);
            }, 100);
        }
    }

    //=========Behaviour
    vm.toggleCheckAll = toggleCheckAll;
    vm.toggleState = toggleState;
    vm.SavePropertiesList = SavePropertiesList;
       

    $scope.fileUploaded = function() {
        //-----Properties Attribute END-----
        $scope.$digest();
        var myfiles = {};
        myfiles = document.getElementById('file-1').files;
        if (myfiles.length > 0) {
            $("#preloader").css("display", "block");
            var file = myfiles[0];
            vm.onlyFileName = file.name;
            localStorage.setItem("onlyFileName", vm.onlyFileName);
            var furl = '/properties/uploadPropertyFiles';

            AOTCService.uploadFiles(furl, myfiles)
                .then(function(result) {
                    // //////console.log(result);
                    if (result.data.success) {

                        var receivedData = result.data.result;
                        localStorage.removeItem("targetDataFields");
                        localStorage.setItem("targetDataFields", angular.toJson(receivedData.targetDataFields));

                        if (receivedData.isAllDataMapped) {
                            $timeout(function() {

                                localStorage.removeItem("mapData");
                                localStorage.setItem("propertyFileName", receivedData.fileName);
                                localStorage.setItem("mapData", angular.toJson(receivedData.mapping));
                                vm.checkAll = 1;
                                vm.showTableRelatedDivs = true;
                                vm.propertiesToBeRegistered = receivedData.result;

                            }, 100);

                            $location.hash(vm.old);
                            $location.hash("data");

                            $anchorScroll();
                              
                        } else {

                            // //////console.log('redirect to mapp page=>>')
                            localStorage.removeItem("mapData");
                            localStorage.setItem("propertyFileName", receivedData.fileName);
                            localStorage.setItem("mapData", angular.toJson(receivedData.mapping));
                            $state.go("map_data");

                        }

                        UtilService.clearFile();

                    } else {
                        // //////console.log('corrupt file')
                        //show popoup that unable to upload 
                        // $("div.dangerr").fadeIn(1500).delay(500).fadeOut(500);
                        var msg = result.data.message;
                        $scope.$emit('danger', msg);
                        UtilService.clearFile();
                    }
                    $("#preloader").css("display", "none");
                }, function(result) {

                    $("#preloader").css("display", "none");
                    // //////console.log(result);
                });

        }

    }

    vm.MapData = function() {
        // //////console.log('MapData redirect to mapp page=>>')
        localStorage.removeItem("mapData")
        localStorage.setItem("mapData", angular.toJson(mapping));
        $state.go("map_data");
    }

    function SavePropertiesList() {

        $("#preloader").css("display", "block");
        // var now = new Date;
        // var utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
        //     now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

        var selectedPropertiesList = [];

        for (var i = 0; i < vm.propertiesToBeRegistered.length; i++) {
            var obj = vm.propertiesToBeRegistered[i];
            // //////console.log(obj.state)
            if (obj.state == 1) {
                delete obj.state;
                obj.orgFileName = vm.fileName;
                selectedPropertiesList.push(obj);

            }
        }

        var payLoad = {
            properties: selectedPropertiesList,
            mapping: mapping
        };

        // //////console.log(payLoad);
        var url = '/properties/addPropertiesList';

        AOTCService.postDataToServer(url, payLoad)
            .then(function(result) {

                // //////console.log(result);
                $("#preloader").css("display", "none");
                // $state.go('Registered');
                // $("div.success").fadeIn(1500).delay(500).fadeOut(500);
                if (result.data.success) {
                    $state.go('PropertyList.private_property_list', { propertyListMessage: 'Data saved' });
                } else {
                    //////console.log(result)
                }


            }, function(result) {
                //some error
                $("#preloader").css("display", "none");

                //////console.log(result);
            });
    }

    //////////////////////////////////////ui manipulation////////////////////////////////////////
    function toggleCheckAll() {
        $timeout(function() {

            vm.checkAll = +!vm.checkAll;
            if (vm.checkAll) {
                setDataState(vm.propertiesToBeRegistered, 1);

            } else {
                setDataState(vm.propertiesToBeRegistered, 0);

            }
        }, 100);
        // //////console.log(vm.checkAll);
    }

    function setDataState(users, state) {

        for (var i = 0; i < users.length; i++) {
            users[i].state = state;
        }
    }

    function toggleState(user) {
        user.state = +!user.state;
        vm.checkAll = 0; //future change this one
        //if all user have this state stateof th will be that one also
    }
}

