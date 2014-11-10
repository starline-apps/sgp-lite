SGPApp
    .factory('Person', function($http, $q, Config) {
        return {
            getByCompany : function(companyId) {
                var defer = $q.defer();
                $http.get(Common.getApiUrl() + "/" + companyId +'/person')
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.resolve(data);
                    });                
                return defer.promise;
            },
            getOne : function(personId) {
                var defer = $q.defer();
                $http.get(Common.getApiUrl() + '/person/' + personId)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.resolve(data);
                    });
                return defer.promise;
            },            
            create : function(data) {
                return $http.post(Common.getApiUrl() + '/person', data);
            },
            update : function(data, personId) {
                return $http.put(Common.getApiUrl() + '/person/' + personId, data);
            }

 
        }
     });
