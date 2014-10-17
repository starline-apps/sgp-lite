BeetApp
    .controller('CompanyController', function($scope, $rootScope,$stateParams, $sce, $http, $location, $timeout, Attribute,Company, Common) {

        $scope.formData = {};
        $scope.moduleData = {};

        $('#beet-loader-open').trigger("click");

        var objService = Company;

        // retirar
        $rootScope.session.menu = {"description":"Empresa","url":"company/list","icon_class":"glyph-icon flaticon-pages","_id":"538dcc59c2cd7d080c000005","__v":0,"modules":[{"_id":"53ad6b5b964efb2010000002","description":"company"}]};

        var objModule =  $rootScope.session.menu.modules[0];

        if ($location.path() == "/" + objModule.description + "/list"){
            objService.get()
                .success(function(allModuleData) {
                    $timeout(function(){
                        $scope.allModuleData = allModuleData;
                        $('#beet-loader-close').trigger("click");
                    });
                });
        }else{


            if ($stateParams._id != undefined){
                objService.getOne($stateParams._id)
                    .success(function(moduleData) {
                        $timeout(function(){
                            $scope.moduleData = moduleData;
                            $("#imgAvatar").attr("src","/images/uploads/"+objModule.description+"/" + moduleData._id + ".png");
                            $('#beet-loader-close').trigger("click");
                        });
                    });
            }else{
                $('#beet-loader-close').trigger("click");
            }
                        
            Attribute.getByModule(objModule._id)
                .success(function(data) {

                    $scope.attributes = data;

                    $timeout(function(){
                        Common.loadAttributesByModule(objModule);
                    });
                });


        }

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
                objService.create(objSend)
                .success(function(data) {
                    $("#beet-modal-success").trigger("click");
                    $location.path(objModule.description + "/list");
                });                
            }

        };

        $scope.create = function() {
            $location.path(objModule.description + '/create'); 
        };

        $scope.edit = function(_id) {
            $location.path(objModule.description + '/edit/' + _id);
        };   

        $scope.delete = function(_id) {
            $location.path(objModule.description + '/delete/' + _id);
        };         
    });


