var gulp = require('gulp');
var browserSync = require('browser-sync');
var cp = require('child_process');


/**
 * Server functionality handled by BrowserSync
 */
function browserSyncServe(done) {
  browserSync.init({
    server: '_site',
    port: 4000
  });
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

/**
 * Build Jekyll site
 */
function jekyll(done) {
  return cp
    .spawn(
      'bundle',
      [
        'exec',
        'jekyll',
        'build',
        '--incremental',
        '--config=_config.yml,_config_dev.yml'
      ],
      {
        stdio: 'inherit'
      }
    )
    .on('close', done);
}

/**
 * Watch source files for changes & recompile
 * Watch html/md files, run Jekyll & reload BrowserSync
 */
function watchData() {
  gulp.watch(
    [ '_data/*.yml', '_config.yml' ],
    gulp.series(jekyll, browserSyncReload)
  );
}

function watchMarkup() {
  gulp.watch(
    [ 'index.html', '_includes/*.html', '_layouts/*.html' ],
    gulp.series(jekyll, browserSyncReload)
  );
}

function watch() {
  gulp.parallel(watchData, watchMarkup);
}
var serve = gulp.series(jekyll, browserSyncServe);
var watch = gulp.parallel(watchData, watchMarkup);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the Jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', gulp.parallel(serve, watch));
