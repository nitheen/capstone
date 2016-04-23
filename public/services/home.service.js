angular.module('mehmetcankerApp').factory("HomeService",
    function($http) {
        var property;
        return {
            update: function(data) {
                return $http({
                    url: '/update/' + data.id,
                    method: "POST",
                    data: JSON.stringify({
                      counter: data.counter
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(data, status, headers, config) {
                    console.log("Success!");
										return data;
                }).error(function(error, status, headers, config) {
                    console.log("Error.");
                    return error;
                });
            },
            throwError: function(data) {
                    return $http({
                    url: '/throwError/' + data.id,
                    method: "POST",
                    data: JSON.stringify({
                        browser: data.browser,
                        version: data.version,
                        os: data.os,
                        error: data.error
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(data, status, headers, config) {
                    console.log("Success!");
                    return data;
                }).error(function(error, status, headers, config) {
                    console.log("Error.");
                    return error;
                });
            },
            eventsDashboard: function(data) {
                return $http({
                    url: '/eventsDashboard/' + data.id,
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(data, status, headers, config) {
                    console.log("Success!");
                    return data;
                }).error(function(error, status, headers, config) {
                    console.log("Error.");
                    return error;
                });
            },getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        }
    }
);