var gulp = require('flarum-gulp');

gulp({
  modules: {
    '<%= packageName %>': [
      'src/**/*.js',
    ]
  }
});
