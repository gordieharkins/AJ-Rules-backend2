'use strict';




var _contractTerms = {
    templateUrl: 'modules/ContractModule/components/contract-terms/contract-terms.html',
    controllerAs: 'ContractTerms',
    controller: ["$scope", "newContractService", "newContractTermsService", "$timeout", "$stateParams", "$rootScope", controllerFunction]
    //end of component
};
//angular.module('AOTC')
//    .component('contractTerms', _contractTerms);

module.exports = _contractTerms;
function controllerFunction($scope, newContractService, newContractTermsService, $timeout, $stateParams, $rootScope) {
    //console.log('contract-terms component');

    $scope.financialAndNonFinancialTerms = [];
    $scope.financialTermsAdded = [];
    $scope.financialTerms = [];
    $scope.nonFinancialTerms = [];
    $scope.preAppealValue = 16100000 * 0.01980;
    $scope.postAppealValue = 15761567 * 0.01980;

    $scope.contractId = $stateParams.id || null;
    $scope.IsViewMode = $stateParams.id ? true : false;

    $scope.preAppealValue = parseFloat($scope.preAppealValue).toFixed(2);
    $scope.postAppealValue = parseFloat($scope.postAppealValue).toFixed(2);

    $scope.netTaxSavingsGlobal = parseFloat($scope.preAppealValue - $scope.postAppealValue).toFixed(2);

    $scope.$on('contractDataByUserId-added', function () {
        try {

            $scope.financialAndNonFinancialTerms = newContractService.contractDataByUserId.nonFinancialTerms;
        }
        catch (_e) { }
    });



    getFinancialTerms();

    function getFinancialTerms() {
        $scope.financialTerms = [];
        $scope.nonFinancialTerms = [];
        $('#preloader').css('display', 'block');
        newContractTermsService.getContractTerms()
            .then(function (response) {
                $('#preloader').css('display', 'none');
                //console.log(response);
                if (!response.success) {
                    return;
                }
                var terms = response.result;

                for (var i = 0; i < terms.length; i++) {

                    if (terms[i].type == 'fc') {
                        $scope.financialTerms.push(terms[i])
                    } else if (terms[i].type == 'nfc') {
                        $scope.nonFinancialTerms.push(terms[i])
                    }
                }

            }, function (err) {
                $('#preloader').css('display', 'none');
                //console.log(err);
            });
    }

    $scope.AcceptTerms = function () {
        newContractService.setFinancialAndNonFinancialTerms($scope.financialAndNonFinancialTerms);
        $scope.$emit('financialAndNonFinancialTerms', []);
    }


    $scope.addTerm = function (term, type) {

        if (!term.state) {

            for (var i = 0; i < $scope.financialAndNonFinancialTerms.length; i++) {
                if ($scope.financialAndNonFinancialTerms[i].label == term.label) {
                    $scope.financialAndNonFinancialTerms.splice(i, 1);
                }
            }

            for (var i = 0; i < $scope.financialTermsAdded.length; i++) {
                if ($scope.financialTermsAdded[i].label == term.label) {
                    $scope.financialTermsAdded.splice(i, 1);
                    calculateTotalFee();
                }
            }

        } else {

            $scope.financialAndNonFinancialTerms.push(angular.copy(term));
            if (type == 'financialTerms') {
                term.rowspan = 1;

                if (term.hasLevels) {
                    term.rowspan = term.value.length + 1;
                }

                $scope.CalculateFee(term);
                $scope.financialTermsAdded.push(angular.copy(term));
                calculateTotalFee();
            }

        }

    }


    // $scope.parseJson = function(financialTerm) {

    //     if ( !financialTerm.columns.feePercentage && !financialTerm.columns.netTaxSavings)
    //         financialTerm.calculatedFee = parseInt(financialTerm.value.match(/\d/g).join(""));

    //      // if (!financialTerm.columns.numberOfProperties && !financialTerm.columns.feePercentage && !financialTerm.columns.netTaxSavings)
    //      //    financialTerm.calculatedFee = parseInt(financialTerm.value.match(/\d/g).join(""));

    //     calculateTotalFee();
    // }

    $scope.submitAddUpdateTerm = function (term) {
        if ($scope.addingNewTerm) {
            addNewTerm(term)
        } else {
            updateTerm(term)
        }
    }

    $scope.addingNewTerm = false;

    $scope.showUpdateTerm = function (term) {
        $scope.addingNewTerm = false;

        $scope.newTerm = term;
        try {
            $scope.newTerm.columns = JSON.parse($scope.newTerm.columns);

        } catch (ex) {
            // //console.log('already parsed')
        }
        //console.log($scope.newTerm);
        $scope.numberOfLevels = 0;
        if ($scope.newTerm.hasLevels) {
            $scope.numberOfLevels = $scope.newTerm.value.length;
        }

        if (term.type == 'nfc') {
            $scope.newTermLabel = 'Update Non-Financial Contract Term';


        }
        if (term.type == 'fc') {
            $scope.newTermLabel = 'Update Financial Contract Term';

        }
        $('#newTerm').modal('toggle');

    }


    function updateTerm(term) {
        // newTerm.columns = JSON.stringify(newTerm.columns);

        var newTerm = angular.copy(term);
        newTerm.columns = JSON.stringify(newTerm.columns);
        if (newTerm.hasLevels)
            newTerm.value = JSON.stringify(newTerm.value);




        $('#preloader').css('display', 'block');
        newContractTermsService.updateContractTerms(newTerm)
            .then(function (response) {
                $('#preloader').css('display', 'none');
                //console.log(response);
                if (!response.success) {
                    $scope.$emit('danger', response.message);
                    return;
                }
                $scope.$emit('success', response.message);
                $('#newTerm').modal('toggle');
                getFinancialTerms();



            }, function (err) {
                $('#preloader').css('display', 'none');
                //console.log(err);
            });

    }


    $scope.NumberOfLevels = function (newTerm, numberOflevels) {

        if (newTerm.value.constructor != Array)
            newTerm.value = [];

        var existingLevels = newTerm.value.length;

        if (existingLevels < numberOflevels) {
            for (var i = 0; i < numberOflevels - existingLevels; i++) {
                newTerm.value.push({
                    label: '',
                    value: ''
                });
            }
        } else {
            newTerm.value.splice(numberOflevels, newTerm.value.length)
        }
    }


    $scope.defaultLevelNumbers = function (newTerm) {
        newTerm.value = '';

        if (newTerm.hasLevels) {
            newTerm.value = [];
        }
    }

    $scope.showAddTermModal = function (termType) {
        $scope.addingNewTerm = true;
        $scope.numberOfLevels = 0;

        // $scope.newTerm = {
        //     label: '',
        //     value: '',
        //     hasLevels: false,
        //     type: termType,
        //     columns: {
        //         numberOfProperties: false,
        //         feePercentage: false,
        //         netTaxSavings: false
        //     }
        // };


        $scope.newTerm = {
            label: '',
            value: '',
            hasLevels: false,
            type: termType,
            columns: {
                feePercentage: false,
                netTaxSavings: false
            }
        };


        if (termType == 'nfc') {
            $scope.newTermLabel = 'New Non-Financial Contract Term';


        }
        if (termType == 'fc') {
            $scope.newTermLabel = 'New Financial Contract Term';

        }
        $('#newTerm').modal('toggle');
    }

    function addNewTerm(term) {

        var newTerm = angular.copy(term);
        newTerm.columns = JSON.stringify(newTerm.columns);
        if (newTerm.hasLevels)
            newTerm.value = JSON.stringify(newTerm.value);


        // //console.log(newTerm)

        $('#preloader').css('display', 'block');
        newContractTermsService.addContractTerms(newTerm)
            .then(function (response) {

                $('#preloader').css('display', 'none');
                //console.log(response);
                if (!response.success) {
                    $scope.$emit('danger', response.message);
                    return;
                }
                $scope.$emit('success', response.message);
                $('#newTerm').modal('toggle');
                getFinancialTerms();

            }, function (err) {
                $('#preloader').css('display', 'none');
                //console.log(err);
            });

    }



    $scope.removeFinancialTerm = function (index) {
        $scope.financialTermsAdded.splice(index, 1);
        calculateTotalFee();
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    $scope.CalculateFee = function (financialTerm) {
        //console.log(financialTerm)

        if (financialTerm.hasLevels) {

            for (var i = 0; i < financialTerm.value.length; i++) {
                var result = 1;
                var level = financialTerm.value[i];
                var value = parseInt(level.value.match(/\d/g).join(""));

                if (!isNumeric(value))
                    value = 1;


                if (!isNumeric(netTax))
                    netTax = 1;


                if (financialTerm.columns.feePercentage) {
                    result = result * (value / 100);
                }

                if (financialTerm.columns.netTaxSavings) {
                    result = result * $scope.netTaxSavingsGlobal;
                }


                financialTerm.value[i].calculatedFee = parseFloat(result).toFixed(2);
            }

        } else {
            var result = 1;

            var value = parseInt(financialTerm.value.match(/\d/g).join(""));
            var netTax = parseInt(financialTerm.netTax);



            if (!isNumeric(value))
                value = 1;

            if (!isNumeric(netTax))
                netTax = 1;


            if (financialTerm.columns.feePercentage) {
                result = result * (value / 100);
            }

            if (financialTerm.columns.netTaxSavings) {
                result = result * $scope.netTaxSavingsGlobal;
            }


            financialTerm.calculatedFee = result;

            if (!financialTerm.columns.feePercentage && !financialTerm.columns.netTaxSavings)
                financialTerm.calculatedFee = value;

            // if(!financialTerm.columns.feePercentage && !financialTerm.columns.netTaxSavings && financialTerm.columns.numberOfProperties)
            // financialTerm.calculatedFee = value*numberOfProperties;


        }

    }

    $scope.totalFee = 0;

    function calculateTotalFee() {
        $scope.totalFee = 0;
        for (var i = 0; i < $scope.financialTermsAdded.length; i++) {

            // if (isNumeric($scope.financialTermsAdded[i].calculatedFee)) {
            // $scope.totalFee += $scope.financialTermsAdded[i].calculatedFee;
            // }

            if ($scope.financialTermsAdded[i].hasLevels) {

                for (var k = 0; k < $scope.financialTermsAdded[i].value.length; k++) {
                    //console.log($scope.financialTermsAdded[i]);
                    $scope.totalFee += parseFloat($scope.financialTermsAdded[i].value[k].calculatedFee);

                    // if (isNumeric($scope.financialTermsAdded[i].value[k].calculatedFee)) {
                    //     $scope.totalFee += $scope.financialTermsAdded[i].value[k].calculatedFee;
                    // }
                }

            }
            else {
                $scope.totalFee += $scope.financialTermsAdded[i].calculatedFee;
            }
        }


        $scope.totalFee = parseFloat($scope.totalFee).toFixed(2);

    }


}