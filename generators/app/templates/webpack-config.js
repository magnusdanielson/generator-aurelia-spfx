/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');

const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: true,
    // https://github.com/webpack-contrib/css-loader#importloaders
    importLoaders: 2
  }
};

const sassLoader = {
  loader: 'sass-loader',
  options: {
    sassOptions: {
      includePaths: ['node_modules']
    }
  }
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: ['autoprefixer']
    }
  }
};

module.exports = function(env, options) {
  const production = env.production || process.env.NODE_ENV === 'production';
  return {
    target: 'web',
    mode: production ? 'production' : 'development',
    devtool: production ? undefined : 'eval-cheap-source-map',
    entry: {
      '<%= KebabClassName %>web-part':
      {
        'import':'./srcau/webparts/<%= CamelClassName %>/<%= ClassName %>WebPart.ts',
        dependOn: 'common',
      },
      'common': 
      {
        'import':'./srcau/libraries/common/common.ts',
 
      },
    },
    watch: options.watch,
    watchOptions: options.watch ? {
      ignored: '**/node_modules',
      aggregateTimeout: 600,
    } : undefined,
    externals: ['@microsoft/sp-lodash-subset', '@microsoft/sp-core-library', '@microsoft/sp-office-ui-fabric-core', '@microsoft/decorators', '@microsoft/sp-diagnostics', '@microsoft/sp-dynamic-data', '@microsoft/sp-page-context', '@microsoft/office-ui-fabric-react-bundle', '@microsoft/sp-polyfills', '@microsoft/sp-http', '@microsoft/sp-loader', '@microsoft/sp-component-base', '@microsoft/sp-property-pane', '@microsoft/sp-webpart-base', '@microsoft/sp-client-preview', '@microsoft/sp-extension-base', '@microsoft/sp-application-base', '@microsoft/sp-webpart-workbench', 'react', 'react-dom'
    , 'HelloWorldWebPartStrings','common'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "[name].js",
      libraryTarget: 'amd',
      hashFunction: 'md5',
      chunkFilename: 'chunk.[name].js',
      publicPath: production ? undefined : 'https://localhost:4321/dist/',
      /*
     
    filename: '[name].js',
    library: '9f2444ccb91689871a656c70e7d83c7d',
    devtoolModuleFilenameTemplate: 'webpack:///../[resource-path]',
    devtoolFallbackModuleFilenameTemplate: 'webpack:///../[resource-path]?[hash]',
    crossOriginLoading: 'anonymous'
     */
    },
  //   optimization: {
  //   runtimeChunk: 'single',
  // },
  // optimization: {
  //   moduleIds: 'hashed',
  //   // splitChunks: {
  //   //   automaticNameMaxLength: 50,
  //   //   hidePathInfo: false,
  //   //   chunks: 'async',
  //   //   minSize: 10000,
  //   //   minChunks: 1,
  //   //   maxAsyncRequests: Infinity,
  //   //   automaticNameDelimiter: '~',
  //   //   maxInitialRequests: Infinity,
  //   //   name: true,
  //   //   cacheGroups: {
  //   //     default: {
  //   //       automaticNamePrefix: '',
  //   //       reuseExistingChunk: true,
  //   //       minChunks: 2,
  //   //       priority: -20
  //   //     },
  //   //     vendors: {
  //   //       automaticNamePrefix: 'vendors',
  //   //       test: /[\\/]node_modules[\\/]/,
  //   //       priority: -10
  //   //     }
  //   //   }
  //   // }
  // },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.resolve(__dirname, 'srcau'), 'node_modules'],
      alias: production ? {
        // add your production aliasing here
      } : {
        ...[
          'fetch-client',
          'kernel',
          'metadata',
          'platform',
          'platform-browser',
          'plugin-conventions',
          'route-recognizer',
          'router',
          'router-lite',
          'runtime',
          'runtime-html',
          'testing',
          'webpack-loader',
        ].reduce((map, pkg) => {
          const name = `@aurelia/${pkg}`;
          map[name] = path.resolve(__dirname, 'node_modules', name, 'dist/esm/index.dev.mjs');
          return map;
        }, {
          'aurelia': path.resolve(__dirname, 'node_modules/aurelia/dist/esm/index.dev.mjs'),
          // add your development aliasing here
        })
      }
    },
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000
    },
    module: {
      rules: [
        { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset' },
        { test: /\.(woff|woff2|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,  type: 'asset' },
        { test: /\.css$/i, use: [ 'style-loader', cssLoader, postcssLoader ] },
        { test: /\.scss$/i, use: [ 'style-loader', cssLoader, postcssLoader, sassLoader ] },
        { test: /\.ts$/i, use: [ {
          loader: 'ts-loader',
          options: {
            configFile : "au-tsconfig.json"
          }}, '@aurelia/webpack-loader'], exclude: /node_modules/ },
        {
          test: /[/\\]srcau[/\\].+\.html$/i,
          use: {
            loader: '@aurelia/webpack-loader',
            options: { useCSSModule: true }
          },
          exclude: /node_modules/
        }
      ]
    },
    performance: { hints: false },
    plugins: [
      //new HtmlWebpackPlugin({ template: 'index.html', favicon: 'favicon.ico' }),
      // new Dotenv({
      //   path: `./.env${production ? '' :  '.' + (process.env.NODE_ENV || 'development')}`,
      // }),
      options.analyze && new BundleAnalyzerPlugin()
    ].filter(p => p),
    // SetPublicPathPlugin { options: [Object] },
    // DefinePlugin { definitions: [Object] },
    // ComponentNamePlugin { _options: [Object] },
    // AsyncComponentPlugin {
    //   _externalComponents: [Map],
    //   _options: [Object]
    // },
    // ManifestPlugin {
    //   _parsedLocFileCache: Map(0) {},
    //   _options: [Object]
    // },
    // CopyReleaseAssetsPlugin { _options: [Object] }
  }
}
