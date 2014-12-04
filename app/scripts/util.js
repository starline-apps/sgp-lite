"use strict";
SGPApp
    .factory("Common", ["$rootScope", "$mdToast",function ($rootScope, $mdToast) {
        function toggleDialog(id) {
            var dialog = document.querySelector("#"+id);
            dialog.toggle();
        }
        function loading(bln){
            if(bln){
                $("#lstop").hide();
                $("#lplay").show();
            }else{
                $("#lstop").show();
                $("#lplay").hide();
            }

        }

        function setPage (id, value){
            var p = document.querySelector("#" + id);
            p.selected = value;
        }


        return {
            generateUUID: function() {
                var d = new Date().getTime();
                var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                    var r = (d + Math.random()*16)%16 | 0;
                    d = Math.floor(d/16);
                    return (c=="x" ? r : (r&0x7|0x8)).toString(16);
                });
                return uuid;
            },
            getTimestamp: function() {
                var now = new Date();
                var timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
                    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
                timestamp = Math.floor(timestamp / 1000);
                return timestamp;
            },
            loading : function (bln){
                loading(bln);
            },
            toggleDialog : function (strName){
                toggleDialog(strName);
            },
            loadingContent : function (bln){
                if (bln){
                    setPage("main-animated-pages", "1");
                    $("#lstop").hide();
                    $("#lplay").show();
                    $(".overlay-transparent").show();
                }else{
                    setPage("main-animated-pages", "0");
                    $("#lstop").show();
                    $("#lplay").hide();
                    $(".overlay-transparent").hide();
                }

            },
            getApiUrl : function () {
                return "http://192.168.16.58:1313/api";
            },
            showToastMessage: function(text, type) {
                if (type==="warning"){
                    $mdToast.show({
                        template: "<md-toast class='bg-yellow-dark c-black s-120 bold'>"+text+"</md-toast>",
                        hideDelay: 2000,
                        position:"bottom right"
                    });
                }else{
                    $mdToast.show({
                        template: "<md-toast class='color-bg-3 c-white s-120 bold'>"+text+"</md-toast>",
                        hideDelay: 3000,
                        position:"bottom right"
                    });
                }

            }

        };
    }])

SGPApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
