"use strict";
BeetApp
    .controller("LoginController", ["$scope","$rootScope", "$state", "Common","Login", function ($scope,$rootScope, $state, Common, Login) {
        $scope.formData = {};



        $scope.checkLogin = function() {
            if ($scope.formData.email != undefined) {
                Login.post($scope.formData)
                    .success(function(data) {
                        $("#login").fadeOut("fast");
                        $("#loadingApp").fadeIn("slow");
                            setTimeout(function(){

                                loadData(data);
                            },3000);

                    })
                    .error(function(data) {
                        Common.showToastMessage("Dados Inválidos !");

                    });
            }
        };


        function loadData(data){
            $rootScope.session = {};
            $rootScope.session.user = data;
            Login.getCompanies()
                .success(function (companies) {
                    $rootScope.session.companies = companies;
                    $rootScope.session.company = companies[0];
                    $rootScope.session.menus = companies[0].menus;
                    $rootScope.session.menu = companies[0].menus[0];
                    $rootScope.loadingApp = false;
                    $rootScope.login = false;

                    setTimeout(function(){
                        $("#loadingApp").hide();
                        $("#container").fadeIn("slow");
                        $("#header").fadeIn("slow");
                        $("#footer").fadeIn("slow");
                    },2000);
                    $state.transitionTo('home');
                })
                .error(function (error) {

                });


        }
    }]);