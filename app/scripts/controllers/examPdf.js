/*jslint evil: true */
/*jshint -W083 */
"use strict";
SGPApp
    .controller("ExamPdfController", ["$rootScope", "$scope","$location", "$stateParams","ExamService","Common","UserService","ItemService","$q",function($rootScope, $scope,$location, $stateParams, ExamService, Common,UserService, ItemService, $q) {
        /** View attributes **/

        var objService = ExamService;
        $rootScope.loadingContent = true;

        $scope.editMode = false;
        $scope.printMode = false;
        $scope.dataSource = undefined;
        $rootScope.loadingContent = true;
        $rootScope.loadingApp = false;
        $rootScope.login = false;
        var user = {email:$stateParams.email};
        var guid = $stateParams.guid;
        objService.get(user, guid).then(function(exam) {
          objService.getPrintableVersion(user, exam).then(function(data){
            $scope.printMode = true;
            $scope.printData = data;

            setTimeout(function(){

              $("#printCommands").hide();
              $("#header").hide();
              $("#footer").hide();
              $("#container").hide();
              $("#printWindow").show();
              document.getElementById("printWindow").innerHTML = document.getElementById("divPrint").innerHTML;
              $rootScope.loadingContent = false;


            },2000);

            });
          });


    }]);






