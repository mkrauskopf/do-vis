'use strict';

angular.module('doVizApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngGrid'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/knapsack', {
        templateUrl: 'views/knapsack.html',
        controller: 'KnapsackCtrl'
      })
      .when('/tsp', {
        templateUrl: 'views/tsp.html',
        controller: 'TSPCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
