"use strict";

BeetApp
    .factory("ItemService", ["$http","$q","localStorageService","Common", function($http,$q, localStorageService,Common) {

        return {
            getAll : function() {
                var defer = $q.defer();
                if (localStorageService.get("test_item") === null){
                    localStorageService.add("test_item", new Array());
                }
                defer.resolve(localStorageService.get("test_item"));
                return defer.promise;
            },
            get : function(_id) {
                var defer = $q.defer();
                defer.resolve(localStorageService.get("test_item")[_id]);
                return defer.promise;
            },
            create : function(data) {
                var defer = $q.defer();
                var list = localStorageService.get("test_item");
                list.push(data);
                localStorageService.add("test_item", list);
                defer.resolve(localStorageService.get("test_item"));
                return defer.promise;
            },
            update : function(data, _id) {
                console.log(data);
                console.log(_id);
                var defer = $q.defer();
                var list = localStorageService.get("test_item");
                list[_id] = data;
                localStorageService.add("test_exam", list);
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

