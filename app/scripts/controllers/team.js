/*jslint evil: true */
/*jshint -W083 */
"use strict";
SGPApp
    .controller("TeamController", ["$rootScope", "$scope","$location", "$stateParams","TeamService","Common","UserService","$q",function($rootScope, $scope,$location, $stateParams, TeamService, Common,UserService, $q) {

        var objService = TeamService;
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
            $scope._id = undefined;
            $scope.description = "";
            $scope.students = "";
            $rootScope.team = undefined;

        };

        $scope.loadData();

        $scope.edit = function(team) {
            $scope.editMode = true;
            if (team !== undefined){
                $scope._id = team._id;
                UserService.currentUser().then(function(user) {
                    objService.get(user, team._id)
                        .then(function(data) {
                            $scope.description = data.description;
                            $scope.students = data.students;
                        });
                });

            }else{
                $scope._id = undefined;
                $scope.description = "";
                $scope.students = "";
            }

        };

        $scope.viewStudents = function(team) {
            $rootScope.team = team;
            $location.path("student");
        };



        $scope.$watch('search', function(value) {
            if (value==="" || value===undefined){
                $("md-item-content").each(function(){
                    $(this).show(false);
                    $(this).next("md-divider").show(false);
                });
            }else{
                $("md-item-content").each(function(){
                    $(this).hide();
                    $(this).next("md-divider").hide();
                });
            }
            $(".searchable").each(function(){
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    $(this).closest("md-item-content").show();
                    $(this).closest("md-item-content").next("md-divider").show();
                }
            });
        });

        $scope.save = function() {
            if ($scope.description!==""){
                var objSend = {};

                objSend._id = angular.isUndefined($scope._id) ? Common.generateUUID() : $scope._id;
                objSend["description"] = $scope.description;
                objSend["students"] = $scope.students;

                UserService.currentUser().then(function(user) {
                    objService.save(user, objSend)
                        .then(function(data) {
                            $scope.loadData();
                            Common.showToastMessage("Dados atualizados com sucesso !");

                        });
                });

            }else{
                Common.showToastMessage("Favor preencher a descrição !","warning");
            }

        };

    }]);






