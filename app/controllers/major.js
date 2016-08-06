(function() {
    angular.module('MyApp')
        .controller('MajorCtrl', MajorCtrl);

    function MajorCtrl($routeParams, Major) {
        var ctrl = this;

        Major.getInfo($routeParams.id).then(function(data) {
            ctrl = Object.assign(ctrl, data)
        })
    }
})();
