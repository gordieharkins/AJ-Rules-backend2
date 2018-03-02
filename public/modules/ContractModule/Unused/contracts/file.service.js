'use strict';

angular.module('AOTC')
    .factory('newContractService', function($http, AOTCService, $q) {



        function getContracts() {
            var url = '/contracts/getContracts';
            var defer = $q.defer();

            AOTCService.getDataFromServer(url).
            then(function(result) {
                defer.resolve(result.data);
            }, function(err) {
                defer.reject(err);
            });

            return defer.promise;
        }


        function uploadContractsFiles(files) {

            var url = '/contracts/uploadContracts';

            var defer = $q.defer();
            AOTCService.uploadFiles(url, files).
            then(function(result) {
                defer.resolve(result);
            }, function(err) {
                defer.reject(err);
            });

            return defer.promise;
        }

        function addContractTemplate(data) {
            
            var url = '/contracts/addContractTemplate';
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
            getContracts: getContracts,
            uploadContractsFiles: uploadContractsFiles,
            addContractTemplate:addContractTemplate

        };

    });