'use strict';

_PetitionerFormulae.$inject = [];
module.exports = _PetitionerFormulae;

//angular.module('AOTC')
//    .service('PetitionerFormulae', _PetitionerFormulae
//    );
function _PetitionerFormulae() {

    var formula1 = function (val1) {
        //////console.log(val1);
    };

    var Petitioner = {};

    Petitioner.expensesDolar = function (leaseableSqFt, expensePerSFPetitioner) {
        var expensesDolar = leaseableSqFt * expensePerSFPetitioner;
        // //////console.log(leaseableSqFt, marketRent);
        return expensesDolar;
    };

    Petitioner.expensesPercentage = function (expensesDolar, effectiveRent) {
        var expensesPercentage = expensesDolar / effectiveRent;
        return expensesPercentage;
    };


    Petitioner.annualRent = function (leaseableSqFt, marketRent) {
        var annualRent = leaseableSqFt * marketRent;
        //////console.log(leaseableSqFt, marketRent);
        return annualRent;
    };

    Petitioner.vacancy = function (grossPotentialRent, vacancypercent) {
        var annualRent = grossPotentialRent * vacancypercent;
        return annualRent;
    };

    Petitioner.effectiveRent = function (annualRent, vacancypercent) {
        var effectiveRent = annualRent - vacancypercent;
        return effectiveRent;
    };

    Petitioner.expenses = function (effectiveRent, expensesPercent) {
        var expenses = effectiveRent * expensesPercent;
        return expenses;
    };

    Petitioner.expensesPerSf = function (expenses, sqFt) {
        var expensesPerSf = expenses / sqFt;
        return expensesPerSf;
    };

    Petitioner.netOperatingIncome = function (effectiveRent, expenses) {
        var netOperatingIncome = effectiveRent - expenses;
        return netOperatingIncome;
    };

    Petitioner.overAllCapRate = function (baseCapRate, effectiveTaxRate) {
        var overAllCapRate = baseCapRate + effectiveTaxRate;
        return overAllCapRate;
    };

    Petitioner.valueDirectCap = function (OCR, NOI) {
        var valueDirectCap = NOI / OCR;
        return valueDirectCap;
    };

    Petitioner.valuePerSqFt = function (valueDirectCap, leaseableSqFt) {
        var valuePerSqFt = valueDirectCap / leaseableSqFt;
        return valuePerSqFt;
    };


    Petitioner.vdcPostDeduction = function (valueDirectCap, totalDeductionAddition) {
        var vdcPostDeduction = valueDirectCap - totalDeductionAddition;
        return vdcPostDeduction;
    };

    Petitioner.vdcPostDeductionPerSF = function (vdcPostDeduction, leaseableSqFt) {
        var vdcPostDeductionPerSF = vdcPostDeduction / leaseableSqFt;
        return vdcPostDeductionPerSF;
    };

    //takes array and sort it only applicable for selected and all evidences
    function sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x;
            var y;
            if (a.properties[key] && b.properties[key]) {
                x = a.properties[key].toLowerCase();
                y = b.properties[key].toLowerCase();
            }
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };

    function sortArrayByKey(array, key) {

        return array.sort(function (fristObjArr, secondObjArr) {
            var x;
            var y;
            var ob1;
            var ob2;
            if (fristObjArr.properties[key])
                ob1 = fristObjArr.properties[key][1];

            if (secondObjArr.properties[key])
                ob2 = secondObjArr.properties[key][1];

            if (ob1 && ob2) {
                x = ob1.toLowerCase();
                y = ob2.toLowerCase();
            }
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };


    return {
        Petitioner: Petitioner,
        sortArrayByKey: sortArrayByKey,
        sortByKey: sortByKey
    };

}
