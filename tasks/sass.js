'use strict';

var refills = require('node-refills');

module.exports = function sass(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-sass');
	var refillPaths = refills.includePaths;

	// Options
	return {
        build: {
            options: {
                includePaths: refillPaths,
                outputStyle: 'compressed'
            },
            files: [{
                expand: true,
                cwd: 'public/css',
                src: ['**/*.scss'],
                dest: '.build/css/',
                ext: '.css'
            }]
        }
	};
};
