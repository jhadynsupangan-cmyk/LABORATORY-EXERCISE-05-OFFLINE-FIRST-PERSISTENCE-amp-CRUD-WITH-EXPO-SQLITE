// Metro configuration for the Mochito app.
//
// `expo/metro-config` provides the Expo defaults: TypeScript + SVG
// transformers, platform file extensions and monorepo support.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// This project lives inside a OneDrive folder, so its files are often cloud
// placeholders. The Windows watcher reports those placeholders with file type
// "l" (symlink), which makes `@expo/metro-file-map` call `readlink()` on them —
// and `readlink()` on a placeholder throws `EINVAL`, killing the dev server with
// "Failed to construct transformer".
//
// Expo already excludes `.expo/types` and `.expo/web/cache` for unrelated
// reasons; exclude the rest of the `.expo` CLI state directory (devices.json,
// settings.json, caches) for this one. Nothing in the app resolves modules from
// `.expo`, so this is safe. See AGENTS.md > Troubleshooting.
config.resolver.blockList = [...config.resolver.blockList, /[\\/]\.expo[\\/]/];

module.exports = config;