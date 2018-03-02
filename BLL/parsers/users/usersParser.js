var InvalidFileFormat = require('../../errors/invalidFileFormat');
var path = require('path');
if (typeof require !== 'undefined') XLSX = require(path.resolve(__dirname, '../xlsx'));

module.exports = UsersParser;

function UsersParser() {

}

UsersParser.prototype.parseFile = function(file) {
    var workbook = XLSX.readFile(file);
    var result = [];
    var isHeaderRowFound = 0;

    //User Email    First Name  Last Name   Company City    Role
    var dictionary = new Array();
    dictionary['userEmail'] = -1;
    dictionary['firstName'] = -1;
    dictionary['lastName'] = -1;
    dictionary['company'] = -1;
    dictionary['city'] = -1;
    dictionary['role'] = -1;

    workbook.SheetNames.forEach(function(sheetName) {
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        if (csv.length > 0) {
            var rows = csv.split("\n");

            for (var index = 0; index < rows.length; index++) {
                if (rows[index].length === 0)
                    continue;

                // Get columns
                var columns = rows[index].toLowerCase().split("|");
                // first find header row.
                if (isHeaderRowFound === 0) {
                    // If any of the following field exist then
                    // assumption is this is header row.
                    if (columns.indexOf("user email") > -1 ||
                        columns.indexOf("email") > -1) {
                        isHeaderRowFound = 1;
                        dictionary['userEmail'] = columns.indexOf("user email");
                        if (dictionary['userEmail'] === -1)
                            dictionary['userEmail'] = columns.indexOf("email");
                        dictionary['firstName'] = columns.indexOf("first name");
                        dictionary['lastName'] = columns.indexOf("last name");
                        dictionary['company'] = columns.indexOf("company");
                        dictionary['city'] = columns.indexOf("city");
                        dictionary['role'] = columns.indexOf("role");
                    }

                } else {
                    // If user email not defined then its not valid user record.            
                    if (columns[dictionary['userEmail']] === "")
                        continue;
                    var user = {};
                    if (dictionary['userEmail'] !== -1 && columns.length > dictionary['userEmail']) {
                        user.userEmail = columns[dictionary['userEmail']];
                    } else {
                        user.userEmail = "";
                    }
                    if (dictionary['firstName'] !== -1 && columns.length > dictionary['firstName']) {
                        user.firstName = columns[dictionary['firstName']];
                    } else {
                        user.firstName = "";
                    }
                    if (dictionary['lastName'] !== -1 && columns.length > dictionary['lastName']) {
                        user.lastName = columns[dictionary['lastName']];
                    } else {
                        user.lastName = "";
                    }
                    if (dictionary['company'] !== -1 && columns.length > dictionary['company']) {
                        user.company = columns[dictionary['company']];
                    } else {
                        user.company = "";
                    }
                    if (dictionary['city'] !== -1 && columns.length > dictionary['city']) {
                        user.city = columns[dictionary['city']];
                    } else {
                        user.city = "";
                    }
                    if (dictionary['role'] !== -1 && columns.length > dictionary['role']) {
                        user.role = columns[dictionary['role']];
                    } else {
                        user.role = "";
                    }
                    user.state = 1;

                    result.push(user);
                }
            }
        }
    });

    if(isHeaderRowFound === 0) {
        throw new InvalidFileFormat("We didn't find required fields in this file.");
    }
    return result;
}
