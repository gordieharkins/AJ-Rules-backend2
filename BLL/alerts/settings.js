var moment = require('moment')

function AlertsSettings(){

}

AlertsSettings.prototype.getSettings = function(){
 
}


AlertsSettings.prototype.configureAlert = function(alert,settings, cb) {
    console.log(alert)
  
   validateAlert(settings.blackouts);
   cb(alert);
}


function validateAlert(blackouts) {
    blackouts =  [
        {
            "days": [
                "Monday",
                "Wednesday"
            ],
            "intervals": [
                {
                    "startTime": "10:40AM",
                    "endTime": "05:00PM"
                },
                {
                    "startTime": "10:40AM",
                    "endTime": "05:00PM"   
                }
                ,
                {
                    "startTime": "05:45PM",
                    "endTime": "06:50PM"   
                }
            ]
        },{
            "days": [
                "Tuesday"
            ],
            "intervals": [
                {
                    "startTime": "10:40AM",
                    "endTime": "10:50AM"
                },
                {
                    "startTime": "11:50AM",
                    "endTime": "11:55AM"   
                }
                ,
                
                {
                    "startTime": "06:50PM",
                    "endTime": "08:30PM"   
                },
                {
                    "startTime": "06:30PM",
                    "endTime": "06:50PM"   
                }
                ,
                
                {
                    "startTime": "06:40PM",
                    "endTime": "08:55PM"   
                }
                ,
                
                {
                    "startTime": "08:50PM",
                    "endTime": "08:55PM"   
                }
            ]
        }
    ]
    var dateTime = moment();
    var time = moment(dateTime).format('HH:mm A');
    var day = moment(dateTime).format('dddd');
   
    
    var activeWindowList = []
    
    for (var  i = 0 ;i < blackouts.length; i++) {

        var filterDay = blackouts[i].days.filter(item => item == day)
        if( filterDay.length> 0) {
            blackOut = validateTime(blackouts[i].intervals,time);
            console.log('blackout contradict',blackOut)
        }
         
    }
    if(blackOut.length > 0) {
        //console.log('black out list')
       checkNearbyTime(blackouts,dateTime)  

    } else {
      
     
    }
   console.log(blackOut)
}


function validateTime(intervals, time) {
    console.log(time)
    var result = []
    var currentTime =  moment(time, 'HH:mm A').seconds(0).millisecond(0)
    intervals.filter(function(item,index){
        var fomratStartTime = moment(item.startTime, 'HH:mm A').seconds(0).millisecond(0);
        var fomratEndTime = moment(item.endTime, 'HH:mm A').seconds(0).millisecond(0);
        if(currentTime.isSameOrAfter(fomratStartTime) && currentTime.isSameOrBefore(fomratEndTime)) {
           result.push({intervals: item, index: index})
        }
       
    })

    return result
   
    
}

function checkNearbyTime(blackouts,currentDateTime) {
    console.log('checkNearby')
    
    var day = moment(currentDateTime).format('dddd');
    var time = moment(currentDateTime).format('HH:mm A');
    var minimumNeighbourtime =null

    for(var i = 0 ;i < blackouts.length;i++) {
           var dayList =    blackouts[i].days.filter(item => item == day)
           if(dayList.length>0) {
                var currentTime =  moment(time, 'HH:mm A').seconds(0).millisecond(0)
                for(var j = 0 ;j <  blackouts[i].intervals.length; j++) {
                    var endTime = blackouts[i].intervals[j].endTime
                    var currentTime =  moment(time, 'HH:mm A').seconds(0).millisecond(0)

                    var setEndTime =  moment(endTime, 'HH:mm A').seconds(0).millisecond(0)
                    var duration = moment.duration(setEndTime.diff(currentTime));
                    var hours = duration.asHours();
                    console.log('time',currentTime,"end", setEndTime,"hours",hours)
                    if(!minimumNeighbourtime && hours>0) {
                        minimumNeighbourtime = hours;
                    }
                    if(minimumNeighbourtime>hours && hours>0) {
                        minimumNeighbourtime = hours;
                    }
                    console.log(minimumNeighbourtime)
                    
                }
           }
     }
     console.log('min',minimumNeighbourtime)
}




module.exports = AlertsSettings;