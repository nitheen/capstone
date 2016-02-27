angular.module('Routes', ['ngRoute']).config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController',
        css: 'css/home.css'
    })
    .otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
});
