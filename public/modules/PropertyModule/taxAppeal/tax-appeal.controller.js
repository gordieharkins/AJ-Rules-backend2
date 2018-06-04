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
    $scope.configModal = {details: false, data: null,dFieldsCb: false, rItemCb: false};
    $scope.search ={jurisdictions: [],zipCode: [], owner: []}
    $scope.inputSearch = {name: [],ns: 'Not Started',ip: '',don : ''}
    $scope.appealStatus = {ns: false,ip: false,don : false};
    $scope.propertyFilter = {name: '', add: '', zipCode: '',owner: 'None'}


    $scope.getPropertyDetails = function()  {
   
    var url = '/appeal/getPropertyTimelineData';
    var postData = {"appealYear":2018}
    $("#preloader").css("display", "block");
    
    AOTCService.postDataToServer(url, postData)
        .then(function (result) {
            $("#preloader").css("display", "none");
              console.log(result.data)
              $scope.data = result.data.result
              $scope.search.jurisdictions = UtilService.filterJurisdictions($scope.data.jurisdictions)
            //   $scope.search.zipCode = UtilService.filterJurisdictions($scope.data.jurisdictions)
            //   $scope.search.owner = UtilService.filterOwner($scope.data.jurisdictions)
              
              
             
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
            $('.JStableOuter table').each(function(i,n){
                $(n).scroll(function(e) {
                    $(this).find('thead').css("left", -$(this).find('tbody').scrollLeft());
                    $(this).find('thead th:nth-child(1)').css("left", $(this).scrollLeft()-0 );
                    $(this).find('tbody td:nth-child(1)').css("left", $(this).scrollLeft());

                    $(this).find('thead').css("top", -$(this).find('tbody').scrollTop());
                    $(this).find('thead tr th').css("top", $(this).scrollTop());


                });
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

    $scope.warningCount = function(notification) {
        if ('count' in notification) return notification['type'] == 'warning' ? 'card-tag-red' : 'card-tag-blue';
        else return 'card-tag-blue'
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
                 
               
                  setTimeout(function(){ UpdateData(4, 'Data updated successfully')}, 5000)
                 
                 
                }, function (result) {
                //some error
                ////console.log(result);
                console.log(result)
                $("#preloader").css("display", "none");
            });
    }
    function callMultipleSign(index,checkbox,events,flag) {
        
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
            
            
            console.log(configSign)
           
            
    }
    

    $scope.selectAll = function(index,checkbox,events,flag){
        var events = $scope.subData.prop
        // for(var i = 0 ;i < flag.length;i++){
        //     if('open' in flag[i].properties){
        //      delete flag[i].properties.open;
        //     }
        // }
        if(checkbox=='Execute Signature') {
            callMultipleSign(index,checkbox,events,flag)
            return
        }
        
        var toggleData = [];
        if(checkbox=='Mark all as Yes'){
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
        else if(checkbox=='Mark all as No') {
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
        if(toggleData.length > 0){

            postCheckList(toggleData)
    
        }
         console.log(toggleData)
         

        

    }

    $scope.buttonComp = function(state) {
        if (state.status=='Not Started')  return 'disable-button'
        
        else if ('warning' in state && state.warning)  return 'red-button';
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
                  setTimeout(function(){ UpdateData(2, 'Data updated successfully')}, 5000)
        
             
                 
                }, function (result) {
                //some error
                ////console.log(result);
                console.log(result)
                $("#preloader").css("display", "none");
            });
         
     }

    $scope.noteComp = function(state) {
     
        if ('warning' in state && state.warning)    return 'red-note';
        else  return 'blue-note';
    }

    function changeValues(data, value){
        for (var i = 0 ; i  < data.length ; i++) {
            data[i].value = value
        }
    }

    $scope.configModalfields =  function(data, item) {
        var count = 0 ;
        for(var  i = 0 ; i <data.length;i++) {
            
            if(data[i].value=='true'){
                  count++;
            } else {
                  count--;
            }
        }
        item = count == data.length ? item = "true" : item= "false";

        return item;
        // if(count==data.length){

        // }
    }

    $scope.selectAllFields = function(value,flag) {
        if(flag==1) {
            var dataFields=  $scope.configModal.data.data.properties.dataFields
            if(value=="true")  changeValues(dataFields, "true")
            else changeValues(dataFields, "false")
        } else if(flag==2) {
            var reqFields=  $scope.configModal.data.data.properties.requiredItems
            if(value=="true")  changeValues(reqFields, "true")
            else changeValues(reqFields, "false")
        }

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
            $scope.configModal.data={data: subEvent, additionalItems: prop.additionalItems};
          
            var dFields= $scope.configModal.data.data.properties.dataFields
            for (var k = 0 ; k   < dFields.length; k++) {
                $scope.configModal.dFieldsCb = "true"
                if(dFields[k].value=="false") {
                    $scope.configModal.dFieldsCb = "false"
                    break;
                } else {
                    continue;
                }
            }
            var rFields= $scope.configModal.data.data.properties.requiredItems
            for (var k = 0 ; k   < rFields.length; k++) {
                $scope.configModal.rItemCb = "true"
                if(rFields[k].value=="false") {
                    $scope.configModal.rItemCb = "false"
                    break;
                } else {
                    continue;
                }
            }
            $scope.configModal.details = true;
           
            
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
        $scope.fileName = '';
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
               setTimeout(function(){ UpdateData(3,"Data updated successfully.")
             }, 5000)
                       
                
     
         }, function (result) {
             $("#preloader").css("display", "none");
             $scope.$emit('error', 'Unable to save')
             ////console.log(result);
         });
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
    $scope.selectFiltersJ = function(data) {
        var selected = []
        for (var i = 0 ; i<$scope.search.jurisdictions.length ; i ++) {
            if($scope.search.jurisdictions[i].value==true) {
                selected.push($scope.search.jurisdictions[i].name)
            }
        }
        $scope.inputSearch.name = selected
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
                address: jProperty[i].address, streetAddress:  jProperty[i].streetAddress, 
                taxAccountNo:  jProperty[i].taxAccountNo, ownerName: jProperty[i].ownerName,
                subEvents: subEvents,propertyId  : jProperty[i].id, eventId:  eventId,additionalItems: jProperty[i].events[column].additionalItems, 
                info: subEventsDetect, propertyIndex: index, eventIndex: column})
       }
       console.log(extractSubEvents)

       $scope.subData = {data: $scope.data, prop: extractSubEvents,jName: jName};
       console.log($scope.subData)
       
       $scope.show =  false;
       // $scope.staticTable(0);
   }
    function UpdateData(type,message){
        
 
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
                  $scope.modalData.data = $scope.data.jurisdictions[subEventsDetect.pColumn]
                  .properties[configData.data.propertyIndex].events[configData.data.eventIndex].subEvents[configData.subEventIndex].properties
                  $scope.modalData.additionalItems = $scope.data.jurisdictions[subEventsDetect.pColumn].properties[configData.data.propertyIndex]
                  .events[configData.data.eventIndex].additionalItems;
                
                    }
                  if(type==3) {
                    $scope.configModal.data.data  = $scope.data.jurisdictions[subEventsDetect.pColumn]
                    .properties[configData.data.propertyIndex].events[configData.data.eventIndex].subEvents[configData.subEventIndex]    
                    $scope.configModal.data.additionalItems =  $scope.data.jurisdictions[subEventsDetect.pColumn].properties[configData.data.propertyIndex]
                    .events[configData.data.eventIndex].additionalItems;

                  }
                  console.log($scope.modalData)
                  $scope.uploadModal = false
                  $scope.openSign = false;
                  $scope.$emit('success', message)
                }, function (result) {
                //some error
        //         ////console.log(result);
                $("#preloader").css("display", "none");
                $scope.$emit('error', 'Unable to update data')

            });
        
       
        



    }



    $scope.sendData = function(radio){
        console.log(radio)
        if(!sendFile) {
            return;
        }
      
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
                      setTimeout(function(){ UpdateData(1, 'Data updated successfully')
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

