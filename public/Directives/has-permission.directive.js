//angular.module('AOTC').directive('hasPermission', _hasPermission);
_hasPermission.$inject = ['AOTCPermissions'];
module.exports = _hasPermission;


function _hasPermission(AOTCPermissions) {
    return {
        link: function (scope, element, attrs) {
            // if (!_.isString(attrs.hasPermission)) {
            //     throw 'hasPermission value must be a string'
            // }
            var _key = attrs.hasPermission.trim();
            var _obj = 'permissionMainObj';
            try {
                _obj = attrs.permissionObject.trim() || 'permissionMainObj';
            } catch (_e) {_obj = 'permissionMainObj';}

            // var notPermissionFlag = value[0] === '!';
            // if (notPermissionFlag) {
            //     value = value.slice(1).trim();
            // }

            function toggleVisibilityBasedOnPermission() {
                //console.log(value);
                try{

                    var hasPermission;
                    if(_obj=='userObj'){
                        var _permissionStatus =  AOTCPermissions.hasPermission(_key, _obj).trim();
                        hasPermission = (_permissionStatus =='Admin') ? true: false;
                    }
                    else{
                        hasPermission = AOTCPermissions.hasPermission(_key, _obj);
                    }
                    
                    if (hasPermission) {
                        //element[0].setAttribute("disabled", null);
                        // element[0].style.display = 'block';
                    } else {
                        element[0].style.display = 'none';
                    }            
                }
                catch(_e){}

            }

            toggleVisibilityBasedOnPermission();
            scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
        }
    };
}