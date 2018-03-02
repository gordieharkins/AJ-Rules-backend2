'use strict';

//var angular = require('angular');

angular.module('AOTC').controller('ViewReportsCtrl', require('./view-reports/view-reports.component'));
angular.module('AOTC').service('ReportService', require('./Reports.service').ReportService);
angular.module('AOTC').factory('Excel', require('./Reports.service').Excel);