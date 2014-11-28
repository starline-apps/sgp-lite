"use strict";

SGPApp
    .factory("ExamService", ["$http","$q","localStorageService","Common","S3","Dynamo","Config", function($http,$q, localStorageService,Common,S3,Dynamo,Config) {

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
                            obj.answerSheetID = (data.answerSheetID!==undefined) ? data.answerSheetID : null;
                            obj.points = data.points;
                            obj.header = (itemSet.Header!==undefined) ? JSON.parse(itemSet.Header.S) : [];
                            obj.tags = (itemSet.Tags!==undefined) ? itemSet.Tags.S : "";
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
                            obj.points = data.points;
                            obj.tags = (itemSet.Tags!==undefined) ? itemSet.Tags.S : "";
                            obj.header = (itemSet.Header!==undefined) ? JSON.parse(itemSet.Header.S) : [];
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
                    d.resolve(exam);
                });

                return d.promise;
            },
            getEntireExam : function(user, exam) {
                var d = $q.defer();

                service.getItemsByExam(user, exam._id).then(function(arrItems){
                    if (arrItems===null){
                        d.resolve(null);
                    }else{
                        exam.items = arrItems;
                        d.resolve(exam);
                    }
                });

                return d.promise;
            },
            getItemsByExam : function(user, guid) {
                var d = $q.defer();
                var arr = [];
                var obj, data, ct;
                var arrAlternativesIndex = {"A":"0","B":"1","C":"2","D":"3","E":"4","F":"5"};
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
                Dynamo.query("UserKeys",keyConditions).then(function(dataSet) {
                    if (dataSet) {
                        angular.forEach(dataSet, function(itemSet) {

                            data = JSON.parse(itemSet.Data.S);
                            if (data.questions != undefined){
                                angular.forEach(data.questions, function(questionSet, questionKey) {
                                    obj = {
                                        "text" : "Questão " + questionKey.toString(),
                                        "tags" : "Edite a questão para cadastrar tags !",
                                        "alternatives": []
                                    };
                                    //obj._id = '416d25b5-9e64-4682-82d4-7f05b6ec22c8';
                                    if (questionSet.answers != undefined){
                                        var arrAlternatives = new Array(questionSet.answers.length);
                                        angular.forEach(questionSet.answers, function(value, key) {
                                            arrAlternatives[parseInt(arrAlternativesIndex[key])] = {"checked":(value!=undefined)? value : 0}
                                        });
                                        obj.alternatives = arrAlternatives;
                                    }

                                    obj.order = questionKey;

                                    arr.push(obj);

                                });

                            }
                        });
                    }



                    angular.forEach(arr, function(questionSet, questionKey) {
                        keyConditions = {
                            "Order": {
                                "ComparisonOperator": "EQ",
                                "AttributeValueList": [
                                    {"N": questionSet.order.toString()}
                                ]
                            },
                            "ExamId": {
                                "ComparisonOperator": "EQ",
                                "AttributeValueList": [
                                    {"S": guid}
                                ]
                            }
                        };
                        Dynamo.query("UserItems",keyConditions, "Order-index").then(function(dataSetUserItems) {
                            if (dataSetUserItems) {
                                angular.forEach(dataSetUserItems, function(itemSetUserItems) {
                                    if (itemSetUserItems.Text.S!=undefined){
                                        questionSet.text = itemSetUserItems.Text.S;
                                    }
                                    if (itemSetUserItems.Guid.S!=undefined){
                                        questionSet._id = itemSetUserItems.Guid.S;
                                    }
                                    if (itemSetUserItems.Tags.S!=undefined){
                                        questionSet.tags = itemSetUserItems.Tags.S;
                                    }
                                    if (itemSetUserItems.Num_Alternatives.N!=undefined){
                                        questionSet.num_alternatives = itemSetUserItems.Num_Alternatives.N;
                                    }
                                });
                            }
                        });
                    });
                    d.resolve(arr);
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


                service.getByExam(user, exam._id).then(function(items){

                    if (items!==null) {

                        var ctItems = items.length;

                        exam.answerSheetID = 1;

                        if (parseInt(ctItems)>20 && parseInt(ctItems)<=50){
                            exam.answerSheetID = 2;
                        }else if (parseInt(ctItems)>50){
                            exam.answerSheetID = 3;
                        }

                        var timestamp = Common.getTimestamp();

                        var dataSet = {
                            Item: {
                                'Guid': {S: exam._id},
                                'UserEmail': {S: user.email},
                                'LastModifiedBy': {S: "web"},
                                'LastWritten' : {N: timestamp.toString()},
                                'Tags': {S: exam.tags},
                                'Header': {S: JSON.stringify(exam.header)},
                                'Data': {
                                    S: JSON.stringify({
                                        guid: exam._id,
                                        name: exam.description,
                                        idPublished: 0,
                                        points: exam.points,
                                        isDeleted: 0,
                                        lastModified: timestamp,
                                        answerSheetID: exam.answerSheetID
                                    })
                                }
                            }
                        };

                        Dynamo.putItem("UserExams", dataSet).then(function(data){
                            if (data!==null){
                                d.resolve(data);
                            }else{
                                d.resolve(null);
                            }

                        });


                    }else {
                        d.resolve(null);
                    }

                });

                return d.promise;
            }


        };

        return service;

    }]);

