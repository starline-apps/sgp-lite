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
			$rootScope.loadingContent = true;
			UserService.currentUser().then(function(user) {
				ExamService.get(user, exam._id).then(function (examData) {
					$scope.exam = examData;
					if (!Common.isEmpty($scope.team)){
						$scope.loadGrades();
					}else{
						$rootScope.loadingContent = false;
					}

				});
			});



		};

		$scope.printDiv = function(){
			$("#printCommands").hide();
			$("#printTitle").show();
			$("#header").hide();
			$("#footer").hide();
			$("#container").hide();
			$("#printWindow").show();
			document.getElementById("printWindow").innerHTML = document.getElementById("divPrint").innerHTML;
			window.print();
			$("#printWindow").hide();
			$("#printCommands").show();
			$("#header").show();
			$("#footer").show();
			$("#printTitle").hide();
			$("#container").show();

		};
	}]);






