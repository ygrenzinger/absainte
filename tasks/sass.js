'use strict';

var neat = require('node-neat');
var path = require('path');

module.exports = function sass(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-sass');
	var neatPaths = neat.includePaths;
	var bitterPaths = path.join(__dirname, '../public/components/bitters/app/assets/stylesheets');
	var refillsPaths = path.join(__dirname, '../public/components/refills/app/assets/stylesheets');

	// Options
	return {
        build: {
            options: {
                style: 'compressed',
        				includePaths: neatPaths.concat(bitterPaths).concat(refillsPaths)
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
