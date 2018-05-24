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
    $scope.openSign = false;
    $scope.uploadModal = false;


    function getPropertyDetails()  {
   
    var url = '/appeal/getPropertyTimelineData';
    var postData = {"appealYear":2018, "userId": 9922606}
    $("#preloader").css("display", "block");
    
    AOTCService.postDataToServer(url, postData)
        .then(function (result) {
            $("#preloader").css("display", "none");
              console.log(result.data)
              $scope.data = result.data.result
              $scope.staticTable(1);

            }, function (result) {
            //some error
            ////console.log(result);
            $("#preloader").css("display", "none");
        });
    }
    getPropertyDetails();

    $scope.staticTable = function(pindex){
        console.log(pindex)
         $(document).ready(function() {
                $('.JStableOuter table').scroll(function(e) {
              
                  $('.JStableOuter thead').css("left", -$(".JStableOuter tbody").scrollLeft());
                  $('.JStableOuter thead th:nth-child(1)').css("left", $(".JStableOuter table").scrollLeft() -0 );
                  $('.JStableOuter tbody td:nth-child(1)').css("left", $(".JStableOuter table").scrollLeft());
              
                  $('.JStableOuter thead').css("top", -$(".JStableOuter tbody").scrollTop());
                  $('.JStableOuter thead tr th').css("top", $(".JStableOuter table").scrollTop());
              
                });
              });
            }
    
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
       
        if ('warning' in state && state.warning)
            {
           

                return 'red-note';
                
            }
            
        else  return 'blue-note';
    }

    $scope.openModal = function(data, i){
        // $scope.modalData = null;\
 
        if(data.buttonText=='Details') {
            $scope.showModal = true;
            $scope.modalData = data;

        } else if (data.buttonText=='Schedule Review') {

        } else if (data.buttonText=='Execute Signature') {
            $scope.openSign = true;
        }
        
        console.log(data)
    }

    $scope.signModal = function(type){
        type==1 ? $scope.uploadModal = true : $scope.uploadModal = false ;

    }

    $scope.closeModal = function(){
        $scope.showModal = false;
        $scope.openSign = false;
     
        console.log('hide')
    }

     $scope.changeComp = function(event,column,pColumn) {
        $scope.subData = null;
        var jProperty =  $scope.data.jurisdictions[pColumn].properties;
        var jName = $scope.data.jurisdictions[pColumn].name
        var extractSubEvents = [];
        for (var i  = 0 ; i  < jProperty.length;i++) {
            var subEvents = jProperty[i].events[column].subEvents
            extractSubEvents.push({fcolName : jProperty[i].name, fcolOwnerName : jProperty[i].ownerName, subEvents: subEvents})
        }
        console.log(extractSubEvents)

        $scope.subData = {data: $scope.data, prop: extractSubEvents,jName: jName};
        console.log($scope.subData)
        
        $scope.show =  false;
        // $scope.staticTable(0);
    }

    $scope.uplaodFile = function(file) {
          console.log(file.files)
    }

    $scope.switchMode = function(){
        $scope.subData = null;
        $scope.show =  true;
        console.log('show class')
    }
 
}