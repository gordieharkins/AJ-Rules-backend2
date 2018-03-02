'use strict';

//var angular = require('angular');
//AddSurvey
angular.module('AOTC').controller('addSurvey', require('./AddSurvey/addSurvey'));
//AddSurveyDemo
angular.module('AOTC').controller('addSurveyDemo', require('./AddSurveyDemo/addSurveyDemo'));
//AJHeader
angular.module('AOTC').directive('ajheader', require('./AJHeader/header'));
//ViewAJData
angular.module('AOTC').controller('viewAJData', require('./ViewAJData/viewAJData'));
//ViewAJForm
angular.module('AOTC').controller('viewAJForm', require('./ViewAJForm/viewAJForm'));