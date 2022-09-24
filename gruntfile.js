// eslint-disable-next-line no-undef
module.exports = function(grunt) {
  const path = require('path');
  const fs = require('fs');
  const root = process.cwd();
  const dist = path.join(process.cwd(), 'dist');
  function makePackageDotJsonDist() {
    const src = path.join(root, 'package.json');
    const dst = path.join(dist, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(src));
    delete pkg.devDependencies;
    delete pkg.scripts;
    console.info(`Writing ${dst}`);
    try { 
      fs.writeFileSync(dst, JSON.stringify(pkg, null, 2));
    } catch(e) {
      console.error(`Error writing dist/package.json: ${e.message}`);
    }
  }
  grunt.initConfig({
    exec: {
      build: 'tsc',
      pack: {
        cwd: './dist',
        cmd: `npm pack"`
      },
      docs: 'typedoc'
    },
    clean: {
      dist: {
        src: ['dist', 'coverage', 'docs', 'node-file-digest-*.tgz'],
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
      src : {
        files : [
          {
            expand: true,
            flatten : false,
            cwd: 'src',
            src: ['**/*.js', '**/*.d.ts'],
            dest: 'dist/',
            options : {
            },
          },
          {
            expand: false,
            src: ['LICENSE', '.npmignore'],
            dest: 'dist/',
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
  grunt.task.registerTask('make-dist-pkg-json', 'Making dist/package.json', makePackageDotJsonDist);
  grunt.registerTask('pack', ['exec:pack']); 
  grunt.registerTask('make-dist', ['clean', 'exec:build', 'copy:src', 'make-dist-pkg-json']);
};
