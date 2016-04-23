angular.module('mehmetcankerApp').controller("PaginationDemoCtrl", ['$scope', '$timeout', 'HomeService', function ($scope, $timeout, HomeService) {

    $scope.init = function () {
        var temp = HomeService.getProperty();
        $scope.data = temp;
        $scope.errors = HomeService.getProperty();
        $scope.viewby = 10;
        $scope.totalItems = temp.length;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 5; //Number of pager buttons to show

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function () {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.setItemsPerPage = function (num) {
            $scope.itemsPerPage = num;
            $scope.currentPage = 1; //reset to first paghe
        }
    }
}]);

                