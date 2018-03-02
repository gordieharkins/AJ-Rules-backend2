//User_Config.$inject = [];
module.exports = User_Config;

//var myApp = angular.module("AOTC")

//.constant('User_Config', (User_Config)());

function User_Config() {
    // Define your variable
    var PMF_Role = 'Asset Manager';
    var AJ_Role = 'Assessing Authority';
    var RESIDENTIAL_USER = 'Residential User';
    var NO_IMAGE_AVAILABLE = 'assets/img/noImageAvailable.jpg';
    var AVAILABLE_DATE_OPTIONS = {
        formatYear: 'yy',
        startingDay: 1,
        minDate: new Date(1969, 1, 1),
        maxDate: new Date(2030, 1, 1)
    };
    var DROPDOWN_OPTIONS_ANSWER_FIELD_TYPE = [
        { type: 'text' },
        { type: 'number' }
    ];

    var DATE_FORMAT = 'MM-dd-yyyy';

    // Use the variable in your constants
    return {
        DROPDOWN_OPTIONS_ANSWER_FIELD_TYPE: DROPDOWN_OPTIONS_ANSWER_FIELD_TYPE,
        DATE_FORMAT: DATE_FORMAT,
        AVAILABLE_DATE_OPTIONS: AVAILABLE_DATE_OPTIONS,
        PMF_USER: PMF_Role,
        AJ_USER: AJ_Role,
        RESIDENTIAL_USER: RESIDENTIAL_USER,
        MULTI_PART: 'multipart',
        MULTI_ACCOUNT: 'multiaccount',
        NO_DATA: 'No Data Found',
        Admin: 'Admin',
        NO_IMAGE_AVAILABLE: NO_IMAGE_AVAILABLE
    }
};