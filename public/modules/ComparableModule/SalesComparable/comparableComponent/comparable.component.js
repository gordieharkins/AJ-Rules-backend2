


//angular
//    .module('AOTC')
//    .component('comparableComponent', _comparableComponent
//   )


//.directive("fileinput", [
//    _fileinput])
//    .directive("ngImageSelect", [_ngImageSelect
//      ]);

var _comparableComponent = {
    templateUrl: 'modules/ComparableModule/SalesComparable/comparableComponent/comparable.component.html',
    controllerAs: 'comparableComponent',
    controller: ["ComparablePropService", "User_Config", "$timeout", "$scope", "$state", "AOTCService", "Upload", "ComparableSelectionService",
        function (ComparablePropService, User_Config, $timeout, $scope, $state, AOTCService, Upload, ComparableSelectionService) {



            //////console.log('comparable----checin')
            //////console.log("comparableComponent controller");
            var vm = this;
            $("#preloader").css("display", "block");

            var propertyDetails = JSON.parse(localStorage.getItem('propertyDetails'));
            vm.zillowData = [];
            vm.imageArr = [];
            vm.flipBack = flipBack;
            vm.flipFront = flipFront;

            var userRole = localStorage.getItem('role');

            // set property Images crawling from Zillow and get from db if exists

            function initializeCards() {
                //////console.log($scope.savedComaprables.length)

                $timeout(function () {
                    for (var i = 0; i < $scope.savedComaprables.length; i++) {
                        var id = '#card_' + i;
                        $(id).flip({
                            trigger: 'manual'
                        });
                    }
                }, 100);
            }


            $('#mydiv').hide();


            function imagePreLoader() {

            }

            function flipBack(id) {
                $(id).flip(false);
            }

            function flipFront(id) {
                $(id).flip(true);
            }

            // Sort already selected comps to top
            var vm = this;
            // $('#successModal').modal('close');
            $('#preloader').css('display', 'none');
            vm.submitManualData = submitManualData;
            vm.property = JSON.parse(localStorage.getItem('propertyDetails'));
            //////console.log("vm.property in manualIE: ", vm.property)

            vm.formData = {

            };
            vm.PrinciplePropData = JSON.parse(localStorage.getItem('principalForm'));
            //////console.log("key" + vm.PrinciplePropData);

            vm.modalYesbutton = modalYesbutton;
            vm.gotoPropertyDetails = gotoPropertyDetails;
            vm.resetForm = resetForm;

            function resetForm() {
                vm.formData = {};
                $scope.manualForm.$setPristine();
                $scope.manualForm.$setUntouched();
                $scope.picFile = null;
                $scope.isSubmitting = false;
            }

            function gotoPropertyDetails() {
                $('#successModal').modal('hide');
                $state.go('updateIERR');
            }

            function modalYesbutton() {
                //////console.log('reset form');
                vm.formData = {};

                $scope.manualForm.$setPristine();
                $scope.manualForm.$setUntouched();

                $('#successModal').modal('toggle');

            }


            function submitManualData() {

                $("#preloader").css("display", "block");
                //////console.log('appeal')

                vm.formData.compScore = vm.formData.compScore;
                vm.formData.taxAssessment = vm.formData.taxAssessment.toString();
                vm.formData.percentile = vm.formData.percentileValue.toString();
                vm.formData.rentLastUpdate = vm.formData.rentLastUpdate.toString();
                vm.formData.rentValueChangeDuration = vm.formData.rentValueChangeDuration.toString();
                vm.formData.taxAssessmentYear = vm.formData.taxAssessmentYear.toString();
                vm.formData.rentValueChange = vm.formData.rentValueChange.toString();
                vm.formData.finishedSqFt = vm.formData.finishedSqFt.toString();
                vm.formData.lastUpdate = vm.formData.lastUpdate.toString();
                vm.formData.amount = vm.PrinciplePropData.zEstimate.toString();
                vm.formData.valueChange = vm.PrinciplePropData.valueChange.toString();
                vm.formData.valueChangeDuration = vm.PrinciplePropData.valueChangeDuration.toString();
                vm.formData.valuationRangeHigh = vm.PrinciplePropData.valuationRangeHigh.toString();
                vm.formData.valuationRangeLow = vm.PrinciplePropData.valuationRangeLow.toString();
                vm.formData.lotSizeSqFt = vm.PrinciplePropData.lotSizeSf.toString();
                vm.formData.lastSoldDate = vm.PrinciplePropData.lastSoldDate.toString();
                vm.formData.lastSoldPrice = vm.PrinciplePropData.lastSoldPrice.toString();
                vm.formData.yearBuilt = vm.PrinciplePropData.yearBuilt.toString();
                vm.formData.imageFileName = $scope.imagePath;
                vm.PrinciplePropData.valueChangeDuration = vm.formData.valueChangeDuration;
                vm.PrinciplePropData.rentValueChangeDuration = vm.formData.rentValueChangeDuration;
                vm.PrinciplePropData.valueChangeDuration = vm.formData.valueChangeDuration;


                $scope.savedComaprables.push(vm.formData)
                initializeCards();
                var data = {};
                data.principal = [];
                data.comps = [];
                data.principal.push(vm.PrinciplePropData);
                data.comps = ($scope.savedComaprables);
                data.propId = localStorage.getItem("propertyId");
                //////console.log(data);
                var url = 'salesComps/addCompsToPropManual';
                AOTCService.postDataToServer(url, data)
                    .then(function (result) {
                        //////console.log("CompForm: ", result);
                        if (result.data.success) {
                            $scope.$emit('success', result.data.message);
                            $scope.manualForm.$setPristine();
                            $scope.manualForm.$setUntouched();
                            $('#compsForm').modal('hide');
                            resetForm();

                            // $state.go('TaskManager');
                        } else {
                            $scope.$emit('danger', result.data.message);
                        }
                        $("#preloader").css("display", "none");

                    }, function (result) {
                        ////////console.log(result);
                        $("#preloader").css("display", "none");
                    });
                //call to server
                //
            }

            // setTimeout(function() {
            //     vm.formData.baseRent = 2017;
            //     $scope.$apply();
            //     $('#successModal').modal('show');

            // }, 100);




            $scope.savedComaprables = [];
            var count = 0;

            $scope.getSavedComparables = function () {
                $("#preloader").css("display", "block");

                //////console.log('I am goingin')

                //getSavedCom parables if exists saved comparable then redirect to comparison
                ComparableSelectionService.getSavedComparables().
                then(function (result) {
                    //////console.log('getSavedComparables : ', result);
                    var serverData = result.data;
                    //////console.log(serverData.res)
                    $("#preloader").css("display", "none");

                    if (serverData.success) {
                        count = 1;

                        $scope.savedComaprables = serverData.result.comparables;

                        $timeout(function () {
                            initializeCards();
                        }, 200);
                    }
                }, function (err) {
                    $("#preloader").css("display", "none");
                    //////console.log('err : ', err);
                })
            }



            ///=================================date picker===========================//


            $('#sandbox-container input').datepicker({
                autoclose: true
            });


            $('#sandbox-container input').on('show', function (e) {
                console.debug('show', e.date, $(this).data('stickyDate'));

                if (e.date) {
                    $(this).data('stickyDate', e.date);
                } else {
                    $(this).data('stickyDate', null);
                }
            });

            $('#sandbox-container input').on('hide', function (e) {
                console.debug('hide', e.date, $(this).data('stickyDate'));
                var stickyDate = $(this).data('stickyDate');

                if (!e.date && stickyDate) {
                    console.debug('restore stickyDate', stickyDate);
                    $(this).datepicker('setDate', stickyDate);
                    $(this).data('stickyDate', null);
                }
            });
            $scope.uploadImage = function (file) {
                //////console.log('submit' + file)

                //////console.log(file)
                if (file) {
                    //////console.log('submit' + file)
                    file.upload = Upload.upload({
                        url: 'salesComps/addCompsImageManual',
                        data: {file: file },
                    });

                    file.upload.then(function (response) {
                        $timeout(function () {
                            file.result = response.data;
                            $scope.isSubmitting = true;
                            $scope.imagePath = file.result;
                            submitManualData();
                            //////console.log(file.result)
                        });
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }

            }

        }]

};
function _ngImageSelect() {
    return {
        link: function ($scope, el) {
            el.bind("change", function (e) {
                $scope.file = (e.srcElement || e.target).files;
                var ctx = document.getElementById('myCanvas').getContext('2d');
                ctx.clearRect(0, 0, 300, 130);
                var img = new Image();
                img.src = scope.filepreview;
                img.onload = function () {
                    ctx.drawImage(img, 0, 0);

                }

            })
        }
    }
}
function _fileinput() {
    return {
        scope: {
            fileinput: "=",
            filepreview: "=",

        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.fileinput = changeEvent.target.files[0];
                scope.filepreview = '';

                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        //////console.log(scope.fileinput)


                        scope.filepreview = loadEvent.target.result;
                        var ctx = document.getElementById('myCanvas').getContext('2d');
                        ctx.clearRect(0, 0, 300, 130);
                        var img = new Image();
                        img.src = scope.filepreview;
                        img.onload = function () {
                            ctx.drawImage(img, 0, 0);

                        }


                    });
                }
                reader.readAsDataURL(scope.fileinput);
            });
        }
    }
}

module.exports = { comparableComponent: _comparableComponent, fileinput: _fileinput, ngImageSelect: _ngImageSelect };