'use strict';

//var angular = require('angular');

angular.module('AOTC').controller('Signup', require('./signup').Signup);
angular.module('AOTC').directive('pwCheck', require('./signup').pwCheck);