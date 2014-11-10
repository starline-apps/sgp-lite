SGPApp
    .factory('Company', function($http, Common) {
        return {
            get : function() {
                return $http.get(Common.getApiUrl() + '/company');
            },
            getOne : function(companyId) {
                return $http.get(Common.getApiUrl() + '/company/' + companyId);
            },            
            create : function(data) {
                return $http.post(Common.getApiUrl() + '/company', data);
            },
            update : function(data, companyId) {
                return $http.put(Common.getApiUrl() + '/company/' + companyId, data);
            }        
        }
     });
