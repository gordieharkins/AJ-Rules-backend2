'use strict';



_Contract.$inject = ["$state", "$scope","__env","newContractService", "$stateParams", "SampleCalculationService", "PrivatePropertyService"];
module.exports = _Contract;

//angular.module('AOTC').controller('Contract', _Contract
//    );
function _Contract($state, $scope, __env, newContractService, $stateParams, SampleCalculationService, PrivatePropertyService) {

    var selectedPropertyList = PrivatePropertyService.selectedPropertyList;
    $scope.viewContractEditor = true;
    var fct = [];
    var validateData = 0;
    $scope.contractId = $stateParams.id || null;
    $scope.IsViewMode = $stateParams.id ? true : false;
    $scope.savedContract = newContractService.getContractData($scope.contractId); //currently viewed contract

    //Assigning Data to scope variables
    try {
        $scope.contractName = $scope.savedContract.contractName;
        $scope.agentName = $scope.savedContract.agentName;
    }
    catch (_e) { }



    $scope.ViewContractEditor = function () {
        $scope.viewContractEditor = true;
        $scope.viewSampleCalculations = false;
        $scope.$broadcast('someEvent', [1, 2, 3]);
    }

    $scope.ViewContractTerms = function () {
        $scope.viewContractEditor = false;
        $scope.viewSampleCalculations = false;
        $scope.$broadcast('someEvent', [1, 2, 3]);

    }
    $scope.ViewSampleCalculations = function () {
        $scope.viewContractEditor = false;
        $scope.viewSampleCalculations = true;
    }

    $scope.$on('financialAndNonFinancialTerms', function (evt, args) {

        $scope.viewContractEditor = true;
        $scope.viewSampleCalculations = false;
        $scope.$broadcast('updateDocument', []);
    });

    $scope.openContractModel = function () {
        ////console.log(SampleCalculationService.fct);
        ////console.log(SampleCalculationService.feeType);
        fct = ArrangeFinancialContracts();
        if (selectedPropertyList) {

            if ((!newContractService.dataContent)) {
                $scope.$emit('danger', 'Enter Contract Content');
            }
            else if (validateData != 1) {
                $scope.$emit('danger', 'Select Fee');

            }
            else {
                $('#newFormat').modal('toggle');
            }
        }
        else {
            $scope.$emit('danger', 'Select at least One property');

        }

    };

    $scope.saveContract = function (name, agenttName) {
        ////console.log('saved')
        saveNewContract(name, agenttName);
    }


    function saveNewContract(name, agenttName) {
        $('#preloader').css('display', 'block');
        var propIds = selectedPropertyList;
        var newContract = {
            name: name,
            content: newContractService.dataContent,
            agenttName: agenttName,
            status: 'NotStarted',
            propId: selectedPropertyList
        };

        var nfct = arrangeNfct();
        var postData = { contract: newContract, fct: fct, nfct: nfct };
        ////console.log(postData)
        newContractService.addContractTemplate(postData) //addContract
            .then(function (response) {
                ////console.log(response);
                $('#preloader').css('display', 'none');
                $('#newFormat').modal('toggle');

                if (!response.success) {
                    $scope.$emit('danger', response.message);
                    return;
                }
                $scope.content = '';
                $scope.$emit('success', response.message);
                $state.go('SavedContractList');
            }, function (err) {
                $('#preloader').css('display', 'none');
                ////console.log(err);
            });

    }

    function ArrangeFinancialContracts() {
        var percentageData = [];
        var fixedPerProperty = [];
        var fp = []
        var fixedFee = [];
        var feeType = SampleCalculationService.feeType;
        var calaculatedData = SampleCalculationService.fct;

        if (feeType != 'one') {
            angular.forEach(calaculatedData, function (value, key) {
                validateData = 1;
                ////console.log(value)
                if (value.feeType === 3) {
                    percentageData.push({ 'feeType': 'percentage', 'fee': (value.assessment.feePercent * 100).toFixed(2), 'propertyId': value.propertyId, "meritLevel": value.meritLevel });
                }
                else if (value.feeType === 4) {
                    ////console.log(value.meritLevel)
                    fp.push({ 'feeType': 'fp', 'fixedRate': value.assessment.fixedRate, "meritLevel": value.meritLevel, 'propertyId': value.propertyId })
                }
                else {
                    fixedPerProperty.push({ 'feeType': 'fixedPerProperty', 'fee': value.assessment.fixedRate, 'propertyId': value.propertyId })
                }
            });
        }
        else {
            fixedFee.push({ 'feeType': 'fixed', 'fee': SampleCalculationService.totalFee, 'propertyId': selectedPropertyList })
            validateData = 1;
        }
        if (feeType != 'one') {
            var postJson = [percentageData, fixedPerProperty, fp];
        }
        else {
            var postJson = [fixedFee];
        }
        ////console.log(postJson)
        return postJson;
    };

    function arrangeNfct() {
        var nfct = newContractService.getFinancialAndNonFinancialTerms();
        var newNfct = [];
        angular.forEach(nfct, function (data, key) {
            newNfct.push({ termName: data.label, termValue: data.value })
        })

        return newNfct;
    }


}
