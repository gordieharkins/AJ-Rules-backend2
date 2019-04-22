'use strict';

_SampleCalculationService.$inject = ["$q", "AOTCService"];
module.exports = _SampleCalculationService;

//angular.module('AOTC')
//    .service('SampleCalculationService', _SampleCalculationService
//    );
function _SampleCalculationService($q, AOTCService) {
    var fct = [];
    var feeType = '';
    var totalFee = 0;

    function getPropertyDetails(data) {
        ////console.log(data)
        // var url = '/surveys/getSurveyById?id='+da;
        var url = '/contracts/getDataforSampleCalculations';
        var deferred = $q.defer();

        AOTCService.postDataToServer(url, data)
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                ////console.log(result);
            });
        return deferred.promise;

    };



    return {
        getPropertyDetails: getPropertyDetails
    };
}
