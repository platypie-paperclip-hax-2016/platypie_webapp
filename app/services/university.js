(function() {
    angular.module('MyApp')
        .factory('University', University);
    University.$inject = ['$http'];
    
    function University($http) {
        return {
            getInfo: function(id) {
                return $http.get("/university/", {
                    params: {
                        _id: id
                    }
                })
            }
        }
    }
    Account.$inject = ['$http'];

    function Account($http) {
        return {
            updateProfile: function(data) {
                return $http.put('/account', data);
            },
            changePassword: function(data) {
                return $http.put('/account', data);
            },
            deleteAccount: function() {
                return $http.delete('/account');
            },
            forgotPassword: function(data) {
                return $http.post('/forgot', data);
            },
            resetPassword: function(data) {
                return $http.post('/reset', data);
            }
        };
    }
})();
