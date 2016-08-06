(function() {
    angular.module('MyApp')
        .factory('University', University);
    University.$inject = ['$http'];
    
    function University($http) {
        return {
            getInfo: function(id) {
                return $http.get("/university", {
                    params: {
                        _id: id
                    }
                })
            }
        }
    }

})();
