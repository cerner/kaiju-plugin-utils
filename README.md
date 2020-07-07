# kaiju-plugin-utils

[![Cerner OSS](https://img.shields.io/badge/Cerner-OSS-blue.svg?style=flat)](http://engineering.cerner.com/2014/01/cerner-and-open-source/)
[![Build Status](https://travis-ci.org/cerner/kaiju-plugin-utils.svg?branch=main)](https://travis-ci.org/cerner/kaiju-plugin-utils)

Kaiju plugin utils is a helpful library of common optional utilities used when creating plugins for Kaiju.

## Development notes
This module uses app-root-path to determine root path to the kaiju node server. This library determines the root path by walking up the current directory path to be one level below the last occurrence of 'node_modules'. This works great normally but can be incorrect when this module is setup as a file dependency because the directory is symlinked instead of copied. For this module to work as expected in development you cannot require this module as a file.

## Plugin Utils
Common optional utilities to be used when developing kaiju plugins. There is a dependency on webpack for preview creation. If you don't need webpack, you might not want to use these utils.

### Usage
```js
const { PluginUtils } = require('kaiju-plugin-utils');

PluginUtils.rootPath() // for example
```

### runCompiler
Runs the webpack compiler on the files included in the memory file system with the config supplied.

**Arguments:**
Memory File System - A memory file system containing the files to be webpacked.

Config - The webpack config to be used by the compiler.

**Return values:** Compiler file system - A promise for a memory file system containing the output from the webpack compiler.

### webpackCompiler
Creates a webpack compiler setup with the config and memory file system passed in and a new memory file system instance for the output.

**Arguments:**

Memory File System - A memory file system containing the files to be webpacked.

Config - The webpack config to be used by the compiler.

**Return values:** A webpack compiler setup with a memory file system.

### defaultWebpackConfig
A basic optional webpack config. Importantly it sets up resolve to point to the root app's node modules, output based on arguments and the output and it sets the environment to production.

**Arguments:**
public path - the path the the preview's assets, this will be supplied by the kaiju server.

output path - the location to build the assets to, this should be returned to the kaiju server.

**Return values:** A webpack config object.

### webpackFs
A setup fallback file system proxy with the passed in memory fs and a standard filesystem.

**Arguments:**

MemoryFS - a memory file system instance.

**Return values:** A fallback file system.

### rootPath
The path the the root of the kaiju node server. Uses the app-root-path library.

**Return values:** A string representing the root path.

## Fallback File System
The fallback file system is a very specific proxy setup on top of a memory file system. This filesystem falls back to the supplied file system when a file isn't found in the memory file system. This was created to allow webpack to use the kaiju servers node modules instead of requiring an npm install on the in memory file system to generate the preview. The fs methods that will 'fallback' are readFileSync, statSync, readlinkSync, existsSync and readdirSync. These were chosen based on webpacks usage.

### Usage
```js
const { FallbackFileSystem } = require('kaiju-plugin-utils');
const fileSystem = require('fs');
const MemoryFS = require('memory-fs');

const memFs = new MemoryFS();
const fallbackFs = FallbackFileSystem(memFs.data, fileSystem);
```

## History

[Releases](https://github.com/cerner/kaiju/releases)

## License

Copyright 2017 Cerner Innovation, Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
