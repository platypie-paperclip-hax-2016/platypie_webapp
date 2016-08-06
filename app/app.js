(function() {
angular.module('MyApp', ['ngRoute', 'satellizer'])
  .config(function($routeProvider, $locationProvider, $authProvider, CONSTANTS) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html'
      })
      .when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'main',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
          controllerAs: "main",
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/account', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/forgot', {
        templateUrl: 'partials/forgot.html',
        controller: 'ForgotCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/reset/:token', {
        templateUrl: 'partials/reset.html',
        controller: 'ResetCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
        .when("/university/:id", {
            templateUrl: 'partials/university.html',
            controller: 'UniversityCtrl',
            controllerAs: 'main',
            resolve: {loginRequired: loginRequired}
        })
        .when("/main", {
            templateUrl: 'partials/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main',
            resolve: {loginRequired: loginRequired}
        })
      .otherwise({
        templateUrl: 'partials/404.html'
      });

    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.facebook({
      url: CONSTANTS.BASE_URL+'/auth/facebook',
      clientId: CONSTANTS.FB_CLIENT_ID,
      redirectUri: CONSTANTS.BASE_URL+'/auth/facebook/callback',
        authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
        scope: ['email', 'public_profile', 'user_location', 'user_education_history'],
        scopeDelimiter: ',',
        display: 'popup',
        oauthType: '2.0',
        popupOptions: { width: 580, height: 400 }

    });

    function skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/main');
      }
    }

    function loginRequired($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  })
  .run(function($rootScope, $window) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  });
})();
