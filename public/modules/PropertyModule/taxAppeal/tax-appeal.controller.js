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
    $scope.uploadRadio = '1';
    $scope.pinValue = '';
    $scope.uploadModal = false;
    $scope.fileName = '';
    var configId = {property: null, event: null}
    var configData = {data:null,eventIndex:null};
    var subEventsDetect = null;
    var sendFile = null;
    var configSign =  {data:[],pin: null}
    $scope.resetSign = {pin: null}
    $scope.config = {error: null, errorFunction: null}; 
    $scope.configModal = {details: false, data: null};


    $scope.getPropertyDetails = function()  {
    resetError()
    var url = '/appeal/getPropertyTimelineData';
    var postData = {"appealYear":2018}
    $("#preloader").css("display", "block");
    
    AOTCService.postDataToServer(url, postData)
        .then(function (result) {
            $("#preloader").css("display", "none");
              console.log(result.data)
              $scope.data = result.data.result
              $scope.staticTable(1);
              resetError()
             
            }, function (result) {
            //some error
            ////console.log(result);
            $scope.config.error = 'Someting Went Wrong';
            $scope.config.errorFunction = $scope.getPropertyDetails;
    
            console.log('error')
            $("#preloader").css("display", "none");
        });
    }

    $scope.getPropertyDetails();

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

    $scope.selectOne = function(index,checkbox,parent) {
        var events = $scope.subData.prop
        var toggleData = [];
        
       if(checkbox=='true'){
      
               if('toggle' in $scope.subData.prop[parent].subEvents[index].properties) {
                      
                      $scope.subData.prop[parent].subEvents[index].properties.status = 'Done';
                    //   subEvent.properties.toggleValue = true
                      toggleData.push( $scope.subData.prop[parent].subEvents[index])

        }
    }
        else {
                if('toggle' in $scope.subData.prop[parent].subEvents[index].properties) {
                     
                       
                       $scope.subData.prop[parent].subEvents[index].properties.status = 'Not Started';

                    //    subEvent.properties.toggleValue = false
                   
                       toggleData.push( $scope.subData.prop[parent].subEvents[index])
             }
        }
        postCheckList(toggleData)
        // console.log(toggleData)
    }

    function postCheckList(data) {
        var url = 'appeal/updateData';
        $("#preloader").css("display", "block");
       

         console.log(data)
      
        
        AOTCService.postDataToServer(url, data)
            .then(function (result) {
                  console.log(result.data)
               
                  setTimeout(function(){ UpdateData(1)}, 5000)
        
             
                 
                }, function (result) {
                //some error
                ////console.log(result);
                console.log(result)
                $("#preloader").css("display", "none");
            });
    }
    function callMultipleSign(index,checkbox,events,flag) {
        if(checkbox==true){
            $scope.resetSign.pin = null;
            configSign.data =[]
            var count = 0 ;
            for (var i = 0  ;i  < events.length ; i++) {
                   var subEvent = events[i].subEvents[index]
                   if(subEvent.properties.buttonText=='Execute Signature' && subEvent.properties.flag==true) {
                          if(count==0) {
                            $scope.openSign = true;

                          }
                    configSign.data.push(events[i].subEvents[index])
                }
            }
            
            }
            console.log(configSign)
           
            
    }
    

    $scope.selectAll = function(index,checkbox,events,flag){
        var events = $scope.subData.prop
        if(flag[0]=='Execute Signature') {
            callMultipleSign(index,checkbox,events,flag)
            return
        }
        
        var toggleData = [];
        if(checkbox==true){
        for (var i = 0  ;i  < events.length ; i++) {
               var subEvent = events[i].subEvents[index]
               if('toggle' in subEvent.properties) {
                      
                      $scope.subData.prop[i].subEvents[index].properties.toggleValue = "true";
                      subEvent.properties.toggleValue = "true"
                    $scope.subData.prop[i].subEvents[index].properties.status = 'Done';

                      toggleData.push(events[i].subEvents[index])
            }
        }
        }
        else {
            for (var i = 0  ;i  < events.length ; i++) {
                var subEvent = events[i].subEvents[index]
                if('toggle' in subEvent.properties) {
                       
                       $scope.subData.prop[i].subEvents[index].properties.toggleValue = "false";
                       subEvent.properties.toggleValue = "false"
                    $scope.subData.prop[i].subEvents[index].properties.status = 'Not Started';
                    // $scope.subData.prop[i].subEvents[index].properties.toggleValue = false
                       
                       toggleData.push(events[i].subEvents[index])
             }
         }  
        }
        postCheckList(toggleData)
    
         console.log(toggleData)
         

        

    }

    $scope.buttonComp = function(state) {
        if ('warning' in state && state.warning)  return 'red-button';
        else if ('flag' in state && state.flag==false)  return 'disable-button'
        else return 'blue-button';
     }

     $scope.executeSign = function(pin){
        //  /executeSignature
        var url = '/appeal/executeSignature';
        var data = configSign.data
        // data.push( configSign.data)
        var postData = {"pin":pin, "data": data}
        $("#preloader").css("display", "block");
        console.log(postData)
        
        AOTCService.postDataToServer(url, postData)
            .then(function (result) {
                  console.log(result.data)
                  $scope.resetSign.pin = null
                  setTimeout(function(){ UpdateData(2)}, 5000)
        
             
                 
                }, function (result) {
                //some error
                ////console.log(result);
                console.log(result)
                $("#preloader").css("display", "none");
            });
         
     }

    $scope.noteComp = function(state) {
        console.log('notes click checked')
        if ('warning' in state && state.warning)    return 'red-note';
        else  return 'blue-note';
    }

    $scope.openModal = function(data, prop,subEventIndex,subEvent){
        
        configId.property = prop.propertyId;
        configId.event =    prop.eventId;
        configData.data = prop;
        configData.subEventIndex = subEventIndex;
        console.log(configData)
        if(data.buttonText=='Details') {
            $scope.showModal = true;
            $scope.modalData = {data: data, additionalItems: prop.additionalItems};
            console.log($scope.modalData)
        }else if (data.buttonText=='View Checklist' ) {
            $scope.configModal.details = true;
            $scope.configModal.data={data: subEvent, additionalItems: prop.additionalItems};
            //{data: data, additionalItems: prop.additiona lItems}

        } else if (data.buttonText=='Execute Signature') {
            $scope.openSign = true;
            $scope.resetSign.pin = null;
            configSign.data = []
            configSign.data.push(prop.subEvents[subEventIndex])
         }
        
        console.log(data)
    }

    $scope.signModal = function(type){
        type==1 ? $scope.uploadModal = true : $scope.uploadModal = false ;

    }

    $scope.closeModal = function(){
        $scope.showModal = false;
        $scope.openSign = false;
        $scope.resetSign.pin = null
        $scope.configModal.details = false;
       
       
    }

    // $scope.checkBox= function(data) {
    //     data = 
    // }

    $scope.saveCheckList = function(data){
        console.log(data)
        $("#preloader").css("display", "block");
        var postData = []
        postData.push(data.data)
        var url = '/appeal/updateRequiredItemsPaper';
    
         AOTCService.postDataToServer(url, postData)
         .then(function (result) {
               console.log(result)
               setTimeout(function(){ UpdateData(1)
             }, 5000)
                          $("#preloader").css("display", "none");

                
     
         }, function (result) {
             $("#preloader").css("display", "none");
             $scope.$emit('error', 'Unable to save')
             ////console.log(result);
         });
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
                 subEvents: subEvents,propertyId  : jProperty[i].id, eventId:  eventId,additionalItems: jProperty[i].events[column].additionalItems, 
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
          sendFile = null;
          var files = file.files;
          $scope.fileName = files[0].name
          var FileNames = [];
          var selected  = 0;
          sendFile = files
          $scope.$apply();
          
    }

    $scope.switchMode = function(){
        $scope.subData = null;
        $scope.show =  true;
        console.log('show class')
      
    }

    function UpdateData(type){
        
 
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
                  if(type==1){
                      console.log('updating modal data')
                  $scope.configModal.data.data  = $scope.data.jurisdictions[subEventsDetect.pColumn]
                  .properties[configData.data.propertyIndex].events[configData.data.eventIndex].subEvents[configData.subEventIndex]    
                  $scope.modalData.data = $scope.data.jurisdictions[subEventsDetect.pColumn]
                  .properties[configData.data.propertyIndex].events[configData.data.eventIndex].subEvents[configData.subEventIndex].properties
                  $scope.modalData.additionalItems = $scope.data.jurisdictions[subEventsDetect.pColumn].properties[configData.data.propertyIndex]
                  .events[configData.data.eventIndex].additionalItems;
                  $scope.configModal.data.additionalItems = $scope.modalData.additionalItems 

                    }
                  console.log($scope.modalData)
                  $scope.uploadModal = false
                  $scope.openSign = false;
                }, function (result) {
                //some error
        //         ////console.log(result);
                $("#preloader").css("display", "none");
                $scope.$emit('error', 'Unable to update data')

            });
        
       
        



    }

    $scope.sendData = function(radio){
        console.log(radio)
      
           $("#preloader").css("display", "block");
           console.log(radio)
           if(radio==1) {
            var url = '/incomeExpenses/addPropertyIE?propId=' + configId.property  +'&tId='+ configId.event;// backend push

           } else if (radio==2){
            var url = '/rentRolls/addPropertyRR?propId=' + configId.property  +'&tId='+ configId.event;

           } else if (radio==3) {
            var url = '/otherFiles/uploadOtherFiles?propId=' + configId.property  +'&tId='+ configId.event;
           }
            AOTCService.uploadFiles(url, sendFile)
                .then(function (result) {
                      console.log(result)
                      setTimeout(function(){ UpdateData(1)
                    }, 5000)
                    
                       $scope.uploadModal = false
            
                }, function (result) {
                    $("#preloader").css("display", "none");
                    $scope.$emit('error', 'File Upload Failed')
                    ////console.log(result);
                });
        }
    

        function resetError(){
            $scope.config = {error: null, errorFunction: null}; 
        }
 
}