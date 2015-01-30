/*jslint evil: true */
/*jshint -W083 */
"use strict";
SGPApp
    .controller("GradeController", ["$rootScope", "$scope","$location", "$stateParams","TeamService","GradeService","Common","UserService","ExamService","$q",function($rootScope, $scope,$location, $stateParams, TeamService, GradeService, Common,UserService, ExamService, $q) {

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
                ExamService.getAll(user)
                  .then(function (examData) {
                    $scope.exams = examData;
                    $rootScope.loadingContent = false;

                  });
              });
          });
        };

        $scope.loadData();

        $scope.loadGrades = function(){
          $rootScope.loadingContent = true;
          UserService.currentUser().then(function(user) {


            objService.getExamGradeByTeam(user, $scope.exam, $scope.team)
              .then(function (allData) {
                $scope.students = allData;
                $rootScope.loadingContent = false;

              });
          });
        };


        $scope.setTeam = function(team) {
          $scope.team = team;
          if (!Common.isEmpty($scope.exam)){
            $scope.loadGrades();
          }
        };

        $scope.setExam = function(exam) {
          $scope.exam = exam;
          if (!Common.isEmpty($scope.team)){
            $scope.loadGrades();
          }
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






