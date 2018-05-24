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
    $scope.uploadRadio = null;
    $scope.uploadModal = false;
    var configId = {property: null, event: null}
    var configData = {data:null,eventIndex:null};
    var subEventsDetect = null;
    var sendFile = null;


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

    $scope.openModal = function(data, prop,subEventIndex){
        // $scope.modalData = null;\
 
        
        configId.property = prop.propertyId;
        configId.event =    prop.eventId;
        configData.data = prop;
        configData.subEventIndex = subEventIndex;
        console.log(configData)
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
         if(event.subEvents.sublength==0) {
             return
         }
        $scope.subData = null;
        var jProperty =  $scope.data.jurisdictions[pColumn].properties;
        var jName = $scope.data.jurisdictions[pColumn].name
        subEventsDetect = {event: event, cloumn: column, pColumn: pColumn} 
        var extractSubEvents = [];
        for (var i  = 0 ; i  < jProperty.length;i++) {
            var subEvents = jProperty[i].events[column].subEvents;
            var eventId = jProperty[i].events[column].eventId;
            var index = i;
             extractSubEvents.push({fcolName : jProperty[i].name, fcolOwnerName : jProperty[i].ownerName,
                 subEvents: subEvents,propertyId  : jProperty[i].id, eventId:  eventId, 
                 info: subEventsDetect, propertyIndex: index, eventIndex: column})
        }
        console.log(extractSubEvents)

        $scope.subData = {data: $scope.data, prop: extractSubEvents,jName: jName};
        console.log($scope.subData)
        
        $scope.show =  false;
        // $scope.staticTable(0);
    }

    $scope.uplaodFile = function(file) {
          console.log(file.files)
          var files = file.files;
          var FileNames = [];
          var selected  = 0;
          sendFile = files
          
    }

    $scope.switchMode = function(){
        $scope.subData = null;
        $scope.show =  true;
        console.log('show class')
      
    }

    function UpdateData(){
        // 
        $timeout( function(){
            var url = '/appeal/getPropertyTimelineData';
        var postData = {"appealYear":2018, "userId": 9922606}
        $("#preloader").css("display", "block");
        
        AOTCService.postDataToServer(url, postData)
            .then(function (result) {
                $("#preloader").css("display", "none");
                  console.log(result.data)
                  $scope.data = result.data.result
                  $scope.staticTable(1);
                  $scope.changeComp(subEventsDetect.event,subEventsDetect.cloumn,subEventsDetect.pColumn)
                  $scope.modalData = $scope.data.jurisdictions[subEventsDetect.pColumn]
                  .properties[configData.data.propertyIndex].events[configData.data.eventIndex].subEvents[configData.subEventIndex].properties
                  console.log($scope.modalData)
                  $scope.uploadModal = false
                }, function (result) {
                //some error
                ////console.log(result);
                $("#preloader").css("display", "none");
            });
        }, 5000 );
       
        



    }

    $scope.sendData = function(){
      
           $("#preloader").css("display", "block");
        
            var url = '/incomeExpenses/addPropertyIE?propId=' + configId.property  +'&tId='+ configId.event;// backend push
            ////console.log("==>", url);
            ////console.log("vm.IEData==>", vm.IEData);
            ////console.log("==>", url);
            // ////console.log("vm.IEData==>", vm.IEData);
        //    console.log(send)
            AOTCService.uploadFiles(url, sendFile)
                .then(function (result) {

                    ////console.log("addPropertyIE", result);
                   
                      console.log(result)
                       UpdateData();
                       $scope.uploadModal = false
            
            //         // checkResult();
                }, function (result) {
                    $("#preloader").css("display", "none");
                    ////console.log(result);
                });
        }
    
 
}