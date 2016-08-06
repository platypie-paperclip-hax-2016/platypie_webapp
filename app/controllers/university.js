(function() {
    angular.module('MyApp')
        .controller('UniversityCtrl', UniversityCtrl);

    function UniversityCtrl($routeParams, University) {
        var ctrl = this;
        
        University.getInfo($routeParams.id).then(function(data) {
            ctrl = Object.assign(ctrl, data)
        })
    }
})();
