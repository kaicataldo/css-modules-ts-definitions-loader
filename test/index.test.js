const fs = require('fs');
const path = require('path');
const del = require('del');
const compiler = require('./compiler.js');

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const OUTPUT_DIR = path.join(__dirname, 'output');

const fixtureFiles = [];
const expectedResults = new Map();

function testFixture(filename, opts) {
  const fixturePath = path.join(OUTPUT_DIR, filename);
  const defFileBase = `${filename}.d.ts`;

  return compiler(fixturePath, opts).then(() => {
    const contents = fs.readFileSync(
      path.join(OUTPUT_DIR, defFileBase),
      'utf-8'
    );
    expect(contents).toEqual(expectedResults.get(defFileBase));
  });
}

beforeAll(() => {
  try {
    fs.statSync(OUTPUT_DIR);
  } catch (e) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  fs.readdirSync(FIXTURES_DIR).map(filepath => {
    const { base } = path.parse(filepath);

    if (/.css$/.test(filepath)) {
      const contents = fs.readFileSync(
        path.join(FIXTURES_DIR, filepath),
        'utf-8'
      );

      fs.writeFileSync(path.join(OUTPUT_DIR, base), contents);
      fixtureFiles.push(filepath);
    } else if (/.d.ts$/.test(filepath)) {
      const contents = fs.readFileSync(
        path.join(FIXTURES_DIR, filepath),
        'utf-8'
      );

      expectedResults.set(base, contents);
    }
  });
});

afterAll(() => {
  del(OUTPUT_DIR);
});

test('should generate type definition file', () => {
  return testFixture('test.css');
});

test('should filter out non-camel case class names', () => {
  return testFixture('test2.css', { camelCase: false });
});

test('should generate type definition file for empty CSS module', () => {
  return testFixture('test3.css');
});

test('should pass through output of CSS Loader without transforming it', function() {
  return Promise.all(
    fixtureFiles.map(fixturePath => {
      const outputDirFixturePath = path.join(OUTPUT_DIR, fixturePath);

      return Promise.all([
        compiler(outputDirFixturePath, { cssLoaderOnly: true }),
        compiler(outputDirFixturePath)
      ]).then(([cssLoaderStat, cssModulesDefLoaderStat]) => {
        const cssLoaderModules = cssLoaderStat.toJson().modules;
        const cssModulesDefLoaderModules = cssModulesDefLoaderStat.toJson()
          .modules;
        cssLoaderModules.forEach((module, i) => {
          expect(module.source).toBe(cssModulesDefLoaderModules[i].source);
        });
      });
    })
  );
});
