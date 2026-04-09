# Ant Design v4 -- React 19 Fork

A fork of [Ant Design v4.24.16](https://github.com/ant-design/ant-design/tree/4.x-stable) with React 19 support.

The upstream Ant Design v4 only supports React 16-18. This fork patches the library and its build system so it runs in React 19 applications, while keeping full backwards compatibility with earlier React versions.

## Install

Install from the git repository:

```bash
npm install github:whatwedo/less-ants-design#master
```

Or with a specific commit/tag:

```bash
npm install github:whatwedo/less-ants-design#<commit-or-tag>
```

> **Note:** The package name in `package.json` is still `antd`, so all import paths work identically to the original.

## Usage

```jsx
import { Button, DatePicker } from 'antd';
import 'antd/dist/antd.css';

const App = () => (
  <>
    <Button type="primary">PRESS ME</Button>
    <DatePicker placeholder="select date" />
  </>
);
```

Import paths are unchanged from upstream antd v4:

- `antd` -- main entry
- `antd/es/...` -- ES modules (tree-shakeable)
- `antd/lib/...` -- CommonJS
- `antd/dist/antd.css` -- pre-built CSS (no LESS compiler needed)

## Migrating from original Ant Design v4

This is a **drop-in replacement**. No component API changes were made. The same props, the same components, the same CSS class names.

### What you need to do

1. **Replace the dependency** -- swap `antd` for this fork in your `package.json` (see Install above).

2. **Ensure React 19 types** -- if you use TypeScript, install `@types/react@^19` and `@types/react-dom@^19`. React 19 types have breaking changes:
   - `ReactElement` props default to `unknown` instead of `any`. If your code accesses `.props` on a ReactElement, cast it: `(element as ReactElement<any>).props`.
   - `useRef<T>()` without an argument is an error. Pass `useRef<T>(null)` or `useRef<T>(undefined)`.
   - `RefObject<T>` now includes `null`: `RefObject<T | null>`.

3. **Replace `react-dom/test-utils`** -- if your tests import from `react-dom/test-utils`:
   - `import { act } from 'react-dom/test-utils'` becomes `import { act } from 'react'`
   - `Simulate` is removed; use `fireEvent` from `@testing-library/react` instead

### What you do NOT need to do

- No changes to import paths
- No changes to component props or usage
- No changes to CSS imports or LESS variables
- No changes to locale/i18n setup

## What changed in this fork

- **Build system**: replaced `@ant-design/tools` with a babel + tsc + lessc pipeline
- **React 19 type fixes**: ~55 component files updated for `@types/react@19`
- **Test infrastructure**: migrated from `react-dom/test-utils` to `@testing-library/react`
- **rc-util patch**: a `postinstall` script patches `rc-util` to import `createRoot` from `react-dom/client` (React 19 removed it from `react-dom`) and wraps rendering in `flushSync` for imperative APIs (message, notification, modal.confirm)
- **rc-* packages**: minor version bumps within current major lines

No `rc-*` packages were upgraded across major versions. No component APIs were changed.

## Development

```bash
git clone <this-repo>
cd <this-repo>
npm install
npm run build    # produces es/, lib/, dist/antd.css
npm test         # runs jest test suite
npm run tsc      # type-check without emit
```

## License

MIT
