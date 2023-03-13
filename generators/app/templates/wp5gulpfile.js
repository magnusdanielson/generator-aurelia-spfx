'use strict';
//const build = require('@microsoft/sp-build-web');
//const spBuildCoreTasks = require("@microsoft/sp-build-core-tasks");
//const ConfigureWebpackTask_1 = require("@microsoft/sp-build-core-tasks/lib/webpack/ConfigureWebpackTask");
const webpackConfig = require('./webpack-config');
const webpack = require('webpack-stream');
const fs =require('fs');
const { option } = require('yargs');
// const { _ManifestPlugin } = require('@microsoft/spfx-heft-plugins/lib');
// const {AsyncComponentPlugin} = require("@microsoft/spfx-heft-plugins/lib/plugins/webpackConfigurationPlugin/webpackPlugins/AsyncComponentPlugin");
// const {CopyReleaseAssetsPlugin} = require("@microsoft/spfx-heft-plugins/lib/plugins/webpackConfigurationPlugin/webpackPlugins/CopyReleaseAssetsPlugin");
// const {ComponentNamePlugin} = require("@microsoft/spfx-heft-plugins/lib/plugins/webpackConfigurationPlugin/webpackPlugins/ComponentNamePlugin");


const argv = require('yargs').argv;
const isWatch = argv['watch'];
const isAnalyze = argv['analyze'];
const isProduction = argv['production'];

function createGuid(){  
  function S4() {  
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);  
  }  
  return (S4() + S4() + "-" + S4() + "-4" + S4().substring(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();  
} 



function init(build)
{

  let copywp5Subtask = build.subTask('copywp5-subtask', function(gulp, buildOptions, done) {
    //this.logWarning('Logs a warning');
    var text  = fs.readFileSync('./config/config.json')
    var data = JSON.parse(text);
    const files = fs.readdirSync('dist');
    
    for(const bundle in data.bundles)
    {
      for (const file of files) 
      {
        if (file.startsWith(bundle + "_")) 
        {
          fs.copyFileSync('./dist/'+ bundle + '.js','./dist/'+file);
          fs.copyFileSync('./dist/'+ bundle + '.js','./release/assets/'+file);
          
        }
      }
    }
    for(const bundle in data.externals)
    {
      for (const file of files) 
      {
        if (file.startsWith(bundle + "_")) 
        {
          fs.copyFileSync('./dist/'+ bundle + '.js','./dist/'+file);
          fs.copyFileSync('./dist/'+ bundle + '.js','./release/assets/'+file);
          
        }
      }
    }
    for (const file of files) 
      {
        if(!file.endsWith('json') && !file.endsWith('js') && !file.endsWith('map'))
        {
          fs.copyFileSync('./dist/'+ file,'./release/assets/'+file);
        }
      }
    done();
  });
  let copywp5 = build.task('copywp5', copywp5Subtask);
  
  let buildwp5Subtask = build.subTask('buildwp5-subtask', function(gulp, buildOptions, done) {
    //this.logWarning('Logs a warning');
    let config = webpackConfig({production:isProduction},{analyze:isAnalyze, watch:isWatch});
    return gulp
      .src('./srcau/webparts/<%= CamelClassName %>/<%= ClassName %>WebPart.ts')
      .pipe(
        webpack(config)
      )
      .pipe(gulp.dest('dist/'));
  });
  let buildwp5 = build.task('buildwp5', buildwp5Subtask);
  
  let addLibrarySubtask = build.subTask('addLibrary-subtask', function(gulp, buildOptions, done) {
    
    var dir = './dist';
  
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
    fs.writeFileSync('dist/common.js', 'let a = "' + createGuid() + '";');
    done();
  });
  //var tasksSerie = build.serial([tt, helloWorldSubtask]);
  let addlib = build.task('addlib', addLibrarySubtask);
  
  var bundlewp5 = build.task('bundlewp5', build.serial([buildwp5Subtask, copywp5Subtask]));
  
  
  build.tslintCmd.enabled = false;
  //build.tscCmd.enabled = true;
  //build.copyStaticAssets.enabled = false;
  build.lintCmd.enabled = false;
  build.rig.addPreBuildTask(addlib);
  
  
}

exports.init = init;