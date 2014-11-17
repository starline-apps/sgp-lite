SGPApp
    .factory('Dynamo', function($q, AWSService) {
        var service = {
            putItem: function(table, item) {
                var d = $q.defer();
                var params = {
                    params: {
                        TableName: table
                    }
                };
                AWSService.dynamo(params)
                    .then(function (dataSet) {
                        if (dataSet===null){
                            d.resolve(null)
                        }else{
                            dataSet.putItem(item, function(err, data) {
                                if (data===null){
                                    d.resolve(null);
                                }else{
                                    d.resolve(data);
                                }

                            });
                        }
                    });
                return d.promise;
            },
            query: function(table, keyConditions, indexName) {
                var d = $q.defer();
                var params = {
                    params: {
                        TableName: table
                    }
                };
                AWSService.dynamo(params).then(function(dataSet){
                    params = {
                        TableName: table,
                        KeyConditions: keyConditions
                    };
                    if (indexName){
                        params.IndexName = indexName;
                    }
                    dataSet.query(params, function(err, data) {
                        var items = [];
                        if(data) {
                            angular.forEach(data.Items, function(item) {
                                items.push(item);
                            });
                            d.resolve(items);
                        } else {
                            d.resolve(null);
                        }

                    });
                });
                return d.promise;
            }
        };
        return service;
    })








