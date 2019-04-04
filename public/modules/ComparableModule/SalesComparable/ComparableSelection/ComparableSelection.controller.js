'use strict';

_ComparableSelection.$inject = ["ComparableSelectionService", "User_Config", "$state"];
module.exports = _ComparableSelection;

//angular.module('AOTC')
//    .controller('ComparableSelection', _ComparableSelection
//    );

function _ComparableSelection(ComparableSelectionService, User_Config, $state) {
    //////console.log("ComparableSelection controller");
    var vm = this;

    vm.showResidentialProps = true;
    var propertyDetails = JSON.parse(localStorage.getItem('propertyDetails'));
    vm.mainImage = propertyDetails.imageFileName;

    if (vm.mainImage == undefined || vm.mainImage == null) {
        vm.mainImage = "assets/img/noImageAvailable.jpg";
    }
    var userRole = localStorage.getItem('role');
    localStorage.removeItem('zillowData');

    if (userRole == User_Config.RESIDENTIAL_USER) {
        vm.showResidentialProps = false;
        getSavedComparables();
    }

    vm.gotoResidentialProps = gotoResidentialProps;
    vm.gotoCommercialProps = gotoCommercialProps;

    function getSavedComparables() {
        //$("#preloader").css('display', 'block');
        //getSavedComparables if exists saved comparable then redirect to comparison

        $state.go('selectedComparable');

        //ComparableService.getComparables(1).
        //then(function (result) {
        //    ////console.log('getSavedComparables : ', result);
        //    var serverData = result.data;

        //    if (serverData.success) {
        //        if (serverData.result.subjectProperty) {


        //            // if (serverData.success) {
        //            if (serverData.result.highProperties.length > 0) {
        //                var _temp = [];
        //                try {
        //                    for (var i = 0; i < serverData.result.highProperties.length; i++) {
        //                        serverData.result.highProperties[i].properties.selection = true;
        //                        serverData.result.highProperties[i].properties['propertyType'] = 'H';
        //                        _temp.push(serverData.result.highProperties[i].properties);
        //                    }
        //                    for (var i = 0; i < serverData.result.lowProperties.length; i++) {
        //                        _temp.push(serverData.result.lowProperties[i].properties);
        //                        serverData.result.lowProperties[i].properties['propertyType'] = 'L';
        //                        serverData.result.lowProperties[i].properties.selection = true;
        //                    }
        //                }
        //                catch (_e)
        //                {
        //                }

        //                serverData.result.principal = serverData.result.subjectProperty;

        //                serverData.result.comparables = _temp;

        //                localStorage.setItem('zillowData', angular.toJson(serverData.result))
        //                $state.go('selectedComparable');
        //                $("#preloader").css('display', 'none');
        //            } else {

        //                getDeepSearchResult();
        //            }
        //            //}


        //            //vm.selectedComparables = serverData.result;
        //            //vm.PrinciplePropDataDetail = {
        //            //    Jurisdiction: serverData.result.subjectProperty.jurisdictionData,
        //            //    Zillow: serverData.result.subjectProperty.zillowData
        //            //}

        //            //serverData.result.principal = serverData.result.principal[0];
        //            //localStorage.setItem('zillowData', angular.toJson(serverData.result))
        //            //$state.go('selectedComparable');
        //            $("#preloader").css('display', 'none');
        //        } else {

        //            getDeepSearchResult();
        //            $('#preloader').css('display', 'none');
        //        }
        //    }
        //}, function (err) {
        //    //console.log('err : ', err);
        //    $('#preloader').css('display', 'none');
        //})

        //ComparableSelectionService.getSavedComparables().
        //then(function (result) {
        //    //console.log('getSavedComparables : ', result);
        //    var serverData = result.data;

        //    if (serverData.success) {
        //        if (serverData.result.comparables.length > 0) {
        //            for (var i = 0; i < serverData.result.comparables.length; i++) {
        //                serverData.result.comparables[i].selection = true;
        //            }
        //            serverData.result.principal = serverData.result.principal[0];
        //            localStorage.setItem('zillowData', angular.toJson(serverData.result))
        //            $state.go('selectedComparable');
        //            $("#preloader").css('display', 'none');
        //        } else {

        //            getDeepSearchResult();
        //        }
        //    }
        //}, function (err) {
        //    //console.log('err : ', err);
        //})

        //ComparableSelectionService.getSavedComparables().
        //then(function (result) {
        //    //console.log('getSavedComparables : ', result);
        //    var serverData = result.data;

        //    if (serverData.success) {
        //        if (serverData.result.comparables.length > 0) {
        //            for (var i = 0; i < serverData.result.comparables.length; i++) {
        //                serverData.result.comparables[i].selection = true;
        //            }
        //            serverData.result.principal = serverData.result.principal[0];
        //            localStorage.setItem('zillowData', angular.toJson(serverData.result))
        //            $state.go('selectedComparable');
        //            $("#preloader").css('display', 'none');
        //        } else {

        //            getDeepSearchResult();
        //        }
        //    }
        //}, function (err) {
        //    //console.log('err : ', err);
        //})

    }

    function gotoResidentialProps() {
        $state.go('comparableProperties');
    }

    function gotoCommercialProps() {
        $state.go('comparableProperties');
    }

    //getSavedComparables if exists saved comparable then redirect to comparison
    function getDeepSearchResult() {
        ComparableSelectionService.getDeepSearchResult().
        then(function (result) {
            //console.log(result);
            var serverData = result.data;

            if (serverData.success) {

                if (serverData.result) {
                    serverData.result.principal = serverData.result.principal[0];
                    serverData.result.comparables = [];
                    vm.PrinciplePropData = serverData.result.principal;
                    localStorage.setItem('zillowData', angular.toJson(serverData.result))
                }
            }
            $("#preloader").css('display', 'none');
        }, function (err) {
            //console.log('err : ', err);
        })
    }
    vm.gotoCreateComprables = gotoCreateComprables;

    function gotoCreateComprables() {

        $state.go('createPrincipalForm');

    }
}
