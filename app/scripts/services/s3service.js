/**
 * Created by jpsantos on 02/07/14.
 */



SGPApp

    .factory('S3Service', function($q, $http, UserService, AWSService, Config) {



        var service = {
            _user: null,
            UsersTable: "Users",
            UserItemsTable: "UsersItems",
            UserExamsTable: "UserExams",
            UserKlassTable: "UserClasses",
            UserShollsTable: "UserSchools",
            UserKeysTable: "UserKeys",

            putObject: function(item) {
                var d = $q.defer();
                UserService.currentUser().then(function(user){
                    AWSService.s3({params: {Bucket: Config.getBucket() }}).then(function(s3){
                        var params = {
                            Key: item.guid+'.json',
                            Body: angular.toJson(item),
                            ContentType: 'application/json'
                        };
                        s3.putObject(params, function(err, data){
                            if(!err) {
                                var params = {
                                    Bucket: Config.getBucket(),
                                    Key: item.guid+'.json',
                                    Expires: 900*4
                                };
                                s3.getSignedUrl('getObject', params, function(err, url){
                                    if(!err) {
                                        d.resolve(url);
                                    } else {
                                        d.reject(err);
                                    }
                                });
                            } else {
                                d.reject(err);
                            }
                        });
                    });
                });
                return d.promise;
            },
            getObject: function(key) {
                var d = $q.defer();
                AWSService.s3().then(function (s3) {
                    var params = {
                        Bucket: Config.getBucket(),
                        Key: key + ".json",
                        ResponseContentType: 'application/json'
                    };
                    s3.getObject(params, function (err, data) {
                        if (data===null){
                            d.resolve(null);
                        }else{
                            if (data.body===null){
                                d.resolve(null);
                            }else{
                                data = data.Body.toString();
                                d.resolve(JSON.parse(data));
                            }
                        }
                    });
                });
                return d.promise;
            },





            getUser: function() {
                var d = $q.defer();
                if (service._user) {
                    d.resolve(service._user);
                } else {
                    // After we've loaded the credentials
                    AWSService.credentials().then(function() {
                        var email = UserService.currentUser();
                        // Get the dynamo instance for the
                        // UsersTable
                        AWSService.dynamo({
                            params: {TableName: service.UsersTable}
                        })
                            .then(function(table) {
                                // find the user by email
                                table.getItem({
                                    Key: {'UserEmail': {S: email}}
                                }, function(err, data) {
                                    if (!err) {

                                        if (Object.keys(data).length == 0) {
                                            // User didn't previously exist
                                            // so create an entry
                                            var itemParams = {
                                                Item: {
                                                    'UserEmail': {S: email},
                                                    data: { S: JSON.stringify(e) }
                                                }
                                            };
                                            table.putItem(itemParams,
                                                function (err, data) {
                                                    service._user = e;
                                                    d.resolve(e);
                                                });
                                        } else {
                                            // The user already exists
                                            service._user =
                                                JSON.parse(data.Item.data.S);
                                            d.resolve(service._user);
                                        }
                                    } else {
                                        d.reject(err);
                                    }
                                });
                            });
                    });
                }

                return d.promise;
            },
            Bucket: 'sgpapp.users',
            storeItemAsFile: function(itemObject) {
                var d = $q.defer();
                UserService.currentUser().then(function(user){
                    AWSService.s3({params: {Bucket: service.Bucket }}).then(function(s3){
                        var params = {
                            Key: itemObject.guid+'.json',
                            Body: angular.toJson(itemObject),
                            ContentType: 'application/json'
                        };
                        s3.putObject(params, function(err, data){
                            if(!err) {
                                var params = {
                                    Bucket: service.Bucket,
                                    Key: itemObject.guid+'.json',
                                    Expires: 900*4
                                };
                                s3.getSignedUrl('getObject', params, function(err, url){
                                    if(!err) {
                                        d.resolve(url);
                                    } else {
                                        d.reject(err);
                                    }
                                });
                            } else {
                                d.reject(err);
                            }
                        });
                    });
                });
                return d.promise;
            },
            saveUserSchools: function(schools) {
                var d = $q.defer();
                UserService.currentUser().then(function(user) {
                    AWSService.dynamo({params: {TableName: service.UserShollsTable}
                    }).then(function (table) {
                        var itemParams =  {
                            Item: {
                                'UserEmail': {S: user.email},
                                data: {
                                    S: angular.toJson(schools)
                                }
                            }
                        }

                        table.putItem(itemParams, function(err, data) {
                            d.resolve(data);
                        });
                    });
                });

            },
            getUserSchools: function() {
                var d = $q.defer();
                UserService.currentUser().then(function(user){
                    AWSService.dynamo({params: {TableName: service.UserShollsTable}}).then(function(table){
                        table.query({TableName: service.UserShollsTable,
                            KeyConditions: {
                                "UserEmail": {
                                    "ComparisonOperator": "EQ",
                                    "AttributeValueList": [{"S": user.email}]
                                }
                            }
                        }, function(err, data) {
                            var items = [];
                            if(data) {
                                angular.forEach(data.Items, function(item) {
                                    var objs = JSON.parse(item.data.S);
                                    for(var i=0;i<objs.length;i++) {
                                        items.push(objs[i]);
                                    }
                                });
                                d.resolve(items);
                            } else {
                                d.reject(err);
                            }

                        });
                    });
                });
                return d.promise;
            },
            saveKlassDetails: function(klass) {
                var d = $q.defer();
                UserService.currentUser().then(function(user) {
                    AWSService.dynamo({params: {TableName: service.UserKlassTable}
                    }).then(function(table){
                        var itemParams = {
                            Item: {
                                'Guid': {S: klass.guid},
                                'UserEmail': {S: user.email},
                                data: {
                                    S: angular.toJson(klass)
                                }
                            }
                        }
                        table.putItem(itemParams, function(err, data) {
                            d.resolve(data);
                        });
                    });
                });
                return d.promise;
            },
            saveExamDetais: function(exam) {
                var d = $q.defer();

                var answerSheet;
                if (exam.questions.length <=20){
                    answerSheet = 1;
                }else if(exam.questions.length <=50){
                    answerSheet = 2;
                }else{
                    answerSheet = 3;
                }
                var now = new Date;
                var timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
                    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
                timestamp = Math.floor(timestamp / 1000);
                UserService.currentUser().then(function(user) {
                    AWSService.dynamo({
                        params: {TableName: service.UserExamsTable}
                    }).then(function(table) {
                        var itemParams = {
                            Item: {
                                'Guid': {S: exam.guid},
                                'UserEmail': {S: user.email},
                                'LastModifiedBy': {S: "web"},
                                'Data': {
                                    S: JSON.stringify({
                                        guid: exam.guid,
                                        name: exam.name,
                                        idPublished: 0,
                                        points: exam.points,
                                        isDeleted:0,
                                        questions: exam.questions.length,
                                        lastModified: timestamp,
                                        answerSheetId: answerSheet
                                    })
                                }
                            }
                        };

                        table.putItem(itemParams, function(err, data) {
                            console.log(err);
                            d.resolve(data);
                        });
                    });
                });
                return d.promise;
            },
            storeKeys: function(keys) {
                var d = $q.defer();

                UserService.currentUser().then(function(user){
                    AWSService.dynamo({
                        params: {TableName: service.UserKeysTable}
                    }).then(function(table){
                        var itemParams = {
                            Item: {
                                'Guid': {S: keys.guid},
                                'UserEmail': {S: user.email},
                                'Data': {
                                    S: JSON.stringify(keys)
                                },
                                'LastModifiedBy':{S: 'web'}
                            }
                        };

                        table.putItem(itemParams, function(err, data){
                            console.log(err);
                            d.resolve(data);
                        });

                    });
                });

                return d.promise;
            },
            storeExam: function(exam) {
                var d = $q.defer();

                var store_question = function (index, questions) {

                    each_question = questions[index];

                    if (!each_question.synced) {
                        //Setando identificadores unicos
                        if (!each_question.guid) {
                            each_question.guid = UtilService.genenerateUUID();
                        }
                        for (var alt_i = 0; alt_i < each_question.alternatives.length; alt_i++) {
                            if (!each_question.alternatives[alt_i].guid) {
                                each_question.alternatives[alt_i].guid = UtilService.genenerateUUID();
                            }
                        }

                        index++;

                        service.storeItemAsFile(each_question).then(function (url) {
                            each_question.url = UtilService.getNotSignedUrl(url);
                            each_question.synced = true;


                            if(index < questions.length) {
                                store_question(index, questions);
                            } else {
                                if (!exam.guid) {
                                    exam.guid = UtilService.genenerateUUID();
                                }

                                var simple_exam = angular.copy(exam);
                                for (var i = 0; i < simple_exam.questions.length; i++) {
                                    alt = simple_exam.questions[i];
                                    simple_exam.questions[i] = alt.url;
                                }

                                service.storeItemAsFile(simple_exam).then(function (url) {
                                    exam.url = UtilService.getNotSignedUrl(url);
                                    service.saveExamDetais(exam).then(function (data) {
                                        d.resolve(data);
                                    });
                                });
                            }
                        });


                    } else {
                        index++;
                        if(index < questions.length) {
                            store_question(index, questions);
                        } else {
                            if (!exam.guid) {
                                exam.guid = UtilService.genenerateUUID();
                            }

                            var simple_exam = angular.copy(exam);
                            for (var i = 0; i < simple_exam.questions.length; i++) {
                                alt = simple_exam.questions[i];
                                simple_exam.questions[i] = alt.url;
                            }

                            service.storeItemAsFile(simple_exam).then(function (url) {
                                exam.url = UtilService.getNotSignedUrl(url);
                                service.saveExamDetais(exam).then(function (data) {
                                    d.resolve(data);
                                });
                            });

                        }
                    }
                }

                store_question(0, exam.questions);

                return d.promise;
            },
            loadExam: function(examID) {

                var clean_object_key = function (key, bucket) {
                    var key_arrary = null;
                    key_arrary = key.split('/');

                    if(key_arrary[0]=="") {
                        key_arrary.splice(0,1);
                    }

                    if(key_arrary[0] == bucket) {
                        key_arrary.splice(0,1);
                    }

                    return key_arrary.join('/');


                }


                var d = $q.defer();
                UserService.currentUser().then(function(user) {
                    AWSService.s3({params: {Bucket: service.Bucket }}).then(function (s3) {



                        var params = {
                            Bucket: service.Bucket,
                            Key: clean_object_key(examID, service.Bucket) + ".json",
                            ResponseContentType: 'application/json'
                        };
                        s3.getObject(params, function (err, data) {
                            if (err) console.log(err, err.stack); // an error occurred
                            else {
                                var str = data.Body.toString();
                                var object = angular.fromJson(str);

                                var load_questions = function (index, questions) {
                                    if (index < questions.length) {
                                        AWSService.s3({params: {Bucket: service.Bucket}}).then(function (s3) {
                                            var key_value = UtilService.getKeyFromUrl(questions[index]);
                                            key_value = key_value.substring(1);
                                            var params = {
                                                Bucket: service.Bucket,
                                                Key: clean_object_key(key_value, service.Bucket)
                                            }
                                            s3.getObject(params, function (err, data) {
                                                if (err) console.log(err, err.stack);
                                                else {
                                                    questions[index] = angular.fromJson(data.Body.toString());
                                                    index++;
                                                    load_questions(index, questions);
                                                }
                                            });
                                        });
                                    } else {
                                        d.resolve(object);
                                    }
                                }

                                load_questions(0, object.questions);

                            }
                            ;
                        });
                    });
                });

                return d.promise;
            },
            getKlasses: function() {
                var d = $q.defer();
                UserService.currentUser().then(function(user){
                    AWSService.dynamo({params: {TableName: service.UserKlassTable}}).then(function(table){
                        table.query({TableName: service.UserKlassTable,
                            KeyConditions: {
                                "UserEmail": {
                                    "ComparisonOperator": "EQ",
                                    "AttributeValueList": [{S: user.email}]
                                }
                            }
                        }, function(err, data) {
                            var items = [];
                            if(data) {
                                angular.forEach(data.Items, function(item) {
                                    items.push(JSON.parse(item.data));
                                });
                                d.resolve(items);
                            } else {
                                d.reject(err);
                            }

                        });
                    });
                });
                return d.promise;
            },
            getKlass: function(klassId) {
                var d = $q.defer();
                UserService.currentUser().then(function(user){
                    AWSService.dynamo({params: {TableName: service.UserKlassTable}}).then(function(table){
                        table.query({TableName: service.UserKlassTable,
                            KeyConditions: {
                                "UserEmail": {
                                    "ComparisonOperator": "EQ",
                                    "AttributeValueList": [{S: user.email}]
                                },
                                "Guid": {
                                    "ComparisonOperator": "EQ",
                                    "AttributeValueList": [{S: klassId}]
                                }
                            }
                        }, function(err, data) {
                            var ret = null;
                            if(data) {
                                angular.forEach(data.Items, function(item) {
                                    ret = angular.fromJson(item.data.S);
                                });
                                d.resolve(ret);
                            } else {
                                d.reject(err);
                            }

                        });
                    });
                });
                return d.promise;
            },
            getExams: function(user) {
                var d = $q.defer();


                AWSService.dynamo({
                    params: {TableName: service.UserExamsTable}
                }).then(function(table) {

                    table.query({
                        TableName: service.UserExamsTable,
                        KeyConditions: {
                            "UserEmail": {
                                "ComparisonOperator": "EQ",
                                "AttributeValueList": [
                                    {"S": user.email}
                                ]
                            }
                        }
                    }, function(err, data) {
                        var items = [];
                        if (data) {
                            angular.forEach(data.Items, function(item) {
                                items.push(JSON.parse(item.Data.S));
                            });
                            d.resolve(items);
                        } else {
                            d.reject(err);
                        }
                    })
                });



                return d.promise;

            },
            getExamById: function(user, guid) {
                var d = $q.defer();

                AWSService.dynamo({
                    params: {TableName: service.UserExamsTable}
                }).then(function(table) {

                    table.query({
                        TableName: service.UserExamsTable,
                        KeyConditions: {
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
                        }
                    }, function(err, data) {
                        var items = [];
                        if (data) {
                            angular.forEach(data.Items, function(item) {
                                items.push(JSON.parse(item.Data.S));
                            });
                            d.resolve(items);
                        } else {
                            d.reject(err);
                        }
                    })
                });



                return d.promise;

            }


        };
        return service;
    })












    .factory('RepoService', function($q, $http, UserService, AWSService, UtilService) {
        var service = {
            _user: null,
            UsersTable: "Users",
            UserItemsTable: "UsersItems",
            UserExamsTable: "UserExams",
            UserKlassTable: "UserClasses",
            UserShollsTable: "UserSchools",
            UserKeysTable: "UserKeys",
            getUser: function() {
                var d = $q.defer();
                if (service._user) {
                    d.resolve(service._user);
                } else {
                    // After we've loaded the credentials
                    AWSService.credentials().then(function() {
                        var email = UserService.currentUser();
                        // Get the dynamo instance for the
                        // UsersTable
                        AWSService.dynamo({
                            params: {TableName: service.UsersTable}
                        })
                            .then(function(table) {
                                // find the user by email
                                table.getItem({
                                    Key: {'UserEmail': {S: email}}
                                }, function(err, data) {
                                    if (!err) {

                                        if (Object.keys(data).length == 0) {
                                            // User didn't previously exist
                                            // so create an entry
                                            var itemParams = {
                                                Item: {
                                                    'UserEmail': {S: email},
                                                    data: { S: JSON.stringify(e) }
                                                }
                                            };
                                            table.putItem(itemParams,
                                                function (err, data) {
                                                    service._user = e;
                                                    d.resolve(e);
                                                });
                                        } else {
                                            // The user already exists
                                            service._user =
                                                JSON.parse(data.Item.data.S);
                                            d.resolve(service._user);
                                        }
                                    } else {
                                        d.reject(err);
                                    }
                                });
                            });
                    });
                }

                return d.promise;
            },
            Bucket: 'sgpapp.users',
            storeItemAsFile: function(itemObject) {
                var d = $q.defer();
                UserService.currentUser().then(function(user){
                    AWSService.s3({params: {Bucket: service.Bucket }}).then(function(s3){
                        var params = {
                            Key: itemObject.guid+'.json',
                            Body: angular.toJson(itemObject),
                            ContentType: 'application/json'
                        };
                        s3.putObject(params, function(err, data){
                            if(!err) {
                                var params = {
                                    Bucket: service.Bucket,
                                    Key: itemObject.guid+'.json',
                                    Expires: 900*4
                                };
                                s3.getSignedUrl('getObject', params, function(err, url){
                                    if(!err) {
                                        d.resolve(url);
                                    } else {
                                        d.reject(err);
                                    }
                                });
                            } else {
                                d.reject(err);
                            }
                        });
                    });
                });
                return d.promise;
            },
            saveUserSchools: function(schools) {
                var d = $q.defer();
                UserService.currentUser().then(function(user) {
                    AWSService.dynamo({params: {TableName: service.UserShollsTable}
                    }).then(function (table) {
                        var itemParams =  {
                            Item: {
                                'UserEmail': {S: user.email},
                                data: {
                                    S: angular.toJson(schools)
                                }
                            }
                        }

                        table.putItem(itemParams, function(err, data) {
                            d.resolve(data);
                        });
                    });
                });

            },
            getUserSchools: function() {
                var d = $q.defer();
                UserService.currentUser().then(function(user){
                    AWSService.dynamo({params: {TableName: service.UserShollsTable}}).then(function(table){
                        table.query({TableName: service.UserShollsTable,
                            KeyConditions: {
                                "UserEmail": {
                                    "ComparisonOperator": "EQ",
                                    "AttributeValueList": [{"S": user.email}]
                                }
                            }
                        }, function(err, data) {
                            var items = [];
                            if(data) {
                                angular.forEach(data.Items, function(item) {
                                    var objs = JSON.parse(item.data.S);
                                    for(var i=0;i<objs.length;i++) {
                                        items.push(objs[i]);
                                    }
                                });
                                d.resolve(items);
                            } else {
                                d.reject(err);
                            }

                        });
                    });
                });
                return d.promise;
            },
            saveKlassDetails: function(klass) {
                var d = $q.defer();
                UserService.currentUser().then(function(user) {
                    AWSService.dynamo({params: {TableName: service.UserKlassTable}
                    }).then(function(table){
                        var itemParams = {
                            Item: {
                                'Guid': {S: klass.guid},
                                'UserEmail': {S: user.email},
                                data: {
                                    S: angular.toJson(klass)
                                }
                            }
                        }
                        table.putItem(itemParams, function(err, data) {
                            d.resolve(data);
                        });
                    });
                });
                return d.promise;
            },
            saveExamDetais: function(exam) {
                var d = $q.defer();

                var answerSheet;
                if (exam.questions.length <=20){
                    answerSheet = 1;
                }else if(exam.questions.length <=50){
                    answerSheet = 2;
                }else{
                    answerSheet = 3;
                }
                var now = new Date;
                var timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
                    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
                timestamp = Math.floor(timestamp / 1000);
                UserService.currentUser().then(function(user) {
                    AWSService.dynamo({
                        params: {TableName: service.UserExamsTable}
                    }).then(function(table) {
                        var itemParams = {
                            Item: {
                                'Guid': {S: exam.guid},
                                'UserEmail': {S: user.email},
                                'LastModifiedBy': {S: "web"},
                                'Data': {
                                    S: JSON.stringify({
                                        guid: exam.guid,
                                        name: exam.name,
                                        idPublished: 0,
                                        points: exam.points,
                                        isDeleted:0,
                                        questions: exam.questions.length,
                                        lastModified: timestamp,
                                        answerSheetId: answerSheet
                                    })
                                }
                            }
                        };

                        table.putItem(itemParams, function(err, data) {
                            console.log(err);
                            d.resolve(data);
                        });
                    });
                });
                return d.promise;
            },
            storeKeys: function(keys) {
                var d = $q.defer();

                UserService.currentUser().then(function(user){
                    AWSService.dynamo({
                        params: {TableName: service.UserKeysTable}
                    }).then(function(table){
                        var itemParams = {
                            Item: {
                                'Guid': {S: keys.guid},
                                'UserEmail': {S: user.email},
                                'Data': {
                                    S: JSON.stringify(keys)
                                },
                                'LastModifiedBy':{S: 'web'}
                            }
                        };

                        table.putItem(itemParams, function(err, data){
                            console.log(err);
                            d.resolve(data);
                        });

                    });
                });

                return d.promise;
            },
            storeExam: function(exam) {
                var d = $q.defer();

                var store_question = function (index, questions) {

                    each_question = questions[index];

                    if (!each_question.synced) {
                        //Setando identificadores unicos
                        if (!each_question.guid) {
                            each_question.guid = UtilService.genenerateUUID();
                        }
                        for (var alt_i = 0; alt_i < each_question.alternatives.length; alt_i++) {
                            if (!each_question.alternatives[alt_i].guid) {
                                each_question.alternatives[alt_i].guid = UtilService.genenerateUUID();
                            }
                        }

                        index++;

                        service.storeItemAsFile(each_question).then(function (url) {
                            each_question.url = UtilService.getNotSignedUrl(url);
                            each_question.synced = true;


                            if(index < questions.length) {
                                store_question(index, questions);
                            } else {
                                if (!exam.guid) {
                                    exam.guid = UtilService.genenerateUUID();
                                }

                                var simple_exam = angular.copy(exam);
                                for (var i = 0; i < simple_exam.questions.length; i++) {
                                    alt = simple_exam.questions[i];
                                    simple_exam.questions[i] = alt.url;
                                }

                                service.storeItemAsFile(simple_exam).then(function (url) {
                                    exam.url = UtilService.getNotSignedUrl(url);
                                    service.saveExamDetais(exam).then(function (data) {
                                        d.resolve(data);
                                    });
                                });
                            }
                        });


                    } else {
                        index++;
                        if(index < questions.length) {
                            store_question(index, questions);
                        } else {
                            if (!exam.guid) {
                                exam.guid = UtilService.genenerateUUID();
                            }

                            var simple_exam = angular.copy(exam);
                            for (var i = 0; i < simple_exam.questions.length; i++) {
                                alt = simple_exam.questions[i];
                                simple_exam.questions[i] = alt.url;
                            }

                            service.storeItemAsFile(simple_exam).then(function (url) {
                                exam.url = UtilService.getNotSignedUrl(url);
                                service.saveExamDetais(exam).then(function (data) {
                                    d.resolve(data);
                                });
                            });

                        }
                    }
                }

                store_question(0, exam.questions);

                return d.promise;
            },
            loadExam: function(examID) {

                var clean_object_key = function (key, bucket) {
                    var key_arrary = null;
                    key_arrary = key.split('/');

                    if(key_arrary[0]=="") {
                        key_arrary.splice(0,1);
                    }

                    if(key_arrary[0] == bucket) {
                        key_arrary.splice(0,1);
                    }

                    return key_arrary.join('/');


                }


                var d = $q.defer();
                UserService.currentUser().then(function(user) {
                    AWSService.s3({params: {Bucket: service.Bucket }}).then(function (s3) {



                        var params = {
                            Bucket: service.Bucket,
                            Key: clean_object_key(examID, service.Bucket) + ".json",
                            ResponseContentType: 'application/json'
                        };
                        s3.getObject(params, function (err, data) {
                            if (err) console.log(err, err.stack); // an error occurred
                            else {
                                var str = data.Body.toString();
                                var object = angular.fromJson(str);

                                var load_questions = function (index, questions) {
                                    if (index < questions.length) {
                                        AWSService.s3({params: {Bucket: service.Bucket}}).then(function (s3) {
                                            var key_value = UtilService.getKeyFromUrl(questions[index]);
                                            key_value = key_value.substring(1);
                                            var params = {
                                                Bucket: service.Bucket,
                                                Key: clean_object_key(key_value, service.Bucket)
                                            }
                                            s3.getObject(params, function (err, data) {
                                                if (err) console.log(err, err.stack);
                                                else {
                                                    questions[index] = angular.fromJson(data.Body.toString());
                                                    index++;
                                                    load_questions(index, questions);
                                                }
                                            });
                                        });
                                    } else {
                                        d.resolve(object);
                                    }
                                }

                                load_questions(0, object.questions);

                            }
                            ;
                        });
                    });
                });

                return d.promise;
            },
            getKlasses: function() {
                var d = $q.defer();
                UserService.currentUser().then(function(user){
                    AWSService.dynamo({params: {TableName: service.UserKlassTable}}).then(function(table){
                        table.query({TableName: service.UserKlassTable,
                            KeyConditions: {
                                "UserEmail": {
                                    "ComparisonOperator": "EQ",
                                    "AttributeValueList": [{S: user.email}]
                                }
                            }
                        }, function(err, data) {
                            var items = [];
                            if(data) {
                                angular.forEach(data.Items, function(item) {
                                    items.push(JSON.parse(item.data));
                                });
                                d.resolve(items);
                            } else {
                                d.reject(err);
                            }

                        });
                    });
                });
                return d.promise;
            },
            getKlass: function(klassId) {
                var d = $q.defer();
                UserService.currentUser().then(function(user){
                    AWSService.dynamo({params: {TableName: service.UserKlassTable}}).then(function(table){
                        table.query({TableName: service.UserKlassTable,
                            KeyConditions: {
                                "UserEmail": {
                                    "ComparisonOperator": "EQ",
                                    "AttributeValueList": [{S: user.email}]
                                },
                                "Guid": {
                                    "ComparisonOperator": "EQ",
                                    "AttributeValueList": [{S: klassId}]
                                }
                            }
                        }, function(err, data) {
                            var ret = null;
                            if(data) {
                                angular.forEach(data.Items, function(item) {
                                    ret = angular.fromJson(item.data.S);
                                });
                                d.resolve(ret);
                            } else {
                                d.reject(err);
                            }

                        });
                    });
                });
                return d.promise;
            },
            getExams: function(user) {
                var d = $q.defer();


                AWSService.dynamo({
                    params: {TableName: service.UserExamsTable}
                }).then(function(table) {

                    table.query({
                        TableName: service.UserExamsTable,
                        KeyConditions: {
                            "UserEmail": {
                                "ComparisonOperator": "EQ",
                                "AttributeValueList": [
                                    {"S": user.email}
                                ]
                            }
                        }
                    }, function(err, data) {
                        var items = [];
                        if (data) {
                            angular.forEach(data.Items, function(item) {
                                items.push(JSON.parse(item.Data.S));
                            });
                            d.resolve(items);
                        } else {
                            d.reject(err);
                        }
                    })
                });



                return d.promise;

            },
            getExamById: function(user, guid) {
                var d = $q.defer();

                AWSService.dynamo({
                    params: {TableName: service.UserExamsTable}
                }).then(function(table) {

                    table.query({
                        TableName: service.UserExamsTable,
                        KeyConditions: {
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
                        }
                    }, function(err, data) {
                        var items = [];
                        if (data) {
                            angular.forEach(data.Items, function(item) {
                                items.push(JSON.parse(item.Data.S));
                            });
                            d.resolve(items);
                        } else {
                            d.reject(err);
                        }
                    })
                });



                return d.promise;

            }


        };
        return service;
    })