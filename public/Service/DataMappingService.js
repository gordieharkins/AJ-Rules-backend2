
_DataMappingService.$inject = [];
module.exports = _DataMappingService;

//angular.module('AOTC').factory('DataMappingService', _DataMappingService
//    );
function _DataMappingService() {
    var factory = {};

    var mapping = {};
    var dictionary = {};
    var rows;
    var headers = "";
    var index = 0;



    factory.setVariables = function (dictionar, row, header, inde) {
        dictionary = dictionar;
        rows = row;
        headers = header;
        index = inde;
    };

    factory.getDictionary = function () {
        return dictionary;
    }
    factory.getRows = function () {
        return rows;
    }
    factory.getHeaders = function () {
        return headers;
    }
    factory.getIndex = function () {
        return index;
    }

    factory.checkVariables = function () {
        console.log(dictionary)
        console.log(rows)
        console.log(headers)
        console.log(index)
    }

    return factory;
}
