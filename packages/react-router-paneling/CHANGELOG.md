# Changelog

## 1.0.0 (2026-02-21)

### Features

- **separator**: Added `separator` option to `createPaneling` and `createClientLoader` configuration, allowing customization of the character used to separate panel segments (name, ID, and extras) in URL paths. Defaults to `:`.
- **extras key-value format**: Panel URL segments now support standard key-value pairs using `=` (e.g., `/panel:id:key=value`). Keys without a value default to an empty string.

### Documentation

- Added JSDoc comments to exported functions and types (`createRouteObject`, `createPaneling`, `createClientLoader`, `ClientLoaderArgs`, `Paneling`, `usePaneling`).
- Updated README with install instructions, overview section, separator and extras documentation, and improved structure.
