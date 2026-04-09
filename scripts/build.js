const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

const root = path.resolve(__dirname, '..');
const exec = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });

// Step 1: Clean
console.log('Cleaning output directories...');
['es', 'lib', 'dist'].forEach((dir) => {
  const p = path.join(root, dir);
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true });
});

// Step 2: Build ES modules
console.log('Building ES modules...');
exec(
  'npx babel components --out-dir es --extensions .ts,.tsx,.js,.jsx ' +
    '--ignore "**/__tests__/**,**/demo/**,**/*.test.ts,**/*.test.tsx,**/*.md"',
);

// Step 3: Build CommonJS modules
console.log('Building CommonJS modules...');
exec(
  'npx cross-env BABEL_MODULE=commonjs npx babel components --out-dir lib --extensions .ts,.tsx,.js,.jsx ' +
    '--ignore "**/__tests__/**,**/demo/**,**/*.test.ts,**/*.test.tsx,**/*.md"',
);

// Step 4: Generate type declarations
console.log('Generating type declarations...');
try {
  exec('npx tsc --project tsconfig.build.json --outDir es');
} catch (e) {
  // tsc may report pre-existing type errors but still emits .d.ts files
  console.warn('tsc exited with errors (declarations still emitted)');
}
// Copy .d.ts files from es/ to lib/
const dtsFiles = glob.sync('es/**/*.d.ts', { cwd: root });
dtsFiles.forEach((file) => {
  const dest = file.replace(/^es\//, 'lib/');
  const destDir = path.dirname(path.join(root, dest));
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(path.join(root, file), path.join(root, dest));
});
console.log(`Copied ${dtsFiles.length} .d.ts files to lib/`);

// Step 5: Copy .less files
console.log('Copying .less files...');
const lessFiles = glob.sync('components/**/*.less', { cwd: root });
lessFiles.forEach((file) => {
  const relPath = file.replace(/^components\//, '');
  ['es', 'lib'].forEach((outDir) => {
    const dest = path.join(root, outDir, relPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(root, file), dest);
  });
});
console.log(`Copied ${lessFiles.length} .less files`);

// Step 6: Generate dist/antd.css
console.log('Generating dist/antd.css...');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });

const componentStyleFiles = glob.sync('components/*/style/index.less', { cwd: root });
const lessImports = [
  "@import '../components/style/default.less';",
  ...componentStyleFiles.map((f) => `@import '../${f}';`),
].join('\n');

const tmpLess = path.join(root, 'dist', '_aggregate.less');
fs.writeFileSync(tmpLess, lessImports);

try {
  exec('npx lessc --js dist/_aggregate.less dist/antd.css');
} finally {
  fs.unlinkSync(tmpLess);
}

console.log('Build complete!');
