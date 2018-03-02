'use strict';

//var angular = require('angular');

angular.module('AOTC').controller('TaskManagerCtrl', require('./task-manager.controller'));
angular.module('AOTC').service('taskService', require('./task-manager.service'));