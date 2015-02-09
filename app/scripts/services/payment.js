SGPApp
    .factory("Payment", ["$http","$q",function($http, $q) {
        return {
            getPaymentLink : function(obj) {
              var d = $q.defer();

              $http.post("http://starline.herokuapp.com/api/gerencianet/payment-link", obj)
              //$http.post("http://192.168.16.58:1313/api/gerencianet/payment-link", obj)
                .success(function(data) {
                  d.resolve(data);
                })
                .error(function(data) {
                  d.resolve({error:data});
                });
              return d.promise;
            }
        }
     }]);
