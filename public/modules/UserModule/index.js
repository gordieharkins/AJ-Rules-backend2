'use strict';

//var angular = require('angular');

//******MultipleRegistration
angular.module('AOTC').controller('UserRegistration', require('./MultipleRegistration/user_registration'));


//******SingleRegistration

angular.module('AOTC').controller('Registered', require('./SingleRegistration/registered'));

angular.module('AOTC').controller('UserRolesListCtrl', require('./UserRights/user-roles-list.controller'));

//*Inventory
angular.module('AOTC').controller('InventoryCtrl', require('./Inventory/inventory.controller'));
