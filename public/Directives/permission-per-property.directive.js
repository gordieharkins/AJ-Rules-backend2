//angular.module('AOTC').directive('permissionPerProperty', _permissionPerProperty);
_permissionPerProperty.$inject = ['AOTCPermissions'];
module.exports = _permissionPerProperty;


function _permissionPerProperty(AOTCPermissions) {
    return {
        link: function (scope, element, attrs) {
            // if (!_.isString(attrs.hasPermission)) {
            //     throw 'hasPermission value must be a string'
            // }
            var _key = attrs.permissionPerProperty.trim();
            var behaviourType = attrs.behaviourType.trim();
            
            /// var notPermissionFlag = value[0] === '!';
            // if (notPermissionFlag) {
            //     value = value.slice(1).trim();
            // }

            function toggleVisibilityBasedOnPermission() {
                try{
                    var hasPermission = AOTCPermissions.hasPermission(_key, 'permissionPerPropertyObj');
                    if (hasPermission) {
                        //element[0].style.display = 'none';
                        //element[0].setAttribute("disabled", null);
                    } else {
                        if(behaviourType=='hide') element[0].style.display = 'none';
                        if(behaviourType=='disable'){
                            element[0].setAttribute("disabled", true);
                        } 
                        
                    }
                }
                catch(_e){}
                //console.log(value);

            }

            toggleVisibilityBasedOnPermission();
            //scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
        }
    };
}