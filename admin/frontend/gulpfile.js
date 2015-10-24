/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    noop = g.util.noop,
    distEnv = process.env.NODE_ENV,
    es = require('event-stream'),
    bowerFiles = require('main-bower-files'),
    rimraf = require('rimraf'),
    queue = require('streamqueue'),
    lazypipe = require('lazypipe'),
    stylish = require('jshint-stylish'),
    replace = require('gulp-replace'),
    bower = require('./bower'),
    isWatching = false,
    historyApiFallback = require('connect-history-api-fallback'),
    jade = require('gulp-jade');

var htmlminOpts = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: false,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true
};

var config = require('./env/development/');
var apiUrl = config.backendUrl;

/**
 * JS Hint
 */
gulp.task('jshint', function () {
  return gulp.src([
    './gulpfile.js',
    './src/app/**/*.js'
  ])
    .pipe(g.cached('jshint'))
    .pipe(jshint('./.jshintrc'))
    .pipe(livereload());
});

/**
 * CSS
 */
gulp.task('clean-css', function (done) {
  rimraf('./.tmp/css', function() {
    rimraf('./static/output/css', done);
  });
});

function replaceUrl() {
  console.log(apiUrl);
  console.log('api url');
  return apiUrl ? replace(/http:\/\/localhost:1339/g, apiUrl) : noop();
}

gulp.task('styles', ['clean-css'], function () {
  return gulp.src([
    './src/app/styles/*.less',
    '!./src/app/**/_*.less'
  ])
    .pipe(g.less())
    .pipe(gulp.dest('./.tmp/css/'))
    .pipe(g.cached('built-css'))
    .pipe(livereload());
});

gulp.task('styles-dist', ['styles'], function () {
  return cssFiles().pipe(dist('css', bower.name));
});

gulp.task('csslint', ['styles'], function () {
  return cssFiles()
    .pipe(g.cached('csslint'))
    .pipe(g.csslint('./.csslintrc'))
    .pipe(g.csslint.reporter());
});

/**
 * Scripts
 */
gulp.task('scripts-dist', ['templates-dist'], function () {
  return appFiles().pipe(dist('js', bower.name, {ngAnnotate: true}));
});

/**
 * Templates
 */
gulp.task('templates', function () {
  return templateFiles().pipe(buildTemplates());
});

gulp.task('templates-dist', function () {
  return templateFiles({min: true}).pipe(buildTemplates());
});

/**
 * Vendors
 */
gulp.task('vendors', function () {
  var files = bowerFiles();
  var vendorJs = fileTypeFilter(files, 'js');
  var vendorCss = fileTypeFilter(files, 'css');
  var q = new queue({objectMode: true});
  if (vendorJs.length) {
    q.queue(gulp.src(vendorJs).pipe(dist('js', 'vendors')));
  }
  if (vendorCss.length) {
    q.queue(gulp.src(vendorCss).pipe(dist('css', 'vendors')));
  }
  return q.done();
});

/**
 * Index
 */
gulp.task('index', index);
gulp.task('build-all', ['styles', 'templates'], index);

function index () {
  var opt = {read: false};
  return gulp.src('./src/app/index.html')
    .pipe(g.inject(gulp.src(bowerFiles(), opt), {ignorePath: 'bower_components', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(g.inject(es.merge(appFiles(), cssFiles(opt)), {ignorePath: ['.tmp', 'src/app']}))
    .pipe(gulp.dest('./src/app/'))
    .pipe(g.embedlr())
    .pipe(gulp.dest('./.tmp/app/'))
    .pipe(livereload());
}


/**
 * Assets
 */
gulp.task('assets', function () {
  return gulp.src('./src/app/assets/**')
    .pipe(gulp.dest('./dist/assets'));
});

/**
 * Dist
 */
gulp.task('dist', ['vendors', 'assets', 'styles-dist', 'scripts-dist'], function () {
  return gulp.src('./src/app/index.html')
    .pipe(g.inject(gulp.src('./dist/vendors.min.{js,css}'), {ignorePath: 'dist', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(g.inject(gulp.src('./dist/' + bower.name + '.min.{js,css}'), {ignorePath: 'dist'}))
    .pipe(g.htmlmin(htmlminOpts))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Static file server
 */
gulp.task('statics', g.serve({
  port: 3011,
  root: ['./.tmp', './.tmp/app', './.tmp/src/app', './src/app', './bower_components'],
  middleware: function(req, res, next) {
    return historyApiFallback(req, res, next);
  }
}));

/**
 * Watch
 */
gulp.task('serve', ['watch']);


gulp.task('watch', ['statics', 'default'], function () {
  isWatching = true;
  // Initiate livereload server:
  g.livereload.listen();
  gulp.watch('./src/app/**/*.js', ['jshint']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    } else {
      g.livereload.changed(evt);
    }
  });
  gulp.watch('./src/app/index.html', ['index']);
  gulp.watch(['./src/app/**/*.html', '!./src/app/index.html'], ['templates']);
  gulp.watch(['./src/app/styles/*.less'], ['csslint']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    } else {
      g.livereload.changed(evt);
    }
  });
});

/**
 * Default task
 */
gulp.task('default', ['lint', 'build-all']);

/**
 * Lint everything
 */
gulp.task('lint', ['jshint', 'csslint']);


/**
 * All CSS files as a stream
 */
function cssFiles (opt) {
  return gulp.src('./.tmp/css/**/*.css', opt);
}

/**
 * All AngularJS application files as a stream
 */
function appFiles () {
  var files = [
    './.tmp/app/' + bower.name + '-templates.js',
    './.tmp/app/**/*.js',
    '!./.tmp/src/app/**/*_test.js',
    './src/app/**/*.js',
    '!./src/app/**/*_test.js'
  ];
  return gulp.src(files)
    .pipe(g.angularFilesort());
}

/**
 * All AngularJS templates/partials as a stream
 */
function templateFiles (opt) {
  return gulp.src(['./src/app/**/*.html', '!./src/app/index.html'], opt)
    .pipe(opt && opt.min ? g.htmlmin(htmlminOpts) : noop());
}

/**
 * Build AngularJS templates/partials
 */
function buildTemplates () {
  return lazypipe()
    .pipe(g.ngHtml2js, {
      moduleName: bower.name,
      prefix: '/' + bower.name + '/',
      stripPrefix: '/src/app'
    })
    .pipe(g.concat, bower.name + '-templates.js')
    .pipe(gulp.dest, './.tmp/app/')
    .pipe(livereload)();
}

/**
 * Filter an array of files according to file type
 *
 * @param {Array} files
 * @param {String} extension
 * @return {Array}
 */
function fileTypeFilter (files, extension) {
  var regExp = new RegExp('\\.' + extension + '$');
  return files.filter(regExp.test.bind(regExp));
}

/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
function dist (ext, name, opt) {
  opt = opt || {};
  return lazypipe()
    .pipe(g.concat, name + '.' + ext)
    .pipe(gulp.dest, './dist')
    .pipe(opt.ngAnnotate ? g.ngAnnotate : noop)
    .pipe(opt.ngAnnotate ? g.rename : noop, name + '.annotated.' + ext)
    .pipe(opt.ngAnnotate ? gulp.dest : noop, './dist')
    .pipe(ext === 'js' ? g.uglify : g.minifyCss)
    .pipe(g.rename, name + '.min.' + ext)
    .pipe(ext === 'js' ? replaceUrl : noop)
    .pipe(gulp.dest, './dist')();
}

/**
 * Livereload (or noop if not run by watch)
 */
function livereload () {
  return lazypipe()
    .pipe(isWatching ? g.livereload : noop)();
}

/**
 * Jshint with stylish reporter
 */
function jshint (jshintfile) {
  return lazypipe()
    .pipe(g.jshint, jshintfile)
    .pipe(g.jshint.reporter, stylish)();
}





/*
* Layout part
* */


gulp.task('static-dist', ['buildHtml', 'staticAssets', 'staticStyles']);


gulp.task('buildHtml', function () {
  return gulp.src('./static/*.jade')
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('./static/output'));
});

gulp.task('staticAssets', function () {
  return gulp.src('./src/app/assets/**')
    .pipe(gulp.dest('./static/output/assets'));
});

gulp.task('staticStyles', ['styles'], function () {
  return gulp.src('.tmp/css/*.css')
    .pipe(gulp.dest('./static/output/css/'));
});

gulp.task('watchHtml', ['buildHtml'], function() {
  return gulp.src('./static/output/*.html')
    .pipe(g.embedlr())
    .pipe(gulp.dest('./.tmp/layout'))
    .pipe(g.livereload());
});

gulp.task('layoutServer', g.serve({
  port: 3333,
  root: ['./.tmp', './.tmp/layout', 'src/app', '!./.tmp/index.html']
}));


gulp.task('layout', ['watchHtml','layoutServer', 'styles'], function() {

  g.livereload.listen();

  gulp.watch(['./src/app/styles/*.less', './src/app/styles/*/*.less'], ['csslint']).on('change', function(evt) {
    if (evt.type !== 'changed') {
      gulp.start('watchHtml');
    } else {
      g.livereload.changed(evt);
    }
  });
  gulp.watch('./static/*.jade', ['watchHtml']);
});