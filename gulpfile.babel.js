'use strict';
import browserSync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import cleanCSS from 'gulp-clean-css';
import less from 'gulp-less';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import yargs from 'yargs';

const argv = yargs.option('app', {
	description: 'Application name',
	default: 'joomla-3.x'
}).argv;

const paths = {
	php: './templates/padraogoverno01/**/*.php',
	styles: {
		src: './templates/padraogoverno01/less/*.less',
		dest: './templates/padraogoverno01/css/'
	},
	scripts: {
		src: ['./templates/padraogoverno01/js/*.js', '!./templates/padraogoverno01/js/*.min.js'],
		dest: './templates/padraogoverno01/js/'
	}
};

const reload = done => {
	browserSync.reload();
	done();
};

const serve = done => {
	browserSync.init({
		proxy: `http://localhost/${argv.app}`,
		open: false
	});

	done();
};

/**
 * Limpa a pasta de destino dos css
 */
export const clean = () => del([paths.styles.dest, '!./templates/padraogoverno01/css/custom.css']);

/**
 * Processa os arquivos LESS e comprime o CSS
 */
export const styles = () => {
	return gulp
		.src([paths.styles.src, '!./templates/padraogoverno01/less/_*.less'])
		.pipe(less())
		.pipe(cleanCSS({ compatibility: 'ie7' }))
		.pipe(gulp.dest(paths.styles.dest));
};

/**
 * Minifica arquivos javascripts
 */
export const scripts = () => {
	return gulp
		.src(paths.scripts.src)
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.dest));
};

/**
 * Monitora e processa os arquivos LESS quando alterados sem comprimir.
 * Usado para desenvolvimento
 */
const watchFiles = () => {
	gulp.watch(paths.php, reload);
	gulp.watch(paths.styles.src, gulp.series(styles, reload));
	gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
};

export const dev = gulp.series(clean, gulp.parallel(styles, scripts), serve, watchFiles);
export const build = gulp.series(clean, gulp.parallel(styles, scripts));
export default dev;
