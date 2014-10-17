BeetApp
    .controller('PersonController', function($scope, $rootScope,$stateParams, $sce, $q, $http, $location, $timeout, Attribute,Person, Common) {

        var objService = Person;
        var objModule =  $rootScope.session.menu.modules[0];
        $rootScope.loadingContent = true;
        loadPage();

        function loadPage(){


            $scope.moduleData = undefined;

            objService.getByCompany($rootScope.session.company._id)
                .then(function(allModuleData) {
                    $scope.allModuleData = allModuleData;
                    
                    Attribute.getByModule(objModule._id)
                        .then(function(data) {
                            $scope.attributes = data;

                            $rootScope.loadingContent = false;
                            $rootScope.moduleLoading = false;
                        });    
                });

        }

        $scope.save = function() {

            var objSend = new Object();

            objSend["attributes"] = fillAttributes();
            objSend["company"] = $rootScope.session.company._id;
            objSend["active"] = true;

            if ($scope.moduleData._id != undefined){
                objService.update(objSend, $scope.moduleData._id)
                    .success(function(data) {
                        loadPage();
                        Common.showToastMessage();

                    });
            }else{
                objService.create(objSend)
                    .success(function(data) {
                        loadPage();
                        Common.showToastMessage();
                    });
            }
        };

        $scope.create = function() {
            $scope.moduleData = {};
            $scope.$apply();
        };

        $scope.edit = function(_id) {
            $rootScope.moduleLoading = true;


            if (_id != undefined){
                $scope.moduleData = undefined;
                $(".message-active").each(function(){
                    $(this).removeClass("message-active");
                });

                $("[id='message-"+_id+"']").addClass("message-active");                
                objService.getOne(_id)
                    .then(function(moduleData) {
                        $scope.moduleData = moduleData;
                        $timeout(function(){
                            $rootScope.moduleLoading = false;    
                        });
                    });
            }
        };

        $scope.cancel = function() {
            $scope.moduleData = undefined;
            $(".message-active").each(function(){
                $(this).removeClass("message-active");
            });            
        };

        $scope.delete = function(_id) {
            $location.path(objModule.description + '/delete/' + _id);
        };

    });


