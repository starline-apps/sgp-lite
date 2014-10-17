BeetApp.directive("datepicker", function () {
    return {
        replace: true,
        restrict: 'E',
        scope: { data: '=', value:'='}, //, options: '=', placeholder: '@', ngModel: '='
        templateUrl:'views/directives/datepicker.html',
        link: function (scope, element) {
            scope.value="";

        },
        compile : function(){
            return {
                post : function(scope, element, attributes){
                    setTimeout(function(){
                      $('[id="datepicker.'+scope.data.group.description+'.'+scope.data.description+'"]').datepicker()},
                      1000
                    );

                }
            }
        }



    };
});