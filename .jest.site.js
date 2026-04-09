const { moduleNameMapper, transformIgnorePatterns } = require('./.jest');

// jest config for server render environment
module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'md'],
  moduleNameMapper,
  transform: {
    '\\.tsx?$': './tests/transformers/codeTransformer',
    '\\.js$': './tests/transformers/codeTransformer',
    '\\.md$': './tests/transformers/demoTransformer',
    '\\.(jpg|png|gif|svg)$': './tests/transformers/imageTransformer',
  },
  testRegex: 'check-site\\.(j|t)s$',
  testEnvironment: 'node',
  transformIgnorePatterns,
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.test.json',
    },
  },
};
