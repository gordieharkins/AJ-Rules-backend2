'use strict';

//var angular = require('angular');

//******SalesComparable
//comparableComponent
angular.module('AOTC').component('comparableComponent', require('./SalesComparable/comparableComponent/comparable.component').comparableComponent);
angular.module('AOTC').directive('fileinput', require('./SalesComparable/comparableComponent/comparable.component').fileinput);
angular.module('AOTC').directive('ngImageSelect', require('./SalesComparable/comparableComponent/comparable.component').ngImageSelect);


//ComparableForm
angular.module('AOTC').controller('CreateComparablesForm', require('./SalesComparable/ComparableForm/comparableForm'));

//ComparableProperties
angular.module('AOTC').controller('ComparableProperties', require('./SalesComparable/ComparableProperties/ComparableProperties.controller'));
angular.module('AOTC').factory('ComparablePropService', require('./SalesComparable/ComparableProperties/ComparableProperties.service'));

angular.module('AOTC').service('ComparablePropUtil', require('./SalesComparable/ComparableProperties/ComparableProperties.utils'));

//ComparableSelection
angular.module('AOTC').controller('ComparableSelection', require('./SalesComparable/ComparableSelection/ComparableSelection.controller'));
angular.module('AOTC').factory('ComparableSelectionService', require('./SalesComparable/ComparableSelection/ComparableSelection.service'));

angular.module('AOTC').service('ComparableUtil', require('./SalesComparable/ComparableSelection/ComparableSelection.utils'));

//PrincipalForm
angular.module('AOTC').controller('CreatePrincipalForm', require('./SalesComparable/PrincipalForm/principalForm'));
angular.module('AOTC').service('sharedService', require('./SalesComparable/PrincipalForm/principalFormService'));


//SelectedComparables
angular.module('AOTC').controller('SelectedComparable', require('./SalesComparable/SelectedComparables/SelectedComparables.controller'));
angular.module('AOTC').factory('ComparableService', require('./SalesComparable/SelectedComparables/SelectedComparables.service'));

angular.module('AOTC').service('ComparableUtil', require('./SalesComparable/SelectedComparables/SelectedComparables.utils'));