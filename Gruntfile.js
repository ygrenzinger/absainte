'use strict';

module.exports = function (grunt) {

    // measures the time each task takes
    require('time-grunt')(grunt);

    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });

    // Register group tasks
    grunt.registerTask('build', [ 'jshint', 'sass', 'browserify', 'i18n', 'copyto', 'concat', 'concat_css', 'uglify', 'copy', 'string-replace' ]);
    grunt.registerTask('test', [ 'jshint', 'mochacli' ]);

};
