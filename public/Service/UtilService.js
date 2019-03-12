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

    function filterOwner(data) {
        var owner = []
        console.log(data)
        for (var i = 0 ; i < data.length; i++) {
            for (var s = 0 ;s < data[i].properties.length ; s++) {
                owner.push({ownerName: data[i].properties[s].ownerName, name: data[i].name});
            }
           
        }

        return owner;

    }

    function filterZipCode(data) {
        var zipCode = []
        console.log(data)
        for (var i = 0 ; i < data.length; i++) {
            for (var s = 0 ;s < data[i].properties.length ; s++) {
                zipCode.push({zipCode: data[i].properties[s].zipCode,name: data[i].name});
            }
           
        }

        zipCode = extractDistinct(zipCode, 'zipCode')

        return zipCode;

    }

    function extractDistinct(array,property){
        var unique = {};
        var distinct = [];
        for( var i in array ){
           if( typeof(unique[array[i][property]]) == "undefined"){
              distinct.push(array[i]);
           }
           unique[array[i][property]] = 0;
        }
        return distinct;
    }

    function checkMarkingData(input) {
        var countFalse = 0;
        var countTrue  = 0 ;
        for (var i = 0 ; i < input.length ; i++) {
             if(input[i].value == true) {
                 countTrue++
             }  

        }

        for (var i = 0 ; i < input.length ; i++) {
            if(input[i].value == false) {
                countFalse++
            }  

       }

        if (countTrue == input.length || countFalse == input.length) {
            return true;
        }


        return false;

    }


    function extractZipCodes(input, data) {

        var markAll = checkMarkingData(input)
        var results ={zipCode: [], ownerName: []}
        if(markAll==true) {
            results.zipCode =  filterZipCode(data);
            results.ownerName = filterOwner(data)

            return results;
        }

        
        for (var t = 0 ; t < input.length ;t++) {
            if(input[t].value==true) {
                for (var i = 0 ; i < data.length; i++) {
                    if(input[t].name==data[i].name) {
                    for (var s = 0 ;s < data[i].properties.length ; s++) {
                       
                        results.zipCode.push({zipCode: data[i].properties[s].zipCode,name: data[i].name});
                        results.ownerName.push({ownerName: data[i].properties[s].ownerName,name: data[i].name})
                    }
                }
                   
                }
            }
        }

        results.zipCode = extractDistinct(results.zipCode, 'zipCode')

        return results;

    }

    function restoreState(data,compare,property) {
        
        for (var i = 0 ; i < data.length ; i++) {
            if(data[i][property]==compare.data) {
                data[i].value = false;
                break;
            }
        }
        return data
    
    }

    function restoreJurisdictions(data) {
        for (var i = 0 ; i < data.length ; i++) {
          
                data[i].value = false;
            }

        return data    
    }


    function  removeAllNull(data) {
        var tempData = []
        for (var i = 0 ; i  < data.length; i++) {

            for (var j = 0 ; j  < data[i].properties.length;j++) {
                
                for (var k  = 0 ; k  < data[i].properties[j].events.length;k++) {
            
                    if(!data[i].properties[j].events[k]) {
                        data[i].properties[j].events.splice(k,1)
                    }
                }
            }
        }

        return data
    }

    function checkStates(data, name){

    }
    


    return {
        clearFile: clearFile,
        numberFormatter: numberFormatter,
        keyValMakerForGrid: keyValMakerForGrid,
        numberFormatterValuation: numberFormatterValuation,
        keyValMaker: keyValMaker,
        reducedData: reducedData,
        filterJurisdictions: filterJurisdictions,
        filterOwner: filterOwner,
        filterZipCode: filterZipCode,
        extractZipCodes: extractZipCodes,
        restoreState: restoreState,
        restoreJurisdictions: restoreJurisdictions,
        removeAllNull: removeAllNull

    };
}