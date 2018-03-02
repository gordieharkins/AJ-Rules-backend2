'use strict';

//var angular = require('angular');


angular.module('AOTC').directive('phoneInput', require('./PhoneInput').phoneInput);
angular.module('AOTC').filter('tel', require('./PhoneInput').tel);

