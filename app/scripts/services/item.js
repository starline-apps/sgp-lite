"use strict";

SGPApp
    .factory("ItemService", ["$http","$q","localStorageService","Common","Dynamo","S3","Config", function($http,$q, localStorageService,Common, Dynamo, S3, Config) {

        return {
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
                        ct = 1;
                        angular.forEach(dataSet, function(itemSet) {

                            data = JSON.parse(itemSet.Data.S);
                            if (data.questions != undefined){
                                while (data.questions[ct] != undefined){
                                    obj = {
                                        "text" : "Questão " + ct.toString(),
                                        "tags" : "Edite a questão para cadastrar tags !",
                                        "alternatives": []
                                    };

                                    if (data.questions[ct].answers != undefined){
                                        var arrAlternatives = new Array(data.questions[ct].answers.length);
                                        angular.forEach(data.questions[ct].answers, function(value, key) {
                                            arrAlternatives[parseInt(arrAlternativesIndex[key])] = {"checked":(value!=undefined)? value : 0}
                                        });
                                        obj.alternatives = arrAlternatives;
                                    }

                                    obj.order = ct;
                                    keyConditions.Order = {
                                        "ComparisonOperator": "EQ",
                                        "AttributeValueList": [
                                            {"N": parseInt(ct)}
                                        ]
                                    };
                                    Dynamo.query("UserItems",keyConditions).then(function(dataSetUserItems) {
                                        if (dataSetUserItems) {
                                            angular.forEach(dataSetUserItems, function(itemSetUserItems) {
                                                if (itemSetUserItems.Text.S!=undefined){
                                                    obj.text = itemSetUserItems.Text.S;
                                                }
                                                if (itemSetUserItems.ItemId.S!=undefined){
                                                    obj._id = itemSetUserItems.ItemId.S;
                                                }
                                                if (itemSetUserItems.Tags.S!=undefined){
                                                    obj.tags = itemSetUserItems.Tags.S;
                                                }
                                                if (itemSetUserItems.Tags.S!=undefined){
                                                    obj.num_alternatives = itemSetUserItems.Num_Alternatives.N;
                                                }
                                            });
                                        }
                                    });
                                    arr.push(obj);
                                    ct++;
                                }

                            }
                        });
                    }
                    d.resolve(arr);
                });



                return d.promise;
            },
            getFile : function(item) {
                var defer = $q.defer();

                if (item._id != undefined){
                    S3.getObject(Config.getBucket, "items/" +  item._id + ".json").then(function(data){
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
                var dataSet = {
                    Item: {
                        'ItemId': {S: item._id},
                        'Guid': {S: item.guid},
                        'UserEmail': {S: user.email},
                        'LastModifiedBy': {S: "web"},
                        'LastWritten' : {N: timestamp.toString()},
                        'Order' : {N: item.order},
                        'Text' : {S: $("<div/>").html(item.text).text()},
                        'Tags' : {S: item.tags},
                        'Num_Alternatives' : {S: item.num_alternatives}

                    }
                };

                Dynamo.putItem("UserItems", dataSet).then(function(data){




                    d.resolve(data);
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

