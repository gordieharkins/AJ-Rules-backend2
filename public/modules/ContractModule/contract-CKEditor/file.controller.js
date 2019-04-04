'use strict';

_ContractTest.$inject = ["$scope", "$location", "$location", "$state", "UtilService"];
module.exports = { ContractTest: _ContractTest, ckEditor: _ckEditor };

//angular.module('AOTC')
//    .controller('ContractTest',_ContractTest
//    )

//.directive('ckEditor', _ckEditor
//    );

function _ContractTest($scope, $location, $state, UtilService) {
    //////console.log("ContractTest");

    $scope.checkValues = function () {
        //////console.log(
         //   $scope.content
       // );
    }

    $scope.content = '<strong>Some Content</strong>';
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
        //////console.log('done I am ready')

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

        //////console.log($scope.FileNames)
        //////console.log($scope.fileData)

        // Parsing is done. Update UI.
        $scope.$apply();
        $('#uploadedContracts').modal('toggle');
    }

    $scope.uploadSelectedFiles = function () {

        //////console.log($scope.FileNames)
        //////console.log($scope.fileData)

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
                //////console.log('instanceReady')

                ck.setData(ngModel.$viewValue);


                CKEDITOR.document.getById('contactList').on('dragstart', function (evt) {

                    var target = evt.data.getTarget().getAscendant('div', true);
                    CKEDITOR.plugins.clipboard.initDragDataTransfer(evt);

                    var dataTransfer = evt.data.dataTransfer;
                    // //////console.log('data is => ', target.data('contact'))
                    // //////console.log('data is => ', CONTACTS[target.data('contact')])

                    // dataTransfer.setData('contact', CONTACTS[target.data('contact')]);
                    dataTransfer.setData('text/html', target.getText());


                });



                CKEDITOR.document.getById('contactList2').on('dragstart', function (evt) {
                    var target = evt.data.getTarget().getAscendant('div', true);
                    CKEDITOR.plugins.clipboard.initDragDataTransfer(evt);

                    var dataTransfer = evt.data.dataTransfer;
                    // //////console.log('data is => ', target.data('contact'))
                    // //////console.log('data is => ', CONTACTS[target.data('contact')])

                    dataTransfer.setData('contact', CONTACTS[target.data('contact')]);
                    dataTransfer.setData('text/html', target.getText());


                });

            });

            ngModel.$render = function () {
                //////console.log("render");

                ck.setData(ngModel.$viewValue);
            };

            ck.on('change', updateModel);
            ck.on('key', updateModel);
            ck.on('dataReady', updateModel);

            ck.on('dragstart', function (evt) {
                //////console.log("dragstart");
            });

            ck.on('dragenter', function (evt) {
                //////console.log("dragenter");
            });

            ck.on('dragover', function (evt) {
                //////console.log("dragover");
            });



            function updateModel() {
                //////console.log('updateModel')
                scope.$apply(function () {
                    ngModel.$setViewValue(ck.getData());
                });
            }

            var CONTACTS = [
                { name: 'Huckleberry Finn', tel: '+48 1345 234 235', email: 'h.finn@example.com', avatar: 'hfin' },
                { name: 'D\'Artagnan', tel: '+45 2345 234 235', email: 'dartagnan@example.com', avatar: 'dartagnan' },
                { name: 'Phileas Fogg', tel: '+44 3345 234 235', email: 'p.fogg@example.com', avatar: 'pfog' },
                { name: 'Alice', tel: '+20 4345 234 235', email: 'alice@example.com', avatar: 'alice' },
                { name: 'Little Red Riding Hood', tel: '+45 2345 234 235', email: 'lrrh@example.com', avatar: 'lrrh' },
                { name: 'Winnetou', tel: '+44 3345 234 235', email: 'winnetou@example.com', avatar: 'winetou' },
                { name: 'Edmond Dantès', tel: '+20 4345 234 235', email: 'count@example.com', avatar: 'edantes' },
                { name: 'Robinson Crusoe', tel: '+45 2345 234 235', email: 'r.crusoe@example.com', avatar: 'rcrusoe' }
            ];



            CKEDITOR.disableAutoInline = true;

            // Implements a simple widget that represents contact details (see http://microformats.org/wiki/h-card).
            CKEDITOR.plugins.add('hcard', {
                requires: 'widget',

                init: function (editor) {
                    //////console.log('init editor');

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
                        //////console.log('paste');
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