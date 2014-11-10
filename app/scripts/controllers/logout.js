SGPApp
    .controller('LogoutController', function($scope, $http, $location, Login) {

        $scope.formData = {};

        Login.logout()
            .success(function (data) {
                $location.path('logout');
            })
            .error(function (error) {

            });
            

    });