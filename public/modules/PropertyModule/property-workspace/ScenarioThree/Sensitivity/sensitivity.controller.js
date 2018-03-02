'use strict';

_SensitivityThree.$inject = ["PetitionerFormulae", "$state", "$timeout", "$scope", "SensitivityService", "ScenarioDataService"];
module.exports = _SensitivityThree;

//angular.module('AOTC')
//    .controller('SensitivityThree', _SensitivityThree
//    );
function _SensitivityThree(PetitionerFormulae, $state, $timeout, $scope, SensitivityService, ScenarioDataService) {
    ////console.log("SensitivityThree controllersss");
    var vm = this;
    vm.formId = parseInt(localStorage.getItem('formId'));

    $scope.col = 3;
    vm.sensitivityNamesCount = 4;
    vm.scenarioNamesCount = 1;
    vm.submitClicked = false;
    vm.scenarioTwoActive = false;

    vm.property = JSON.parse(localStorage.getItem('propertyDetails'));

    vm.showSensitivityTab = true;
    vm.showScenarioTab = false;
    // vm.showScenario = showScenario;
    // vm.showSensitivity = showSensitivity;
    vm.sensitivityErrorCount = sensitivityErrorCount;

    setTimeout(function () {

        $('#paragraphs').cascadingDivs();
        $('[data-tooltip="tooltip"]').tooltip();

    }, 10);


    var scenarioDataService = ScenarioDataService.GetValues();
    ////console.log(scenarioDataService);
    if (scenarioDataService.scenarioToShow == 'three')
        regenerateValue(scenarioDataService);

    function regenerateValue(scenarioDataService) {

        $timeout(function () {

            vm.marketRentSets = scenarioDataService.marketRentSets
            vm.vacancySets = scenarioDataService.vacancySets;
            vm.expenseSets = scenarioDataService.expenseSets;
            vm.BCRSets = scenarioDataService.BCRSets;
            vm.scenarioSets = scenarioDataService.scenarioSets;

            marketRentSetsCount = scenarioDataService.marketRentSetsCount;
            vacancySetsCount = scenarioDataService.vacancySetsCount;
            expenseSetsCount = scenarioDataService.expenseSetsCount;
            BCRSetsCount = scenarioDataService.BCRSetsCount;
            scenarioSetsCount = scenarioDataService.scenarioSetsCount;


        }, 10);
    }

    $scope.gotoScenario = function (scenarioToShow) {
        ScenarioDataService.SetValues(
            vm.marketRentSets,
            vm.vacancySets,
            vm.expenseSets,
            vm.BCRSets,
            vm.scenarioSets,
            scenarioToShow,
            marketRentSetsCount,
            vacancySetsCount,
            expenseSetsCount,
            BCRSetsCount,
            scenarioSetsCount
        );

        // ScenarioOne
        $state.go('ScenarioOne');

    }

    $scope.showScenarioOne = function () {
        ////console.log('showScenarioOne')
        $scope.col = 3;
        vm.scenarioTwoActive = false;

    }
    $scope.showScenarioTwo = function () {
        ////console.log('showScenarioTwo')
        $scope.col = 2;
        vm.scenarioTwoActive = true;

    }


    // function showSensitivity() {
    //     vm.showSensitivityTab = true;
    //     vm.showScenarioTab = false;
    //     sensitivityErrorCount();
    // }

    // function showScenario() {
    //     vm.showSensitivityTab = false;
    //     vm.showScenarioTab = true;
    //     sensitivityErrorCount();
    // }


    function sensitivityErrorCount() {
        vm.sensitivityNamesCount = 0;

        for (var i = 0; i < vm.marketRentSets.length; i++) {
            if (!vm.marketRentSets[i].name) {
                vm.sensitivityNamesCount++;
            }
        }
        for (var i = 0; i < vm.vacancySets.length; i++) {
            if (!vm.vacancySets[i].name) {
                vm.sensitivityNamesCount++;
            }
        }
        for (var i = 0; i < vm.expenseSets.length; i++) {
            if (!vm.expenseSets[i].name) {
                vm.sensitivityNamesCount++;
            }
        }
        for (var i = 0; i < vm.BCRSets.length; i++) {
            if (!vm.BCRSets[i].name) {
                vm.sensitivityNamesCount++;
            }
        }

        vm.scenarioNamesCount = 0;
        for (var i = 0; i < vm.scenarioSets.length; i++) {
            if (!vm.scenarioSets[i].name) {
                vm.scenarioNamesCount++;
            }
        }
    }

    var leaseableSqFt = 255;
    var vacancyPercentage = 245;
    var expensePercentage = 123;
    var expenseSF = 123;
    var otherIncome = 649;
    var BCR = 157;
    var ETR = 649;
    var assessedValue = 561;
    var assessedValueSF = 502;
    var marketRentSF = 345; //vacancy %  &  expense % calculation


    //===================================   save scenario ===================================//
    vm.saveScenario = saveScenario;

    function saveScenario() {
        sensitivityErrorCount();
        vm.submitClicked = true;

        if (vm.sensitivityNamesCount != 0 || vm.scenarioNamesCount != 0) {
            $scope.$emit('error', 'Write workSpace(s) name');
            return;
        }

        var names = [];

        for (var i = 0; i < vm.marketRentSets.length; i++) {
            names.push(vm.marketRentSets[i].name);
        }
        for (var i = 0; i < vm.vacancySets.length; i++) {
            names.push(vm.vacancySets[i].name);
        }
        for (var i = 0; i < vm.expenseSets.length; i++) {
            names.push(vm.expenseSets[i].name);
        }
        for (var i = 0; i < vm.BCRSets.length; i++) {
            names.push(vm.BCRSets[i].name);
        }
        for (var i = 0; i < vm.scenarioSets.length; i++) {
            names.push(vm.scenarioSets[i].name);
        }

        var saveFormJson = {
            formId: vm.formId,
            name: names,
            sensitivityCaluations: [{
                marketPerSF: vm.marketRentSets,
                vacancyPercent: vm.vacancySets,
                expensePerSF: vm.expenseSets,
                BaseCapRate: vm.BCRSets
            }],
            scenarios: vm.scenarioSets
        };

        $("#preloader").css("display", "block");

        SensitivityService.saveWorkSpace(saveFormJson)
            .then(function (result) {
                $("#preloader").css("display", "none");
                ////console.log('result', result);
                if (result.data.success) {
                    $scope.$emit('success', result.data.message);
                    if (redirect) {
                        $state.go(redirect);
                    }
                } else {
                    $scope.$emit('danger', result.data.message);

                }
                // checkResult(result);


            }, function (err) {
                $("#preloader").css("display", "none");
                ////console.log('err');
            });

    }

    //===================================   addScenarioSet ===================================//
    var scenarioSetsCount = 0;
    vm.addScenarioSet = addScenarioSet;
    vm.addScenarioSetWithValues = addScenarioSetWithValues;
    vm.removeScenarioSet = removeScenarioSet;
    vm.calculateScenarioSet = calculateScenarioSet;
    vm.useSetInScenario = useSetInScenario;


    vm.scenarioSets = [];
    scenarioSetsCount++;
    vm.scenarioSets.push(getNewSet(scenarioSetsCount));

    function addScenarioSet() {
        if (vm.scenarioSets.length < 10) {
            scenarioSetsCount++;
            vm.scenarioSets.push(getNewSet(scenarioSetsCount));
        } else {
            $scope.$emit('error', 'Can not add more sets');
        }
    }

    function addScenarioSetWithValues(value, fieldName) {
        if (vm.scenarioSets.length < 10) {
            scenarioSetsCount++;
            var set = getNewSet(scenarioSetsCount);
            set[fieldName] = value;
            calculateScenarioSet(set, fieldName);
            vm.scenarioSets.push(set);
        } else {
            $scope.$emit('error', 'Can not add more sets');
        }
    }

    function useSetInScenario(value, scenarioSet, fieldName) {
        ////console.log('useSetInScenario');

        scenarioSet[fieldName] = value;
        calculateScenarioSet(scenarioSet, fieldName);

    }

    function removeScenarioSet(index) {
        vm.scenarioSets.splice(index, 1);
    }
    vm.marketRenPre2 = 0;
    vm.vacPre2 = 0;
    vm.expensePre2 = 0;
    vm.expensePerPre2 = 0;
    vm.BCRPre2 = 0;

    function calculateScenarioSet(set, inputName) {

        if (inputName == 'marketRentSF') {
            if (!set.marketRentSF || !$.isNumeric(set.marketRentSF)) {
                set.marketRentSF = 0
                vm.marketRenPre2 = 0;
            }
            if (set.marketRentSF == 0 && set.marketRentSF[1] != '.') {
                set.marketRentSF = 0
                vm.marketRenPre2 = 0;
            }
            if (vm.marketRenPre2 == 0 && set.marketRentSF >= 1) {
                if (set.marketRentSF < 10) {
                    set.marketRentSF = set.marketRentSF / 10;
                    set.marketRentSF = set.marketRentSF * 10;
                    vm.marketRenPre2 = set.marketRentSF
                }
                else {
                    set.marketRentSF = set.marketRentSF / 10;
                    vm.marketRenPre2 = set.marketRentSF

                }
            }
            marketRentSF = set.marketRentSF;

        } else if (inputName == 'vacancyPercentage') {
            if (!set.vacancyPercentage || !$.isNumeric(set.vacancyPercentage)) {
                set.vacancyPercentage = 0;
                vm.vacPre2 = 0;
            }
            if (set.vacancyPercentage == 0 && set.vacancyPercentage[1] != '.') {
                set.vacancyPercentage = 0
                vm.vacPre2 = 0;
            }
            if (set.vacancyPercentage >= 100) {
                set.vacancyPercentage = 100;
            }
            if (vm.vacPre2 == 0 && set.vacancyPercentage >= 1) {
                if (set.vacancyPercentage < 10) {
                    set.vacancyPercentage = set.vacancyPercentage / 10;
                    set.vacancyPercentage = set.vacancyPercentage * 10;
                    vm.vacPre2 = set.vacancyPercentage
                }
                else {
                    set.vacancyPercentage = set.vacancyPercentage / 10;
                    vm.vacPre2 = set.vacancyPercentage

                }
            }
            vacancyPercentage = set.vacancyPercentage;
        } else if (inputName == 'expenseSF') {
            //yet to implement
            if (!set.expenseSF || !$.isNumeric(set.expenseSF)) {
                set.expenseSF = 0;
                vm.expensePre2 = 0
            }
            if (set.expenseSF == 0 && set.expenseSF[1] != '.') {
                set.expenseSF = 0
                vm.expensePre2 == 0
            }

            if (vm.expensePre2 == 0 && set.expenseSF >= 1) {
                if (set.expenseSF < 10) {
                    set.expenseSF = set.expenseSF / 10;
                    set.expenseSF = set.expenseSF * 10;
                    vm.expensePre2 = set.expenseSF
                }
                else {
                    set.expenseSF = set.expenseSF / 10;
                    vm.expensePre2 = set.expenseSF

                }
            }
            expenseSF = set.expenseSF;
        } else if (inputName == 'expensePercentage') {
            if (!set.expensePercentage || !$.isNumeric(set.expensePercentage)) {
                set.expensePercentage = 0;
                vm.expensePerPre2 = 0;
            }
            if (set.expensePercentage == 0 && set.expensePercentage[1] != '.') {
                set.expensePercentage = 0
                vm.expensePerPre2 = 0
            }
            if (set.expensePercentage >= 100) {
                set.expensePercentage = 100;
            }


            if (vm.expensePerPre2 == 0 && set.expensePercentage >= 1) {
                if (set.expensePercentage < 10) {
                    set.expensePercentage = set.expensePercentage / 10;
                    set.expensePercentage = set.expensePercentage * 10;
                    vm.expensePerPre2 = set.expensePercentage
                }
                else {
                    set.expensePercentage = set.expensePercentage / 10;
                    vm.expensePerPre2 = set.expensePercentage

                }
            }
            expensePercentage = set.expensePercentage;
        } else if (inputName == 'BCR') {
            if (!set.BCR || !$.isNumeric(set.BCR)) {
                set.BCR = 0;
                vm.BCRPre2 = 0;
            }
            if (set.BCR == 0 && set.BCR[1] != '.') {
                set.BCR = 0
                vm.BCRPre2 = 0
            }
            if (set.BCR >= 100) {
                set.BCR = 100;
            }

            if (vm.BCRPre2 == 0 && set.BCR >= 1) {
                if (set.BCR < 10) {
                    set.BCR = set.BCR / 10;
                    set.BCR = set.BCR * 10;
                    vm.BCRPre2 = set.BCR
                }
                else {
                    set.BCR = set.BCR / 10;
                    vm.BCRPre2 = set.BCR

                }
            }
            BCR = set.BCR;
        }



        var annualRent = PetitionerFormulae.Petitioner.annualRent(leaseableSqFt, marketRentSF);
        var GPR = annualRent;
        var VacancyDolar = PetitionerFormulae.Petitioner.vacancy(GPR, (vacancyPercentage / 100));
        var effectiveRent = PetitionerFormulae.Petitioner.effectiveRent(annualRent, (VacancyDolar / 100));
        var expense = PetitionerFormulae.Petitioner.expenses(effectiveRent, (expensePercentage / 100));
        var expensesSF = PetitionerFormulae.Petitioner.expensesPerSf(expense, leaseableSqFt);
        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(effectiveRent, expense);
        var OCR = PetitionerFormulae.Petitioner.overAllCapRate(parseInt(BCR), parseInt(ETR));
        var VDC = PetitionerFormulae.Petitioner.valueDirectCap(OCR, NOI);
        var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(VDC, leaseableSqFt);
        ////console.log(expensePercentage + marketRentSF)
        set.vacancyPercentage = vacancyPercentage;
        set.expenseSF = expenseSF;
        set.expensePercentage = expensePercentage;
        set.NOI = NOI;
        set.BCR = BCR;
        set.value = VDC;
        set.valueSF = ValueSQFT;
        set.assessedValue = assessedValue;
        set.assessedValueSF = assessedValueSF;
        set.petitionerLeasableSF = leaseableSqFt;
        set.petitionerMarketRentSF = set.marketRentSF;
        set.petitionerAnnualRent = annualRent;
        set.petitionerGPR = GPR;
        set.petitionerVacancyPercentage = vacancyPercentage;
        set.petitionerVacancy = VacancyDolar;
        set.petitionerEffectiveRent = effectiveRent;
        set.petitionerExpensePercentage = expensePercentage;
        set.petitionerExpense = expense;
        set.petitionerExpenseSF = expensesSF;
        set.petitionerOI = otherIncome;
        set.petitionerNOI = NOI;
        set.petitionerBCR = BCR;
        set.petitionerETR = ETR;
        set.petitionerOCR = OCR;
        set.petitionerVDC = VDC;
        set.petitionerValueSF = ValueSQFT;
        set.petitionerNOIBySF = NOI / leaseableSqFt;

    }

    //===================================market rent per sqft===================================//
    var marketRentSetsCount = 0;
    vm.marketRentActive = true;
    vm.toggleMarketRent = toggleMarketRent;
    vm.addMarketRentSet = addMarketRentSet;
    vm.removeMRSet = removeMRSet;

    vm.marketRentSets = [];
    marketRentSetsCount++;
    vm.marketRentSets.push(getNewSet(marketRentSetsCount));
    var counts = 4;
    $scope.col = 3;

    function setColMd(colState) {
        ////console.log('colState', colState);
        // if(colState){
        //     counts++;
        // }
        // else{
        //     counts--;
        // }

        // ////console.log('counts' , counts);

        // if(counts != 0 )
        //     $scope.col  =  12 / counts;

        // ////console.log(' $scope.col' ,  $scope.col);

    }

    function toggleMarketRent() {
        vm.marketRentActive = !vm.marketRentActive;
        setColMd(vm.marketRentActive);
    }

    function addMarketRentSet() {
        marketRentSetsCount++;

        vm.marketRentSets.push(getNewSet(marketRentSetsCount));
    }
    vm.pre = 0;
    function removeMRSet(index) {
        vm.marketRentSets.splice(index, 1);
    }

    vm.calculateMarketRentSet = function (set) {

        if (!set.marketRentSF || !$.isNumeric(set.marketRentSF)) {
            set.marketRentSF = 0;
        }
        if (!set.marketRentSF || !$.isNumeric(set.marketRentSF)) {
            set.marketRentSF = 0;
            vm.pre = 0;
        }
        if (set.marketRentSF == 0 && set.marketRentSF[1] != '.') {
            ////console.log('aaaaaaaaaaasssssss00');

            set.marketRentSF = 0;
            vm.pre = 0;
        }
        ////console.log('aaaaaaaaaaasssssss00' + vm.pre);


        if (vm.pre == 0 && set.marketRentSF >= 1) {
            if (set.marketRentSF < 10) {
                set.marketRentSF = set.marketRentSF / 10;
                set.marketRentSF = set.marketRentSF * 10;
                vm.pre = set.marketRentSF
            }
            else {
                set.marketRentSF = set.marketRentSF / 10;
                vm.pre = set.marketRentSF

            }
        }

        var annualRent = PetitionerFormulae.Petitioner.annualRent(leaseableSqFt, set.marketRentSF);
        var GPR = annualRent;
        var VacancyDolar = PetitionerFormulae.Petitioner.vacancy(GPR, (vacancyPercentage / 100));
        var effectiveRent = PetitionerFormulae.Petitioner.effectiveRent(annualRent, (VacancyDolar / 100));
        var expense = PetitionerFormulae.Petitioner.expenses(effectiveRent, (expensePercentage / 100));
        var expensesSF = PetitionerFormulae.Petitioner.expensesPerSf(expense, leaseableSqFt);
        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(effectiveRent, expense);
        var OCR = PetitionerFormulae.Petitioner.overAllCapRate(parseInt(BCR), parseInt(ETR));
        var VDC = PetitionerFormulae.Petitioner.valueDirectCap(OCR, NOI);
        var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(VDC, leaseableSqFt);

        set.vacancyPercentage = vacancyPercentage;
        set.expenseSF = expensesSF;
        set.expensePercentage = expensePercentage;
        set.NOI = NOI;
        set.BCR = BCR;
        set.value = VDC;
        set.valueSF = ValueSQFT;
        set.assessedValue = assessedValue;
        set.assessedValueSF = assessedValueSF;
        set.petitionerLeasableSF = leaseableSqFt;
        set.petitionerMarketRentSF = set.marketRentSF;
        set.petitionerAnnualRent = annualRent;
        set.petitionerGPR = GPR;
        set.petitionerVacancyPercentage = vacancyPercentage;
        set.petitionerVacancy = VacancyDolar;
        set.petitionerEffectiveRent = effectiveRent;
        set.petitionerExpensePercentage = expensePercentage;
        set.petitionerExpense = expense;
        set.petitionerExpenseSF = expensesSF;
        set.petitionerOI = otherIncome;
        set.petitionerNOI = NOI;
        set.petitionerBCR = BCR;
        set.petitionerETR = ETR;
        set.petitionerOCR = OCR;
        set.petitionerVDC = VDC;
        set.petitionerValueSF = ValueSQFT;
        set.petitionerNOIBySF = NOI / leaseableSqFt;

    }


    //=================================== vacancy %  ============================================//


    var vacancySetsCount = 0;

    vm.vacancyActive = true;
    vm.addVacancySet = addVacancySet;
    vm.toggleVacancy = toggleVacancy;
    vm.removeVacancySet = removeVacancySet;
    vm.vacancySets = [];
    vacancySetsCount++;
    vm.vacancySets.push(getNewSet(vacancySetsCount));

    function toggleVacancy() {
        vm.vacancyActive = !vm.vacancyActive;
        setColMd(vm.vacancyActive);
    }

    function addVacancySet() {
        vacancySetsCount++;
        vm.vacancySets.push(getNewSet(vacancySetsCount));
    }

    function removeVacancySet(index) {
        vm.vacancySets.splice(index, 1);
    }
    vm.vacPre = 0;
    vm.calculateVacancySet = function (set) {
        set.marketRentSF = marketRentSF;

        if (!set.vacancyPercentage || !$.isNumeric(set.vacancyPercentage)) {
            set.vacancyPercentage = 0;
            vm.vacPre = 0;
        }
        if (set.vacancyPercentage == 0 && set.vacancyPercentage[1] != '.') {
            set.vacancyPercentage = 0;
            vm.vacPre = 0;
        }

        if (vm.vacPre == 0 && set.vacancyPercentage >= 1) {
            if (set.vacancyPercentage < 10) {
                set.vacancyPercentage = set.vacancyPercentage / 10;
                set.vacancyPercentage = set.vacancyPercentage * 10;
                vm.vacPre = set.vacancyPercentage
            }
            else {
                set.vacancyPercentage = set.vacancyPercentage / 10;
                vm.expPre = set.vacancyPercentage

            }
        }


        var annualRent = PetitionerFormulae.Petitioner.annualRent(leaseableSqFt, set.marketRentSF);
        var GPR = annualRent;
        var VacancyDolar = PetitionerFormulae.Petitioner.vacancy(GPR, (set.vacancyPercentage / 100));
        var effectiveRent = PetitionerFormulae.Petitioner.effectiveRent(annualRent, (VacancyDolar / 100));
        var expense = PetitionerFormulae.Petitioner.expenses(effectiveRent, (expensePercentage / 100));
        var expensesSF = PetitionerFormulae.Petitioner.expensesPerSf(expense, leaseableSqFt);
        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(effectiveRent, expense);
        var OCR = PetitionerFormulae.Petitioner.overAllCapRate(parseInt(BCR), parseInt(ETR));
        var VDC = PetitionerFormulae.Petitioner.valueDirectCap(OCR, NOI);
        var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(VDC, leaseableSqFt);

        // set.vacancyPercentage = vacancyPercentage;
        set.expenseSF = expensesSF;
        set.expensePercentage = expensePercentage;
        set.NOI = NOI;
        set.BCR = BCR;
        set.value = VDC;
        set.valueSF = ValueSQFT;
        set.assessedValue = assessedValue;
        set.assessedValueSF = assessedValueSF;
        set.petitionerLeasableSF = leaseableSqFt;
        set.petitionerMarketRentSF = set.marketRentSF;
        set.petitionerAnnualRent = annualRent;
        set.petitionerGPR = GPR;
        set.petitionerVacancyPercentage = set.vacancyPercentage;
        set.petitionerVacancy = VacancyDolar;
        set.petitionerEffectiveRent = effectiveRent;
        set.petitionerExpensePercentage = expensePercentage;
        set.petitionerExpense = expense;
        set.petitionerExpenseSF = expensesSF;
        set.petitionerOI = otherIncome;
        set.petitionerNOI = NOI;
        set.petitionerBCR = BCR;
        set.petitionerETR = ETR;
        set.petitionerOCR = OCR;
        set.petitionerVDC = VDC;
        set.petitionerValueSF = ValueSQFT;
        set.petitionerNOIBySF = NOI / leaseableSqFt;

    }
    //=================================== expense % =============================================//
    var expenseSetsCount = 0;

    vm.expenseActive = true;
    vm.toggleExpense = toggleExpense;
    vm.addExpenseSet = addExpenseSet;
    vm.removeExpenseSet = removeExpenseSet;
    vm.expenseSets = [];
    expenseSetsCount++;
    vm.expenseSets.push(getNewSet(expenseSetsCount));

    function toggleExpense() {
        vm.expenseActive = !vm.expenseActive;
        setColMd(vm.expenseActive);

    }

    function addExpenseSet() {
        expenseSetsCount++;
        vm.expenseSets.push(getNewSet(expenseSetsCount));
    }

    function removeExpenseSet(index) {
        vm.expenseSets.splice(index, 1);
    }
    vm.expPre2 = 0;
    vm.expPre = 0;
    vm.calculateExpenseSet = function (set) {
        set.vacancyPercentage = vacancyPercentage;
        set.marketRentSF = marketRentSF;

        if (vm.expenseInputActive) {
            ////console.log('expenseInputActive', vm.expenseInputActive);

            if (!set.expenseSF || !$.isNumeric(set.expenseSF)) {
                set.expenseSF = 0;
                vm.expPre = 0;
            }
            if (set.expenseSF == 0 && set.expenseSF[1] != '.') {
                set.expenseSF = 0;
                vm.expPre = 0;
            }

            if (vm.expPre == 0 && set.expenseSF >= 1) {
                if (set.expenseSF < 10) {
                    set.expenseSF = set.expenseSF / 10;
                    set.expenseSF = set.expenseSF * 10;
                    vm.expPre = set.expenseSF
                }
                else {
                    set.expenseSF = set.expenseSF / 10;
                    vm.expPre = set.expenseSF

                }
            }


            set.expensePercentage = expensePercentage;

        } else {
            ////console.log('expenseInputActive', vm.expenseInputActive);

            if (!set.expensePercentage || !$.isNumeric(set.expensePercentage)) {
                set.expensePercentage = 0;
                vm.expPre2 = 0;
            }
            if (set.expensePercentage == 0 && set.expensePercentage[1] != '.') {
                set.expensePercentage = 0;
                vm.expPre2 = 0;
            }
            ////console.log('previous', vm.expPre2);

            if (vm.expPre2 == 0 && set.expensePercentage >= 1) {
                if (set.expensePercentage < 10) {
                    set.expensePercentage = set.expensePercentage / 10;
                    set.expensePercentage = set.expensePercentage * 10;
                    vm.expPre2 = set.expensePercentage
                }
                else {
                    set.expensePercentage = set.expensePercentage / 10;
                    vm.expPre2 = set.expensePercentage

                }
            }

            expensePercentage = set.expensePercentage;

        }

        var annualRent = PetitionerFormulae.Petitioner.annualRent(leaseableSqFt, set.marketRentSF);
        var GPR = annualRent;
        var VacancyDolar = PetitionerFormulae.Petitioner.vacancy(GPR, (set.vacancyPercentage / 100));
        var effectiveRent = PetitionerFormulae.Petitioner.effectiveRent(annualRent, (VacancyDolar / 100));

        var expense = PetitionerFormulae.Petitioner.expenses(effectiveRent, (expensePercentage / 100));
        var expenseSF = PetitionerFormulae.Petitioner.expensesPerSf(expense, leaseableSqFt);
        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(effectiveRent, expense);
        var OCR = PetitionerFormulae.Petitioner.overAllCapRate(parseInt(BCR), parseInt(ETR));
        var VDC = PetitionerFormulae.Petitioner.valueDirectCap(OCR, NOI);
        var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(VDC, leaseableSqFt);

        // set.vacancyPercentage = vacancyPercentage;
        //if expenseSF is active donot update
        if (!vm.expenseInputActive) {
            set.expenseSF = expenseSF;
        }
        // set.expensePercentage = expensePercentage;
        set.NOI = NOI;
        set.BCR = BCR;
        set.value = VDC;
        set.valueSF = ValueSQFT;
        set.assessedValue = assessedValue;
        set.assessedValueSF = assessedValueSF;
        set.petitionerLeasableSF = leaseableSqFt;
        set.petitionerMarketRentSF = set.marketRentSF;
        set.petitionerAnnualRent = annualRent;
        set.petitionerGPR = GPR;
        set.petitionerVacancyPercentage = set.vacancyPercentage;
        set.petitionerVacancy = VacancyDolar;
        set.petitionerEffectiveRent = effectiveRent;
        set.petitionerExpensePercentage = expensePercentage;
        set.petitionerExpense = expense;
        set.petitionerExpenseSF = expenseSF;
        set.petitionerOI = otherIncome;
        set.petitionerNOI = NOI;
        set.petitionerBCR = BCR;
        set.petitionerETR = ETR;
        set.petitionerOCR = OCR;
        set.petitionerVDC = VDC;
        set.petitionerValueSF = ValueSQFT;
        set.petitionerNOIBySF = NOI / leaseableSqFt;
    }

    vm.expenseInputActive = true;

    vm.ExpenseSFInput = function () {
        vm.expenseInputActive = true;
    }

    vm.ExpensePercentageInput = function () {
        vm.expenseInputActive = false;
    }

    //=================================== Bace cape Rate=========================================//
    vm.baseCapeRateActive = true;
    var BCRSetsCount = 0;
    vm.toggleBaseCapeRate = toggleBaseCapeRate;
    vm.addBCRSet = addBCRSet;
    vm.removeBCRSet = removeBCRSet;
    vm.BCRSets = [];
    BCRSetsCount++;
    vm.BCRSets.push(getNewSet(BCRSetsCount));

    function toggleBaseCapeRate() {
        ////console.log('toggleBaseCapeRate');
        vm.baseCapeRateActive = !vm.baseCapeRateActive;
        setColMd(vm.baseCapeRateActive);
    }

    function addBCRSet() {
        BCRSetsCount++;
        vm.BCRSets.push(getNewSet(BCRSetsCount));
    }

    function removeBCRSet(index) {
        vm.BCRSets.splice(index, 1);
    }
    vm.bcrPre = -1;
    vm.calculateBCRSet = function (set) {
        set.vacancyPercentage = vacancyPercentage;
        set.marketRentSF = marketRentSF;
        if (!set.BCR || !$.isNumeric(set.BCR)) {
            set.BCR = 0;
        }
        if (!set.BCR || !$.isNumeric(set.BCR)) {
            set.BCR = 0;
            vm.bcrPre = 0;
        }
        if (set.BCR == 0 && set.BCR[1] != '.') {
            set.BCR = 0;
            vm.bcrPre = 0;
        }
        if (vm.bcrPre == 0 && set.BCR >= 1) {
            if (set.BCR < 10) {
                set.BCR = set.BCR / 10;
                set.BCR = set.BCR * 10;
                vm.bcrPre = set.BCR
            }
            else {
                set.BCR = set.BCR / 10;
                vm.bcrPre = set.BCR

            }
        }


        var annualRent = PetitionerFormulae.Petitioner.annualRent(leaseableSqFt, set.marketRentSF);
        var GPR = annualRent;
        var VacancyDolar = PetitionerFormulae.Petitioner.vacancy(GPR, (set.vacancyPercentage / 100));
        var effectiveRent = PetitionerFormulae.Petitioner.effectiveRent(annualRent, (VacancyDolar / 100));
        var expense = PetitionerFormulae.Petitioner.expenses(effectiveRent, (expensePercentage / 100));
        var expensesSF = PetitionerFormulae.Petitioner.expensesPerSf(expense, leaseableSqFt);
        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(effectiveRent, expense);
        var OCR = PetitionerFormulae.Petitioner.overAllCapRate(parseInt(set.BCR), parseInt(ETR));
        var VDC = PetitionerFormulae.Petitioner.valueDirectCap(OCR, NOI);
        var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(VDC, leaseableSqFt);

        set.vacancyPercentage = vacancyPercentage;
        set.expenseSF = expensesSF;
        set.expensePercentage = expensePercentage;
        set.NOI = NOI;
        // set.BCR = BCR;
        set.value = VDC;
        set.valueSF = ValueSQFT;
        set.assessedValue = assessedValue;
        set.assessedValueSF = assessedValueSF;
        set.petitionerLeasableSF = leaseableSqFt;
        set.petitionerMarketRentSF = set.marketRentSF;
        set.petitionerAnnualRent = annualRent;
        set.petitionerGPR = GPR;
        set.petitionerVacancyPercentage = set.vacancyPercentage;
        set.petitionerVacancy = VacancyDolar;
        set.petitionerEffectiveRent = effectiveRent;
        set.petitionerExpensePercentage = expensePercentage;
        set.petitionerExpense = expense;
        set.petitionerExpenseSF = expensesSF;
        set.petitionerOI = otherIncome;
        set.petitionerNOI = NOI;
        set.petitionerBCR = BCR;
        set.petitionerETR = ETR;
        set.petitionerOCR = OCR;
        set.petitionerVDC = VDC;
        set.petitionerValueSF = ValueSQFT;
        set.petitionerNOIBySF = NOI / leaseableSqFt;
    }


    //===================================   use Scenario ===================================//

    vm.useInValuation = useInValuation;

    function useInValuation(set) {
        // saveScenario();
        ////console.log('use in valuations', set);
        localStorage.setItem('selectedScenario', angular.toJson(set))
        saveScenario('propertyValuation')

    }

    //=============================================================================================//


    function getNewSet(count) {
        var set = {
            name: 'Set ' + count,
            marketRentSF: 0,
            vacancyPercentage: 0,
            expenseSF: 0,
            expensePercentage: 0,
            NOI: 0,
            BCR: 0,
            value: 0,
            valueSF: 0,
            assessedValue: 0,
            assessedValueSF: 0,
            // petitioner set
            petitionerLeasableSF: 0,
            petitionerMarketRentSF: 0,
            petitionerAnnualRent: 0,
            petitionerGPR: 0,
            petitionerVacancyPercentage: 0,
            petitionerVacancy: 0,
            petitionerEffectiveRent: 0,
            petitionerExpensePercentage: 0,
            petitionerExpense: 0,
            petitionerExpenseSF: 0,
            petitionerOI: 0,
            petitionerNOI: 0,
            petitionerNOIBySF: 0,
            petitionerBCR: 0,
            petitionerETR: 0,
            petitionerOCR: 0,
            petitionerVDC: 0,
            petitionerValueSF: 0
        };
        return set;
    }
    //=============================================================================================//

    //====================================Modal Decisions=========================================================//
}
