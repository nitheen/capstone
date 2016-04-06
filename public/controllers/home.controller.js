angular.module('mehmetcankerApp').controller("HomeController", ['$scope', '$timeout', 'HomeService', function ($scope, $timeout, HomeService) {

    //ID of the database attribute and inital counter value
    $scope.data = {
        id: 'a943575b-5c53-4fb6-9f2e-d5ed93a99412',
        counter: 0,
        browser: null,
        version: null,
        os: null,
        error: null
    };
    var stopped;

    //Method for timer to run
    $scope.countdown = function () {
        stopped = $timeout(function () {
            console.log($scope.data.counter);
            $scope.data.counter++;
            $scope.countdown();
        }, 1);
    };

    //Method to stop timer
    $scope.stop = function () {
        $timeout.cancel(stopped);
    }

    //Method to call the Update route to input the timer value in DB
    $scope.update = function () {
        HomeService.update($scope.data)
            .then(function (response) {
                console.log(response);
            })
        $scope.data.counter = 0;
    }

    //Method to throw error and record browser and OS details
    $scope.throwError = function () {
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var fullVersion = '' + parseFloat(navigator.appVersion);
        var nameOffset, verOffset, ix;

        try {

            // In Chrome, the true version is after "Chrome"
            if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
                browserName = "Chrome";
                fullVersion = nAgt.substring(verOffset + 7);
            }

            // In Firefox, the true version is after "Firefox"
            else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
                browserName = "Firefox";
                fullVersion = nAgt.substring(verOffset + 8);
            }

            // In most other browsers, "name/version" is at the end of userAgent
            else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
                (verOffset = nAgt.lastIndexOf('/'))) {
                browserName = nAgt.substring(nameOffset, verOffset);
                fullVersion = nAgt.substring(verOffset + 1);
                if (browserName.toLowerCase() == browserName.toUpperCase()) {
                    browserName = navigator.appName;
                }
            }

            // trim the fullVersion string at semicolon/space if present
            if ((ix = fullVersion.indexOf(";")) != -1)
                fullVersion = fullVersion.substring(0, ix);
            if ((ix = fullVersion.indexOf(" ")) != -1)
                fullVersion = fullVersion.substring(0, ix);

            throw "Capturing a sample error";


        }
        catch (e) {

            $scope.data.browser = browserName;
            $scope.data.version = fullVersion;
            $scope.data.os = navigator.platform;
            $scope.data.error = e;
            HomeService.throwError($scope.data)
                .then(function (response) {
                    console.log(response);
                })
        }
    }
}]);