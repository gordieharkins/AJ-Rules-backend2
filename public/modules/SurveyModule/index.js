'use strict';

//var angular = require('angular');

////******EditSurvey
//***EditableSurveysMenu
//angular.module('AOTC').directive('myDraggable', require('./EditSurvey/EditableSurveysMenu/EditabelSurveysMenu.service').myDraggable);

//EditArrangeSurvey
angular.module('AOTC').directive('myDraggable', require('./EditSurvey/EditableSurveysMenu/EditArrangeSurvey/EditArrangeSurvey.component').myDraggable);
angular.module('AOTC').filter('nameFilter', require('./EditSurvey/EditableSurveysMenu/EditArrangeSurvey/EditArrangeSurvey.component').nameFilter);
angular.module('AOTC').component('editArrangeSurveyComponent', require('./EditSurvey/EditableSurveysMenu/EditArrangeSurvey/EditArrangeSurvey.component').editArrangeSurveyComponent);

//EditCreateSurvey
angular.module('AOTC').component('editCreateSurveyComponent', require('./EditSurvey/EditableSurveysMenu/EditCreateSurvey/EditCreateSurvey.component'));

//EditViewSurvey
angular.module('AOTC').component('editViewSurveyComponent', require('./EditSurvey/EditableSurveysMenu/EditViewSurvey/EditViewSurvey.component'));


//editSurveyWizard
angular.module('AOTC').controller('editSurveyCtrl', require('./EditSurvey/editSurveyWizard/editSurveyWizard.component'));


////******FillSurvey
angular.module('AOTC').controller('FillSurvey', require('./FillSurvey/FillSurvey.controller'));
angular.module('AOTC').service('FillSurveyService', require('./FillSurvey/FillSurvey.service'));


////******SubmissionList
angular.module('AOTC').controller('SubmissionList', require('./SubmissionList/SubmissionList.controller'));
angular.module('AOTC').service('SubmissionListService', require('./SubmissionList/SubmissionList.service'));


//////******SurveyAnswer

////******SurveyList
angular.module('AOTC').controller('SurveyList', require('./SurveyList/SurveyList.controller'));
angular.module('AOTC').service('SurveylistService', require('./SurveyList/SurveyList.service'));


////******SurveySubmissions
angular.module('AOTC').controller('SurveySubmissions', require('./SurveySubmissions/surveySubmissions'));
angular.module('AOTC').service('SurveySubmissionsService', require('./SurveySubmissions/surveySubmissions.service'));

////******Wizards
//AddQuestion
angular.module('AOTC').controller('AddQuestionCtrl', require('./Wizards/AddQuestion/AddQuestion.controller'));
angular.module('AOTC').service('AddQuestionService', require('./Wizards/AddQuestion/AddQuestion.service'));
angular.module('AOTC').component('inputFields', require('./Wizards/AddQuestion/GenericQuestionOptions.component'));



//ArrangeSurvey
angular.module('AOTC').controller('ArrangeSurveyCtrl', require('./Wizards/ArrangeSurvey/ArrangeSurvey.controller'));
angular.module('AOTC').service('ArrangeSurveyService', require('./Wizards/ArrangeSurvey/ArrangeSurvey.service'));
angular.module('AOTC').service('ArrangeSurveyUtil', require('./Wizards/ArrangeSurvey/ArrangeSurvey.utils'));


angular.module('AOTC').component('arrangeSurveyComponent', require('./Wizards/ArrangeSurvey/arrangeSurvey.component').arrangeSurveyComponent);
angular.module('AOTC').filter('nameFilter', require('./Wizards/ArrangeSurvey/arrangeSurvey.component').nameFilter);
angular.module('AOTC').directive('myDraggable', require('./Wizards/ArrangeSurvey/arrangeSurvey.component').myDraggable);



//CreateSurvey
//angular.module('AOTC').controller('ArrangeSurveyCtrl', require('./Wizards/CreateSurvey/ArrangeSurvey.controller'));
angular.module('AOTC').service('CreateSurveyService', require('./Wizards/CreateSurvey/CreateSurvey.service'));
angular.module('AOTC').service('CreateSurveyUtil', require('./Wizards/CreateSurvey/CreateSurvey.utils'));


angular.module('AOTC').component('createSurveyComponent', require('./Wizards/CreateSurvey/createSurvey.component'));
//angular.module('AOTC').component('inputFields', require('./Wizards/CreateSurvey/GenericQuestionOptions.component'));

//sectionSettings

angular.module('AOTC').controller('sectionSettingsCtrl', require('./Wizards/sectionSettings/sectionSettings.component'));
angular.module('AOTC').service('sectionSettingsService', require('./Wizards/sectionSettings/sectionSettings.service'));

//ViewSurvey
angular.module('AOTC').component('viewSurveyController', require('./Wizards/ViewSurvey/viewSurvey.component'));
//angular.module('AOTC').controller('ViewSurveyCtrl', require('./Wizards/ViewSurvey/ViewSurvey.controller'));
//angular.module('AOTC').factory('ViewSurveyService', require('./Wizards/ViewSurvey/ViewSurvey.service'));
//angular.module('AOTC').service('ViewSurveyUtil', require('./Wizards/ViewSurvey/ViewSurvey.utils'));



////******WizardsViewer
angular.module('AOTC').controller('WizardsViewerCtrl', require('./WizardsViewer/WizardsViewer'));
