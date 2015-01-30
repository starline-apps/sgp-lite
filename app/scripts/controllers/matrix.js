SGPApp
    .controller('MatrixController', function($scope, $rootScope,$sce, $http, $location, $translate, Common, ParamService) {

    var objService = ParamService;


    $scope.loadData = function(){
      $rootScope.loadingContent = true;
      objService.get("matrix").then(function (dataSet) {
          if (!dataSet.data){
            $scope.matrix = [];
          }else{
            $scope.matrix = dataSet.data;
          }
          $scope.key = "matrix";

        });
    };

    $scope.loadData();


    $scope.save = function(){
      $rootScope.loadingContent = true;

      var obj = {key:$scope.key, data:$scope.matrix};

      objService.save(obj).then(function (dataSet) {

        $scope.loadData();
        Common.showToastMessage("Dados atualizados com sucesso !");

      });
    };

    $scope.addParent = function(){
        var arr = [];


        for (var y=0 ; y<$scope.matrix.length ; y++){
          if ($scope.matrix[y]!=""){
            arr.push($scope.matrix[y]);
          }
        }

        arr.push({
          guid:Common.generateUUID(),
          description:"",
          children:[]
        });
        $scope.matrix = arr;
    };

    $scope.addChild = function(parentIndex){
      $scope.matrix[parentIndex].children.push({
        guid:Common.generateUUID(),
        description:""
      });


    };
    $scope.removeChild = function(parentIndex, childIndex){
      if (childIndex!=undefined){
        var arr = [];
        $scope.matrix[parentIndex].children[childIndex] = "";
        for (var y=0 ; y<$scope.matrix[parentIndex].children.length ; y++){
          if ($scope.matrix[parentIndex].children[y]!=""){
            arr.push($scope.matrix[parentIndex].children[y]);
          }
        }
        $scope.matrix[parentIndex].children = arr;
      }else{
        var arr = [];
        $scope.matrix[parentIndex] = "";
        for (var y=0 ; y<$scope.matrix.length ; y++){
          if ($scope.matrix[y]!=""){
            arr.push($scope.matrix[y]);
          }
        }
        $scope.matrix = arr;
      }


    };

});
