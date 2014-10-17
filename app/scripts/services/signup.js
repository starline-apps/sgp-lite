BeetApp
    .factory('Signup', function($http, Common) {
        return {
            get : function() {
                return $http.get(Common.getApiUrl() + '/signup');
            },
            post : function(data) {
                return $http.post(Common.getApiUrl() + '/signup', data);
            }
        }
    });