"use strict";
SGPApp
    .controller("PaymentLoginController", ["$scope","$rootScope", "$state", "Common","Login","auth", function ($scope,$rootScope, $state, Common, Login,auth) {
        $scope.formData = {};

        $rootScope.payment = true;

        if (!auth.isAuthenticated) {
            auth.signin({
                popup: true,
                standalone:true,
                icon:           "images/sgp_logo_toolbar.png",
                showIcon:       true
            }, function () {

                setTimeout(function () {
                    $rootScope.session = auth;
                    console.log($rootScope.session);
                        loadData();
                }, 1000);

            }, function () {
                // Error callback
            });

        }else{
            setTimeout(function () {
                Common.loadingPage();
                $rootScope.session = auth;
                $state.transitionTo("main");
            }, 1000);
        }


        function loadData(data){


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
    .controller("PaymentController", ["$scope","$rootScope", "$state", "Common","Login","auth", function ($scope,$rootScope, $state, Common, Login,auth) {
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


    }]);