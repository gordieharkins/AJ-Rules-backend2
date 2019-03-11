'use strict';

_AOTCIpConfig.$inject = ["$http", "$filter"];
module.exports = _AOTCIpConfig;
function _AOTCIpConfig() {

function ipConfig(type) {
    if(type=='local'){
        return 'http://localhost:4300'
    }
    if(type=='server'){
        return 'https://aj-rules.mybluemix.net/'
    }
    if(type=='pDev'){
        return 'http://115.186.56.78:4300'
    }if(type=='oDev'){
        return 'http://172.19.200.21:4300'
    }
  //asdasd
   
}
return {
        ipConfig: ipConfig,
};
}