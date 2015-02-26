"use strict";

SGPApp
	.factory("TeamService", ["$http","$q","localStorageService","Common","S3","Dynamo","Config", function($http,$q, localStorageService,Common,S3,Dynamo,Config) {

		var service = {
			getAll : function(user) {
				var d = $q.defer();

				var keyConditions = {
					"UserEmail": {
						"ComparisonOperator": "EQ",
						"AttributeValueList": [
							{"S": user.email}
						]
					}
				};
				Dynamo.query("UserClasses",keyConditions).then(function(dataSet) {
					if (dataSet) {
						var arr = [];
						var obj, data;
						angular.forEach(dataSet, function(itemSet) {
							obj = {};
							data = JSON.parse(itemSet.Data.S);
							obj.description = (data.name === undefined) ? "" : data.name;
							obj.isDeleted = (data.isDeleted === undefined) ? "0" : data.isDeleted;
							obj.students = data.students;
							obj._id = itemSet.Guid.S;
							arr.push(obj);
						});
						d.resolve(arr);
					} else {

						d.resolve(null);
					}
				});



				return d.promise;
			},
			get : function(user, guid) {
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
						obj = {};
						angular.forEach(dataSet, function(itemSet) {
							data = JSON.parse(itemSet.Data.S);
							obj.description = data.name;
							obj.students = data.students;
							obj.isDeleted = (data.isDeleted === undefined) ? "0" : data.isDeleted;
							obj._id = itemSet.Guid.S;
						});
						d.resolve(obj);
					} else {

						d.resolve(null);
					}
				});
				return d.promise;
			},
			save : function(user, team) {

				var d = $q.defer();




				var timestamp = Common.getTimestamp();

				var dataSet = {
					Item: {
						'Guid': {S: team._id},
						'UserEmail': {S: user.email},
						'LastModifiedBy': {S: "web"},
						'LastWritten' : {N: timestamp.toString()},
						'Data': {
							S: JSON.stringify({
								guid: team._id,
								name: team.description,
								students: (team.students === undefined || team.students === "")  ? {} : team.students,
								isDeleted: (team.isDeleted==undefined) ? "0" : team.isDeleted,
								lastModified: timestamp
							})
						}
					}
				};
				Dynamo.putItem("UserClasses", dataSet).then(function(data){
					if (data!==null){
						d.resolve(data);
					}else{
						d.resolve(null);
					}

				});

				return d.promise;
			},
			delete : function(user, team) {

				var d = $q.defer();
				var timestamp = Common.getTimestamp();


				var dataSet = {
					Item: {
						'Guid': {S: team._id},
						'UserEmail': {S: user.email},
						'LastModifiedBy': {S: "web"},
						'LastWritten' : {N: timestamp.toString()},
						'Data': {
							S: JSON.stringify({
								guid: team._id,
								name: team.description,
								students: (team.students === undefined || team.students === "")  ? {} : team.students,
								isDeleted: "1",
								lastModified: timestamp
							})
						}
					}
				};

				Dynamo.putItem("UserClasses", dataSet).then(function(data){
					if (data!==null){
						d.resolve(data);
					}else{
						d.resolve(null);
					}

				});

				return d.promise;
			}


		};

		return service;

	}]);

