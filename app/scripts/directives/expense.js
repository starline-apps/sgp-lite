SGPApp
    .directive("expense", function () {
        return {
            replace: true,
            restrict: 'E',
            scope: { module: '@', date: '@', person: '@'}, //, options: '=', placeholder: '@', ngModel: '=' 
            templateUrl:"views/directives/expense.html",
            compile: function(tElem,attrs) {             
                //do optional DOM transformation here
                return function(scope,elem,attrs) {
                      scope.$watch('photo', function(newValue) {
                        $.get(attrs.src)
                            .fail(function() {
                                $("[src='"+attrs.src+"']").attr("src", "images/uploads/"+scope.module+"/default.png");
                            });  
                      }, true);   
                }
            }      

        }
    });
