'use strict';

//_main.$inject = ["User_Config", "$state", "$rootScope", "mainService", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", $http", "__env", "$log", "AOTCService", "$timeout"];
//module.exports = _main;

angular.module('AOTC').controller('main',
    function _main(User_Config, $state, $rootScope, mainService, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
        //////console.log("main controller");

        var vm = this;
        $scope.vm;
        //////console.log(User_Config);

        $('#preloader').css('display', 'block');
        setTimeout(function () {

            if (!localStorage.getItem('userJson')) {
                $state.go('login');
            } else {

                var userData = JSON.parse(localStorage.getItem('userJson'));
                $rootScope.userId = $rootScope.userId;
                //////console.log(userData);
                localStorage.setItem("userId", userData.userId);
                //////console.log('emit event')
                localStorage.setItem('role', userData.userData.role);
                $scope.$emit('userRole', userData.userData.role);


            }
            $('#preloader').css('display', 'none');

        }, 2000);
        //-------------------Service CALL-------------------------------------------//
        loadRemoteData();
        var propsData;
        // function getPropertyData(data){
        //     return data;
        // }
        function applyRemoteData(newProps) {

            ///$scope.newProps = newProps.result;
            vm.propertyData = newProps.result.data;
            //////console.log("=========>>>", vm.propertyData.length);
            // vm.propertyData = getPropertyData(newProps.result.data);
            propsData = newProps.result.data;
        }

        function loadRemoteData() {
            // The friendService returns a promise.
            mainService.getProps()
                .then(
                    function (Props) {
                        //////console.log("All geted Propertiess", Props);
                        applyRemoteData(Props);

                    }
                );
        }


        vm.searchFieldRequired = false;
        vm.searchProperty = {
            accNo: '',
            address: '',
            ownerName: ''
        };
        vm.markerWindowShow = false;
        vm.selectedMarker = {};
        vm.markerId = 0;


        vm.windowOptions = {
            zIndex: 8,
            pixelOffset: {
                height: -35,
                width: 0
            }
        };
        vm.infoWindow = {};

        vm.closeMarkerWindow = closeMarkerWindow;

        var dates = ["07/05/2016", "08/02/2016", "09/02/2016", "10/02/2016", "01/02/2017"];
        var datesAppeal = ["10/01/2016", "12/02/2016", "01/10/2017", "05/01/2017", "08/02/2017"];


        vm.appealSlider = {
            minValue: datesAppeal[0],
            maxValue: datesAppeal[4], // or new Date(2016, 7, 10) is you want to use 
            options: {
                floor: 0,
                ceil: 100,
                stepsArray: datesAppeal,
                translate: function (date) {
                    if (date != null)
                        return date
                    // return '' + date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear() ;
                    return '';
                },

                onEnd: function (id) {



                    var exists = false;
                    for (var i = 0; i < vm.selectedFilters.length; i++) {
                        if (vm.selectedFilters[i].attribute == 'Appeal Filter')
                            exists = true;
                    }
                    if (!exists)
                        vm.selectedFilters.push({
                            "name": 'Next Appeal Date',
                            "attribute": 'Appeal Filter',
                        });
                    filterData();

                }


            }
        };
        vm.assesmentSlider = {
            minValue: dates[0],
            maxValue: dates[4], // or new Date(2016, 7, 10) is you want to use 
            options: {
                floor: 0,
                ceil: 100,
                stepsArray: dates,
                translate: function (date) {
                    if (date != null)
                        return date
                    return '';
                },
                onEnd: function (id) {
                    var exists = false;
                    for (var i = 0; i < vm.selectedFilters.length; i++) {
                        if (vm.selectedFilters[i].attribute == 'Assessment Filter')
                            exists = true;
                    }
                    if (!exists)
                        vm.selectedFilters.push({
                            "name": 'Last Assessment Date',
                            "attribute": 'Assessment Filter',
                        });
                    filterData();
                }



            }
        };


        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(20)
            .withOption('lengthMenu', [
                [20, 50, 100, -1],
                [20, 50, 100, "All"]
            ])
            .withColumnFilter({
                aoColumns: [{
                    type: 'text'
                }, {
                    type: 'text'
                }, {
                    type: 'text'
                }, {
                    type: 'text'
                }, {
                    type: 'text'
                }, {
                    type: 'text'
                }, {
                    type: 'text'
                }, {
                    type: 'text'
                }]
            })
            .withButtons([{
                extend: 'colvis',
                postfixButtons: [{ extend: 'colvisRestore', text: 'Restore All' }],
                text: 'Show More',
                className: 'moreButtonDT'
            }, {
                extend: 'print',
                text: '<i class="fa fa-print"></i>',
                titleAttr: 'print'
            }, {
                extend: 'copyHtml5',
                text: '<i class="fa fa-files-o"></i>',
                titleAttr: 'Copy'
            }, {
                extend: 'excelHtml5',
                text: '<i class="fa fa-file-excel-o"></i>',
                titleAttr: 'Excel'
            }, {
                extend: 'pdfHtml5',
                text: '<i class="fa fa-file-pdf-o"></i>',
                titleAttr: 'PDF'
            }]);
        vm.apealStatusFilter = [];
        var expanded = false;
        vm.filteredPropertyData = [];

        vm.map;
        vm.mapOptions;
        vm.locations = [];

        vm.dtColumnDefs = [];
        vm.selectedFilters = [];



        vm.toggleImage = toggleImage;
        vm.toggleFilters = toggleFilters; //expand or hide "filters with checkboxes"
        vm.selectFilter = selectFilter;
        vm.selectAllFilters = selectAllFilters;
        vm.checkToggle = checkToggle;
        vm.toggleImageDrawer = toggleImageDrawer;
        vm.menuImageRotate = menuImageRotate;
        vm.removeFilter = removeFilter;
        vm.markerClick = markerClick;




        // vm.uniqueTableData = getPropertyData();
        vm.uniqueTableData = propsData;
        initializeFilters(vm);
        // vm.propertyData = getPropertyData();
        vm.propertyData = propsData;
        //////console.log("abc==>", vm.propertyData)
        vm.findProperty = findProperty;
        // vm.showAdvanceModal             = showAdvanceModal;
        vm.filteredAppealData = [];



        function findProperty() {
            initializeFilters(vm);
            vm.selectedFilters = [];
            vm.markerWindowShow = false;

            // //////console.log('findProperty');
            // //////console.log(vm.searchProperty);
            //vm.vm.uniqueTableData//find on filtered Data;
            var accNoMatch = [];
            var addressMatch = [];
            var nameMatch = [];
            // if(vm.filteredAppealData.length == 0){
            //     vm.uniqueTableData = getPropertyData();

            // }

            //////////////////////////////////////////////////////////////////////////////////////////////////


            if (vm.searchProperty.accNo.length > 0) {

                for (var i = 0; i < vm.propertyData.length; i++) {
                    var prop = vm.propertyData[i];
                    //////console.log('index of')
                    // //////console.log(prop.accNo.toLowerCase().indexOf(vm.searchProperty.accNo.toLowerCase()))

                    if (prop.accNo.toLowerCase().indexOf(vm.searchProperty.accNo.toLowerCase()) > -1) {
                        accNoMatch.push(prop);
                    }
                }

            } else {

                accNoMatch = vm.propertyData;
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////



            if (vm.searchProperty.address.length > 0) {

                for (var i = 0; i < accNoMatch.length; i++) {
                    var prop = accNoMatch[i];

                    if (prop.propertyAddress.toLowerCase().indexOf(vm.searchProperty.address.toLowerCase()) > -1) {
                        addressMatch.push(prop);
                    }
                }

            } else {

                addressMatch = accNoMatch;

            }




            //////////////////////////////////////////////////////////////////////////////////////////////////

            if (vm.searchProperty.ownerName.length > 0) {

                for (var i = 0; i < addressMatch.length; i++) {
                    var prop = addressMatch[i];

                    if (prop.ownerName.toLowerCase().indexOf(vm.searchProperty.ownerName.toLowerCase()) > -1) {
                        nameMatch.push(prop);
                    }
                }

            } else {

                nameMatch = addressMatch;
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////

            vm.uniqueTableData = [];
            vm.uniqueTableData = nameMatch;

            // //////console.log('total data\n', vm.uniqueTableData);
            setTimeout(function () {
                vm.searchProperty = {
                    accNo: '',
                    address: '',
                    ownerName: ''
                };

            }, 10);
            showSelectedMarkers();
        }



        vm.map = {
            center: {
                latitude: 39.551210,
                longitude: -77.740677
            },
            showOverlay: true,
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var mapStyleArray = [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] }];
        vm.mapOptions = {
            styles: mapStyleArray,
            maxZoom: 15
        };

        //fetchin marker from .dummy data
        //////console.log("marker===>", vm.propertyData);
        for (var i = 0; i < vm.propertyData.length; i++) {
            // //////console.log(vm.propertyData[i]);
            var infowWindowDetails = {
                propertyName: vm.propertyData[i].propertyName,
                appealStatus: vm.propertyData[i].appealStatus,
                meritToAppealDetail: vm.propertyData[i].meritToAppealDetail
            };
            var marker = {
                id: vm.markerId++,
                coords: {
                    latitude: parseFloat(vm.propertyData[i].lat),
                    longitude: parseFloat(vm.propertyData[i].lng)
                },
                description: infowWindowDetails, //// title:"<h1>Marker 0</h1><p>This is the home marker.</p>",
                options: {
                    draggable: false,
                    icon: "assets/img/" + vm.propertyData[i].meritToAppeal + ".png"
                }

            }

            vm.locations.push(marker);
        }
        //making

        function closeMarkerWindow() {
            //////console.log('close window');
            vm.markerWindowShow = false;

        }

        function markerClick(marker) {
            //////console.log('marker click method');

            vm.selectedMarker = {};
            vm.selectedMarker = marker.model;
            //////console.log('selectedMarker ', vm.selectedMarker.coords);

            // vm.map.center.latitude  =       vm.selectedMarker.coords.latitude;
            // vm.map.center.longitude =       vm.selectedMarker.coords.longitude;
            vm.markerWindowShow = true;

        }

        function removeFilter(filter) {

            //////console.log(filter);

            switchFilterState(vm.meritFilter, filter);
            switchFilterState(vm.designeeFilter, filter);
            switchFilterState(vm.apealStatusFilter, filter);

            for (var i = vm.jurisdictionFilter.filters.length - 1; i >= 0; i--) {

                switchFilterState(vm.jurisdictionFilter.filters[i], filter);

            }

            if (filter.attribute == 'Assessment Filter') {

                vm.assesmentSlider.minValue = dates[0];
                vm.assesmentSlider.maxValue = dates[4];

            }

            if (filter.attribute == 'Appeal Filter') {

                vm.appealSlider.minValue = datesAppeal[0];
                vm.appealSlider.maxValue = datesAppeal[4];

            }
            //asdasd

            for (var i = 0; i < vm.selectedFilters.length; i++) {

                if (vm.selectedFilters[i].name == filter.name) {

                    vm.selectedFilters.splice(i, 1);

                }
            }

            //////console.log('\n==>all filters ');
            //////console.log(vm.selectedFilters);

            if (vm.selectedFilters.length == 0) {
                $('#myModal').modal('toggle');
            }

            filterData();
        }

        function switchFilterState(myfilters, filter) {

            for (var i = 0; i < myfilters.filters.length; i++) {
                var myfilter = myfilters.filters[i];
                if (myfilter.name == filter.name) {
                    myfilter.state = +!myfilter.state;
                }
            }




        }


        function selectFilter(filter, attribute) {

            // attribute= angular.toJson(attribute);

            //////console.log('select Filters type ' + attribute);
            //////console.log(filter);
            filter.state = +!filter.state

            if (filter.state) {
                vm.selectedFilters.push({
                    "name": filter.name,
                    "attribute": attribute,
                    "value": (filter.value) ? "" + filter.value : ''
                });

            } else {

                for (var i = 0; i < vm.selectedFilters.length; i++) {

                    if (vm.selectedFilters[i].name == filter.name) {
                        vm.selectedFilters.splice(i, 1);
                    }
                }


            }

            //////console.log('\n==>all filters ');
            //////console.log(vm.selectedFilters);

            filterData();



        }

        ////////////////////////////////////         methods for Filters                             ///////////////////////////////
        function selectAllFilters(filterArray, attribute) {

            //////console.log('select all', filterArray);
            filterArray.state = +!filterArray.state;

            if (filterArray.state) {
                for (var i = 0; i < filterArray.filters.length; i++) {

                    if (filterArray.filters[i].state != 1) {
                        //if filter is not active
                        filterArray.filters[i].state = 1;

                        vm.selectedFilters.push({
                            "name": filterArray.filters[i].name,
                            "attribute": attribute
                        });
                    }



                }



                //////console.log('all filters ');
                //////console.log(vm.selectedFilters);

            } else {


                for (var i = 0; i < filterArray.filters.length; i++) {

                    filterArray.filters[i].state = 0;


                    for (var k = 0; k < vm.selectedFilters.length; k++) {

                        if (vm.selectedFilters[k].name == filterArray.filters[i].name) {
                            vm.selectedFilters.splice(k, 1);
                        }
                    }




                }

                //////console.log('all filters ');
                //////console.log(vm.selectedFilters);






            }

            filterData();

        }

        function filterData() {
            vm.searchProperty = {
                accNo: '',
                address: '',
                ownerName: ''
            };
            vm.selectedMarker = {};
            var designee = "";
            var meritToAppeal = "";
            var status = "";
            var state = "";


            for (var i = 0; i < vm.selectedFilters.length; i++) {

                var filter = vm.selectedFilters[i];

                if (filter.attribute == 'meritToAppeal') {

                    if (meritToAppeal.length == 0) {
                        meritToAppeal = "" + filter.value;
                    } else {

                        meritToAppeal = meritToAppeal + "," + filter.value;
                    }

                }


                if (filter.attribute == 'designee') {

                    if (designee.length == 0) {
                        designee = filter.name;
                    } else {

                        designee = designee + "," + filter.name;
                    }

                }

                if (filter.attribute == 'appealStatus') {

                    if (status.length == 0) {
                        status = filter.name;

                    } else {

                        status = status + "," + filter.name;


                    }
                }

                if (filter.attribute == 'jurisdiction') {

                    if (state.length == 0) {
                        state = filter.name;
                    } else {

                        state = state + "," + filter.name;


                    }
                }

            }

            //////console.log("desig == " + designee);
            //////console.log("status == " + status);
            //////console.log("state == " + state);
            //////console.log("meritToAppeal == " + meritToAppeal);


            vm.filteredMeritToAppealProperty = [];
            // No designe.
            if (meritToAppeal.length == 0) {

                vm.filteredMeritToAppealProperty = vm.propertyData;

            } else {

                for (var k = 0; k < vm.propertyData.length; k++) {

                    var property = vm.propertyData[k];

                    if (meritToAppeal.indexOf(property.meritToAppeal) >= 0) {

                        vm.filteredMeritToAppealProperty.push(property);
                    }

                }

            }



            //////////////////////////////////////////////////////////////////////////////////
            vm.filteredPropertyData = [];
            // No designe.
            if (designee.length == 0) {

                vm.filteredPropertyData = vm.filteredMeritToAppealProperty;

            } else {

                for (var k = 0; k < vm.filteredMeritToAppealProperty.length; k++) {

                    var property = vm.filteredMeritToAppealProperty[k];

                    if (designee.indexOf(property.designee) >= 0) {

                        vm.filteredPropertyData.push(property);
                    }

                }

            }

            //////////////////////////////////////////////////////////////////////////////////////
            vm.filteredDesigneeData = [];

            if (status.length == 0) {

                vm.filteredDesigneeData = vm.filteredPropertyData;

            } else {

                for (var k = 0; k < vm.filteredPropertyData.length; k++) {
                    var property = vm.filteredPropertyData[k];
                    if (status.indexOf(property.appealStatus) >= 0) {

                        vm.filteredDesigneeData.push(property);
                    }
                }
            }


            vm.filteredStatusData = [];


            if (state.length == 0) {

                vm.filteredStatusData = vm.filteredDesigneeData;

            } else {

                for (var k = 0; k < vm.filteredDesigneeData.length; k++) {

                    var property = vm.filteredDesigneeData[k];


                    if (state.indexOf(property.jurisdiction.laws) >= 0) {

                        vm.filteredStatusData.push(property);
                    }

                }
            }

            vm.filteredAssessmentData = [];


            for (var k = 0; k < vm.filteredStatusData.length; k++) {

                var property = vm.filteredStatusData[k];

                // //////console.log("assessment" + property.jurisdiction.laws);

                var propertyAssesmentDate = new Date(property.lastAssessment);

                var startDate = new Date(vm.assesmentSlider.minValue);
                var endDate = new Date(vm.assesmentSlider.maxValue);

                // //////console.log('start date', startDate)
                // //////console.log('endDate date', endDate)
                // //////console.log('propertyAssesmentDate date', propertyAssesmentDate)

                if (propertyAssesmentDate >= startDate && propertyAssesmentDate <= endDate) {
                    // //////console.log('assessment match', propertyAssesmentDate)
                    vm.filteredAssessmentData.push(property);

                }



            }


            vm.filteredAppealData = [];


            for (var k = 0; k < vm.filteredAssessmentData.length; k++) {

                var property = vm.filteredAssessmentData[k];

                // //////console.log("assessment" + property.jurisdiction.laws);

                var propertyAssesmentDate = new Date(property.nextAppealDate);

                var startDate = new Date(vm.appealSlider.minValue);
                var endDate = new Date(vm.appealSlider.maxValue);

                // //////console.log('start date', startDate)
                // //////console.log('endDate date', endDate)
                // //////console.log('propertyAssesmentDate date', propertyAssesmentDate)

                if (propertyAssesmentDate >= startDate && propertyAssesmentDate <= endDate) {
                    // //////console.log('assessment match', propertyAssesmentDate)
                    vm.filteredAppealData.push(property);

                }

            }

            //////console.log('\nfiltered propertyData filteredStatus', vm.filteredAppealData);
            vm.uniqueTableData = [];
            vm.uniqueTableData = vm.filteredAppealData;
            showSelectedMarkers();


        }

        function showSelectedMarkers() {

            vm.locations = [];

            for (var i = 0; i < vm.uniqueTableData.length; i++) {

                var infowWindowDetails = {
                    propertyName: vm.uniqueTableData[i].propertyName,
                    appealStatus: vm.uniqueTableData[i].appealStatus,
                    meritToAppealDetail: vm.uniqueTableData[i].meritToAppealDetail
                };

                var marker = {
                    id: vm.markerId++,
                    coords: {
                        latitude: vm.uniqueTableData[i].lat,
                        longitude: vm.uniqueTableData[i].lng
                    },
                    description: infowWindowDetails, //// title:"<h1>Marker 0</h1><p>This is the home marker.</p>",
                    options: {
                        draggable: false,
                        icon: "assets/img/" + vm.uniqueTableData[i].meritToAppeal + ".png"
                    }

                };


                vm.locations.push(marker);
            }

            // vm.map.zoom = 4;
        }

        ////////////////////////////////////         methods for UI manipulations                   ///////////////////////////////

        //for static check boxes state toggling

        // function showAdvanceModal(event){

        //     // $('#advanceModal').dropdown('toggle');
        //     vm.searchFieldRequired = !vm.searchFieldRequired;

        // }

        function checkToggle(event) {

            //////console.log('checked toggle')
            if ($(event.target).children().is(':checked')) {
                $(event.target).children().prop('checked', false);

            } else {
                $(event.target).children().prop('checked', true);

            }


        }

        function toggleImageDrawer() {


            if ($('#drawer-handle').children().hasClass('fa fa-backward')) {

                $('#drawer-handle').children().removeClass('fa fa-backward')
                $('#drawer-handle').children().addClass('fa fa-forward')

            } else {
                $('#drawer-handle').children().removeClass('fa fa-forward')
                $('#drawer-handle').children().addClass('fa fa-backward')
            }
        }



        function toggleImage(event) { //toggle menu arrow and expand body on clicking label

            if ($(event.target).children().hasClass('rotatedown')) {
                $(event.target).children().removeClass('rotatedown');
                $(event.target).children().addClass('rotateup');
            } else {
                $(event.target).children().addClass('rotatedown');
                $(event.target).children().removeClass('rotateup');


            }
            $(event.target).parent().children('ul.tree').toggle(500);
        }

        function menuImageRotate(event) {
            if ($(event.target).hasClass('rotatedown')) {
                $(event.target).removeClass('rotatedown');
                $(event.target).addClass('rotateup');
            } else {
                $(event.target).addClass('rotatedown');
                $(event.target).removeClass('rotateup');


            }
            $(event.target).parent().next('ul.tree').toggle(500);
        }



        function toggleFilters(event) {

            $(event.target).parent().children('ul.tree').toggle(500);
        }


        function initializeFilters(vm) {

            vm.meritFilter = {
                name: 'Merit to Appeal',
                filters: [{
                    name: 'Good Merit',
                    value: 1,
                    state: 0
                }, {
                    name: 'Marginal',
                    value: 2,
                    state: 0
                }, {
                    name: 'No Apparent Merit',
                    value: 3,
                    state: 0
                }]
            };


            vm.designeeFilter = {
                name: 'DESIGNEE',
                filters: [{
                    name: 'Joey Tribbiani',
                    state: 0
                }, {
                    name: 'Jacks Teller',
                    state: 0
                }]
            };


            vm.apealStatusFilter = {
                name: 'APPEAL STATUS',
                filters: [

                    {
                        name: 'No Appeal Yet',
                        state: 0
                    }, {
                        name: 'Appeal Rejected',
                        state: 0
                    }, {
                        name: 'No Further Appeal',
                        state: 0
                    }, {
                        name: 'Appeal In Progress',
                        state: 0
                    }
                ]
            };

            vm.jurisdictionFilter = {
                name: 'JURISDICTIONs',
                filters: [

                    {
                        name: 'Maryland',
                        state: 0,
                        filters: [{
                            name: 'Montgomery',
                            state: 0
                        }]

                    }, {
                        name: 'Virginia',
                        state: 0,
                        filters: [{
                            name: 'Fairfax City',
                            state: 0
                        }, {
                            name: 'Fairfax County',
                            state: 0
                        }]

                    }

                ]
            };
        }

        // function getPropertyData() {
        //     var data = [{
        //             ownerName: "Reality Partners LLC",
        //             accNo: "XV-00923769386348",
        //             propertyAddress: "1st Bank Street",
        //             propertyName: "TwinBrook Metro Plaza",
        //             lat: "39.105517",
        //             lng: "-76.934239",
        //             designee: "Joey Tribbiani",
        //             appealStatus: "No Appeal Yet",
        //             lastAssessment: "01/02/2017",
        //             nextAppealDate: "05/01/2017",
        //             meritToAppeal: 1,
        //             meritToAppealDetail: 'Good Merit',
        //             jurisdiction: {
        //                 name: "Maryland",
        //                 laws: "Montgomery"
        //             }
        //         },
        //         // Data 2
        //         {
        //             ownerName: "Reality Partners LLC",
        //             accNo: " XV-00923769386349",
        //             propertyAddress: "401 N Washington St",
        //             propertyName: "Glenrock JV",
        //             lat: "39.002206",
        //             lng: "-77.206665",
        //             designee: "Joey Tribbiani",
        //             appealStatus: "No Further Appeal",
        //             lastAssessment: "09/02/2016",
        //             nextAppealDate: "12/02/2016",
        //             meritToAppeal: 2,
        //             meritToAppealDetail: 'Marginal',
        //             jurisdiction: {
        //                 name: "Maryland",
        //                 laws: "Montgomery"
        //             }
        //         },

        //         // Data 3
        //         {
        //             ownerName: "Reality Partners LLC",
        //             accNo: " XV-00923769386350",
        //             propertyAddress: "5295 Westview Dr",
        //             propertyName: "Research Plaza",
        //             lat: "39.236205",
        //             lng: "-77.280995",
        //             designee: "Joey Tribbiani",
        //             appealStatus: "Appeal In Progress",
        //             lastAssessment: "08/02/2016",
        //             nextAppealDate: "10/01/2016",
        //             meritToAppealDetail: 'Good Merit',
        //             meritToAppeal: 1,
        //             jurisdiction: {
        //                 name: "Maryland",
        //                 laws: "Montgomery"
        //             }
        //         },

        //         // Data 4
        //         {
        //             ownerName: "Reality Partners LLC",
        //             accNo: " XV-00923769386351",
        //             propertyAddress: "403 Richards Ave Dover, NJ 07801",
        //             propertyName: "Montros e Metro",
        //             lat: "38.757877",
        //             lng: "-77.140842",
        //             designee: "Jacks Teller",
        //             appealStatus: "No Further Appeal",
        //             lastAssessment: "10/02/2016",
        //             nextAppealDate: "01/10/2017",
        //             meritToAppeal: 3,
        //             meritToAppealDetail: 'No Apparent Merit',
        //             jurisdiction: {
        //                 name: "Virginia",
        //                 laws: "Fairfax County"
        //             }
        //         },

        //         // Data 5
        //         {
        //             ownerName: "Reality Partners BLC",
        //             accNo: " XV-00923769386352",
        //             propertyAddress: "300 Halket St Pittsburgh, PA 15213",
        //             propertyName: "Lakeside Plaza",
        //             lat: "38.857189",
        //             lng: "-77.315829",
        //             designee: "Jacks Teller",
        //             appealStatus: "Appeal Rejected",
        //             lastAssessment: "07/05/2016",
        //             nextAppealDate: "08/02/2017",
        //             meritToAppealDetail: 'Good Merit',
        //             meritToAppeal: 1,
        //             jurisdiction: {
        //                 name: "Virginia",
        //                 laws: "Fairfax City"
        //             }
        //         }


        //         {
        //             ownerName: "Reality Partners LLC",
        //             accNo: "XV-00923769386348",
        //             propertyAddress: "1st Bank Street",
        //             propertyName:"TwinBrook Metro Plaza",
        //             lat: "39.551210",
        //             lng: "-77.740677",
        //             designee: "Joey Tribbiani",
        //             appealStatus: "No Appeal Yet",
        //             lastAssessment: "01/02/2017",
        //             nextAppealDate: "05/01/2017",
        //             meritToAppeal:1,
        //             meritToAppealDetail:'Good Merit',
        //             jurisdiction: {
        //                 name: "Maryland",
        //                 laws: "Montgomery"
        //             }
        //         },
        //         // Data 2
        //         {
        //             ownerName: "Reality Partners LLC",
        //             accNo: " XV-00923769386349",
        //             propertyAddress: "401 N Washington St",
        //             propertyName:"Glenrock JV",
        //             lat: "39.406464",
        //             lng: "-76.742284",
        //             designee: "Joey Tribbiani",
        //             appealStatus: "Appeal Rejected",
        //             lastAssessment: "09/02/2016",
        //             nextAppealDate: "12/02/2016",
        //             meritToAppeal:2,
        //             meritToAppealDetail:'Marginal',
        //             jurisdiction: {
        //                 name: "Maryland",
        //                 laws: "Montgomery"
        //             }
        //         },

        //         // Data 3
        //         {
        //             ownerName: "Reality Partners LLC",
        //             accNo: " XV-00923769386350",
        //             propertyAddress: "5295 Westview Dr",
        //             propertyName:"Research Plaza",
        //             lat: "38.973698",
        //             lng: "-77.182660",
        //             designee: "Joey Tribbiani",
        //             appealStatus: "Appeal In Progress",
        //             lastAssessment: "08/02/2016",
        //             nextAppealDate: "10/01/2016",
        //             meritToAppealDetail:'No Apparent Merit',
        //             meritToAppeal:3,
        //             jurisdiction: {
        //                 name: "Maryland",
        //                 laws: "Montgomery"
        //             }
        //         },

        //         // Data 4
        //         {
        //             ownerName: "Reality Partners LLC",
        //             accNo: " XV-00923769386351",
        //             propertyAddress: "403 Richards Ave Dover, NJ 07801",
        //             propertyName:"Montros e Metro",
        //             lat: "40.885901",
        //             lng: "-74.538232",
        //             designee: "Jacks Teller",
        //             appealStatus: "No Further Appeal",
        //             lastAssessment: "10/02/2016",
        //             nextAppealDate: "01/10/2017",
        //             meritToAppeal:2,
        //             meritToAppealDetail:'Marginal',
        //             jurisdiction: {
        //                 name: "Virginia",
        //                 laws: "Fairfax County"
        //             }
        //         },

        //         // Data 5
        //         {
        //             ownerName: "Reality Partners LLC",
        //             accNo: " XV-00923769386352",
        //             propertyAddress: "300 Halket St Pittsburgh, PA 15213",
        //             propertyName:"Lakeside Plaza",
        //             lat: "40.437364",
        //             lng: "-79.959750",
        //             designee: "Jacks Teller",
        //             appealStatus: "Appeal In Progress",
        //             lastAssessment: "07/05/2016",
        //             nextAppealDate: "08/02/2017",
        //             meritToAppealDetail:'No Apparent Merit',
        //             meritToAppeal:3,
        //             jurisdiction: {
        //                 name: "Virginia",
        //                 laws: "Fairfax City"
        //             }
        //         }
        //         },

        //         {
        //             ownerName: "Marsh",
        //             accNo: " XV-00923769386353",
        //             propertyAddress: "300 Halket St Pittsburgh, PA 15213",
        //             lat: "40.793395",
        //             lng: "-77.860001",
        //             designee: "Forge",
        //             appealStatus: "Appeal In Progress",
        //             lastAssessment: "07/05/2016",
        //             nextAppealDate: "08/02/2017",
        //             meritToAppeal:6,
        //             jurisdiction: {
        //                 name: "Virginia",
        //                 laws: "Fairfax City"
        //             }
        //         },
        //         {
        //             ownerName: "JOhn",
        //             accNo: " XV-00923769386354",
        //             propertyAddress: "300 Halket St Pittsburgh, PA 15213",
        //              lat: "39.952584",
        //             lng: "-75.165222",
        //             designee: "Forgosin",
        //             appealStatus: "Appeal Rejected",
        //             lastAssessment: "07/05/2016",
        //             nextAppealDate: "08/02/2017",
        //             meritToAppeal:7,
        //             jurisdiction: {
        //                 name: "Virginia",
        //                 laws: "Fairfax County"
        //             }
        //         // }
        //     ];


        //     return data;

        // }







    });


// vm.selectedFilters = [{
//     attribute: "designee",
//     name: "Joey Tribbiani"
// }, {
//     attribute: "designee",
//     name: "Jacks Teller"
// }, {
//     attribute: "appealStatus",
//     name: "No Appeal Yet"
// }, {
//     attribute: "appealStatus",
//     name: "Appeal Rejected"
// }, {
//     attribute: "appealStatus",
//     name: "No Further Appeal"
// }, {
//     attribute: "appealStatus",
//     name: "Appeal In Progress"
// }, {
//     attribute: "jurisdiction",
//     name: "Montgomery"
// }, {
//     attribute: "jurisdiction",
//     name: "Fairfax City"
// }, {
//     attribute: "jurisdiction",
//     name: "Fairfax County"
// }];

// var dates = [new Date("01/02/2017"), new Date("09/02/2016"),new Date("08/02/2016"),new Date("10/02/2016"),
// new Date("07/06/2016")];

// for (var i =0; i < 5; i++) { 
//     dates.push(dates[i]);
// }

// function selectFilter(filter) {

//     //////console.log('select Filter ' + filter)
//     filter.state = +!filter.state

//     if (filter.state) {

//         vm.selectedFilters.push({
//             attribute: filter.name
//         });

//     } else {

//         for (var i = 0; i < vm.selectedFilters.length; i++) {

//             if (vm.selectedFilters[i].name == filter.name) {
//                 vm.selectedFilters.splice(i, 1);
//             }
//         }


//     }

//     //////console.log('all filters ');
//     //////console.log(vm.selectedFilters);



// }

// // //////console.log('done parsing');
// var myLatLng = new google.maps.LatLng(
//     {
//         latitude:parseFloat(vm.propertyData[i].lat),
//         longitude:parseFloat(vm.propertyData[i].lng)
//     });
// //////console.log('set myLatLng', myLatLng);

// bounds.extend(myLatLng);


// vm.windowOptions = {
//                     boxClass: "infobox",
//                     boxStyle: {
//                         backgroundColor: "blue",
//                         border: "1px solid red",
//                         borderRadius: "5px",
//                         width: "100px",
//                         height: "100px"
//                     },
//                     content: "Window options box work standalone ------------BUT DOES NOT work on marker click",
//                     disableAutoPan: true,
//                     maxWidth: 0,

//                     zIndex: null,
//                     closeBoxMargin: "10px",
//                     closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",

//                     isHidden: false,
//                     pane: "floatPane",
//                     enableEventPropagation: false
//                 };
