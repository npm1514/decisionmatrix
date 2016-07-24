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
      $scope.values.push([selection.name]);
      $scope.calcvalues.push([selection.name]);
      $scope.allSelection.push([{name: selection.name, total: null}]);
      $scope.selection = {};
    }
  };

  $scope.addCriteria = function(criteria){
    if (criteria.name){
      var crit = {
        name: criteria.name,
        direction: "+",
        min: 1,
        max: 10,
        importance: 50
      };
      $scope.allCriteria.push(crit);
      for (var i = 0; i < $scope.values.length; i++) {
        $scope.values[i].push([undefined]);
        $scope.calcvalues[i].push([undefined]);
      }
      $scope.criteria = {};
    }
    console.log($scope.values);
  };



  $scope.runMatrix = function() {
    for (var i = 0; i < $scope.values.length; i++) {
      var total = 0;
      for (var j = 1; j < $scope.values[i].length; j++) {
        if($scope.allCriteria[j-1].direction === "+"){
          $scope.calcvalues[i][j] = (($scope.values[i][j]-$scope.allCriteria[j-1].min)/($scope.allCriteria[j-1].max-$scope.allCriteria[j-1].min))*($scope.allCriteria[j-1].importance/100);
        } else if ($scope.allCriteria[j-1].direction === "-"){
          $scope.calcvalues[i][j] = (($scope.allCriteria[j-1].max - $scope.values[i][j])/($scope.allCriteria[j-1].max-$scope.allCriteria[j-1].min))*($scope.allCriteria[j-1].importance/100);
        }
        total += $scope.calcvalues[i][j]
      }
      $scope.allSelection[i].total = total;
    }
    console.log($scope.calcvalues);
    $scope.makeGraph();
  }


  $scope.makeGraph = function(){

    d3.select('.barchart')
    .selectAll('.bars')
    .data($scope.calcvalues)
    .enter()
    .append('div')
    .attr('class', function(d, i){
      return 'bars' + i;
    })
    .style('width', function(d){
      var num = $scope.calcvalues.length;
      return (1/num*100)-2 + "%";
    })
    .style('height', function(d){
      return 400 + "px";
    })
    .style("margin", "1%")
    .style("display", "inline-block");


    for (var i = 0; i < $scope.calcvalues.length; i++){

      var offset = 400 * (1 - $scope.allSelection[i].total) ;
      console.log(offset, "offset");
      d3.select('.bars' + i)
      .selectAll('.bar' + i)
      .data($scope.calcvalues[i])
      .enter()
      .append('div')
      .attr('class', 'bar' + i)
      .style('width', function(d){
        return 100 + "%";
      })
      .style('background-color', function(d,i){
        return d3.hsl(i/$scope.calcvalues.length*360,0.5,0.5);
      })
      .style('height', function(d){
        console.log(d);
        return 0 + "px";
      })
      .style('position',"relative")
      .style("top",function(d,j){
        return (offset) + "px";
      });

      d3.select('.bars' + i)
      .selectAll('.bar' + i)
      .data($scope.calcvalues[i])
      .transition()
      .duration('500')
      .style("height", function(d){
        console.log(d);
          return d * 400 + "px";
      });
    }



  };




});
