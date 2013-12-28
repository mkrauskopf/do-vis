'use strict';

var _items = [];

function doSolve(solution, value, remainingCap, maxEstimate, taken, level) {
  if (maxEstimate < solution.value) {
    return;
  }
  if (level >= _items.length) {
    updateSolution(solution, value, taken);
    return;
  }
  var item = _items[level];
  var exceedCap = remainingCap - item.weight < 0;
  if (exceedCap) { // capacity exceeded. Prune whole subtree under current node.
    taken[level] = 0;
    updateSolution(solution, value, taken);
    doSolve(solution, value, remainingCap, maxEstimate - item.value, taken, level + 1);
  } else {
    // use it
    taken[level] = 1;
    doSolve(solution, value + item.value, remainingCap - item.weight, maxEstimate, taken, level + 1);
    // do not use it
    taken[level] = 0;
    doSolve(solution, value, remainingCap, maxEstimate - item.value, taken, level + 1);
  }

  function updateSolution(solution, value, taken) {
    if (solution.value < value) {
      solution.value = value;
      solution.taken = taken.slice();
    }
  }
}

function solveBaB(capacity, items) {
  var maxEstimate = 0;
  _items = items;
  $.each(items, function () {
    maxEstimate += this.value;
  });

  var solution = {
    value: 0,
    taken: [],
  };

  doSolve(solution, 0, capacity, maxEstimate, [], 0);
  return solution;
}

