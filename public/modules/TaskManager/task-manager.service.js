/**
 * Created by MW Team 3 on 4/23/2017.
 */
'use strict';

_taskService.$inject = ["$http", "$q", "$location"];
module.exports = _taskService;


//angular.module('AOTC')
//    .service(
//    "taskService", _taskService
    
//);
function _taskService($http, $q, $location) {
    // Return public API.
    return({

        getTasks: getTasks,
        getPropertyDetails: getPropertyDetails

    });
    // ---
    // PUBLIC METHODS.
    // ---

    /// I get all of the tasks in the remote collection.
    function getTasks() {
        var request = $http({
            method: "get",
            url: "/taskManager/getTasksByUserId",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
        
    function getPropertyDetails() {
        var request = $http({
            method: "POST",
            url: "/properties/getPropertiesById",
            data: {
                propId: parseInt(localStorage.getItem("propertyId"))
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }

    // ---
    // PRIVATE METHODS.
    // ---
    // I transform the error response, unwrapping the application dta from
    // the API response payload.
    function handleError( response ) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (
            ! angular.isObject( response.data ) ||
            ! response.data.message
        ) {
            return( $q.reject( "An unknown error occurred." ) );
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess( response ) {
        return( response.data );
    }

    function handleSuccessPropertyData( response ) {
        //////console.log('****** response is',response)
        return( response);
    }
}



