'use strict';
_permissions.$inject = ["$rootScope"];
module.exports = _permissions;

//angular.module('AOTC')
//    .factory("AOTCPermissions", ["$q", "$log", _permissions]);

function _permissions($rootScope) {
    var serviceObject;
    try{
        serviceObject = {
            permissionMainObj: {},
            permissionPerPropertyObj: (JSON.parse(localStorage.getItem('propertyDetails')).roles)
        };
    }
    catch(_e){
        serviceObject = {
            permissionMainObj: {},
            permissionPerPropertyObj:  {}
        };
    }




    return {
        setPermissions: _setPermissions,
        // setPermissionPerProperty: _setPermissionPerProperty,
        // hasPermissionForProperty: _hasPermissionForProperty,
        hasPermission: _hasPermission
    };



    function _hasPermission(permissionKey, permissionObjKey) {
        permissionKey = permissionKey.trim();
        //var d = "df";
        return (serviceObject[permissionObjKey][permissionKey]);

        ///////
        // return permissionList.some(function(item) {
        //     if (typeof item.Name !== 'string') { // item.Name is only used because when I called setPermission, I had a Name property
        //         return false;
        //     }
        //     return item.Name.trim() === permission;
        // });
    }

    function _setPermissions(permissions, permissionObjKey) {
        serviceObject[permissionObjKey] = permissions;
        $rootScope.$broadcast('permissionsChangedFor'+permissionObjKey);
    }

    // function _setPermissionPerProperty(permissions) {
    //     permissionPerPropertyObj = permissions;
    //     //$rootScope.$broadcast('permissionsChanged');
    // }

    // function _hasPermissionForProperty(permissionKey) {
    //     permissionKey = permissionKey.trim();
    //     return (permissionPerPropertyObj[permissionKey]);

    // }
}