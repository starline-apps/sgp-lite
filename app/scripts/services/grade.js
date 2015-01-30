"use strict";

SGPApp
  .factory("GradeService", ["$http","$q","localStorageService","Common","S3","Dynamo","Config","TeamService", function($http,$q, localStorageService,Common,S3,Dynamo,Config, TeamService) {


    var service = {
      getAllLength : function(user) {
        var d = $q.defer();

        var keyConditions = {
          "UserEmail": {
            "ComparisonOperator": "EQ",
            "AttributeValueList": [
              {"S": user.email}
            ]
          }
        };
        Dynamo.query("UserSheets",keyConditions).then(function(dataSet) {
          if (dataSet) {
            d.resolve(dataSet.length);
          } else {

            d.resolve(null);
          }
        });



        return d.promise;
      },
      getExamGradeByTeam : function(user, exam, team) {
        var d = $q.defer();

        var keyConditions = {
          "UserEmail": {
            "ComparisonOperator": "EQ",
            "AttributeValueList": [
              {"S": user.email}
            ]
          },
          "ExamGuid": {
            "ComparisonOperator": "EQ",
            "AttributeValueList": [
              {"S": exam._id}
            ]
          }
        };
        Dynamo.query("UserSheets",keyConditions, "ExamGuid-index").then(function(dataSet) {
          console.log(dataSet);
          if (dataSet) {
            var arr = [];
            var obj, data;
            angular.forEach(dataSet, function(itemSet) {
              obj = (itemSet.StudentGuid) ? itemSet.StudentGuid.S : "Não";
              arr.push({name:obj});
            });
            d.resolve(arr);
          } else {

            d.resolve([]);
          }
        });

        return d.promise;
      }
    };

    return service;

  }]);

