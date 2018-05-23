'use strict';

_taxAppeal.$inject = ["UtilService", "$stateParams", "$anchorScroll","$state", "DTOptionsBuilder", "DTColumnDefBuilder", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _taxAppeal;

//angular.module('AOTC')
//    .controller('updateIERR', _updateIERR
//    );
function _taxAppeal(UtilService, $stateParams, $anchorScroll, $state, DTOptionsBuilder, DTColumnDefBuilder, $location, $scope, $http, __env, $log, AOTCService, $timeout) {
    var vm = this;
    
    $scope.data = null; 
    $scope.subData = null;
    $scope.show = true;
    $scope.showModal = false;

  


    function getPropertyDetails()  {
   
    var url = '/appeal/getPropertyTimelineData';
    var postData = {"appealYear":2018, "userId": 9922606}
    $("#preloader").css("display", "block");
    
    AOTCService.postDataToServer(url, postData)
        .then(function (result) {
            $("#preloader").css("display", "none");
              console.log(result.data)
              $scope.data = result.data.result
       

            }, function (result) {
            //some error
            ////console.log(result);
            $("#preloader").css("display", "none");
        });
    }
    getPropertyDetails();
    
    $scope.checkMessage = function(type){
       
       var condition = {'not-started': type=='Not Started' || !type,'done': type=='Done',
        'applicable': type=='Not applicable','in-progress': type=='In Progress',
      }
    
        return condition;
    }

    $scope.setWarning = function(notification) {
        if ('type' in notification) return notification['type'] == 'warning' ? 'red-card' : 'blue-card';
        else return 'blue-card'
    }

    $scope.buttonComp = function(state) {
        if ('warning' in state && state.warning)  return 'red-button';
        else if ('flag' in state && state.flag==false)  return 'disable-button'
        else return 'blue-button';
     }

    $scope.noteComp = function(state) {
        console.log('note',state)
      
        if ('warning' in state && state.warning)
            {
                console.log('red') 

                return 'red-note';
                
            }
            
        else  return 'blue-note';
    }

    $scope.openModal = function(data, i){
        // $scope.modalData = null;\
        $("#myNotificationModal").modal('hide');
        $scope.showModal = true;
        $scope.modalData = data;
        console.log(i)
    }

    $scope.closeModal = function(){
        $scope.showModal = false;
     
        console.log('hide')
    }

     $scope.changeComp = function(event) {
        $scope.subData = null;
        $scope.subData = {data: $scope.data, prop: event.subEvents};
        console.log($scope.subData)
        $scope.show =  false;
    }
 
}