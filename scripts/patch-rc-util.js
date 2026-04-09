/**
 * Patches rc-util's render.js for React 19 compatibility.
 *
 * In React 19, `createRoot` was removed from `react-dom` and is only
 * available from `react-dom/client`. rc-util tries to get it from
 * `react-dom` which returns undefined, causing rendering to completely fail.
 *
 * This patch:
 * 1. Imports createRoot from react-dom/client
 * 2. Uses flushSync to ensure synchronous rendering (needed for imperative APIs)
 */
const fs = require('fs');
const path = require('path');

const renderPath = path.resolve(__dirname, '../node_modules/rc-util/lib/React/render.js');
const renderEsPath = path.resolve(__dirname, '../node_modules/rc-util/es/React/render.js');

function patchCJS(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('react-dom/client')) return; // already patched

  // Add react-dom/client import for createRoot
  content = content.replace(
    /var ReactDOM = _interopRequireWildcard\(require\("react-dom"\)\);/,
    'var ReactDOM = _interopRequireWildcard(require("react-dom"));\n' +
    'var _reactDomClient = require("react-dom/client");\n' +
    'var _flushSync = require("react-dom").flushSync;'
  );

  // Fix createRoot resolution: prefer react-dom/client
  content = content.replace(
    /createRoot = fullClone\.createRoot;/,
    'createRoot = _reactDomClient.createRoot || fullClone.createRoot;'
  );

  // Wrap root.render in flushSync for synchronous rendering
  content = content.replace(
    /root\.render\(node\);/g,
    '_flushSync(function() { root.render(node); });'
  );

  fs.writeFileSync(filePath, content);
  console.log('Patched:', filePath);
}

function patchESM(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('react-dom/client')) return; // already patched

  // Add react-dom/client import
  content = content.replace(
    /import \* as ReactDOM from 'react-dom';/,
    "import * as ReactDOM from 'react-dom';\n" +
    "import { createRoot as _createRootClient } from 'react-dom/client';\n" +
    "import { flushSync as _flushSync } from 'react-dom';"
  );

  // Fix createRoot resolution
  content = content.replace(
    /createRoot = fullClone\.createRoot;/,
    'createRoot = _createRootClient || fullClone.createRoot;'
  );

  // Wrap root.render in flushSync
  content = content.replace(
    /root\.render\(node\);/g,
    '_flushSync(function() { root.render(node); });'
  );

  fs.writeFileSync(filePath, content);
  console.log('Patched:', filePath);
}

patchCJS(renderPath);
patchESM(renderEsPath);
