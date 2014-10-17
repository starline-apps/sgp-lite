BeetApp
    .directive("avatar", function (Common) {
        return {
            replace: true,
            restrict: 'E',
            scope: { module: '@', photo: '@', scale: '@', class: '@', width:'@', height:'@'}, //, options: '=', placeholder: '@', ngModel: '='
            templateUrl:"views/directives/avatar.html",
            compile: function(tElem,attrs) {
                //do optional DOM transformation here
                return {
                    post: function (scope, elem, attrs) {
                        scope.$watch('photo', function (newValue) {
                            if (scope.photo != "" && scope.module != "") {
                                Common.isValidImage(attrs.url).success(function () {
                                    $("[url='" + attrs.url + "']").attr("src", attrs.url);
                                }).error(function () {
                                    $("[url='" + attrs.url + "']").attr("src", "images/uploads/" + scope.module + "/default.png");
                                });
                            }
                        });
                    }
                }
            }
        }
    });
