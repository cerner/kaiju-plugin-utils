const PluginUtils = require('../../src/PluginUtils');
const path = require('path');
const MemoryFS = require('memory-fs');

describe('PluginUtils', () => {
  describe('rootPath', () => {
    it('returns the root path', () => {
      expect(PluginUtils.rootPath()).toBe(path.join(__dirname, '../..'));
    });
  });

  describe('webpackFs', () => {
    it('returns virtual files', () => {
      const memFS = new MemoryFS();
      memFS.writeFileSync('/derp.json', 'derp');
      const testFs = PluginUtils.webpackFs(memFS);
      expect(testFs.existsSync('/derp.json')).toBe(true);
    });

    it('finds real files', () => {
      const memFS = new MemoryFS();
      const testFs = PluginUtils.webpackFs(memFS);
      expect(testFs.existsSync('/package.json')).toBe(true);
    });
  });

  describe('defaultWebpackConfig', () => {
    it('returns a base webpack config', () => {
      const publicPath = 'publicPath';
      const config = PluginUtils.defaultWebpackConfig(publicPath);
      expect(config.resolve).toEqual({
        extensions: ['.js'],
        modules: [path.join(__dirname, '../..', 'node_modules')],
      });
      expect(config.output).toEqual({
        path: '/build/',
        publicPath,
      });
      expect(config.plugins).toEqual([
        {
          definitions: {
            'process.env': {
              NODE_ENV: '"production"',
            },
          },
        },
      ]);
    });
  });

  describe('runCompiler', () => {

  });

  describe('webpackCompiler', () => {
    it('returns a new webpack compiler', () => {
      const config = PluginUtils.defaultWebpackConfig('derp');
      const memFS = new MemoryFS();
      config.entry.preview = '/tests/jest/data/derp.js';
      const compiler = PluginUtils.webpackCompiler(config, memFS);

      // expect(compiler).toEqual({});
      expect(compiler.options.entry.preview).toEqual(config.entry.preview);
      expect(compiler.inputFileSystem).toBe(memFS);
      expect(compiler.resolvers.normal.fileSystem).toBe(memFS);
      expect(compiler.outputFileSystem.constructor.name).toBe('MemoryFileSystem');
    });
  });
});
