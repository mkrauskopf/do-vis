'use strict';

angular.module('doVizApp')
  .controller('KnapsackCtrl', function ($scope, $window) {

    var demoItems = [{item: '1', weight: 5, value: 45, selected: false},
                     {item: '2', weight: 8, value: 48, selected: false},
                     {item: '3', weight: 3, value: 35, selected: false},
                    ];
    $scope.ksItems = demoItems;
    
    $scope.gridOptions = {
      data: 'ksItems',
	    enableRowSelection: false,
      columnDefs: [
        { field: 'item', displayName: 'Item #'},
        { field: 'weight', displayName: 'Weight'},
        { field: 'value', displayName: 'Value'}
      ],
      rowTemplate: '<div style="height: 100%" ng-class="{green: row.entity.selected}">' +
                          '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
                          '<div ng-cell></div>' +
                          '</div>' +
                      '</div>'
    };


    $scope.addItem = function() {
      if (angular.isDefined($scope.newItem) &&
          angular.isDefined($scope.newItem.value) &&
          angular.isDefined($scope.newItem.weight)) {
        $scope.ksItems.push({item: $scope.ksItems.length + 1, weight: $scope.newItem.weight, value: $scope.newItem.value, selected: false});
      } else {
        // TODO: conditionally enable UI instead
        console.log('item not fully defined');
      }
    };

    $scope.removeAll = function() {
      $scope.ksItems = [];
    };

    $scope.reset = function() {
      delete $scope.solution;
      angular.forEach($scope.ksItems, function(value, key) {
        value.selected = false;
      });
    };

    $scope.solveBaB = function() {
      $scope.solution = solveBaB(9, $scope.ksItems);
      angular.forEach($scope.solution.taken, function(value, key) {
        $scope.gridOptions.selectRow(key, value);
        $scope.ksItems[key].selected = value;
      });
    };
  });

