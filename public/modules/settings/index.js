'use strict';

//var angular = require('angular');

angular.module('AOTC').controller('settingsCTRL', require('./main/main'));

angular.module('AOTC').filter('array_join', function () {
    return function join(array, separator, prop) {
        if (!Array.isArray(array)) {
            return array; // if not array return original - can also throw error
        }

        return (!angular.isUndefined(prop) ? array.map(function (item) {
            return item[prop];
        }) : array).join(separator);
    };
});