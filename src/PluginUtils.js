const webpack = require('webpack');
const fileSystem = require('fs');
const MemoryFS = require('memory-fs');
const appRoot = require('app-root-path');
const fallbackFS = require('./FallbackFileSystem');

class PluginUtils {
  static rootPath() {
    return appRoot.toString();
  }

  static webpackFs(fs) {
    return fallbackFS(fs.data, fileSystem);
  }

  static defaultWebpackConfig(publicPath) {
    return {
      entry: {
      },

      resolve: {
        extensions: ['.js'],
        modules: [`${PluginUtils.rootPath()}/node_modules`],
      },

      output: {
        path: '/build/',
        publicPath,
      },

      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production'),
          },
        }),
      ],
    };
  }

  static runCompiler(memoryFs, config) {
    // create webpack compiler
    // setup compiler filesystem with memory fs
    const compiler = PluginUtils.webpackCompiler(memoryFs, config);
    // run compiler
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          // console.log(err);
          // console.log(stats);
          reject('Preview failed to compile');
        }
        resolve(compiler.outputFileSystem);
      });
    });
  }

  static webpackCompiler(compilerFs, config) {
    const compiler = webpack(config);
    // hydrate new fs with data
    compiler.inputFileSystem = compilerFs;
    compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
    // seperate input and output file systems.
    compiler.outputFileSystem = new MemoryFS();
    return compiler;
  }
}

module.exports = PluginUtils;
