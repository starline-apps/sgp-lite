"use strict";
BeetApp
    .factory("Common", ["$rootScope", "$mdToast",function ($rootScope, $mdToast) {
        function formatElementName(strName){
            strName = strName.replace("dialog-","");
            var arr = strName.split("-");
            strName = arr[0];
            for (var x=1 ; x<arr.length ; x++){
                strName += arr[x].substring(0, 1).toUpperCase() + arr[x].substring(1, arr[x].length).toLowerCase();
            }
        }
        function toggleDialog(id) {
            var dialog = document.querySelector('#'+id);
            dialog.toggle();
        }
        function toggleLoader(){
            $("#lstop").toggle();
            $("#lplay").toggle();
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

            loadingPage : function(blnShow, strImageControl){
                if (blnShow){
                    $rootScope.loadingPage = true;
                    $("#container").fadeOut( "fast");
                    $("#lstop").removeClass("opacity");
                    $("#loadingPage").animate({bottom:"45%",left:"47%"}, 300, "swing", function(){
                        loading(true);
                    });
                }else{
                    $rootScope.loadingPage = false;
                    loading(false);
                    $("#loadingPage").animate({bottom:"50px",left:"50px"}, 300, "swing", function(){
                        $("#container").fadeIn("fast");
                        $("#lstop").addClass("opacity");
                    });
                }
                if (strImageControl==="hide"){
                    $("#loadingPage").hide();
                }else{
                    $("#loadingPage").show();
                }
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
            setPage : function (id, value){
                setPage(id, value);
            },
            getApiUrl : function () {
                return "http://192.168.16.58:1313/api";
            },
            isValidImage: function (src) {
                return $http.get(src);
            },
            setPolymerEvent: function (data) {

                var id = data.group.description + "." + data.description;
                var value = "";
                if (data.type.events.input != undefined) {

                    document.querySelector('[id="' + id + '"]').addEventListener('input', function (event) {
                        document.querySelector('[id="' + id + '"]').commit();
                        value = event.target.value.replace("-", "");
                        if (value.length == 8) {
                            $("[id='" + id + "']").attr("disabled", "disabled");
                            Attribute.getPostCodeData(value)
                                .success(function (data) {
                                    $timeout(function () {
                                        $("[id='person_data.neighborhood']").val(data.bairro);
                                        $("[id='person_data.street']").val(data.logradouro);
                                        $("[id='person_data.state']").val(data.estado);
                                        $("[id='person_data.city']").val(data.cidade);
                                        $("[id='person_data.complement']").focus();
                                    });
                                });

                            $("[id='" + id + "']").removeAttr("disabled");
                        }
                    });
                }
            },
            setPolymerMask :function (data){
                var mask = data.type.properties.mask;
                var selector = "[id='"+data.group.description + "." + data.description+"']";

                var onInput = function (event){
                    var value = event.target.value;

                    switch(mask.toLowerCase()) {
                        case "postcode":
                            $(selector).attr("maxlength","9");
                            value = value.replace(/\D/g,"");
                            value = value.replace(/^(\d{5})(\d)/,"$1-$2");
                            break;
                        case "cpf":
                            $(selector).attr("maxlength","14");
                            value = value.replace(/\D/g,"");
                            value = value.replace(/(\d{3})(\d)/,"$1.$2");
                            value = value.replace(/(\d{3})(\d)/,"$1.$2");
                            value = value.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
                            break;
                        case "cnpj":
                            $(selector).attr("maxlength","18");
                            value=value.replace(/\D/g,"");
                            value=value.replace(/^(\d{2})(\d)/,"$1.$2");
                            value=value.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3");
                            value=value.replace(/\.(\d{3})(\d)/,".$1/$2");
                            value=value.replace(/(\d{4})(\d)/,"$1-$2");
                            break;
                        case "money":
                            value = value.replace(/\D/g,"");
                            value = value.replace(/(\d)(\d{8})$/,"$1.$2");
                            value = value.replace(/(\d)(\d{5})$/,"$1.$2");
                            value = value.replace(/(\d)(\d{2})$/,"$1,$2");
                            break;
                        case "number":
                            value = value.replace(/\D/g,"");
                            break;
                        default:
                            break;
                    }

                    event.target.value = value;
                };

                document.querySelector(selector).addEventListener('input', onInput);
            },

            setPolymerMirror: function(data){
                var mirror = data.type.properties.mirror;
                var id     = data.group.description + "." + data.description;

                if (mirror=="label" || mirror=="span"){
                    mirror = mirror + "." + id;
                }

                document.querySelector('[id="'+id+'"]').addEventListener('input', function(event) {
                    $("[id='"+mirror+"']").text(event.target.value);
                });

            },
            showToastMessage: function(text) {
                $mdToast({
                    template: "<md-toast class='color-bg-4'>"+text+"</md-toast>",
                    duration: 3000,
                    position:"bottom right"
                });
            }

        };
    }]);