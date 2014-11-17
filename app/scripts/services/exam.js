"use strict";

SGPApp
    .factory("ExamService", ["$http","$q","localStorageService","Common","S3","Dynamo","Config","ItemService", function($http,$q, localStorageService,Common,S3,Dynamo,Config, ItemService) {

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
                Dynamo.query("UserExams",keyConditions).then(function(dataSet) {
                    if (dataSet) {
                        var arr = [];
                        var obj, data;
                        angular.forEach(dataSet, function(itemSet) {
                            obj = {};
                            data = JSON.parse(itemSet.Data.S);
                            obj.description = data.name;
                            obj.observation = data.name;
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
                Dynamo.query("UserExams",keyConditions).then(function(dataSet) {
                    if (dataSet) {
                        var arr = [];
                        var obj, data;
                        obj = {};
                        angular.forEach(dataSet, function(itemSet) {

                            data = JSON.parse(itemSet.Data.S);
                            obj.description = data.name;
                            obj.observation = data.name;
                            obj._id = itemSet.Guid.S;
                        });
                        d.resolve(obj);
                    } else {

                        d.resolve(null);
                    }
                });
                return d.promise;
            },
            getPrintableVersion : function(user, exam) {
                var d = $q.defer();

                this.getEntireExam(user, exam).then(function(exam){
                    angular.forEach(exam.items, function(itemSet, itemIndex) {
                        ItemService.getFile(itemSet).then(function(file){
                            console.log(file);
                            file.order = itemSet.order;
                            itemSet = file;
                        });
                    });
                    d.resolve(exam);
                });



                return d.promise;
            },
            getEntireExam : function(user, exam) {
                var d = $q.defer();

                ItemService.getByExam(user, exam._id).then(function(arrItems){
                    if (arrItems===null){
                        d.resolve(null);
                    }else{
                        exam.items = arrItems;
                        d.resolve(exam);
                    }
                });

                return d.promise;
            },
            save : function(user, exam) {

                var d = $q.defer();

                /*
                var answerSheet;
                if (exam.questions.length <=20){
                    answerSheet = 1;
                }else if(exam.questions.length <=50){
                    answerSheet = 2;
                }else{
                    answerSheet = 3;
                }
                */
                var timestamp = Common.getTimestamp();

                var dataSet = {
                    Item: {
                        'Guid': {S: exam._id},
                        'UserEmail': {S: user.email},
                        'LastModifiedBy': {S: "web"},
                        'LastWritten' : {N: timestamp.toString()},
                        'Data': {
                            S: JSON.stringify({
                                guid: exam._id,
                                name: exam.description,
                                idPublished: 0,
                                points: 10,
                                isDeleted: 0,
                                lastModified: timestamp,
                                answerSheetId: 1
                            })
                        }
                    }
                };

                Dynamo.putItem("UserExams", dataSet).then(function(data){
                    d.resolve(data);
                });

                return d.promise;
            }


        };

        return service;

    }]);

