'use strict';


module.exports = function concat_css(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-concat-css');

	// Options
	return {
        build: {
            options: {},
            files: {
                '.build/css/prod.css': ['.build/css/ionicons.css', '.build/css/front.css']
            }
        }
	};
};
