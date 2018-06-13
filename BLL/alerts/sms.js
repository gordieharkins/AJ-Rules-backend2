var async = require('async')

const accountSid = 'ACd366f6e0e8d68a78f4504a3b69b66bf2';
const authToken = 'efc6edb09267a1f32b59acf6b2762052';
const client = require('twilio')(accountSid, authToken);

function SmsService() {

}

SmsService.prototype.sendSms = function(data, cb) {
    var results = []
    async.forEachOf(data, function(value, index, callback) {

        client.messages
            .create({
                body: value.body,
                from: value.from,
                to: value.to
            })
            .then(message => {
                console.log('meesage going', message.sid);
                results.push({taceId: message.sid,value: value,sucess: true})
                callback()
            })
            .catch(e => {
                console.error('Got an error:', e.code,index, e.message),
                results.push({traceId: null,value: value,sucess: false})
                callback()
            })
    }, function(err) {
        if (err) {
            console.log('error');
        } else {
            console.log('All messages  deleiveered', results);

            return results;

        }
    });


}


module.exports = SmsService;