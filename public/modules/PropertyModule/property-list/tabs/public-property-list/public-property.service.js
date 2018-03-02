/**
 * Created by MW Team 3 on 4/23/2017.
 */
'use strict';

_PublicPropertyService.$inject = ["$http", "$q"];
module.exports = _PublicPropertyService;

//angular.module('AOTC')
//    .service(
//        "PublicPropertyService", _PublicPropertyService
        
//    );
function _PublicPropertyService($http, $q) {
    // Return public API.
    return ({
        getPublicProps: getPublicProps
    });
    function postDataToServer(url, postParams) {

        var token = localStorage.getItem('token');
        var request = $http({
            method: "POST",
            url: url,
            data: postParams,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        return request;
    }


    // I get all of the tasks in the remote collection.
    function getPublicProps(params) {
        var url = '/properties/getAJPublicProperties';
        return postDataToServer(url, params);
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
            !angular.isObject(response.data) || !response.data.message
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