BeetApp
    .directive("attribute", function (Common, $timeout) {


        return {
            //replace: true,
            restrict: 'E',
            scope: {data: '=',dataset: '='},
            //require:'^PersonController', //, options: '=', placeholder: '@', ngModel: '='
            link: function(scope, element) {

                var value      = "";
                var data       = scope.data;
                var moduleData = scope.dataset;
                var id         = data.group.description + "." + data.description;

                if (moduleData != undefined){
                    if (moduleData.attributes != undefined){
                        if (moduleData.attributes[data.group.description] != undefined){
                            if (moduleData.attributes[data.group.description] != undefined){
                                if (moduleData.attributes[data.group.description][data.description] != undefined){
                                    value = moduleData.attributes[data.group.description][data.description];
                                }
                            }
                        }
                    }
                }

                $timeout(function(){
                    if (data.type.template.toLowerCase() == "text"){
                        document.querySelector('[id="'+id+'"]').addEventListener('input', function(event) {
                            document.querySelector('[id="' + id + '"]').commit();
                        });
                    }else if (data.type.template.toLowerCase() == "radio"){
                        if (value!="") {
                            value = value.toLowerCase();
                            document.querySelector('[name="' + value + '"]').checked = true;
                            document.querySelector('[id="' + id + '"]').selected = value;
                            document.querySelector('[id="' + id + '"]').selectedChanged();
                        }
                    }

                    if (data.type.events != undefined){
                        Common.setPolymerEvent(data);
                    }

                    if (data.type.properties != undefined){
                        if (data.type.properties.mirror != undefined){
                            Common.setPolymerMirror(data);
                        }
                    }

                    if (data.type.properties != undefined){
                        if (data.type.properties.mask != undefined){
                            Common.setPolymerMask(data);
                        }
                    }
                },777);

                scope.value=value;
                scope.templateUrl="views/directives/"+scope.data.type.template.toLowerCase()+".html";
            },
            template: '<div ng-include="templateUrl"></div>'

        }

    });
