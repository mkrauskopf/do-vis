'use strict';

describe('Controller: KnapsackCtrl', function () {

  // load the controller's module
  beforeEach(module('doVisApp'));

  var KnapsackCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KnapsackCtrl = $controller('KnapsackCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
