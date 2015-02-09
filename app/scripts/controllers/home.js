SGPApp
  .controller('HomeController', ["$scope", "$rootScope", "$sce", "$http", "$location", "$translate", "Common", function($scope, $rootScope,$sce, $http, $location, $translate, Common) {
    delete $rootScope.exam;
    delete $rootScope.team;

  }]);
