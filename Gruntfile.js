module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            js: {
                options: {
                    transform: ["babelify"]
                },
                files: {
                    "./Web/static/js/draft.js": ["./Javascript/draft.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-browserify");
    grunt.registerTask("default", ["browserify"]);
}
