"use strict";

SGPApp
    .factory("TeamService", ["$http","$q","localStorageService","Common","S3","Dynamo","Config", function($http,$q, localStorageService,Common,S3,Dynamo,Config) {


    /*

     DataString:	{\"isDeleted\":0,\"name\":\"Vestiba\",\"guid\":\"87dd9a21-29e4-4131-aab9-19f4c90435e1\",
     \"students\":{\"41f3f975-c1cc-42c8-a5e1-f3604e175491\":{\"isDeleted\":0,\"name\":\"Rodrigo Chain\",\"code\":\"59853\"
     ,\"lastModified\":1417035398},\"d633e71d-0e1f-45a3-b982-7de458912b7d\":{\"isDeleted\":0,\"name\":\"Regina Celia\",\"code\":\"20176\",\"lastModified\":1417035411},\"5d508d07-7231-4010-b55a-6cc509077faf\":{\"isDeleted\":0,\"name\":\"Luiz Zeloca\",\"code\":\"73571\",\"lastModified\":1417035394}},\"lastModified\":1417035410}
     GuidString:	87dd9a21-29e4-4131-aab9-19f4c90435e1
     LastModifiedByString:	ios-app
     LastWrittenNumber:	1417088689
     UserEmailString:	luberju@gmail.com
     */
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
                                idPublished: 0,
                                points: team.points,
                                isDeleted: 0,
                                lastModified: timestamp,
                                answerSheetID: team.answerSheetID
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




                return d.promise;
            }


        };

        return service;

    }]);

