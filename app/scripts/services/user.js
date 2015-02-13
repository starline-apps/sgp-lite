SGPApp
    .factory("User", ["$http","Common","Dynamo","$q",function($http, Common, Dynamo, $q) {
        return {
            get : function(email) {
                var d = $q.defer();

                var keyConditions = {
                    "UserEmail": {
                        "ComparisonOperator": "EQ",
                        "AttributeValueList": [
                            {"S": email}
                        ]
                    }
                };
                Dynamo.query("Users",keyConditions).then(function(dataSet) {
                    if (dataSet) {
                        var arr = [];
                        var obj, data;
                        obj = {};

                        if (dataSet.length > 0){
                            var itemSet = dataSet[0];
                            obj.subscriptionExpirationDate = itemSet.SubscriptionExpirationDate.N;
                            obj.data = JSON.parse(itemSet.Data.S);
                            obj.creditBalance = itemSet.CreditBalance.N;
                            if (!Common.isEmpty(itemSet.IsSubscribed)){
                              obj.isSubscribed = itemSet.IsSubscribed.N;
                            }else{
                              obj.isSubscribed = "0";
                            }

                            obj.lastModifiedBy = itemSet.LastModifiedBy.S;
                            obj.userEmail = itemSet.UserEmail.S;
                            obj.lastWritten = itemSet.LastWritten.N;
                            d.resolve(obj);
                        }else{
                            d.resolve(null);
                        }


                    } else {

                        d.resolve(null);
                    }
                });
                return d.promise;
            },
            save : function(profile) {

                var d = $q.defer();

                var timestamp = Common.getTimestamp();

                var dataSet = {
                    Item: {
                        "UserEmail": {S: profile.email},
                        "SubscriptionExpirationDate": {N: timestamp.toString()},
                        "LastModifiedBy": {S: "web"},
                        "LastWritten" : {N: timestamp.toString()},
                        "CreditBalance": {N: "0"},
                        "IsSubscribed": {N: "0"},
                        "Data": {
                            S: JSON.stringify(profile)
                        }
                    }
                };

                Dynamo.putItem("Users", dataSet).then(function(data){
                    d.resolve(data);
                });

                return d.promise;
            }
        }
     }]);
