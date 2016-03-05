angular.module('mehmetcankerApp').controller("HomeController",['$scope','$timeout', 'HomeService', function($scope, $timeout, HomeService) {
    $scope.data = {
        id: '9ce29050-6a63-4d1b-92d2-492eabe055a0',
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