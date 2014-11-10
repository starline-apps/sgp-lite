SGPApp
    .factory('Expense', function($http, Common) {
        return {
            getByPersonAndInterval : function(personId, initialDate, finalDate) {
                return $http.get(Common.getApiUrl() + "/expense/person/" + personId + "/" + initialDate + "/" + finalDate);
            },
            getByCompanyAndInterval : function(companyId, initialDate, finalDate) {
                return $http.get(Common.getApiUrl() + "/expense/company/" + companyId + "/" + initialDate + "/" + finalDate);
            },
            getOne : function(expenseId) {
                return $http.get(Common.getApiUrl() + '/expense/' + personId);
            },   
            getByCompany : function(companyId) {
                return $http.get(Common.getApiUrl() + "/" + companyId + '/expense');
            }, 
            create : function(data) {
                return $http.post(Common.getApiUrl() + '/expense', data);
            },
            update : function(data, _id) {
                return $http.put(Common.getApiUrl() + '/expense/' + _id, data);
            },
            delete : function(_id) {
                return $http.delete(Common.getApiUrl() + '/expense/' + _id);
            }
        }
     });