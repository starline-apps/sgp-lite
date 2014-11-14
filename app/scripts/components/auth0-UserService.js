SGPApp
    .factory("UserService",["$q", "$http", "auth","Config","$location","Common", function ($q, $http, auth, Config, $location, Common) {
        var service = {
            _user: null,
            _targetClientId: Config.getAuth0ClientId(),
            _role: Config.getAuth0Role(),
            _principal: Config.getAuth0Principal(),
            currentUser: function () {
                var d = $q.defer();
                if (!service._user) {
                    if (auth.profile!=undefined){
                        service._user = auth.profile;
                        d.resolve(service._user);
                    }else{
                        Common.showToastMessage("Favor fazer login novamente !");
                        d.reject($location.path("Login"));
                    }

                }else{
                    d.resolve(service._user);
                }



                return d.promise;
            },
            awsCredentials: function() {
                var d = $q.defer();
                service.currentUser().then(function (user_profile){
                    //auth0.getDelegationToken(options.targetClientId, user.get().id_token, { role: options.role, principal: options.principal }, callback);
                    var auth0 = new Auth0({
                        domain:         Config.getAuth0Domain(),
                        clientID:       Config.getAuth0ClientId()
                    });
                    auth0.getDelegationToken({id_token:auth.idToken,role: service._role, principal: service._principal },
                        function (err, delegationResult){
                            d.resolve(delegationResult.Credentials);
                        });
                });

                return d.promise;

            }
        };
        return service;
    }]);