/*jslint evil: true */
/*jshint -W083 */
"use strict";
SGPApp
    .controller("GradeController", ["$rootScope", "$scope","$location", "$stateParams","TeamService","GradeService","Common","UserService","$q",function($rootScope, $scope,$location, $stateParams, TeamService, GradeService, Common,UserService, $q) {

        var objService = GradeService;
        $rootScope.loadingContent = true;

        $scope.loadData = function(){
          $scope.editMode = false;
          $scope.students = undefined;
          $scope.teams = undefined;
          $rootScope.loadingContent = true;
          UserService.currentUser().then(function(user) {
            TeamService.getAll(user)
              .then(function (teamData) {
                $scope.teams = teamData;
                if ($rootScope.team === undefined) {
                  $rootScope.loadingContent = false;
                } else {
                  objService.getExamGradeByTeam(user, $rootScope.team._id)
                    .then(function (allData) {
                      $scope.exams = allData;
                      $rootScope.loadingContent = false;

                    });
                }
              });
          });
        };

        $scope.loadData();



        $scope.setTeam = function(team) {
          $rootScope.team = team;
          $scope.loadData();

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

    }]);






