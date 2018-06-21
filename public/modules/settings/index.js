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

angular.module('AOTC').directive('myModal', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        scope.dismiss = function() {
            element.modal('hide');
        };
      }
    }
 });


