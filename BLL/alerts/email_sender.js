const nodemailer = require('nodemailer');

transporter = null;

const NO_RECIEVER_EMAIL_ERROR = "Reciever email not specified"
const NO_RECIEVER_EMAIL_ERROR_ADD_DETAILS = "var \'to\' not specified"
const NO_SENDER_EMAIL_ERROR = "Sender email not specified"
const NO_SENDER_EMAIL_ERROR_ADD_DETAILS = "var \'from\' not specified"
const NO_SUBJECT_ERROR = "Subject of email can not be empty"
const NO_SUBJECT_ERROR_ADD_DETAILS = "var \'subject\' not specified"
const NO_BODY_ERROR = "Body of email can not be empty"
const NO_BODY_ERROR_ADD_DETAILS = "var \'text\' or \'html\' not specified"

function initialize_transporter(config) {
    if (config.email_service == "Gmail") {
        transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: config.email_address, // generated ethereal user
                pass: config.email_password // generated ethereal password
            },
            tls: {
    		    rejectUnauthorized: false
    		}
        });
    }
}

function send_email(mailOptions, callback) {
	if(!mailOptions.to){
		return callback({"error":NO_RECIEVER_EMAIL_ERROR, "additional_detail":NO_RECIEVER_EMAIL_ERROR_ADD_DETAILS})
	}
	if(!mailOptions.from){
		return callback({"error":NO_SENDER_EMAIL_ERROR, "additional_detail":NO_SENDER_EMAIL_ERROR_ADD_DETAILS})
	}

	if(!mailOptions.subject){
		return callback({"error":NO_SUBJECT_ERROR, "additional_detail":NO_SUBJECT_ERROR_ADD_DETAILS})
	}

	if(!mailOptions.text && !mailOptions.html){
		return callback({"error":NO_BODY_ERROR, "additional_detail":NO_BODY_ERROR_ADD_DETAILS})
	}

    transporter.sendMail(mailOptions, (error, info) => {
        callback(error, info);
	});

}


module.exports = function(config) {
	initialize_transporter(config)

	return {
		send_email: send_email
	}
};