'use strict';

_PropValuation.$inject = ["$state", "$timeout", "$rootScope", "$stateParams", "AOTCService", "$scope", "ValuationService", "UtilService", "PetitionerFormulae"];
module.exports = {PropValuation: _PropValuation, inputFocusFunction: _inputFocusFunction};
var async = require('async');
//angular.module('AOTC')
//    .directive('inputFocusFunction', _inputFocusFunction
//    )
//    .controller('PropValuation',_PropValuation );
function _PropValuation($state, $timeout, $rootScope, $stateParams, AOTCService, $scope, ValuationService, UtilService, PetitionerFormulae) {
    ////console.log("PropValuation controller", $stateParams);

    var vm = this;

    vm.calculateMRPetitioner = calculateMRPetitioner;
    vm.calculateERandVacPetitioner = calculateERandVacPetitioner;
    vm.calculateExpensesPetitioner = calculateExpensesPetitioner;
    vm.calculateNOIPetitioner = calculateNOIPetitioner;
    vm.calculateBCRPetitioner = calculateBCRPetitioner;
    vm.calculateMRAssessor = calculateMRAssessor;
    vm.calculateERandVacAssessor = calculateERandVacAssessor;
    vm.calculateExpensesAssessor = calculateExpensesAssessor;
    vm.calculateNOIAssessor = calculateNOIAssessor;
    vm.calculateBCRAssessor = calculateBCRAssessor;
    vm.calculateExpensesAssessorSF = calculateExpensesAssessorSF;

    vm.selectedValuationYear = selectedValuationYear;
    vm.calculateDeductAndCapex = calculateDeductAndCapex;
    vm.petitionerModalSelected = petitionerModalSelected;
    vm.assessorModalOneSelected = assessorModalOneSelected;
    vm.selectedValuationYearModal = selectedValuationYearModal;
    vm.getAllValuationForms = getAllValuationForms;
    // vm.viewForm = viewForm;

    //for calculating values on input ng-blur
    vm.calculateMRInput = calculateMRInput;
    vm.calculateERandVacInput = calculateERandVacInput;
    vm.calculateExpensesInput = calculateExpensesInput;
    vm.calculateExpensesSFInput = calculateExpensesSFInput;
    vm.calculateNOIInput = calculateNOIInput;
    vm.calculateBCRInput = calculateBCRInput;
    // end

    vm.ToggleLabelInputs = ToggleLabelInputs; //assessor heading th so that switch auto to manual dont have modeel drop down
    vm.addPetitionerEvidence = addPetitionerEvidence; //OPEN MODEL(myModalEvidence) TO SELECT EVIDENCES
    vm.sortBy = sortBy;
    vm.useModalValues = useModalValues;


    //===============================   variables ======================== //
    vm.currentForm = null;
    vm.formId = null;
    vm.formStatus = false;
    vm.noFormsFound = false;
    vm.isReplace = false;
    vm.alreadyExists = false;
    vm.formName = "";
    vm.formsList = [];
    vm.forms = false;
    vm.createNew = false;
    vm.yardiIEData = {};
    vm.mriIEData = {};
    vm.yearOfData = '';
    vm.showYear = false;
    vm.petitionerModalOne = {};
    vm.petitionerModalTwo = {};
    vm.petitionerModalThree = {};
    vm.assessorModalOne = {};
    vm.assessorModalTwo = {};
    vm.assessorModalThree = {};
    vm.selectedEvidences = [];
    vm.attachFileSelection = 0;
    vm.MREvidences = [];
    vm.VacancyEvidences = [];
    vm.ExpEvidences = [];
    vm.ExpPSFEvidences = [];
    vm.OIEvidences = [];
    vm.BCREvidences = [];
    vm.ETREvidences = [];
    vm.FreeRentEvidences = [];
    vm.LeasingEvidences = [];
    vm.TenantImprovementEvidences = [];
    vm.LostRentEvidences = [];
    vm.AddBackEvidences = [];
    vm.CapexEvidences = [];
    vm.DeductionEvidences = [];

    vm.allEvidenceFiles = [];
    vm.selectedEvidences = [];
    vm.buttonAOTCLabel = 'Hide AOTC Column';
    vm.buttonYearLabel = 'Hide Year Column ';

    vm.sortKey = '';
    vm.sortKeySelected = '';
    vm.sortBySelected = sortBySelected;

    vm.searchWordAllFile = '';
    vm.searchWordSelectedFile = '';


    vm.yearChecked = true;
    vm.recomendationChecked = true;
    vm.buttonAOTCLabelToggle = true;

    //gives sorted array which have to be shown in all files
    //gives sorted array which have to be shown in all files

    vm.valuationYear = 'selected'; // selected so that dropdown shows select year label by default
    vm.valuationData = {};
    vm.modalSelected = true;
    vm.hideBeforeSelection = true; //hide all tables
    vm.disableExpenseFieldsPer = false;
    vm.disableExpenseFieldsSF = false;
    vm.toggleLabelInputs = true;
    vm.useValuesSelection = 0; // 1 assessor 2 petitioner



    function resetFormVariables(){
        vm.deductAndCapex = {
            freeRent: '',
            leasingCommision: '',
            tenantImprovement: '',
            lostRent: '',
            exessRent: '',
            capex: '',
            TDA: '',
            VDC: '',
            VDL: ''
        };

        vm.valuationPropertyData = {
            SFLPetitioner: 0,
            MRPetitioner: '',
            ARPetitioner: 0,
            GPRPetitioner: 0,
            VacancyPerPetitioner: '',
            VacancyDolarPetitioner: 0,
            ERPetitioner: 0,
            expensePerPetitioner: '',
            expenseDolarPetitioner: 0,
            expensePerSFPetitioner: '',
            otherIncomePetitioner: '',
            NOIPetitioner: 0,
            BCRPetitioner: '',
            ETRPetitioner: '',
            OCRPetitioner: 0,
            VDCPetitioner: 0,
            VPSFPetitioner: 0
        };

        vm.assessorValuationData = {
            SFLPetitioner: 0,
            MRPetitioner: '',
            ARPetitioner: 0,
            GPRPetitioner: 0,
            VacancyPerPetitioner: '',
            VacancyDolarPetitioner: 0,
            ERPetitioner: 0,
            expensePerPetitioner: '',
            expenseDolarPetitioner: 0,
            expensePerSFPetitioner: '',
            otherIncomePetitioner: '',
            NOIPetitioner: 0,
            BCRPetitioner: '',
            ETRPetitioner: '',
            OCRPetitioner: 0,
            VDCPetitioner: 0,
            VPSFPetitioner: 0
        };

        vm.modalAssessorValues = {
            SFLPetitioner: 0,
            MRPetitioner: '',
            ARPetitioner: 0,
            GPRPetitioner: 0,
            VacancyPerPetitioner: '',
            VacancyDolarPetitioner: 0,
            ERPetitioner: 0,
            expensePerPetitioner: '',
            expenseDolarPetitioner: 0,
            expensePerSFPetitioner: '',
            otherIncomePetitioner: '',
            NOIPetitioner: 0,
            BCRPetitioner: '',
            ETRPetitioner: '',
            OCRPetitioner: 0,
            VDCPetitioner: 0,
            VPSFPetitioner: 0
        };

        vm.modalPetitionerValues = {
            SFLPetitioner: 0,
            MRPetitioner: '',
            ARPetitioner: 0,
            GPRPetitioner: 0,
            VacancyPerPetitioner: '',
            VacancyDolarPetitioner: 0,
            ERPetitioner: 0,
            expensePerPetitioner: '',
            expenseDolarPetitioner: 0,
            expensePerSFPetitioner: '',
            otherIncomePetitioner: '',
            NOIPetitioner: 0,
            BCRPetitioner: '',
            ETRPetitioner: '',
            OCRPetitioner: 0,
            VDCPetitioner: 0,
            VPSFPetitioner: 0
        };

        vm.attachNotes =
            [
                {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }, {
                    text: ''
                }
            ];
    }

    resetFormVariables();

    function getModalsAndConsolidatedData(){
        //get drop-down modals of petitioner and assessor
        vm.assessorModalData = [];

        ValuationService.getPetitionerModalsData()
            .then(function(result) {
                // ////console.log(result);
                vm.assessorModalData = result.data.result[0].models;
            }, function(err) {
                ////console.log(err);
            });

        //get yardi Mri Data
        getConsolidatedData(function(err, succ) {
            ////console.log('getConsolidatedData Server Data : ')
        });
    }

    //===============================   get property from local Storage======================== //
    // $stateParams.messageFrom = 'scenario';
    // $stateParams.messageFrom = 'scenario';


    vm.property = JSON.parse(localStorage.getItem('propertyDetails'));
    vm.propertyId = JSON.parse(localStorage.getItem('propertyId'));
    vm.selectedScenario = JSON.parse(localStorage.getItem('selectedScenario'));

    if (vm.selectedScenario) {
        ////console.log('111111111111111111111111111111111');

        vm.hideBeforeSelection = false;
        vm.createNew = false;
        vm.formName = localStorage.getItem('formName');

        vm.valuationPropertyData.SFLPetitioner = vm.selectedScenario.petitionerLeasableSF;
        vm.valuationPropertyData.MRPetitioner = vm.selectedScenario.petitionerMarketRentSF;
        vm.valuationPropertyData.ARPetitioner = vm.selectedScenario.petitionerAnnualRent;
        vm.valuationPropertyData.GPRPetitioner = vm.selectedScenario.petitionerGPR;
        vm.valuationPropertyData.VacancyPerPetitioner = vm.selectedScenario.petitionerVacancyPercentage;
        vm.valuationPropertyData.VacancyDolarPetitioner = vm.selectedScenario.petitionerVacancy;
        vm.valuationPropertyData.ERPetitioner = vm.selectedScenario.petitionerEffectiveRent;
        vm.valuationPropertyData.expensePerPetitioner = vm.selectedScenario.petitionerExpensePercentage;
        vm.valuationPropertyData.expenseDolarPetitioner = vm.selectedScenario.petitionerExpense;
        vm.valuationPropertyData.expensePerSFPetitioner = vm.selectedScenario.petitionerExpenseSF;
        vm.valuationPropertyData.otherIncomePetitioner = vm.selectedScenario.petitionerOI;
        vm.valuationPropertyData.NOIPetitioner = vm.selectedScenario.NOI;
        vm.valuationPropertyData.BCRPetitioner = vm.selectedScenario.BCR;
        vm.valuationPropertyData.ETRPetitioner = vm.selectedScenario.petitionerETR;
        vm.valuationPropertyData.OCRPetitioner = vm.selectedScenario.petitionerOCR;
        vm.valuationPropertyData.VDCPetitioner = vm.selectedScenario.petitionerVDC;
        vm.valuationPropertyData.VPSFPetitioner = vm.selectedScenario.assessedValueSF;


        getModalsAndConsolidatedData();
        localStorage.removeItem('selectedScenario');


    } else if ($stateParams.messageFrom == 'scenario') {
        ////console.log('2222222222222222222222222222');
        vm.formName = localStorage.getItem('formName');

        vm.hideBeforeSelection = false;
        vm.createNew = false;
        vm.formId = localStorage.getItem('formId');
        ValuationService.getFormById()
            .then(function(result) {
                ////console.log(result.data);
                useForm(result.data.result[0], function(err, succ) {
                    ////console.log('getFormById Server Data : ', result.data)
                })
            }, function(err) {
                ////console.log(result);
            });

        getModalsAndConsolidatedData();


    } else {
        ////console.log('333333333');


        vm.hideBeforeSelection = true;
        // vm.createNew = true;

        setTimeout(function() {
            $("#myModal").modal('toggle');
        }, 200);
    }
    //==========================================Methods========================================= //
    //================================   GETTING ALL EVIDENCE FILES ======================== //
    getAllEvidenceFiles();

    function getAllEvidenceFiles() {

        vm.allEvidenceFiles = [];

        $("#preloader").css("display", "block");
        var url = '/valuation/get-evidence-files';
        var _data = {propId: parseInt(localStorage.getItem('propertyId'))};
        ////console.log(url)

        AOTCService.postDataToServer(url, _data)
            .then(function(result) {

                var serverData = result.data;
                ////console.log('All Evidences Receieved Server Data');
                ////console.log(serverData);

                if (serverData.success) {

                    vm.allEvidenceFiles = serverData.result[0].evidences;
                    //by default sort By date
                    // sortBy('createdDate');
                    localStorage.removeItem('evidenceFilesAtServer');
                    localStorage.setItem('evidenceFilesAtServer', angular.toJson(vm.allEvidenceFiles));

                    for (var i = 0; i < vm.allEvidenceFiles.length; i++) {
                        var evidFile = vm.allEvidenceFiles[i];

                        for (var k = 0; k < vm.selectedEvidences.length; k++) {
                            var selectedEvid = vm.selectedEvidences[k];
                            if (selectedEvid._id == evidFile._id) {

                                vm.allEvidenceFiles.splice(i, 1);
                                i = i - 1;

                            }

                        }

                    }

                }

                $("#preloader").css("display", "none");


            }, function(result) {
                //some error
                ////console.log(result);
                $("#preloader").css("display", "none");

            });
    }

    function getAllValuationForms() {
        vm.createNew = true;
        // ////console.log(vm.propertyId);
        // ////console.log(vm.valuationYear);
        localStorage.setItem('valuationYear', vm.valuationYear);
        // localStorage.removeItem('formId');
        var formData = {
            "propId": vm.propertyId,
            "valuationYear": parseInt(localStorage.getItem('valuationYear'))
        };
        $("#preloader").css("display", "block");
        var url = "/valuation/get-forms-by-propertyId";
        ValuationService.getValuationForms(url, formData)
            .then(function(result) {
                ////console.log('getValuationForms serverData:');
                ////console.log(result);
                vm.formsList = result.data.result;
                // if (vm.formsList.length > 0) {
                //     vm.forms = true;
                // } else {
                //     vm.noFormsFound = true;
                // }
                $("#preloader").css("display", "none");
                $("#myModal").modal('hide');

                // localStorage.removeItem('formName');


            });
    }


    vm.appeal = function() {
        var url = "/valuation/appeal";
        ////console.log(vm.formId);
        var formData = {
            propId:parseInt(localStorage.getItem('propertyId')),
            formId: vm.formId
        };
        ValuationService.appeal(url, formData)
            .then(function(result) {
                ////console.log(result);
                $("#preloader").css("display", "none");
                $("#myAppealModal").modal('hide');

            });
    }

    vm.deleteForm = function() {
        vm.formId = vm.currentForm.valuationForm._id;
        var url = "/valuation/delete-valuation-form";
        ////console.log(vm.formId);
        var formData = {
            formId: vm.formId
        }
        ValuationService.deleteForm(url, formData)
            .then(function(result) {
                ////console.log(result);
                vm.hideBeforeSelection = true;
                $("#myDeleteModal").modal('hide');
                vm.formStatus = false;
                getAllValuationForms();
                $("#preloader").css("display", "none");

            });
    }

    vm.openDeleteModal = function(forms) {
        if(forms == "inside"){
            ////console.log("inside");
            vm.currentForm = JSON.parse(localStorage.getItem('selectedValuationForm'));
        }
        else{
            vm.currentForm = forms;
        }
        ////console.log('openModal')
        $timeout(function() {
            $('#myDeleteModal').modal('toggle');

        }, 100);
    }

    vm.saveForm = function() {
        $("#preloader").css("display", "block");
        localStorage.setItem('formName', vm.formName);

        getModalsAndConsolidatedData();
        var MRids = getEvidencePropertyIds(vm.MREvidences);
        var Vacids = getEvidencePropertyIds(vm.VacancyEvidences);
        var Expids = getEvidencePropertyIds(vm.ExpEvidences);
        var ExpSFids = getEvidencePropertyIds(vm.ExpPSFEvidences);
        var OIids = getEvidencePropertyIds(vm.OIEvidences);
        var BCRids = getEvidencePropertyIds(vm.BCREvidences);
        var ETRids = getEvidencePropertyIds(vm.ETREvidences);
        var Rentids = getEvidencePropertyIds(vm.FreeRentEvidences);
        var leaseids = getEvidencePropertyIds(vm.LeasingEvidences);
        var tenantids = getEvidencePropertyIds(vm.TenantImprovementEvidences);
        var lostids = getEvidencePropertyIds(vm.LostRentEvidences);
        var AddBackids = getEvidencePropertyIds(vm.AddBackEvidences);
        var Capexids = getEvidencePropertyIds(vm.CapexEvidences);
        var Deductionids = getEvidencePropertyIds(vm.DeductionEvidences);

        var jsonFormat = {
            propId: vm.propertyId,
            valuationYear: parseInt(localStorage.getItem('valuationYear')),
            name: vm.formName,
            status: vm.formStatus,
            valuationData: {
                marketRentPerSF: [vm.assessorValuationData.MRPetitioner, vm.valuationPropertyData.MRPetitioner.toString()],
                marketRentPerSFEvidence: MRids,
                marketRentPerSFNote: vm.attachNotes[1].text,

                vacancyPercentage: [vm.assessorValuationData.VacancyPerPetitioner, vm.valuationPropertyData.VacancyPerPetitioner.toString()],
                vacancyPercentageEvidence: Vacids,
                vacancyPercentageNote: vm.attachNotes[2].text,

                expensePercentage: [vm.assessorValuationData.expensePerPetitioner, vm.valuationPropertyData.expensePerPetitioner.toString()],
                expensePercentageEvidence: Expids,
                expensePercentageNote: vm.attachNotes[3].text,

                expensePerSF: [vm.assessorValuationData.expensePerSFPetitioner, vm.valuationPropertyData.expensePerSFPetitioner.toString()],
                expensePerSFEvidence: ExpSFids,
                expensePerSFNote: vm.attachNotes[4].text,

                otherIncome: [vm.assessorValuationData.otherIncomePetitioner, vm.valuationPropertyData.otherIncomePetitioner.toString()],
                otherIncomeEvidence: OIids,
                otherIncomeNote: vm.attachNotes[5].text,

                baseCapRate: [vm.assessorValuationData.BCRPetitioner, vm.valuationPropertyData.BCRPetitioner.toString()],
                baseCapRateEvidence: BCRids,
                baseCapRateNote: vm.attachNotes[6].text,

                effectiveTaxRate: [vm.assessorValuationData.ETRPetitioner, vm.valuationPropertyData.ETRPetitioner.toString()],
                effectiveTaxRateEvidence: ETRids,
                effectiveTaxRateNote: vm.attachNotes[7].text,

                freeRent: vm.deductAndCapex.freeRent.toString(),
                freeRentEvidence: Rentids,
                freeRentNote: vm.attachNotes[8].text,

                leasingCommission: vm.deductAndCapex.leasingCommision.toString(),
                leasingCommissionEvidence: leaseids,
                leasingCommissionNote: vm.attachNotes[9].text,

                tenantsImprovements: vm.deductAndCapex.tenantImprovement.toString(),
                tenantsImprovementsEvidence: tenantids,
                tenantsImprovementsNote: vm.attachNotes[10].text,

                lostRent: vm.deductAndCapex.lostRent.toString(),
                lostRentEvidence: lostids,
                lostRentNote: vm.attachNotes[11].text,

                addBackExcessRent: vm.deductAndCapex.exessRent.toString(),
                addBackExcessRentEvidence: AddBackids,
                addBackExcessRentNote: vm.attachNotes[12].text,

                capEx: vm.deductAndCapex.capex.toString(),
                capExEvidence: Capexids,
                capExNote: vm.attachNotes[13].text,

                totalDeductionsAddtions: vm.deductAndCapex.TDA.toString(),
                totalDeductionsAddtionsEvidence: Deductionids,
                totalDeductionsAddtionsNote: vm.attachNotes[14].text,
            }
        };

        if (vm.isReplace === '1') {
            ////console.log(jsonFormat);
            var url = '/valuation/replace-valuation-form';
            ValuationService.replaceValuationForm(url, jsonFormat)
                .then(function(result) {
                    ////console.log("Server Data : valuation/replace-form\n", result);
                    var serverData = result.data;
                    $("#preloader").css("display", "none");

                    if (serverData.success) {
                        getAllValuationForms();
                        vm.hideBeforeSelection = true;
                        vm.createNew = true;
                        $("#mySaveModal").modal('hide');
                        $scope.$emit('success', serverData.message);
                    } else {
                        getAllValuationForms();
                        vm.hideBeforeSelection = true;
                        vm.createNew = true;
                        $("#mySaveModal").modal('hide');
                        $scope.$emit('error', serverData.message);
                    }
                    getAllEvidenceFiles();
                }, function(error) {
                    $("#preloader").css("display", "none");
                    $("#error_linking").fadeIn(1500).delay(500).fadeOut(500);
                    ////console.log(error);
                });
        } else {
            var url = '/valuation/save-form';
            ValuationService.postDataToServer(url, jsonFormat)
                .then(function(result) {
                    ////console.log("Server Data : valuation/save-form\n", result);
                    var serverData = result.data;
                    ////console.log('save form response', serverData)
                    $("#preloader").css("display", "none");

                    if (serverData.success) {
                        localStorage.setItem('selectedValuationForm', angular.toJson(serverData.result[0]));
                        localStorage.setItem('formId', serverData.result[0].valuationForm._id);
                        ////console.log("aaaaaaaaaaaaaaaaa", localStorage.getItem('formId'));
                        vm.noFormsFound = false;
                        getAllValuationForms();
                        vm.hideBeforeSelection = true;
                        vm.createNew = true;
                        $("#mySaveModal").modal('hide');
                        vm.createNew = false;
                        vm.hideBeforeSelection = false;
                        $scope.$emit('success', serverData.message);
                    } else {
                        vm.alreadyExists = true;
                    }
                    getAllEvidenceFiles();
                }, function(error) {
                    $("#preloader").css("display", "none");
                    $("#error_linking").fadeIn(1500).delay(500).fadeOut(500);
                    ////console.log(error);
                });
        }
    }


    vm.replaceForm = function() {
        $("#preloader").css("display", "block");
        localStorage.setItem('formName', vm.formName);
        ////console.log("status", vm.formStatus);
        var MRids = getEvidencePropertyIds(vm.MREvidences);
        var Vacids = getEvidencePropertyIds(vm.VacancyEvidences);
        var Expids = getEvidencePropertyIds(vm.ExpEvidences);
        var ExpSFids = getEvidencePropertyIds(vm.ExpPSFEvidences);
        var OIids = getEvidencePropertyIds(vm.OIEvidences);
        var BCRids = getEvidencePropertyIds(vm.BCREvidences);
        var ETRids = getEvidencePropertyIds(vm.ETREvidences);
        var Rentids = getEvidencePropertyIds(vm.FreeRentEvidences);
        var leaseids = getEvidencePropertyIds(vm.LeasingEvidences);
        var tenantids = getEvidencePropertyIds(vm.TenantImprovementEvidences);
        var lostids = getEvidencePropertyIds(vm.LostRentEvidences);
        var AddBackids = getEvidencePropertyIds(vm.AddBackEvidences);
        var Capexids = getEvidencePropertyIds(vm.CapexEvidences);
        var Deductionids = getEvidencePropertyIds(vm.DeductionEvidences);

        var jsonFormat = {
            propId: vm.propertyId,
            valuationYear: parseInt(localStorage.getItem('valuationYear')),
            name: vm.formName,
            status: vm.formStatus,
            valuationData: {
                marketRentPerSF: [vm.assessorValuationData.MRPetitioner, vm.valuationPropertyData.MRPetitioner.toString()],
                marketRentPerSFEvidence: MRids,
                marketRentPerSFNote: vm.attachNotes[1].text,

                vacancyPercentage: [vm.assessorValuationData.VacancyPerPetitioner, vm.valuationPropertyData.VacancyPerPetitioner.toString()],
                vacancyPercentageEvidence: Vacids,
                vacancyPercentageNote: vm.attachNotes[2].text,

                expensePercentage: [vm.assessorValuationData.expensePerPetitioner, vm.valuationPropertyData.expensePerPetitioner.toString()],
                expensePercentageEvidence: Expids,
                expensePercentageNote: vm.attachNotes[3].text,

                expensePerSF: [vm.assessorValuationData.expensePerSFPetitioner, vm.valuationPropertyData.expensePerSFPetitioner.toString()],
                expensePerSFEvidence: ExpSFids,
                expensePerSFNote: vm.attachNotes[4].text,

                otherIncome: [vm.assessorValuationData.otherIncomePetitioner, vm.valuationPropertyData.otherIncomePetitioner.toString()],
                otherIncomeEvidence: OIids,
                otherIncomeNote: vm.attachNotes[5].text,

                baseCapRate: [vm.assessorValuationData.BCRPetitioner, vm.valuationPropertyData.BCRPetitioner.toString()],
                baseCapRateEvidence: BCRids,
                baseCapRateNote: vm.attachNotes[6].text,

                effectiveTaxRate: [vm.assessorValuationData.ETRPetitioner, vm.valuationPropertyData.ETRPetitioner.toString()],
                effectiveTaxRateEvidence: ETRids,
                effectiveTaxRateNote: vm.attachNotes[7].text,

                freeRent: vm.deductAndCapex.freeRent.toString(),
                freeRentEvidence: Rentids,
                freeRentNote: vm.attachNotes[8].text,

                leasingCommission: vm.deductAndCapex.leasingCommision.toString(),
                leasingCommissionEvidence: leaseids,
                leasingCommissionNote: vm.attachNotes[9].text,

                tenantsImprovements: vm.deductAndCapex.tenantImprovement.toString(),
                tenantsImprovementsEvidence: tenantids,
                tenantsImprovementsNote: vm.attachNotes[10].text,

                lostRent: vm.deductAndCapex.lostRent.toString(),
                lostRentEvidence: lostids,
                lostRentNote: vm.attachNotes[11].text,

                addBackExcessRent: vm.deductAndCapex.exessRent.toString(),
                addBackExcessRentEvidence: AddBackids,
                addBackExcessRentNote: vm.attachNotes[12].text,

                capEx: vm.deductAndCapex.capex.toString(),
                capExEvidence: Capexids,
                capExNote: vm.attachNotes[13].text,

                totalDeductionsAddtions: vm.deductAndCapex.TDA.toString(),
                totalDeductionsAddtionsEvidence: Deductionids,
                totalDeductionsAddtionsNote: vm.attachNotes[14].text,
            }
        };

        // if (vm.isReplace === '1') {
        ////console.log(jsonFormat);
        var url = '/valuation/replace-valuation-form';
        ValuationService.replaceValuationForm(url, jsonFormat)
            .then(function(result) {
                ////console.log("Server Data : valuation/replace-form\n", result);
                var serverData = result.data;
                $("#preloader").css("display", "none");

                if (serverData.success) {
                    getAllValuationForms();
                    vm.hideBeforeSelection = true;
                    vm.createNew = true;
                    resetFormVariables();
                    $("#myUpdateModal").modal('hide');
                    $scope.$emit('success', serverData.message);
                } else {
                    getAllValuationForms();
                    vm.hideBeforeSelection = true;
                    vm.createNew = true;
                    resetFormVariables();
                    $("#myUpdateModal").modal('hide');
                    $scope.$emit('error', serverData.message);
                }
                getAllEvidenceFiles();
            }, function(error) {
                $("#preloader").css("display", "none");
                $("#error_linking").fadeIn(1500).delay(500).fadeOut(500);
                ////console.log(error);
            });
        // }
    }

    //==============================choose valuation year from modal=============================//

    function selectedValuationYearModal() {
        $("#myModal").modal('hide');
        selectedValuationYear();
    }

    function selectedValuationYear() {
        vm.createNew = false;
        vm.forms = false;
        $("#preloader").css("display", "block");

        async.series([
            function(callback) {
                getValuationData(callback);
            },
            function(callback) {
                getConsolidatedData(callback);
            }
        ], function(err, results) {
            $("#preloader").css("display", "none");
        });
    }


    function getValuationData(callback) {
        vm.showYear = false;
        var metaData = {
            propertyId: vm.propertyId,
            year: vm.valuationYear
        };
        // ////console.log(metaData);
        ValuationService.getEvaluationData(metaData)
            .then(function(result) {
                ////console.log('---------------------------Server Data : getValuationData----------------');
                ////console.log(result);
                var serverData = result.data;
                try{
                    if (serverData.success) {

                        vm.hideBeforeSelection = false;
                        vm.showYear = serverData.result.differentData;
                        vm.yearOfData = serverData.result.year;
                        vm.valuationData = result.data;
    
                        var totalSF = vm.valuationData.result.data.totalSF[1];
    
                        vm.valuationPropertyData.SFLPetitioner = totalSF;
                        vm.assessorValuationData.SFLPetitioner = totalSF;
                        vm.modalAssessorValues.SFLPetitioner = totalSF;
                        vm.modalPetitionerValues.SFLPetitioner = totalSF;
    
    
                        // getPetitionerModalsData();
    
                    } else {
    
    
                        vm.hideBeforeSelection = false;
                        vm.valuationPropertyData.SFLPetitioner = 253;
                        vm.assessorValuationData.SFLPetitioner = 253;
                        vm.modalAssessorValues.SFLPetitioner = 253;
                        vm.modalPetitionerValues.SFLPetitioner = 253;
    
                    }
                }
                catch(_e){
                    vm.hideBeforeSelection = false;
                    vm.valuationPropertyData.SFLPetitioner = 253;
                    vm.assessorValuationData.SFLPetitioner = 253;
                    vm.modalAssessorValues.SFLPetitioner = 253;
                    vm.modalPetitionerValues.SFLPetitioner = 253;
                }
                
                callback();

            }, function(error) {
                callback();
                ////console.log('getEvaluationData error', error);
            });
    }

    function getConsolidatedData(callback) {
        vm.mriShow = true;
        vm.yardiShow = true;
        vm.showYear = false;
        vm.valuationYear = localStorage.getItem('valuationYear');
        var metaData = {
            year: parseInt(localStorage.getItem('valuationYear')),
            propId: parseInt(localStorage.getItem('propertyId')),
        };
        ////console.log(metaData);
        ValuationService.getConsolidatedData(metaData)
            .then(function(result) {
                ////console.log('---------------------------Server Data : getConsolidatedData----------------');
                ////console.log(result);

                if (result.data.success) {
                    var serverData = result.data;
                    try{
                        vm.yardiIEData = serverData.result.yardiIEData;
                        vm.yardiIEYear = vm.yardiIEData[vm.yardiIEData.length - 1];
                        vm.mriIEData = serverData.result.mriIEData;
                        vm.mriIEYear = vm.mriIEData[vm.mriIEData.length - 1];
    
                        if (vm.mriIEData.length == 0) {
                            vm.mriShow = false;
                        } else if (vm.yardiIEData.length == 0) {
                            vm.yardiShow = false;
                        }
                    }
                    catch(_e){
                        vm.mriShow = false;
                        vm.yardiShow = false;
                    }
                    
                } else {
                    ////console.log("dalse")
                    vm.mriShow = false;
                    vm.yardiShow = false;
                }
                // ////console.log(vm.yardiIEData);
                // ////console.log(vm.mriIEData);
                callback();
            }, function(error) {
                callback();
                ////console.log('getConsolidatedData error', error);
            });
    }

    //==============================choose valuation year from modal=============================//



    //================================= valuation dropdown modal selection start =====================================//

    function useModalValues() {

        if (vm.useValuesSelection == 1) {
            // parseFloat(expensesSF).toFixed(0);
            vm.assessorValuationData.SFLPetitioner = parseFloat(vm.modalAssessorValues.SFLPetitioner).toFixed(0);
            vm.assessorValuationData.MRPetitioner = parseFloat(vm.modalAssessorValues.MRPetitioner).toFixed(0);
            vm.assessorValuationData.ARPetitioner = parseFloat(vm.modalAssessorValues.ARPetitioner).toFixed(0);
            vm.assessorValuationData.GPRPetitioner = parseFloat(vm.modalAssessorValues.GPRPetitioner).toFixed(0);
            vm.assessorValuationData.VacancyPerPetitioner = parseFloat(vm.modalAssessorValues.VacancyPerPetitioner).toFixed(0);
            vm.assessorValuationData.VacancyDolarPetitioner = parseFloat(vm.modalAssessorValues.VacancyDolarPetitioner).toFixed(0);
            vm.assessorValuationData.ERPetitioner = parseFloat(vm.modalAssessorValues.ERPetitioner).toFixed(0);
            vm.assessorValuationData.expensePerPetitioner = parseFloat(vm.modalAssessorValues.expensePerPetitioner).toFixed(0);
            vm.assessorValuationData.expenseDolarPetitioner = parseFloat(vm.modalAssessorValues.expenseDolarPetitioner).toFixed(0);
            vm.assessorValuationData.expensePerSFPetitioner = parseFloat(vm.modalAssessorValues.expensePerSFPetitioner).toFixed(0);
            vm.assessorValuationData.otherIncomePetitioner = parseFloat(vm.modalAssessorValues.otherIncomePetitioner).toFixed(0);
            vm.assessorValuationData.NOIPetitioner = parseFloat(vm.modalAssessorValues.NOIPetitioner).toFixed(0);
            vm.assessorValuationData.BCRPetitioner = parseFloat(vm.modalAssessorValues.BCRPetitioner).toFixed(0);
            vm.assessorValuationData.ETRPetitioner = parseFloat(vm.modalAssessorValues.ETRPetitioner).toFixed(0);
            vm.assessorValuationData.OCRPetitioner = parseFloat(vm.modalAssessorValues.OCRPetitioner).toFixed(0);
            vm.assessorValuationData.VDCPetitioner = parseFloat(vm.modalAssessorValues.VDCPetitioner).toFixed(0);
            vm.assessorValuationData.VPSFPetitioner = parseFloat(vm.modalAssessorValues.VPSFPetitioner).toFixed(0);

        }

        if (vm.useValuesSelection == 2) {

            vm.valuationPropertyData.SFLPetitioner = parseFloat(vm.modalPetitionerValues.SFLPetitioner).toFixed(0);
            vm.valuationPropertyData.MRPetitioner = parseFloat(vm.modalPetitionerValues.MRPetitioner).toFixed(0);
            vm.valuationPropertyData.ARPetitioner = parseFloat(vm.modalPetitionerValues.ARPetitioner).toFixed(0);
            vm.valuationPropertyData.GPRPetitioner = parseFloat(vm.modalPetitionerValues.GPRPetitioner).toFixed(0);
            vm.valuationPropertyData.VacancyPerPetitioner = parseFloat(vm.modalPetitionerValues.VacancyPerPetitioner).toFixed(0);
            vm.valuationPropertyData.VacancyDolarPetitioner = parseFloat(vm.modalPetitionerValues.VacancyDolarPetitioner).toFixed(0);
            vm.valuationPropertyData.ERPetitioner = parseFloat(vm.modalPetitionerValues.ERPetitioner).toFixed(0);
            vm.valuationPropertyData.expensePerPetitioner = parseFloat(vm.modalPetitionerValues.expensePerPetitioner).toFixed(0);
            vm.valuationPropertyData.expenseDolarPetitioner = parseFloat(vm.modalPetitionerValues.expenseDolarPetitioner).toFixed(0);
            vm.valuationPropertyData.expensePerSFPetitioner = parseFloat(vm.modalPetitionerValues.expensePerSFPetitioner).toFixed(0);
            vm.valuationPropertyData.otherIncomePetitioner = parseFloat(vm.modalPetitionerValues.otherIncomePetitioner).toFixed(0);
            vm.valuationPropertyData.NOIPetitioner = parseFloat(vm.modalPetitionerValues.NOIPetitioner).toFixed(0);
            vm.valuationPropertyData.BCRPetitioner = parseFloat(vm.modalPetitionerValues.BCRPetitioner).toFixed(0);
            vm.valuationPropertyData.ETRPetitioner = parseFloat(vm.modalPetitionerValues.ETRPetitioner).toFixed(0);
            vm.valuationPropertyData.OCRPetitioner = parseFloat(vm.modalPetitionerValues.OCRPetitioner).toFixed(0);
            vm.valuationPropertyData.VDCPetitioner = parseFloat(vm.modalPetitionerValues.VDCPetitioner).toFixed(0);
            vm.valuationPropertyData.VPSFPetitioner = parseFloat(vm.modalPetitionerValues.VPSFPetitioner).toFixed(0);

        }
    }


    function petitionerModalSelected(selectedModal) {
        $scope.showBoxTwo  = true;

        $(this).toggleClass("active");
        vm.modalSelected = false;

        vm.useValuesSelection = 2;
        vm.modalPetitionerValues.SFLPetitioner = selectedModal.petitionerLeasableSF;
        vm.modalPetitionerValues.MRPetitioner = selectedModal.petitionerMarketRentSF;
        vm.modalPetitionerValues.ARPetitioner = selectedModal.petitionerAnnualRent;
        vm.modalPetitionerValues.GPRPetitioner = selectedModal.petitionerGPR;
        vm.modalPetitionerValues.VacancyPerPetitioner = selectedModal.petitionerVacancyPercentage;
        vm.modalPetitionerValues.VacancyDolarPetitioner = selectedModal.petitionerVacancy;
        vm.modalPetitionerValues.ERPetitioner = selectedModal.petitionerEffectiveRent;
        vm.modalPetitionerValues.expensePerPetitioner = selectedModal.petitionerExpensePercentage;
        vm.modalPetitionerValues.expenseDolarPetitioner = selectedModal.petitionerExpense;
        vm.modalPetitionerValues.expensePerSFPetitioner = selectedModal.petitionerExpenseSF;
        vm.modalPetitionerValues.otherIncomePetitioner = selectedModal.petitionerOI;
        vm.modalPetitionerValues.NOIPetitioner = selectedModal.NOI;
        vm.modalPetitionerValues.BCRPetitioner = selectedModal.BCR;
        vm.modalPetitionerValues.ETRPetitioner = selectedModal.petitionerETR;
        vm.modalPetitionerValues.OCRPetitioner = selectedModal.petitionerOCR;
        vm.modalPetitionerValues.VDCPetitioner = selectedModal.petitionerVDC;
        vm.modalPetitionerValues.VPSFPetitioner = selectedModal.assessedValueSF;

    }

    function assessorModalOneSelected(selectedModal) {
        vm.useValuesSelection = 1;
        $scope.showBoxOne = true;
        //$(".box-one").slideToggle(600);
        $(this).toggleClass("active");
        vm.modalSelected = false;


        vm.modalAssessorValues.SFLPetitioner = selectedModal.petitionerLeasableSF;
        vm.modalAssessorValues.MRPetitioner = selectedModal.petitionerMarketRentSF;
        vm.modalAssessorValues.ARPetitioner = selectedModal.petitionerAnnualRent;
        vm.modalAssessorValues.GPRPetitioner = selectedModal.petitionerGPR;
        vm.modalAssessorValues.VacancyPerPetitioner = selectedModal.petitionerVacancyPercentage;
        vm.modalAssessorValues.VacancyDolarPetitioner = selectedModal.petitionerVacancy;
        vm.modalAssessorValues.ERPetitioner = selectedModal.petitionerEffectiveRent;
        vm.modalAssessorValues.expensePerPetitioner = selectedModal.petitionerExpensePercentage;
        vm.modalAssessorValues.expenseDolarPetitioner = selectedModal.petitionerExpense;
        vm.modalAssessorValues.expensePerSFPetitioner = selectedModal.petitionerExpenseSF;
        vm.modalAssessorValues.otherIncomePetitioner = selectedModal.petitionerOI;
        vm.modalAssessorValues.NOIPetitioner = selectedModal.NOI;
        vm.modalAssessorValues.BCRPetitioner = selectedModal.BCR;
        vm.modalAssessorValues.ETRPetitioner = selectedModal.petitionerETR;
        vm.modalAssessorValues.OCRPetitioner = selectedModal.petitionerOCR;
        vm.modalAssessorValues.VDCPetitioner = selectedModal.petitionerVDC;
        vm.modalAssessorValues.VPSFPetitioner = selectedModal.assessedValueSF;


        // only show modal values

        // vm.modalAssessorValues.MRPetitioner = vm.assessorModalOne.marketRentPerSqFt;
        // calculateMRAssessor();

        // vm.modalAssessorValues.VacancyPerPetitioner = vm.assessorModalOne.vancancyPercentage;
        // calculateERandVacAssessor();

        // vm.modalAssessorValues.expensePerPetitioner = vm.assessorModalOne.expensePercentage;
        // calculateExpensesAssessor();

        // //depends on above
        // // vm.valuationPropertyData.expensePerSFPetitioner = vm.petitionerModalOne.expensesPerSF;
        // // calculateExpensesPetitionerSF();
        // vm.modalAssessorValues.otherIncomePetitioner = vm.assessorModalOne.otherIncome;
        // calculateNOIAssessor();

        // vm.modalAssessorValues.BCRPetitioner = vm.assessorModalOne.baseCapRate;
        // vm.modalAssessorValues.ETRPetitioner = vm.assessorModalOne.effectiveTaxRate;

    }

    //================================== valuation dropdown modal selection end =====================================//

    function getEvidencePropertyIds(Linkedproperties) {
        var propIds = [];

        for (var i = 0; i < Linkedproperties.length; i++) {
            var property = Linkedproperties[i];
            propIds.push(property._id);
        }

        ////console.log(propIds);
        return propIds;

    }
    //attach evidences
    $scope.fileUploaded = function() {
        vm.FileNames = [];
        var files = document.getElementById('file-1').files;
        vm.evidenceFiles = files;
        for (var i = 0; i < files.length; i++) {
            vm.FileNames.push({
                name: files[i].name,
                description: '',
                uploadStatus: true
            });
        }
        if (vm.FileNames.length > 0)
            $('#myModalquestion').modal('toggle');
    }

    //save file call. after attached evidences against input field upload files callback
    vm.uploadEvidenceFile = function() {
        ////console.log('uploadEvidenceFiles function');

        if (vm.evidenceFiles) {
            $("#preloader").css("display", "block");
            var url = '/otherFiles/uploadOtherFiles?propId=' + vm.propertyId;
            var desc = '';
            for (var i = 0; i < vm.FileNames.length; i++) {
                if (i + 1 == vm.FileNames.length) {
                    desc += vm.FileNames[i].description;
                } else {
                    desc += vm.FileNames[i].description + ',';
                }
            }
            AOTCService.uploadFilesWithDescription(url, vm.evidenceFiles, desc)
                .then(function(result) {
                    ////console.log(result);
                    var serverData = result.data;
                    if (serverData.success == true) {
                        $("#preloader").css("display", "none");
                        $scope.$emit('success', serverData.message);
                        getAllEvidenceFiles();

                    } else {
                        $("#preloader").css("display", "none");
                        $(".dangerr").fadeIn(1500).delay(500).fadeOut(500);
                    }

                }, function(result) {
                    ////console.log(result);
                    $("#preloader").css("display", "none");
                });
        }
    }



    //####START========================================================= Evidences Modal ==============================================================//

    vm.sortedAndSearchedEvidences = sortedAndSearchedEvidences;
    vm.sortedAndSearchedSelectedEvidences = sortedAndSearchedSelectedEvidences;

    function sortedAndSearchedEvidences() {

        var searchItem = vm.searchWordAllFile.toLowerCase();

        if (searchItem.length > 0) {

            var filtered = [];
            for (var i = 0; i < vm.allEvidenceFiles.length; i++) {
                var object = vm.allEvidenceFiles[i];

                var type = object.properties.type ? object.properties.type[1].toLowerCase() : 'Not Specified';
                var fileName = object.properties.fileName ? object.properties.fileName[1].toLowerCase() : 'Not Specified';
                var createdDate = object.properties.createdDate ? object.properties.createdDate[1].toLowerCase() : 'Not Specified';


                if (type.indexOf(searchItem) > -1 ||
                    fileName.indexOf(searchItem) > -1 ||
                    createdDate.indexOf(searchItem) > -1
                    // object.properties.description.toLowerCase().indexOf(searchItem) > -1
                ) {
                    filtered.push(object);
                }
            }

            return filtered;

        } else {
            // ////console.log('return all evidence\n', vm.allEvidenceFiles);
            return vm.allEvidenceFiles;

        }
    }

    function sortedAndSearchedSelectedEvidences() {

        var searchItem = vm.searchWordSelectedFile.toLowerCase();

        if (searchItem.length > 0) {
            var filtered = [];
            for (var i = 0; i < vm.selectedEvidences.length; i++) {
                var object = vm.selectedEvidences[i];

                var type = object.properties.type ? object.properties.type[1].toLowerCase() : 'Not Specified';
                var fileName = object.properties.fileName ? object.properties.fileName[1].toLowerCase() : 'Not Specified';
                var createdDate = object.properties.createdDate ? object.properties.createdDate[1].toLowerCase() : 'Not Specified';

                if (type.indexOf(searchItem) > -1 ||
                    fileName.indexOf(searchItem) > -1 ||
                    createdDate.indexOf(searchItem) > -1
                    // object.properties.description.toLowerCase().indexOf(searchItem) > -1
                ) {
                    filtered.push(object);
                }
            }
            return filtered;
        } else {
            // ////console.log('----------------------------already selectedEvidences');
            // ////console.log(vm.selectedEvidences);
            return vm.selectedEvidences;
        }
    }



    //upon sort click
    function sortBy(sort) {

        restoreAllEvidence();
        vm.sortKey = sort;
        // ////console.log(vm.sortKey);
        ////console.log(vm.allEvidenceFiles);

        if (sort == 'fileName') {
            vm.allEvidenceFiles = PetitionerFormulae.sortArrayByKey(vm.allEvidenceFiles, vm.sortKey);
        } else {
            vm.allEvidenceFiles = PetitionerFormulae.sortByKey(vm.allEvidenceFiles, vm.sortKey);

        }
        sortedAndSearchedEvidences();

    }

    function sortBySelected(sort) { //in progress
        //send selected index so that I have again list of all selectedEvidences
        addPetitionerEvidence(vm.attachFileSelection);

        // restoreAllEvidence();
        vm.sortKeySelected = sort;

        ////console.log(vm.sortKeySelected);
        ////console.log(vm.attachFileSelection);

        if (sort == 'fileName') {
            vm.selectedEvidences = PetitionerFormulae.sortArrayByKey(vm.selectedEvidences, vm.sortKeySelected);
        } else {
            vm.selectedEvidences = PetitionerFormulae.sortByKey(vm.selectedEvidences, vm.sortKeySelected);
        }

        sortedAndSearchedSelectedEvidences();
    }

    function restoreAllEvidence() {
        var propEvidence = localStorage.getItem('evidenceFilesAtServer');
        vm.allEvidenceFiles = JSON.parse(propEvidence);
        //by default sort By date
        // sortBy('createdDate');

        for (var i = 0; i < vm.allEvidenceFiles.length; i++) {
            var evidFile = vm.allEvidenceFiles[i];
            for (var k = 0; k < vm.selectedEvidences.length; k++) {
                var selectedEvid = vm.selectedEvidences[k];
                if (selectedEvid._id == evidFile._id) {
                    vm.allEvidenceFiles.splice(i, 1);
                    i = i - 1;
                }
            }
        }
    }

    function ToggleLabelInputs() {
        vm.toggleLabelInputs = !vm.toggleLabelInputs;
    }

    // MOVE TO SELECTED LIST//
    vm.addToSelectedFiles = function(evidence) {

        if (vm.attachFileSelection == 1) //MR
        {
            ////console.log(vm.attachFileSelection);
            vm.MREvidences.push(evidence);

        } else if (vm.attachFileSelection == 2) //Vac %
        {
            ////console.log(vm.attachFileSelection);
            vm.VacancyEvidences.push(evidence);

        } else if (vm.attachFileSelection == 3) //Exp %
        {
            ////console.log(vm.attachFileSelection);
            vm.ExpEvidences.push(evidence);

        } else if (vm.attachFileSelection == 4) //Exp per SF %
        {
            ////console.log(vm.attachFileSelection);
            vm.ExpPSFEvidences.push(evidence);

        } else if (vm.attachFileSelection == 5) //OI
        {
            ////console.log(vm.attachFileSelection);
            vm.OIEvidences.push(evidence);

        } else if (vm.attachFileSelection == 6) //BCR
        {
            ////console.log(vm.attachFileSelection);
            vm.BCREvidences.push(evidence);

        } else if (vm.attachFileSelection == 7) //ETR
        {
            ////console.log(vm.attachFileSelection);
            vm.ETREvidences.push(evidence);

        } else if (vm.attachFileSelection == 8) //ETR
        {
            ////console.log(vm.attachFileSelection);
            vm.FreeRentEvidences.push(evidence);

        } else if (vm.attachFileSelection == 9) //ETR
        {
            ////console.log(vm.attachFileSelection);
            vm.LeasingEvidences.push(evidence);

        } else if (vm.attachFileSelection == 10) //ETR
        {
            ////console.log(vm.attachFileSelection);
            vm.TenantImprovementEvidences.push(evidence);

        } else if (vm.attachFileSelection == 11) //ETR
        {
            ////console.log(vm.attachFileSelection);
            vm.LostRentEvidences.push(evidence);

        } else if (vm.attachFileSelection == 12) //ETR
        {
            ////console.log(vm.attachFileSelection);
            vm.AddBackEvidences.push(evidence);

        } else if (vm.attachFileSelection == 13) //ETR
        {
            ////console.log(vm.attachFileSelection);
            vm.CapexEvidences.push(evidence);

        } else if (vm.attachFileSelection == 14) //ETR
        {
            ////console.log(vm.attachFileSelection);
            vm.DeductionEvidences.push(evidence);

        }


        for (var i = 0; i < vm.allEvidenceFiles.length; i++) {
            var allEvidence = vm.allEvidenceFiles[i]
            if (allEvidence._id == evidence._id) {
                vm.allEvidenceFiles.splice(i, 1);
                i = i - 1;
            }

        }

    }

    //MOVE TO ALL EVIDENCE LIST  FROM SELECTED//
    vm.removeFromSelectedFiles = function(evidence) {

        for (var i = 0; i < vm.selectedEvidences.length; i++) {
            var allEvidence = vm.selectedEvidences[i]

            if (allEvidence._id == evidence._id) {
                ////console.log('true')
                vm.selectedEvidences.splice(i, 1);
                vm.allEvidenceFiles.push(evidence);
            }

        }
    }

    //======================= on input click => OPEN MODEL(myModalEvidence) TO SELECT EVIDENCES ================= //
    function addPetitionerEvidence(selection) {

        vm.attachFileSelection = selection;
        vm.selectedEvidences = [];

        if (vm.attachFileSelection == 1) //MR
        {
            ////console.log(vm.attachFileSelection);
            // ////console.log(vm.MREvidences.length);
            vm.selectedEvidences = vm.MREvidences;

        } else if (vm.attachFileSelection == 2) //Vac %
        {
            ////console.log(vm.attachFileSelection);
            vm.selectedEvidences = vm.VacancyEvidences;

        } else if (vm.attachFileSelection == 3) //Exp %
        {
            vm.selectedEvidences = vm.ExpEvidences;
        } else if (vm.attachFileSelection == 4) //Exp per SF %
        {
            vm.selectedEvidences = vm.ExpPSFEvidences;
        } else if (vm.attachFileSelection == 5) //OI
        {
            vm.selectedEvidences = vm.OIEvidences;
        } else if (vm.attachFileSelection == 6) //BCR
        {
            vm.selectedEvidences = vm.BCREvidences;
        } else if (vm.attachFileSelection == 7) //ETR
        {
            vm.selectedEvidences = vm.ETREvidences;
        } else if (vm.attachFileSelection == 8) //MR
        {
            vm.selectedEvidences = vm.FreeRentEvidences;
        } else if (vm.attachFileSelection == 9) //Vac %
        {
            vm.selectedEvidences = vm.LeasingEvidences;
        } else if (vm.attachFileSelection == 10) //Exp %
        {
            vm.selectedEvidences = vm.TenantImprovementEvidences;
        } else if (vm.attachFileSelection == 11) //Exp per SF %
        {
            vm.selectedEvidences = vm.LostRentEvidences;
        } else if (vm.attachFileSelection == 12) //OI
        {
            vm.selectedEvidences = vm.AddBackEvidences;
        } else if (vm.attachFileSelection == 13) //BCR
        {
            vm.selectedEvidences = vm.CapexEvidences;
        } else if (vm.attachFileSelection == 14) //ETR
        {
            vm.selectedEvidences = vm.DeductionEvidences;
        }
        // ////console.log(vm.attachNotes);
        var propEvidence = localStorage.getItem('evidenceFilesAtServer');
        vm.allEvidenceFiles = JSON.parse(propEvidence);
        //by default sort By date



        //delete already things
        for (var i = 0; i < vm.allEvidenceFiles.length; i++) {
            var evidFile = vm.allEvidenceFiles[i];
            for (var k = 0; k < vm.selectedEvidences.length; k++) {
                var selectedEvid = vm.selectedEvidences[k];

                if (selectedEvid._id == evidFile._id) {
                    vm.allEvidenceFiles.splice(i, 1);
                    i = i - 1;
                }
            }
        }


        sortBy('createdDate');
        PetitionerFormulae.sortByKey(vm.selectedEvidences, 'createdDate')

        //show modal #myModalEvidence
        $('#myModalEvidence').modal('show');

    }

    function getEvidencePropertyById(id) {
        var evidenceProp = {};
        // ////console.log('finding id ', id);

        for (var i = 0; i < vm.allEvidenceFiles.length; i++) {
            var property = vm.allEvidenceFiles[i];
            // ////console.log('property id ', property);
            if (property._id == id) {
                evidenceProp = property;
                break;
            }
        }

        return evidenceProp;

    }

    function retirieveSelectedEvidences() {
        var form = JSON.parse(localStorage.getItem('selectedValuationForm'));

        // ////console.log('######################SELECTED FORM###############');
        vm.selectedEvidences = [];
        restoreAllEvidence();

        vm.MREvidences = [];
        vm.ExpPSFEvidences = [];
        vm.OIEvidences = [];
        vm.BCREvidences = [];
        vm.ETREvidences = [];
        vm.FreeRentEvidences = [];
        vm.LeasingEvidences = [];
        vm.TenantImprovementEvidences = [];
        vm.LostRentEvidences = [];
        vm.AddBackEvidences = [];
        vm.CapexEvidences = [];
        vm.DeductionEvidences = [];
        vm.VacancyEvidences = [];
        vm.ExpEvidences = [];

        // ////console.log(form);
        // ////console.log(vm.selectedEvidences);
        // ////console.log(vm.allEvidenceFiles);



        for (var i = 0; i < form.valuationForm.properties.marketRentPerSFEvidence.length; i++) {
            var id = form.valuationForm.properties.marketRentPerSFEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.MREvidences.push(evidence);
            }
        }


        for (var i = 0; i < form.valuationForm.properties.vacancyPercentageEvidence.length; i++) {
            var id = form.valuationForm.properties.vacancyPercentageEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.VacancyEvidences.push(evidence);
            }

        }

        for (var i = 0; i < form.valuationForm.properties.expensePercentageEvidence.length; i++) {
            var id = form.valuationForm.properties.expensePercentageEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.ExpEvidences.push(evidence);
            }

        }

        for (var i = 0; i < form.valuationForm.properties.expensePerSFEvidence.length; i++) {
            var id = form.valuationForm.properties.expensePerSFEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.ExpPSFEvidences.push(evidence);
            }

        }


        for (var i = 0; i < form.valuationForm.properties.otherIncomeEvidence.length; i++) {
            var id = form.valuationForm.properties.otherIncomeEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.OIEvidences.push(evidence);
            }
        }

        for (var i = 0; i < form.valuationForm.properties.baseCapRateEvidence.length; i++) {
            var id = form.valuationForm.properties.baseCapRateEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.BCREvidences.push(evidence);
            }
        }

        for (var i = 0; i < form.valuationForm.properties.effectiveTaxRateEvidence.length; i++) {
            var id = form.valuationForm.properties.effectiveTaxRateEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.ETREvidences.push(evidence);
            }
        }

        for (var i = 0; i < form.valuationForm.properties.freeRentEvidence.length; i++) {
            var id = form.valuationForm.properties.freeRentEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.FreeRentEvidences.push(evidence);
            }
        }

        for (var i = 0; i < form.valuationForm.properties.leasingCommissionEvidence.length; i++) {
            var id = form.valuationForm.properties.leasingCommissionEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.LeasingEvidences.push(evidence);
            }
        }

        for (var i = 0; i < form.valuationForm.properties.tenantsImprovementsEvidence.length; i++) {
            var id = form.valuationForm.properties.tenantsImprovementsEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.TenantImprovementEvidences.push(evidence);
            }
        }

        for (var i = 0; i < form.valuationForm.properties.lostRentEvidence.length; i++) {
            var id = form.valuationForm.properties.lostRentEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.LostRentEvidences.push(evidence);
            }
        }

        for (var i = 0; i < form.valuationForm.properties.addBackExcessRentEvidence.length; i++) {
            var id = form.valuationForm.properties.addBackExcessRentEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.AddBackEvidences.push(evidence);
            }
        }


        for (var i = 0; i < form.valuationForm.properties.capExEvidence.length; i++) {
            var id = form.valuationForm.properties.capExEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.CapexEvidences.push(evidence);
            }
        }

        for (var i = 0; i < form.valuationForm.properties.totalDeductionsAddtionsEvidence.length; i++) {
            var id = form.valuationForm.properties.totalDeductionsAddtionsEvidence[i];
            var evidence = getEvidencePropertyById(id);
            if (evidence) {
                vm.DeductionEvidences.push(evidence);
            }
        }

    }



    //####END========================================================= Evidences Modal ==============================================================//


    vm.viewParticularForm = function(form) {
        // vm.currentForm = forms;
        vm.createNew = false;
        vm.formName = form.name;
        localStorage.setItem('formName', vm.formName);
        // ////console.log(form);
        localStorage.getItem('selectedValuationForm');
        $("#preloader").css("display", "block");

        async.series([
            function(callback) {
                getValuationData(callback);
            },
            function(callback) {
                getConsolidatedData(callback);
            },
            function(callback) {
                useForm(form, callback)
            },
            function(callback) {
                vm.assessorModalData = [];
                ValuationService.getPetitionerModalsData()
                    .then(function(result) {
                        ////console.log('getPetitionerModalsData Server Data');
                        ////console.log(result);
                        vm.assessorModalData = result.data.result[0].models;
                        callback();
                    }, function(err) {
                        ////console.log(err);

                    });
            }

        ], function(err, results) {
            $("#preloader").css("display", "none");
        });
    }

    function useForm(form, callback) {

        localStorage.setItem('formId', form.valuationForm._id);
        localStorage.setItem('selectedValuationForm', angular.toJson(form));
        retirieveSelectedEvidences();
        vm.createNew = false;
        vm.formId = form.valuationForm._id;
        var data = form.valuationForm.properties;

        vm.valuationPropertyData.SFLPetitioner = 253;


        vm.valuationPropertyData.MRPetitioner = data.marketRentPerSF[1];
        vm.valuationPropertyData.ARPetitioner = PetitionerFormulae.Petitioner.annualRent(
            vm.valuationPropertyData.SFLPetitioner,
            vm.valuationPropertyData.MRPetitioner);
        vm.valuationPropertyData.GPRPetitioner = vm.valuationPropertyData.ARPetitioner;
        vm.valuationPropertyData.VacancyPerPetitioner = data.vacancyPercentage[1];
        vm.valuationPropertyData.VacancyDolarPetitioner = PetitionerFormulae.Petitioner.vacancy(
            vm.valuationPropertyData.GPRPetitioner,
            (vm.valuationPropertyData.VacancyPerPetitioner / 100));
        vm.valuationPropertyData.ERPetitioner = PetitionerFormulae.Petitioner.effectiveRent(
            vm.valuationPropertyData.ARPetitioner,
            (vm.valuationPropertyData.VacancyDolarPetitioner / 100));
        vm.valuationPropertyData.expensePerPetitioner = data.expensePercentage[1];
        vm.valuationPropertyData.expenseDolarPetitioner = PetitionerFormulae.Petitioner.expenses(
            vm.valuationPropertyData.ERPetitioner,
            (vm.valuationPropertyData.expensePerPetitioner / 100));
        vm.valuationPropertyData.expensePerSFPetitioner = data.expensePerSF[1];
        vm.valuationPropertyData.otherIncomePetitioner = data.otherIncome[1];
        vm.valuationPropertyData.NOIPetitioner = PetitionerFormulae.Petitioner.netOperatingIncome(
            vm.valuationPropertyData.ERPetitioner,
            vm.valuationPropertyData.expenseDolarPetitioner);
        vm.valuationPropertyData.BCRPetitioner = data.baseCapRate[1];
        vm.valuationPropertyData.ETRPetitioner = data.effectiveTaxRate[1];
        vm.valuationPropertyData.OCRPetitioner = PetitionerFormulae.Petitioner.overAllCapRate(
            parseInt(vm.valuationPropertyData.BCRPetitioner),
            parseInt(vm.valuationPropertyData.ETRPetitioner));
        vm.valuationPropertyData.VDCPetitioner = PetitionerFormulae.Petitioner.valueDirectCap(
            vm.valuationPropertyData.OCRPetitioner,
            vm.valuationPropertyData.NOIPetitioner);
        vm.valuationPropertyData.VPSFPetitioner = PetitionerFormulae.Petitioner.valuePerSqFt(
            vm.valuationPropertyData.VDCPetitioner,
            vm.valuationPropertyData.SFLPetitioner);


        vm.assessorValuationData.MRPetitioner = data.marketRentPerSF[0];
        vm.assessorValuationData.ARPetitioner = PetitionerFormulae.Petitioner.annualRent(
            vm.assessorValuationData.SFLPetitioner,
            vm.assessorValuationData.MRPetitioner);
        vm.assessorValuationData.GPRPetitioner = vm.assessorValuationData.ARPetitioner;
        vm.assessorValuationData.VacancyPerPetitioner = data.vacancyPercentage[0];
        vm.assessorValuationData.VacancyDolarPetitioner = PetitionerFormulae.Petitioner.vacancy(
            vm.assessorValuationData.GPRPetitioner,
            (vm.assessorValuationData.VacancyPerPetitioner / 100));
        vm.assessorValuationData.ERPetitioner = PetitionerFormulae.Petitioner.effectiveRent(
            vm.assessorValuationData.ARPetitioner,
            (vm.assessorValuationData.VacancyDolarPetitioner / 100));
        vm.assessorValuationData.expensePerPetitioner = data.expensePercentage[0];
        vm.assessorValuationData.expenseDolarPetitioner = PetitionerFormulae.Petitioner.expenses(
            vm.assessorValuationData.ERPetitioner,
            (vm.assessorValuationData.expensePerPetitioner / 100));
        vm.assessorValuationData.expensePerSFPetitioner = data.expensePerSF[0];
        vm.assessorValuationData.otherIncomePetitioner = data.otherIncome[0];
        vm.assessorValuationData.NOIPetitioner = PetitionerFormulae.Petitioner.netOperatingIncome(
            vm.assessorValuationData.ERPetitioner,
            vm.assessorValuationData.expenseDolarPetitioner);
        vm.assessorValuationData.BCRPetitioner = data.baseCapRate[0];
        vm.assessorValuationData.ETRPetitioner = data.effectiveTaxRate[0];
        vm.assessorValuationData.OCRPetitioner = PetitionerFormulae.Petitioner.overAllCapRate(
            parseInt(vm.assessorValuationData.BCRPetitioner),
            parseInt(vm.assessorValuationData.ETRPetitioner));
        vm.assessorValuationData.VDCPetitioner = PetitionerFormulae.Petitioner.valueDirectCap(
            vm.assessorValuationData.OCRPetitioner,
            vm.assessorValuationData.NOIPetitioner);
        vm.assessorValuationData.VPSFPetitioner = PetitionerFormulae.Petitioner.valuePerSqFt(
            vm.assessorValuationData.VDCPetitioner,
            vm.assessorValuationData.SFLPetitioner);

        vm.deductAndCapex.freeRent = data.freeRent;
        vm.deductAndCapex.leasingCommision = data.leasingCommission;
        vm.deductAndCapex.tenantImprovement = data.tenantsImprovements;
        vm.deductAndCapex.lostRent = data.lostRent;
        vm.deductAndCapex.exessRent = data.addBackExcessRent;
        vm.deductAndCapex.capex = data.capEx;
        vm.deductAndCapex.TDA = data.totalDeductionsAddtions;
        vm.deductAndCapex.VDC = PetitionerFormulae.Petitioner.vdcPostDeduction(
            vm.valuationPropertyData.VDCPetitioner,
            vm.deductAndCapex.TDA);
        vm.deductAndCapex.VDL = PetitionerFormulae.Petitioner.vdcPostDeductionPerSF(
            vm.deductAndCapex.VDC,
            vm.valuationPropertyData.SFLPetitioner);

        vm.valuationPropertyData.OCRPetitioner = vm.valuationPropertyData.OCRPetitioner ? vm.valuationPropertyData.OCRPetitioner : 0;
        vm.valuationPropertyData.VDCPetitioner = vm.valuationPropertyData.VDCPetitioner ? vm.valuationPropertyData.VDCPetitioner : 0;
        vm.valuationPropertyData.VPSFPetitioner = vm.valuationPropertyData.VPSFPetitioner ? vm.valuationPropertyData.VPSFPetitioner : 0;

        vm.assessorValuationData.OCRPetitioner = vm.assessorValuationData.OCRPetitioner ? vm.assessorValuationData.OCRPetitioner : 0;
        vm.assessorValuationData.VDCPetitioner = vm.assessorValuationData.VDCPetitioner ? vm.assessorValuationData.VDCPetitioner : 0;
        vm.assessorValuationData.VPSFPetitioner = vm.assessorValuationData.VPSFPetitioner ? vm.assessorValuationData.VPSFPetitioner : 0;



        callback();
    }

    vm.replace = function(val) {

        if (val === 1) {
            vm.isReplace = true;
        } else {;
            vm.isReplace = false;
        }
    }

    vm.save = function() {
        ////console.log("working");
        vm.alreadyExists = false;
        vm.isReplace = false;
    }

    vm.cancel = cancel;

    function cancel() {
        vm.alreadyExists = false;
        vm.isReplace = false;
        resetFormVariables();
        vm.hideBeforeSelection = true;
        vm.createNew = true;
    }


    vm.redirectToWorkspace = function(form) {
        // ////console.log(form);
        localStorage.setItem('formId', form.valuationForm._id);
        localStorage.setItem('formName', form.name);
        localStorage.setItem('selectedValuationForm', angular.toJson(form));

        $state.go('ScenarioOne');
    }




    //====================================================================================================================================//


    function calculateMRPetitioner() {
        // ////console.log(vm.modalPetitionerValues.MRPetitioner);
        // vm.valuationPropertyData.SFLPetitioner;
        var annualRent = PetitionerFormulae.Petitioner.annualRent(
            vm.modalPetitionerValues.SFLPetitioner,
            vm.modalPetitionerValues.MRPetitioner);


        vm.modalPetitionerValues.ARPetitioner = annualRent;
        vm.modalPetitionerValues.GPRPetitioner = annualRent;


    }


    function calculateMRInput(valuationObject) {

        // ////console.log(valuationObject.MRPetitioner);
        // vm.valuationPropertyData.SFLPetitioner;
        var annualRent = PetitionerFormulae.Petitioner.annualRent(
            valuationObject.SFLPetitioner,
            valuationObject.MRPetitioner);


        valuationObject.ARPetitioner = annualRent;
        valuationObject.GPRPetitioner = annualRent;

    }

    function calculateERandVacInput(valuationObject) {
        // ////console.log(valuationObject.VacancyPerPetitioner);
        var percentage = valuationObject.VacancyPerPetitioner / 100;

        // vm.valuationPropertyData.SFLPetitioner;
        var vacancyDolar = PetitionerFormulae.Petitioner.vacancy(
            valuationObject.GPRPetitioner,
            percentage);


        var ER = PetitionerFormulae.Petitioner.effectiveRent(
            valuationObject.ARPetitioner,
            percentage);


        valuationObject.VacancyDolarPetitioner = vacancyDolar;
        valuationObject.ERPetitioner = ER;

    }

    function calculateExpensesInput(valuationObject) {
        // ////console.log('toggle');

        // ////console.log(valuationObject.expensePerPetitioner);
        // ////console.log(valuationObject.ERPetitioner);

        if (valuationObject.expensePerPetitioner) {
            //disable SF field
            vm.disableExpenseFieldsPer = false;
            vm.disableExpenseFieldsSF = true;

            var percentage = valuationObject.expensePerPetitioner / 100;

            // vm.valuationPropertyData.SFLPetitioner;
            var expenses = PetitionerFormulae.Petitioner.expenses(
                valuationObject.ERPetitioner,
                percentage);

            //Hamzah
            var expensesSF = PetitionerFormulae.Petitioner.expensesPerSf(
                expenses,
                valuationObject.SFLPetitioner);

            // ////console.log(expenses);
            // ////console.log(expensesSF);


            valuationObject.expenseDolarPetitioner = expenses;
            valuationObject.expensePerSFPetitioner = parseFloat(expensesSF).toFixed(0);
            // vm.valuationPropertyData.expensePerSFPetitioner = 34;
        } else {
            // ////console.log('enable all');
            vm.disableExpenseFieldsPer = false;
            vm.disableExpenseFieldsSF = false;
        }

    }

    function calculateExpensesSFInput(valuationObject) {

        if (valuationObject.expensePerSFPetitioner) {
            //disable SF field
            vm.disableExpenseFieldsPer = true;
            vm.disableExpenseFieldsSF = false;
            // vm.valuationPropertyData.SFLPetitioner;
            var expensesDolar = PetitionerFormulae.Petitioner.expensesDolar(
                valuationObject.SFLPetitioner, valuationObject.expensePerSFPetitioner);
            var expensesPerc = PetitionerFormulae.Petitioner.expensesPercentage(
                expensesDolar,
                valuationObject.ERPetitioner);


            valuationObject.expensePerPetitioner = expensesPerc;
            valuationObject.expenseDolarPetitioner = expensesDolar;

        } else {

            vm.disableExpenseFieldsPer = false;
            vm.disableExpenseFieldsSF = false;
        }

    }

    function calculateNOIInput(valuationObject) {

        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(
            valuationObject.ERPetitioner,
            valuationObject.expenseDolarPetitioner);

        valuationObject.NOIPetitioner = NOI;

    }

    function calculateBCRInput(valuationObject) {
        // ////console.log(vm.valuationPropertyData.ETRPetitioner);
        // ////console.log(vm.valuationPropertyData.ETRPetitioner.toString().length);
        if (valuationObject.ETRPetitioner.toString().length > 0) {

            // ////console.log(vm.valuationPropertyData.BCRPetitioner);
            // ////console.log(vm.valuationPropertyData.ETRPetitioner);

            var OCR = PetitionerFormulae.Petitioner.overAllCapRate(
                parseInt(valuationObject.BCRPetitioner),
                parseInt(valuationObject.ETRPetitioner));

            var VDC = PetitionerFormulae.Petitioner.valueDirectCap(
                OCR,
                valuationObject.NOIPetitioner);

            var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(
                VDC,
                valuationObject.SFLPetitioner);

            valuationObject.OCRPetitioner = OCR;
            valuationObject.VDCPetitioner = VDC;
            valuationObject.VPSFPetitioner = ValueSQFT;
        }

    }


    function calculateERandVacPetitioner() {
        var percentage = vm.modalPetitionerValues.VacancyPerPetitioner / 100;

        // vm.valuationPropertyData.SFLPetitioner;
        var vacancyDolar = PetitionerFormulae.Petitioner.vacancy(
            vm.modalPetitionerValues.GPRPetitioner,
            percentage);


        var ER = PetitionerFormulae.Petitioner.effectiveRent(
            vm.modalPetitionerValues.ARPetitioner,
            percentage);


        vm.modalPetitionerValues.VacancyDolarPetitioner = vacancyDolar;
        vm.modalPetitionerValues.ERPetitioner = ER;

    }


    function calculateExpensesPetitioner() {

        if (vm.modalPetitionerValues.expensePerPetitioner.toString().length > 0) {
            //disable SF field
            vm.disableExpenseFieldsPer = false;
            vm.disableExpenseFieldsSF = true;

            var percentage = vm.modalPetitionerValues.expensePerPetitioner / 100;

            var expenses = PetitionerFormulae.Petitioner.expenses(
                vm.modalPetitionerValues.ERPetitioner,
                percentage);

            var expensesSF = PetitionerFormulae.Petitioner.expensesPerSf(
                expenses,
                vm.modalPetitionerValues.SFLPetitioner);

            vm.modalPetitionerValues.expenseDolarPetitioner = expenses;
            vm.modalPetitionerValues.expensePerSFPetitioner = parseFloat(expensesSF).toFixed(0);
            // vm.valuationPropertyData.expensePerSFPetitioner = 34;
        } else {
            vm.disableExpenseFieldsPer = false;
            vm.disableExpenseFieldsSF = false;
        }

    }

    function calculateExpensesPetitionerSF() {

        if (vm.modalPetitionerValues.expensePerSFPetitioner.length > 0) {

            vm.disableExpenseFieldsPer = true;
            vm.disableExpenseFieldsSF = false;

            var expensesDolar = PetitionerFormulae.Petitioner.expensesDolar(
                vm.modalPetitionerValues.SFLPetitioner, vm.modalPetitionerValues.expensePerSFPetitioner);

            var expensesPerc = PetitionerFormulae.Petitioner.expensesPercentage(
                expensesDolar,
                vm.modalPetitionerValues.ERPetitioner);

            vm.modalPetitionerValues.expensePerPetitioner = expensesPerc;
            vm.modalPetitionerValues.expenseDolarPetitioner = expensesDolar;

        } else {
            vm.disableExpenseFieldsPer = false;
            vm.disableExpenseFieldsSF = false;
        }
    }

    function calculateNOIPetitioner() {

        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(
            vm.modalPetitionerValues.ERPetitioner,
            vm.modalPetitionerValues.expenseDolarPetitioner);

        vm.modalPetitionerValues.NOIPetitioner = NOI;
    }

    function calculateBCRPetitioner() {
        if (vm.modalPetitionerValues.ETRPetitioner.toString().length > 0) {
            var OCR = PetitionerFormulae.Petitioner.overAllCapRate(
                parseInt(vm.modalPetitionerValues.BCRPetitioner),
                parseInt(vm.modalPetitionerValues.ETRPetitioner));

            var VDC = PetitionerFormulae.Petitioner.valueDirectCap(
                OCR,
                vm.modalPetitionerValues.NOIPetitioner);

            var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(
                VDC,
                vm.modalPetitionerValues.SFLPetitioner);

            vm.modalPetitionerValues.OCRPetitioner = OCR;
            vm.modalPetitionerValues.VDCPetitioner = VDC;
            vm.modalPetitionerValues.VPSFPetitioner = ValueSQFT;
        }
    }

    function calculateMRAssessor() {

        var annualRent = PetitionerFormulae.Petitioner.annualRent(
            vm.modalAssessorValues.SFLPetitioner,
            vm.modalAssessorValues.MRPetitioner);

        vm.modalAssessorValues.ARPetitioner = annualRent;
        vm.modalAssessorValues.GPRPetitioner = annualRent;
    }

    function calculateERandVacAssessor() {
        var percentage = vm.modalAssessorValues.VacancyPerPetitioner / 100;
        // vm.valuationPropertyData.SFLPetitioner;
        var vacancyDolar = PetitionerFormulae.Petitioner.vacancy(
            vm.modalAssessorValues.GPRPetitioner,
            percentage);
        var ER = PetitionerFormulae.Petitioner.effectiveRent(
            vm.modalAssessorValues.ARPetitioner,
            percentage);
        vm.modalAssessorValues.VacancyDolarPetitioner = vacancyDolar;
        vm.modalAssessorValues.ERPetitioner = ER;
    }

    function calculateExpensesAssessor() {

        if (vm.modalAssessorValues.expensePerPetitioner.toString().length > 0) {
            vm.disableExpenseFieldsPer = false;
            vm.disableExpenseFieldsSF = true;
            var percentage = vm.modalAssessorValues.expensePerPetitioner / 100;
            // vm.valuationPropertyData.SFLPetitioner;
            var expenses = PetitionerFormulae.Petitioner.expenses(
                vm.modalAssessorValues.ERPetitioner,
                percentage);

            var expensesSF = PetitionerFormulae.Petitioner.expensesPerSf(
                expenses,
                vm.modalAssessorValues.SFLPetitioner);

            vm.modalAssessorValues.expenseDolarPetitioner = expenses;
            vm.modalAssessorValues.expensePerSFPetitioner = parseFloat(expensesSF).toFixed(0);
        } else {
            vm.disableExpenseFieldsPer = false;
            vm.disableExpenseFieldsSF = false;
        }
    }

    function calculateExpensesAssessorSF() {

        if (vm.assessorValuationData.expensePerSFPetitioner.length > 0) {
            vm.disableExpenseFieldsPer = true;
            vm.disableExpenseFieldsSF = false;

            var expensesDolar = PetitionerFormulae.Petitioner.expensesDolar(
                vm.assessorValuationData.SFLPetitioner, vm.assessorValuationData.expensePerSFPetitioner);

            var expensesPerc = PetitionerFormulae.Petitioner.expensesPercentage(
                expensesDolar,
                vm.assessorValuationData.ERPetitioner);
            vm.assessorValuationData.expensePerPetitioner = expensesPerc;
            vm.assessorValuationData.expenseDolarPetitioner = expensesDolar;

        } else {
            vm.disableExpenseFieldsPer = false;
            vm.disableExpenseFieldsSF = false;
        }
    }

    function calculateNOIAssessor() {
        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(
            vm.modalAssessorValues.ERPetitioner,
            vm.modalAssessorValues.expenseDolarPetitioner);

        vm.modalAssessorValues.NOIPetitioner = NOI;
    }

    function calculateBCRAssessor() {
        if (vm.modalAssessorValues.ETRPetitioner.toString().length > 0) {

            var OCR = PetitionerFormulae.Petitioner.overAllCapRate(
                parseInt(vm.modalAssessorValues.BCRPetitioner),
                parseInt(vm.modalAssessorValues.ETRPetitioner));

            var VDC = PetitionerFormulae.Petitioner.valueDirectCap(
                OCR,
                vm.modalAssessorValues.NOIPetitioner);

            var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(
                VDC,
                vm.modalAssessorValues.SFLPetitioner);
            vm.modalAssessorValues.OCRPetitioner = OCR;
            vm.modalAssessorValues.VDCPetitioner = VDC;
            vm.modalAssessorValues.VPSFPetitioner = ValueSQFT;
        }

    }

    function calculateDeductAndCapex() {
        var vdcPostDeduction = PetitionerFormulae.Petitioner.vdcPostDeduction(
            vm.valuationPropertyData.VDCPetitioner,
            vm.deductAndCapex.TDA);


        var vdcPostDeductionSF = PetitionerFormulae.Petitioner.vdcPostDeductionPerSF(
            vdcPostDeduction,
            vm.valuationPropertyData.SFLPetitioner);


        vm.deductAndCapex.VDC = vdcPostDeduction;
        vm.deductAndCapex.VDL = vdcPostDeductionSF;

    }


    //=================================== Modals and Use values button hide show start ==========================//
    var boxOneActive = false;
    var boxTwoActive = false;

    $(document).mouseup(function(e) {
        boxOneActive = false;
        var popup = $(".box-one");
         
        if (!$('.box-one').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
            $scope.showBoxOne = false;
        } else {
            boxOneActive = true;
        }
    });

    $(document).mouseup(function(e) {
        boxTwoActive = false;
        var popup = $(".box-two");
        if (!$('.box-two').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
            $scope.showBoxTwo = false;
        } else {
            boxTwoActive = true;
        }

        if (!boxOneActive && !boxTwoActive) {
            vm.modalSelected = true;
        }

        $scope.$apply();

    });


    $(document).on('click', '.dropdown-menu', function(e) {
        if ($(this).hasClass('keep-open-on-click')) {
            e.stopPropagation();
        }
    });





    vm.numberFormatter = function(val, roundedVal) {
        var result = UtilService.numberFormatterValuation(val, roundedVal);
        return result
    };


    //===================formats of petitioner and assessor start ===========================//

    $("#for-1").click(function() {
        $(" .format1 ").show("slow");

        $(" .format2 ").hide("slow");
        $(" .format3").hide("slow");
    });

    $("#for-2").click(function() {
        $(" .format2 ").show("slow");

        $(" .format1 ").hide("slow");
        $(" .format3 ").hide("slow");
    });

    $("#for-3").click(function() {
        $(" .format3 ").show("slow");

        $(" .format2 ").hide("slow");
        $(" .format1 ").hide("slow");
    });


    $(".btn-formats").click(function(e) {
        $(this).addClass("btn-formats-active").siblings().removeClass("btn-formats-active");
    });

    //============================END========================//


    $(".toggle-btn").click(function(e) {
        $(this).addClass("toggle-btn-active").siblings().removeClass("toggle-btn-active");
    });



    $scope.$on("$destroy", function handler() {
        $('#myModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

    });



    vm.showHideYear = function() {
        $timeout(function() {
            vm.yearChecked = !vm.yearChecked;
        }, 100);

        // $('#tableone td:nth-child(3)').toggle();
        // $('#tableone th:nth-child(3)').toggle();
    }

    vm.showHideAOTC = function() {
        // ////console.log('showHideClick');
        $timeout(function() {
            vm.recomendationChecked = !vm.recomendationChecked;
        }, 100);

        // $('#tableone td:nth-child(5)').toggle();
        // $('#tableone th:nth-child(5)').toggle();
    }

    vm.exportToPDF = function(){
        $("#preloader").css("display", "block");
            var pdf = new jsPDF('p', 'pt', 'a1');
            // source can be HTML-formatted string, or a reference
            // to an actual DOM element from which the text will be scraped.
            var source = $('#exportdiv')[0];
          
            // we support special element handlers. Register them with jQuery-style 
            // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
            // There is no support for any other type of selectors 
            // (class, of compound) at this time.
             var specialElementHandlers = {
              // element with id of "bypass" - jQuery style selector
              '#bypassme': function(element, renderer) {
                // true = "handled elsewhere, bypass text extraction"
                return true
              }
            };
            var margins = {
              top: 20,
              bottom: 20,
              left: 20,
              width: 2000
            };
            // all coords and widths are in jsPDF instance's declared units
            // 'inches' in this case
            pdf.fromHTML(
              source, // HTML string or DOM elem ref.
              margins.left, // x coord
              margins.top, { // y coord
                'width': margins.width, // max width of content on PDF
                'elementHandlers': specialElementHandlers
              },
          
              function(dispose) {
                // dispose: object with X, Y of the last line add to the PDF 
                //          this allow the insertion of new lines after html
                var dateObj = new Date();
                    var timeString = dateObj.getHours() + '' + dateObj.getMinutes() + '';
                
                    var year = dateObj.getFullYear();
                    var month = dateObj.getMonth() + 1; // Jan is 0, dec is 11
                    var day = dateObj.getDate();
                    var dateString = 'Valuation-' + year + '-' + month + '-' + day+ '-'+timeString;

                var _file  = pdf.output('blob');

                var url = '/valuation/createAppealPackage?propId='+
                parseInt(localStorage.getItem('propertyId'))+
                '&year='+ vm.valuationYear+
                '&formId='+localStorage.getItem('formId');
                
                //var defer = $q.defer();
                AOTCService.uploadFiles(url, [_file]).
                then(function (response) {
                    // defer.resolve(result);
                    //downloadPDF(response);
                    getPDFfromServer(response);
                    $("#preloader").css("display", "none");
                }, function (err) {
                    $("#preloader").css("display", "none");
                    
                    //  defer.reject(err);
                });
                
                //return defer.promise;
               
              }, margins);
    
          
    };

    function getPDFfromServer(_res){
        try{
            // var url = '/users/downloadAppealPackage?path='+_res.result;
            var downloadLink      = document.createElement('a');
            downloadLink.target   = '_blank';
            var _prefix = location.protocol + '//' + location.host;        
            // create an object URL from the Blob
            var URL = window.URL || window.webkitURL;
            var downloadUrl = _prefix+'/users/downloadAppealPackage?path='+_res.data.result;
          
            // set object URL as the anchor's href
            downloadLink.href = downloadUrl;
          
            // append the anchor to document body
            document.body.appendChild(downloadLink);
          
            // fire a click event on the anchor
            downloadLink.click();
          
            // cleanup: remove element and revoke object URL
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadUrl);
        }
        catch(_e){}

    };

}
function _inputFocusFunction() {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            // Parse the attribute to accomodate assignment to an object
            var parseObj = attr.inputFocusFunction.split('.');
            var attachTo = scope;
            for (var i = 0; i < parseObj.length - 1; i++) {
                attachTo = attachTo[parseObj[i]];
            }
            // assign it to a function that focuses on the decorated element
            attachTo[parseObj[parseObj.length - 1]] = function() {
                element[0].focus();
            };
        }
    };
}