BeetApp
    .factory('Attribute', function($http, Common, $q) {
        return {
            getByModule : function(moduleId) {
                var defer = $q.defer();
                $http.get(Common.getApiUrl() + '/attribute-grouped/' + moduleId)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.resolve(data);
                    });
                return defer.promise;                
            },          
            getPostCodeData : function(postcode) {
                return $http.get('http://api.postmon.com.br/v1/cep/' + postcode,{withCredentials : false});
            }
        }
     });
