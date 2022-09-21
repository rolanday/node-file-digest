// eslint-disable-next-line no-undef
module.exports = function(grunt) {
  grunt.initConfig({
    exec: {
      build: 'tsc',
      pack: 'npm pack --silent',
      docs: 'typedoc'
    },
    clean: {
      dist: {
        src: ['dist/', 'coverage', 'docs/', 'types/', 'node-file-digest-*.tgz'],
        options: {
          verbose: false,
          'no-write': false,
        }
      },
      tsc: {
        src: [
          'src/**/*.d.ts',
          'src/**/*.js',
          'src/**/*.js.map',
        ],
        options: {
          verbose: false,
          'no-write': false,
        }
      },
    },
    copy: {
      js : {
        files : [
          {
            expand: true,
            flatten : false,
            cwd: 'src',
            src: ['**/*.js', '!**/*.spec.js'],
            dest: 'dist/',
            options : {
            },
          },
        ],
      },
      declarations : {
        files : [
          {
            expand: true,
            flatten : false,
            cwd: 'src',
            src: ['**/*.d.ts', '!**/*.spec.d.ts'],
            dest: 'types/',
            options : {
            },
          },
        ],
      },
    },
  });

  // grunt.loadNpmTasks('grunt-typedoc');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('make-dist', ['clean', 'exec:build', 'copy:js', 'copy:declarations', 'exec:pack', 'exec:docs']);
};
