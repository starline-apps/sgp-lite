"use strict";
SGPApp
    .controller("PaymentLoginController", ["$scope","$rootScope", "$state", "Common","auth","User", function ($scope,$rootScope, $state, Common,auth, User) {
        $scope.formData = {};

        $rootScope.payment = true;

        if (!auth.isAuthenticated) {
            auth.signin({
                popup: true,
                standalone:true,
                icon:           "images/sgp_logo_toolbar.png",
                showIcon:       true
            }, function () {
                    loadData();
            }, function () {
                // Error callback
            });

        }else{
                loadData();
        }

        function loadData(){
            User.get(auth.profile.email).then(function(data){
                if (data!=null){
                    if(data.isSubscribed.toString()=="1"){
                        $state.transitionTo('login');
                    }else{
                        done();
                    }

                }else{
                    User.save(auth.profile).then(function(data){
                        done();
                    });
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
    .controller("PaymentController", ["$scope","$rootScope", "$state", "Common","auth", function ($scope,$rootScope, $state, Common,auth) {
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