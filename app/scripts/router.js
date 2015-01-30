"use strict";
SGPApp.factory('errorInterceptor', ['$q', '$rootScope', '$location',
    function ($q, $rootScope, $location) {
        return {
            request: function (config) {
                return config || $q.when(config);
            },
            requestError: function(request){
                return $q.reject(request);
            },
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (response && response.status === 401) {
                    $location.url('/login');
                }
                if (response && response.status >= 500) {
                    alert("error 500");
                }
                return $q.reject(response);
            }
        };
    }]);
SGPApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    //$locationProvider.html5Mode(true);


    $urlRouterProvider.otherwise('/login');

    $stateProvider

        .state('login', {
            url: '/login',
            controller: 'LoginController'
        })

        .state('payment', {
            url: '/payment',
            controller: 'PaymentLoginController'
        })

        .state('logout', {
            url: '/logout',
            controller: 'LogoutController'
        })
        .state('account', {
          url: '/account',
          templateUrl: 'views/account.html',
          controller: 'AccountController'
        })
        .state('settings', {
          url: '/settings',
          templateUrl: 'views/settings.html',
          controller: 'SettingsController'
        })
        .state('help', {
          url: '/help',
          templateUrl: 'views/help.html',
          controller: 'HelpController'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'views/signup.html',
            controller: 'SignupController'
        })

        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })


        .state('exam-pdf', {
          url: '/exam-pdf/:email/:guid',
          templateUrl: 'views/examPdf.html',
          controller: 'ExamPdfController'
        })
        .state('exam', {
            url: '/exam',
            templateUrl: 'views/exam.html',
            controller: 'ExamController'
        })

        .state('item', {
            url: '/item',
            templateUrl: 'views/item.html',
            controller: 'ItemController'
        })
        .state('item-find', {
          url: '/item-find',
          templateUrl: 'views/itemFind.html',
          controller: 'ItemFindController'
        })
        .state('team', {
          url: '/team',
          templateUrl: 'views/team.html',
          controller: 'TeamController'
        })
        .state('matrix', {
          url: '/matrix',
          templateUrl: 'views/matrix.html',
          controller: 'MatrixController'
        })
        .state('student', {
          url: '/student',
          templateUrl: 'views/student.html',
          controller: 'StudentController'
        })
        .state('grade', {
          url: '/grade',
          templateUrl: 'views/grade.html',
          controller: 'GradeController'
        })
        .state('expense', {
            url: '/expense',
            templateUrl: 'views/expense/expense.html',
            controller: 'ExpenseController'
        });
})

    .run(["$rootScope", "$state","$location", "auth",function ($rootScope, $state,$location, auth) {

        auth.hookEvents();

        $rootScope.$on("$stateChangeStart", function() {
            if (!auth.isAuthenticated) {
                if ($state.current.url!="/login" && $state.current.url!="/payment"){
                    $location.path("/login");
                }
            }
        });



    }]);










