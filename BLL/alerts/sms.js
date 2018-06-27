var async = require('async')
var path = require('path')
var config = require(path.resolve(__dirname,'./config'))

const client = require('twilio')(config.sms.account_sid, config.sms.auth_token);

function SmsService() {}

SmsService.prototype.sendSms = function(value, callback) {
       var res = null;
       var from = config.sms.sms_sending_number;
    //    console.log(from);
       client.messages
            .create({
                body: "AOTC System Reminder\n"+ value.message + "\nJurisdiction: " +value.jurisdiction,
                from: from,
                to: value.sms
            })
            .then(message => {
               res = {message: message.sid,value: value,status:200}
                callback(null,res)
            })
            .catch(e => {
                 res = {message: e.message.sid,status:e.code,value: value}
                 callback(e.code, res)

            }).done()
   }


module.exports = SmsService;