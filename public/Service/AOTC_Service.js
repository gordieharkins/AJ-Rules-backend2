'use strict';

_AOTCService.$inject = ["$http", "$rootScope"];
module.exports = _AOTCService;

//angular.module('AOTC')
//   .factory('AOTCService', _AOTCService
//    );
function _AOTCService($http, $rootScope) {

    var passwordToken = '123123123';

    function getDataFromServer(apiUrl) {
        var token = localStorage.getItem('token');
        var req = $http({
            method: "GET",
            url: apiUrl,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        return req;
    }

    function putDataToServer(url, userData) {
        var token = localStorage.getItem('token');
        var request = $http({
            method: "PUT",
            url: url,
            data: userData,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        return request;
    }

    function postDataToServer(url, userData) {
        var token = localStorage.getItem('token');
        var request = $http({
            method: "POST",
            url: url,
            data: userData,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        return request;
    }


    function uploadFiles(uploadUrl, files) {
        // console.log(jsonForm);
        var token = localStorage.getItem('token');
        var fd = new FormData();

        for (var i = 0; i < files.length; i++) {
            fd.append('file', files[i]);

        }

        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                "Authorization": token
            }
        });
    }

    function uploadFilesWithDescription(uploadUrl, files, desc) {
        var token = localStorage.getItem('token');

        var fd = new FormData();

        for (var i = 0; i < files.length; i++) {
            fd.append('file', files[i]);
        }
        fd.append('description', desc);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                "Athorization": token
            }
        });
    }

    function getNotifications() {
            //$("#preloader").css("display", "block");
            $rootScope.unreadNotifications = 0;
            var url = 'appeal/getNotification';
            getDataFromServer(url)
                .then(function (response) {
                    try{
                        if (response.data.success) {
                            $rootScope.allNotifications =  response.data.result;
                             var allData = response.data.result;
                            // for(var i=0; i<allData.length;i++){
                            //     var _item = allData[i];
                            //     if(_item.notification.properties.readFlag==0) 
                            //     $rootScope.unreadNotifications++;
                            //     if((_item.notifications.properties.eventType.indexOf('inter'))!=-1)
                            //     {$rootScope.allNotifications.internal.push(_item);}
                            //     else
                            //     {$rootScope.allNotifications.external.push(_item);}
                            // }
                        } else {
                           // $scope.$emit('danger', response.data.message);
                        }
                    }
                    catch(_e){}

                   // $("#preloader").css("display", "none");

                }, function (result) {
                   // $("#preloader").css("display", "none");
                });
        }

    return {

        getDataFromServer: getDataFromServer,
        uploadFilesWithDescription: uploadFilesWithDescription,
        uploadFiles: uploadFiles,
        postDataToServer: postDataToServer,
        putDataToServer: putDataToServer,
        getNotifications: getNotifications

    };

}
