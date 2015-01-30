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
            var blnRepeat;
            var objStudent, data, objGrade;
            var arrGrades = [];
            angular.forEach(dataSet, function(itemSet) {
              objGrade = {};
              if (!Common.isEmptyOrZero(itemSet.StudentGuid)){
                if (!Common.isEmptyOrZero(itemSet.StudentGuid.S)){
                  objGrade.guid = itemSet.StudentGuid.S;
                }
              }
              if (!Common.isEmptyOrZero(itemSet.StudentNumber)){
                if (!Common.isEmptyOrZero(itemSet.StudentNumber.N)){
                  objGrade.code = itemSet.StudentNumber.N;
                }
              }
              if (!Common.isEmpty(objGrade.guid) || !Common.isEmpty(objGrade.code)){

                if (!Common.isEmptyOrZero(itemSet.Data)){
                  if (!Common.isEmptyOrZero(itemSet.Data.S)){
                    data = JSON.parse(itemSet.Data.S);
                    objGrade.correctAnswers = Common.isEmpty(data.correctAnswers) ? "0" : data.correctAnswers;
                  }
                }

                arrGrades.push(objGrade);
              }

            });

            if (arrGrades.length==0){
              d.resolve([]);
            }else{

              angular.forEach(team.students, function(student, studentId) {

                blnRepeat = true;
                angular.forEach(arrGrades, function(grade) {
                  if (blnRepeat){

                    if (!Common.isEmptyOrZero(student.code) && !Common.isEmptyOrZero(grade.code)){
                      if (student.code.toString() == grade.code.toString()){
                        blnRepeat = false;
                      }
                    }

                    if (!Common.isEmptyOrZero(studentId) && !Common.isEmptyOrZero(grade.guid)){
                      if (studentId.toString() == grade.guid.toString()){
                        blnRepeat = false;
                      }
                    }

                    if (!blnRepeat){
                      objStudent = {};
                      objStudent.name = !Common.isEmpty(student.name) ? student.name : "[Aluno sem nome]";
                      objStudent.code = !Common.isEmpty(student.code) ? student.code : "[Aluno sem código]";
                      objStudent.correctAnswers = !Common.isEmptyOrZero(grade.correctAnswers) ? grade.correctAnswers : "0";
                      objStudent.totalAnswers = !Common.isEmptyOrZero(exam.questions) ? exam.questions : "0";
                      objStudent.score = (parseInt(objStudent.correctAnswers) * parseInt(exam.points)) / parseInt(objStudent.totalAnswers);
                      arr.push(objStudent);
                    }

                  }

                });

              });

              d.resolve(arr);

            }

          } else {

            d.resolve([]);
          }
        });

        return d.promise;
      }
    };

    return service;

  }]);

