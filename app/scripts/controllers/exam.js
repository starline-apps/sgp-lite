/*jslint evil: true */
/*jshint -W083 */
"use strict";
var refreshResult, refreshExamTime, examListInterval, examResultInterval;
BeetApp
    .controller("ExamController", ["$rootScope", "$scope", "$stateParams","ExamService","Common",function($rootScope, $scope, $stateParams, ExamService, Common) {
        /** View attributes **/

        var objService = ExamService;
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
                        $scope.num_alternatives = data.data.num_alternatives;
                        $scope.enunciado = data.data.enunciado;
                    });
            }else{
                $scope._id = undefined;
                $scope.description = "";
                $scope.observation = "";
                $scope.enunciado = "";
                $scope.num_alternatives = 1;
            }

        };

        $scope.save = function() {

            var objSend = {};
            objSend["data"] = {};

            objSend["data"]["description"] = $scope.description;
            objSend["data"]["observation"] = $scope.observation;
            objSend["data"]["enunciado"] = $scope.enunciado;
            objSend["data"]["num_alternatives"] = $scope.num_alternatives;

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






