SGPApp
    .controller('SignupController', function($scope, $http, $location, Signup) {

        $scope.formData = {};
        hideMenus();

        $scope.signup = function() {

            if ($scope.formData.email != undefined) {

                Signup.post($scope.formData)

                    .success(function(data) {
                        showMenus();
                        $location.path('home');
                    })
                    .error(function(data) {
                        alert("Login inválido");
                    });
            }
        };

    });