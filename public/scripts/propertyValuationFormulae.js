module.exports = PropertyValuationFormulae;

// Class Constructor
function PropertyValuationFormulae() {

}

PropertyValuationFormulae.prototype.annualRent = function(leaseableSqFt, marketRent) {
	var annualRent = leaseableSqFt * marketRent;
	return annualRent;
}

PropertyValuationFormulae.prototype.vacancy = function(grossPotentialRent, vacancypercent) {
	var annualRent = grossPotentialRent * vacancypercent;
	return annualRent;
}

PropertyValuationFormulae.prototype.effectiveRent = function(annualRent, vacancypercent) {
	var effectiveRent = annualRent - vacancypercent;
	return effectiveRent;
}

PropertyValuationFormulae.prototype.expenses = function(effectiveRent, expensesPercent) {
	var expenses = effectiveRent * expensesPercent;
	return expenses;
}

PropertyValuationFormulae.prototype.expensesPerSf = function(expenses, sqFt) {
	var expensesPerSf = expenses / sqFt;
	return expensesPerSf;
}

PropertyValuationFormulae.prototype.netOperatingIncome = function(effectiveRent, expenses) {
	var netOperatingIncome = effectiveRent - expenses;
	return netOperatingIncome;
}

PropertyValuationFormulae.prototype.overAllCapRate = function(baseCapRate, effectiveTaxRate) {
	var overAllCapRate = baseCapRate + effectiveTaxRate;
	return overAllCapRate;
}

PropertyValuationFormulae.prototype.valueDirectCap = function(overAllCapRate, netOperatingIncome) {
	var valueDirectCap = baseCapRate + effectiveTaxRate;
	return valueDirectCap;
}

PropertyValuationFormulae.prototype.valuePerSqFt = function(valueDirectCap, leaseableSqFt) {
	var valuePerSqFt = valueDirectCap / leaseableSqFt;
	return valuePerSqFt;
}

PropertyValuationFormulae.prototype.vdcPostDeduction = function(valueDirectCap, totalDeductionAddition) {
	var vdcPostDeduction = valueDirectCap - totalDeductionAddition;
	return vdcPostDeduction;
}

PropertyValuationFormulae.prototype.vdcPostDeductionPerSF = function(vdcPostDeduction, totalDeductionAddition) {
	var vdcPostDeduction = valueDirectCap / leaseableSqFt;
	return vdcPostDeduction;
}
