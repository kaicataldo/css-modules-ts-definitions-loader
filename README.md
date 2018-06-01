[![Build Status](https://travis-ci.org/kaicataldo/css-modules-ts-definitions-loader.svg?branch=master)](https://travis-ci.org/kaicataldo/css-modules-ts-definitions-loader)

# css-modules-ts-definitions-loader

Webpack loader that generates TypeScript definition files for CSS Modules.

## Installation

```bash
npm install --save-dev css-modules-ts-definitions-loader
```

## Usage

`css-modules-ts-definitions-loader` generates TypeScript definition files (`*.d.ts`) from the output of [`css-loader`](https://github.com/webpack-contrib/css-loader) with the [`modules`](https://github.com/webpack-contrib/css-loader#modules) and [`camelCase`](https://github.com/webpack-contrib/css-loader#camelcase) options enabled. It must come directly after `css-loader` (but before `style-loader`) in the Webpack config. 

**Note:** Any CSS class names that are invalid TypeScript identifiers are filtered out. This includes invalid characters as well as class names that are reserved words in TypeScript.

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 
          'style-loader', // adds styles to the DOM
          'css-modules-ts-definitions-loader', // generates TypeScript type definition files
          {
            loader: 'css-loader', // converts CSS into CommonJS
            options: {
              modules: true,
              camelCase: true
            }
          }
        ]
      }
    ]
  }
}
```

## Example

Input file:

**file.css**
```css
@value foo: red;

.bar {
  width: 100%;
}

.baz-qux {
  color: foo;
}
```

With the above configuration and input file, the loader would generate the following definition file:

**file.css.d.ts**
```ts
export const foo: string;
export const bar: string;
export const bazQux: string;
```

## Preprocessing styles

This loader will also work with loaders that preprocess styles as long as the preprocessed files are passed to `css-loader`.

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [ 
          'style-loader', // adds styles to the DOM
          'css-modules-ts-definitions-loader', // generates TypeScript type definition files
          {
            loader: 'css-loader', // converts CSS into CommonJS
            options: {
              modules: true,
              camelCase: true
            }
          },
          'sass-loader' // compiles Sass to CSS
        ]
      }
    ]
  }
}
```

## Prior Art
- [typings-for-css-modules-loader](https://github.com/Jimdo/typings-for-css-modules-loader)
- [typed-css-modules-loader](https://github.com/olegstepura/typed-css-modules-loader)

