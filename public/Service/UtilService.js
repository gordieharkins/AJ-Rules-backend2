'use strict';

_UtilService.$inject = ["$http", "$filter"];
module.exports = _UtilService;

function isArray(a) {

    return (!!a) && (a.constructor === Array);
}

function sortFunction(a, b) {
    a[2] = parseInt(a[2]);
    b[2] = parseInt(b[2]);

    if (a[2] === b[2]) {
        return 0;
    } else {
        return (a[2] < b[2]) ? -1 : 1;
    }
}

function sortFunctionForGrid(a, b) {
    a[Object.keys(a)[0]][2] = parseInt(a[Object.keys(a)[0]][2]);
    b[Object.keys(b)[0]][2] = parseInt(b[Object.keys(b)[0]][2]);

    if (a[Object.keys(a)[0]][2] === b[Object.keys(b)[0]][2]) {
        return 0;
    } else {
        return (a[Object.keys(a)[0]][2] < b[Object.keys(b)[0]][2]) ? -1 : 1;
    }
}


//angular.module('AOTC')
//    .factory('UtilService', _UtilService
//    );
function _UtilService($http, $filter) {

    function numberFormatter(keyArr) {
        // element = element.toString();
        var value = keyArr[1];

        // if(keyArr[3] == '4'){
        // }
        console.log(keyArr)

        if (keyArr[1] != 'null' && keyArr[1] != '' && keyArr[1] != null) {
            switch (keyArr[3]) {
                case '1': // Numeric
                    var roundedValue;
                    if (value.indexOf(',') != -1) {
                        //roundedValue = Number(parseFloat(keyArr[1]).toFixed(0)).toLocaleString();
                        roundedValue = value;
                    } else {
                        roundedValue = Number(parseFloat(keyArr[1]).toFixed(0)).toLocaleString();
                        //oundedValue = value;
                    }
                    value = roundedValue;
                    break;
                case '2': // Currency
                    //if (value >= 0) {

                    //     value = '$' + roundedValue;
                    // } else {

                    //     roundedValue = roundedValue.slice(1);

                    if(value.indexOf('-') != -1) {
                        value = '$(' + (value.replace('-','')) + ')';
                    } else {
                        value = '$ ' + (value) + ' ';
                    }
                    //}
                    break;
                case '3': // Percentage
                    value = value + " %";
                    break;
                case '4': // Date as it is
                    var val;
                    if (value.indexOf('/') != -1) {
                        val = new Date(value);
                    }
                    else val = new Date(parseInt(value));
                    if (val) {
                        var finalDate = $filter('date')(val, 'MM/dd/yyyy');
                        //var finalDate = (val.getMonth() + 1) + "/" + val.getDate() + "/" + val.getFullYear();
                        value = finalDate;
                    }

                    break;
                case '5': // String as it is
                    // value = roundedValue;
                    break;
                default:
                    value = value;
            }
        } else {
            value = null;
        }
        return value;
    }

    function numberFormatterValuation(value, roundedValue) {
        // value = value*-1;
        if (value >= 0) {
            value = '$' + roundedValue;
        } else if (value < 0) {

            roundedValue = roundedValue.slice(1);
            value = '$(' + (roundedValue) + ')'
        } else
            value = value
        // console.log(value);
        return value;
    }

    function keyValMaker(object) {
        var newArr = [];

        for (var element in object) {
            if (isArray(object[element]) && object[element][2] !== undefined && object[element][3] !== undefined) {
                newArr.push(object[element]);
            }
        }

        return newArr.sort(sortFunction);
    }

    function keyValMakerForGrid(object) {
        var newArr = [];

        for (var element in object) {
            if (isArray(object[element]) && object[element][2] !== undefined && object[element][3] !== undefined) {
                var jsonFormat = {};
                jsonFormat[element] = object[element];
                newArr.push(jsonFormat);
            }
        }
        var result = newArr.sort(sortFunctionForGrid);
        return result;
    }

    function reducedData(object) {
        var newArr = [];
        for (var element in object[0]) {
            if (isArray(object[element]) && object[element][2] !== undefined && object[element][3] !== undefined) {
                newArr.push(object[element]);
            }
        }

        var finalArray = newArr.sort(sortFunction);
        console.log(finalArray);
        return finalArray;
        // for(var i = 1;i<object.length;i++){
        //
        // }
    }


    function clearFile() {
        angular.forEach(
            angular.element("input[type='file']"),
            function (inputElem) {
                angular.element(inputElem).val(null);
            });
    }

    function filterJurisdictions(data) {
        var jurisdictions = []
        console.log(data)
        for (var i = 0 ; i < data.length; i++) {
             jurisdictions.push({name: data[i].name});
        }

        return jurisdictions;

    }


    return {
        clearFile: clearFile,
        numberFormatter: numberFormatter,
        keyValMakerForGrid: keyValMakerForGrid,
        numberFormatterValuation: numberFormatterValuation,
        keyValMaker: keyValMaker,
        reducedData: reducedData,
        filterJurisdictions: filterJurisdictions

    };
}