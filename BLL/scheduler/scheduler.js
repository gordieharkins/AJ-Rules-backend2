var cron = require('node-cron')

module.exports = BLL;

function BLL() {}

BLL.prototype.startCronJob = function(req,res) {
    console.log('coming')
    var array = [{name:1}, {name:2}]
    
    var task = cron.schedule('* * * * *', function(){

        executeJob(array, res)
        

      });
    
    task.start()  
}

function executeJob(data,cb) {
     
    console.log('send email or anything')
}
