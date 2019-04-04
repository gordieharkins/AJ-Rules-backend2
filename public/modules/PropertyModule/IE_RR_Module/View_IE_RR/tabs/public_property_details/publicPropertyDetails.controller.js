'use strict';

_PublicPropertyDetailsTab.$inject = ["$stateParams", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "PropertyDetailsTabService", "$timeout"];
module.exports = _PublicPropertyDetailsTab;

//angular.module('AOTC').controller('PublicPropertyDetailsTab', _PublicPropertyDetailsTab
//    );
function _PublicPropertyDetailsTab($stateParams, $location, $scope, $http, __env, $log, AOTCService, PropertyDetailsTabService, $timeout) {
    //////console.log("PublicPropertyDetailsTab");

    var vm = this;

    // $('#custom_carousel').on('slide.bs.carousel', function(evt) {
    //     $('#custom_carousel .controls li.active').removeClass('active');
    //     $('#custom_carousel .controls li:eq(' + $(evt.relatedTarget).index() + ')').addClass('active');
    // })
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
    vm.toggleActiveClass = toggleActiveClass;
    vm.deleteImageById = deleteImageById;

    vm.flipBack = flipBack;
    vm.flipFront = flipFront;
    vm.isDeleting = false;
    $scope.showInfo = true;
    $('#propCard').flip({
        trigger: 'manual'
    });

    $(".nav-tabs.public-tabs a").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).tab('show');
    });
    // vm.IERRProperty = JSON.parse(localStorage.getItem('propertyDetails'));
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
    //var getData = function () {
    //    $http.get('/modules/PropertyModule/View_IE_RR/tabs/propertyDetails/propertyData.json').then(function (_data) {
    //        vm.publicProperty = _data['propertyData0'];
    //    });
    //}();


    //if (vm.propertyDetails.publicProperty != null) {
    //    vm.publicProperty = vm.propertyDetails.publicProperty;
    //}

    // initial image index
    $scope._Index = 0;

    // Map Options
    $scope.map = {
        center: {
            latitude: vm.propertyDetails.latitude,
            longitude: vm.propertyDetails.longitude
        },
        zoom: 14
    };

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

    getAllImages();

    // --------------------------------------------
    // getAllImages
    // --------------------------------------------
    function getAllImages() {
        //////console.log('images')
        PropertyDetailsTabService.getAllImages().
        then(function (result) {
            //////console.log('getAllImages: ', result);

            var serverData = result.data;

            if (serverData.success) {
                vm.images = serverData.result;
                updateDrag(false);
                vm.isDeleting = false;


            }
        }, function (err) {
            //some error
            //////console.log("Error: ", err);
            $("#preloader").css("display", "none");
        });
    }



    var getProp = function(){
        var _url = 'properties/getPublicPropertyDetailsById';
        var _data = {
            "publicPropertyId":vm.propertyId
        };
        $("#preloader").css("display", "block");
        AOTCService.postDataToServer(_url, _data)
        .then(function (response) {
            if (response.data.success) {
                var _serverData = response.data.result[0];
                var someTemp = {};
                angular.forEach(_serverData.details, function(_value, _key){
                    angular.extend(someTemp, _value);
                });
                vm.allPropertyDetails =  someTemp;
                //console.log(vm.allPropertyDetails)

    
            } else {
                $scope.$emit('danger', response.data.message);
            }
            $("#preloader").css("display", "none");
    
        }, function (result) {
            $("#preloader").css("display", "none");
        });

    }();

    function VerifyJSon(s){ try {
        JSON.parse(s);
        //console.log(s)

        return true;
    } catch (e) {
        //console.log(e)
        return false;
    }
    };


    // --------------------------------------------

    // --------------------------------------------
    // getPropertyDetails Slaves
    // --------------------------------------------
    // PropertyDetailsTabService.getProperty().
    // then(function(result) {

    //         //////console.log(result);
    //         // //////console.log(result.data.length);
    //         var serverData = result.data;
    //         if (serverData.success) {

    //             vm.properties = serverData.result[0].prop;
    //             // //////console.log(vm.properties);
    //             localStorage.setItem('propertiesCount', vm.properties.length);

    //             for (var i = 0; i < vm.properties.length; i++) {
    //                 var prop = vm.properties[i];
    //                 prop.id = prop._id;
    //                 // prop.showAllData = false;

    //                 if (i == 0) {
    //                     prop.isActive = true;
    //                     prop.activeClass = 'glyphicon-minus'
    //                 } else {
    //                     prop.isActive = false;
    //                     prop.activeClass = 'glyphicon-plus'
    //                 }
    //             }
    //         }
    //         $("#preloader").css("display", "none");
    //     }, function(err) {
    //         //some error
    //         //////console.log("Error: ", err);
    //         $("#preloader").css("display", "none");
    //     })
    // --------------------------------------------

    // if a current image is the same as requested image
    $scope.isActive = function (index) {

        return $scope._Index === index;
    };

    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };

    // show prev image
    $scope.showPrev = function () {



        $scope._Index = ($scope._Index > 0) ? --$scope._Index : vm.images.length - 1;

        //////console.log($scope._Index)
        var offset = ($scope._Index) * 100

        $('#drag').animate({
            'right': offset + "px"
        });
    };

    // show next image
    $scope.showNext = function () {

        $scope._Index = ($scope._Index < vm.images.length - 1) ? ++$scope._Index : 0;
        //$('#drag').hide("slide", {direction: "left" },  1020);
        var offset = $scope._Index * 100

        $('#drag').animate({
            'right': offset + "px"
        });


    };


    function toggleActiveClass(property) {

        if (property.activeClass == "glyphicon-plus") {
            property.activeClass = "glyphicon-minus";
        } else {

            property.activeClass = "glyphicon-plus";
        }

        for (var i = 0; i < vm.properties.length; i++) {
            var pr = vm.properties[i];
            if (pr.id != property.id) {
                pr.activeClass = "glyphicon-plus";
            }
        }
    }

    // function getProperty() {

    //     var url = '/properties/getPublicPropertyDetailsById';
    //     //var _data = {propId: vm.propertyId};
    //     $("#preloader").css("display", "block");
    //     var _data = {
    //         "publicPropertyId": vm.propertyId
    //     };
    //     AOTCService.postDataToServer(url, _data)
    //         .then(function (result) {

    //             //////console.log(result);
    //             // //////console.log(result.data.length);
    //             var serverData = result.data;
    //             if (serverData.success) {
    //                 vm.properties = serverData.result[0].prop;
    //                 // //////console.log(vm.properties);
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
    //         }, function (result) {
    //             //some error
    //             //////console.log(result);
    //             $("#preloader").css("display", "none");
    //         });
    // }

    function deleteImageById(imageId, tag) {
        // //////console.log("delete called", tag);
        var len = (vm.images).length;
        var index = $scope._Index;

        if (len === (index + 1)) {
            $scope.showPhoto(len - 2);
        }

        // //////console.log("len----->", len);
        PropertyDetailsTabService.deleteImageById(imageId, tag)
            .then(function (result) {
                //////console.log('Server result is ->' + result);
                if (result.data.success) {
                    getAllImages();
                    updateDrag(true);

                    $scope.$emit('success', 'Record deleted successfully');
                } else {
                    $scope.$emit('error', 'Record deleted unsuccessfull');
                    vm.isDeleting = false;

                }
            }, function (err) {
                //////console.log('err is ', err);
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
        //////console.log('----');
        vm.isDeleting = true;
        if (vm.imageDeleteId != null) {
            deleteImageById(vm.imageDeleteId, vm.imageDeleteTag)
        }
    }

    function updateDrag(flag) {

        $timeout(function () {
            // var items = $(".nav li").length;
            var items = vm.images.length;
            //////console.log('link')

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
                        $(this).animate({
                            left: "0px"
                        });
                    if (ml < leftRight)
                        $(this).animate({
                            left: leftRight + "px"
                        });
                }
            });
        }, 500);
    }

    function setMainImage(imageId) {

        var propertyId = localStorage.getItem('propertyId');

        PropertyDetailsTabService.setMainImage(propertyId, imageId)
            .then(function (result) {
                //////console.log('Server result is ', result);
                if (result.data.success) {
                    getAllImages();
                    updateDrag(false);
                    $scope.$emit('success', 'Main image set successfully');
                } else {
                    $scope.$emit('error', 'Main image set unsuccessfull');
                }
            }, function (err) {
                //////console.log('err is ', err);
            })
    }

}