BeetApp

    .factory('Main', function($http) {
        return {
            getMenus : function() {
                return $http.get('sadsad' + '/menu');
            }
        }
     });
