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
        `Welcome to the cat\'s meow ${chalk.red('au2-generator')} generator!`
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
    // returns './templates/index.js'
    var folder = process.cwd() + "\\src\\webparts";

    myfs.access(folder, (e) => {
      if (e === null) {
        var folders = this._getDirectories(folder);
        var camelClassName = this.props.webpart;
        var className = camelClassName.charAt(0).toUpperCase() + camelClassName.slice(1);
        var kebabClassName = kebabCase(className).substring(1) + '-';

        this._copyComponent('my-component.ts', folder + '\\' + camelClassName + '\\components', camelClassName);
        this._copyComponent('my-component.css', folder + '\\' + camelClassName + '\\components', camelClassName);
        if (this.props.example) {
          this._copyComponent2('webpart-example.ts', className + 'WebPart.ts', folder + '\\' + camelClassName, camelClassName);

          this._copyComponent('more-stuff.html', folder + '\\' + camelClassName + '\\components', camelClassName);
          this._copyComponent('more-stuff.ts', folder + '\\' + camelClassName + '\\components', camelClassName);
          this._copyComponent('other-stuff.html', folder + '\\' + camelClassName + '\\components', camelClassName);
          this._copyComponent('other-stuff.ts', folder + '\\' + camelClassName + '\\components', camelClassName);
          this._copyComponent2('my-component-example.html', kebabClassName + 'my-component.html', folder + '\\' + camelClassName + '\\components', camelClassName);
        }
        else {
          this._copyComponent('my-component.html', folder + '\\' + camelClassName + '\\components', camelClassName);
          this._copyComponent2('webpart.ts', className + 'WebPart.ts', folder + '\\' + camelClassName, camelClassName);

        }

        var tsconfig = this.fs.readJSON('./tsconfig.json');
        tsconfig.compilerOptions.rootDir = "autemp";
        tsconfig.compilerOptions.target = "esnext";
        tsconfig.include =  [
          "autemp/**/*.ts"
        ];

        this.fs.writeJSON('./tsconfig.json',tsconfig);
        
        this.fs.copy(
          this.templatePath('copy-static-assets.json'),
          this.destinationPath('config\\copy-static-assets.json')
        );
        
        this.fs.copy(
          this.templatePath('html.d.ts'),
          this.destinationPath('src\\html.d.ts')
        );
        this.fs.copy(
          this.templatePath('gulpfile.js'),
          this.destinationPath('gulpfile.js')
        );
      }
    });

    const pkgJson = {
      devDependencies: {
        'aurelia': 'latest'
      },
      dependencies: {
        '@aurelia/plugin-gulp': 'latest'
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
    this.log("install");

    //this.npmInstall();
    // this.installDependencies({
    //   bower: false,
    //   npm: true
    // }).then(() => console.log('Everything is ready!'));
  }

  initializing() {
    this.log("initializing");
  }

};
