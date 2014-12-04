"use strict";

SGPApp
    .factory("ItemService", ["$http","$q","localStorageService","Common","Dynamo","S3","Config","$timeout","ExamService", function($http,$q, localStorageService,Common, Dynamo, S3, Config, $timeout, ExamService) {

        var service =  {
          getAllLength:function(user){

            var d = $q.defer();


            ExamService.getAll(user).then(function(arrExams){
              var guid, keyConditions, length, ct;
              length = 0;
              if (arrExams.length===0){
                d.resolve(length);
              }else{
                ct = 0;
                for(var x=0 ; x<arrExams.length ; x++){
                  guid = arrExams[x]._id;
                  keyConditions = {
                    "ExamId": {
                      "ComparisonOperator": "EQ",
                      "AttributeValueList": [
                        {"S": guid}
                      ]
                    }
                  };
                  Dynamo.query("UserItems",keyConditions).then(function(dataSetUserItems) {
                    length += parseInt(dataSetUserItems.length);
                    ct++;
                    if (ct===arrExams.length){
                      d.resolve(length);
                    }

                  });


                }
              }





            });

            return d.promise;

          },
            getByExam : function(user, guid) {
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
            getFile : function(item) {
                var defer = $q.defer();
                if (item._id != undefined){
                    S3.getObject(Config.getBucketName(), "items/" +  item._id + ".json").then(function(data){

                        if (data.text != undefined){
                            item.text = data.text;
                        }
                        if (data.alternatives != undefined){
                            angular.forEach(data.alternatives, function(alternative_set, key) {
                                if (item.alternatives[key] != undefined){
                                    item.alternatives[key].text = alternative_set.text;
                                }
                            });
                        }
                        defer.resolve(item);
                    });
                }else{
                    defer.resolve(item);
                }

                return defer.promise;
            },
            save : function(user, item) {
                var d = $q.defer();
                var timestamp = Common.getTimestamp();
                var arrIndexes = ["A","B","C","D","E"];

                //var a = {"questions":{"3":{"answers":{"A":0,"D":0,"B":1,"E":0,"C":0}},"1":{"answers":{"A":0,"D":1,"B":0,"E":0,"C":0}},"4":{"answers":{"A":1,"D":0,"B":0,"E":0,"C":0}},"2":{"answers":{"A":0,"D":0,"B":0,"E":0,"C":1}},"5":{"answers":{"A":0,"D":0,"B":0,"E":1,"C":0}}},"guid":"6129E92C-A082-4E4D-9288-676EF9CD4999","lastModified":1412708417}

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
                            {"S": item.guid}
                        ]
                    }
                };
                Dynamo.query("UserKeys",keyConditions).then(function(dataSetUserKeys) {
                    var questions;
                    var question = {"answers":{}};
                    for(var j=0; j<item.alternatives.length;j++) {
                        question.answers[arrIndexes[j]] = item.alternatives[j].checked==1 ? 1 : 0;
                    }


                    if (dataSetUserKeys!=null){
                        if (dataSetUserKeys.length!=0){
                            questions = JSON.parse(dataSetUserKeys[0].Data.S).questions;
                            questions[item.order] = question;
                        }else{
                            questions = {};
                            questions[item.order] = question;
                        }

                    }else{
                        questions = {};
                        questions.questions[item.order] = question;
                    }


                    var keys = {
                        guid: item.guid,
                        questions: questions,
                        lastModified: timestamp
                    };

                    var dataSet = {
                        Item: {
                            'Guid': {S: item.guid},
                            'UserEmail': {S: user.email},
                            'Data': {
                                S: JSON.stringify(keys)
                            },
                            'LastModifiedBy':{S: 'web'}
                        }
                    };
                    Dynamo.putItem("UserKeys", dataSet).then(function(keysResult){
                        if (keysResult!=null){
                            dataSet = {
                                Item: {
                                    'ExamId': {S: item.guid},
                                    'Guid': {S: item._id},
                                    'LastModifiedBy': {S: "web"},
                                    'LastWritten' : {N: timestamp.toString()},
                                    'Order' : {N: item.order.toString()},
                                    'Text' : {S: $("<div/>").html(item.text).text()},
                                    'Tags' : {S: item.tags},
                                    'Num_Alternatives' : {N: item.num_alternatives.toString()}

                                }
                            };
                            Dynamo.putItem("UserItems", dataSet).then(function(itemsResult){
                                if (itemsResult!=null){
                                    var obj = {
                                        "_id" : item._id,
                                        "user_email" : user.email,
                                        "guid" : item.guid,
                                        "text" : item.text,
                                        "alternatives" : item.alternatives
                                    };

                                    S3.putObject(Config.getBucketName(), "items/" + item._id + ".json", obj).then(function(data){

                                        if (data!=null) {

                                            service.getByExam(user, item.guid).then(function(items){

                                                if (items!==null) {

                                                    var ctItems = items.length;
                                                    ExamService.get(user, item.guid).then(function(examData){

                                                        var examSheetId = 1;

                                                        if (parseInt(ctItems>20)){
                                                            examSheetId = 2;
                                                        }else if (ctItems>50){
                                                            examSheetId = 3;
                                                        }

                                                        if (examData!==null) {
                                                            examData.answerSheetID = examSheetId;

                                                            ExamService.save(user, examData).then(function(examSaveData){

                                                                if (examSaveData!==null) {
                                                                    d.resolve(examSaveData);
                                                                }else {
                                                                    d.resolve(null);
                                                                }

                                                            });
                                                        }else {
                                                            d.resolve(null);
                                                        }

                                                    });
                                                }else {
                                                    d.resolve(null);
                                                }

                                            });
                                        }else {
                                            d.resolve(null);
                                        }

                                    });
                                }else{
                                    d.resolve(null);
                                }
                            });
                        }else{
                            d.resolve(null);
                        }


                    });

                });


                return d.promise;
            },
            update : function(data) {
                var defer = $q.defer();
                var arr = localStorageService.get("test_item");

                for (var x=0 ; x<arr.length ; x++){
                    if (arr[x]._id == data._id){
                        arr[x] = data;
                        break;
                    }
                }
                localStorageService.add("test_item", arr);
                defer.resolve(localStorageService.get("test_item"));
                return defer.promise;

            }
        };

        return service;


    }]);

