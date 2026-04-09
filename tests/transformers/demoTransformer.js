const { transformSync } = require('@babel/core');

module.exports = {
  process(src, filename) {
    // Extract code blocks from markdown demo files
    const codeBlockRegex = /```[jt]sx?\s*\n([\s\S]*?)```/g;
    const blocks = [];
    let match;
    while ((match = codeBlockRegex.exec(src)) !== null) {
      blocks.push(match[1]);
    }

    if (blocks.length === 0) {
      return { code: 'module.exports = {};' };
    }

    // Use the last JSX/TSX code block (skip CSS blocks)
    let code = '';
    for (let i = blocks.length - 1; i >= 0; i--) {
      if (blocks[i].match(/import\s|export\s|function\s|const\s|class\s/)) {
        code = blocks[i];
        break;
      }
    }
    if (!code) code = blocks[blocks.length - 1];

    // Ensure React is imported for classic JSX transform
    if (!code.includes("import React") && !code.includes("require('react')")) {
      code = "import React from 'react';\n" + code;
    }

    // Compile the extracted code through babel
    const result = transformSync(code, {
      filename: filename.replace(/\.md$/, '.tsx'),
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }],
        ['@babel/preset-react', { runtime: 'classic' }],
        '@babel/preset-typescript',
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-transform-class-properties', { loose: true }],
      ],
    });

    return { code: result.code };
  },
};
