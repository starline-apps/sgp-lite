/*jslint evil: true */
/*jshint -W083 */
"use strict";
SGPApp
    .controller("AccountController", ["$rootScope", "$scope","$location", "$stateParams","Common","UserService","User","ExamService", "ItemService","TeamService","$q",function($rootScope, $scope,$location, $stateParams, Common,UserService,User, ExamService, ItemService, TeamService, $q) {

    var objService = User;
    $rootScope.loadingContent = true;


    $rootScope.infos = [
      {
        "description" : "Créditos Restantes",
        "background_color":"green",
        "text_color":"black",
        "value":""
      },
      {
        "description" : "Total de Correções Feitas",
        "background_color":"red",
        "text_color":"white",
        "value":""
      },
      {
        "description" : "Total de Provas Cadastradas",
        "icon_class" : "glyphicon glyphicon-cog",
        "flat_icon":"correction",
        "background_color":"grey",
        "text_color":"white",
        "value":""
      },
      {
        "description" : "Total de Questões Cadastradas",
        "url" : "help",
        "background_color":"purple",
        "text_color":"white",
        "value":""
      },
      {
        "description" : "Total de Turmas Cadastradas",
        "background_color":"blue",
        "text_color":"white",
        "value":""
      },
      {
        "description" : "Total de Alunos Cadastrados",
        "icon_class" : "glyphicon glyphicon-cog",
        "flat_icon":"correction",
        "background_color":"yellow",
        "text_color":"black",
        "value":""
      },
      {
        "description" : "Ultima atualização",
        "url" : "help",
        "background_color":"green",
        "text_color":"black",
        "value":""
      }
    ];

    UserService.currentUser().then(function(user) {
      objService.get(user.email)
        .then(function(obj) {
          $scope.userEmail = obj.userEmail;
          $scope.subscriptionExpirationDate = timestampToDate(obj.subscriptionExpirationDate);
          $rootScope.infos[0].value = obj.creditBalance;
          $rootScope.infos[6].value = timestampToDate(obj.lastWritten);

          $rootScope.loadingContent = false;

          ItemService.getAllLength(user).then(function(length){
            $rootScope.infos[3].value = length;
          });
          ExamService.getAll(user).then(function(arrExams){
            $rootScope.infos[2].value = arrExams.length;
          });
          TeamService.getAll(user).then(function(arrTeams){
            $rootScope.infos[4].value = arrTeams.length;
          });

        });
    });

    function timestampToDate(timestamp){
      var d = new Date(timestamp * 1000);
      var day = d.getDate().toString().length===1 ? "0"+d.getDate() : d.getDate();
      var month = (d.getMonth()+1).toString().length===1 ? "0"+(d.getMonth()+1) : (d.getMonth()+1) ;
      return day + '/' + month + '/' + d.getFullYear();

    }

    }]);






