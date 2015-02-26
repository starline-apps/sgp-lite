"use strict";
SGPApp
	.controller("PaymentMenuController", ["$scope","$rootScope", "$stateParams", "Common","auth","User", function ($scope,$rootScope, $stateParams, Common,auth, User) {
		$scope.formData = {};

		$rootScope.payment = true;
		$("#container").fadeOut("fast");

		loadData();


		function loadData(){
			var timestamp = parseInt(Common.getTimestamp()) - 86400;
			User.get(auth.profile.email).then(function(data){
				if (data!=null){

					done();


				}else{
					$state.transitionTo('login');
				}
			});
		}
		function done(){


			$rootScope.loadingApp = false;
			$rootScope.login = false;

			setTimeout(function(){
				$("#loadingApp").hide();
				$("#header").fadeIn("slow");
				$("#footer").fadeIn("slow");
				$rootScope.$apply();

			},2000);




		}
	}]);

SGPApp
	.controller("PaymentController", ["$scope","$rootScope", "$state", "Common","auth","Payment", function ($scope,$rootScope, $state, Common,auth, Payment) {
		$scope.descriptions = [
			{
				"text": "Correção automatica de Gabaritos"
			},
			{
				"text": "Criação de Turmas e Alunos"
			},
			{
				"text": "Sincronização das notas dentro do Aplicativo"
			},
			{
				"text": "Correção em segundos"
			}
		];

		$scope.descriptions2 = [
			{
				"text": "Criação do seu próprio Banco de Questões na WEB"
			},
			{
				"text": "Criação do seu próprio Banco de Provas na WEB"
			},
			{
				"text": "Diagramação automática das provas"
			},
			{
				"text": "Busca de questões por metadados"
			},
			{
				"text": "Criação automática de provas"
			},
			{
				"text": "Correção automática de Gabaritos"
			},
			{
				"text": "Criação de Turmas e Alunos"
			},
			{
				"text": "Sincronização das notas dentro do Aplicativo"
			},
			{
				"text": "Correção em segundos"
			}
		];


		$scope.pay = function(email, code){
			$scope.redirecting = true;
			Payment.getPaymentLink({email:email,code:code}).then(function(data){
				if (data.error!=undefined){
					Common.showToastMessage("Tente novamente mais tarde !", "warning");
					$scope.redirecting = false;
				}else{
					if (data.link!=undefined){
						console.log(data);
						window.location.href = data.link;
					}else{
						Common.showToastMessage("Tente novamente mais tarde !", "warning");
						$scope.redirecting = false;
					}
				}
			});
		}
	}]);
