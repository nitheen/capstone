angular.module('mehmetcankerApp').controller("HomeController",['$scope','$timeout', 'HomeService', function($scope, $timeout, HomeService) {
    $scope.data = {
        id: 'aa5188a2-0c28-424b-913c-b27f5a67d6ce',
        counter: 0
    };
    var stopped;
    $scope.countdown = function() {
        stopped = $timeout(function() {
            console.log($scope.data.counter);
            $scope.data.counter++;
            $scope.countdown();
        }, 1);
    };

    $scope.stop = function() {
        $timeout.cancel(stopped);
    }
    $scope.update = function () {
        HomeService.update($scope.data)
        .then(function (response) {
            console.log(response);
        })
        $scope.data.counter = 0;
    }
}]);