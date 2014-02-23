module.exports = function(config){
    config.set({
    basePath : '../',

    //files to load in the browser
    files : [
    'test/unit/test-main.js',
    {pattern: 'app/lib/angular/angular.js',included: false},
    {pattern: 'app/lib/angular/angular-*.js',included: false},
    {pattern: 'test/lib/angular/angular-mocks.js',included: false},
    {pattern: 'app/js/**/*.js',included: false},
    {pattern: 'node_modules/sinon/pkg/*.js',included: false},
    {pattern: 'test/unit/**/*.js',included: false},
    ],

    exclude : [
      'app/lib/angular/angular-loader.js',
      'app/lib/angular/*.min.js',
      'app/lib/angular/angular-scenario.js',
      'app/js/main.js'
    ],

    autoWatch : true,

    logLevel : config.LOG_DEBUG,

    frameworks: ['jasmine','requirejs'],

    /*angular 1.2.10 fixes error related to using PhantomJS */
    //https://github.com/angular/angular.js/commit/7e916455b36dc9ca4d4afc1e44cade90006d00e30
    //browsers : ['PhantomJS'],
    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-requirejs',
            'karma-phantomjs-launcher',
            'karma-html-reporter'
            ],
    /*reporters : ['progress','junit'],
    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }*/
    
    reporters : ['progress','html'],
    htmlReporter : {
	outputDir : 'test_out',
	templatePath : __dirname + '/../node_modules/karma-html-reporter/jasmine_template.html'
    }

  });
};
