'use strict';
_ContractTest.$inject = ["$scope", "$location", "$location", "$state", "UtilService"];
module.exports = { ContractTest: _ContractTest, ckEditor: _ckEditor };

//angular.module('AOTC')
//    .controller('ContractTest',_ContractTest
//    )

//.directive('ckEditor', _ckEditor
//    );

function _ContractTest($scope, $location, $state, UtilService) {
        getContractFiles();
    	
        $scope.checkValues = function() {
            //console.log(
                $scope.content
            );
        }

        $scope.openContractModel = function() {
            $('#newFormat').modal('toggle');
        }


        $scope.saveContractFormat = function(name) {
            var json = {
                name: name,
                content: $scope.content
            };

            $("#preloader").css("display", "block");
            newContractService.addContractTemplate(json)
                .then(function(response) {
                    $('#preloader').css('display', 'none');
            		$('#newFormat').modal('toggle');
                    //console.log(response);

                    if (!response.success) {
                        return;
                    }

                    $scope.$emit('success', response.message);
                     $scope.content = '';

                    getContractFiles();
                }, function(err) {
                    $('#preloader').css('display', 'none');
                    //console.log(err);
                });

        }



        $scope.content = '';
        $scope.contractFiles = [];

        function getContractFiles() {

            $("#preloader").css("display", "block");
            newContractService.getContracts()
                .then(function(response) {
                    $('#preloader').css('display', 'none');

                    //console.log(response);
                    $scope.contractFiles = [];

                    if (!response.success) {
                        return;
                    }

                    $scope.contractFiles = response.result;

                }, function(err) {
                    $('#preloader').css('display', 'none');
                    //console.log(err);
                });

        }



        var articles = [
            { name: 'Clause 1' },
            { name: 'Clause 2' },
            { name: 'Clause 3' },
            { name: 'Clause 4' },
            { name: 'Clause 5' },
            { name: 'Clause 6' },
            { name: 'Clause 7' },
            { name: 'Clause 8' },
            { name: 'Clause 9' },
            { name: 'Clause 10' }
        ];

    $scope.articles = articles;

    $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
    };

    $scope.clearFile = function () {
        UtilService.clearFile();
    };

    $scope.onReady = function () {
        ////console.log('done I am ready')

    };

    $scope.fileUploaded = function () {

        $scope.FileNames = [];
        var files = document.getElementById('file-1').files;
        $scope.fileData = files;

        for (var i = 0; i < files.length; i++) {
            $scope.FileNames.push({
                name: files[i].name
            });
        }

            // Parsing is done. Update UI.
            $scope.$apply();
            $('#uploadedContracts').modal('toggle');
        }

    $scope.uploadSelectedFiles = function () {

            if ($scope.fileData.length > 0) {
                $("#preloader").css("display", "block");

                newContractService.uploadContractsFiles($scope.fileData).
                then(function(result) {
                    //console.log(result);
                    $('#uploadedContracts').modal('toggle');


                    $("#preloader").css("display", "none");
                    $scope.$emit('success', result.data.message);
                    getContractFiles();

                }, function(err) {

                    $("#preloader").css("display", "none");
                    //console.log(result);

                });

            }


        }







    //end of controller
}


function _ckEditor() {
    return {
        require: '?ngModel',
        link: function (scope, elm, attr, ngModel) {
            var config = {
                allowedContent: true,
                height: 450
                // toolbar: [
                // 	   {name: 'clipboard',   groups: [ 'clipboard', 'undo' ] , items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                //     {name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', '-', 'RemoveFormat']},
                //     {name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']},
                //     {name: 'text-align', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
                //     {name: 'styles', items: ['Font', 'FontSize']},
                //     {name: 'colors', items: ['TextColor', 'BGColor']},
                //     {name: 'tools', items: ['Table', 'HorizontalRule', 'Maximize']},
                // ]
            };

            // elm[0].setAttribute('contenteditable', true);
            var ck = window.CKEDITOR.replace(elm[0], config);

            if (!ngModel) return;

            CKEDITOR.on('instanceReady', function () {
                ////console.log('instanceReady')

                ck.setData(ngModel.$viewValue);


                CKEDITOR.document.getById('contactList').on('dragstart', function (evt) {

                    var target = evt.data.getTarget().getAscendant('div', true);
                    CKEDITOR.plugins.clipboard.initDragDataTransfer(evt);

                        var dataTransfer = evt.data.dataTransfer;
                        // //console.log('data is => ', target.data('contact'))
                        // //console.log('data is => ', CONTACTS[target.data('contact')])
                        // dataTransfer.setData('contact', CONTACTS[target.data('contact')]);
                        dataTransfer.setData('text/html', target.getText());


                });



                    CKEDITOR.document.getById('contractList').on('dragstart', function(evt) {

                        var target = evt.data.getTarget().getAscendant('div', true);
                        CKEDITOR.plugins.clipboard.initDragDataTransfer(evt);
                        var dataTransfer = evt.data.dataTransfer;

                        dataTransfer.setData('text/html', scope.contractFiles[target.data('contact')].body);

                });

            });

            ngModel.$render = function () {
                ////console.log("render");

                ck.setData(ngModel.$viewValue);
            };

            ck.on('change', updateModel);
            ck.on('key', updateModel);
            ck.on('dataReady', updateModel);

            ck.on('dragstart', function (evt) {
                ////console.log("dragstart");
            });

            ck.on('dragenter', function (evt) {
                ////console.log("dragenter");
            });

            ck.on('dragover', function (evt) {
                ////console.log("dragover");
            });

                function updateModel() {
                    //console.log('updateModel')
                    scope.$apply(function() {
                        ngModel.$setViewValue(ck.getData());
                    });
                }

                CKEDITOR.disableAutoInline = true;
                // Implements a simple widget that represents contact details (see http://microformats.org/wiki/h-card).
                CKEDITOR.plugins.add('hcard', {
                    requires: 'widget',

                init: function (editor) {
                    ////console.log('init editor');

                    editor.widgets.add('hcard', {
                        allowedContent: 'span(!h-card); a[href](!u-email,!p-name); span(!p-tel)',
                        requiredContent: 'span(h-card)',
                        pathName: 'hcard',

                        upcast: function (el) {
                            return el.name == 'span' && el.hasClass('h-card');
                        }
                    });

                    // This feature does not have a button, so it needs to be registered manually.
                    editor.addFeature(editor.widgets.registered.hcard);

                    // Handle dropping a contact by transforming the contact object into HTML.
                    // Note: All pasted and dropped content is handled in one event - editor#paste.
                    editor.on('paste', function (evt) {
                        ////console.log('paste');
                        var contact = evt.data.dataTransfer.getData('contact');
                        if (!contact) {
                            return;
                        }

                        evt.data.dataValue =
                            '' +
                            '' + contact.name + '' +
                            ' ' +
                            '' + contact.tel + '' +
                            '';
                    });
                }
            });




        }
    };
}