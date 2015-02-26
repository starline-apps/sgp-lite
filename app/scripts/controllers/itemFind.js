/*jslint evil: true */
/*jshint -W083 */
"use strict";
SGPApp
	.controller("ItemFindController", ["$rootScope", "$scope", "$stateParams","ItemService","Common","UserService","ExamService","$location",function($rootScope, $scope, $stateParams, ItemService, Common, UserService, ExamService, $location) {

		var objService = ItemService;


		$scope.loadData = function(){
			$scope.items = undefined;
			$scope.exams = undefined;
			$rootScope.loadingContent = true;
			UserService.currentUser().then(function(user) {
				ExamService.getAll(user)
					.then(function (examData) {

						$scope.exams = examData;
						if ($scope.examFind === undefined) {
							$rootScope.loadingContent = false;
						} else {
							objService.getByExam(user, $scope.examFind._id)
								.then(function (allData) {
									$scope.items = allData;
									objService.getDiscursiveByExam(user, $scope.examFind._id)
										.then(function (allDiscursiveData) {
											$scope.itemsDiscursive = allDiscursiveData;

											$rootScope.loadingContent = false;

										});

								});
						}
					});
			});
			$scope.arrTags = [];
			$scope.tags = "";
			$scope.tagText = "";
		};

		$scope.loadData();


		$scope.setExam = function(exam) {
			$scope.examFind = exam;
			$scope.loadData();
		};

		$scope.save = function(item) {
			$rootScope.loadingContent = true;

			objService.getFile(item)
				.then(function (data) {
					var objSend = {};

					objSend._id  = Common.generateUUID();
					objSend["guid"] = $rootScope.exam._id;
					objSend["tags"] = data.tags;
					objSend["text"] = data.text;

					objSend["type"] = data.type;
					if (data.type==2){
						objSend["lines"] = data.lines;
						objSend["order"] = $rootScope.orderDiscursive;
					}else{
						objSend["order"] = $rootScope.order;
						objSend["num_alternatives"] = data.alternatives.length;
						objSend["alternatives"] = data.alternatives;
					}

					if (Common.isEmptyOrZero(data.matrixParent)){
						objSend["matrixParent"] = "0";
					}else{
						objSend["matrixParent"] = data.matrixParent.toString();
					}
					if (Common.isEmptyOrZero(data.matrixChild)){
						objSend["matrixChild"] = "0";
					}else{
						objSend["matrixChild"] = data.matrixChild.toString();
					}

					delete $rootScope.order;
					delete $rootScope.orderDiscursive;

					UserService.currentUser().then(function(user) {

						objService.save(user, objSend)
							.then(function(data) {
								$rootScope.loadingContent = false;
								Common.showToastMessage("Dados atualizados com sucesso !");
								$location.path("item");
							});


					});

				});


			$rootScope.loadingContent = true;


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
				if ($(this).text() != undefined){
					if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
						$(this).closest("md-item-content").show();
						$(this).closest("md-item-content").next("md-divider").show();
					}
				}

			});
		});

	}]);






