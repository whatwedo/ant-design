const { moduleNameMapper, transformIgnorePatterns } = require('./.jest');

// jest config for server render environment
module.exports = {
  setupFiles: ['./tests/setup.js'],
  setupFilesAfterEnv: ['./tests/setupAfterEnv.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'md'],
  moduleNameMapper,
  transform: {
    '\\.tsx?$': './tests/transformers/codeTransformer',
    '\\.js$': './tests/transformers/codeTransformer',
    '\\.md$': './tests/transformers/demoTransformer',
    '\\.(jpg|png|gif|svg)$': './tests/transformers/imageTransformer',
  },
  testRegex: 'node\\.test\\.(j|t)sx$',
  testEnvironment: 'node',
  transformIgnorePatterns,
};
