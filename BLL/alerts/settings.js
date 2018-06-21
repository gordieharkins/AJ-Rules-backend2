var moment = require('moment')

function AlertsSettings(){

}

AlertsSettings.prototype.getSettings = function(){
 
}


AlertsSettings.prototype.configureAlert = function(alert,settings, cb) {
    console.log(alert,settings)
    var res = { "activeTime": [
        {
          day: "Sunday",
          intervals: [
            
          ]
        },
        {
          day: "Monday",
          intervals: [
            // {
            //     "startTime": "09:20PM",
            //     "endTime": "09:30PM"
            // }
          ]
        },
        {
          day: "Tuesday",
          intervals: [
            // {
            //     "startTime": "09:20PM",
            //     "endTime": "09:30PM"
            // }
          ]
        },
        {
          day: "Wednesday",
          intervals: [
            // {
            //     "startTime": "09:10AM",
            //     "endTime": "09:50AM"
            // },
            // {
            //     "startTime": "12:50AM",
            //     "endTime": "01:20PM"
            // }
            // ,
            
            // {
            //     "startTime": "04:20PM",
            //     "endTime": "05:00PM"
            // }
            // ,
            // {
            //     "startTime": "06:00PM",
            //     "endTime": "06:08PM"
            // }
            // ,
            {
                "startTime": "06:50PM",
                "endTime": "07:50PM"
            }
          
          ]
        },
        {
          day: "Thursday",
          intervals: [
            {
                "startTime": "09:20AM",
                "endTime": "09:30AM"
            },
            // {
            //     "startTime": "09:40PM",
            //     "endTime": "09:50PM"
            // }
            // ,
            {
                "startTime": "10:40AM",
                "endTime": "10:50AM"
            }
          ]
        },
        {
          day: "Friday",
          intervals: [
             {
                "startTime": "09:20PM",
                "endTime": "09:30PM"
             }
          ]
        },
        {
          day: "Saturday",
          intervals: [
            // {
            //     "startTime": "09:20PM",
            //     "endTime": "09:30PM"
            // }
          ]
        }
      ]
    }
   var sendingTime = null;
   var type= 'future' 
   if (type=='immediate') {
            immedaiateTime = immediateAlert(res.activeTime)
            sendingTime = caclculateSendingTime(immedaiateTime.intervals.startTime,immedaiateTime.index,'immediate');
            immedaiateTime['sendingTime'] = sendingTime
  
            console.log('ISTtime',immedaiateTime)
   } else {
            futureTime =   futureAlert(res.activeTime)
            sendingTime = caclculateSendingTime(futureTime.intervals.endTime,futureTime.index,'futrue');
            futureTime['sendingTime'] = sendingTime
            console.log('ISTtime',futureTime)

   }
    
//    checkFutureAlert(settings.activeWindow)
   cb(alert);
}

function futureAlert(activeWindow){
    var dateTime = moment().seconds(0).millisecond(0);
    var time = moment(dateTime).format('HH:mm A');
    var day = moment(dateTime).format('dddd');
    var activeListSorted = findArrayFuture(activeWindow,day)
    var positiveList = []
    var negativeList = []
    var extractedTime = null
    for(var i = 0 ; i< activeListSorted.length;i++) {
        for(var s = 0 ; s < activeListSorted[i].intervals.length;s++) {
            var curStartTime = moment(activeListSorted[i].intervals[s].startTime, 'HH:mm A').seconds(0).millisecond(0).subtract(i, 'days')
            var curEndTime = moment(activeListSorted[i].intervals[s].endTime, 'HH:mm A').seconds(0).millisecond(0).subtract(i, 'days')
            var duration = moment.duration(curEndTime.diff(dateTime));
            var hours = duration.asHours();
            if(hours>0) {
                positiveList.push({index: i,day: activeListSorted[i].day,diff: hours, intervals: activeListSorted[i].intervals[s]})
            }else {
                negativeList.push({index: i,day: activeListSorted[i].day,diff: hours, intervals: activeListSorted[i].intervals[s]})
                
            }
          
            console.log(activeListSorted[i].intervals[s].startTime,curStartTime,activeListSorted[i].intervals[s].endTime,curEndTime,'curre',dateTime,'diff',hours)

        }
    }
    if(negativeList.length>0) {
        var extractedNTime = SortArray(negativeList)
       
        return extractedNTime[extractedNTime.length-1]
    }else {
        var extractedPTime = SortArray(positiveList)
        extractedPTime[extractedPTime.length-1].index = 7;
        
        return extractedPTime
    }
    console.log('pos',positiveList)
    console.log('neg',extractedNTime)
    
}

function immediateAlert(activeWindow) {
    var dateTime = moment().seconds(0).millisecond(0);
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
            var curStartTime = moment(activeListSorted[i].intervals[s].startTime, 'HH:mm A').seconds(0).millisecond(0).add(i, 'days')
            var curEndTime = moment(activeListSorted[i].intervals[s].endTime, 'HH:mm A').seconds(0).millisecond(0).add(i, 'days')
            console.log('start',curStartTime,'end',curEndTime,'curre',dateTime)
            if(dateTime.isSameOrAfter(curStartTime) && dateTime.isSameOrBefore(curEndTime)) {
                console.log('Fire Out')
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

function caclculateSendingTime(time,days,type) {
    var sendingTime  = null;
    if(type=='immediate') {
    sendingTime = moment(time, 'HH:mm A').seconds(0).millisecond(0).add(days, 'days')
    } else {
    sendingTime = moment(time, 'HH:mm A').seconds(0).millisecond(0).subtract(days, 'days')

    }
    return  sendingTime
}
function getDay(index){
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday']
    return
}


module.exports = AlertsSettings;