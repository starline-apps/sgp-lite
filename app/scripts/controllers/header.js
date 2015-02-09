SGPApp
    .controller('HeaderController', ["$scope", "$rootScope","$sce", "$http", "$location", "$translate", "Common","$state","auth", function($scope, $rootScope,$sce, $http, $location, $translate, Common,$state,auth) {
        $scope.formData = {};

        $rootScope.languages = new Array("pt_br", "en", "es");

        $rootScope.logout = function() {
            auth.signout();
            window.location.href="/";
        };



        $scope.changeCompany = function(intIndex) {
            $rootScope.session.menus = $rootScope.session.companies[intIndex].menus;
            $rootScope.session.company = $rootScope.session.companies[intIndex];
            $("#modal-companies-close").trigger("click");
            $scope.toggleDialog();
            $location.path('home');

        };

        $scope.changeMenu = function(menu) {
            $(".user-menu").fadeOut("fast");
            $rootScope.session.menu = menu;
            $location.path(menu.url);
        };

        $scope.changeLanguage = function (key) {
            $translate.use(key);
        };

        $scope.showUserMenu = function(){
          $(".user-menu").fadeIn("fast");
          $(".user-menu").mouseleave(function(){
              $(".user-menu").fadeOut("fast");
          });
          $(".user-menu").mouseover(function(){
              $(this).fadeIn("fast");
          });
        };

        $rootScope.createHtmlElement = function(attribute, data){
            var strHtml = createHtml(attribute, data);
            return $sce.trustAsHtml(strHtml);
        };


        $scope.toggleDialog = function(strDialog){
            if ($rootScope.dialogCompany){
                $rootScope.dialogCompany = false;
            }else{
                $rootScope.dialogCompany = true;
            }

            //var d = document.querySelector("#" + strDialog);
            //d.toggle();
        };
        $rootScope.menusUser = [
            {
                "description" : "Minha conta",
                "url" : "account",
                "icon_class" : "glyphicon glyphicon-user",
                "flat_icon":"contract",
                "background_color":"purple",
                "text_color":"white"
            },/*
            {
                "description" : "Configurações",
                "url" : "settings",
                "icon_class" : "glyphicon glyphicon-cog",
                "flat_icon":"correction",
                "background_color":"red",
                "text_color":"white"
            },
            {
                "description" : "Ajuda",
                "url" : "help",
                "icon_class" : "glyphicon glyphicon-question-sign",
                "flat_icon":"correction",
                "background_color":"red",
                "text_color":"white"
            },*/
            {
                "description" : "Logout",
                "url" : "logout",
                "icon_class" : "glyphicon glyphicon-log-out",
                "flat_icon":"class",
                "background_color":"blue",
                "text_color":"black"

            }
        ];

        $rootScope.menutest = [
            {
                "description" : "Provas",
                "url" : "exam",
                "icon_class" : "glyphicon glyphicon-list-alt",
                "flat_icon":"contract",
                "background_color":"purple",
                "text_color":"white"
            },
            {
                "description" : "Questões",
                "url" : "item",
                "icon_class" : "glyphicon glyphicon-th-list",
                "flat_icon":"correction",
                "background_color":"red",
                "text_color":"white"
            },
            {
                "description" : "Turmas",
                "url" : "team",
                "icon_class" : "glyphicon glyphicon-tasks",
                "flat_icon":"class",
                "background_color":"blue",
                "text_color":"black"
            },
            {
              "description" : "Alunos",
              "url" : "student",
              "icon_class" : "glyphicon glyphicon-sort-by-alphabet",
              "flat_icon":"student",
              "background_color":"green",
              "text_color":"black"
            },
            {
                "description" : "Notas",
                "url" : "grade",
                "icon_class" : "glyphicon glyphicon-stats",
                "flat_icon":"graphics",
                "background_color":"yellow",
                "text_color":"black"
            }/*
            {
                "description" : "Melhores Alunos",
                "url" : "dfg",
                "icon_class" : "glyphicon glyphicon-thumbs-up",
                "flat_icon":"medal",
                "background_color":"green",
                "text_color":"black"
            },
            {
                "description" : "Calendário",
                "url" : "ert",
                "icon_class" : "glyphicon glyphicon-calendar",
                "flat_icon":"calendar",
                "background_color":"blue",
                "text_color":"black"
            },

            {
                "description" : "Pesquisar",
                "url" : "asdas",
                "icon_class" : "glyphicon glyphicon-filter",
                "flat_icon":"search",
                "background_color":"red",
                "text_color":"white"
            },
            {
                "description" : "Escolas",
                "url" : "assa",
                "icon_class" : "glyphicon glyphicon-globe",
                "flat_icon":"world",
                "background_color":"yellow",
                "text_color":"black"
            }      ,      {
                "description" : "Alunos",
                "url" : "sadasd",
                "icon_class" : "glyphicon glyphicon-sort-by-alphabet",
                "flat_icon":"student",
                "background_color":"grey",
                "text_color":"white"
            },
            {
                "description" : "Melhores Alunos",
                "url" : "ads",
                "icon_class" : "glyphicon glyphicon-thumbs-up",
                "flat_icon":"medal",
                "background_color":"green",
                "text_color":"black"
            },
            {
                "description" : "Calendário",
                "url" : "asd",
                "icon_class" : "glyphicon glyphicon-calendar",
                "flat_icon":"calendar",
                "background_color":"red",
                "text_color":"white"
            }
            */
        ];

/*
 {
 "description" : "Despesas",
 "url" : "expense",
 "icon_class" : "home",
 "flat_icon":"shopping",
 "background_color":"green",
 "text_color":"white"
 },
 {
 "description" : "Acomodação",
 "url" : "accomodation",
 "icon_class" : "home",
 "flat_icon":"accomodation",
 "background_color":"blue",
 "text_color":"white"
 },
 {
 "description" : "Avaliações",
 "url" : "expense",
 "icon_class" : "home",
 "flat_icon":"graphics",
 "background_color":"yellow",
 "text_color":"white"
 },
 {
 "description" : "Dados Gerais",
 "url" : "expense",
 "icon_class" : "home",
 "flat_icon":"form",
 "background_color":"grey",
 "text_color":"white"
 },
 {
 "description" : "Habilidades",
 "url" : "expense",
 "icon_class" : "home",
 "flat_icon":"star",
 "background_color":"purple",
 "text_color":"white"
 },
 {
 "description" : "Contratos",
 "url" : "expense",
 "icon_class" : "home",
 "flat_icon":"contract",
 "background_color":"red",
 "text_color":"white"
 }
		if ($location.path() != "/login"){
		    $(document).ready(function(){
		       $("#top-menu").show();
		       $("#sidebar").show();
		       $("#login-block").hide();
		    });
		}




        Menu.get()
            .success(function(data) {
                $("#container-menu").show();
                $scope.menus = data;
            })
*/
    }]);




    function createHtml(attribute, data){
        var html = "";

        var value = "";

        if (attribute.group != undefined){

            if (data != undefined){
                if (data.attributes != undefined){
                    if (data.attributes[attribute.group.description] != undefined){
                        if (data.attributes[attribute.group.description] != undefined){
                            if (data.attributes[attribute.group.description][attribute.description] != undefined){
                                value = data.attributes[attribute.group.description][attribute.description];
                            }
                        }
                    }
                }
            }

            var strName = attribute.group.description + "." + attribute.description;
            var attr = "ng-model='" +strName+ "' id='" +strName+ "'";

            if (attribute.size != null){
                attr += "size='" +attribute.size+ "' ";
            }

            if (attribute.required){
                attr += "required ";
            }

            switch (attribute.type.template){
                case "TEXT":
                    html = "<input type='TEXT' "+attr+" value='"+value+"' class='form-control input-lg' />";
                    break;
                case "TEXTAREA":
                    html = "<textarea "+attr+">"+value+"</textarea>";
                    break;
                case "DROPDOWN":
                    html = "<select "+attr+">"

                    for (option in attribute.type.selection)
                    {
                        if (option != value) {
                            html += "<option value='" + option + "'>" + option + "</option>";
                        } else {
                            html += "<option value='" + option + "' selected>" + option + "</option>";
                        }
                    }
                    html += "</select>";
                    break;
                case "RADIO":
                    html = "<select class='form-control' "+attr+"><option value=''>Selecione</option>"
                    arrSelection = attribute.type.selection;
                    for (x=0;x<arrSelection.length;x++)
                    {
                        if (arrSelection[x] != value) {
                            html += "<option value='" + arrSelection[x] + "'>" + arrSelection[x] + "</option>";
                        } else {
                            html += "<option value='" + arrSelection[x] + "' selected>" + arrSelection[x] + "</option>";
                        }
                    }
                    html += "</select>";
                    break;

                case "DATE":
                    html = "<div class='input-append date' id='dpYears' data-date='"+value+"' data-date-format='dd/mm/yyyy' data-date-viewmode='years' style='width:200px;'>"
                         +      "<input class='form-control input-lg' style='width:160px;' type='text' "+attr+" value='"+value+"' readonly=''>"
                         +      "<img src='images/icons/calendar-icon.png' class=' add-on' style='margin-top:-8px;margin-left:-38px;' />"
                         + "</div>";

                    $(function(){
                        $('#dpYears').datepicker();
                    });

                    break;

                    /*
                    arrSelection = attribute.type.selection;
                    html = "<div class='form-group'><div class='skin-section'>";

                    for (x=0;x<arrSelection.length;x++)
                    {

                        if (arrSelection[x] != value) {
                            html += "";
                        } else {
                            html += "";
                        }

                        html += "<div class='ui-checkbox'><label class='ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-on'>"+arrSelection[x]+"</label><input type='checkbox' checked='' data-cacheval='false'></div>";
                    }
                    html += "</div></div>";


                    break;
                    */

            }
        }
        return html;
    }

function fillAttributes(){
    var objAttributes = new Object();
    var value="";
    var element;
    var template="";
    $("[model]").each(function(){
        arrName = $(this).attr("model").split(".");
        if (objAttributes[arrName[0]] == undefined){
            objAttributes[arrName[0]] = new Object();
        }
        if ($(this).attr("template")){
            template = $(this).attr("template").toLowerCase();
        }else{
            template = "";
        }

        if (template != "radio" && template != "dropdown"){
            value = $(this).val();
        }else{
            value = document.querySelector('[model="'+$(this).attr("model") + '"]').selected;
        }
        objAttributes[arrName[0]][arrName[1]] = value;
    });
    return objAttributes;
}

