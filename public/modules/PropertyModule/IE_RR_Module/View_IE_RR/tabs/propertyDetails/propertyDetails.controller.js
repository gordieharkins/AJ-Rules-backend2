'use strict';

_PropertyDetailsTab.$inject = ["User_Config", "fileReader", "UtilService", "$stateParams", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "PropertyDetailsTabService", "$timeout"];
module.exports = { PropertyDetailsTab: _PropertyDetailsTab, ngPropertyImageSelect: _ngPropertyImageSelect };

var async = require('async');



//angular.module('AOTC').controller('PropertyDetailsTab', _PropertyDetailsTab
//    )
//.directive("ngPropertyImageSelect", _ngPropertyImageSelect);

function _ngPropertyImageSelect() {
    return {
        link: function ($scope, el) {
            el.bind("change", function (e) {
                $scope.file = (e.srcElement || e.target).files;
                $scope.getImages();
            })
        }
    }
}


function _PropertyDetailsTab(User_Config, fileReader, UtilService, $stateParams, $location, $scope, $http, __env, $log, AOTCService, PropertyDetailsTabService, $timeout) {
    /*! flip - v1.1.2 - 2016-10-20
* https://github.com/nnattawat/flip
* Copyright (c) 2016 Nattawat Nonsung; Licensed MIT */

    ////console.log("PropertyDetailsTab");

    var vm = this;
    $scope.isArray = function(value){
        try{
            if(Array.isArray(value))
            {
              var _val = '';
              for(var i=0;i<value.length;i++){
                if(i!=(value.length-1)) _val += value[i] + ', ';
                else _val += value[i];
              }
              return _val;
            }
            else return value;
        }
        catch(_e){
            return value;
        }
      };
    vm.deleteImageById = deleteImageById;
    vm.flipBack = flipBack;
    vm.flipFront = flipFront;
    vm.isDeleting = false;

    $(document).ready(function () {
        $('#propCard').flip({
            trigger: 'manual'
        });
    });



    vm.propertyDetails = JSON.parse(localStorage.getItem('propertyDetails'));
    vm.propertyId = JSON.parse(localStorage.getItem('propertyId'));
    vm.images = [];
    vm.properties = [];
    vm.showAllData = false;

    vm.myModelCheck = myModelCheck;
    vm.deleteByID = deleteByID;
    vm.setMainImage = setMainImage;

    vm.imageDeleteId = '';
    vm.imageDeleteTag = '';
    vm.deleteByIDImage = null;
    vm.modelMessage = {
        title: "",
        message: ""
    };

    // Public prop details
    vm.publicProperty = null;

    if (vm.propertyDetails.publicProperty != null) {
        vm.publicProperty = vm.propertyDetails.publicProperty;
    }

    // initial image index
    $scope._Index = 0;

    // Map Options
    $scope.map = { center: { latitude: vm.propertyDetails.latitude, longitude: vm.propertyDetails.longitude }, zoom: 15 };
    $scope.marker = {
        id: 1,
        coords: {
            latitude: vm.propertyDetails.latitude,
            longitude: vm.propertyDetails.longitude
        },
        options: {
            draggable: false,
            icon: "assets/img/marker.png"
        },
        events: {

        }
    };

    // Upload Images 
    $scope.imageSrc = [];
    vm.newUploadedImages = []
    vm.uploadImages = uploadImages;
    vm.removeUploadedPicture = removeUploadedPicture;
    $scope.toggleImageLoader = false;

    // Get all images initially
    getAllImages(false);

    $scope.isActive = function (index) {
        return $scope._Index === index;
    };
    ///modules/PropertyModule/View_IE_RR/tabs/propertyDetails/propertyData.json 

    var getData = function () {
        $http.get('/modules/PropertyModule/IE_RR_Module/View_IE_RR/tabs/propertyDetails/propertyData.json').then(function (_data) {
            vm.publicProperty = _data.data['propertyData0'];
        });
    }();

    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };

    // show prev image
    $scope.showPrev = function () {
        if ($scope._Index > 6) {
            $('#drag').animate({
                'right': "-=100px"
            });
        }
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : vm.images.length - 1;
    };

    // show next image
    $scope.showNext = function () {

        $scope._Index = ($scope._Index < vm.images.length - 1) ? ++$scope._Index : 0;
        //$('#drag').hide("slide", {direction: "left" },  1020);
        if ($scope._Index > 6) {
            $('#drag').animate({
                'right': "+=100px"
            });
        }
    };

    function deleteImageById(imageId, tag) {
        var len = (vm.images).length;
        var index = $scope._Index;

        if (len === (index + 1)) {
            $scope.showPhoto(len - 2);
        }

        PropertyDetailsTabService.deleteImageById(imageId, tag)
            .then(function (result) {
                ////console.log('Server result deleteImageById ->' + result);
                if (result.data.success) {
                    $scope._Index = 0;
                    getAllImages(false);
                    // updateDrag(true);

                    $scope.$emit('success', 'Record deleted successfully');
                } else {
                    $scope.$emit('error', 'Record deleted unsuccessfull');
                }
            }, function (err) {
                ////console.log('err is ', err);
            })
    }

    function flipBack(id) {
        $('#propCard').flip(false);
    }

    function flipFront(id) {
        $('#propCard').flip(true);
    }

    function deleteByID(name, id, tag) {

        vm.modelMessage.title = 'Delete Picture';
        vm.modelMessage.message = "Are you sure you want to delete picture “" + name + "” from this property?";
        vm.imageDeleteId = id;
        vm.imageDeleteTag = tag;
    }

    function myModelCheck() {
        vm.isDeleting = true;
        if (vm.imageDeleteId != null) {
            deleteImageById(vm.imageDeleteId, vm.imageDeleteTag)
        }
    }

    function updateDrag(flag) {

        $timeout(function () {
            // var items = $(".nav li").length;
            var items = vm.images.length;

            // Flag is defined to load the previous image if the image delete is last one.
            // if(flag){
            //     $scope.showPhoto(items - 1);
            // }

            var leftRight = 0;
            // var val = items * 9;

            if (items > 7) {
                leftRight = (items - 7) * -100;
                // leftRight = (items - 7) * -(val);
            }

            $('.nav').draggable({
                axis: "x",
                stop: function () {
                    var ml = parseInt($(this).css('left'));
                    if (ml > 0)
                        $(this).animate({ left: "0px" });
                    if (ml < leftRight)
                        $(this).animate({ left: leftRight + "px" });
                }
            });
        }, 500);
    }

    function setMainImage(imageId) {

        var propertyId = localStorage.getItem('propertyId');

        PropertyDetailsTabService.setMainImage(propertyId, imageId)
            .then(function (result) {
                ////console.log('Server result setMainImage -->', result);
                if (result.data.success) {
                    getAllImages(true);
                    updateDrag(false);
                    $scope.$emit('success', 'Main picture set successfully');
                } else {
                    $scope.$emit('error', 'Main picture set unsuccessfull');
                }
            }, function (err) {
                ////console.log('err is ', err);
            })
    }

    // getAllImages
    function getAllImages(flagMainImage) {
        vm.images = [];
        PropertyDetailsTabService.getAllImages().
        then(function (result) {
            ////console.log('getAllImages: ', result);

            var serverData = result.data;

            if (serverData.success) {
                var images = serverData.result;

                if (images.length > 0) {
                    vm.noImage = false;
                    vm.images = images;
                    updateDrag(false);
                    vm.isDeleting = false;
                    if (flagMainImage) {
                        $scope._Index = 0;
                        // showPhoto(0);
                    }
                } else {
                    vm.noImage = true;
                    vm.images = [{
                        properties: {
                            fileName: User_Config.NO_IMAGE_AVAILABLE
                        }
                    }];
                }
            }
        }, function (err) {
            //some error
            ////console.log("Error: ", err);
            $("#preloader").css("display", "none");
        })
    }

    // upload images functions
    vm.showImageModal = function () {

        $scope.imageSrc = [];
        $('#imageModal').modal('toggle');
    }

    function removeUploadedPicture(image) {

        for (var i = 0; i < $scope.imageSrc.length; i++) {

            if ($scope.imageSrc[i] == image) {
                $scope.imageSrc.splice(i, 1);
            }
        }
    }

    $scope.getImages = function () {
        $scope.toggleImageLoader = false;

        if ($scope.file.length > 0)
            $scope.imageSrc = [];

        async.forEach($scope.file, function (file, callback) {

            fileReader.readAsDataUrl(file, $scope)
                .then(function (result) {

                    var image = {
                        imageSrc: result,
                        file: file
                    };

                    $scope.imageSrc.push(image);
                    callback();
                });

        }, function (err) {
            if (err) return next(err);
            $scope.toggleImageLoader = true;
        });
    };

    function uploadImages() {

        vm.newUploadedImages = []

        for (var i = 0; i < $scope.imageSrc.length; i++) {
            vm.newUploadedImages.push($scope.imageSrc[i].file);
        }

        var totalImages = vm.images.length + vm.newUploadedImages.length;
        if (vm.noImage) {
            totalImages = vm.newUploadedImages.length;
        }

        if (totalImages > 10) {
            $scope.$emit('danger', 'Can not add more than 10 pictures');
            return;
        }
        sendImagesData();
    }

    function sendImagesData() {

        if (vm.newUploadedImages) {

            $("#preloader").css("display", "block");
            var url = '/propertyImages/addImages?propId=' + vm.propertyId;

            AOTCService.uploadFiles(url, vm.newUploadedImages)
                .then(function (result) {
                    $("#preloader").css("display", "none");

                    var serverData = result.data;

                    if (serverData.success != true) {
                        $scpoe.$emit('error', serverData.message);
                        return;
                    }

                    $('#imageModal').modal('toggle');
                    $scope.$emit('success', serverData.message);
                    getAllImages(false);
                }, function (result) {
                    $("#preloader").css("display", "none");
                    ////console.log(result);
                });
        } else {
            $scpoe.$emit('error', 'Please upload a picture');
        }
    }

}


// function getProperty() {

//     var url = '/properties/getSlavePropertiesByMasterId?id=' + vm.propertyId;

//     $("#preloader").css("display", "block");

//     AOTCService.getDataFromServer(url)
//         .then(function(result) {
//             ////console.log(result);
//             // ////console.log(result.data.length);
//             var serverData = result.data;
//             if (serverData.success) {

//                 vm.properties = serverData.result[0].prop;
//                 // ////console.log(vm.properties);
//                 localStorage.setItem('propertiesCount', vm.properties.length);

//                 for (var i = 0; i < vm.properties.length; i++) {
//                     var prop = vm.properties[i];
//                     prop.id = prop._id;
//                     prop.showAllData = false;

//                     if (i == 0) {
//                         prop.isActive = true;
//                         prop.activeClass = 'glyphicon-minus'
//                     } else {
//                         prop.isActive = false;
//                         prop.activeClass = 'glyphicon-plus'
//                     }
//                 }
//             }
//             $("#preloader").css("display", "none");
//         }, function(result) {
//             //some error
//             ////console.log(result);
//             $("#preloader").css("display", "none");
//         });
// }
