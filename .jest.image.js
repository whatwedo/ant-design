const { moduleNameMapper, transformIgnorePatterns } = require('./.jest');

// jest config for image snapshots
module.exports = {
  setupFiles: ['./tests/setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'md'],
  moduleNameMapper,
  transform: {
    '\\.tsx?$': './tests/transformers/codeTransformer',
    '\\.js$': './tests/transformers/codeTransformer',
    '\\.md$': './tests/transformers/demoTransformer',
    '\\.(jpg|png|gif|svg)$': './tests/transformers/imageTransformer',
  },
  testRegex: 'image\\.test\\.(j|t)s$',
  transformIgnorePatterns,
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.test.json',
    },
  },
  preset: 'jest-puppeteer',
  testTimeout: 10000,
};
