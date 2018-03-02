'use strict';
_auth.$inject = ["$rootScope", "$q", "$http", "$timeout", "AOTCService"];
module.exports = _auth;

//angular.module('AOTC')
//    .factory("AOTCAuth", ["$q", "$log", _auth]);

function _auth($rootScope, $q, $http, $timeout, AOTCService) {
    var permissionObj;

    return {
        setToken: _setToken,
        removeToken: _removeToken
    };


    function _setToken(token) {
        if(!token) return;
        var _deferred = $q.defer(); {
            //save token in local
            // serverData.token = 123;
            //$rootScope.isLoggedIn = true;
            //var token = serverData.result.token;
            localStorage.setItem('token', token);
            $http.defaults.headers.common.Authorization = token;
            $http.defaults.headers.common['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
            // extra
            $http.defaults.headers.common['Cache-Control'] = 'no-cache';
            $http.defaults.headers.common['Pragma'] = 'no-cache';
        }
        $timeout(function () {
            try{
                AOTCService.getNotifications();
            }
            catch(_e){}
            _deferred.resolve();
        });
        return _deferred.promise;
    }

    function _removeToken() {
        var _deferred = $q.defer(); {
            $http.defaults.headers.common.Authorization = '';
            localStorage.removeItem('token');
        }
        $timeout(function () {
            _deferred.resolve();
        });
        return _deferred.promise;
    }


}