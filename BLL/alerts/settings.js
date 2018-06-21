function AlertsSettings(){

}

AlertsSettings.prototype.getSettings = function(){
 
}


AlertsSettings.prototype.configureAlert = function(alert,settings, cb) {
    console.log("Alert, settings: ", alert, settings);
    cb(alert);
}


module.exports = AlertsSettings;