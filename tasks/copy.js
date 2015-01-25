'use strict';


module.exports = function copy(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-copy');
    var version = 'v' + grunt.file.readJSON('package.json').version;

	// Options
	return {
	    build: {
            files: [{
                src: '.build/js/prod.min.js',
                dest: '.build/js/prod.min.'+version+'.js'
            },{
                src: '.build/css/prod.css',
                dest: '.build/css/prod.'+version+'.css'
            }]
	    }
	};
};
