/**
 * Created by MW Team 3 on 4/23/2017.
 */
'use strict';

_PrivatePropertyService.$inject = ["$http", "$q", "$location"];
module.exports = _PrivatePropertyService;

//angular.module('AOTC').service("PrivatePropertyService", _PrivatePropertyService);
function _PrivatePropertyService($http, $q, $location) {
    var selectedPropertyList = {}
    // Return public API.
    return ({
        getProps: getProps,
        deleteProperties: deleteProperties,
        postDataToServer: postDataToServer
    });

    function getProps(postParams) {
        var url = '/properties/getMasterProperties';
        return postDataToServer(url, postParams)
    }

    function deleteProperties(propertyIds) {
        var token = localStorage.getItem('token');

        var url = '/properties/deletePropertiesByIds';
        var request = $http({
            method: "POST",
            url: url,
            data: {
                propIds: propertyIds
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        return (request.then(handleSuccess, handleError));
    }

    function postDataToServer(url, postParams) {
        var token = localStorage.getItem('token');

        ////console.log('in service post method')

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
        if (!angular.isObject(response.data) || !response.data.message) {
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