'use strict';

//var angular = require('angular');

////******IE_RR_Module
//***ManualUpload
//IE
angular.module('AOTC').controller('manualIE', require('./IE_RR_Module/ManualUpload/IE/ManualIE'));
//RR
angular.module('AOTC').controller('manualRR', require('./IE_RR_Module/ManualUpload/RR/ManualRR'));
//TaxBill
angular.module('AOTC').controller('taxBill', require('./IE_RR_Module/ManualUpload/TaxBill/TaxBill'));


//***MultipleUpload
angular.module('AOTC').controller('multipleUploadIERR', require('./IE_RR_Module/MultipleUpload/multipleUploadIERR'));

//***SingleUpload
angular.module('AOTC').controller('uploadIERR', require('./IE_RR_Module/SingleUpload/uploadIERR'));

//***unlinkedProperties
//tabs
angular.module('AOTC').controller('unlinkedProperties', require('./IE_RR_Module/unlinkedProperties/unlinkedPropertiesViewer'));

//corrupt
angular.module('AOTC').controller('corruptFiles', require('./IE_RR_Module/unlinkedProperties/tabs/corrupt/corrupt'));

//unlinked
angular.module('AOTC').controller('unlinkedFiles', require('./IE_RR_Module/unlinkedProperties/tabs/unlinked/unlinked'));
angular.module('AOTC').factory('UnlinkService', require('./IE_RR_Module/unlinkedProperties/tabs/unlinked/unlinked.service'));



//unparsed
angular.module('AOTC').controller('unparsedFiles', require('./IE_RR_Module/unlinkedProperties/tabs/unparsed/unparsed'));



//***Update_IE_RR
angular.module('AOTC').controller('updateIERR', require('./IE_RR_Module/Update_IE_RR/Update_IE_RR'));

//***View_IE_RR
//tabs
//income_expense
angular.module('AOTC').controller('income_expense', require('./IE_RR_Module/View_IE_RR/tabs/income_expense/income_expense'));

//other_files
angular.module('AOTC').controller('other_files', require('./IE_RR_Module/View_IE_RR/tabs/other_files/other_files'));

//propertyDetails
angular.module('AOTC').controller('PropertyDetailsTab', require('./IE_RR_Module/View_IE_RR/tabs/propertyDetails/propertyDetails.controller').PropertyDetailsTab);
angular.module('AOTC').directive('ngPropertyImageSelect', require('./IE_RR_Module/View_IE_RR/tabs/propertyDetails/propertyDetails.controller').ngPropertyImageSelect);


angular.module('AOTC').factory('PropertyDetailsTabService', require('./IE_RR_Module/View_IE_RR/tabs/propertyDetails/propertyDetails.service'));

//public_property_details
angular.module('AOTC').controller('PublicPropertyDetailsTab', require('./IE_RR_Module/View_IE_RR/tabs/public_property_details/publicPropertyDetails.controller'));
angular.module('AOTC').controller('PublicPropertyDetailsForProperty', require('./IE_RR_Module/View_IE_RR/tabs/public_property_details/publicPropertyForProperty.controller'));

angular.module('AOTC').factory('PublicPropertyDetailsTabService', require('./IE_RR_Module/View_IE_RR/tabs/public_property_details/publicPropertyDetails.service'));


//rent_role
angular.module('AOTC').controller('rent_role', require('./IE_RR_Module/View_IE_RR/tabs/rent_role/rent_role'));

//tax_bills
angular.module('AOTC').controller('tax_bills', require('./IE_RR_Module/View_IE_RR/tabs/tax_bills/tax_bills'));
//viewIERR
angular.module('AOTC').controller('viewIERR', require('./IE_RR_Module/View_IE_RR/viewIERR/viewIERR'));


//*****property-list
//***tabs
//pri-property-list
angular.module('AOTC').controller('PropertyListCtrl', require('./property-list/tabs/pri-property-list/property-list.controller'));
angular.module('AOTC').service('PrivatePropertyService', require('./property-list/tabs/pri-property-list/property-list.service'));


//public-property-list
angular.module('AOTC').controller('PublicPropertyCtrl', require('./property-list/tabs/public-property-list/public-property.controller'));
angular.module('AOTC').service('PublicPropertyService', require('./property-list/tabs/public-property-list/public-property.service'));



//***tabs-viewer
angular.module('AOTC').controller('TabsViewerCtrl', require('./property-list/tabs-viewer/tabs-viewer'));

//*****property-valuation
angular.module('AOTC').controller('PropValuation', require('./property-valuation/property-valuation.controller').PropValuation);
angular.module('AOTC').directive('inputFocusFunction', require('./property-valuation/property-valuation.controller').inputFocusFunction);
//angular.module('AOTC').service('ValuationHelper', require('./property-valuation/property-valuation.helper'));
angular.module('AOTC').factory('ValuationService', require('./property-valuation/property-valuation.service'));
angular.module('AOTC').factory('PetitionerFormulae', require('./property-valuation/property-valuation.utils'));



//*****property-workspace
//***ScenarioOne
//Sensitivity
angular.module('AOTC').controller('SensitivityOne', require('./property-workspace/ScenarioOne/Sensitivity/sensitivity.controller'));
angular.module('AOTC').service('SensitivityService', require('./property-workspace/ScenarioOne/Sensitivity/sensitivity.service'));

//***ScenarioService
angular.module('AOTC').service('ScenarioDataService', require('./property-workspace/ScenarioService/ScenarioDataService'));
angular.module('AOTC').directive('resizable', require('./property-workspace/ScenarioService/dragable'));


//***ScenarioThree
angular.module('AOTC').controller('SensitivityThree', require('./property-workspace/ScenarioThree/Sensitivity/sensitivity.controller'));
//angular.module('AOTC').directive('resizable', require('./property-workspace/ScenarioThree/Sensitivity/sensitivity.service'));



//*****UploadProperties
angular.module('AOTC').controller('Properties', require('./UploadProperties/UploadProperties').Properties);
angular.module('AOTC').directive('upload', require('./UploadProperties/UploadProperties').upload);
//mapdata
angular.module('AOTC').controller('Map', require('./UploadProperties/map_data/map_data'));




//*****AssignProperties
angular.module('AOTC').controller('PropAssignment', require('./PropertyAssignment/property-assignment.controller'));
angular.module('AOTC').controller('AssignedUsersListCtrl', require('./PropertyAssignment/AssignedUsers/assigned-users-list.controller'));

//taxAppeal

angular.module('AOTC').controller('TaxAppeal', require('./taxAppeal/tax-appeal.controller'));
