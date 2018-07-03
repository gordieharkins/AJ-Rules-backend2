// var calendar_invites = require(path.resolve(__dirname, '../DAL/admin'));
// var DAL = new calendar_invites();
var ical = require('ical-generator')

var nodemailer = require('nodemailer');

module.exports = BLL;

function BLL(){}


BLL.prototype.postCalendarInvites = function(data, cb) {
	// data =data.body
    var eventObj = {
		'start' : data.start,
		'end' : data.end,
		'title' : data.title,
		'description' : data.description,
		'id' : data.uid,//new Date().getTime(), //Some unique identifier
		'organiser' : data.organiser,
		'location' : data.location,
		'alarms': data.alarms,   
        'attendees': data.attendees
	}
	var cal = ical();

	cal.setDomain('http://aotc-prod.mybluemix.net/').setName('Timeline Event Notifications');

	event = cal.createEvent({
		start: eventObj.start,
		end: eventObj.end,
		summary: eventObj.title,
		uid: eventObj.id, // Some unique identifier
		sequence: 1,
		description: eventObj.description,
		location: eventObj.location,
		organizer: eventObj.organiser,
		alarms: eventObj.alarms,
		attendees: eventObj.attendees, 
		status: data.status,        
		method: data.method
	});
	event.status('CANCELLED');
    console.log('sending2',eventObj.id )
	var mypath = __dirname + '\\'+ eventObj.id + '.ics';

	cal.saveSync(mypath);
	// console.log("cal: ",cal);
	console.log("event created and file saved at: ",mypath); 

	
	
    var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'aotc.invite@gmail.com',
		pass: 'object00'
	},
	logger: true, // log to console
	debug: true // include SMTP traffic in the logs
	});

	
	var message = {
	from: data.from,
	to: data.to,
	subject: data.subject,
	text: data.text,
	icalEvent: {
		method: data.method,
		path: mypath
	}
	};

	transporter.sendMail(message, function (error, info) {
	if (error) {
		console.log('Error occurred');
		console.log(error.message);
		return;
	}
	console.log('Message sent successfully!');
	console.log('Server responded with "%s"', info.response);
	});
 
}