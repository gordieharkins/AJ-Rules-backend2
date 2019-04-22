'use strict';

_Signup.$inject = ["AOTCService", "$state", "$q"];
_pwCheck.$inject = [];
module.exports = {
    Signup: _Signup,
    pwCheck: _pwCheck
};

//angular.module('AOTC')
//    .directive('pwCheck', [_pwCheck])
//    .controller('Signup', _Signup);

function _Signup(AOTCService, $state, $q) {
    //////console.log("Signup controller");
    var vm = this;


    vm.signupData = {
        name: "", //done
        lastName: "", //done
        middleName: "", //done
        company: "", //done
        designation: "designation", //done
        street1: "", //done
        street2: "", //done
        city: "", //done
        state: "Select State", //done
        zipCode: "", //done
        phone1: "", //done
        phone2: "",
        phone3: "",
        email1: "", //done
        email2: "",
        email3: "",
        username: "", //done
        password: "", //done
        securityQ1: "Select Question", //done
        securityA1: "", //done
        securityQ2: "Select Question", //done
        securityA2: "", //done
        securityQ3: "Select Question", //done
        securityA3: "", //done
        customerType: "Paying",
        role: "Admin" //done
    };

    var getUserRoles = function () {
        //send data with service
        var url = '/users/getUserRoles';
        $("#preloader").css("display", "block");

        var multiplePromises = {
                getUserRoles: AOTCService.getDataFromServer('/users/getUserRoles'),
                getUSstates: AOTCService.getDataFromServer('/users/getUSstates')
            };

        $q.all(multiplePromises).then(function successCallback(response) {
            $("#preloader").css("display", "none");
            try {
                vm.rolesList = response.getUserRoles.data.result[0].role;
            } catch (_e) {}
            try {
                vm.uSstates = response.getUSstates.data.result;
            } catch (_e) {} 

        }, function errorCallback() {
            $("#preloader").css("display", "none");

        });

        // AOTCService.getDataFromServer(url)
        //     .then(function (response) {
        //         $("#preloader").css("display", "none");
        //         try {
        //             vm.rolesList = response.data.result[0].role;
        //         } catch (_e) {}

        //     });

    }();

    vm.clickSignUp = function () {

        $("#preloader").css("display", "block");
        //send data with service
        var url = '/users/addSingleUserNonRef';

        if (vm.signupData.securityQ1 == "Select Question") {
            vm.signupData.securityQ1 = "";
        }
        if (vm.signupData.securityQ2 == "Select Question") {
            vm.signupData.securityQ2 = "";
        }
        if (vm.signupData.securityQ3 == "Select Question") {
            vm.signupData.securityQ3 = "";
        }



        if (vm.signupData.password == vm.signupData.passwordConfirm) {

            delete vm.signupData.passwordConfirm;
            //////console.log(vm.signupData);

            AOTCService.postDataToServer(url, vm.signupData)
                .then(function (result) {

                    //console.log(result);
                   
                    localStorage.setItem('tokenTemp', result.data.result);
                    vm.signupData = {
                        name: "", //done
                        lastName: "", //done
                        middleName: "", //done
                        company: "", //done
                        designation: "designation", //done
                        street1: "", //done
                        street2: "", //done
                        city: "", //done
                        state: "Select State", //done
                        zipCode: "", //done
                        phone1: "", //done
                        phone2: "",
                        phone3: "",
                        email1: "", //done
                        email2: "",
                        email3: "",
                        username: "", //done
                        password: "", //done
                        securityQ1: "Select Question", //done
                        securityA1: "", //done
                        securityQ2: "Select Question", //done
                        securityA2: "", //done
                        securityQ3: "Select Question", //done
                        securityA3: "", //done
                        customerType: "Paying",
                        role: "Admin"
                    };

                    $("#preloader").css("display", "none");

                    $state.go('main');

                    // $("div.success").fadeIn(1500).delay(500).fadeOut(1500,function(){
                    //     $state.go('main');

                    // });




                }, function (result) {
                    //some error
                    $("#preloader").css("display", "none");

                    //////console.log(result);
                });
        }


    };
    angular.element(document).ready(function () {
        $("#btnlogin").click(function (e) {
            e.preventDefault();
        });
    });
}

function _pwCheck() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() === $(firstPassword).val();
                    //////console.log(v);
                    //////console.log(elem.val());
                    //////console.log(firstPassword);
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}