const IMAGES_DIR_NAME = 'PropertyImages';
const THUMBNAILS_DIR_NAME = IMAGES_DIR_NAME + '/Thumbnails';
const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 300;


var path = require('path');
var busBoy = require('busboy');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var sizeOf = require('image-size');
var PropertyImagesDAL = require(path.resolve(__dirname, '../DAL/propertyImages'));
var ErrorLogDAL = require(path.resolve(__dirname, '../DAL/errorLog'));
var Response = require(path.resolve(__dirname, './util/response'));
var propertyImagesPath = path.resolve(__dirname, '../public/' + IMAGES_DIR_NAME);
var thumbnailsPath = path.resolve(__dirname, '../public/' + THUMBNAILS_DIR_NAME);
var propertyImagesDAL = new PropertyImagesDAL();
var errorLogDAL = new ErrorLogDAL();
var loginUserName = 'Ali'; // In future will get logged in user name

module.exports = BLL;

// Class Constructor
function BLL() {

}

//----------------------------------------------
// addImages
//----------------------------------------------
BLL.prototype.addImages = function(data, res) {

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    try {
        var propertyId = data.query.propId;
        var userId = data.user[0].userId;
        var files = [];
        var filePaths = [];
        var busboy = new busBoy({ headers: data.headers });
        data.pipe(busboy);

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            try {
                // Create directory if it does not exist
                if (!fs.existsSync(propertyImagesPath)) {
                    fs.mkdirSync(propertyImagesPath);
                }

                // Create thumbnails directory if it does not exist
                if (!fs.existsSync(thumbnailsPath)) {
                    fs.mkdirSync(thumbnailsPath);
                }

                var name = path.basename(filename);
                var date = new Date();
                var uniqueName = userId + '_' + date.getTime() + '_' + name;

                var mainFile = path.join(propertyImagesPath, uniqueName);
                var thumbnailFile = path.join(thumbnailsPath, uniqueName);
                file.pipe(fs.createWriteStream(mainFile));

                var propertyImage = {};
                propertyImage.fileName = IMAGES_DIR_NAME + '/' + uniqueName;
                propertyImage.thumbnail = THUMBNAILS_DIR_NAME + '/' + uniqueName;
                propertyImage.originalName = name;
                files.push(propertyImage);

                var filePath = {};
                filePath.mainFile = mainFile;
                filePath.thumbnailFile = thumbnailFile;
                filePaths.push(filePath);
            } catch(error) {
                // Log error and send response
                error.userName = loginUserName;
                errorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
            }
        });

        busboy.on('finish', function() {
            if(files.length <= 0) {
                Response.sendResponse(false, Response.REPLY_MSG.NO_FILE_UPLOADED, null, res);
            } else {
                // Create thumbnails
                for(var i=0; i<filePaths.length; i++) {
                    var filePath = filePaths[i];
                    var dimensions = sizeOf(filePath.mainFile);
                    var ratio = dimensions.height / dimensions.width;
                    var height = THUMBNAIL_WIDTH * ratio;
                    gm(filePath.mainFile)
                        .resizeExact(THUMBNAIL_WIDTH, height)
                        .write(filePath.thumbnailFile, function (error) {
                            if (error) {
                                error.userName = loginUserName;
                                errorLogDAL.addErrorLog(error);
                            }
                        });
                }

                propertyImagesDAL.checkExistingImages(propertyId, function(error, result) {
                    if(error) {
                        error.userName = loginUserName;
                        errorLogDAL.addErrorLog(error);
                        Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
                        return;
                    } else {

                        var totalImages = result[0].masterImage.length + result[0].imageCount;
                        var addMain = false;
                        var image = {};     // masterImage

                        if(totalImages === 0){
                            image = files[0];
                            files.splice(0, 1);
                            addMain = true;
                        }

                        propertyImagesDAL.addSubImages(files, propertyId, userId, function(error, result) {
                            if(error) {
                                error.userName = loginUserName;
                                errorLogDAL.addErrorLog(error);
                                Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
                            } else {
                                if(addMain === true){
                                    propertyImagesDAL.addMainImage(image, propertyId, userId, function(error, result) {
                                        if(error) {
                                            error.userName = loginUserName;
                                            errorLogDAL.addErrorLog(error);
                                            Response.sendResponse(false, Response.REPLY_MSG.FILES_UPLOAD_FAIL, null, res);
                                            return;
                                        }
                                        Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_SUCCESS, null, res);
                                    });
                                } else{
                                    Response.sendResponse(true, Response.REPLY_MSG.FILES_UPLOAD_SUCCESS, null, res);
                                }
                            }
                        });
                    }
                });
            }
        });
    } catch(error) {
        error.userName = loginUserName;
        errorLogDAL.addErrorLog(error);
        Response.sendResponse(false, Response.REPLY_MSG.SAVE_FAIL, null, res);
    }
}
// ---------------------END---------------------

//----------------------------------------------
// setMainImage
//----------------------------------------------
BLL.prototype.setMainImage = function(data, res) {

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    try {
        var propertyId = data.body.propId;
        var imageId = data.body.imageId;
        var userId = data.user[0].userId;

        propertyImagesDAL.setMainImage(propertyId, imageId, userId, function(error, result) {
            if(error) {
                error.userName = loginUserName;
                errorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
            } else {
                Response.sendResponse(true, Response.REPLY_MSG.UPDATE_SUCCESS, null, res);
            }
        });
    } catch(error) {
        error.userName = loginUserName;
        errorLogDAL.addErrorLog(error);
        Response.sendResponse(false, Response.REPLY_MSG.UPDATE_FAIL, null, res);
    }
}
// ---------------------END---------------------

//----------------------------------------------
// getAllImages
//----------------------------------------------
BLL.prototype.getAllImages = function(data, res) {
    try {
        var propertyId = data.body.propId;
        propertyImagesDAL.getAllImages(propertyId, function(error, images) {
            if(error) {
                error.userName = loginUserName;
                errorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
                return;
            } else {
                var finalResult = [];

                if (images[0] && images[0].masterImage !== null) {
                    var masterImage = images[0].masterImage;
                    masterImage.properties.tag = 'masterImage';
                    finalResult = images[0].images;
                    finalResult.splice(0, 0, masterImage);
                } else {
                    // finalResult = [{
                    //     properties: {
                    //         fileName: "assets/img/noImageAvailable.jpg"
                    //     }
                    // }]
                    finalResult = [];
                }
                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, finalResult, res);
            }
        });
    } catch(error) {
        error.userName = loginUserName;
        errorLogDAL.addErrorLog(error);
        Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
    }
}
// ---------------------END---------------------

//----------------------------------------------
// getMainImage
//----------------------------------------------
BLL.prototype.getMainImage = function(data, res) {
    try {
        var propertyId = data.body.propId;
        propertyImagesDAL.getMainImage(propertyId, function(error, mainImage) {
            if(error) {
                error.userName = loginUserName;
                errorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
            } else {
                Response.sendResponse(true, Response.REPLY_MSG.GET_DATA_SUCCESS, mainImage, res);
            }
        });
    } catch(error) {
        error.userName = loginUserName;
        errorLogDAL.addErrorLog(error);
        Response.sendResponse(false, Response.REPLY_MSG.GET_DATA_FAIL, null, res);
    }
}
// ---------------------END---------------------

//----------------------------------------------
// deleteImageById
//----------------------------------------------
BLL.prototype.deleteImageById = function(data, res) {

    // if(!data.user[0].roles.edit_property_detail){
    //     Response.sendResponse(false, Response.REPLY_MSG.NO_ACCESS, null, res);
    //     return;
    // }

    try {
        var imageId = data.body.imageId;
        var tag = data.body.tag;
        propertyImagesDAL.deleteImageById(imageId, tag, function(error, mainImage) {
            if(error) {
                error.userName = loginUserName;
                errorLogDAL.addErrorLog(error);
                Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
            } else {
                Response.sendResponse(true, Response.REPLY_MSG.DELETE_SUCCESS, null, res);
            }
        });
    } catch(error) {
        error.userName = loginUserName;
        errorLogDAL.addErrorLog(error);
        Response.sendResponse(false, Response.REPLY_MSG.DELETE_FAIL, null, res);
    }
}
// ---------------------END---------------------
