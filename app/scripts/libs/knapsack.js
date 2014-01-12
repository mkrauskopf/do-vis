'use strict';

var _items = [];

function doSolve(solution, value, remainingCap, maxEstimate, taken, level, callback) {

  function updateSolution(solution, value, taken) {
    if (solution.value < value) {
      // console.log("Having new solution. Value: " + value + ", taken: " + taken);
      solution.value = value;
      solution.taken = taken.slice();
    }
  }
  
  function reportNode(taken, value, cap, estimate) {
    var id = taken.join('');
    var node = {id: id, value: value, room: cap, estimate: estimate}
    callback(node);
  }

  /*
  console.log("Trying: " + JSON.stringify({
    "value": value,
    "remainingCap": remainingCap,
    "maxEstimate": maxEstimate,
    "taken": taken,
    "level": level,
    "solution": solution
  }));
  */
  if (taken.length > 0) {
    var id = taken.join('');
    reportNode(taken, value, remainingCap, maxEstimate);
  }
  if (maxEstimate < solution.value) {
    // console.log("skipping due to insuffient solution.value")
    return;
  }
  if (level >= _items.length) {
    updateSolution(solution, value, taken);
    return;
  }
  var item = _items[level];
  var nextRemainingCap = remainingCap - item.weight;
  if (nextRemainingCap < 0) { // capacity exceeded. Prune whole subtree under current node.
    if (taken.length > 0) {
      taken[level] = 1;
      reportNode(taken, '---', nextRemainingCap, '---');
      taken.pop();
    }

    taken[level] = 0;
    updateSolution(solution, value, taken);
    doSolve(solution, value, remainingCap, maxEstimate - item.value, taken, level + 1, callback);
  } else {
    // use it
    taken[level] = 1;
    doSolve(solution, value + item.value, nextRemainingCap, maxEstimate, taken, level + 1, callback);
    // do not use it
    taken[level] = 0;
    doSolve(solution, value, remainingCap, maxEstimate - item.value, taken, level + 1, callback);
  }
  taken.pop();
}

function solveBaB(capacity, items, callback) {
  var maxEstimate = 0;
  _items = items;
  $.each(items, function () {
    maxEstimate += this.value;
  });

  var solution = {
    value: 0,
    taken: [],
  };

  doSolve(solution, 0, capacity, maxEstimate, [], 0, callback);
  return solution;
}

