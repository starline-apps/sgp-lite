SGPApp
    .factory('S3', function($q, AWSService) {
        var service = {
            putObject: function(bucket, key, object) {
                var d = $q.defer();
                AWSService.s3().then(function(s3){
                    var params = {
                        Bucket: bucket,
                        Key: key,
                        Body: JSON.stringify(object),
                        ContentType: 'application/json'

                    };
                    s3.putObject(params, function(err, data){
                        if(!err) {
                            var params = {
                                Bucket: bucket,
                                Key: key,
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
                return d.promise;
            },
            getObject: function(bucket, key) {
                var d = $q.defer();
                AWSService.s3().then(function (s3) {
                    var params = {
                        Bucket: bucket,
                        Key: key,
                        ResponseContentType: 'application/json'
                    };
                    s3.getObject(params, function (err, data) {
                        if (err!==null){
                            console.log(err);
                        }
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
            }

        };
        return service;
    });
