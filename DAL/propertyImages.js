var moment = require('moment-timezone');
var path = require('path');
var db = require(path.resolve(__dirname, './graphConnection'));

module.exports = DAL;

// Class Constructor
function DAL() {

}

// ---------------------------------------------
// Set an image as main image
// ---------------------------------------------
DAL.prototype.checkExistingImages = function(propertyId, cb) {
    propertyId = parseInt(propertyId);
    
    var query = `MATCH (prop:property) WHERE id(prop) = {propertyId}
        OPTIONAL MATCH (prop)-[]->(allImages:allImages)
        OPTIONAL MATCH (allImages)-[]->(image:image)
        OPTIONAL MATCH (allImages)-[]->(masterImage:masterImage)
        RETURN collect(DISTINCT masterImage) AS masterImage, collect(DISTINCT image) AS images , count(image) AS imageCount`;
    
    db.cypher({
        query: query,
        params:{
            propertyId: propertyId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// Add images against a propertyId
// ---------------------------------------------
DAL.prototype.addSubImages = function(images, propertyId, userId, cb) {
    propertyId = parseInt(propertyId);
    userId = parseInt(userId);
    params = {
        propertyId: propertyId,
        userId: userId
    };

    var query = `MATCH (prop:property)
        WHERE id(prop) = {propertyId}
        MERGE (prop)-[rel:allImages]->(allImages:allImages)`;

    for(var i = 0;i < images.length;i++){

        images[i].createdDate = moment.utc(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        images[i].modifiedDate = '';
        images[i].createdBy = userId;
        images[i].modifiedBy = '';

        params['image' + i] = images[i];

        query += `\nCREATE (image` + i + `:image{image` + i + `})
        CREATE (allImages)-[rel` + i + `:allImages]->(image` + i + `)`;
    }

    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// Set an image as main image
// ---------------------------------------------
DAL.prototype.addMainImage = function(image, propertyId, userId, cb) {
    propertyId = parseInt(propertyId);
    userId = parseInt(userId);
    
    image.modifiedBy= userId,
    image.createdBy= userId,
    image.modifiedDate= "",
    image.createdDate= moment.utc(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss')

    var params = {
        propertyId: propertyId,
        image: image
    };
    
    var query = `MATCH (prop:property)
        WHERE id(prop) = {propertyId}
        MERGE (prop)-[rel:allImages]->(allImages:allImages)
        WITH *
        CREATE (allImages)-[relMasterImage:relMasterImage]->(masterImageNew:masterImage{image})`;

    db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// Set an image as main image
// ---------------------------------------------
DAL.prototype.setMainImage = function(propertyId, imageId, userId, cb) {
	propertyId = parseInt(propertyId);
	imageId = parseInt(imageId);
	userId = parseInt(userId);

	var query = `MATCH (prop:property)-[]->(allImages:allImages)-[relMI:relMasterImage]->(masterImage1:masterImage)
    WHERE id(prop) = {propertyId}
    WITH *
    MATCH (image:image) WHERE id(image) = {imageId}
    CREATE (allImages)-[relAllImages:allImages]->(image1:image) 
    SET image1 = masterImage1
    SET image1.modifiedBy = {modifiedBy}
    SET image1.modifiedDate = {modifiedDate}
    CREATE (allImages)-[relMasterImage:relMasterImage]->(masterImageNew:masterImage)
    SET masterImageNew = image
    SET masterImageNew.modifiedBy = {modifiedBy}
    SET masterImageNew.modifiedDate = {modifiedDate}
    DETACH DELETE masterImage1, image`;
    
    db.cypher({
        query: query,
        params:{
            propertyId: propertyId,
            imageId: imageId,
            modifiedBy: userId,
            modifiedDate: moment.utc(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss')
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// Get all images of a specific property
// ---------------------------------------------
DAL.prototype.getAllImages = function(propertyId, cb) {
	propertyId = parseInt(propertyId);

	var query = `MATCH (prop:property)
        WHERE id(prop) = {propertyId}
        OPTIONAL MATCH (prop)-[]->(allImages:allImages)-[relMI:relMasterImage]->(masterImage:masterImage)
        OPTIONAL MATCH (prop)-[]->(allImages:allImages)-[]->(image:image)
        RETURN masterImage, collect(image) AS images`;
    
    db.cypher({
        query: query,
        params:{
            propertyId: propertyId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// Get main image of a specific property.
// ---------------------------------------------
DAL.prototype.getMainImage = function(propertyId, cb) {
	propertyId = parseInt(propertyId);

	var query = `MATCH (prop:property)-[]->(allImages:allImages)-[relMI:relMasterImage]->(masterImage:masterImage)
    WHERE id(prop) = {propertyId}
    RETURN masterImage`;
    
    db.cypher({
        query: query,
        params:{
            propertyId: propertyId
        }
    }, function(err, results) {
        cb(err, results);
    });
};
// ---------------------END---------------------

// ---------------------------------------------
// deleteImageById.
// ---------------------------------------------
DAL.prototype.deleteImageById = function(imageId, tag, cb) {
    imageId = parseInt(imageId);

    var query1 = ``;
    var query2 = ``;

    if(tag === 'masterImage'){
        query1 = `MATCH (allImgs:allImages)-[]->(masterImage:masterImage) 
            WHERE id(masterImage) = {imageId}
            OPTIONAL MATCH (allImgs)-[]->(image:image)
            WITH *
            DETACH DELETE masterImage
            RETURN collect(image) AS images, count(image) AS count`;
        db.cypher({
            query: query1,
            params:{
                imageId: imageId
            }
        }, function(err, result1) {

            if(!err && result1[0].count > 0){
                var nextImageId = result1[0].images[0]._id

                query2 = `MATCH (allImgs:allImages)-[rel1]->(image:image)
                WHERE id(image) = {imageId}
                WITH *
                CREATE (masterImage:masterImage)
                SET masterImage = image
                CREATE (allImgs)-[:relMasterImage]->(masterImage)
                DELETE rel1, image`;

                db.cypher({
                    query: query2,
                    params:{
                        imageId: nextImageId
                    }
                }, function(err, results) {
                    cb(err, results);
                });
            } else {
                cb(err, result1);
            }
        });
    } else {
        query1 = `MATCH (n) WHERE id(n) = {imageId} DETACH DELETE n`;

        db.cypher({
            query: query1,
            params:{
                imageId: imageId
            }
        }, function(err, results) {
            cb(err, results);
        });
    }
};
// ---------------------END---------------------