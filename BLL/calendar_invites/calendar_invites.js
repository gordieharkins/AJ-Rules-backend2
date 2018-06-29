// var calendar_invites = require(path.resolve(__dirname, '../DAL/admin'));
// var DAL = new calendar_invites();
// var ical = require('ical-generator')


module.exports = BLL;

function BLL(){}


BLL.prototype.postCalendarInvites = function(req, res) {
    var cal = ical({
        domain: 'sebbo.net',
        prodId: '//superman-industries.com//ical-generator//EN',
        events: [
            {
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event',
                description: 'It works ;)',
                organizer: 'kumailhussain <kumail.hussain@spsnet.com>',
                attendee: [
                    {email: 'kumail.hussain@spsnet.com', name: 'Kumail Hussain'},
                    
                ]
                
            }
        ]   
        })
         
        // event = cal.createEvent(),
        event = cal.createEvent(),
        attendee = event.createAttendee({email: 'kumail.hussain@spsnet.com', 'name': 'Kumail Hussain'});
        cal.serve(res);
 

console.log('it works')
    

}