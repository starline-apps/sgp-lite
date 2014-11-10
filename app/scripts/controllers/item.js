/*jslint evil: true */
/*jshint -W083 */
"use strict";
var refreshResult, refreshExamTime, examListInterval, examResultInterval;
BeetApp
    .controller("ItemController", ["$rootScope", "$scope", "$stateParams","ItemService","Common",function($rootScope, $scope, $stateParams, ItemService, Common) {
        /** View attributes **/
// setup editor options
            // Editor options.
        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false
        };

        $scope.num_alternatives = 1;

        var objService = ItemService;
        $rootScope.loadingContent = true;

        $scope.loadData = function(){
            $scope.editMode = false;
            $scope.dataSource = undefined;

            objService.getAll()
                .then(function(allData) {
                    $scope.dataSource = allData;
                });

        };

        $scope.loadData();

        $scope.setEditMode = function(_id) {
            $scope.editMode = true;
            if (_id !== undefined){
                $scope._id = _id;
                objService.get(_id)
                    .then(function(data) {
                        $scope.description = data.data.description;
                        $scope.observation = data.data.observation;
                    });
            }else{
                $scope._id = undefined;
                $scope.description = "";
                $scope.observation = "";
            }

        };

        $scope.save = function() {

            var objSend = {};
            objSend["data"] = {};

            objSend["data"]["description"] = $scope.description;
            objSend["data"]["observation"] = $scope.observation;

            if ($scope._id != undefined){
                objService.update(objSend, $scope._id)
                    .then(function(data) {
                        $scope.loadData();
                        Common.showToastMessage("Dados cadastrados com sucesso !");

                    });
            }else{
                objService.create(objSend)
                    .then(function(data) {
                        $scope.loadData();
                        Common.showToastMessage("Dados cadastrados com sucesso !");
                    });
            }
        };


    }]);






