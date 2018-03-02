'use strict';

//var angular = require('angular');

////components
//contract-editor
angular.module('AOTC').component('contractEditor', require('./components/contract-editor/ContractEditor.component').contractEditor);
angular.module('AOTC').directive('ckEditor', require('./components/contract-editor/ContractEditor.component').directiveFunction);

angular.module('AOTC').factory('newContractService', require('./components/contract-editor/ContractEditor.service'));

//contract-terms
angular.module('AOTC').component('contractTerms', require('./components/contract-terms/ContractTerms.component'));
angular.module('AOTC').factory('newContractTermsService', require('./components/contract-terms/ContractTerms.service'));


//sample-calculations
angular.module('AOTC').component('viewSampleCalculations', require('./components/sample-calculations/sample-calculations.component'));
angular.module('AOTC').service('SampleCalculationService', require('./components/sample-calculations/sample-calculations.service'));


//contract-CKEditor
angular.module('AOTC').controller('ContractTest', require('./contract-CKEditor/file.controller'));

//contract-wizard
angular.module('AOTC').controller('ContractWizardCtrl', require('./contract-wizard/contract-wizard.controller'));


//InvoiceList
angular.module('AOTC').controller('InvoiceList', require('./InvoiceList/InvoiceList.controller'));
angular.module('AOTC').factory('InvoiceListService', require('./InvoiceList/InvoiceList.service'));


//NewInvoice
angular.module('AOTC').controller('NewInvoice', require('./NewInvoice/new-invoice.controller'));
angular.module('AOTC').factory('NewInvoiceService', require('./NewInvoice/new-invoice.service'));


//SavedContractList
angular.module('AOTC').controller('SavedContractList', require('./SavedContractList/SavedContractList.controller'));
angular.module('AOTC').factory('SavedContractListService', require('./SavedContractList/SavedContractList.service'));


//tabs-viewer
angular.module('AOTC').controller('Contract', require('./tabs-viewer/tabs-viewer'));