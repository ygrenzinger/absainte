'use strict';

module.exports = function uglify(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-uglify');

	// Options
	return {
        build: {
            options: {
                mangle: false
            },
                files: {
                    '.build/js/prod.min.js': ['.build/js/prod.js']
                }
        }
	};
};
