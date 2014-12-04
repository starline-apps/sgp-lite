/*jslint evil: true */
/*jshint -W083 */
"use strict";
var refreshResult, refreshExamTime, examListInterval, examResultInterval;
SGPApp
    .controller("StudentController", ["$rootScope", "$scope", "$stateParams","StudentService","Common","UserService","TeamService",function($rootScope, $scope, $stateParams, StudentService, Common, UserService, TeamService) {

        var objService = StudentService;


        $scope.loadData = function(){
            $scope.editMode = false;
            $scope.students = undefined;
            $scope.teams = undefined;
            $rootScope.loadingContent = true;
            UserService.currentUser().then(function(user) {
                TeamService.getAll(user)
                    .then(function (teamData) {
                        $scope.teams = teamData;
                        if ($rootScope.team === undefined) {
                            $rootScope.loadingContent = false;
                        } else {
                            objService.getByTeam(user, $rootScope.team._id)
                                .then(function (allData) {
                                    $scope.students = allData;
                                    $rootScope.loadingContent = false;

                                });
                        }
                    });
            });
        };

        $scope.loadData();


        $scope.edit = function(item) {
            $rootScope.loadingContent = true;
            if ($rootScope.exam!==undefined){
                if ($rootScope.exam._id!==undefined){
                    $scope.editMode = true;
                    if (item !== undefined){
                        if (item._id !== undefined) {
                            $scope._id = item._id;
                            objService.getFile(item)
                                .then(function (data) {
                                    $scope.tags = data.tags;
                                    $scope.arrTags = data.tags.split(";");
                                    $scope.tags = data.tags;
                                    $scope.text = data.text;
                                    $scope.tagText = "";
                                    $scope.alternatives = data.alternatives;
                                    $scope.num_alternatives = data.alternatives.length;
                                    $rootScope.loadingContent = false;
                                });
                        }else{
                            $scope._id = undefined;
                            $scope.tags = "";
                            $scope.arrTags = [];
                            $scope.tagText = "";
                            $scope.text = item.text;
                            $scope.alternatives = item.alternatives;
                            $scope.num_alternatives = 5;
                            $scope.setNumAlternatives(5);
                            $rootScope.loadingContent = false;
                        }
                        $scope.order = item.order;
                    }else{
                        $scope._id = undefined;
                        $scope.tags = "";
                        $scope.arrTags = [];
                        $scope.tagText = "";
                        $scope.text = "";
                        $scope.num_alternatives = 5;
                        $scope.alternatives = [];
                        $scope.order = $scope.items.length+1;
                        $scope.setNumAlternatives(5);
                        $rootScope.loadingContent = false;
                    }
                }else{
                    Common.showToastMessage("Favor escolher a prova !", "warning");
                    $rootScope.loadingContent = false;
                }
            }else{
                Common.showToastMessage("Favor escolher a prova !", "warning");
                $rootScope.loadingContent = false;
            }


        };

        $scope.setTeam = function(team) {
            $rootScope.team = team;
            $scope.loadData();

        };


        $scope.save = function() {
            $rootScope.loadingContent = true;
            var objSend = {};
            objSend["guid"] = $rootScope.exam._id;
            objSend["tags"] = $scope.tags;
            objSend["text"] = $scope.text;
            objSend["order"] = $scope.order;
            objSend["num_alternatives"] = $scope.num_alternatives;
            objSend["alternatives"] = $scope.alternatives;
            objSend._id  = ($scope._id != undefined) ? $scope._id : Common.generateUUID();

            var blnAlternatives = false;

            for (var x=0 ; x<objSend.alternatives.length ; x++){
                if (objSend.alternatives[x].checked.toString()=="1"){
                    blnAlternatives = true;
                }
            }

            if (!isNotEmpty(objSend["tags"])){
                alert("Preencha as Tags");
                Common.showToastMessage("Favor preencher ao menos uma tag !","warning");
                $rootScope.loadingContent = false;
            }else if (!isNotEmpty(objSend["text"])){
                Common.showToastMessage("Favor preencher o enunciado !","warning");
                $rootScope.loadingContent = false;
            }else if (!blnAlternatives){
                Common.showToastMessage("Favor preencher a alternativa correta !","warning");
                $rootScope.loadingContent = false;
            }else{
                UserService.currentUser().then(function(user) {

                    objService.save(user, objSend)
                        .then(function(data) {
                            $scope.loadData();
                            Common.showToastMessage("Dados atualizados com sucesso !");

                        });
                });
            }




        };



        function isNotEmpty(str){

            if (str===undefined){
                return false;
            }
            if (str===null){
                return false;
            }
            if (str===""){
                return false;
            }
            return true;
        }
    }]);






