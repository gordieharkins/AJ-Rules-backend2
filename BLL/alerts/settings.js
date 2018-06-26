var moment = require('moment')

function AlertsSettings(){

}

AlertsSettings.prototype.getSettings = function(){
 
}


AlertsSettings.prototype.configureAlert = function(alert,settings, cb) {
   
   console.log("asdasdasds",JSON.stringify(settings))
   console.log('alerttt',alert)

   var sendingTime = null;
   var result = null;
   var finalResult = null;
   
   var type= 'immediate';

   if (type=='immediate') {
             result = immediateAlert(settings.settings,alert.dateTime)
            
             sendingTime = caclculateSendingTime(result.intervals.startTime,result.index,'immediate',alert.dateTime);
            result['sendingTimeDate'] = sendingTime
            result['sendingTimeLong'] = sendingTime.format('x')
  
      
   } else {
            result =  futureAlert(settings.settings,alert.dateTime)
            sendingTime = caclculateSendingTime(result.intervals.endTime,result.index,'futrue',alert.dateTime);
            result['sendingTimeDate'] = sendingTime
            result['sendingTimeLong'] = sendingTime.format('x')
           

   }
   result['dateTime'] = alert['dateTime'] 
   alert['sendingTimeDate'] = result['sendingTimeDate'];
   alert['sendingTimeLong'] = Number(result['sendingTimeLong']);
   alert['sms'] = "null";
   console.log('asdasdas',settings.sms,'emai;l',settings.email)
//    if(settings.sms.verified=='true' && settings.sms.flag=='true') {
       alert['sms'] = settings.sms.details
//    }
   alert['email'] =  "null";
//    if(settings.email.flag=='true') {
    alert['email'] =  settings.email.details
    // }
    console.log(alert)
   cb(alert);
}

function futureAlert(activeWindow, dateIncome){
    console.log(dateIncome)
    var dateTime = moment(dateIncome).seconds(0).millisecond(0);
    console.log('datEITME',dateTime)
    var date = moment(dateTime).format('MM/DD/YYYY');
    var time = moment(dateTime).format('HH:mm A');
    var day = moment(dateTime).format('dddd');
    var activeListSorted = findArrayFuture(activeWindow,day)
    console.log('day',day,'list',activeListSorted)
    var positiveList = []
    var negativeList = []
    var extractedTime = null
    for(var i = 0 ; i< activeListSorted.length;i++) {
        for(var s = 0 ; s < activeListSorted[i].intervals.length;s++) {
            var curStartTime = moment(date + ' '+activeListSorted[i].intervals[s].startTime).seconds(0).millisecond(0).subtract(i, 'days')
            var curEndTime = moment(date+ ' '+activeListSorted[i].intervals[s].endTime).seconds(0).millisecond(0).subtract(i, 'days')
            var duration = moment.duration(curEndTime.diff(dateTime));
            var hours = duration.asHours();
            console.log('curent',dateTime,'start',curStartTime,'end',curEndTime)
            if(hours>0) {
                positiveList.push({index: i,day: activeListSorted[i].day,diff: hours, intervals: activeListSorted[i].intervals[s]})
            }else {
                negativeList.push({index: i,day: activeListSorted[i].day,diff: hours, intervals: activeListSorted[i].intervals[s]})
                
            }
          
           
            
        }
    }
    
    if(negativeList.length>0) {
        var extractedNTime = SortArray(negativeList)
       
        return extractedNTime[extractedNTime.length-1]
    }else {
        var extractedPTime = SortArray(positiveList)
        extractedPTime[extractedPTime.length-1].index = 7;
        
        return extractedPTime[extractedPTime.length-1]
    }
    console.log('pos',positiveList)
    console.log('neg',extractedNTime)
    
}

function immediateAlert(activeWindow,time) {
    var dateTime = moment(time).seconds(0).millisecond(0);
    var date = moment(dateTime).format('MM/DD/YYYY');
    console.log('date',date)
    var time = moment(dateTime).format('HH:mm A');
    var day = moment(dateTime).format('dddd');
    var activeListSorted = findArrayImmediate(activeWindow,day)
    console.log('sorted',activeListSorted)
    var found = 0;
    var extractMinWindowPositive = [];
    var extractMinWindowNegative = [];
    var extractedTime =null;
    for(var i = 0 ; i< activeListSorted.length;i++) {
        
        for(var s = 0 ; s < activeListSorted[i].intervals.length;s++) {
            console.log('checking',activeListSorted[i].intervals[s].startTime,'date',date,"index",i)
            // console.log(moment(date+ " " +activeListSorted[i].intervals[s].startTime))
            var time = date+ " " +activeListSorted[i].intervals[s].startTime
            var curStartTime = moment(date+ " " +activeListSorted[i].intervals[s].startTime).seconds(0).millisecond(0).add(i, 'days')
            var curEndTime =   moment(date+ " " +  activeListSorted[i].intervals[s].endTime).seconds(0).millisecond(0).add(i, 'days')
            console.log('curent',dateTime,'start',curStartTime,'end',curEndTime)

            if(dateTime.isSameOrAfter(curStartTime) && dateTime.isSameOrBefore(curEndTime)) {
                
                found=1;
                extractedTime = {index: i,day: activeListSorted[i].day,diff: 0, intervals: activeListSorted[i].intervals[s]}
                break;
            }  else {
                var duration = moment.duration(curStartTime.diff(dateTime));
                var hours = duration.asHours();
                // console.log('diff',hours)
                if(hours>0){
                    extractMinWindowPositive.push({index: i,day:  activeListSorted[i].day,diff: hours, intervals: activeListSorted[i].intervals[s]})
                } else {
                    extractMinWindowNegative.push({index: i,day:  activeListSorted[i].day,diff: hours, intervals: activeListSorted[i].intervals[s]})
                }
            }
        
        }
        if(found==1){
           
           break;
       } 
        
           
    }
    if(found==1){
        console.log('in time')
        return extractedTime
    } else {
         var time = []
         if(extractMinWindowPositive.length>0) {
            console.log('in +time')

            time = SortArray(extractMinWindowPositive)
            
       } else {
           console.log('in -time')

           time =  SortArray(extractMinWindowNegative)
           
    
    }
    return time[0] 
    
    
    }
    // console.log('checking nearby minimum after', extractMinWindow)
}

function SortArray(array) {
    array.sort(function (a, b) {
        return a.diff - b.diff;
      });  
    return array    
}

function findArrayImmediate(activeList,day){
    var index = -1;
    var splicedArray = []
    for (var i = 0 ; i < activeList.length;i++) {
        console.log(activeList[i].day)
        if(day==activeList[i].day){
            index = i
            break;
        }
        splicedArray.push(activeList[i])
        
    }
    var leftArray = []
    for(var i =index ; i< activeList.length; i++) {
          leftArray.push(activeList[i]) 
    }
    if(leftArray.length>0) {
        leftArray = leftArray.concat(splicedArray) 
    }
   
   return leftArray
  
}


function findArrayFuture(activeList,day){
    var index = -1;
    var splicedArray = []
    for (var i = 0 ; i < activeList.length;i++) {
        splicedArray.push(activeList[i])
        if(day==activeList[i].day){
            index = i
            break;
        }
        
        
    }
  
    splicedArray = splicedArray.reverse();
    var leftArray = []
    for(var i =index+1 ; i< activeList.length; i++) {
           
          leftArray.push(activeList[i]) 
    }
    leftArray = leftArray.reverse();
    if(leftArray.length>0) {
        splicedArray = splicedArray.concat(leftArray) 
    }
    
   return splicedArray
  
  
}

function availableFutureTime(blackouts, min,time){
    var day =  moment(time).format('dddd');
    var threshHoldTime =    moment(time).subtract(min, "minutes");
    console.log('time',time,'subt',threshHoldTime)
    var filterArray = null;
    for(var i = 0  ; i < blackouts.length;i++) {
         
        blackouts[i].days.filter(function(item,index) {
             if(item==day) {
                filterArray = blackouts[i]
             }
        })
        
    }
    var timeExist = null;
    if(filterArray) {
        for (var s = 0 ; s< filterArray.intervals.length ;s++){
            console.log(filterArray.intervals[s])
            var curStartTime = moment(filterArray.intervals[s].startTime, 'HH:mm A').seconds(0).millisecond(0).add(i, 'days')
            var curEndTime = moment(filterArray.intervals[s].endTime, 'HH:mm A').seconds(0).millisecond(0).add(i, 'days')
           
            if(threshHoldTime.isSameOrAfter(curStartTime) && endTime.isSameOrBefore(curEndTime)){
                 console.log('conflict')
                 break;
            }

        }
    }
    


}

function caclculateSendingTime(time,days,type,dateTime) {
    var sendingTime  = null;
    var date = moment(dateTime).format('MM/DD/YYYY');

    if(type=='immediate') {
    sendingTime = moment(date + ' '+time).seconds(0).millisecond(0).add(days, 'days')
    } else {
    sendingTime = moment(date + ' ' +time).seconds(0).millisecond(0).subtract(days, 'days')

    }
    return  sendingTime
}
function getDay(index){
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday']
    return
}


module.exports = AlertsSettings;