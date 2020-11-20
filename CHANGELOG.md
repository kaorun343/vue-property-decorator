Changelog

# v9.1.2

## Bug fixes

- Fix `typings` field in `package.json` (#356)

# v9.1.1

## Bug fixes

- Fix `main` and `module` field in `package.json`

# v9.1.0

## New features

- Add `@ModelSync` decorator (#254)
- Add `@VModel` decorator (#276)

## Bug fixes

- Make reactive provided values configureable (#330)

## Refactoring / others

- **Breaking change** Rename `vue-property-decorator.ts` to `index.ts` (c8c88642f589c8cb1a2f3a09034a01b17152bae7)
  - Exported files are also renamed from `vue-property-decorator.*` to `index.*`
- Split source code into separate files (d7954f8ca1a729a53da207317139fc76cefe98b2)
- Bump dependency versions

# v9.0.2

# v9.0.1 (Failed to publish to npm)

- Fix ProvideReactive (#328)
- Fix README.md (#329)

# v9.0.0

- Move `vue-class-component` to `peerDependencies`

# v8.5.1

- Move `vue-class-component` to `dependencies`

# v8.5.0

- Revert #299
- Add CHANGELOG.md
- Fix README.md (#319)
- Move `vue-class-component` to `peerDependencies`
