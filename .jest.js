const transformIgnorePatterns = [
  // Ignore modules without es dir.
  // Update: @babel/runtime should also be transformed
  '/node_modules/(?!array-move|react-dnd|react-dnd-html5-backend|@react-dnd|dnd-core|tween-one|@babel|@ant-design)[^/]+?/(?!(es)/)',
];

function getTestRegex(libDir) {
  if (libDir === 'dist') {
    return 'demo\\.test\\.(j|t)s$';
  }
  return '.*\\.test\\.(j|t)sx?$';
}

module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  setupFiles: ['./tests/setup.js'],
  setupFilesAfterEnv: ['./tests/setupAfterEnv.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'md'],
  modulePathIgnorePatterns: ['/_site/'],
  moduleNameMapper: {
    '/\\.(css|less)$/': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', 'dekko', 'node', 'image.test.js', 'image.test.ts'],
  transform: {
    '\\.tsx?$': './tests/transformers/codeTransformer',
    '\\.(m?)js$': './tests/transformers/codeTransformer',
    '\\.md$': './tests/transformers/demoTransformer',
    '\\.(jpg|png|gif|svg)$': './tests/transformers/imageTransformer',
  },
  testRegex: getTestRegex(process.env.LIB_DIR),
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    '!components/*/style/index.tsx',
    '!components/style/index.tsx',
    '!components/*/locale/index.tsx',
    '!components/*/__tests__/type.test.tsx',
    '!components/**/*/interface.{ts,tsx}',
    '!components/*/__tests__/image.test.{ts,tsx}',
    '!components/__tests__/node.test.tsx',
  ],
  transformIgnorePatterns,
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test.json',
    },
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
};
