module.exports = function(grunt) {
	
	var root = 'public/';
	var jsRoot = root+'js/'; 
	var jsFiles = [
		'Gruntfile.js',
		jsRoot+'*.js',
		jsRoot+'collections/**/*.js',
		jsRoot+'models/**/*.js',
		jsRoot+'views/**/*.js',
		jsRoot+'toolkit/**/*.js',
	];
	
	// Project configuration.
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		/*
		 requirejs: {
		 compile: {
		 options: {
		 baseUrl: "public/js/main.js",
		 mainConfigFile: "path/to/config.js",
		 name: "main",
		 out: "public/js/main.min.js"
		 }
		 }
		 },
		 */
		jshint : {
			files : jsFiles ,
			options : {
				globals : {
					jQuery : true,
					Backbone : true,
				}
			}
		},
		less : {
			development : {
				files : {
					"public/css/koolah.min.css" : "public/less/index.less"
				}
			}
		},
		watch : {
			//files: ['public/js/**/*.js', 'public/less/**/*.less'],
			//tasks: ['concat', 'uglify', 'jshint', 'less']
			files : ['public/less/**/*.less', jsFiles],
			tasks : ['jshint', 'less']
		}
	});

	/*
	 grunt.loadNpmTasks('grunt-contrib-concat');
	 grunt.loadNpmTasks('grunt-contrib-uglify');
	 */
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	//grunt.loadNpmTasks('grunt-contrib-requirejs');

	//grunt.registerTask('default', ['concat', 'uglify',  'less']);
	//grunt.registerTask('default', ['less', 'requirejs', 'watch']);
	grunt.registerTask('default', ['jshint', 'less', 'watch']);

}; 