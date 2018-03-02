
_sectionSettingsCtrl.$inject = ["$scope", "sectionSettingsService", "CreateSurveyService", "$state"];
module.exports = _sectionSettingsCtrl;

//angular
//    .module('AOTC')
//    .controller('sectionSettingsCtrl', _sectionSettingsCtrl
//    );
function _sectionSettingsCtrl($scope, sectionSettingsService, CreateSurveyService, $state) {
    console.log("sectionSettings controllersssssssssssssssssssssss");
    $("#preloader").css("display", "block");


    $scope.getallSections =function () {

        console.log('data')

        sectionSettingsService.getAllSections().
            then(function(result) {
                var serverData = result.data;
                if (serverData.success) {
                    if(serverData) {
                        $scope.sections = serverData.result;
                        console.log( $scope.sections)

                    }

                }
                $("#preloader").css("display", "none");

            }, function(err) {
                //some error
                console.log("Error: ", err);
                $("#preloader").css("display", "none");
            })

    }






    $scope.openModal=function (data) {
        $scope.postSection={id:null,sectionText:null}
        console.log(data)
        $scope.postSection.id=data.sectionId;
        $scope.postSection.sectionText=data.section
        console.log($scope.postSection)
        $('#myModalquestion').modal('show');
    }

    $scope.editSection=function (data) {
        $("#preloader").css("display", "none");
        console.log(data)
        sectionSettingsService.addSection(data).then(function (result) {
            var serverData = result.data;
            $('#myModalquestion').modal('toggle');
            if (serverData.success) {
                $scope.$emit('success', result.data.message);
                if (serverData) {
                    $scope.getallSections();
                }
            }
            else {
                $scope.$emit('danger', result.data.message);
            }
            $("#preloader").css("display", "none");

        }, function (err) {
            //some error
            console.log("Error: ", err);
            $("#preloader").css("display", "none");
        })

    }

    $scope.removeSection=function (data) {
        postData={id:data.sectionId}
        console.log("removing")
        $("#preloader").css("display", "none");
        console.log(data)
        sectionSettingsService.deleteSection(postData).then(function (result) {
            var serverData = result.data;

            if (serverData.success) {
                $scope.$emit('success', result.data.message);
                if (serverData) {
                    $scope.getallSections();
                }
            }
            else {
                $scope.$emit('danger', result.data.message);
            }
            $("#preloader").css("display", "none");

        }, function (err) {
            //some error
            console.log("Error: ", err);
            $("#preloader").css("display", "none");
        })
    }

    $scope.goback = function () {
        $state.go('Survey')
    }



}