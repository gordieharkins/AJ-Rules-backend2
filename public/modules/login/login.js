'use strict';


_login.$inject = ["$state", "$location", "$scope", "$http", "__env", "$log", "AOTCService", "$timeout", "AOTCAuth", "AOTCPermissions"];
module.exports = _login;

//angular.module('AOTC').controller('login', _login
//    );
function _login($state, $location, $scope, $http, __env, $log, AOTCService, $timeout, AOTCAuth, AOTCPermissions) {
    ////console.log("login-in controller");

    var vm = this;
    $scope.passwordCheck = null;
    var pass = localStorage.getItem("tokenTemp");
    if(pass) {
        $scope.passwordCheck = pass;
        localStorage.removeItem('tokenTemp');
    }

    $scope.closeModal = function(){
        $scope.passwordCheck = null;
    }
    console.log(pass)
    
    //vm.deviceDetector = deviceDetector;
    //////console.log("vm.deviceDetector", vm.deviceDetector);

    //var browserNotification = localStorage.getItem('browserNotification');

    //////console.log(browserNotification);

    //if (browserNotification == null) {
    //    if (vm.deviceDetector.browser != 'chrome' && vm.deviceDetector.browser != 'safari' && vm.deviceDetector.browser != 'internet explorer') {
    //        $state.go('BrowserOptimizing');
    //    }
    //}

    vm.loginUser = loginUser;
    $('#preloader').css("display", "none");

    // $state.go('main.EventTeams');

    vm.credentials = {
        email: 'mark.clint@yahoo.com',
        password: 'mark'
    };
    vm.rememberMe = false;
    vm.errorLogin = '';
    localStorage.removeItem('userJson');
    localStorage.removeItem('token');
    //remove token 
    AOTCAuth.removeToken();

    var rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe) {
        vm.credentials = JSON.parse(localStorage.getItem('credentials'));
        vm.rememberMe = rememberMe;
    }

    function loginUser() {
        ////console.log("login: informations ", vm.credentials);
        var loginUserURL = '/users/userSignIn';
        $('#preloader').css("display", "block");


        AOTCService.postDataToServer(loginUserURL, vm.credentials)
            .then(function successCallback(response) {
                $('#preloader').css("display", "none");

                ////console.log("result is ", response);
                var serverData = response.data;
                //set token
                AOTCAuth.setToken(serverData.result.token);

                if (serverData.success) {


                    if (vm.rememberMe) {
                        var creds = angular.toJson(vm.credentials);
                        localStorage.setItem('rememberMe', vm.rememberMe);
                        localStorage.setItem('credentials', creds);

                    } else {
                        localStorage.removeItem('rememberMe');
                        localStorage.removeItem('credentials');

                    }

                    // var userData = serverData.result;
                    var userJson = serverData.result;
                    /////console.log(userJson);
                    localStorage.setItem('userJson', angular.toJson(userJson));
                    localStorage.setItem('userId', userJson.userId);
                    localStorage.setItem('token', userJson.token);

                    AOTCPermissions.setPermissions(userJson.roles, 'permissionMainObj');
                    AOTCPermissions.setPermissions(userJson.userData, 'userObj');
                    

                    $state.go('main');

                } else {
                    vm.errorLogin = serverData.message;
                }
                //on login

            }, function errorCallback(response) {
                $('#preloader').css("display", "none");
                ////console.log("error is ", response);
            });

    }


}