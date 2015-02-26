/*jslint evil: true */
/*jshint -W083 */
"use strict";
SGPApp
	.controller("StudentController", ["$rootScope", "$scope", "$stateParams","StudentService","Common","UserService","TeamService",function($rootScope, $scope, $stateParams, StudentService, Common, UserService, TeamService) {

		var objService = StudentService;


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
							objService.getByTeam(user, $rootScope.team._id)
								.then(function (allData) {
									$scope.students = allData;
									$rootScope.loadingContent = false;

								});
						}
					});
			});
		};

		$scope.loadData();

		$scope.delete = function(item) {

			if (confirm("Deseja excluir este item ?")){
				var objSend = {};
				objSend[item._id] = {
					"isDeleted":0,
					"name":item.name,
					"code":item.code,
					"lastModified":Common.getTimestamp()
				};
				objSend._id = item._id;
				objSend.teamId = $rootScope.team._id;
				$rootScope.loadingContent = true;
				UserService.currentUser().then(function(user) {
					objService.delete(user, objSend)
						.then(function(data) {
							$scope.loadData();
						});
				});
			}

		};
		$scope.edit = function(student) {
			$rootScope.loadingContent = true;
			if ($rootScope.team!==undefined){
				if ($rootScope.team._id!==undefined){
					$scope.editMode = true;

					if (student._id !== undefined) {
						$scope._id = student._id;
						$scope.name = student.name;
						$scope.code = student.code;
						$rootScope.loadingContent = false;
					}else{
						$scope._id = undefined;
						$scope.name = "";
						$scope.code = "";
						$rootScope.loadingContent = false;
					}

				}else{
					Common.showToastMessage("Favor escolher a turma !", "warning");
					$rootScope.loadingContent = false;
				}
			}else{
				Common.showToastMessage("Favor escolher a turma !", "warning");
				$rootScope.loadingContent = false;
			}


		};

		$scope.setTeam = function(team) {
			$rootScope.team = team;
			$scope.loadData();

		};

		$scope.save = function() {
			$rootScope.loadingContent = true;
			var objSend = {};
			var timestamp = Common.getTimestamp();
			var _id = ($scope._id != undefined) ? $scope._id : Common.generateUUID();

			objSend[_id] = {
				"isDeleted":0,
				"name":$scope.name,
				"code":$scope.code,
				"lastModified":timestamp
			};
			objSend._id = _id;
			objSend.teamId = $rootScope.team._id;

			if (!isNotEmpty($scope["name"])){
				Common.showToastMessage("Favor preencher o nome !","warning");
				$rootScope.loadingContent = false;
			}else if (!isNotEmpty($scope["code"])){
				Common.showToastMessage("Favor preencher o código !","warning");
				$rootScope.loadingContent = false;
			}else{
				UserService.currentUser().then(function(user) {

					objService.save(user, objSend)
						.then(function(data) {
							$scope.loadData();
							Common.showToastMessage("Dados atualizados com sucesso !");

						});
				});
			}
		};



		function isNotEmpty(str){

			if (str===undefined){
				return false;
			}
			if (str===null){
				return false;
			}
			if (str===""){
				return false;
			}
			return true;
		}
	}]);






