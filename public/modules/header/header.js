'use strict';

_header.$inject = ["User_Config", "$state", "$timeout"];
module.exports = _header;

//angular.module('AOTC')
//    .directive('header', _header
//    );
function _header(User_Config, $state, $timeout) {
    var controller = ['$scope', '$location', 'AOTCService','AotcIp', '$rootScope', function ($scope, $location, AOTCService,AotcIp, $rootScope) {
        ////console.log('head controller');
        var head = this;
        $scope.successMessage = '';
        $scope.errorMessage = '';
        $scope.dangerMessage = '';
        $scope.showUserTab = false;
        $scope.allNotifications =$rootScope.allNotifications
        $scope.role = '';
        $scope.active = ''
        var ip = AotcIp.ipConfig('oDev')


        var role = localStorage.getItem('role');
        var token = localStorage.getItem('token');
        
        $scope.bindLink = function(){
            
            $scope.sendSurveylink = ip+"/login/"+token+"/"+role
            document.getElementById("survey").href = $scope.sendSurveylink;
        }
      
        $scope.role = role;

        if (role == User_Config.AJ_USER) {
            $scope.showSelectedTabs = false;

        } else if (role == User_Config.PMF_USER) {
            $scope.showSelectedTabs = false;
        } else if (role == User_Config.Admin) {
            $scope.showUserTab = true;
        }

        if (!localStorage.getItem('userJson')) {
            $state.go('login');
        } else {
            var userResult = JSON.parse(localStorage.getItem('userJson'));
            $scope.name = userResult.userData.name;
        }

     

        $scope.$on('userRole', function (ev, userRole) {
            $timeout(function () {
                $scope.showUserTab = false;
                if (userRole == User_Config.AJ_USER) {
                    $scope.showSelectedTabs = false;

                } else if (userRole == User_Config.PMF_USER) {
                    $scope.showSelectedTabs = false;
                } else if (userRole == User_Config.Admin) {
                    $scope.showUserTab = true;
                }
            }, 100);
        });

        $scope.$on('success', function (ev, ms) {
            $scope.successMessage = ms;
            // $scope.$apply();
            $("#head_success").fadeIn(1500).delay(500).fadeOut(500);
        });


        $scope.$on('error', function (ev, ms) {
            ////console.log('show error', ms);
            $scope.errorMessage = ms;
            // $scope.$apply();
            $("#head_error").fadeIn(1500).delay(500).fadeOut(500);
        });

        $scope.$on('danger', function (ev, ms) {
            ////console.log('show danger', ms);
            $scope.dangerMessage = ms;
            // $scope.$apply();
            $("#head_danger").fadeIn(1500).delay(500).fadeOut(500);
        });

        $scope.activateHeader = function(text){
            $scope.active = text

        }
        $scope.$on('notifications', function(ev, data) {
         console.log(data) 
         $scope.allNotifications = data
        
        });

        $rootScope.$watch('allNotifications', function(newValue, oldValue) {
            $scope.allNotifications = newValue
        })

        $scope.OpenNotfModal = function (_notf) {
            $scope.openNotModal = true;
            try {
                var url = '/timeline/markAsRead';
                var _data = {
                    "notId": _notf.notifications._id
                };
                if (_notf.notification.properties.readFlag == 0) {
                    $("#preloader").css("display", "block");
                    AOTCService.postDataToServer(url, _data)
                        .then(function (result) {
                            $scope.selectedNotification = _notf;
                            $("#myNotificationModal").modal('show');
                            $rootScope.unreadNotifications = 0;
                            $timeout(function () {
                                try {
                                    //
                                    _notf.notification.properties.readFlag = 1;
                                    for (var i = 0; i < $rootScope.allNotifications.external.length; i++) {
                                        var _item = $rootScope.allNotifications.external[i];
                                        if (_item.notification.properties.readFlag == 0) $rootScope.unreadNotifications++;

                                    }
                                    for (var i = 0; i < $rootScope.allNotifications.internal.length; i++) {
                                        var _item = $rootScope.allNotifications.internal[i];
                                        if (_item.notification.properties.readFlag == 0) $rootScope.unreadNotifications++;
                                    }
                                } catch (_e) {}
                            });
                           
                        }, function () {

                           
                        });
                } else {
                    $scope.selectedNotification = _notf;
                    $("#myNotificationModal").modal('show');
                }
            } catch (_e) {}



        };

        $(".nav-tabs.notification-tabs a").click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).tab('show');
        });
        head.parseProps = function(_str){
            try{
                var _parsedStr =  JSON.parse(_str);
                return _parsedStr;
            }
            catch(_e){}

        };

        $scope.isActive = isActive;

        function isActive(route) {
            ////console.log("route", route)
            ////console.log("$location.path()", $location.path())
            return route === $location.path();
        }
    }];

    return {
        templateUrl: 'modules/header/header.html',
        restrict: 'EA',
        controller: controller,
        controllerAs: 'head',
        bindToController: true

    };
}