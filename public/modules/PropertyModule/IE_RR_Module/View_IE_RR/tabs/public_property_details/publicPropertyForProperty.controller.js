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
    vm.publicPropertyId = vm.propertyDetails.publicData;
    
    vm.images = [];
    vm.properties = [];
    vm.showAllData = false;
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



    var getProp = function(){
        var _url = 'properties/getPublicPropertyDetailsById';
        var _data = {
            "publicPropertyId":vm.publicPropertyId
        };
        $("#preloader").css("display", "block");
        AOTCService.postDataToServer(_url, _data)
        .then(function (response) {
            if (response.data.success) {
                var _serverData = response.data.result[0];
                var someTemp = {};
                angular.forEach(_serverData.details, function(_value, _key){
					//console.log(_value)
                    angular.extend(someTemp, _value);
                });
				var verify = {};
				angular.forEach(someTemp, function(_value, _key){
					var check = VerifyJSon(_value[1])
					//console.log(check)
					if(check != false && check!=null) {
				      _value[1] = check

					}
                });
				//console.log(someTemp)
                 vm.allPropertyDetails =  someTemp;

            } else {
                $scope.$emit('danger', response.data.message);
            }
            $("#preloader").css("display", "none");
    
        }, function (result) {
            $("#preloader").css("display", "none");
        });

    }();

    function VerifyJSon(s){ try {
       var arr=  JSON.parse(s);

         return arr;
    } catch (e) {
        return false;
     }
    };

    // --------------------------------------------

    // if a current image is the same as requested image
    $scope.isActive = function (index) {

        return $scope._Index === index;
    };

    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };

    // show prev image



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


}