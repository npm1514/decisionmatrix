angular.module("decisions")
.controller("mainCtrl", function($scope, mainServ) {
  $scope.titleshow=true;
  $scope.allCriteria = [];
  $scope.allSelection = [];
  $scope.values = [];
  $scope.calcvalues = [];

  $scope.testvalues = [[.25, .125, .3], [.122, .5, .25], [.32, .125, .25]];

  $scope.addSelection = function(selection){
    if (selection.name){
      $scope.allSelection.push({name: selection.name, total: 0});
      $scope.values.push([]);
      $scope.calcvalues.push([]);
      $scope.selection = {};
    }
  };

  $scope.addCriteria = function(criteria){
    if (criteria.name){
      var crit = {
        name: criteria.name,
        direction: "+",
        min: 0,
        max: 10,
        importance: 50
      };
      $scope.allCriteria.push(crit);
      for (var i = 0; i < $scope.values.length; i++) {
        $scope.values[i].push([null]);
        $scope.calcvalues[i].push([null]);
      }
      $scope.criteria = {};
    }
    console.log($scope.values);
  };



  $scope.runMatrix = function() {
    for (var i = 0; i < $scope.values.length; i++) {
      var total = 0;
      for (var j = 0; j < $scope.values[i].length; j++) {
        if($scope.allCriteria[j].direction === "+"){
          $scope.calcvalues[i][j] = (($scope.values[i][j]-$scope.allCriteria[j].min)/($scope.allCriteria[j].max-$scope.allCriteria[j].min))*($scope.allCriteria[j].importance/100);
        } else if ($scope.allCriteria[j].direction === "-"){
          $scope.calcvalues[i][j] = (($scope.allCriteria[j].max - $scope.values[i][j])/($scope.allCriteria[j].max-$scope.allCriteria[j].min))*($scope.allCriteria[j].importance/100);
        }
        total += $scope.calcvalues[i][j]
      }
      $scope.allSelection[i].total = total;
    }
    console.log($scope.calcvalues);
    $scope.makeGraph();
  }


  $scope.makeGraph = function(){
    var margin = {top: 30, right:20, bottom:30, left:50};
    var height = 400 - margin.top - margin.bottom;
    var width = 900 - margin.right - margin.left;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .domain([0,1])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5, "%");

    var svg = d3.select(".barchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain($scope.allSelection.map(function(d) { return d.name; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".5em")
        .style("text-anchor", "end")
        .text("Score");




    for (var i = 0; i < $scope.allSelection.length; i++){
      svg.selectAll('svg')
        .data($scope.calcvalues[i])
        .enter()
        .append('rect')
        .attr('class', function(d, i){
          return 'bars' + i;
        })
        .attr('width', function(d){
          return (1/$scope.allSelection.length*width) - 40;
        })
        .attr("height", function(d,i){
          return d*height;
        })
        .attr("fill", function(d,i){
          return d3.hsl(i/$scope.allSelection.length*360, 0.5, 0.5);
        })
        .attr("x", function(d,j){
          return (i/$scope.allSelection.length*width) + 20;
        })
        .attr("y", function(d,j){
          // var total = 0;
          // for (var k = 0; k <= i; k++){
          //   total += $scope.calcvalues[i][k];
          // }
          return height - d*height;
        });

      // d3.select('.bars' + i)
      // .selectAll('.bar' + i)
      // .data($scope.calcvalues[i])
      // .transition()
      // .duration('500')
      // .attr("height", function(d){
      //     return d + "px";
      // });
    }



  };




});
