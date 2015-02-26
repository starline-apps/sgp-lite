/*jslint evil: true */
/*jshint -W083 */
"use strict";
SGPApp
	.controller("UserFreeController", ["$rootScope", "$scope","$location", "$stateParams","User","Common","UserService","$q",function($rootScope, $scope,$location, $stateParams, User, Common,UserService, $q) {

		var objService = User;
		$rootScope.loadingContent = false;

		$scope.loadData = function(email){
			$scope.editMode = false;
			$scope.dataSource = undefined;
			$rootScope.loadingContent = true;
			if (Common.isEmpty(email)){
				Common.showToastMessage("E-mail inválido !", "warning");
				$rootScope.loadingContent = false;
			}else{
				UserService.currentUser().then(function(user) {
					objService.get(email)
						.then(function(allData) {
							if (Common.isEmpty(allData)){
								Common.showToastMessage("E-mail não encontrado !", "warning");
								$rootScope.loadingContent = false;
							}else{
								$scope.dataSource = [allData];
								$rootScope.loadingContent = false;
							}

						});
				});
			}


		};


		$scope.edit = function(user) {
			$scope.editMode = true;
			if (user !== undefined){
				$scope.email = user.userEmail;
			}else{
				$scope.email = undefined;
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

		$scope.save = function() {
			if (!Common.isEmpty($scope.plan)){
				var objSend = {};

				objSend["plan"] = $scope.plan;
				objSend["email"] = $scope.email;

				UserService.currentUser().then(function(user) {
					objService.userFree(objSend)
						.then(function(data) {
							if (data.error!=undefined){
								Common.showToastMessage("Tente novamente mais tarde !", "warning");
							}else{
								$scope.loadData($scope.email);
								Common.showToastMessage("Dados atualizados com sucesso !");

							}
						});
				});

			}else{
				Common.showToastMessage("Favor preencher o plano !","warning");
			}

		};
		$scope.getDate = function(data){
			if (Common.isEmpty(data)){
				return "--";
			}else{
				var d = new Date(parseFloat(data.toString() + "000"));
				return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
			}

		}
	}]);






