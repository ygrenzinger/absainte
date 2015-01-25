'use strict';

module.exports = function stringreplace(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-string-replace');
    var version = 'v' + grunt.file.readJSON('package.json').version;

	// Options
	return {
        build: {
            files: [{
                expand: true,
                cwd: '.build/',
                src: 'templates/**/layouts/master_front.js',
                dest: '.build/'
            }],
            options: {
                replacements: [{
                    pattern: /\/prod\.js/g,
                    replacement: '/prod.min.'+version+'.js'
                },{
                    pattern: /\/prod\.css/g,
                    replacement: '/prod.'+version+'.css'
                }]
            }
        }
	};
};
