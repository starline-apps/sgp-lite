﻿SGPApp
    .directive("stlFab", function ($compile) {
        var linker = function(scope, element, attrs) {
            $compile(element.contents())(scope);

            $(document).ready(function(){

            });
        };

        return {
            restrict: "E",
            link: linker,
            scope: {
                css:'=',
                id:'=',
                tooltip:'=',
                iconclass:'='
            },
            compile: function compile( tElement, tAttributes ) {
                return {
                    pre: function preLink( scope, element, attributes ) {

                    },
                    post: function postLink( scope, element, attributes ) {
                        setTimeout(function(){
                            $("[tooltip='"+scope.id+"']").mouseover(function(){
                                $("#" + scope.id).slideDown("fast");
                            });
                            $("[tooltip='"+scope.id+"']").mouseleave(function(){
                                $("#" + scope.id).slideUp();
                            });
                        },500);


                    }
                };
            },
            templateUrl:'views/directives/fab.html'
        };



    });
