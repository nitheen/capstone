angular.module('mehmetcankerApp').controller("HomeController",['$scope','$timeout', 'HomeService', function($scope, $timeout, HomeService) {
    $scope.data = {
        id: '9eb9123d-1d8a-493a-a92d-e0a32cca422f',
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
    }
}]);