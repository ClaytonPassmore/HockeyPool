module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            js: {
                options: {
                    transform: ["babelify"]
                },
                files: {
                    "./Web/static/js/index.js": ["./Javascript/index.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-browserify");
    grunt.registerTask("default", ["browserify"]);
}
