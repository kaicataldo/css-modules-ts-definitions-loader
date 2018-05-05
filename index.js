const path = require('path');
const fs = require('fs');
const os = require('os');
const acorn = require('acorn');
const walk = require('acorn/dist/walk');

module.exports = function loader(source, map) {
  const callback = this.async();

  function errCb(err) {
    callback(err);
  }

  function successCb() {
    callback(null, source, map);
  }

  const ast = acorn.parse(source, { sourceType: 'module' });
  const exportedValues = {};

  walk.simple(ast, {
    AssignmentExpression(node) {
      const isValuesExport =
        node.left.type === 'MemberExpression' &&
        node.left.object.name === 'exports' &&
        node.left.property.name === 'locals';

      if (isValuesExport && node.right.type === 'ObjectExpression') {
        for (const property of node.right.properties) {
          // The key can be an identifier or a string literal
          const key =
            property.type === 'Indentifier'
              ? property.key.name
              : property.key.value;

          /*
           * Depending on the configuration, css-loader might not remove the original non-camelcased keys.
           * Filter out keys with dashes since they aren't valid in TS identifiers.
           * https://github.com/webpack-contrib/css-loader#camelcase
           */
          if (/-\w/.test(key)) {
            continue;
          }

          exportedValues[key] = true;
        }
      }
    }
  });

  const { dir, base } = path.parse(this.resourcePath);
  const definitionBase = `${base}.d.ts`;
  const definitionPath = path.join(dir, definitionBase);
  const definitionSource = `${Object.keys(exportedValues)
    .map(val => `export const ${val}: string;`)
    .join(os.EOL)}${os.EOL}`;

  this.addDependency(definitionPath);

  fs.stat(definitionPath, (err, stats) => {
    if (err && err.code !== 'ENOENT') {
      return errCb(err);
    }

    const fileExists = stats && stats.isFile();

    function updateDefinitionFile() {
      function fileChangeCb(err) {
        if (err) {
          return errCb(err);
        }

        successCb();
      }

      if (fileExists && !Object.keys(exportedValues).length) {
        return fs.unlink(definitionPath, fileChangeCb);
      }

      fs.writeFile(definitionPath, definitionSource, 'utf-8', fileChangeCb);
    }

    if (fileExists) {
      fs.readFile(definitionPath, 'utf-8', (err, content) => {
        if (err) {
          return errCb(err);
        }

        if (definitionSource !== content) {
          return updateDefinitionFile();
        }

        successCb();
      });
    } else {
      updateDefinitionFile();
    }
  });
};
