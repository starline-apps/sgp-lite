"use strict";
function getAuth0ClientId(){
    return "vzlgoiuJkmXHW8pPcd4DOeR45BQPSo9I";
}
function getAuth0Domain(){
    return "starline.auth0.com";
}

SGPApp
    .factory("Config", [function () {
        return {
            getBucketName : function(){
                return "strtec";
            },
            getAuth0Domain : function(){
                return getAuth0Domain();
            },
            getAuth0ClientId : function(){
                return getAuth0ClientId();
            },
            getAuth0Role : function(){
                return "arn:aws:iam::331375578265:role/sgpapp-user-role";
            },
            getAuth0Principal : function(){
                return "arn:aws:iam::331375578265:saml-provider/auth0-provider";
            }
        };
    }]);

SGPApp
    .config(["authProvider",function (authProvider) {

        authProvider
            .init({
                domain: getAuth0Domain(),
                clientID: getAuth0ClientId(),
                callbackURL: location.href,
                // Here we add the URL to go if the user tries to access a resource he can"t because he"s not authenticated
                loginUrl: "/login"
            });

    }]);
