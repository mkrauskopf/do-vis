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
      angular.forEach($scope.ksItems, function(value) {
        value.selected = false;
      });
    };

    /** Solves knapsack using current items. */
    $scope.solveBaB = function() {
      $scope.reset();
      var babCallback = visualize();
      $scope.solution = solveBaB($scope.ksCapacity, $scope.ksItems, babCallback);
      angular.forEach($scope.solution.taken, function(value, key) {
        $scope.gridOptions.selectRow(key, value);
        $scope.ksItems[key].selected = value;
      });
    };

    var visualize = function() {

      var w = 960,
          h = 500,
          root = { id: '' },
          data = [root],
          tree = d3.layout.tree().size([w - 20, h - 20]),
          diagonal = d3.svg.diagonal(),
          duration = 400;

      var vis = d3.select('#babViz').append('svg:svg')
          .attr('width', w)
          .attr('height', h)
        .append('svg:g')
          .attr('transform', 'translate(10, 10)');

      vis.selectAll('circle.node')
          .data(tree(root))
        .enter().append('svg:circle')
          .attr('class', 'node')
          .attr('r', 3.5)
          .attr('cx', x)
          .attr('cy', y);

      vis.selectAll('text.node')
          .data(tree(root))
        .enter().append('svg:text')
          .attr('class', 'node')
          .text(function(d) { return ''; })
          .attr('x', x)
          .attr('y', y)
          .attr('dx', 4)
          .attr('dy', 4); //padding-left and padding-top

      var update = function(nodeName) {
        // Add a new datum to a random parent.
        //var n = ~~(Math.random() * data.length);
        //var d = {id: data.length}, parent = data[n];
        var parentId = nodeName.slice(0, -1);
        var parent;
        for (var i in data) {
          if (data[i].id === parentId) {
            parent = data[i];
            break;
          }
        }
        var currentNode = {id: nodeName};
        if (parent.children) {
          parent.children.push(currentNode);
        } else {
          parent.children = [currentNode];
        }
        data.push(currentNode);

        // Compute the new tree layout. We'll stash the old layout in the data.
        var nodes = tree(root);

        // Update the nodes…
        var cnode = vis.selectAll('circle.node')
              .data(nodes, nodeId);

        cnode.enter().append('svg:circle')
              .attr('class', 'node')
              .attr('r', 3.5)
              .attr('cx', function(d) { return d.parent.data.x0; })
              .attr('cy', function(d) { return d.parent.data.y0; })
            .transition()
              .duration(duration)
              .attr('cx', x)
              .attr('cy', y);

        var tnode = vis.selectAll('text.node')
              .data(nodes, nodeId);

        tnode.enter().append('svg:text')
              .attr('class', 'node')
              .text(function(d) { return nodeName; })
              .attr('x', function(d) { return d.parent.data.x0; })
              .attr('y', function(d) { return d.parent.data.y0; })
            .transition()
              .duration(duration)
              .attr('x', x)
              .attr('y', y);

        // Transition nodes to their new position.
        cnode.transition()
            .duration(duration)
            .attr('cx', x)
            .attr('cy', y);

        tnode.transition()
            .duration(duration)
            .attr('x', x)
            .attr('y', y)
            .attr('dx', 4)
            .attr('dy', 4); //padding-left and padding-top

        // Update the links…
        var link = vis.selectAll('path.link')
            .data(tree.links(nodes), linkId);

        // Enter any new links at the parent's previous position.
        link.enter().insert('svg:path', 'g.node')
            .attr('class', 'link')
            .attr('d', function(d) {
              var o = {x: d.source.data.x0, y: d.source.data.y0};
              return diagonal({source: o, target: o});
            })
          .transition()
            .duration(duration)
            .attr('d', diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr('d', diagonal);
      };

      function linkId(d) {
        return d.source.data.id + '-' + d.target.data.id;
      }

      function nodeId(d) {
        return d.data.id;
      }

      function x(d) {
        return d.data.x0 = d.x;
      }

      function y(d) {
        return d.data.y0 = d.y;
      }

      return update;
    };
  }
);

