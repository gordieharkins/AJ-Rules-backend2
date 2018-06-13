'use strict';


require('../assets/css/bootstrap.min.css');
require('../assets/css/bootstrap-theme.min.css');
//require('../assets/css/font-awesome.min.css');
require('../assets/css/main.css');
//require('../assets/css/main2.css');
require('../assets/css/jquery-ui.min.css');
require('../assets/css/bootstrap-multiselect.css');
//require('../assets/css/datatables.min.css');
//require('../assets/css/responsive.dataTables.min.css');
//require('../assets/css/jquery.dataTables.min.css');
//require('../assets/css/dataTables.jqueryui.min.css');
//require('../assets/css/buttons.jqueryui.min.css');
//require('../assets/css/buttons.dataTables.min.css');
require('../assets/css/rzslider.css');
require('../../bower_components/angular-xeditable/dist/css/xeditable.css');
require('../../bower_components/dragular/dist/dragular.css');
require('../../bower_components/angular-bootstrap-toggle/dist/angular-bootstrap-toggle.css');





var __env = {};
if (window) {
    Object.assign(__env, window.__env);
    console.log(window.__env)
}
/**************************************************************************
 * Define Angular application
 *************************************************************************/
var ngModule = angular.module('AOTC', [
    'ckeditor',
    'ui.bootstrap',
    //'ui.utils.masks',
    require('angular-input-masks'),
    'ui.router',
    'agGrid',
    // 'dragularModule',
    'datatables',
    'datatables.buttons',
    'datatables.columnfilter',
    'uiGmapgoogle-maps',
    'rzModule',
    'angular-spinkit',
    'ng.deviceDetector',
    'ngFileUpload',
    'xeditable',
    'dndLists',
    'angularjs-dropdown-multiselect',
    'ui.toggle',
    'ckeditor',
    'g1b.datetime-range'
]);
// ngModule.config(['deviceDetectorProvider', function(deviceDetectorProvider) {
//   deviceDetectorProvider.addCustom("Custom_UA_Entry", {or:["\\bChrome\\b","\\bFirefox\\b","\\bSafari\\b"]});
//   }]);

ngModule.run(['$rootScope', '$uibModalStack', 'AOTCPermissions', 'AOTCAuth', '$location','$state', 'AOTCService','$timeout',
    function ($rootScope, $uibModalStack, AOTCPermissions, AOTCAuth, $location, $state, AOTCService, $timeout) {
        // close the opened modal on location change.
        //set permissions
        var _token = localStorage.getItem('token') || null;
        var _perms = {
            timeline: true,
            contracts: true,
            surveys: true,
            properties: true,
            taskmanager: true,
            uploadProperties: true,
            publicData: true,
            newsFeed: true,
            createContract: true,
            masterSlave: true
        };
        ///set permissions
        try{
            var userResult = JSON.parse(localStorage.getItem('userJson')) || undefined;
            if(userResult) AOTCPermissions.setPermissions(userResult.roles, 'permissionMainObj'); 
            AOTCPermissions.setPermissions(userResult.userData, 'userObj');
        }
        catch(_e){}

        //set token
        if (_token) AOTCAuth.setToken(_token);
        $rootScope.$on('$locationChangeStart', function ($event, newUrl, oldUrl) {
            var openedModal = $uibModalStack.getTop();

            if (openedModal) {
                if (!!$event.preventDefault) {
                    $event.preventDefault();
                }
                if (!!$event.stopPropagation) {
                    $event.stopPropagation();
                }
                $uibModalStack.dismiss(openedModal.key);
            }
        });

        $rootScope.$on('$stateChangeStart', function ($event, newUrl) {
            var permission = newUrl.permission;
            if (permission) {
                var permissionStatus = AOTCPermissions.hasPermission(permission.permissionKey, permission.permissionObj);
                if (!permissionStatus)
                {
                    $state.go(permission.altState);
                    $event.preventDefault();
                    
                    //$location.path(permission.altRoute);
                }
                    
            }
        });
      
    }
]);

ngModule.run(['editableOptions', function (editableOptions) {
    editableOptions.theme = 'bs3';
}]);
/**************************************************************************
 * Configure logging
 *************************************************************************/

function disableLogging($logProvider) {
    $logProvider.debugEnabled(__env.enableDebug);
}

disableLogging.$inject = ['$logProvider'];

ngModule.config(disableLogging);

//=========================================================================


ngModule.config(["$locationProvider", "$stateProvider", "$urlRouterProvider", "uiGmapGoogleMapApiProvider", 
function ($locationProvider, $stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
    $stateProvider
        // .state('BrowserOptimizing', {
        //     url: '/browser-optimization',
        //     templateUrl: 'modules/BrowserOptimizing/browser-optimizing.html',
        //     controller: 'BrowserOptimizing',
        //     controllerAs: 'BrowserOptimizing'
        // })


        .state('BrowserOptimizing', {
            url: '/browser-optimization',
            templateUrl: 'modules/BrowserOptimizing/browser-optimizing.html',
            controller: 'BrowserOptimizing',
            controllerAs: 'BrowserOptimizing'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'modules/login/login.html',
            controller: 'login',
            controllerAs: 'login'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'modules/signup/signup.html',
            controller: 'Signup',
            controllerAs: 'Signup'

        })
        .state('main', {
            url: '/main',
            templateUrl: 'modules/main/main.html',
            controller: 'main',
            controllerAs: 'main'

        })




        //====================== User Module Start===============//
        .state('Registered', {
            url: '/users',
            templateUrl: 'modules/UserModule/SingleRegistration/registered.html',
            controller: 'Registered',
            controllerAs: 'Registered',
            params: {
                messageFrom: null
            }
        })
        .state('UserRegistrations', {
            url: '/user-registrations',
            templateUrl: 'modules/UserModule/MultipleRegistration/user_registration.html',
            controller: 'UserRegistration',
            controllerAs: 'UserRegistration'

        })

        //==================== User Module End -----------------
        //==================== Task Manager ==================//
        .state('TaskManager', {
            url: '/task-manager',
            templateUrl: 'modules/TaskManager/task-manager.html',
            controller: 'TaskManagerCtrl',
            controllerAs: 'TaskManagerCtrl',
            params: {
                messageFrom: null,
                message: null
            },
            permission: {
                permissionKey: 'taskManager',
                permissionObj: 'permissionMainObj',
                altRoute: '/main',
                altState: 'main'
            }  
        })
        //==================== Task Manager End ==================//



        // .state('PropertyList', {
        //     url: '/property-list',
        //     templateUrl: 'modules/PropertyModule/property-list/property-list.html',
        //     controller: 'PropertyListCtrl',
        //     controllerAs: 'PropertyListCtrl'
        // })
        .state('PropertyList', {
            url: '/all-property-list',
            templateUrl: 'modules/PropertyModule/property-list/tabs-viewer/tabs-viewer.html',
            controller: 'TabsViewerCtrl',
            controllerAs: 'TabsViewerCtrl',
            permission: {
                permissionKey: 'properties',
                permissionObj: 'permissionMainObj',
                altRoute: '/main',
                altState: 'main'
            } 
        })
        .state('PropertyList.private_property_list', {
            url: '/private-properties',
            templateUrl: 'modules/PropertyModule/property-list/tabs/pri-property-list/property-list.html',
            controller: 'PropertyListCtrl',
            controllerAs: 'PropertyListCtrl',

        })
        .state('PropertyList.pub_property_list', {
            url: '/public-properties',
            templateUrl: 'modules/PropertyModule/property-list/tabs/public-property-list/public-property.html',
            controller: 'PublicPropertyCtrl',
            controllerAs: 'PublicPropertyCtrl',

        })




        //====================== Properties Start===============//

        .state('PropertiesData', {
            url: '/upload-properties',
            templateUrl: 'modules/PropertyModule/UploadProperties/upload_properties.html',
            controller: 'Properties',
            controllerAs: 'Properties',
            params: {
                mappedData: null,
                message: null
            }
        })

        //====================== Sensitivity Testing Start===============//
        .state('ScenarioOne', {
            url: '/workspace-view-one',
            templateUrl: 'modules/PropertyModule/property-workspace/ScenarioOne/Sensitivity/sensitivity.html',
            controller: 'SensitivityOne',
            controllerAs: 'SensitivityOne',
            permission: {
                permissionKey: 'editValuationWorkspace',
                permissionObj: 'permissionPerPropertyObj',
                altRoute: '/workspace-view-one-readonly',
                altState: 'ScenarioOneReadonly'
            }
        })
        .state('ScenarioOneReadonly', {
            url: '/workspace-view-one-readonly',
            templateUrl: 'modules/PropertyModule/property-workspace/ScenarioOne/Sensitivity/sensitivity-readonly.html',
            controller: 'SensitivityOne',
            controllerAs: 'SensitivityOne',

        })
        .state('SensitivityThree', {
            url: '/workspace-view-two',
            templateUrl: 'modules/PropertyModule/property-workspace/ScenarioThree/Sensitivity/sensitivity.html',
            controller: 'SensitivityThree',
            controllerAs: 'SensitivityThree',
            permission: {
                permissionKey: 'editValuationWorkspace',
                permissionObj: 'permissionPerPropertyObj',
                altRoute: '/workspace-view-two-readonly',
                altState: 'SensitivityThreeReadonly'
            }
        })
        .state('SensitivityThreeReadonly', {
            url: '/workspace-view-two-readonly',
            templateUrl: 'modules/PropertyModule/property-workspace/ScenarioThree/Sensitivity/sensitivity-readonly.html',
            controller: 'SensitivityThree',
            controllerAs: 'SensitivityThree'
        })


        //====================== Sensitivity Testing End===============//
        .state('propertyValuation', {
            url: '/property-valuation',
            templateUrl: 'modules/PropertyModule/property-valuation/property-valuation.html',
            controller: 'PropValuation',
            controllerAs: 'PropValuation',
            permission: {
                permissionKey: 'editValuationForm',
                permissionObj: 'permissionPerPropertyObj',
                altRoute: '/property-valuation-readonly',
                altState: 'propertyValuationReadonly'
            },
            params: {
                property: null,
                messageFrom: null
            }
        })
        .state('propertyValuationReadonly', {
            url: '/property-valuation-readonly',
            templateUrl: 'modules/PropertyModule/property-valuation/property-valuation.html',
            controller: 'PropValuation',
            controllerAs: 'PropValuation',
            params: {
                property: null,
                messageFrom: null
            }
        })
        .state('propertyAssignment', {
            url: '/property-assignment',
            templateUrl: 'modules/PropertyModule/PropertyAssignment/property-assignment.html',
            controller: 'PropAssignment',
            controllerAs: '$ctrl',
            permission: {
                permissionKey: 'assignProperty',
                permissionObj: 'permissionPerPropertyObj',
                altRoute: '/private-properties',
                altState: 'PropertyList.private_property_list'
            }, 
            params: {
                property: null
            }
        })
        .state('assignedUsersList', {
            url: '/assigned-users-list',
            templateUrl: 'modules/PropertyModule/PropertyAssignment/AssignedUsers/assigned-users-list.template.html',
            controller: 'AssignedUsersListCtrl',
            controllerAs: '$ctrl',
            permission: {
                permissionKey: 'assignProperty',
                permissionObj: 'permissionPerPropertyObj',
                altRoute: '/private-properties',
                altState: 'PropertyList.private_property_list'
            }, 
            params: {
                property: null
            }
        })          
        .state('propertyWorkspace', {
            url: '/property-workspace',
            templateUrl: 'modules/PropertyModule/property-workspace/property-workspace.html',
            controller: 'PropWorkspace',
            controllerAs: 'PropWorkspace',
            params: {
                property: null
            }
        })

        .state('listProperties', {
            url: '/properties_list',
            templateUrl: 'modules/PropertyModule/PropertyDetails/property_details.html',
            controller: 'PropList',
            controllerAs: 'PropList',
            params: {
                propertyListMessage: null,
                messageFrom: null
            }
        })
        .state('taxBill', {
            url: '/upload-tax-bill',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/ManualUpload/TaxBill/taxBill.html',
            controller: 'taxBill',
            controllerAs: 'taxBill',
            params: {
                propertyListMessage: null,
                messageFrom: null
            }
        })
        .state('unlinkedProperties', {
            url: '/unlinkedProperties',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/unlinkedProperties/unlinkedPropertiesViewer.html',
            controller: 'unlinkedProperties',
            controllerAs: 'unlinkedProperties',
        })
        .state('unlinkedProperties.corruptFiles', {
            url: '/corrupt-files',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/unlinkedProperties/tabs/corrupt/corrupt.html',
            controller: 'corruptFiles',
            controllerAs: 'corruptFiles'
        })
        .state('unlinkedProperties.unlinkedFiles', {
            url: '/unlinked-files',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/unlinkedProperties/tabs/unlinked/unlinked.html',
            controller: 'unlinkedFiles',
            controllerAs: 'unlinkedFiles'
        })
        .state('unlinkedProperties.unparsedFiles', {
            url: '/unparsed-files',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/unlinkedProperties/tabs/unparsed/unparsed.html',
            controller: 'unparsedFiles',
            controllerAs: 'unparsedFiles'
        })



        .state('uploadIERR', {
            url: '/uploadIERR',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/SingleUpload/uploadIERR.html',
            controller: 'uploadIERR',
            controllerAs: 'uploadIERR',
            params: {
                property: null
            }
        })
        .state('updateIERR', {
            url: '/update-IERR/:id',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/Update_IE_RR/update_IE_RR.html',
            controller: 'updateIERR',
            controllerAs: 'updateIERR',
            params: {
                property: null
            }
        })
        .state('manualIE', {
            url: '/manual-upload-income-expense',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/ManualUpload/IE/manualIE.html',
            controller: 'manualIE',
            controllerAs: 'manualIE',
            params: {
                property: null
            }
        })
        .state('manualRR', {
            url: '/manual-upload-rent-roll',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/ManualUpload/RR/manualRR.html',
            controller: 'manualRR',
            controllerAs: 'manualRR',
            params: {
                property: null
            }
        })
        //====================== TABS IE&RR Properties Start===============//
        .state('viewIERR', {
            url: '/viewIERR',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/View_IE_RR/viewIERR/viewIERR.html',
            controller: 'viewIERR',
            controllerAs: 'viewIERR',
            params: {
                property: null
            }
        })
        // .state('viewIERR.property_details', {
        //     url: '/property_details',
        //     templateUrl: 'modules/PropertyModule/IE_RR_Module/View_IE_RR/tabs/property_details/property_details.html',
        //     controller: 'property_details',
        //     controllerAs: 'property_details',
        //     params: {
        //         property: null
        //     }
        // })
        .state('viewIERR.propertyDetailsTab', {
            url: '/property-details-tab',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/View_IE_RR/tabs/propertyDetails/propertyDetails.html',
            controller: 'PropertyDetailsTab',
            controllerAs: 'PropertyDetailsTab',
            params: {
                property: null
            }
        })
        .state('viewIERR.public_property_tab', {
            url: '/public_property_tab',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/View_IE_RR/tabs/public_property_details/publicPropertyDetailsTab.html',
            controller: 'PublicPropertyDetailsForProperty',
            controllerAs: 'PublicPropertyDetailsTab'
        }) 
        .state('viewIERR.income_expense', {
            url: '/income_expense',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/View_IE_RR/tabs/income_expense/income_expense.html',
            controller: 'income_expense',
            controllerAs: 'income_expense',
            params: {
                property: null
            }
        })
        .state('viewIERR.rent_role', {
            url: '/rent_roll',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/View_IE_RR/tabs/rent_role/rent_role.html',
            controller: 'rent_role',
            controllerAs: 'rent_role',
            params: {
                property: null
            }
        })
        .state('viewIERR.other_files', {
            url: '/other_files',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/View_IE_RR/tabs/other_files/other_files.html',
            controller: 'other_files',
            controllerAs: 'other_files',
            params: {
                property: null
            }
        })
        .state('viewIERR.tax_bills', {
            url: '/tax_bills',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/View_IE_RR/tabs/tax_bills/tax_bills.html',
            controller: 'tax_bills',
            controllerAs: 'tax_bills',
            params: {
                property: null
            }
        })
        .state('multipleUploadIERR', {
            url: '/multipleUploadIERR',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/multipleUpload/multipleUploadIERR.html',
            controller: 'multipleUploadIERR',
            controllerAs: 'multipleUploadIERR'
        })
        .state('map_data', {
            url: '/data-mapping',
            templateUrl: 'modules/PropertyModule/UploadProperties/map_data/map_data.html',
            controller: 'Map',
            controllerAs: 'Map',
            params: {
                parsedProperty: null
            }
        })

        //========================Comparable Module =======================//
        .state('comparableSelection', {
            url: '/comparable-selection',
            templateUrl: 'modules/ComparableModule/SalesComparable/ComparableSelection/ComparableSelection.html',
            controller: 'ComparableSelection',
            controllerAs: 'ComparableSelection'
        })

        .state('comparableProperties', {
            url: '/comparable-properties',
            templateUrl: 'modules/ComparableModule/SalesComparable/ComparableProperties/ComparableProperties.html',
            controller: 'ComparableProperties',
            controllerAs: 'ComparableProperties'
        })

        .state('publicPropertyDetailsTab', {
            url: '/public-property-details',
            templateUrl: 'modules/PropertyModule/IE_RR_Module/View_IE_RR/tabs/public_property_details/publicPropertyDetails.html',
            controller: 'PublicPropertyDetailsTab',
            controllerAs: 'PublicPropertyDetailsTab',
            params: {
                property: null
            }
        })

        .state('selectedComparable', {
            url: '/selected-properties-comparable',
            templateUrl: 'modules/ComparableModule/SalesComparable/SelectedComparables/SelectedComparables.html',
            controller: 'SelectedComparable',
            controllerAs: 'SelectedComparable'
        })


        //========================AJ Module =======================//
        .state('viewAJData', {
            url: '/viewAJData',
            templateUrl: 'modules/AJModules/ViewAJData/viewAJData.html',
            controller: 'viewAJData',
            controllerAs: 'viewAJData'
        })
        .state('viewAJForm', {
            url: '/viewAJForm',
            templateUrl: 'modules/AJModules/ViewAJForm/viewAJForm.html',
            controller: 'viewAJForm',
            controllerAs: 'viewAJForm',
            params: {
                AJData: null
            }
        })
        .state('addSurvey', {
            url: '/addSurvey',
            templateUrl: 'modules/AJModules/AddSurvey/addSurvey.html',
            controller: 'addSurvey',
            controllerAs: 'addSurvey'
        })
        .state('addSurveyDemo', {
            url: '/addSurveyDemo',
            templateUrl: 'modules/AJModules/AddSurveyDemo/addSurveyDemo.html',
            controller: 'addSurveyDemo',
            controllerAs: 'addSurveyDemo'
        })
        .state('createComparablesForm', {
            url: '/create-comparables',
            templateUrl: 'modules/ComparableModule/SalesComparable/ComparableForm/comparableForm.html',
            controller: 'CreateComparablesForm',
            controllerAs: 'CreateComparablesForm',
            params: {
                property: null
            }
        })

        .state('createPrincipalForm', {
            url: '/create-comparable-princpal',
            templateUrl: 'modules/ComparableModule/SalesComparable/PrincipalForm/principalForm.html',
            controller: 'CreatePrincipalForm',
            controllerAs: 'CreatePrincipalForm',
            params: {
                property: null
            }
        })


        .state('AddQuestion', {
            url: '/question',
            templateUrl: 'modules/SurveyModule/Wizards/AddQuestion/add-question.html',
            controller: 'AddQuestionCtrl',
            controllerAs: 'AddQuestionCtrl',
            params: {
                property: null
            }
        })


        //========================Survey Module =======================//
        .state('Survey', {
            url: '/surveys',
            templateUrl: 'modules/SurveyModule/WizardsViewer/WizardsViewer.html',
            controller: 'WizardsViewerCtrl',
            controllerAs: 'WizardsViewerCtrl'
        })

        .state('SurveyList', {
            url: '/survey-list',
            templateUrl: 'modules/SurveyModule/SurveyList/survey-list.html',
            controller: 'SurveyList',
            controllerAs: 'SurveyList',
            permission: {
                permissionKey: 'surveys',
                permissionObj: 'permissionMainObj',
                altRoute: '/main',
                altState: 'main'
            }             
        })

        .state('FillSurvey', {
            url: '/fill-survey/:id',
            templateUrl: 'modules/SurveyModule/FillSurvey/fill-survey.html',
            controller: 'FillSurvey',
            controllerAs: 'FillSurvey'
        })

        .state('SubmissionList', {
            url: '/submission-list/:id',
            templateUrl: 'modules/SurveyModule/SubmissionList/submission-list.html',
            controller: 'SubmissionList',
            controllerAs: 'SubmissionList'
        })

        .state('SurveySubmissions', {
            url: '/survey-submission/:id/:surveyId',
            templateUrl: 'modules/SurveyModule/SurveySubmissions/surveySubmissions.html',
            controller: 'SurveySubmissions',
            controllerAs: 'SurveySubmissions'
        })

        .state('TaxAppeal', {
            url: '/appeal',
            templateUrl: 'modules/PropertyModule/taxAppeal/tax-appeal.html',
            controller: 'TaxAppeal',
            controllerAs: 'TaxAppeal'
        })

        //Daniyal: to be tested (made by Kumail)
        // .state('contractWizard', {
        //     url: '/contracts',
        //     templateUrl: 'modules/ContractModule/contract-wizard/contract-wizard.html',
        //     controller: 'ContractWizardCtrl',
        //     controllerAs: 'ContractWizardCtrl',
        //     params: {
        //         property: null
        //     }
        // })

        .state('Contract', {
            url: '/contract-builder',
            templateUrl: 'modules/ContractModule/tabs-viewer/tabs-viewer.html',
            controller: 'Contract',
            controllerAs: 'Contract'
        })
        .state('ViewContract', {
            url: '/contract-builder/:id',
            templateUrl: 'modules/ContractModule/tabs-viewer/tabs-viewer.html',
            controller: 'Contract',
            controllerAs: 'Contract'
        })


        // .state('SampleCalculation', {
        //     url: '/sample-calculation',
        //     templateUrl: 'modules/ContractModule/SampleCalculation/sample-calculation.html',
        //     controller: 'SampleCalculation',
        //     controllerAs: 'SampleCalculation'
        // })


        .state('SavedContractList', {
            url: '/saved-contract-list',
            templateUrl: 'modules/ContractModule/SavedContractList/saved-contract-list.html',
            controller: 'SavedContractList',
            controllerAs: 'SavedContractList',
            permission: {
                permissionKey: 'contracts',
                permissionObj: 'permissionMainObj',
                altRoute: '/main',
                altState: 'main'
            }             
        })

        .state('SectionSettings', {
            url: '/section-settings',
            templateUrl: 'modules/SurveyModule/Wizards/sectionSettings/sectionSettings.component.html',
            controller: 'sectionSettingsCtrl',
            controllerAs: 'sectionSettingsCtrl'
        })

        .state('EditSurvey', {
            url: '/edit-survey/:id',
            templateUrl: 'modules/SurveyModule/EditSurvey/editSurveyWizard/editSurveyWizard.component.html',
            controller: 'editSurveyCtrl',
            controllerAs: 'editSurveyCtrl'
        })

        .state('InvoiceList', {
            url: '/invoice-list/:id',
            templateUrl: 'modules/ContractModule/InvoiceList/invoice-list.html',
            controller: 'InvoiceList',
            controllerAs: 'InvoiceList'
        })

        .state('NewInvoice', {
            url: '/new-invoice/:id',
            templateUrl: 'modules/ContractModule/NewInvoice/new-invoice.html',
            controller: 'NewInvoice',
            controllerAs: '$ctrl'
        })

        .state('Reports', {
            url: '/view-reports/:id',
            templateUrl: 'modules/Reports/view-reports/view-reports.component.html',
            controller: 'ViewReportsCtrl',
            controllerAs: 'ViewReportsCtrl'


        })
        //========================Appeal Module =======================//
        .state('Appeal', {
            url: '/appeal',
            templateUrl: 'modules/Appeal/Form/form.template.html',
            //controller: 'WizardsViewerCtrl',
            //controllerAs: '$ctrl'
        })
        .state('TimelineGraphical', {
            url: '/timeline-graphical',
            templateUrl: 'modules/Appeal/TimelineGraphical/timeline-graphical.template.html',
            controller: 'timelineGraphicalCtrl',
            controllerAs: '$ctrl',
            permission: {
                permissionKey: 'timeline',
                permissionObj: 'permissionMainObj',
                altRoute: '/main',
                altState: 'main'
            } 
            //params: { jurisdiction: null }
        })
        .state('inventory', {
            url: '/inventory',
            templateUrl: 'modules/UserModule/Inventory/inventory.html',
            controller: 'InventoryCtrl',
            controllerAs: 'InventoryCtrl'
        })
        //========================User Rights =======================//
        .state('user-rights', {
            url: '/user-rights',
            templateUrl: 'modules/UserModule/UserRights/user-roles-list.template.html',
            controller: 'UserRolesListCtrl',
            controllerAs: '$ctrl'
        })  .state('settings', {
            url: '/settings',
            templateUrl: 'modules/settings/main/main.html',
            controller: '_settings',
            controllerAs: '_settings'
        });;






    $urlRouterProvider.otherwise('/login');

    // $locationProvider.html5Mode({
    //          enabled: true,
    //          requireBase: true
    //   });

    //uiGmapGoogleMapApiProvider.configure({
    //    key: 'AIzaSyA3YdzkKmJMsp2dAR0PtBXtiI77yiFN4tw', //AIzaSyAASFxjnvu4kn471TvbAj9SQVlrXDn0fos
    //    v: '3.20', //defaults to latest 3.X anyhow
    //    libraries: 'weather,geometry,visualization'
    //});


}]);


/**************************************************************************
 * Make environment available in Angular
 *************************************************************************/

ngModule.constant('__env', __env);

function logEnvironment($log, __env) {
    $log.debug('Environment variables:');
    $log.debug(__env);
}
ngModule.run(["$log", "__env", logEnvironment]);

//agGrid.initialiseAgGridWithAngular1(angular);

require('zingchart');
require('../modules/AJModules');
require('../modules/BrowserOptimizing');
require('../modules/ComparableModule');
require('../modules/ContractModule');
require('../modules/Directive');
require('../modules/header');
require('../modules/login');
require('../modules/main');
require('../modules/PropertyModule');
require('../modules/signup');
require('../modules/SurveyModule');
require('../modules/TaskManager');
require('../modules/UserModule');
require('../Service');
require('../config');
require('../modules/Reports');
require('../modules/Appeal');
require('../modules/settings')
require('../Directives');