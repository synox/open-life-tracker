module.exports = function (config) {
	'use strict';

	config.set({
		basePath: '../../',
		frameworks: ['jasmine'],
		files: [
			'app/assets/dependencies.js',
			'app/assets/app.js',
			'app/assets/**/*.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'test/unit/**/*.js'
		],
		autoWatch: true,
		singleRun: false,
		browsers: ['Firefox'] // , 'Chrome'
	});
};
