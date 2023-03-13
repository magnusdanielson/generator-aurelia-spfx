'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const myfs = require('fs');
var kebabCase = require("kebab-case");

module.exports = class extends Generator {

  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // This makes `appname` a required argument.
    //this.argument("appname", { type: String, required: false });

    // Next, add your custom code
    //this.option('babel',); // This method adds support for a `--babel` flag
  }
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the ${chalk.red('aurelia-spfx')} generator!`
      )
    );

    var prompts = [
      {
        type: 'list',
        name: 'webpart',
        message: 'Select Webpart to add Aurelia to',
        choices: []
      },
      {
        type: "confirm",
        name: "example",
        message: "Would you like to include example subcomponents?"
      },
      {
        type: "confirm",
        name: "install",
        message: "Would you like me to run npm install?"
      },
    ];

    var folder = process.cwd() + "\\src\\webparts";
    myfs.accessSync(folder);

    var folders = this._getDirectories(folder);

    folders.forEach(element => {
      prompts[0].choices.push(
        {
          name: element,
          value: element,
        }
      )
    });
    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {

    this.destinationRoot();
    // returns '~/projects'
    this.destinationPath('index.js');
    // returns '~/projects/index.js'
    this.sourceRoot();
    // returns './templates'
    this.templatePath('index.js');

    
    //this.log("begin");

    if(!myfs.existsSync('srcau'))
    {
      myfs.mkdirSync('srcau');

    }

    if(!myfs.existsSync('srcau\\webparts'))
    {
      myfs.mkdirSync('srcau\\webparts');
      
    }
    // returns './templates/index.js'
    var folder = process.cwd() + "\\srcau\\webparts";

    myfs.access(folder, (e) => {
      if (e === null) {
        var folders = this._getDirectories(folder);
        var camelClassName = this.props.webpart;
        var className = camelClassName.charAt(0).toUpperCase() + camelClassName.slice(1);
        var kebabClassName = kebabCase(className).substring(1) + '-';

        this._copyComponent('my-component.ts', folder + '\\' + camelClassName + '\\components', camelClassName);
        this._copyComponent('my-component.scss', folder + '\\' + camelClassName + '\\components', camelClassName);
        if (this.props.example) {
          this._copyComponent2('webpart-example.ts', className + 'WebPart.ts', folder + '\\' + camelClassName, camelClassName);

          this._copyComponent('more-stuff.html', folder + '\\' + camelClassName + '\\components', camelClassName);
          this._copyComponent('more-stuff.ts', folder + '\\' + camelClassName + '\\components', camelClassName);
          this._copyComponent('other-stuff.html', folder + '\\' + camelClassName + '\\components', camelClassName);
          this._copyComponent('other-stuff.ts', folder + '\\' + camelClassName + '\\components', camelClassName);
          this._copyComponent2('my-component-example.html', kebabClassName + 'my-component.html', folder + '\\' + camelClassName + '\\components', camelClassName);
          this.fs.copy(
            this.templatePath('welcome-dark.png'),
            this.destinationPath( folder + '\\' + camelClassName + '\\components\\welcome-dark.png')
          );
          this.fs.copy(
            this.templatePath('welcome-light.png'),
            this.destinationPath( folder + '\\' + camelClassName + '\\components\\welcome-light.png')
          );
          this.fs.copy(
            this.templatePath('my.css'),
            this.destinationPath( folder + '\\' + camelClassName + '\\components\\my.css')
          );
        }
        else {
          this._copyComponent('my-component.html', folder + '\\' + camelClassName + '\\components', camelClassName);
          this._copyComponent2('webpart.ts', className + 'WebPart.ts', folder + '\\' + camelClassName, camelClassName);

        }
        
        this.fs.copyTpl(
          this.templatePath('wp5gulpfile.js'),
          this.destinationPath('wp5gulpfile.js'),
          {
            ClassName: className,
            CamelClassName: camelClassName,
            KebabClassName: kebabClassName
          }
        );

        var tsconfig = this.fs.readJSON('./tsconfig.json');
        tsconfig.compilerOptions.noUnusedLocals = false;
        this.fs.writeJSON('./tsconfig.json',tsconfig);

        var config = this.fs.readJSON('./config/config.json');
        if(typeof config.externals.common == "undefined" )
        {
          config.externals.common = "./dist/common.js";
        }
        this.fs.writeJSON('./config/config.json',config);


        var wpPath = process.cwd() + "\\src\\webparts" + '\\' + camelClassName + '\\' + className + 'WebPart.ts'
        this.fs.copy( wpPath,wpPath,{
          process:function(content)
          {
            var oldContent = content.toString();

            if(oldContent.indexOf("import {PoliteGreeting} from 'common';") >= 0)
            {
              return oldContent;
            }
            var newContent = "import {PoliteGreeting} from 'common';\r\n" + oldContent;
            var newContent = newContent.replace("public render(): void {", "public render(): void {\r\nvar _pg = new PoliteGreeting();\r\n");

            return newContent;
          }
        })
        this.fs.copy(process.cwd() + '\\gulpfile.js', process.cwd() + '\\gulpfile.js', {
          process: function(content) {
              var oldContent = content.toString();
              
              if(oldContent.indexOf("require('./wp5gulpfile');") >= 0)
              {
                return oldContent;
              }
              var newContent = oldContent.replace("const build = require('@microsoft/sp-build-web');", "const build = require('@microsoft/sp-build-web');\r\nconst wp5build = require('./wp5gulpfile');\r\nwp5build.init(build);\r\n");
              return newContent;
          }
      });

      
        this.fs.copy(
          this.templatePath('au-tsconfig.json'),
          this.destinationPath('au-tsconfig.json')
        );
        this.fs.copyTpl(
          this.templatePath('webpack-config.js'),
          this.destinationPath('webpack-config.js'),
          {
            ClassName: className,
            CamelClassName: camelClassName,
            KebabClassName: kebabClassName
          }
        );
        this.fs.copy(
          this.templatePath('common.d.ts'),
          this.destinationPath('src\\common.d.ts')
        );
        this.fs.copy(
          this.templatePath('html.d.ts'),
          this.destinationPath('srcau\\html.d.ts')
        );
        this.fs.copy(
          this.templatePath('common.ts'),
          this.destinationPath('srcau\\libraries\\common\\common.ts')
        );
        this.fs.copy(
          this.templatePath('hello-greeting.ts'),
          this.destinationPath('srcau\\libraries\\common\\hello-greeting.ts')
        );
        //this.log("done");
      }
    });

    const pkgJson = {
      devDependencies: {
        "@aurelia/webpack-loader": "latest",
        "autoprefixer": "^10.4.13",
        "css-loader": "^6.7.3",
        "dotenv-webpack": "^8.0.1",
        "postcss": "^8.4.20",
        "postcss-loader": "^7.0.2",
        "sass": "^1.57.1",
        "sass-loader": "^13.2.0",
        "style-loader": "^3.3.1",
        "ts-loader": "^9.4.2",
        "typescript": "4.9.5",
        "webpack": "^5.75.0",
        "webpack-bundle-analyzer": "^4.7.0",
        "webpack-cli": "^5.0.1",
        "webpack-stream": "^7.0.0",
        "yargs": "^17.6.2"
      },
      dependencies: {
        "aurelia": "latest"
      }
    };

    // pkg.keywords = pkg.keywords || [];
    // pkg.keywords.push('aurelia');

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  // _copyComponent(fileName, folder) {
  //   this.fs.copy(
  //     this.templatePath(fileName),
  //     this.destinationPath(folder + '\\components\\' + fileName)
  //   );
  // }

  _copyComponent(fileName, folder, camelClassName) {
    var className = camelClassName.charAt(0).toUpperCase() + camelClassName.slice(1);
    var kebabClassName = kebabCase(className).substring(1) + '-';
    this._copyComponent2(fileName, kebabClassName + fileName, folder, camelClassName);
  }

  _copyComponent2(fileName, destFileName, folder, camelClassName) {
    var className = camelClassName.charAt(0).toUpperCase() + camelClassName.slice(1);

    var kebabClassName = kebabCase(className).substring(1) + '-';

    this.fs.copyTpl(
      this.templatePath(fileName),
      this.destinationPath(folder + '\\' + destFileName),
      {
        ClassName: className,
        CamelClassName: camelClassName,
        KebabClassName: kebabClassName
      }
    );
  }

  _copyWebPartComponent(fileName, folder, camelClassName) {
    var className = camelClassName.charAt(0).toUpperCase() + camelClassName.slice(1);

    var kebabClassName = kebabCase(className).substring(1) + '-';

    this.fs.copyTpl(
      this.templatePath(fileName),
      this.destinationPath(folder + '\\' + camelClassName + '\\' + camelClassName + 'WebPart.ts'),
      {
        ClassName: className,
        CamelClassName: camelClassName,
        KebabClassName: kebab
      }
    );
  }
  _getDirectories = (source) => {
    var folders = myfs.readdirSync(source, { withFileTypes: true });

    return folders.filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }

  install() {
    if (this.props.install)
    {
      this.npmInstall();
      // this.installDependencies({
      //   yarn: false,
      //   bower: false,
      //   npm: true
      // });
    }

    

  }

  initializing() {
    this.log("initializing");
  }

};
