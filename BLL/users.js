//Users BLL
var busBoy = require('busboy');
var path = require('path');
var fs = require('fs');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var cron = require('node-cron');

var config = require(path.resolve(__dirname, './util/config'));
var trasportCred = "smtps://" + config.inviteEmail.emailId + ":" + config.inviteEmail.emailPass + "@smtp.gmail.com";
var transporter = nodemailer.createTransport(trasportCred);

var Response = require(path.resolve(__dirname, './util/response'));
var InvalidFileFormat = require('./errors/invalidFileFormat');
var dalFile = require(path.resolve(__dirname, '../DAL/users'));
var usersFilesPath = path.resolve(__dirname, '../public/users/');
var ErrorLogDAL = require(path.resolve(__dirname, '../DAL/errorLog'));
var userParserFile = require(path.resolve(__dirname, './parsers/users/usersParser'));

var timeline = require(path.resolve(__dirname, '../BLL/timeline'));

var auth = require('./util/auth');

var userParser = new userParserFile();
var DAL = new dalFile();
var errorLogDAL = new ErrorLogDAL();

var timeline = new timeline();

var PARSING_FILE_TYPE = {};
PARSING_FILE_TYPE.USER = "user";
var loginUserId = 0; // Infutre will get logged in user ID
var loginUserName = 'Ali'; // Infutre will get logged in user name

module.exports = BLL;

//Class Constructor 
function BLL() {

}

// userSignIn
BLL.prototype.userSignIn = function(credentials, res) {
    if (!credentials || credentials === null || credentials === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.userSignIn(credentials, function(error,result) {
        if (error) {
            Response.sendResponse(false, Response.REPLY_MSG.LOG_IN_FAIL, null, res);
            return;
        } else if(result[0] === undefined){
            Response.sendResponse(false, Response.REPLY_MSG.LOG_IN_FAIL, result, res);
            return;
        }
            var data = result[0]; 
            var JwtData = {
                email: credentials.email,
                userId: data.userId
            }
            var token = jwt.sign(JwtData, auth.secret, {
                expiresIn: auth.tokenExpireTime // in seconds
            });
            data.token = 'JWT ' + token;
            data.tokenExpireTime = auth.tokenExpireTime;

            //timeline.extractNotifications(data);
            //timeline.getNotifications(data,res);
            // console.log("notifications extracted");
            // timeline.extractNotifications();
            
            // using SendGrid's v3 Node.js Library
            // https://github.com/sendgrid/sendgrid-nodejs

            //***** SEND GRID CODE STARTS HERE****
            // const sgMail = require('@sendgrid/mail');
            // // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            // sgMail.setApiKey('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');
            
            // const msg = {
            // to: 'Muhammad.Hamza@spsnet.com',
            // from: 'muhammad.umar@spsnet.com',
            // subject: 'Sending with SendGrid',
            // html: '<strong>Hello Hamza bhai, I am sending this email with SEND GRID wo bhi free! :P </strong>',
            // };
            // sgMail.send(msg);
            
            
            Response.sendResponse(true, Response.REPLY_MSG.LOG_IN_SUCCESS, data, res);

    });
}

// timeline.extractNotifications();



// var task = cron.schedule('39 15 * * *', function() { //min hour
//     console.log("notifications extracted");
//     timeline.extractNotifications(); //extract notifications and store them in the DB everyday
// }, false);
// task.start();


// userSignIn
BLL.prototype.uploadUserFile = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    var files = [];
    var counter = 0;
    var busboy = new busBoy({ headers: data.headers });
    data.pipe(busboy);
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        try {
            var saveTo = path.join(usersFilesPath, path.basename(filename));
            file.pipe(fs.createWriteStream(saveTo));
            files[counter] = saveTo;
            counter++;
        } catch (error) {
            // Log error and send response
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
        }
    });
    busboy.on('finish', function() {
        var users = [];
        var unParsedFiles = null;
        var failedFiles = null;
        var file = files[0];
        try {
            var users = userParser.parseFile(file);
        } catch (error) {
            if (!(error instanceof InvalidFileFormat)) {
                error.userName = loginUserName;
                errorLogDAL.addErrorLog(error);
            }

            var unParsedFile = {
                fileName: path.basename(file),
                filePath: file,
                fileType: PARSING_FILE_TYPE.USER
            };

            failedFiles = path.basename(file);
        }

        try {
            if (failedFiles !== null) {
                Response.sendResponse(false, "Unable to parse files.", failedFiles, res);
            } else {
                Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_SUCCESS, users, res);
            }

            if (unParsedFiles !== null) {
                DAL.addUnparsedFile(unParsedFiles, loginUserId, function(error, result) {
                    if (error) {
                        error.userName = loginUserName;
                        errorLogDAL.addErrorLog(error);
                    }
                });
            }
        } catch (error) {
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.FILES_PARSE_FAIL, null, res);
        }
    });

}

// getUserDataByToken
BLL.prototype.getUserDataByToken = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.getUserDataByToken(data, function(error, user) {
        if (error) {
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.GET_DATA_FAIL, null, res);

        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, user, res);
        }
    });
}

// getAllInvitedUsers
BLL.prototype.getAllInvitedUsers = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
    }
    DAL.getAllInvitedUsers(data, function(error, users) {
        if (error) {
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, users, res);
        }
    });
}

//users
BLL.prototype.addSingleUserNonRef = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    var timestamp = (new Date()).getTime();
    var pin = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)) + timestamp;
    data["pin"] = pin;
    DAL.addSingleUserNonRef(data, function(error) {
        if (error) {
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_SUCCESS, pin, res);
        }
    });
}

//bulkUsers
BLL.prototype.addBulkUsersRef = function(users, res) {
    if (users.bulkUsers.length === 0) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.addBulkUsersRef(users, function invitationSending(error, userDetails) {
        if (!error) {
            var emailsTo = userDetails.bulkUsers[0].email1;
            for (var i = 1; i < userDetails.bulkUsers.length; i++) {
                emailsTo = emailsTo + ";" + userDetails.bulkUsers[i].email1
            }
            var mailOptions = {
                from: config.inviteEmail.emailFrom, // sender address
                to: emailsTo, // list of receivers
                subject: config.inviteEmail.subject, // Subject line
                text: '', // plaintext body
                html: `<b>` + JSON.stringify(userDetails.emailSubject) + `</b>` // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    error.userName = loginUserName;
                    errorLogDAL.addErrorLog(error);
                    Response.sendResponse(false, Response.REPLY_MSG.EMAIL_SENDING_FAIL, null, res);
                } else {
                    Response.sendResponse(true, Response.EMAIL_SENDING_SUCCESS, null, res);
                }
            });
        } else {
            Response.sendResponse(false, Response.REPLY_MSG.SAVE_SUCCESS, null, res);
        }
    });
}


BLL.prototype.getUserByRole = function(data, res) {
    if (!data.body || data.body === null || data.body === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.getUserByRole(data.body, function(error,result) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}


BLL.prototype.getUserRoles = function(data, res) {
    if (!data.body || data.body === null || data.body === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }
    DAL.getUserRoles(function(error,result) {
        if (error) {
            console.log(error);
            error.userName = loginUserName;
            errorLogDAL.addErrorLog(error);
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}


// ---------------------------------------------
// getUSstates
// ---------------------------------------------
BLL.prototype.getUSstates = function(data, res) {
    if (!data || data === null || data === undefined) {
        Response.sendResponse(false, Response.REPLY_MSG.INVALID_DATA, null, res);
        return;
    }

    DAL.getUSstates(data, function(error, result) {
        if (error) {
            error.userName = loginUserName;
            ErrorLogDAL.addErrorLog(error);
            Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            return;
        } else {
            Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, result, res);
        }
    });
}
// ---------------------END---------------------

BLL.prototype.downloadAppealPackage = function(req, res) {

    // if(!data.user[0].roles.view_valuations){
    //      Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //      return;
    // }
    // console.log(req.path);
    res.download(req.query.path);
}