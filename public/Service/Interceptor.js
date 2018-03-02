// Intercepting HTTP calls with AngularJS.

_MyHttpInterceptor.$inject = ["$provide", "$httpProvider"];
module.exports = _MyHttpInterceptor;

//angular.module('AOTC')
//    .config(_MyHttpInterceptor
//    );
function _MyHttpInterceptor($provide, $httpProvider) {

    // Intercept http calls.
    //var s= `testfail`;
    $provide.factory('MyHttpInterceptor', ["$q", "$injector", "$log", function ($q, $injector, $log) {
        return {
            // On request success
            request: function (config) {
                // console.log('=============in request====================');
                // console.log(config); // Contains the data about the request before it is sent.
                // var url = config.url;
                // console.log('=========URL', url);
                // var auth_required = url.indexOf(".html");

                // if (auth_required == -1) {
                // // not html url then check if login no token 

                //     if (url == __env.login_url) {
                //         console.log('login authentication url '); // noneed of token
                //     } else {
                //         var token = localStorage.getItem('Token');
                //         console.log('=========token', token);
                //         config.headers.authorization = token;
                //     }

                // }


                // console.log(config); // Contains the data about the request before it is sent.
                // Return the config or wrap it in a promise if blank.
                return config || $q.when(config);
            },

            // On request failure
            requestError: function (rejection) {
                // console.log('=============in requestError====================');

                // console.log(rejection); // Contains the data about the error on the request.

                // Return the promise rejection.
                return $q.reject(rejection);
            },

            // On response success
            response: function (response) {
                // console.log('=============in response====================');

                // console.log(response); // Contains the data from the response.

                // Return the response or promise.
                return response || $q.when(response);
            },

            // On response failture
            responseError: function (rejection) {
                // console.log('=============in responseError====================');

                // console.log(rejection); // Contains the data about the error.

                if (rejection.status == 401) {

                    $injector.get('$state').transitionTo('login');

                }

                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    }]);

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('MyHttpInterceptor');

}
