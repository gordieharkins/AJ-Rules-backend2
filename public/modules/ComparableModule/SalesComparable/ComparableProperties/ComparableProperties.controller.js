'use strict';

_ComparableProperties.$inject = ["ComparablePropService", "User_Config", "$timeout", "$scope", "$state"];
module.exports = _ComparableProperties;


//angular.module('AOTC')
//    .controller('ComparableProperties', _ComparableProperties
//   );

function _ComparableProperties(ComparablePropService, User_Config, $timeout, $scope, $state) {

    ////console.log("ComparableProperties controller");
    var vm = this;

    var propertyDetails = JSON.parse(localStorage.getItem('propertyDetails'));
    vm.address = propertyDetails.streetAddress;

    vm.zillowData = [];
    vm.imageArr = [];
    vm.flipBack = flipBack;
    vm.flipFront = flipFront;

    vm.addComparables = addComparables;
    vm.getZillowPropImage = getZillowPropImage;
    var userRole = localStorage.getItem('role');

    if (userRole === "Residential User") {
        $("#preloader").css('display', 'block');

        ComparablePropService.getZillowProperties()
            .then(function (result) {
                $("#preloader").css('display', 'none');
                var serverData = result.data;
                if (serverData.success) {
                    vm.zillowData = serverData.result;
                    $timeout(function () {
                        initializeCards();
                    }, 200);
                    ////console.log("vm.zillowData.comparables", vm.zillowData.comparables);

                    // set property Images crawling from Zillow and get from db if exists
                    setPropertyImages(vm.zillowData.comparables);
                } else {
                    $scope.$emit('error', serverData.message);
                }
            },
                function (err) {
                    ////console.log(err);
                });
    } else {
        ////console.log("Commercial User");
    }

    function initializeCards() {
        var localStorageZillowData = JSON.parse(localStorage.getItem('zillowData'));

        var localStorageComparables = [];
        if (localStorageZillowData) {
            localStorageComparables = localStorageZillowData.comparables;
        }

        for (var i = 0; i < localStorageComparables.length; i++) {
            var lsComparable = localStorageComparables[i];
            var found = -1;

            for (var k = 0; k < vm.zillowData.comparables.length; k++) {
                var serverComparable = vm.zillowData.comparables[k];
                if (serverComparable.zpid == lsComparable.zpid) {
                    found = k;
                    vm.zillowData.comparables[k] = lsComparable;
                }
            }
            if (found == -1) {
                vm.zillowData.comparables.push(lsComparable);
            }
        }
        var arr = vm.zillowData.comparables;
        arr = sortByKey(arr, 'selection');
        vm.zillowData.comparables = arr;
        // ////console.log(arr);

        $timeout(function () {
            for (var i = 0; i < vm.zillowData.comparables.length; i++) {
                var id = '#card_' + i;
                $(id).flip({
                    trigger: 'manual'
                });
            }
        }, 100);
    }

    function addComparables() {

        var selectedComparables = [];

        for (var i = 0; i < vm.zillowData.comparables.length; i++) {
            if (vm.zillowData.comparables[i].selection) {
                selectedComparables.push(vm.zillowData.comparables[i]);
            }
        }

        if (selectedComparables.length > 0) {
            ////console.log("selectedComparables", selectedComparables);
            var jsonData = {
                principal: vm.zillowData.principal[0],
                comparables: selectedComparables
            }
            localStorage.removeItem('zillowData');
            localStorage.setItem('zillowData', angular.toJson(jsonData));
            $state.go('selectedComparable');
        } else {
            $scope.$emit('error', 'Please select some properties.');
        }
    }

    function setPropertyImages(comps) {
        for (var i = 0; i < comps.length; i++) {
            var comp = vm.zillowData.comparables[i];
            // if the image is locally saved then don't get its new link
            if (comp.imageFileName === undefined) {

                getZillowPropImage(comp.linksHomeDetails, i);
            } else if (!comp.imageFileName.indexOf('PropertyImages')) {

                getZillowPropImage(comp.linksHomeDetails, i);
            } else {
                ////console.log("Nothing");
            }
        }
    }

    function getZillowPropImage(propertyLink, index) {
        ComparablePropService.getZillowPropImage(propertyLink)
            .then(function (result) {

                var serverData = result.data;
                if (serverData.success) {
                    vm.zillowData.comparables[index].imageFileName = serverData.result.mainImage;
                    ////console.log(serverData.result.mainImage)
                    $('#mydiv').hide();
                }
            },
                function (err) {
                    ////console.log(err);
                });
    }

    function imagePreLoader() {

    }

    function flipBack(id) {
        $(id).flip(false);
    }

    function flipFront(id) {
        $(id).flip(true);
    }

    // Sort already selected comps to top
    function sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            if (x == undefined) {
                x = false;
            }

            var y = b[key];
            if (y == undefined) {
                y = false;
            }
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
}
