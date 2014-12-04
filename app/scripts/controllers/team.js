/*jslint evil: true */
/*jshint -W083 */
"use strict";
var refreshResult, refreshExamTime, examListInterval, examResultInterval;
SGPApp
    .controller("TeamController", ["$rootScope", "$scope","$location", "$stateParams","TeamService","Common","UserService","$q",function($rootScope, $scope,$location, $stateParams, TeamService, Common,UserService, $q) {
        /** View attributes **/


        var objService = TeamService;
        $rootScope.loadingContent = true;

        $scope.loadData = function(){
            $scope.editMode = false;
            $scope.printMode = false;
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
            $scope.points = "";
            $scope.tags = "";
            $scope.arrTags = [];
            $rootScope.exam = undefined;
            $scope.headerIndex = null;
            $scope.tagIndex = null;

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
                        });
                });

            }else{
                $scope._id = undefined;
                $scope.description = "";
            }

        };

        $scope.viewItems = function(exam) {
            $rootScope.exam = exam;
            $location.path("item");
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

        $scope.getAnswerSheet = function(exam){
            var sheetId = exam.answerSheetID!==null ? exam.answerSheetID : 1;
            window.open(
                $scope.answerSheets[sheetId.toString()].url,
                '_blank' // <- This is what makes it open in a new window.
            );

        };


        $scope.save = function() {
            if ($scope.description!==""){
                var objSend = {};

                objSend._id = angular.isUndefined($scope._id) ? Common.generateUUID() : $scope._id;
                objSend["description"] = $scope.description;

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






