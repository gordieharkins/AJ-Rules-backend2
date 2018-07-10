// var calendar_invites = require(path.resolve(__dirname, '../DAL/admin'));
// var DAL = new calendar_invites();
// var ical = require('ical-generator')


module.exports = BLL;

function BLL(){}


BLL.prototype.postCalendarInvites = function(data, res) {
    console.log("AAAAAAAAAAA",data);
    var cal = ical({
        domain: 'sebbo.net',
        prodId: '//superman-industries.com//ical-generator//EN',
        events: data  
        })
         
        // event = cal.createEvent(),
        // event = cal.createEvent(),
        // attendee = event.createAttendee({email: 'kumail.hussain@spsnet.com', 'name': 'Kumail Hussain'});
        cal.serve(res);
 

console.log('it works')
    

}