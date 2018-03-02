'use strict';

_SensitivityOne.$inject = ["$timeout", "PetitionerFormulae", "$state", "$scope", "SensitivityService", "ScenarioDataService"];
module.exports = _SensitivityOne;

//angular.module('AOTC')
//    .controller('SensitivityOne', _SensitivityOne
//    );

function _SensitivityOne($timeout, PetitionerFormulae, $state, $scope, SensitivityService, ScenarioDataService) {
    ////console.log("SensitivityOne controllersss");
    var vm = this;
    vm.formId = parseInt(localStorage.getItem('formId'));
    vm.userId = parseInt(localStorage.getItem('userId'));
    localStorage.removeItem('selectedScenario');

    $scope.col = 3;
    vm.sensitivityNamesCount = 4;
    vm.scenarioNamesCount = 1;
    vm.submitClicked = false;
    vm.scenarioTwoActive = false;

    vm.property = JSON.parse(localStorage.getItem('propertyDetails'));

    vm.showSensitivityTab = true;
    vm.showScenarioTab = false;
    vm.showScenario = showScenario;
    vm.showSensitivity = showSensitivity;
    vm.sensitivityErrorCount = sensitivityErrorCount;

    setTimeout(function () {
        $('[data-tooltip="tooltip"]').tooltip();
    }, 1000);



    var scenarioDataService = ScenarioDataService.GetValues();
    // ////console.log(scenarioDataService);
    $scope.apple = function () {
        ////console.log('check dy dhupaay');
    }
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

    if (scenarioDataService.scenarioToShow == 'one') {
        $timeout(function () {
            $scope.col = 3;
        }, 10);
        vm.scenarioTwoActive = false;
        regenerateValue(scenarioDataService);

    } else if (scenarioDataService.scenarioToShow == 'two') {
        $timeout(function () {
            $scope.col = 2;
        }, 10);
        vm.scenarioTwoActive = true;
        regenerateValue(scenarioDataService);

    } else {

        //===================================   get workspace ===================================//
        SensitivityService.getWorkspace()
            .then(function (result) {
                ////console.log(result);

                if (result.data.result) {
                    var serverData = result.data.result[0];
                    ////console.log(serverData);
                    vm.marketRentSets = serverData.marketPerSF;
                    vm.vacancySets = serverData.vacancyPercent;
                    vm.expenseSets = serverData.expensePerSF;
                    vm.BCRSets = serverData.BaseCapRate;
                    vm.scenarioSets = serverData.scenarios;
                }



                if (vm.marketRentSets.length == 0) {
                    vm.marketRentSets.push(getNewSet(marketRentSetsCount));
                }

                if (vm.vacancySets.length == 0) {
                    vm.vacancySets.push(getNewSet(vacancySetsCount));
                }

                if (vm.expenseSets.length == 0) {
                    vm.expenseSets.push(getNewSet(expenseSetsCount));
                }

                if (vm.BCRSets.length == 0) {
                    vm.BCRSets.push(getNewSet(BCRSetsCount));
                }

                if (vm.scenarioSets.length == 0) {
                    vm.scenarioSets.push(getNewSet(scenarioSetsCount));
                }


            }, function (err) {
                ////console.log(err);

            });

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

    $scope.showScenarioThree = function () {
        ////console.log('showScenarioTwo')
        $scope.col = 2;
        vm.scenarioTwoActive = true;

        ScenarioDataService.SetValues(
            vm.marketRentSets,
            vm.vacancySets,
            vm.expenseSets,
            vm.BCRSets,
            vm.scenarioSets,
            'three',
            marketRentSetsCount,
            vacancySetsCount,
            expenseSetsCount,
            BCRSetsCount,
            scenarioSetsCount
        );

        $state.go('SensitivityThree');


    }

    function showSensitivity() {
        vm.showSensitivityTab = true;
        vm.showScenarioTab = false;
        sensitivityErrorCount();
    }

    function showScenario() {
        vm.showSensitivityTab = false;
        vm.showScenarioTab = true;
        sensitivityErrorCount();
    }


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

    function saveScenario(redirect) {
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
            propId:parseInt(localStorage.getItem('propertyId')),
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

        ////console.log('--------------------------saveWorkSpace------------------------');
        ////console.log(saveFormJson);

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

    //===================================   use Scenario ===================================//

    vm.useInValuation = useInValuation;

    function useInValuation(set) {
        // saveScenario();
        ////console.log('use in valuations', set);
        localStorage.setItem('selectedScenario', angular.toJson(set))
        saveScenario('propertyValuation')

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
    vm.marketRenPre2 = -1;
    vm.vacPre2 = -1;
    vm.expensePre2 = -1
    vm.expensePerPre2 = -1
    vm.BCRPre2 = -1

    function calculateScenarioSet(set, inputName) {
        var expenseCalculation = 0;
        if (inputName == 'marketRentSF') {
            if (!set.marketRentSF || !$.isNumeric(set.marketRentSF)) {
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
            // marketRentSF = set.marketRentSF;

        } else if (inputName == 'vacancyPercentage') {
            if (!set.vacancyPercentage || !$.isNumeric(set.vacancyPercentage)) {
                set.vacancyPercentage = 0;
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
            // vacancyPercentage = set.vacancyPercentage;
        } else if (inputName == 'expenseSF') {
            expenseCalculation = 0;
            //yet to implement
            if (!set.expenseSF || !$.isNumeric(set.expenseSF)) {
                set.expenseSF = 0;
                vm.expensePre2 = 0
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


            // expenseSF = set.expenseSF;
        } else if (inputName == 'expensePercentage') {
            expenseCalculation = 1;
            if (!set.expensePercentage || !$.isNumeric(set.expensePercentage)) {
                set.expensePercentage = 0;
                vm.expensePerPre2 = 0;
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

            // expensePercentage = set.expensePercentage;
        } else if (inputName == 'BCR') {
            if (!set.BCR || !$.isNumeric(set.BCR)) {
                set.BCR = 0;
                vm.BCRPre2 = 0;
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
            // BCR = set.BCR;
        }



        var annualRent = PetitionerFormulae.Petitioner.annualRent(set.petitionerLeasableSF, set.marketRentSF);
        var GPR = annualRent;
        var VacancyDolar = PetitionerFormulae.Petitioner.vacancy(GPR, (set.expenseSF / 100));
        var effectiveRent = annualRent + VacancyDolar;
        if (expenseCalculation == 1) {
            var expense = PetitionerFormulae.Petitioner.expenses(set.expensePercentage, effectiveRent);
            var expenseSF = PetitionerFormulae.Petitioner.expensesPerSf(expense, set.petitionerLeasableSF);
            set.expenseSF = expenseSF;
        } else {
            var expense = PetitionerFormulae.Petitioner.expensesDolar(set.expenseSF, set.petitionerLeasableSF);
            var expensePercentage = PetitionerFormulae.Petitioner.expensesPercentage(expense, effectiveRent);
            set.expensePercentage = expensePercentage;
        }
        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(effectiveRent, expense);
        var OCR = PetitionerFormulae.Petitioner.overAllCapRate(parseInt(set.BCR), parseInt(set.petitionerETR));
        var VDC = PetitionerFormulae.Petitioner.valueDirectCap(OCR, NOI);
        var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(VDC, set.petitionerLeasableSF);

        set.vacancyPercentage = set.vacancyPercentage;
        // set.expenseSF = set.petitionerLeasableSF;
        set.expensePercentage = set.expensePercentage;
        set.NOI = NOI;
        set.value = VDC;
        set.valueSF = ValueSQFT;
        set.assessedValue = assessedValue;
        set.assessedValueSF = assessedValueSF;
        set.petitionerLeasableSF = set.petitionerLeasableSF;
        set.petitionerMarketRentSF = set.marketRentSF;
        set.petitionerAnnualRent = annualRent;
        set.petitionerGPR = GPR;
        set.petitionerVacancyPercentage = set.vacancyPercentage;
        set.petitionerVacancy = VacancyDolar;
        set.petitionerEffectiveRent = effectiveRent;
        set.petitionerExpensePercentage = set.expensePercentage;
        set.petitionerExpense = expense;
        set.petitionerExpenseSF = set.expenseSF;
        // set.petitionerOI = set.petitionerOI;
        set.petitionerNOI = NOI;
        set.petitionerBCR = set.BCR;
        set.petitionerETR = set.petitionerETR;
        set.petitionerOCR = OCR;
        set.petitionerVDC = VDC;
        set.petitionerValueSF = ValueSQFT;
        set.petitionerNOIBySF = NOI / set.petitionerLeasableSF;
        parseDecimail(set, set.vacancyPercentage, set.expensePercentage, set.petitionerBCR)

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
    vm.pre = -1;

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

    function removeMRSet(index) {
        vm.marketRentSets.splice(index, 1);
    }

    vm.calculateMarketRentSet = function (set) {
        ////console.log('aaaaaaaaaaasssssss', set.marketRentSF);

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


        ////console.log('after', set.marketRentSF);

        var annualRent = PetitionerFormulae.Petitioner.annualRent(set.petitionerLeasableSF, set.marketRentSF);
        var GPR = annualRent;
        var VacancyDolar = PetitionerFormulae.Petitioner.vacancy(GPR, (set.vacancyPercentage / 100));

        var effectiveRent = annualRent + VacancyDolar;


        var expense = PetitionerFormulae.Petitioner.expenses(effectiveRent, (set.expensePercentage / 100));

        var expensesSF = PetitionerFormulae.Petitioner.expensesPerSf(expense, set.petitionerLeasableSF);

        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(effectiveRent, expense);

        var OCR = PetitionerFormulae.Petitioner.overAllCapRate(parseInt(set.BCR), parseInt(set.petitionerETR));

        var VDC = PetitionerFormulae.Petitioner.valueDirectCap(OCR, NOI);
        var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(VDC, set.petitionerLeasableSF);

        set.expenseSF = expensesSF;
        // set.expensePercentage = expensePercentage;
        set.NOI = NOI / set.petitionerLeasableSF;
        // set.BCR = BCR;
        set.value = VDC;
        set.valueSF = ValueSQFT;
        // set.assessedValue = assessedValue;
        set.assessedValueSF = set.assessedValue / set.petitionerLeasableSF;
        // set.petitionerLeasableSF = leaseableSqFt;
        set.petitionerMarketRentSF = set.marketRentSF;
        set.petitionerAnnualRent = annualRent;
        set.petitionerGPR = GPR;
        set.petitionerVacancyPercentage = set.vacancyPercentage;
        set.petitionerVacancy = VacancyDolar;
        set.petitionerEffectiveRent = effectiveRent;
        // set.petitionerExpensePercentage = set.expensePercentage;
        set.petitionerExpense = expense;
        set.petitionerExpenseSF = expensesSF;
        // set.petitionerOI = otherIncome;
        set.petitionerNOI = NOI;
        // set.petitionerBCR = BCR;
        // set.petitionerETR = ETR;
        set.petitionerOCR = OCR;
        set.petitionerVDC = VDC;
        set.petitionerValueSF = ValueSQFT;
        set.petitionerNOIBySF = NOI / set.petitionerLeasableSF;
        ////console.log(set);


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

    function parseDecimail(set, vacancy, expensePer, baseCap) {
        var parseVac = vacancy.toString().trim();
        var parseExp = expensePer.toString().trim();
        var parseBase = baseCap.toString().trim();

        if (parseVac.indexOf('.') >= 0) {

            var parseVacLen = parseVac.split(".")[1].length;
            if (parseVacLen > 2) {
                ////console.log('founded')
                set.vacancyPercentage = Math.round(set.vacancyPercentage * 100) / 1000
                if (set.vacancyPercentage == 0) {
                    set.vacancyPercentage = 0.00
                }
            }
        }
        ////console.log(set.expensePercentage + '---' + parseExp.indexOf('.'))

        if (parseExp.indexOf('.') >= 0) {

            var parseExpLen = (parseExp.split(".")[1].length);
            if (parseExpLen > 2) {
                ////console.log('founded' + parseExp)

                set.expensePercentage = Math.round(set.expensePercentage * 100) / 1000
                if (set.expensePercentage == 0) {
                    set.expensePercentage = 0.00
                }
            }

        }
        if (parseBase.indexOf('.') >= 0) {
            var parseBaseLen = parseBase.split(".")[1].length;
            if (parseBaseLen > 2) {
                set.petitionerBCR = Math.round(set.petitionerBCR * 100) / 100
                if (set.petitionerBCR == 0) {
                    set.petitionerBCR = 0.00
                }
            }
        }





    }


    vm.vacPre = -1;
    vm.calculateVacancySet = function (set) {

        if (!set.vacancyPercentage || !$.isNumeric(set.vacancyPercentage)) {
            set.vacancyPercentage = 0;
            vm.vacPre = 0;
        }
        if (set.vacancyPercentage == 0 && set.vacancyPercentage[1] != '.') {
            set.vacancyPercentage = 0;
            vm.vacPre = 0;
        }
        if (set.vacancyPercentage > 100) {
            set.vacancyPercentage = 100;
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



        var annualRent = PetitionerFormulae.Petitioner.annualRent(set.petitionerLeasableSF, set.marketRentSF);
        var GPR = annualRent;
        var VacancyDolar = PetitionerFormulae.Petitioner.vacancy(GPR, (set.vacancyPercentage / 100));

        var effectiveRent = annualRent + VacancyDolar;

        var expense = PetitionerFormulae.Petitioner.expenses(effectiveRent, (set.expensePercentage / 100));

        var expensesSF = PetitionerFormulae.Petitioner.expensesPerSf(expense, set.petitionerLeasableSF);

        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(effectiveRent, expense);

        var OCR = PetitionerFormulae.Petitioner.overAllCapRate(parseInt(set.BCR), parseInt(set.petitionerETR));

        var VDC = PetitionerFormulae.Petitioner.valueDirectCap(OCR, NOI);
        var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(VDC, set.petitionerLeasableSF);


        set.expenseSF = expensesSF;
        // set.expensePercentage = expensePercentage;
        set.NOI = NOI / set.petitionerLeasableSF;
        // set.BCR = BCR;
        set.value = VDC;
        set.valueSF = ValueSQFT;
        // set.assessedValue = assessedValue;
        set.assessedValueSF = set.assessedValue / set.petitionerLeasableSF;
        // set.petitionerLeasableSF = leaseableSqFt;
        set.petitionerMarketRentSF = set.marketRentSF;
        set.petitionerAnnualRent = annualRent;
        set.petitionerGPR = GPR;
        set.petitionerVacancyPercentage = set.vacancyPercentage;
        set.petitionerVacancy = VacancyDolar;
        set.petitionerEffectiveRent = effectiveRent;
        // set.petitionerExpensePercentage = set.expensePercentage;
        set.petitionerExpense = expense;
        set.petitionerExpenseSF = expensesSF;
        // set.petitionerOI = otherIncome;
        set.petitionerNOI = NOI;
        // set.petitionerBCR = BCR;
        // set.petitionerETR = ETR;
        set.petitionerOCR = OCR;
        set.petitionerVDC = VDC;
        set.petitionerValueSF = ValueSQFT;
        set.petitionerNOIBySF = NOI / set.petitionerLeasableSF;

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
        if (!vm.clickcheck) {
            vm.expenseActive = !vm.expenseActive;
            setColMd(vm.expenseActive);
            vm.clickcheck = false;
        }
        else {
            vm.clickcheck = false;

        }

    }

    function addExpenseSet() {
        expenseSetsCount++;
        vm.expenseSets.push(getNewSet(expenseSetsCount));
    }

    function removeExpenseSet(index) {
        vm.expenseSets.splice(index, 1);
    }
    vm.expPre == -1;
    vm.expPre2 = -1;

    vm.calculateExpenseSet = function (set) {


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
            if (set.expensePercentage > 100) {
                set.expensePercentage = 100;
            }
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

        }


        var annualRent = PetitionerFormulae.Petitioner.annualRent(set.petitionerLeasableSF, set.marketRentSF);
        var GPR = annualRent;
        var VacancyDolar = PetitionerFormulae.Petitioner.vacancy(GPR, (set.vacancyPercentage / 100));
        var effectiveRent = annualRent + VacancyDolar;

        if (!vm.expenseInputActive) {
            var expense = PetitionerFormulae.Petitioner.expenses(set.expensePercentage, effectiveRent);
            var expenseSF = PetitionerFormulae.Petitioner.expensesPerSf(expense, set.petitionerLeasableSF);
        } else {
            var expense = PetitionerFormulae.Petitioner.expensesDolar(set.expenseSF, set.petitionerLeasableSF);
            var expensePercentage = PetitionerFormulae.Petitioner.expensesPercentage(expense, effectiveRent);
        }
        // var expensesSF = PetitionerFormulae.Petitioner.expensesPerSf(expense, set.petitionerLeasableSF);

        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(effectiveRent, expense);
        var OCR = PetitionerFormulae.Petitioner.overAllCapRate(parseInt(set.BCR), parseInt(set.petitionerETR));
        var VDC = PetitionerFormulae.Petitioner.valueDirectCap(OCR, NOI);
        var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(VDC, set.petitionerLeasableSF);



        // set.vacancyPercentage = vacancyPercentage;
        //if expenseSF is active donot update
        if (!vm.expenseInputActive) {
            ////console.log('expenseInset.set.expenseSF', set.expenseSF);

            set.expenseSF = expenseSF;
            // set.expensePercentage = expensePercentage;
            set.NOI = NOI / set.petitionerLeasableSF;
            // set.BCR = BCR;
            set.value = VDC;
            set.valueSF = ValueSQFT;
            // set.assessedValue = assessedValue;
            set.assessedValueSF = set.assessedValue / set.petitionerLeasableSF;
            // set.petitionerLeasableSF = leaseableSqFt;
            set.petitionerMarketRentSF = set.marketRentSF;
            set.petitionerAnnualRent = annualRent;
            set.petitionerGPR = GPR;
            set.petitionerVacancyPercentage = set.vacancyPercentage;
            set.petitionerVacancy = VacancyDolar;
            set.petitionerEffectiveRent = effectiveRent;
            // set.petitionerExpensePercentage = set.expensePercentage;
            set.petitionerExpense = expense;
            set.petitionerExpenseSF = expenseSF;
            // set.petitionerOI = otherIncome;
            set.petitionerNOI = NOI;
            set.petitionerBCR = set.BCR;
            // set.petitionerETR = ETR;
            set.petitionerOCR = OCR;
            set.petitionerVDC = VDC;
            set.petitionerValueSF = ValueSQFT;
            set.petitionerNOIBySF = NOI / set.petitionerLeasableSF;

        } else {

            // set.expenseSF = expenseSF;
            set.expensePercentage = expensePercentage;
            set.NOI = NOI / set.petitionerLeasableSF;
            // set.BCR = BCR;
            set.value = VDC;
            set.valueSF = ValueSQFT;
            // set.assessedValue = assessedValue;
            set.assessedValueSF = set.assessedValue / set.petitionerLeasableSF;
            // set.petitionerLeasableSF = leaseableSqFt;
            set.petitionerMarketRentSF = set.marketRentSF;
            set.petitionerAnnualRent = annualRent;
            set.petitionerGPR = GPR;
            set.petitionerVacancyPercentage = set.vacancyPercentage;
            set.petitionerVacancy = VacancyDolar;
            set.petitionerEffectiveRent = effectiveRent;
            // set.petitionerExpensePercentage = set.expensePercentage;
            set.petitionerExpense = expense;
            set.petitionerExpenseSF = expenseSF;
            // set.petitionerOI = otherIncome;
            set.petitionerNOI = NOI;
            set.petitionerBCR = set.BCR;
            // set.petitionerETR = ETR;
            set.petitionerOCR = OCR;
            set.petitionerVDC = VDC;
            set.petitionerValueSF = ValueSQFT;
            set.petitionerNOIBySF = NOI / set.petitionerLeasableSF;

        }
        // set.expensePercentage = expensePercentage;

    }

    vm.expenseInputActive = true;
    vm.clickcheck = false;
    vm.ExpenseSFInput = function () {
        vm.clickcheck = true;
        vm.expenseInputActive = true;
    }

    vm.ExpensePercentageInput = function () {
        vm.clickcheck = true;
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

        if (!set.BCR || !$.isNumeric(set.BCR)) {
            set.BCR = 0;
            vm.bcrPre = 0;
        }
        if (set.BCR == 0 && set.BCR[1] != '.') {
            set.BCR = 0;
            vm.bcrPre = 0;
        }
        if (set.BCR >= 100) {
            set.BCR = 100;
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

        var annualRent = PetitionerFormulae.Petitioner.annualRent(set.petitionerLeasableSF, set.marketRentSF);
        var GPR = annualRent;
        var VacancyDolar = PetitionerFormulae.Petitioner.vacancy(GPR, (set.vacancyPercentage / 100));
        var effectiveRent = annualRent + VacancyDolar;
        var expense = PetitionerFormulae.Petitioner.expenses(effectiveRent, (set.expensePercentage / 100));
        var expensesSF = PetitionerFormulae.Petitioner.expensesPerSf(expense, set.petitionerLeasableSF);
        var NOI = PetitionerFormulae.Petitioner.netOperatingIncome(effectiveRent, expense);
        var OCR = PetitionerFormulae.Petitioner.overAllCapRate(parseInt(set.BCR), parseInt(set.petitionerETR));
        var VDC = PetitionerFormulae.Petitioner.valueDirectCap(OCR, NOI);
        var ValueSQFT = PetitionerFormulae.Petitioner.valuePerSqFt(VDC, set.petitionerLeasableSF);


        set.expenseSF = expensesSF;
        // set.expensePercentage = expensePercentage;
        set.NOI = NOI / set.petitionerLeasableSF;
        // set.BCR = BCR;
        set.value = VDC;
        set.valueSF = ValueSQFT;
        // set.assessedValue = assessedValue;
        set.assessedValueSF = set.assessedValue / set.petitionerLeasableSF;
        // set.petitionerLeasableSF = leaseableSqFt;
        set.petitionerMarketRentSF = set.marketRentSF;
        set.petitionerAnnualRent = annualRent;
        set.petitionerGPR = GPR;
        set.petitionerVacancyPercentage = set.vacancyPercentage;
        set.petitionerVacancy = VacancyDolar;
        set.petitionerEffectiveRent = effectiveRent;
        // set.petitionerExpensePercentage = set.expensePercentage;
        set.petitionerExpense = expense;
        set.petitionerExpenseSF = expensesSF;
        // set.petitionerOI = otherIncome;
        set.petitionerNOI = NOI;
        set.petitionerBCR = set.BCR;
        // set.petitionerETR = ETR;
        set.petitionerOCR = OCR;
        set.petitionerVDC = VDC;
        set.petitionerValueSF = ValueSQFT;
        set.petitionerNOIBySF = NOI / set.petitionerLeasableSF;
    }

    //=============================================================================================//


    function getNewSet(count) {
        var set = {
            name: 'Set ' + count,
            marketRentSF: 24,
            vacancyPercentage: 4,
            expenseSF: -10.89,
            expensePercentage: -47,
            NOI: 12.5,
            BCR: 7.000,
            value: 18867631,
            valueSF: 147,
            assessedValue: 31391491,
            assessedValueSF: 244,
            // petitioner set
            petitionerLeasableSF: 128626,
            petitionerMarketRentSF: 24,
            petitionerAnnualRent: 3087024,
            petitionerGPR: 3087024,
            petitionerVacancyPercentage: 4,
            petitionerVacancy: -123481,
            petitionerEffectiveRent: 2963543,
            petitionerExpensePercentage: -47,
            petitionerExpense: -1400000,
            petitionerExpenseSF: -10.88,
            petitionerOI: 0,
            petitionerNOI: 1810505,
            petitionerNOIBySF: 14.08,
            petitionerBCR: 7.000,
            petitionerETR: 1.2830,
            petitionerOCR: 8.2830,
            petitionerVDC: 21858082,
            petitionerValueSF: 170
        };
        return set;
    }


    //=============================================================================================//



    //====================================Modal Decisions=========================================================//

    vm.gotoValuation = function () {
        setTimeout(function () {
            $state.go('propertyValuation', {
                messageFrom: 'scenario'
            });

        }, 500);
        $('#myModalquestion').modal('toggle');

    }

    vm.numberFormatter = function (val, roundedVal) {
        var result = UtilService.numberFormatterValuation(val, roundedVal);
        return result
    };

}
