'use strict';

//var angular = require('angular');

angular.module('AOTC').factory('AOTCService', require('./AOTC_Service'));
angular.module('AOTC').factory('DataMappingService', require('./DataMappingService'));

angular.module('AOTC').config(require('./Interceptor'));
angular.module('AOTC').factory('fileReader', require('./FileReader'));

angular.module('AOTC').factory('UtilService', require('./UtilService'));

angular.module('AOTC').factory('AOTCPermissions', require('./permissions.service'));
angular.module('AOTC').factory('AOTCAuth', require('./auth.service'));
angular.module('AOTC').factory('AotcIp', require('./ipConfig'));








