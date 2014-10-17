BeetApp
    .controller('UserController', function($scope, $rootScope,$stateParams, $sce, $http, $location, $timeout, Attribute,User, Common) {

        $scope.formData = {};
        $scope.moduleData = {};

        $('#beet-loader-open').trigger("click");

        var objService = User;

        // retirar
        $rootScope.session.menu = {"description":"User","url":"user/edit","icon_class":"glyph-icon flaticon-pages","_id":"538dcc59c2cd7d080c000005","__v":0,"modules":[{"_id":"53b2fb74f99195680b000002","description":"user"}]};

        var objModule =  $rootScope.session.menu.modules[0];

        moduleData = $rootScope.session.user;
        $scope.moduleData = moduleData;
        $("#imgAvatar").attr("src","/images/uploads/"+objModule.description+"/" + moduleData._id + ".png");
        $('#beet-loader-close').trigger("click");
                    
        Attribute.getByModule(objModule._id)
            .success(function(data) {

                $scope.attributes = data;

                $timeout(function(){
                    Common.loadAttributesByModule(objModule);
                });
            });



        $scope.save = function() {

            var objSend = new Object();

            objSend["attributes"] = fillAttributes();

            if ($scope.moduleData._id != undefined){
                objService.update(objSend, $scope.moduleData._id)
                .success(function(data) {
                    $("#beet-modal-success").trigger("click");
                    $location.path(objModule.description + "/list");
                });
            }else{
             
            }

        };     
    });


