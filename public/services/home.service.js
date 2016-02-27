angular.module('mehmetcankerApp').factory("HomeService",
    function($http) {
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
            }
        }
    }
);