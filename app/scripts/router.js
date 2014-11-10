"use strict";
BeetApp.factory('errorInterceptor', ['$q', '$rootScope', '$location',
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
BeetApp.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    $httpProvider.defaults.withCredentials = true;
    //$locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('errorInterceptor');

    $urlRouterProvider.otherwise('/login');

    $stateProvider

        .state('login', {
            url: '/login',
            controller: 'LoginController'
        })

        .state('logout', {
            url: '/logout',
            controller: 'LogoutController'
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

        .state('menu', {
            url: '/menu',
            templateUrl: 'views/menu/menu.html',
            controller: 'MenuController'
        })

        .state('person/create', {
            url: '/person/create',
            templateUrl: 'views/person/person.html',
            controller: 'PersonController'
        })

        .state('person/edit', {
            url: '/person/edit/:_id',
            templateUrl: 'views/person/person.html',
            controller: 'PersonController'
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
        .state('company/create', {
            url: '/company/create',
            templateUrl: 'views/company/company.html',
            controller: 'CompanyController'
        })

        .state('company/edit', {
            url: '/company/edit/:_id',
            templateUrl: 'views/company/company.html',
            controller: 'CompanyController'
        })

        .state('company/list', {
            url: '/company/list',
            templateUrl: 'views/company/list.html',
            controller: 'CompanyController'
        })

        .state('user/edit', {
            url: '/user/edit/:_id',
            templateUrl: 'views/user/user.html',
            controller: 'UserController'
        })

        .state('expense', {
            url: '/expense',
            templateUrl: 'views/expense/expense.html',
            controller: 'ExpenseController'
        });


});










