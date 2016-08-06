(function() {
    angular.module('MyApp')
        .factory('Major', Major);
    University.$inject = ['$http'];

    function Major($http) {
        return {
            getInfo: function(id) {
                return $http.get("/major", {
                    params: {
                        _id: id
                    }
                })
            }
        }
    }

})();
