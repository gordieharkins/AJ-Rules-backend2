'use strict';

angular.module('AOTC')
    .factory('SampleCalculationService', function($http, AOTCService, $q) {

        function updateContractTerms(data) {
            
            var url = '/contracts/updateContractTerms';
            var defer = $q.defer();

            AOTCService.postDataToServer(url,data).
            then(function(result) {
                defer.resolve(result.data);
            }, function(err) {
                defer.reject(err);
            });

            return defer.promise;
        }

        



        return {
            updateContractTerms:updateContractTerms,

        };

    });