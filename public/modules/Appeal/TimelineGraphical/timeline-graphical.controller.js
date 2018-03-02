_timelineGraphicalCtrl.$inject = ["$stateParams", "$state", "$location", "$scope", "AOTCService", "$timeout", "$filter", "$q", "$rootScope"];
module.exports = _timelineGraphicalCtrl;

//angular.module('AOTC').controller('timelineGraphicalCtrl',
//    _timelineGraphicalCtrl);

function _timelineGraphicalCtrl($stateParams, $state, $location, $scope, AOTCService, $timeout, $filter, $q, $rootScope) {

    //Bindable Members
    var $ctrl = this;
    $scope.viewFormat = 'all-properties';
    $ctrl.jurisdictionTimeline = [];
    $ctrl.selectedEvent = {};


    $ctrl.currentYear = '2018';
    $ctrl.yearChange = function (_year) {
        try {
            $("#preloader").css("display", "block");
            _year = parseInt(_year);
            $ctrl.myConfig.options.year.text = '' + _year + '';
            loadChart();
        } catch (_e) {}
    };
    $ctrl.previousYear = function () {
        try {
            $("#preloader").css("display", "block");
            var _year = parseInt($ctrl.currentYear) - 1;
            $ctrl.currentYear = _year;
            $ctrl.myConfig.options.year.text = '' + _year + '';
            loadChart();
        } catch (_e) {}
    };
    $ctrl.nextYear = function () {
        try {
            $("#preloader").css("display", "block");
            var _year = parseInt($ctrl.currentYear) + 1;
            $ctrl.currentYear = _year;
            $ctrl.myConfig.options.year.text = '' + _year + '';
            loadChart();
        } catch (_e) {}
    };
    //dropdown values
    $ctrl.selectedJurisdiction = '';
    $ctrl.selectedByproperty = '';
    //modal functions
    $ctrl.showEventModal = function () {
        $('#mySaveModal').modal("show");
    };
    $ctrl.allInternalEvents = [];
    $ctrl.showSelectModal = function (_singleEvent) {
        $('#mySelectModal').modal('show');
        try {
            $ctrl.selectedExternalId = _singleEvent.id;
            if ($ctrl.allInternalEvents.length == 0) {
                $("#preloader").css("display", "block");
                var url = 'timeline/getInternalEvent';
                AOTCService.getDataFromServer(url)
                    .then(function (response) {
                        if (response.data.success) {
                            $ctrl.allInternalEvents = response.data.result;
                        } else {
                            $scope.$emit('danger', response.data.message);
                        }
                        $("#preloader").css("display", "none");

                    }, function (result) {
                        $("#preloader").css("display", "none");
                    });
            }
        } catch (_e) {}

    };
    $ctrl.$selectedInternalEvents = [];
    $ctrl.addToSelected = function (_id, _val) {
        if (_val) {
            if ($ctrl.$selectedInternalEvents.indexOf(_id) == -1) $ctrl.$selectedInternalEvents.push(_id);
        } else {
            var _i = $ctrl.$selectedInternalEvents.indexOf(_id);
            $ctrl.$selectedInternalEvents.splice(_i, 1);
        }
    };
    $ctrl.$selectedPropsForInternalEvents = [];
    $ctrl.addToSelectedProperties = function (_id, _val) {
        if (_val) {
            if ($ctrl.$selectedPropsForInternalEvents.indexOf(_id) == -1) $ctrl.$selectedPropsForInternalEvents.push(_id);
        } else {
            var _i = $ctrl.$selectedPropsForInternalEvents.indexOf(_id);
            $ctrl.$selectedPropsForInternalEvents.splice(_i, 1);
        }
    };
    //linkInternalEvent
    $ctrl.saveInternalEvents = function () {
        if (!$ctrl.selectedExternalId || !$ctrl.$selectedInternalEvents.length || !$ctrl.$selectedPropsForInternalEvents.length) {
            return;
        }
        $("#preloader").css("display", "block");
        var url = 'timeline/linkInternalEvent';
        var data = {
            "externalId": $ctrl.selectedExternalId,
            "internalIds": $ctrl.$selectedInternalEvents,
            "propertyIds": $ctrl.$selectedPropsForInternalEvents
        };
        AOTCService.postDataToServer(url, data)
            .then(function (response) {
                if (response.data.success) {
                    $scope.$emit('success', response.data.message);
                    $('#mySelectModal').modal('hide');
                } else {
                    $scope.$emit('danger', response.data.message);
                }
                $("#preloader").css("display", "none");

            }, function (result) {
                $("#preloader").css("display", "none");
            });
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    function processDateAsString(_tobj) {
        try{
            _tobj.deadline = $filter('date')(_tobj.deadline, 'M/d/yyyy'); 
            return _tobj;
        }
        catch(_e){ return _tobj;}
    }
    //createNewInternalEvent
    $ctrl.createNewInternalEvent = function (_data) {
        $("#preloader").css("display", "block");
        var url = 'timeline/createNewInternalEvent';
        var data = {
            "internalEvent": processDateAsString(_data)
        };
        AOTCService.postDataToServer(url, data)
            .then(function (response) {
                if (response.data.success) {
                    $scope.$emit('success', response.data.message);
                    $('#mySaveModal').modal('hide');
                    $("#preloader").css("display", "block");
                    var url = 'timeline/getInternalEvent';
                    AOTCService.getDataFromServer(url)
                        .then(function (response) {
                            if (response.data.success) {
                                $ctrl.allInternalEvents = response.data.result;
                            } else {
                                $scope.$emit('danger', response.data.message);
                            }
                            $("#preloader").css("display", "none");

                        }, function (result) {
                            $("#preloader").css("display", "none");
                        });
                } else {
                    $scope.$emit('danger', response.data.message);
                    $("#preloader").css("display", "none");
                }
                //$("#preloader").css("display", "none");


            }, function (result) {
                $("#preloader").css("display", "none");
            });
    };
    //getAllPropertiesTimelineStatus
    var getAllPropertiesTimelineStatus = function () {
        $("#preloader").css("display", "block");
        var url = 'timeline/getAllPropertiesTimelineStatus';
        var data = {};
        AOTCService.postDataToServer(url, data)
            .then(function (response) {
                if (response.data.success) {
                    $ctrl.allPropertiesTimelineStatus = response.data.result;
                    setDefaults();
                } else {
                    $scope.$emit('danger', response.data.message);
                }
                $("#preloader").css("display", "none");

            }, function (result) {
                $("#preloader").css("display", "none");
            });
    }();
    ////getJurisdictions
    //var getJurisdictions = function () {
    //    $("#preloader").css("display", "block");
    //    var url = 'timeline/getJurisdictions';
    //    AOTCService.getDataFromServer(url)
    //        .then(function (response) {
    //            if (response.data.success) {
    //                $ctrl.allJurisdictions = response.data.result;
    //            } else {
    //                $scope.$emit('danger', response.data.message);
    //            }
    //            $("#preloader").css("display", "none");

    //        }, function (result) {
    //            $("#preloader").css("display", "none");
    //        });
    //}();

    //on tab change
    $ctrl.tabChangeFunc = function (_tabname) {
        try {
            $scope.viewFormat = _tabname;
            if (_tabname == 'by-jurisdiction') {
                if (!$ctrl.jurisdictionTimeline.length) {
                    var _selectedJurisdiction = $ctrl.selectedJurisdiction || 'Maryland';
                    getTimelineLineData(_selectedJurisdiction).then(function () {
                        findAllPropertiesinJurisdiction();
                        loadChart();
                    });
                } else {
                    $rootScope.$on('$includeContentLoaded', function (_event, _url) {
                        if (_url.indexOf('jurisdiction') != -1) loadChart();
                    });
                    $("#preloader").css("display", "block");
                    loadChart();
                }
                //findAllPropertiesinJurisdiction();

            } else if (_tabname == 'by-property') {
                if (!$ctrl.jurisdictionTimeline.length) {
                    var _selectedJurisdiction = findJurisdictionAgainstProperty($ctrl.selectedByproperty);
                    getTimelineLineData(_selectedJurisdiction).then(function () {
                        //findAllPropertiesinJurisdiction();
                        loadChart();
                        var _tempProp = findPropertyInJurisdcitionArray($ctrl.selectedByproperty);
                        //$ctrl.addToSelectedProperties();
                        _tempProp['cbox'] = true;
                        $ctrl.allPropertiesinJurisdiction = [_tempProp];
                    });
                } else {
                    $("#preloader").css("display", "block");
                    $rootScope.$on('$includeContentLoaded', function (_event, _url) {
                        if (_url.indexOf('by-property') != -1) loadChart();
                    });
                    var _tempProp = findPropertyInJurisdcitionArray($ctrl.selectedByproperty);
                    $ctrl.allPropertiesinJurisdiction = [_tempProp];
                }
            }


            //if ($ctrl.allPropertiesinJurisdiction.length == 0) 

        } catch (_e) {}
    };


    //to show info of the selected property
    //$ctrl.selectedPropertiesFromDropdown = [];
    //Proprties Dropdown
    $ctrl.propertiesFromDropdown = function (_selection) {

        var _selectedJurisdiction = findJurisdictionAgainstProperty($ctrl.selectedByproperty);
        getTimelineLineData(_selectedJurisdiction).then(function () {
            loadChart();
        });
        var _tempProp = findPropertyInJurisdcitionArray($ctrl.selectedByproperty);
        _tempProp['cbox'] = true;
        //$ctrl.addToSelectedProperties();
        $ctrl.allPropertiesinJurisdiction = [_tempProp];
    };

    //called from Jurisdiction Dropdown
    $ctrl.getJurisdictionTimeline = function (_selection) {
        getTimelineLineData(_selection).then(function () {
            findAllPropertiesinJurisdiction();
            loadChart();
        });
    };


    function findPropertyInJurisdcitionArray(_name) {
        var _result;
        angular.forEach($ctrl.allPropertiesTimelineStatus, function (_item, _index) {
            if (_item.propertyName == _name) {
                _result = _item;
            }
        });
        return _result;
    };

    function findJurisdictionAgainstProperty(_name) {
        var _result;
        angular.forEach($ctrl.allPropertiesTimelineStatus, function (_item, _index) {
            if (_item.propertyName == _name) {
                _result = _item.jurisdiction;
            }
        });
        return _result;
    };

    function getTimelineLineData(_selection) {
        $("#preloader").css("display", "block");
        var url = 'timeline/getJurisdictionTimeline';
        //to make it a promise
        var deferred = $q.defer();
        var data = {
            "jurisdictionName": _selection
        };
        AOTCService.postDataToServer(url, data)
            .then(function (response) {
                if (response.data.success) {
                    $ctrl.jurisdictionTimeline = response.data.result;
                    addevents($ctrl.jurisdictionTimeline);

                    //loadChart();

                    //Get relevant props and show in list
                    //findAllPropertiesinJurisdiction();
                    deferred.resolve();

                } else {
                    $scope.$emit('danger', response.data.message);
                    deferred.reject();
                }
                //$("#preloader").css("display", "none");

            }, function (result) {
                $("#preloader").css("display", "none");
            });
        return deferred.promise;
    }
    //$ctrl.allPropertyNames = [];
    $ctrl.allJurisdictionNames = [];

    function setDefaults() {
        //first set default values for jurisdiction dropdown
        var _allprops = [];
        angular.forEach($ctrl.allPropertiesTimelineStatus, function (_item, _index) {
            if (_index == 0) {
                $ctrl.selectedJurisdiction = _item.jurisdiction;
                $ctrl.selectedByproperty = _item.propertyName;
                if (_allprops.indexOf(_item.jurisdiction) == -1) {
                    _allprops.push(_item.jurisdiction);
                }
            }
        });
        $ctrl.allJurisdictionNames = _allprops;

        ////$ctrl.selectedJurisdiction;

        ////get all properties relevant to the selected jurisdiction and show in the list
        //$ctrl.selectedJurisdiction = '';

        ////then get all properties
        //$ctrl.allPropertiesTimelineStatus;

        ////then set default values for property dropdown
        //$ctrl.selectedByproperty = '';


        ////get the relevant property object and show its value in the list


    }
    $ctrl.selectedEvents = [];

    function findEvent(p) {
        // try {
        $ctrl.selectedEvents = [];
        var _tempArray = [];
        var _nodeCodes = p['data-info2'];
        var _nodeids = p['data-info1'];
        for (var i = 0; i < $ctrl.jurisdictionTimeline.length; i++) {
            var _item = $ctrl.jurisdictionTimeline[i].event._id;
            if (_nodeids.indexOf(_item) != _ - 1) {
                //$timeout(function () {

                var _obje = addExternalInternalEventsToSelected($ctrl.selectedEvents, $ctrl.jurisdictionTimeline, i, _nodeCodes);
                _tempArray.push(_obje);

                // $ctrl.selectedEvent = $ctrl.jurisdictionTimeline[i].event.properties;

                // if ($scope.viewFormat == 'by-property') {
                //     var _ieventsArray = [];
                //     angular.forEach($ctrl.jurisdictionTimeline[i].internalEvents, function (__item) {
                //         if (__item.propertyNames.indexOf($ctrl.selectedByproperty) != -1) {
                //             _ieventsArray.push(__item);
                //         }
                //     });
                //     $ctrl.selectedEvent['internalEvents'] = _ieventsArray;
                // } else {
                //     $ctrl.selectedEvent['internalEvents'] = $ctrl.jurisdictionTimeline[i].internalEvents;
                // }
                // $ctrl.selectedExternalId = $ctrl.jurisdictionTimeline[i].event._id;

                //});
                //break;
            }
        }
        $timeout(function () {
            $ctrl.selectedEvents = _tempArray;
            //$ctrl.selectedExternalId = $ctrl.jurisdictionTimeline[foundAtIndex].event._id;
        });
        // } catch (_e) {}
    }

    function addExternalInternalEventsToSelected(_selectedEventsArray, _jurisdictionTimelineArray, foundAtIndex, _nodeCodes) {
        //_selectedEventsArray = [];
        var _temp, __id;
        if ($scope.viewFormat == 'by-property') {
            var _ieventsArray = [];
            angular.forEach(_jurisdictionTimelineArray[foundAtIndex].internalEvents, function (__item) {
                if (__item.propertyNames.indexOf($ctrl.selectedByproperty) != -1) {
                    _ieventsArray.push(__item);
                }
            });
            _temp = _jurisdictionTimelineArray[foundAtIndex].event.properties;
            __id = _jurisdictionTimelineArray[foundAtIndex].event._id;
            angular.extend(_temp, {
                internalEvents: _ieventsArray,
                nodeCodes: _nodeCodes,
                id: __id
            });
            //_selectedEventsArray.push(_temp);

        } else {
            _temp = _jurisdictionTimelineArray[foundAtIndex].event.properties;
            __id = _jurisdictionTimelineArray[foundAtIndex].event._id;

            angular.extend(_temp, {
                internalEvents: _jurisdictionTimelineArray[foundAtIndex].internalEvents,
                nodeCodes: _nodeCodes,
                id: __id
            });
            //_selectedEventsArray.push(_temp);
        }


        return _temp;
    }

    function addevents(_eventData) {
        // try {
        $ctrl.myConfig.options.values = [];
        $ctrl.myConfig.options.day.items = {};
        for (var i = 0; i < _eventData.length; i++) {
            var _item = _eventData[i];
            var _sdate = $filter('date')(new Date(_item.event.properties.deadlineStart), 'yyyy-MM-dd');
            var _edate = $filter('date')(new Date(_item.event.properties.deadlineEnd), 'yyyy-MM-dd');


            $ctrl.myConfig.options.day.items['d-' + _sdate] = {
                backgroundColor: 'green',
                color: 'white'
            };
            $ctrl.myConfig.options.day.items['d-' + _edate] = {
                backgroundColor: 'orange',
                color: 'white'
            };

            var _dupeDatesObj = findDuplicateDateInValues($ctrl.myConfig.options.values, _sdate, _edate);
            if (_dupeDatesObj.s.length) {
                insertOtherEvent(_sdate,
                    '<br><br>Event Code: ' + String.fromCharCode(65 + (i % 25)) + '<br>Deadline Start: ' + _sdate + '<br>Event Name: ' + _item.event.properties.eventName,
                    _item.event._id,
                    String.fromCharCode(65 + (i % 25)),
                    _dupeDatesObj.s,
                    $ctrl.myConfig.options.day.items,
                    $ctrl.myConfig.options.values);
            } else {
                $ctrl.myConfig.options.values.push([_sdate, 1, 'Event Code: ' + String.fromCharCode(65 + (i % 25)) + '<br>Deadline Start: ' + _sdate + '<br>Event Name: ' + _item.event.properties.eventName, [_item.event._id],
                    [String.fromCharCode(65 + (i % 25))]
                ]);
            }
            if (_dupeDatesObj.e.length) {
                //
                insertOtherEvent(_edate,
                    '<br><br>Event Code: ' + String.fromCharCode(65 + (i % 25)) + '<br>Deadline End: ' + _sdate + '<br>Event Name: ' + _item.event.properties.eventName,
                    _item.event._id,
                    String.fromCharCode(65 + (i % 25)),
                    _dupeDatesObj.e,
                    $ctrl.myConfig.options.day.items,
                    $ctrl.myConfig.options.values);
            } else {
                $ctrl.myConfig.options.values.push([_edate, 1, 'Event Code: ' + String.fromCharCode(65 + (i % 25)) + '<br>Deadline End: ' + _sdate + '<br>Event Name: ' + _item.event.properties.eventName, [_item.event._id],
                    [String.fromCharCode(65 + (i % 25))]
                ]);
            }
        }

        //}
        //catch(_e){}


    }

    function insertOtherEvent(_date, _eventDetail, _eventId, _charCode, _dupesArray, _configObj, _valArray) {
        for (var o = 0; o < _dupesArray.length; o++) {
            var _index = _dupesArray[o];
            var _existingEventString = _valArray[_index][2];
            var _existingIds = _valArray[_index][3];
            var _existingCodes = _valArray[_index][4];

            _existingEventString += _eventDetail;
            _existingIds.push(_eventId);
            _existingCodes.push(_charCode);
            _valArray[_index][2] = _existingEventString;
            _valArray[_index][3] = _existingIds;
            _valArray[_index][4] = _existingCodes;

        }
        _configObj['d-' + _date] = {
            backgroundColor: 'purple',
            color: 'white',
            fontSize: 10
        };
    }

    function findDuplicateDateInValues(_valueArray, _startdateToCompare, _enddateToCompare) {
        var _duplicateIndexesForstart = [];
        var _duplicateIndexesForEnd = [];
        for (var i = 0; i < _valueArray.length; i++) {
            var _arrayItem = _valueArray[i];
            if (_arrayItem[0] == _startdateToCompare) {
                _duplicateIndexesForstart.push(i);
            } else if (_arrayItem[0] == _enddateToCompare) {
                _duplicateIndexesForEnd.push(i);
            }
        }
        return {
            s: _duplicateIndexesForstart,
            e: _duplicateIndexesForEnd
        };
    }

    //getting properties in selected jurisdiction 
    function findAllPropertiesinJurisdiction() {
        try {
            var _temp = [];
            angular.forEach($ctrl.allPropertiesTimelineStatus, function (_item) {
                if (_item.jurisdiction == $ctrl.selectedJurisdiction) {
                    _temp.push(_item);
                }
            });
            $ctrl.allPropertiesinJurisdiction = _temp;
        } catch (_e) {}

    };

    function loadChart() {
        $timeout(function () {

            zingchart.exec('myChart', 'destroy');
            zingchart.complete = function (p) {
                $("#preloader").css("display", "none");
            };
            zingchart.loadModules('calendar', function () {
                zingchart.render({
                    id: 'myChart',
                    data: $ctrl.myConfig,
                    height: 250
                });
            });
            //addevents();
            zingchart.node_click = function (p) {
                findEvent(p);
            };
        }, 0);
    }
    $ctrl.myConfig = {
        type: 'calendar',
        options: {
            year: {
                text: '2018',
                visible: false
            },
            startMonth: 1,
            endMonth: 12,
            palette: ['none', 'red'],
            month: {
                item: {
                    fontColor: 'gray',
                    fontSize: 9
                }
            },
            day: { // Configure the styling by day.
                items: { // Use this object to style the cells by individual calendar day.
                    //'d-2017-02-14': {
                    //    backgroundColor: 'purple',
                    //},
                },
                inactive: { // Use this object to style the cells of all inactive days.
                    backgroundColor: '#fafafa'
                }
            },
            weekday: {
                values: ['', 'M', '', 'W', '', 'F', ''],
                item: {
                    fontColor: 'gray',
                    fontSize: 9
                }
            },
            values: []
        },
        labels: [],

        tooltip: { //Lefthand Label (bottom portion)
            text: '%data-info0',
        },

        plotarea: {
            marginTop: '8%',
            marginBottom: '10%',
            marginLeft: '-2%',
            marginRight: '0%'
        },
        plot: {
            valueBox: [{ // Use this object to configure the value boxes.
                    fontColor: 'gray',
                    fontFamily: 'Courier New',
                    fontSize: 8,
                    fontWeight: 'normal',
                    "rules": [{
                        "rule": "%data-info1 != null",
                        "visible": "false"
                    }],
                    text: "%data-monthday"
                },
                { // Use this object to configure the value boxes.
                    fontColor: 'white',
                    fontFamily: 'Courier New',
                    fontSize: 12,
                    fontWeight: 'normal',
                    "rules": [{
                        "rule": "%data-info1 == null",
                        "visible": "false"
                    }],
                    text: "%data-info2"
                }
            ]

        },
    };


}