/*jslint evil: true */
/*jshint -W083 */
"use strict";
var refreshResult, refreshExamTime, examListInterval, examResultInterval;
SGPApp
    .controller("ExamController", ["$rootScope", "$scope","$location", "$stateParams","ExamService","Common","UserService",function($rootScope, $scope,$location, $stateParams, ExamService, Common,UserService) {
        /** View attributes **/

        var objService = ExamService;
        $rootScope.loadingContent = true;

        $scope.loadData = function(){
            $scope.editMode = false;
            $scope.dataSource = undefined;
            $rootScope.loadingContent = true;
            UserService.currentUser().then(function(user) {

                objService.getAll(user)
                    .then(function(allData) {
                        $scope.dataSource = allData;
                        $rootScope.loadingContent = false;
                    });
            });


        };

        $scope.loadData();

        $scope.edit = function(exam) {
            $scope.editMode = true;
            if (exam !== undefined){
                $scope._id = exam._id;
                UserService.currentUser().then(function(user) {
                    objService.get(user, exam._id)
                        .then(function(data) {
                            $scope.description = data.description;
                            $scope.observation = data.observation;
                        });
                });

            }else{
                $scope._id = undefined;
                $scope.description = "";
                $scope.observation = "";
            }

        };

        $scope.viewItems = function(exam) {
            $rootScope.exam = exam;
            $location.path("item");

        };



        $scope.save = function() {

            var objSend = {};

            objSend._id = angular.isUndefined($scope._id) ? Common.generateUUID() : $scope._id;
            objSend["description"] = $scope.description;
            objSend["observation"] = $scope.observation;


            UserService.currentUser().then(function(user) {
                objService.save(user, objSend)
                    .then(function(data) {
                        $scope.loadData();
                        Common.showToastMessage("Dados atualizados com sucesso !");

                    });
            });

        };


    }]);






