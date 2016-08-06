(function() {
    angular.module('MyApp')
        .controller('MainCtrl', MainCtrl);

   function MainCtrl($auth) {
       var ctrl = this;
       this.isAuthenticated = $auth.isAuthenticated()
       
       
   }
})();
