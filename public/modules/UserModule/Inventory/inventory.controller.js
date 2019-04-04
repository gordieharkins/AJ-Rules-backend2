'use strict';

_Inventory.$inject = ["$state","$location", "$scope", "AOTCService"];
module.exports = _Inventory;


function _Inventory($state, $scope, $location, AOTCService) {
    ////////console.log("UserRegistration controller");
    var vm = this;
    vm.properties = null
    vm.year ='2012'

    getInventoryIE();


    function getInventoryIE() {
        var url = '/properties/getFileStatusIE';
        var sendData = {id: '9916454'}
        $('#preloader').css("display", "block");

        AOTCService.postDataToServer(url, sendData)
            .then(function successCallback(response) {
                $('#preloader').css("display", "none");
                var serverData = response.data;
                if (serverData.success) {
                    vm.properties = serverData.result
                    //console.log( vm.properties)
                    angular.forEach(vm.properties, function(value,key){
                        //console.log(value,key)
                    })

                } else {
                    $scope.$emit('danger', serverData.message);
                }

            }, function errorCallback(response) {
                $('#preloader').css("display", "none");
            });
        //return defer.promise;
    }

}
