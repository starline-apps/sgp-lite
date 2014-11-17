/*jslint evil: true */
/*jshint -W083 */
"use strict";
var refreshResult, refreshExamTime, examListInterval, examResultInterval;
SGPApp
    .controller("ItemController", ["$rootScope", "$scope", "$stateParams","ItemService","Common","UserService","ExamService",function($rootScope, $scope, $stateParams, ItemService, Common, UserService, ExamService) {
        /** View attributes **/
// setup editor options
            // Editor options.
        $scope.options = {
            language: 'pt-br',
            allowedContent: true,
            entities: false
        };

        var objService = ItemService;


        $scope.loadData = function(){
            $scope.editMode = false;
            $scope.items = undefined;
            $scope.exams = undefined;
            $rootScope.loadingContent = true;
            UserService.currentUser().then(function(user) {
                ExamService.getAll(user)
                    .then(function (examData) {

                        $scope.exams = examData;
                        if ($rootScope.exam === undefined) {
                            $rootScope.loadingContent = false;
                        } else {
                            objService.getByExam(user, $rootScope.exam._id)
                                .then(function (allData) {
                                    $scope.items = allData;
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
                                    $scope.text = data.text;
                                    $scope.alternatives = data.alternatives;
                                    $scope.num_alternatives = data.alternatives.length;
                                    $rootScope.loadingContent = false;
                                });
                        }else{
                            $scope._id = undefined;
                            $scope.tags = "";
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

        $scope.setExam = function(exam) {
            $rootScope.exam = exam;
            $scope.loadData();

        };
        $scope.setNumAlternatives = function(num) {
            var arr = new Array();
            for (var x=0 ; x<num ; x++){
                if ($scope.alternatives[x] == undefined) {
                    arr[x] = {
                        "text":"",
                        "checked":"0"
                    };
                }else{
                    arr[x] = $scope.alternatives[x];
                }
            }
            $scope.alternatives = arr;
            $scope.num_alternatives = num;
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
                $rootScope.loadingContent = false;
            }else if (!isNotEmpty(objSend["text"])){
                alert("Preencha o enunciado")
                $rootScope.loadingContent = false;
            }else if (!blnAlternatives){
                alert("Preencha a alternativa correta !");
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






