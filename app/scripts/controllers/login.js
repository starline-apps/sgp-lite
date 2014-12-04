"use strict";
SGPApp
    .controller("LoginController", ["$scope","$rootScope", "$state", "Common","User","auth", function ($scope,$rootScope, $state, Common, User,auth) {
        $scope.formData = {};

        $rootScope.payment = false;
        function done(){
            setTimeout(function(){
                $("#loadingApp").hide();
                $("#container").fadeIn("slow");
                $("#header").fadeIn("slow");
                $("#footer").fadeIn("slow");
            },1000);
            $state.transitionTo('home');
        }

        function loadData(){
            $rootScope.session = auth;
            $rootScope.loadingApp = false;
            $rootScope.login = false;

            User.get(auth.profile.email).then(function(data){
                if (data!=null){
                    if(data.isSubscribed.toString()=="1"){
                        done();
                    }else{
                        alert("Sua assinatura não está ativa, ou seu pagamento ainda não foi processado !");
                        $state.transitionTo('payment');
                    }

                }else{
                    User.save(auth.profile).then(function(data){
                        alert("Sua assinatura não está ativa, ou seu pagamento ainda não foi processado !");
                        $state.transitionTo('payment');
                    });
                }
            });


        }

        if (!auth.isAuthenticated) {
            auth.signin({
                popup: true,
                standalone:true,
                icon:           "images/sgp_logo_toolbar.png",
                showIcon:       true,
                dict:"pt-BR"
            }, function () {

                setTimeout(function () {
                    loadData();
                }, 1000);

            }, function () {
                // Error callback
            });

        }else{
            setTimeout(function () {
                loadData();
            }, 1000);
        }

    }]);
SGPApp
  .controller("LogoutController", ["$scope","$rootScope", "$state", "Common","User","auth", function ($scope,$rootScope, $state, Common, User,auth) {
      auth.signout();
      window.location.href="/";

  }]);
