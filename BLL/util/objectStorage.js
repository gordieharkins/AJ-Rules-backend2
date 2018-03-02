var pkgCloudObjectStorage = require('pkgcloud-bluemix-objectstorage');
var fs = require('fs');
const PROVIDER = 'openstack';
const AUTH_URL = 'https://identity.open.softlayer.com/';
const REGION  = 'dallas';
const PROJECT_ID = '14983ada83d14033b9f3d9ae015da493';
const USER_ID = '75d9806945bb491f870556c38cefb342';
const USER_NAME = 'admin_d3d2fbe4518aa1730fce75693083df3791fd9e8d';
const PASSWORD = 'DR8(kK=6L^0~siBU';
const FORCE_URI = 'https://identity.open.softlayer.com/v3/auth/tokens';
const INTERFACE_NAME = 'public'; // use 'public' for apps outside Bluemix and 'internal' for apps inside Bluemix.

module.exports = ObjectStorage;

function ObjectStorage() {

}

var config = {};
config.provider = PROVIDER;
config.authUrl = AUTH_URL;
config.region= REGION;
config.useServiceCatalog = true;
config.useInternal = false; // true for applications running inside Bluemix, otherwise false.
config.tenantId = PROJECT_ID;
config.userId = USER_ID;
config.username = USER_NAME;
config.password = PASSWORD;

config.auth = {
    forceUri  : FORCE_URI,
    interfaceName : INTERFACE_NAME,
    "identity": {
        "methods": [
            "password"
        ],
        "password": {
            "user": {
                "id": USER_ID,
                "password": PASSWORD
            }
        }
    },
    "scope": {
        "project": {
            "id": PROJECT_ID
        }
    }
};

// Create a storage client
var storageClient = pkgCloudObjectStorage.storage.createClient(config);

ObjectStorage.prototype.uploadFile = function (fileData, fileName, containerName, cb) {
    // Create a config object

    var writeStream = storageClient.upload({
        container: containerName,
        remote: fileName
    });

    writeStream.on('error', function(err) {
        cb(err, null);
    });

    writeStream.on('success', function(file) {
        cb(null, file);
    });

    fileData.pipe(writeStream);
};


ObjectStorage.prototype.downloadFile = function (fileName, containerName, output, cb) {
    // Create a config object
    var readStream =  storageClient.download({
                        container: containerName,
                        remote: fileName
                        }).pipe(fs.createWriteStream(output));


    cb(null, output);
    // readStream.on('error', function(err) {
    //     cb(err, null);
    // });

    // readStream.on('success', function(file) {
    //     console.log("here");
    //     cb(null, output);
    // });   

};