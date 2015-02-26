"use strict";

SGPApp
	.factory("StudentService", ["$http","$q","localStorageService","Common","S3","Dynamo","Config","TeamService", function($http,$q, localStorageService,Common,S3,Dynamo,Config, TeamService) {


		var service = {
			getAllLength : function(user) {
				var d = $q.defer();
				TeamService.getAll(user).then(function(arr){
					var length = 0;

					for (var x=0 ; x<arr.length ; x++){
						if (arr[x].students){
							angular.forEach(arr[x].students, function(student) {
								length++;
							});
						}
					}
					d.resolve(length);
				});

				return d.promise;
			},
			getByTeam : function(user, guid) {
				var d = $q.defer();

				var keyConditions = {
					"UserEmail": {
						"ComparisonOperator": "EQ",
						"AttributeValueList": [
							{"S": user.email}
						]
					},
					"Guid": {
						"ComparisonOperator": "EQ",
						"AttributeValueList": [
							{"S": guid}
						]
					}
				};
				Dynamo.query("UserClasses",keyConditions).then(function(dataSet) {
					if (dataSet) {
						var arr = [];
						var obj, data;
						angular.forEach(dataSet, function(itemSet) {
							itemSet.Data = JSON.parse(itemSet.Data.S);
							angular.forEach(itemSet.Data.students, function(student, _id) {
								obj = {};
								obj.name = (student.name === undefined) ? "" : student.name;
								obj.code = (student.code === undefined) ? "" : student.code;
								obj.isDeleted = (student.isDeleted === undefined) ? "0" : student.isDeleted;
								obj._id = _id;
								if (Common.isNotDeleted(obj)){
									arr.push(obj);
								}

							});
						});
						d.resolve(arr);
					} else {

						d.resolve(null);
					}
				});

				return d.promise;
			},
			save : function(user, student) {
				var d = $q.defer();

				var timestamp = Common.getTimestamp();


				var keyConditions = {
					"UserEmail": {
						"ComparisonOperator": "EQ",
						"AttributeValueList": [
							{"S": user.email}
						]
					},
					"Guid": {
						"ComparisonOperator": "EQ",
						"AttributeValueList": [
							{"S": student.teamId}
						]
					}
				};
				Dynamo.query("UserClasses",keyConditions).then(function(dataSet) {
					if (dataSet) {
						angular.forEach(dataSet, function(itemSet) {
							var teamData = JSON.parse(itemSet.Data.S);
							if (!teamData.students){
								teamData.students = {};
							}
							teamData.students[student._id] = student[student._id];
							teamData.lastModified = timestamp.toString();
							itemSet.Data.S = JSON.stringify(teamData);
							itemSet.LastModifiedBy.S = "web";
							itemSet.LastWritten.N = timestamp.toString();

							Dynamo.putItem("UserClasses", {Item:itemSet}).then(function(data){
								if (data!==null){
									d.resolve(data);
								}else{
									d.resolve(null);
								}
							});
						});
					} else {
						d.resolve(null);
					}
				});

				return d.promise;

			},
			delete : function(user, student) {

				var d = $q.defer();
				var timestamp = Common.getTimestamp();
				var keyConditions = {
					"UserEmail": {
						"ComparisonOperator": "EQ",
						"AttributeValueList": [
							{"S": user.email}
						]
					},
					"Guid": {
						"ComparisonOperator": "EQ",
						"AttributeValueList": [
							{"S": student.teamId}
						]
					}
				};
				Dynamo.query("UserClasses",keyConditions).then(function(dataSet) {
					if (dataSet) {
						student[student._id].isDeleted = "1";
						angular.forEach(dataSet, function(itemSet) {
							var teamData = JSON.parse(itemSet.Data.S);
							if (!teamData.students){
								teamData.students = {};
							}
							teamData.students[student._id] = student[student._id];
							teamData.lastModified = timestamp.toString();
							itemSet.Data.S = JSON.stringify(teamData);
							itemSet.LastModifiedBy.S = "web";
							itemSet.LastWritten.N = timestamp.toString();

							Dynamo.putItem("UserClasses", {Item:itemSet}).then(function(data){
								if (data!==null){
									d.resolve(data);
								}else{
									d.resolve(null);
								}
							});
						});
					} else {
						d.resolve(null);
					}
				});

				return d.promise;
			}

		};

		return service;

	}]);

