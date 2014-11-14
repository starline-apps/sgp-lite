"use strict";

SGPApp
    .factory("ExamService", ["$http","$q","localStorageService","Common","S3","Dynamo","Config", function($http,$q, localStorageService,Common,S3,Dynamo,Config) {

        return {
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
                console.log(timestamp);
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
            },
            getExamsResult : function(code) {
                return $http.get(Common.getApiUrl() + "/api/v1/ib/rest/assessmentresult/" + code + "/", {withCredentials : false});
            },
            getLocal : function(code) {
                return localStorageService.get(code);
            },
            removeLocal : function(code) {
                return localStorageService.remove(code);
            },
            saveLocal : function(code, value) {
                localStorageService.add(code, value);
            },
            sendAnswers : function(mode, fileName, fileContent) {
                var defer = $q.defer();
                if (1===1){
                    sendAnswersFile(fileName, fileContent).then(function(response){
                        if (response === null){
                            defer.resolve(null);
                        }else{
                            var obj = {};
                            obj.code = fileName;
                            obj.url = "https://strtec.s3.amazonaws.com/Temp/" + fileName + ".json";
                            console.log("Sending message to API...");
                            console.log(obj);
                            console.log("------------");
                            if (response){

                                sendMessage(obj)
                                    .success(function(data){
                                        //defer.resolve(data);
                                        defer.resolve("Temp/" + fileName + ".json");
                                    }).error(function(err){
                                        defer.resolve(null);

                                    });

                            }
                        }

                    });
                }else{
                    sendAnswersFile(fileName, fileContent).then(function(response){
                        var obj = {};
                        obj.code = fileName;
                        obj.url = "https://strtec.s3.amazonaws.com/Temp/" + fileName + ".json";
                        console.log("mandando..");
                        console.log(obj);
                        if (response){

                            defer.resolve("Temp/" + fileName + ".json");

                        }
                        //console.log("oh ! to mandando isso aqui : " + "Temp/" + fileName + ".json");
                        // retirar assim que a API estiver pronta
                    });

                }


                return defer.promise;
            }

        };



    }]);

