/*jslint evil: true */
/*jshint -W083 */
"use strict";
var refreshResult, refreshExamTime, examListInterval, examResultInterval;
SGPApp
    .controller("ExamController", ["$rootScope", "$scope","$location", "$stateParams","ExamService","Common","UserService","ItemService","$q",function($rootScope, $scope,$location, $stateParams, ExamService, Common,UserService, ItemService, $q) {
        /** View attributes **/

        $scope.answerSheets = {
            "1":{
                url:"http://cdn2.hubspot.net/hub/380284/file-1157768136-pdf/Starline_SGP_APP_-_20_Quest%C3%B5es.pdf"
            },
            "2":{
                url:"http://cdn2.hubspot.net/hub/380284/file-1155721394-pdf/Starline_SGP_APP_-_50_Quest%C3%B5es.pdf"
            },
            "3":{
                url:"http://cdn2.hubspot.net/hub/380284/file-1155721399-pdf/Starline_SGP_APP_-_100_Quest%C3%B5es.pdf"
            }
        };

        var objService = ExamService;
        $rootScope.loadingContent = true;

        $scope.loadData = function(){
            $scope.editMode = false;
            $scope.printMode = false;
            $scope.dataSource = undefined;
            $rootScope.loadingContent = true;
            UserService.currentUser().then(function(user) {

                objService.getAll(user)
                    .then(function(allData) {
                        $scope.dataSource = allData;
                        $rootScope.loadingContent = false;
                    });
            });
            $scope._id = undefined;
            $scope.description = "";
            $scope.points = "";
            $scope.tags = "";
            $scope.arrTags = [];
            $rootScope.exam = undefined;
            $scope.headerIndex = null;
            $scope.tagIndex = null;

        };

        $scope.loadData();

		$scope.delete = function(exam) {
			if (confirm("Deseja excluir este item ?")){
				$rootScope.loadingContent = true;
				UserService.currentUser().then(function(user) {
					exam["isDeleted"] = "1";
					objService.save(user, exam)
						.then(function(data) {
							$scope.loadData();
						});
				});
			}
		};

        $scope.edit = function(exam) {
            $scope.editMode = true;
            if (exam !== undefined){
                $scope._id = exam._id;
                UserService.currentUser().then(function(user) {
                    objService.get(user, exam._id)
                        .then(function(data) {
                            $scope.description = data.description;
                            $scope.arrTags = data.tags.split(";");
                            $scope.tags = data.tags;
                            $scope.header = data.header;
                            $scope.points = data.points;
                        });
                });

            }else{
                $scope._id = undefined;
                $scope.description = "";
                $scope.tags = "";
                $scope.arrTags = [];
                $scope.header = [];
                $scope.points = "";
            }

        };

        $scope.viewItems = function(exam) {
            $rootScope.exam = exam;
            $location.path("item");
        };

        $scope.tagIndex = null;
        $scope.editTag = function(index) {
            $scope.tagIndex = index;
            $scope.tagText = $scope.arrTags[index];
        };
        $scope.removeTag = function(index) {
            $scope.tagText = "";
            $scope.tagIndex = null;
            $scope.arrTags.splice(index, 1);
            $scope.tags = $scope.arrTags.join(";");
        };
        $scope.setTag = function() {
            if ($scope.tagText!==""){
                if ($scope.arrTags.indexOf($scope.tagText) === -1 || $scope.arrTags.indexOf($scope.tagText) === $scope.tagIndex){
                    if ($scope.tagIndex){
                        $scope.arrTags[$scope.tagIndex] = $scope.tagText;
                    }else{
                        $scope.arrTags.push($scope.tagText);
                    }
                    $scope.tagText = "";
                    $scope.tags = $scope.arrTags.join(";");
                    $scope.tagIndex = null;
                }else{
                    Common.showToastMessage("A tag &quot;"  + $scope.tagText  + "&quot; já existe !","warning");
                }

            }else{
                Common.showToastMessage("Favor preencher a tag !","warning");
            }

        };

        $scope.headerIndex = null;
        $scope.removeExamHeader = function(index) {
            $scope.headerText = "";
            $scope.headerDescription = "";
            $scope.headerIndex = null;
            $scope.header.splice(index, 1);
        };
        $scope.setExamHeader = function() {
            if ($scope.headerText!=="" && $scope.headerDescription!==""){
                var obj = {
                    "description": $scope.headerDescription,
                    "text":$scope.headerText
                };
                if ($scope.headerIndex){
                    $scope.header[$scope.headerIndex] =obj;
                }else{
                    $scope.header.push(obj);
                }
                $scope.headerText = "";
                $scope.headerDescription = "";

                $scope.headerIndex = null;


            }else{
                Common.showToastMessage("Favor preencher a descrição e o texto do cabeçalho !","warning");
            }

        };

        $scope.print = function(exam){
            $rootScope.loadingContent = true;
            UserService.currentUser().then(function(user) {
                ExamService.getPrintableVersion(user, exam).then(function(data){
                    $scope.printData = data;
                    ItemService.getDiscursiveByExam(user, exam._id)
                      .then(function (allDiscursiveData) {
                        $scope.printDataDiscursive = allDiscursiveData;

                        $rootScope.loadingContent = false;
                        $scope.printMode = true;
                      });


                });
            });



        };

        $scope.$watch('search', function(value) {
            if (value==="" || value===undefined){
                $("md-item-content").each(function(){
                    $(this).show(false);
                    $(this).next("md-divider").show(false);
                });
            }else{
                $("md-item-content").each(function(){
                    $(this).hide();
                    $(this).next("md-divider").hide();
                });
            }
            $(".searchable").each(function(){
              if ($(this).text() != undefined) {
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                  $(this).closest("md-item-content").show();
                  $(this).closest("md-item-content").next("md-divider").show();
                }
              }
            });
        });

        $scope.getAnswerSheet = function(exam){
            var sheetId = exam.answerSheetID!==null ? exam.answerSheetID : 1;
            window.open(
                $scope.answerSheets[sheetId.toString()].url,
                '_blank' // <- This is what makes it open in a new window.
            );

        };


        $scope.getItemFile = function(item){
            var defer = $q.defer();
            ItemService.getFile(item).then(function(data){
                defer.resolve(data);

            });
            return defer.promise;
        };
        $scope.getItem = function(index){
            $scope.getItemFile($scope.printData.items[index]).then(function(data){
                $scope.printData.items[index] = data;
            });
        };
        $scope.arrAlternativeIndex = ["A","B","C","D","E"];

        $scope.save = function() {
            if ($scope.description!==""){
                if ($scope.tags!==""){
                    if (isNormalInteger($scope.points)){
                        var objSend = {};

                        objSend._id = angular.isUndefined($scope._id) ? Common.generateUUID() : $scope._id;
                        objSend["description"] = $scope.description;
                        objSend["tags"] = $scope.tags;
                        objSend["points"] = $scope.points;
                        objSend["header"] = $scope.header;

                        UserService.currentUser().then(function(user) {
                            objService.save(user, objSend)
                                .then(function(data) {
                                    $scope.loadData();
                                    Common.showToastMessage("Dados atualizados com sucesso !");

                                });
                        });
                    }else{
                        Common.showToastMessage("Favor preencher os pontos com um valor inteiro !","warning");
                    }

                }else{
                    Common.showToastMessage("Favor preencher ao menos uma tag !","warning");
                }
            }else{
                Common.showToastMessage("Favor preencher a descrição !","warning");
            }

        };

        $scope.printDiv = function(){
            $("#printCommands").hide();
            $("#header").hide();
            $("#footer").hide();
            $("#container").hide();
            $("#printWindow").show();
            document.getElementById("printWindow").innerHTML = document.getElementById("divPrint").innerHTML;
            window.print();
            $("#printWindow").hide();
            $("#printCommands").show();
            $("#header").show();
            $("#footer").show();
            $("#container").show();

        };
        $scope.printDivPDF = function(){
            $("#printCommands").hide();
            $("#header").hide();
            $("#footer").hide();
            $("#container").hide();
            $("#printWindow").show();
            document.getElementById("printWindow").innerHTML = document.getElementById("divPrint").innerHTML;
            var pdf = new jsPDF('p','pt','a4');

            pdf.addHTML(document.getElementById("divPrint"),function() {
                pdf.output('dataurlnewwindow');
            });



            $("#printWindow").hide();
            $("#printCommands").show();
            $("#header").show();
            $("#footer").show();
            $("#container").show();

        };
        function isNormalInteger(str) {
            var n = ~~Number(str);
            return String(n) === str && n >= 0;
        }
    }]);






