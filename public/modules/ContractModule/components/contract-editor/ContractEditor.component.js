'use strict';




//angular.module('AOTC')
//    .component('contractEditor', _contractEditor)
//    .directive('ckEditor', ['$timeout', directiveFunction]);

var _contractEditor = {
    templateUrl: 'modules/ContractModule/components/contract-editor/contract-editor.html',
    controllerAs: 'ContractEditor',
    controller: ["$scope", "$timeout", "$location", "$state", "UtilService", "newContractService", "$stateParams", "$rootScope", controllerFunction]
    //end of component
};

function controllerFunction($scope, $timeout, $location, $state, UtilService, newContractService, $stateParams, $rootScope) {

    $scope.content = '';
    $scope.contractFiles = [];
    $scope.financialAndNonFinancialTerms = [];
    $scope.contractId = $stateParams.id || null;
    $scope.IsViewMode = $stateParams.id ? true : false;

    $scope.saveDatatoService = function (data) {
        newContractService.dataContent = data;
    };

    var articles = [
        { name: 'Test Clause 1', description: '</br><p>00.00&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; A standard contract for the construction of a house will contain drawings and specifications as approved by the Board, General Conditions for the execution of the Works which include the house itself and the exterior works such as the septic tank, drainage, water cistern, access roads and landscaping where required.</p>' },
        { name: 'Test Clause 2', description: '<p>&nbsp;</p><p>00.00&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The plans drawn are in accordance with the requirements of the Board and the relevant Regulations in all respects, and include adequate information on items such as the structure of the building, electricity, plumbing, septic tank, drainage, water cistern and guttering, access roadways, landscaping and descriptions of the materials to be used.&nbsp;&nbsp;</p>' },
        { name: 'Choice of Law and Forum Clause', description: 'this agreement shall be interpreted under the laws..' }
    ];
    $scope.articles = articles;
    //name: name,
    //content: $scope.content,
    //agenttName: agenttName,
    //status: 'NotStarted'

    $scope.savedContract = newContractService.getContractData($scope.contractId);


    //Assigning Data to scope variables
    try {
        //$scope.contractName = $scope.savedContract.contractName;
        //$scope.agentName = $scope.savedContract.agentName;
        //$scope.content = $scope.savedContract.body;

        if ($scope.contractId) {
            getContractsByUserId();
        }

        function getContractsByUserId() {
            $('#preloader').css('display', 'block');

            newContractService.getContractsByUserId($scope.contractId)
                .then(function (response) {
                    $('#preloader').css('display', 'none');
                    //copy id to contracts objects
                    //gridOptions.rowData = addID(response.result);
                    //newContractService.contractDataByUserId = addID(response.result);
                    //newContractService.contractDataByUserId = response.result.contract.properties;

                    //financialTerms

                    newContractService.contractDataByUserId = response.result;

                    $rootScope.$broadcast('contractDataByUserId-added');

                    var _builder = newContractService.contractDataByUserId.contract.properties;

                    $scope.contractName = _builder.contractName;
                    $scope.agentName = _builder.agentName;
                    $scope.content = _builder.body;
                    //save data to fetch later
                    //newContractService.saveContractData(response.result);
                    //show ag-grid
                }, function (err) {
                    console.log(err);
                });
        };


    }
    catch (_e) { }

    //function addID(_data) {
    //    var _tempArray = [];
    //    angular.forEach(_data, function (_item) {
    //        _item.contracts['id'] = _item.id;
    //        _tempArray.push(_item.contracts);
    //    });
    //    return _tempArray;
    //}

    getContractFiles();

    $scope.$on('updateDocument', function (evt, args) {
        console.log(newContractService.getFinancialAndNonFinancialTerms());
        $scope.financialAndNonFinancialTerms = newContractService.getFinancialAndNonFinancialTerms();
        updateDocument();
    });


    function updateDocument() {
        // $scope.financialAndNonFinancialTerms;
        // $scope.content;
        for (var i = 0; i < $scope.financialAndNonFinancialTerms.length; i++) {
            var label = $scope.financialAndNonFinancialTerms[i].label;
            console.log('label=>', label);
            var matchedLabelIndex = findIndeces(label, $scope.content);
            if (matchedLabelIndex.startIndex) {
                console.log('data=>', matchedLabelIndex);
                $scope.content =
                    $scope.content.substring(0, matchedLabelIndex.startIndex) +
                    $scope.financialAndNonFinancialTerms[i].value +
                    $scope.content.substring(matchedLabelIndex.endIndex + 1, $scope.content.length)
            }
        }
        newContractService.dataContent = $scope.content;

    }

    function findIndeces(label, content) {

        var foundStartIndex = false;
        var validSyntax = true;
        var searchRecord = {};
        var record = {};

        var htmlContent = content;

        for (var i = 0; i < htmlContent.length; i++) {

            if (validSyntax && htmlContent[i] === "[" && htmlContent[i + 1] === "[") {
                // console.log('found startIndex' , htmlContent[i] , htmlContent[i+1] , i , i+1)
                // console.log('foundStartIndex' , foundStartIndex)
                if (foundStartIndex) {
                    validSyntax = false;
                    break;
                }
                foundStartIndex = true;
                searchRecord = {};
                searchRecord.startIndex = i;

            }

            if (validSyntax && htmlContent[i] === "]" && htmlContent[i + 1] === "]") {
                // console.log('found endIndex' , htmlContent[i] , htmlContent[i+1] , i , i+1)
                // console.log('foundStartIndex' , foundStartIndex)

                if (!foundStartIndex) {
                    validSyntax = false;
                    break;
                }
                foundStartIndex = false;
                searchRecord.endIndex = i + 1;
                searchRecord.text = htmlToPlaintext(htmlContent.substring(searchRecord.startIndex + 2, searchRecord.endIndex - 1)).trim();
                if (searchRecord.text == label.replace(/[^a-zA-Z ]/g, "").trim().toLowerCase()) {

                    record = searchRecord;
                    break;
                }
            }

        }
        console.log('validSyntax = ', validSyntax);
        if (foundStartIndex) {
            validSyntax = false;
            return null;
        }
        return record;
    }

    function htmlToPlaintext(text) {
        var plain = text ? String(text).replace(/<[^>]+>/gm, '') : '';
        var htmlHavingSpecialChar = htmlDecode(plain);
        var plainText = htmlHavingSpecialChar.replace(/[^a-zA-Z ]/g, "").toLowerCase()
        return plainText;
    }

    function htmlDecode(input) {

        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    //==================================== CONTRACT Modal =======================================================//
    $scope.saveSelection = -1;
    // $scope.saveContract = function (name, agenttName) {
    //     //if ($scope.saveSelection == 0) {
    //     //    saveContractFormat(name, agenttName);
    //     //}
    //
    //     if ($scope.saveSelection == 1) {
    //         saveNewContract(name, agenttName);
    //     }
    // }


    //========================== New Contract With Modal Open And Server Call =================================//
    $scope.openContractModel = function () {
        $scope.saveSelection = 1;
        $scope.contractLabel = 'New Contract.';
        $('#newFormat').modal('toggle');
    }

    function saveNewContract(name, agenttName) {

        var propIds = JSON.parse(localStorage.getItem('selectedPopertiesId'));
        //var json = {
        //    contractName: name,
        //    body: $scope.content,
        //    propertyId: propIds.join(','),
        //    terms: $scope.financialAndNonFinancialTerms
        //};

        var json = {
            name: name,
            content: $scope.content,
            agenttName: agenttName,
            status: 'NotStarted'
        };

        $('#preloader').css('display', 'block');

        newContractService.addContractTemplate(json) //addContract
            .then(function (response) {
                console.log(response);
                $('#preloader').css('display', 'none');
                $('#newFormat').modal('toggle');

                if (!response.success) {
                    $scope.$emit('danger', response.message);
                    return;
                }
                $scope.content = '';
                $scope.$emit('success', response.message);
                $timeout(function () {
                    $state.go('SavedContractList');
                }, 2000);

            }, function (err) {
                $('#preloader').css('display', 'none');
                console.log(err);
            });

    }


    //========================== New Contract Format With Modal Open And Server Call =================================//

    $scope.openContractFormatModel = function () {

        $scope.saveSelection = 0;
        $scope.contractLabel = 'New Contract Format.';
        $('#newFormat').modal('toggle');

    }


    function saveContractFormat(name, agenttName) {
        var json = {
            name: name,
            content: $scope.content,
            agenttName: agenttName,
            status: 'NotStarted'
        };

        $("#preloader").css("display", "block");
        newContractService.addContractTemplate(json)
            .then(function (response) {
                $('#preloader').css('display', 'none');
                $('#newFormat').modal('toggle');
                console.log(response);

                if (!response.success) {
                    return;
                }

                $scope.$emit('success', response.message);
                $scope.content = '';

                getContractFiles();
            }, function (err) {
                $('#preloader').css('display', 'none');
                console.log(err);
            });

    }

    function getContractFiles() {

        $("#preloader").css("display", "block");
        newContractService.getContracts()
            .then(function (response) {
                $('#preloader').css('display', 'none');

                console.log(response);
                $scope.contractFiles = [];

                if (!response.success) {
                    return;
                }

                $scope.contractFiles = response.result;

            }, function (err) {
                $('#preloader').css('display', 'none');
                console.log(err);
            });

    }

    $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
    };

    $scope.clearFile = function () {
        UtilService.clearFile();
    };

    $scope.onReady = function () {
        console.log('done I am ready')
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
            then(function (result) {
                console.log(result);
                $('#uploadedContracts').modal('toggle');


                $("#preloader").css("display", "none");
                $scope.$emit('success', result.data.message);
                getContractFiles();

            }, function (err) {

                $("#preloader").css("display", "none");
                console.log(result);

            });

        }
    }



    //end of controller
}

function directiveFunction($timeout) {
    return {
        require: '?ngModel',
        link: function (scope, elm, attr, ngModel) {
            var config = {
                allowedContent: true,
                height: 450
                // toolbar: [
                //     {name: 'clipboard',   groups: [ 'clipboard', 'undo' ] , items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
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
                console.log('instanceReady')

                // ck.setData(ngModel.$viewValue);


                CKEDITOR.document.getById('contactList').on('dragstart', function (evt) {

                    var target = evt.data.getTarget().getAscendant('div', true);
                    CKEDITOR.plugins.clipboard.initDragDataTransfer(evt);

                    var dataTransfer = evt.data.dataTransfer;
                    console.log('data is => ', target.data('contact'))
                    // console.log('data is => ', CONTACTS[target.data('contact')])
                    // dataTransfer.setData('contact', CONTACTS[target.data('contact')]);
                    // dataTransfer.setData('text/html', target.getText());

                    dataTransfer.setData('text/html', scope.articles[target.data('contact')].description);


                });



                CKEDITOR.document.getById('contractList').on('dragstart', function (evt) {

                    var target = evt.data.getTarget().getAscendant('div', true);
                    CKEDITOR.plugins.clipboard.initDragDataTransfer(evt);
                    var dataTransfer = evt.data.dataTransfer;

                    dataTransfer.setData('text/html', scope.contractFiles[target.data('contact')].body);

                });

            });

            ngModel.$render = function () {
                console.log("render");

                ck.setData(ngModel.$viewValue);
            };

            ck.on('change', updateModel);
            ck.on('key', updateModel);
            ck.on('dataReady', updateModel);

            ck.on('dragstart', function (evt) {
                console.log("dragstart");
            });

            ck.on('dragenter', function (evt) {
                console.log("dragenter");
            });

            ck.on('dragover', function (evt) {
                console.log("dragover");
            });

            function updateModel() {
                console.log('updateModel')
                $timeout(function () {
                    ngModel.$setViewValue(ck.getData());
                }, 200);
                // scope.$apply(function() {
                //     ngModel.$setViewValue(ck.getData());
                // });
            }

            CKEDITOR.disableAutoInline = true;
            // Implements a simple widget that represents contact details (see http://microformats.org/wiki/h-card).
            // CKEDITOR.plugins.add('hcard', {
            //     requires: 'widget',
            //
            //     init: function(editor) {
            //         console.log('init editor');
            //
            //         editor.widgets.add('hcard', {
            //             allowedContent: 'span(!h-card); a[href](!u-email,!p-name); span(!p-tel)',
            //             requiredContent: 'span(h-card)',
            //             pathName: 'hcard',
            //
            //             upcast: function(el) {
            //                 return el.name == 'span' && el.hasClass('h-card');
            //             }
            //         });
            //
            //         // This feature does not have a button, so it needs to be registered manually.
            //         editor.addFeature(editor.widgets.registered.hcard);
            //
            //         // Handle dropping a contact by transforming the contact object into HTML.
            //         // Note: All pasted and dropped content is handled in one event - editor#paste.
            //         editor.on('paste', function(evt) {
            //             console.log('paste');
            //             var contact = evt.data.dataTransfer.getData('contact');
            //             if (!contact) {
            //                 return;
            //             }
            //
            //             evt.data.dataValue =
            //                 '' +
            //                 '' + contact.name + '' +
            //                 ' ' +
            //                 '' + contact.tel + '' +
            //                 '';
            //         });
            //     }
            // });
        }
    };
}

directiveFunction.$inject = ["$timeout"];
module.exports = { contractEditor: _contractEditor, directiveFunction: directiveFunction };