'use strict';

//angular.module('AOTC')
//    .service('ReportService',_ReportService);

//.factory('Excel',  _Excel);
_ReportService.$inject = ["$q", "AOTCService"];
_Excel.$inject = ["$window"];
module.exports = { ReportService: _ReportService, Excel: _Excel };

function _ReportService($q, AOTCService) {

    function getSurveyReports(id) {
        var url='/surveys/getSurveyReport?id=' + id
        var deferred = $q.defer();

        AOTCService.getDataFromServer(url)
            .then(function(result) {
                deferred.resolve(result);

            }, function(result) {
                deferred.reject(result);
            });
        return deferred.promise;

    };

    return {
        getSurveyReports: getSurveyReports,
    };
};




function _Excel($window){
    var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},

        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
    return {
        tableToExcel:function(tableId,worksheetName){
            var table=$(tableId),
                ctx={worksheet:worksheetName,table:table.html()},
                href=uri+base64(format(template,ctx));
            //console.log(ctx)
            //console.log(template)

            return href;
        }
    };
}
