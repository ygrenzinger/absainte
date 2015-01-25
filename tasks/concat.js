'use strict';


module.exports = function concat(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Options
	return {
        options: {
            separator: ';'
        },
        build: {
            src: ['.build/js/front.js'],
            dest: '.build/js/prod.js'
        }
	};
};
