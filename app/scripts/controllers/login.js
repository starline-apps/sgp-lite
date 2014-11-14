"use strict";
SGPApp
    .controller("LoginController", ["$scope","$rootScope", "$state", "Common","Login","auth", function ($scope,$rootScope, $state, Common, Login,auth) {
        $scope.formData = {};


        if (!auth.isAuthenticated) {
            auth.signin({
                popup: true,
                standalone:true,
                icon:           "images/sgp_logo_toolbar.png",
                showIcon:       true,
                dict:"pt-BR"
            }, function () {

                setTimeout(function () {
                    $rootScope.session = auth;
                    $rootScope.loadingApp = false;
                    $rootScope.login = false;

                    setTimeout(function(){
                        $("#loadingApp").hide();
                        $("#container").fadeIn("slow");
                        $("#header").fadeIn("slow");
                        $("#footer").fadeIn("slow");
                    },2000);
                    $state.transitionTo('home');
                }, 1000);

            }, function () {
                // Error callback
            });

        }else{
            setTimeout(function () {
                $rootScope.session = auth;
                $rootScope.loadingApp = false;
                $rootScope.login = false;

                setTimeout(function(){
                    $("#loadingApp").hide();
                    $("#container").fadeIn("slow");
                    $("#header").fadeIn("slow");
                    $("#footer").fadeIn("slow");
                },2000);
                $state.transitionTo('home');
            }, 1000);
        }

    }]);