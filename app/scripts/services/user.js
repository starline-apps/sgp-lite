BeetApp
    .factory('User', function($http, Common) {
        return {
            update : function(data, _id) {
                return $http.put(Common.getApiUrl() + '/user/' + _id, data);
            }
        }
     });
