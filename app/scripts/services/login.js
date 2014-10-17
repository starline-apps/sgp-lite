BeetApp
    .factory('Login', function($http, Common) {
        return {
            get : function() {
                return $http.get(Common.getApiUrl() + '/loggedin');
            },
            getCompanies : function() {
                return $http.get(Common.getApiUrl() + '/company');
            },            
            logout : function() {
                return $http.get(Common.getApiUrl() + '/logout');
            },  
            menu : function() {
                return $http.get(Common.getApiUrl() + '/menu');
            },          
            post : function(data) {
                return $http.post(Common.getApiUrl() + '/login', data);
            }              
        }
     });