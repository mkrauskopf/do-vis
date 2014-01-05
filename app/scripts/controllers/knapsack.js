'use strict';

angular.module('doVisApp')
  .controller('KnapsackCtrl', function ($scope, $window) {

    /** Initial items so user has something to start with. */
    var demoItems = [{item: '1', weight: 5, value: 45, selected: false},
                     {item: '2', weight: 8, value: 48, selected: false},
                     {item: '3', weight: 3, value: 35, selected: false},
                    ];
    $scope.ksItems = demoItems; // list of available items
    $scope.ksCapacity = 9; // demo capacity


    /** Called back by ng-grid when `remove' button in nb-grid is clicked. */
    $scope.removeRow = function() {
      var index = this.row.rowIndex;
      $scope.gridOptions.selectItem(index, false);
      $scope.ksItems.splice(index, 1);
    };

    /** Template used as ng-grid cell template for removing items. */
    var removeRowTemplate = '<input type="button" value="remove" ng-click="removeRow()" />';

    /** ng-grid configuration */
    $scope.gridOptions = {
      data: 'ksItems',
	    enableRowSelection: false,
      columnDefs: [
        { field: 'item', displayName: 'Item #'},
        { field: 'weight', displayName: 'Weight'},
        { field: 'value', displayName: 'Value'},
        { field: 'remove', displayName:'', cellTemplate: removeRowTemplate }
      ],
      /** Template highlighting rows in solution set. */
      rowTemplate: '<div style="height: 100%" ng-class="{green: row.entity.selected}">' +
                     '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
                     '<div ng-cell></div>' +
                     '</div>' +
                   '</div>'
    };

    /** Adds new item and resets the solution. */
    $scope.addItem = function() {
      $scope.reset();
      if (angular.isDefined($scope.newItem) &&
          angular.isDefined($scope.newItem.value) &&
          angular.isDefined($scope.newItem.weight)) {
        $scope.ksItems.push({item: $scope.ksItems.length + 1, weight: $scope.newItem.weight, value: $scope.newItem.value, selected: false});
      } else {
        // TODO: conditionally enable UI instead
        console.log('item not fully defined');
      }
    };

    /** Removes all items and resets the solution. */
    $scope.removeAll = function() {
      $scope.reset();
      $scope.ksItems = [];
    };

    /** Resets the solution. */
    $scope.reset = function() {
      delete $scope.solution;
      angular.forEach($scope.ksItems, function(value, key) {
        value.selected = false;
      });
    };

    /** Solves knapsack using current items. */
    $scope.solveBaB = function() {
      $scope.reset();
      $scope.solution = solveBaB($scope.ksCapacity, $scope.ksItems);
      angular.forEach($scope.solution.taken, function(value, key) {
        $scope.gridOptions.selectRow(key, value);
        $scope.ksItems[key].selected = value;
      });
    };
  }
);

