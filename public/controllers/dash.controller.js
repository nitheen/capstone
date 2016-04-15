angular.module('mehmetcankerApp').controller("dashboardController", ['$scope', '$timeout', 'HomeService', function ($scope, $timeout, HomeService) {

    $scope.dataID = {
        id: 'd1bfa5a9-5421-4a3f-9404-4287482e8351'
    };


    //Method to call the dashboard route to get the data from the DB

    $scope.init = function () {
        HomeService.eventsDashboard($scope.dataID)
            .then(function (response) {
                //alert("Received Response :::: " + response);
                //alert(JSON.stringify(response.data.errors));
                $scope.scenes = response.data.scene_count;
                $scope.errors = response.data.errors;

                /* Data Manipulation for populating Line Chart*/

                var line_label = [];
                var line_value = [];

                for(var i=0; i < response.data.scene_count.length; i++){
                    line_label.push(response.data.scene_count[i].project_number);
                    line_value.push(response.data.scene_count[i].project_length);
                }

                var data_line = {
                    labels: line_label,
                    datasets: [
                        {
                            label: "Project lengths for all sessions",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: line_value
                        }
                    ]
                };

                var bar_browser = [], bar_count = [], prev;
                var arr = response.data.errors;
                arr.sort();
                for ( var i = 0; i < arr.length; i++ ) {
                    if ( arr[i].browser !== prev ) {
                        bar_browser.push(arr[i].browser);
                        bar_count.push(1);
                    } else {
                        bar_count[bar_count.length-1]++;
                    }
                    prev = arr[i].browser;
                }

                var data_bar = {
                    labels: bar_browser,
                    datasets: [
                        {
                            label: "My First dataset",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: bar_count
                        }
                    ]
                };

                var ctx_bar = document.getElementById("barChart").getContext("2d");
                window.myBar = new Chart(ctx_bar).Bar(data_bar, {
                    responsive : true
                });

                var ctx_line = document.getElementById("lineChart").getContext("2d");
                window.myLine = new Chart(ctx_line).Line(data_line, {
                    responsive : true
                });
            });
    }
}]);