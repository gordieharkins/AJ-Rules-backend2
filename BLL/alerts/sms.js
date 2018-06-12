const accountSid = 'ACd366f6e0e8d68a78f4504a3b69b66bf2';
const authToken = 'efc6edb09267a1f32b59acf6b2762052';
const client = require('twilio')(accountSid, authToken);

function SmsService(){

}

SmsService.prototype.sendSms = function(value,cb){
  
   client.messages
        .create({
     body: value.body,
     from: value.from,
     to: value.to
   })
  .then(message =>  {
      console.log('meesage going',message.sid);
     
      cb(null, message.sid)
  })
  .catch(e => { 
      console.error('Got an error:', e.code, e.message),
      cb(e)
})
  
}


module.exports = SmsService;