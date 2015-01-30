"use strict";

SGPApp
    .factory("ParamService", ["$http","$q","localStorageService","Common","S3","Dynamo","Config", function($http,$q, localStorageService,Common,S3,Dynamo,Config) {

        var service = {
            get : function(key) {
                var d = $q.defer();

                var keyConditions = {
                    "Key": {
                        "ComparisonOperator": "EQ",
                        "AttributeValueList": [
                            {"S": key}
                        ]
                    }
                };
                Dynamo.query("Params",keyConditions).then(function(dataSet) {
                    if (dataSet) {
                        var obj = {};
                        angular.forEach(dataSet, function(itemSet) {
                          obj.data = JSON.parse(itemSet.Data.S);
                          obj.key = itemSet.Key.S;
                        });
                        d.resolve(obj);
                    } else {

                        d.resolve({});
                    }
                });
                return d.promise;
            },
            save : function(obj) {

                var d = $q.defer();

                var timestamp = Common.getTimestamp();

                var dataSet = {
                    Item: {
                        'Key': {S: obj.key},
                        'LastModifiedBy': {S: "web"},
                        'LastWritten' : {N: timestamp.toString()},
                        'Data': { S: JSON.stringify(obj.data) }
                    }
                };

                Dynamo.putItem("Params", dataSet).then(function(data){
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

