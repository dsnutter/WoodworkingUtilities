angular.module('navigation', ['ui.bootstrap'])

.controller('navigationController', function($scope) {
	$scope.isCollapsed = true;
	$scope.isDropdown1Collapse = true;
	$scope.isDropdown2Collapse = true;
});
