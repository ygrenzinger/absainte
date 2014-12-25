'use strict';

var refills = require('node-refills');

module.exports = function sass(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-sass');
	var refillPaths = refills.includePaths;
    console.log("refillPaths: " +refillPaths);

	// Options
	return {
        build: {
            options: {
                style: 'compressed',
        				includePaths: refillPaths
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
