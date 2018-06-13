var async = require('async')
var path = require('path')
var config = require(path.resolve(__dirname,'./config'))

const client = require('twilio')(config.sms.account_sid, config.sms.auth_token);

function SmsService() {}

SmsService.prototype.sendSms = function(value, callback) {
       var res = null;
       client.messages
            .create({
                body: value.body,
                from: value.from,
                to: value.to
            })
            .then(message => {
               res = {message: message.sid,value: value,status:200}
                callback(null,res)
            })
            .catch(e => {
                 res = {message: e.message.sid,status:e.code,value: value}
                 callback(null,res)

            }).done()
   }


module.exports = SmsService;