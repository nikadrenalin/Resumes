'use strict';

var services = angular.module('resumeApp.services', []);

services.factory('RestService', ['$http',function($http) {
	return {
		get : function() {
			return $http.get('/api/resumes');
		},
		create : function(resumeoData) {
			return $http.post('/api/resumes', resumeoData);
		}
	};
}]);