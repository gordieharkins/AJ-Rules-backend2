'use strict';

_main.$inject = ["User_Config", "$state", "$rootScope", "mainService", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout", "DTOptionsBuilder", "DTColumnDefBuilder"]; //, "DTOptionsBuilder", "DTColumnDefBuilder"
module.exports = _main;

//angular.module('AOTC').controller('main', _main
//    );

function _main(User_Config, $state, $rootScope, mainService, $location, $scope, $http, __env, $log, AOTCService, $timeout, DTOptionsBuilder, DTColumnDefBuilder) { //, DTOptionsBuilder, DTColumnDefBuilder
    ////console.log("main controller");


    var vm = this;
    $scope.vm;
    vm.locations = [];


    vm.newstimemodel = [];
    vm.newssourcesmodel = [];
    vm.newsRegionmodel = [];

    vm.newsRegion = [{ id: 0, label: "All" }];
    vm.newssources = [{ id: 0, label: "All" }];
    vm.newstime = [{ id: "60", label: "All" }, { id: "1", label: "1 day" }, { id: "7", label: "1 week" }, { id: "30", label: "1 month" }];
    var _d= localStorage.getItem('tickerStatus');
    if(_d=='false' || _d==false){
        vm.tickerStatus = false;
    }
    else vm.tickerStatus = true;
    vm.tickerStatusFunc = function (_status) {
        vm.tickerStatus = _status;
        localStorage.setItem("tickerStatus", _status);
    };

    $scope.$watch("main.newstimemodel", function (newVal, oldVal) {
        try {
            if (newVal != oldVal) {
                var _arr = [];
                angular.forEach(newVal, function (_item) {
                    _arr.push(parseInt(_item.id));
                });
                vm.filterArrTime = _arr;
            }
        }
        catch (_e) { }
    }, true);
    $scope.$watch("main.newssourcesmodel", function (newVal, oldVal) {
        try {
            if (newVal != oldVal) {
                var _arr = [];
                angular.forEach(newVal, function (_item) {
                    _arr.push(_item.id);
                });
                vm.filterArrSources = _arr;
            }
        }
        catch (_e) { }

    }, true);
    $scope.$watch("main.newsRegionmodel", function (newVal, oldVal) {
        try {
            if (newVal != oldVal) {
                var _arr = [];
                angular.forEach(newVal, function (_item) {
                    _arr.push(_item.id);
                });
                vm.filterArrRegion = _arr;
            }
        }
        catch (_e) { }

    }, true);
    vm.filterArrRegion = [];
    vm.filterArrSources = [];
    vm.filterArrTime = [];

    vm.getResults = function () {
        var _source = (vm.filterArrSources.length == 0) ? vm.newssourcesAll : vm.filterArrSources;
        var _Region = (vm.filterArrRegion.length == 0) ? vm.newRegionAll : vm.filterArrRegion;
        getNewsss({
            "region": _Region,
            "sources": _source,
            "time": vm.filterArrTime[0] || 60
        });
    };

    vm.newsRegionsettings = { checkBoxes: true };
    vm.newssourcessettings = { checkBoxes: true };
    vm.newstimesettings = { checkBoxes: true, selectionLimit: 1 };
    vm.newsRegiontext = { buttonDefaultText: 'Select Region' };
    vm.newssourcestext = { buttonDefaultText: 'Select Source' };
    vm.newstimetext = { buttonDefaultText: 'Select Duration' };



    getNewsss({
        "region": [],
        "sources": [],
        "time": 60
    });

    vm.filterObj = {};
    function getNewsss(_data) {
        $("#preloader").css('display', 'block');
        var _time = vm.newstimemodel[0] || 60;
        var url = 'newsFeed/getNewsFeed';
        AOTCService.postDataToServer(url, _data)
            .then(function (res) {
                if (res.data.success) {
                    vm.newsData = res.data.result.results;

                    $timeout(function () {
                        $("#bn4").breakingNews({
                            effect: "slide-v",
                            autoplay: true,
                            timer: 3000,
                            color: 'blue',
                            border: true
                        });

                    }, 100);

                    try {
                        var _arr = [];
                        var _r = res.data.result.region;
                        if (_r.length) {
                            angular.forEach(res.data.result.region, function (_item) {
                                _arr.push({ id: _item, label: _item });
                            });
                            vm.newRegionAll = _r;
                            vm.newsRegion = _arr;
                        }


                        var _arr = [];
                        var _s = res.data.result.sources;
                        if (_s.length) {
                            angular.forEach(res.data.result.sources, function (_item) {
                                _arr.push({ id: _item, label: _item });
                            });
                            vm.newssourcesAll = _s;
                            vm.newssources = _arr;
                        }
                    }
                    catch (_e) { }


                    $("#preloader").css('display', 'none');
                }
                else {
                    $("#preloader").css('display', 'none');
                }



                //vm.newsRegion = [{ id: 0, label: "All" }];
                //vm.newssources = [{ id: 0, label: "All" }];
            }, function (result) {
                //some error
                ////console.log(result);
                $("#preloader").css('display', 'none');
            });
    };

    // ////console.log(User_Config);
    $('#preloader').css('display', 'block');

    // handle not to show main before login
    setTimeout(function () {

        if (!localStorage.getItem('userJson')) {
            $state.go('login');
        } else {

            var userData = JSON.parse(localStorage.getItem('userJson'));
            localStorage.setItem("userId", userData.userId);
            localStorage.setItem('role', userData.userData.role);
            $scope.$emit('userRole', userData.userData.role);
        }

        $('#preloader').css('display', 'none');
    }, 2000);

    // Service Call
    var propsData;


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
        .withOption('order', [[1, 'desc']])
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
        .withButtons([
            {
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
            }
        ]);

    vm.apealStatusFilter = [];
    var expanded = false;
    vm.filteredPropertyData = [];

    vm.map;
    vm.mapOptions;

    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notSortable()
    ];
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
    vm.goToPropDetails = goToPropDetails;
    // vm.uniqueTableData = getPropertyData();
    vm.uniqueTableData = propsData;
    // vm.propertyData = getPropertyData();
    vm.propertyData = propsData;
    ////console.log("abc==>", vm.propertyData)
    vm.findProperty = findProperty;
    // vm.showAdvanceModal             = showAdvanceModal;
    vm.filteredAppealData = [];

    vm.map = {
        center: {
            latitude: 39.551210,
            longitude: -77.740677
        },
        showOverlay: true,
        zoom: 6,
        options: {
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

    };

    var mapStyleArray = [
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#444444" }]
        }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#ffffff" }] }, {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
        }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
        }, {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{ "visibility": "simplified" }]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
        }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
        }
    ];

    vm.mapOptions = {
        styles: mapStyleArray,
        maxZoom: 0,
        mapTypeId: google.maps.MapTypeId.ROADMAP

    };

    //fetchin marker from .dummy data
    loadRemoteData(function () {

        initializeFilters(vm);
        for (var i = 0; i < vm.propertyData.length; i++) {

            if (vm.propertyData[i].propertyName !== null) {
            }

            // infowWindowDetails.propertyName = vm.propertyData[i].propertyName ? vm.propertyData[i].propertyName : 'Not Specified';
            var marker = {
                id: vm.markerId++,
                coords: {
                    latitude: (vm.propertyData[i].lat) ? parseFloat(vm.propertyData[i].lat) : 0,
                    longitude: (vm.propertyData[i].lng) ? parseFloat(vm.propertyData[i].lng) : 0
                },
                description: {
                    propertyName: vm.propertyData[i].propertyName, //// title:"<h1>Marker 0</h1><p>This is the home marker.</p>",,
                    appealStatus: "",
                    meritToAppealDetail: ""
                },
                options: {
                    draggable: false
                    // icon: "assets/img/" + vm.propertyData[i].meritToAppeal + ".png"
                }
            }
            vm.locations.push(marker);
            // $scope.$apply();
        }
        ////console.log(vm.locations.length);
    });

    function goToPropDetails(propertyId) {
        $("#preloader").css('display', 'block');

        mainService.getPropertyDetialsById(propertyId).
        then(function (result) {
            // ////console.log('getPropertyDetialsById: ', result);
            var serverData = result.data;
            ////console.log('getPropertyDetialsById: ', serverData.result[0]);

            if (serverData.success) {

                localStorage.setItem('propertyId', serverData.result[0]._id);
                localStorage.setItem('propertyDetails', angular.toJson(serverData.result[0]));

                $("#preloader").css('display', 'none');
                setTimeout(function () {
                    $state.go('viewIERR.propertyDetailsTab');    // Defined in
                }, 500);
            }
        }, function (err) {
            //some error
            ////console.log("Error: ", err);
            $("#preloader").css("display", "none");
        })
    }

    function applyRemoteData(newProps) {

        ///$scope.newProps = newProps.result;
        vm.propertyData = newProps.result.data;
        // ////console.log("=========>>>", vm.propertyData.length);
        // vm.propertyData = getPropertyData(newProps.result.data);
        propsData = newProps.result.data;
    }

    function loadRemoteData(cb) {
        // The friendService returns a promise.
        mainService.getProps()
            .then(
                function (props) {
                    var serverData = props;
                    if (serverData.success) {
                        vm.propertyData = props.result.data;
                        propsData = props.result.data;
                        vm.uniqueTableData = propsData;
                        localStorage.setItem('landingPageProperties', angular.toJson(vm.propertyData));
                    }
                    cb();
                }
            );
    }

    function findProperty() {
        initializeFilters(vm);
        vm.selectedFilters = [];
        vm.markerWindowShow = false;

        // ////console.log('findProperty');
        // ////console.log(vm.searchProperty);
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
                ////console.log('index of')
                // ////console.log(prop.accNo.toLowerCase().indexOf(vm.searchProperty.accNo.toLowerCase()))

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

        // ////console.log('total data\n', vm.uniqueTableData);
        setTimeout(function () {
            vm.searchProperty = {
                accNo: '',
                address: '',
                ownerName: ''
            };

        }, 10);
        showSelectedMarkers();
    }

    function closeMarkerWindow() {
        ////console.log('close window');
        vm.markerWindowShow = false;
    }

    function markerClick(marker) {
        vm.selectedMarker = {};
        vm.selectedMarker = marker.model;
        vm.map.center.latitude = vm.selectedMarker.coords.latitude;
        vm.map.center.longitude = vm.selectedMarker.coords.longitude;
        vm.markerWindowShow = true;
    }

    function removeFilter(filter) {

        ////console.log(filter);

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

        ////console.log('\n==>all filters ');
        ////console.log(vm.selectedFilters);

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

        ////console.log('select Filters type ' + attribute);
        ////console.log(filter);
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

        ////console.log('\n==>all filters ');
        ////console.log(vm.selectedFilters);

        filterData();
    }

    ////////////////////////////////////         methods for Filters                             ///////////////////////////////
    function selectAllFilters(filterArray, attribute) {

        ////console.log('select all', filterArray);
        filterArray.state = +!filterArray.state;

        if (filterArray.state) {
            for (var i = 0; i < filterArray.filters.length; i++) {

                if (filterArray.filters[i].state != 1) {
                    //if filter is not active
                    filterArray.filters[i].state = 1;

                    vm.selectedFilters.push({
                        "name": filterArray.filters[i].name,
                        "attribute": attribute,
                        "countryState": filterArray.name
                    });
                }
            }
            ////console.log('all filters ');
            ////console.log(vm.selectedFilters);
        } else {
            for (var i = 0; i < filterArray.filters.length; i++) {

                filterArray.filters[i].state = 0;


                for (var k = 0; k < vm.selectedFilters.length; k++) {

                    if (vm.selectedFilters[k].name == filterArray.filters[i].name) {
                        vm.selectedFilters.splice(k, 1);
                    }
                }
            }

            ////console.log('all filters ');
            ////console.log(vm.selectedFilters);
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
        var filter;

        for (var i = 0; i < vm.selectedFilters.length; i++) {

            filter = vm.selectedFilters[i];

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

                if (filter.name == null) {
                    state = filter.countryState;
                } else if (state.length == 0) {
                    state = filter.name;

                } else {
                    state = state + "," + filter.name;
                }
            }

        }

        ////console.log("desig == " + designee);
        ////console.log("status == " + status);
        ////console.log("state == " + state);
        ////console.log("meritToAppeal == " + meritToAppeal);


        vm.filteredMeritToAppealProperty = [];
        // No designe.
        if (meritToAppeal.length == 0) {
            ////console.log();
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
        ////console.log("filter: ", filter);

        if (filter !== undefined && filter.name == null) {

            for (var k = 0; k < vm.filteredDesigneeData.length; k++) {

                var property = vm.filteredDesigneeData[k];


                // if (state.indexOf(property.jurisdiction.laws) >= 0) {
                if (state.indexOf(property.countryState) >= 0) {

                    vm.filteredStatusData.push(property);

                }

            }

        } else {
            ////console.log("alert");
            if (state.length == 0) {

                vm.filteredStatusData = vm.filteredDesigneeData;

            } else {

                for (var k = 0; k < vm.filteredDesigneeData.length; k++) {

                    var property = vm.filteredDesigneeData[k];


                    // if (state.indexOf(property.jurisdiction.laws) >= 0) {
                    if (state.indexOf(property.county) >= 0) {

                        vm.filteredStatusData.push(property);

                    }

                }
            }
        }

        ////console.log("vm.filteredStatusData==>", vm.filteredStatusData);

        // vm.filteredAssessmentData = [];
        // for (var k = 0; k < vm.filteredStatusData.length; k++) {

        //     var property = vm.filteredStatusData[k];

        //     // ////console.log("assessment" + property.jurisdiction.laws);

        //     var propertyAssesmentDate = new Date(property.lastAssessment);

        //     var startDate = new Date(vm.assesmentSlider.minValue);
        //     var endDate = new Date(vm.assesmentSlider.maxValue);

        //     // ////console.log('start date', startDate)
        //     // ////console.log('endDate date', endDate)
        //     // ////console.log('propertyAssesmentDate date', propertyAssesmentDate)

        //     if (propertyAssesmentDate >= startDate && propertyAssesmentDate <= endDate) {
        //         // ////console.log('assessment match', propertyAssesmentDate)
        //         vm.filteredAssessmentData.push(property);

        //     }


        // }


        // vm.filteredAppealData = [];


        // for (var k = 0; k < vm.filteredAssessmentData.length; k++) {

        //     var property = vm.filteredAssessmentData[k];

        //     // ////console.log("assessment" + property.jurisdiction.laws);

        //     var propertyAssesmentDate = new Date(property.nextAppealDate);

        //     var startDate = new Date(vm.appealSlider.minValue);
        //     var endDate = new Date(vm.appealSlider.maxValue);

        //     // ////console.log('start date', startDate)
        //     // ////console.log('endDate date', endDate)
        //     // ////console.log('propertyAssesmentDate date', propertyAssesmentDate)

        //     if (propertyAssesmentDate >= startDate && propertyAssesmentDate <= endDate) {
        //         // ////console.log('assessment match', propertyAssesmentDate)
        //         vm.filteredAppealData.push(property);

        //     }

        // }

        ////console.log('\nfiltered propertyData filteredStatus', vm.filteredAppealData);
        //vm.uniqueTableData = [];
        // vm.uniqueTableData = vm.filteredAppealData;
        vm.uniqueTableData = vm.filteredStatusData;
        ////console.log(" vm.uniqueTableData::", vm.uniqueTableData);

        showSelectedMarkers();
    }

    function showSelectedMarkers() {

        vm.locations = [];

        for (var i = 0; i < vm.uniqueTableData.length; i++) {

            var marker = {
                id: vm.markerId++,
                coords: {
                    latitude: vm.uniqueTableData[i].lat,
                    longitude: vm.uniqueTableData[i].lng
                },
                description: {
                    propertyName: vm.uniqueTableData[i].propertyName, //// title:"<h1>Marker 0</h1><p>This is the home marker.</p>",,
                    appealStatus: "",
                    meritToAppealDetail: ""
                }, //// title:"<h1>Marker 0</h1><p>This is the home marker.</p>",
                options: {
                    draggable: false,
                    icon: "assets/img/" + vm.uniqueTableData[i].meritToAppeal + ".png"
                }

            };


            vm.locations.push(marker);
        }

        // vm.map.zoom = 4;
    }

    function checkToggle(event) {

        ////console.log('checked toggle')
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

        var states = [];

        for (var i = 0; i < propsData.length; i++) {

            if (propsData[i].countryState !== null && !containsObjectState(propsData[i].countryState, states)) {
                var county = [];
                county.push(propsData[i].county);
                states.push({ "state": propsData[i].countryState, "county": county });

            } else {
                var val = propsData[i].countryState;
                var index = states.findIndex(function (item, i) {
                    return item.state === val
                });
                // ////console.log("index",index);
                if (index > -1) {
                    if (propsData[i].county !== null && (states[index].county.indexOf(propsData[i].county)) === -1) {
                        states[index].county.push(propsData[i].county);
                    }
                }
            }
        }
        var filters = [];
        for (var i = 0; i < states.length; i++) {
            var fil = [];
            if (states[i].county[0] !== undefined) {
                for (var j = 0; j < states[i].county.length; j++) {
                    fil.push({
                        name: states[i].county[j],
                        state: 0
                    });
                }
            }

            filters.push({
                name: states[i].state,
                state: 0,
                filters: fil
            });
        }

        ////console.log("filters=======>", filters);

        vm.jurisdictionFilter = {
            name: 'JURISDICTIONs',
            filters: filters
        };
    }

    angular.element(document).ready(function () {
        // $('label.tree-toggler').click(function() {
        //     $(this).parent().children('ul.tree').toggle(500);
        // });
        // var ckbox = $('#checkbox');
        var dt_from = "01/01/2017 ";
        var dt_to = "12/29/2017 ";
        $('.slider-time').html(dt_from);
        $('.slider-time2').html(dt_to);
        var min_val = Date.parse(dt_from) / 1000;
        var max_val = Date.parse(dt_to) / 1000;

        function zeroPad(num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        }

        function formatDT(__dt) {
            var year = __dt.getFullYear();
            var month = zeroPad(__dt.getMonth() + 1, 2);
            var date = zeroPad(__dt.getDate(), 2);
            var hours = zeroPad(__dt.getHours(), 2);
            var minutes = zeroPad(__dt.getMinutes(), 2);
            var seconds = zeroPad(__dt.getSeconds(), 2);
            return date + '-' + month + '-' + year;
        };


        $("#slider-range").slider({
            range: true,
            min: min_val,
            max: max_val,
            step: 10,
            values: [min_val, max_val],
            slide: function (e, ui) {
                var dt_cur_from = new Date(ui.values[0] * 1000); //.format("yyyy-mm-dd hh:ii:ss");
                $('.slider-time').html(formatDT(dt_cur_from));

                var dt_cur_to = new Date(ui.values[1] * 1000); //.format("yyyy-mm-dd hh:ii:ss");
                $('.slider-time2').html(formatDT(dt_cur_to));
            }
        });

        var dt_from = "01/01/2017 ";
        var dt_to = "12/29/2017 ";

        $('.slider-timea').html(dt_from);
        $('.slider-time2a').html(dt_to);
        var min_val = Date.parse(dt_from) / 1000;
        var max_val = Date.parse(dt_to) / 1000;

        function zeroPad(num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        }

        function formatDT(__dt) {
            var year = __dt.getFullYear();
            var month = zeroPad(__dt.getMonth() + 1, 2);
            var date = zeroPad(__dt.getDate(), 2);
            var hours = zeroPad(__dt.getHours(), 2);
            var minutes = zeroPad(__dt.getMinutes(), 2);
            var seconds = zeroPad(__dt.getSeconds(), 2);
            return date + '-' + month + '-' + year;
        };


        $("#slider-rangea").slider({
            range: true,
            min: min_val,
            max: max_val,
            step: 10,
            values: [min_val, max_val],
            slide: function (e, ui) {
                var dt_cur_from = new Date(ui.values[0] * 1000); //.format("yyyy-mm-dd hh:ii:ss");
                $('.slider-timea').html(formatDT(dt_cur_from));

                var dt_cur_to = new Date(ui.values[1] * 1000); //.format("yyyy-mm-dd hh:ii:ss");
                $('.slider-time2a').html(formatDT(dt_cur_to));
            }
        });


        // var ckbox = $('#checkbox');

        var expanded = false;
        $("#drawer-handle,#prp").click(function () {
            if (expanded = !expanded) {
                $("#drawer-content").animate({
                    "margin-right": 0
                }, "slow");
            } else {
                $("#drawer-content").animate({
                    "margin-right": -800
                }, "slow");
            }
        });

        $('#adv-searcsh').on('click', function (event) {
            //The event won't be propagated to the document NODE and
            // therefore events delegated to document won't be fired
            event.stopPropagation();
        });
    });




}
function containsObjectState(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].state === obj) {
            return true;
        }
    }
    return false;
}

