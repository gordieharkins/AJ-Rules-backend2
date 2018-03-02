var _viewSampleCalculations = {
    templateUrl: 'modules/ContractModule/components/sample-calculations/sample-calculations.component.html',
    controllerAs: 'sampleCalculationsCtrl',
    controller: ["$scope", "SampleCalculationService", "$timeout", "$stateParams", "PrivatePropertyService", "newContractService",

        function ($scope, SampleCalculationService, $timeout, $stateParams, PrivatePropertyService, newContractService) {

            var vm = $scope
            var selectedPropertyList = PrivatePropertyService.selectedPropertyList;
            var originalValue = {};
            var validatedata = 0;

            vm.getPropertyList = {}
            vm.setPercentages = 0;
            vm.selectAll = false;
            vm.scheduleFee = {};
            vm.calaculatedData = [];
            vm.feeType = "three";
            vm.totalFee = 0;
            vm.styleSet = { color: 'gray', cursor: 'not-allowed' };
            vm.lockFee = '';
            vm.totalAmount = 0;
            vm.totaltaxSaving = 0;
            vm.IsViewMode = $stateParams.id ? false : true;
            vm.taxRate = 0;

            $scope.$on('contractDataByUserId-added', function () {
                //try {

                initScheduleFee();
                vm.calaculatedData = newContractService.contractDataByUserId.financialTerms;
                console.log(newContractService.contractDataByUserId);
                if (vm.calaculatedData[0].fee.feeType != "fixed") {
                    for (var i = 0; i < vm.calaculatedData.length; i++) {
                        console.log(i)
                        data = vm.calaculatedData[i];
                        data.assessment.valueReduction1 = data.assessment.newAssessorValue[0] - data.assessment.postAppeal1[0];
                        data.assessment.valueReduction2 = data.assessment.postAppeal1[0] - data.assessment.postAppeal2[0];
                        data.assessment.valueReduction = data.assessment.newAssessorValue[0] - data.assessment.postAppeal2[0];

                        if (data.fee.feeType === 'fixedPerProperty') {
                            data.assessment.fee = data.fee.fee;
                            data.assessment.feePercent = data.assessment.fee / data.assessment.valueReduction * data.assessment.taxRate[0] / 100;
                            vm.totalAmount += data.assessment.fee;
                            vm.totalWeightage += (data.assessment.feePercent * 100);
                            vm.totaltaxSaving += data.assessment.valueReduction * (data.assessment.taxRate[0] / 100)
                            data.assessment.fixedRate = data.fee.fee;
                        }
                        else if (data.fee.feeType === 'percentage') {
                            console.log(data)
                            var appealMerit1 = data.fee.meritLevel[0] / 100;
                            var appealMerit2 = data.fee.meritLevel[1] / 100;
                            var level1 = data.assessment.valueReduction1 * appealMerit1 * (data.assessment.taxRate[0] / 100);
                            var level2 = data.assessment.valueReduction2 * appealMerit2 * (data.assessment.taxRate[0] / 100);
                            data.assessment.feePercent = 0;
                            data.assessment.fee = level1 + level2;
                            data.assessment.feePercent = data.assessment.fee / (data.assessment.valueReduction * (data.assessment.taxRate[0] / 100));
                            console.log(data.assessment.feePercent)
                            vm.totalAmount += data.assessment.fee;
                            data.assessment.fixedRate = 0;
                            vm.totaltaxSaving += data.assessment.valueReduction * (data.assessment.taxRate[0] / 100)


                        }
                        else if (data.fee.feeType === 'fp') {
                            console.log(data)
                            data.assessment.valueReduction1 = data.assessment.newAssessorValue[0] - data.assessment.postAppeal1[0];
                            data.assessment.valueReduction2 = data.assessment.postAppeal1[0] - data.assessment.postAppeal2[0];
                            data.assessment.valueReduction = data.assessment.newAssessorValue[0] - data.assessment.postAppeal2[0];
                            var appealMerit1 = data.fee.meritLevel[0] / 100;
                            var appealMerit2 = data.fee.meritLevel[1] / 100;
                            var level1 = data.assessment.valueReduction1 * appealMerit1 * data.assessment.taxRate[0] / 100;
                            var level2 = data.assessment.valueReduction2 * appealMerit2 * data.assessment.taxRate[0] / 100;
                            data.assessment.fixedRate = data.fee.fixedRate;
                            data.assessment.fee = level1 + level2;
                            data.assessment.fee += data.assessment.fixedRate;
                            data.assessment.feePercent = (data.assessment.fee) / (data.assessment.valueReduction * (data.assessment.taxRate[0] / 100));
                            data.disabled = true;
                            data.feeType = 4;
                            console.log(data.assessment.fixedRate);
                            vm.totalAmount += data.assessment.fee;
                            vm.totaltaxSaving += data.assessment.valueReduction * (data.assessment.taxRate[0] / 100)

                        }
                    }
                }
                else {
                    vm.fixedFeeData = vm.calaculatedData[0].fee
                    console.log(vm.fixedFeeData)
                }
            });




            SampleCalculationService.fct = vm.calaculatedData;
            SampleCalculationService.feeType = vm.feeType;
            SampleCalculationService.totalFee = vm.totalFee;


            vm.selectAllProperties = function () {
                var check = vm.selectAll;
                if (check) {
                    check = true;
                    var root = vm.getPropertyList.map(function (item, index) {
                        if (!item.disabled) {
                            item.check = true;
                            return item;
                        }
                    });
                }
                else {
                    check = false;
                    var root = vm.getPropertyList.map(function (item, index) {
                        if (!item.disabled) {
                            item.check = false;
                            return item;
                        }
                    })
                }
            };

            vm.selectSepicific = function (data) {
                if (!data.check) {
                    data.check = false;
                }
                else {
                    data.check = true;
                }
            };

            vm.calculateSampleData = function () {
                var data = vm.getPropertyList;

                if (vm.feeType === 'three') {
                    clientContengancyFee(data);
                    vm.lockFee = 'two';
                }
                else if (vm.feeType === 'two') {
                    fixedPerProperty(data);
                    vm.lockFee = 'two';

                }
                else if (vm.feeType === 'four') {
                    both(data);
                    vm.lockFee = 'two';

                }
                else {
                    vm.lockFee = 'one';
                    vm.calaculatedData = [];
                    var root = vm.getPropertyList.map(function (item, index) {
                        if (!item.disabled) {
                            validatedata = 1;
                            item.check = true;
                            item.disabled = true;
                            return item;
                        }
                    });
                }

            };

            vm.selectFeeType = function (value) {
                vm.feeType = value;
                SampleCalculationService.feeType = vm.feeType;

            };

            vm.totalFeeChange = function (data) {
                vm.totalFee = data;
                SampleCalculationService.totalFee = vm.totalFee;

            };

            vm.ResetDatSet = function () {
                vm.selectAll = false;
                vm.calaculatedData = [];
                vm.getPropertyList = {};
                vm.getPropertyList = angular.copy(originalValue);
                vm.feeType = "three";
                vm.lockFee = '';
                vm.totalAmount = 0;
                vm.totaltaxSaving = 0;
            };

            vm.postData = function () {

            };


            getPropertyDetails();
            initScheduleFee();

            function getPropertyDetails() {
                var data = { propIds: selectedPropertyList, year: 2017 };
                SampleCalculationService.getPropertyDetails(data)
                    .then(function (result) {
                        originalValue = angular.copy(result.data.result);
                        vm.getPropertyList = result.data.result;
                        

                        $("#preloader").css("display", "none");

                    }, function (result) {
                        console.log(result);
                        $("#preloader").css("display", "none");
                    });
            }

            function initScheduleFee() {
                vm.scheduleFee = {
                    poor: { level1: 25, level2: 25, level3: 25 },
                    good: { level1: 15, level2: 20, level3: 25 },
                    vgood: { level1: 10, level2: 15, level3: 20 }
                };
            }

            function selectFee(merit, level) {
                var fee = vm.scheduleFee;
                return fee[merit][level] / 100;
            }

            function fixedCalculation(data) {

            }

            function fixedPerProperty(data) {
                angular.forEach(data, function (value, key) {
                    if (!value.disabled && value.check) {
                        validatedata = 1;
                        value.assessment.valueReduction1 = value.assessment.newAssessorValue[0] - value.assessment.postAppeal1[0];
                        value.assessment.valueReduction2 = value.assessment.postAppeal1[0] - value.assessment.postAppeal2[0];
                        value.assessment.valueReduction = value.assessment.newAssessorValue[0] - value.assessment.postAppeal2[0];
                        value.assessment.fee = value.assessment.fixedRate;
                        value.assessment.feePercent = value.assessment.fee / (value.assessment.valueReduction * (value.assessment.taxRate[0] / 100));
                        console.log(value.assessment.feePercent)
                        value.disabled = true;
                        value.feeType = 2;
                        vm.totalAmount += value.assessment.fee;
                        vm.totaltaxSaving += value.assessment.valueReduction * (value.assessment.taxRate[0] / 100);
                        vm.taxRate = value.assessment.taxRate[0];
                        vm.calaculatedData.push(value);

                        console.log(vm.totaltaxSaving)
                    }
                });
            }

            function clientContengancyFee(data) {
                angular.forEach(data, function (value, key) {
                    if (!value.disabled && value.check) {
                        validatedata = 1;
                        value.meritLevel = addMerit(value.assessment.appealMerit[0]);
                        console.log(value.meritLevel)
                        value.assessment.valueReduction1 = value.assessment.newAssessorValue[0] - value.assessment.postAppeal1[0];
                        value.assessment.valueReduction2 = value.assessment.postAppeal1[0] - value.assessment.postAppeal2[0];
                        value.assessment.valueReduction = value.assessment.newAssessorValue[0] - value.assessment.postAppeal2[0];
                        var appealMerit1 = selectFee(value.assessment.appealMerit[0], "level1");
                        var appealMerit2 = selectFee(value.assessment.appealMerit[0], "level2");
                        value.assessment.fixedRate = 0;
                        var level1 = value.assessment.valueReduction1 * appealMerit1 * (value.assessment.taxRate[0] / 100);
                        var level2 = value.assessment.valueReduction2 * appealMerit2 * (value.assessment.taxRate[0] / 100);
                        value.assessment.fee = level1 + level2;
                        value.assessment.feePercent = (value.assessment.fee) / (value.assessment.valueReduction * (value.assessment.taxRate[0] / 100));
                        console.log(value.assessment.feePercent)
                        value.disabled = true;
                        value.feeType = 3;
                        vm.totalAmount += value.assessment.fee;
                        vm.totaltaxSaving += value.assessment.valueReduction * (value.assessment.taxRate[0] / 100);
                        vm.calaculatedData.push(value);
                    }
                });
            }

            function both(data) {
                angular.forEach(data, function (value, key) {
                    if (!value.disabled && value.check) {
                        validatedata = 1;

                        value.meritLevel = addMerit(value.assessment.appealMerit[0]);
                        console.log(value)
                        value.assessment.valueReduction1 = value.assessment.newAssessorValue[0] - value.assessment.postAppeal1[0];
                        value.assessment.valueReduction2 = value.assessment.postAppeal1[0] - value.assessment.postAppeal2[0];
                        value.assessment.valueReduction = value.assessment.newAssessorValue[0] - value.assessment.postAppeal2[0];
                        var appealMerit1 = selectFee(value.assessment.appealMerit[0], "level1");
                        var appealMerit2 = selectFee(value.assessment.appealMerit[0], "level2");
                        var level1 = value.assessment.valueReduction1 * appealMerit1 * value.assessment.taxRate[0] / 100;
                        var level2 = value.assessment.valueReduction2 * appealMerit2 * value.assessment.taxRate[0] / 100;
                        value.assessment.fixedRate = value.assessment.fixedRate;
                        value.assessment.fee = level1 + level2;
                        value.assessment.fee += value.assessment.fixedRate;
                        value.assessment.feePercent = (value.assessment.fee) / (value.assessment.valueReduction * (value.assessment.taxRate[0] / 100));
                        value.disabled = true;
                        value.feeType = 4;
                        console.log(value.assessment.fixedRate);
                        vm.totalAmount += value.assessment.fee;
                        vm.totaltaxSaving += value.assessment.valueReduction * (value.assessment.taxRate[0] / 100);
                        vm.calaculatedData.push(value);
                    }
                });

            }

            function addMerit(data) {
                console.log(data)
                if (data === 'poor') {
                    return [vm.scheduleFee.poor.level1, vm.scheduleFee.poor.level2, vm.scheduleFee.poor.level3]
                }

                else if (data === 'vgood') {
                    return [vm.scheduleFee.vgood.level1, vm.scheduleFee.vgood.level3, vm.scheduleFee.vgood.level3]

                }
                else {
                    return good = [vm.scheduleFee.good.level1, vm.scheduleFee.good.level2, vm.scheduleFee.good.level3]

                }

            };

            function selectedCriteria(data, level) {
                if (data.meritLevel === 'good') {

                    return data[data.meritLevel][level]

                }
                else if (data.meritLevel === 'vgood') {
                    return data[data.meritLevel][level]

                }
                else {
                    return data[data.meritLevel][level]

                }

            }


            function getFinancialTerms() {
                $scope.financialTerms = [];

                $('#preloader').css('display', 'block');
                newContractTermsService.getContractTerms()
                    .then(function (response) {
                        $('#preloader').css('display', 'none');
                        console.log(response);
                        if (!response.success) {
                            return;
                        }
                        var terms = response.result;
                        $scope.financialTerms = terms;
                        console.log(terms)
                        for (var i = 0; i < terms.length; i++) {

                            if (terms[i].type == 'fc') {
                                $scope.financialTerms.push(terms[i])
                            }
                        }

                    }, function (err) {
                        $('#preloader').css('display', 'none');
                        console.log(err);
                    });
            }


        }]
}

module.exports = _viewSampleCalculations;

//angular
//    .module('AOTC')
//    .component('viewSampleCalculations', _viewSampleCalculations
//   );

