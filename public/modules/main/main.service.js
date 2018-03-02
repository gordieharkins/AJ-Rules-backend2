
'use strict';

_mainService.$inject = ["$http", "$q", "AOTCService"];
module.exports = _mainService;

//angular.module('AOTC')
//    .service("mainService", _mainService
   
//    );
function _mainService($http, $q, AOTCService) {
    // Return public API.
    return ({

        getProps: getProps,
        getPropertyDetialsById: getPropertyDetialsById

    });
    // ---
    // PUBLIC METHODS.
    // ---

    // function getPropertyById(){

    // }

    function getPropertyDetialsById(propertyId) {
        var url = '/properties/getPropertyDetialsById';
        var _data = {propId: propertyId};
        var deferred = $q.defer();

        AOTCService.postDataToServer(url,_data )
            .then(function (result) {
                deferred.resolve(result);

            }, function (result) {
                deferred.reject(result);
                ////console.log(result);
            });
        return deferred.promise;
    }

    // I get all of the tasks in the remote collection.
    function getProps() {
        var request = $http({
            method: "get",
            url: "/properties/getPropertiesLandingPage",
            params: {
                action: "get"
            }
        });
        return (request.then(handleSuccess, handleError));
    }



    function getNews(_id) {
        var request = $http({
            method: "post",
            url: "/newsFeed/getNewsFeed",
            params: {
                "region": [],
                "sources": [],
                "time": 60
            }
        });
        return (request.then(handleSuccess, handleError));
    }


    // ---
    // PRIVATE METHODS.
    // ---
    // I transform the error response, unwrapping the application dta from
    // the API response payload.
    function handleError(response) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (
            !angular.isObject(response.data) ||
            !response.data.message
        ) {
            return ($q.reject("An unknown error occurred."));
        }
        // Otherwise, use expected error message.
        return ($q.reject(response.data.message));
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess(response) {

        return (response.data);
    }
}