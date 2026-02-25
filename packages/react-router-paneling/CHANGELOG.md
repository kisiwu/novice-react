# Changelog

## Unreleased

### Features

- **usePanelNav**: Added `usePanelNav` hook for programmatic navigation between panels, providing a `navigate` function that accepts a target path and options for navigation behavior (e.g., replace, state).
- **README updates**: Updated README note on Framework Mode: Define the panel configuration object **at module scope** (outside `clientLoader`) to ensure it is shared across all instances of the loader, allowing for consistent panel definitions and behavior across the application. Added usePanelNav documentation and example.

## 1.0.0 (2026-02-22)

### Features

- **extrasSeparator**: Added `extrasSeparator` option to `createPaneling` and `createClientLoader` configuration, allowing customization of the character used to separate panel segments (name, ID, and extras) in URL paths. Defaults to `:`.
- **extras key-value format**: Panel URL segments now support standard key-value pairs using `=` (e.g., `/panel:id:key=value`). Keys without a value default to an empty string.
- **useLoaderData**: Exposed `extrasSeparator` through `useLoaderData` for client-side components.

### Documentation

- Added JSDoc comments to exported functions and types (`createRouteObject`, `createPaneling`, `createClientLoader`, `ClientLoaderArgs`, `Paneling`, `usePaneling`).
- Updated README with install instructions, overview section, extrasSeparator and extras documentation, and improved structure.
