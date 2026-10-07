This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Persistence

State that must survive a restart lives in SQLite (`expo-sqlite`), not AsyncStorage. There are **two separate databases**, deliberately:

- **`mochito.db`** (`src/services/db.ts`) — the shop: basket, favourites, orders, profile. Also owns the one-time import of data from pre-SQLite installs.
- **`pos_inventory.db`** (`src/services/inventoryDb.ts`) — the Lab 05 POS stock screen. Its own `products` table, kept apart so neither schema constrains the other.

Shared conventions:

- `src/services/repo.ts` — the app-facing API for the shop: `loadSnapshot()` plus one `save*` per concern. The inventory module exposes its own `listProducts` / `addProduct` / `deleteProduct` / `adjustStock`.
- `src/utils/sanitize.ts` — validation applied to everything read back from `mochito.db`, so a bad row can never reach a screen.
- `src/utils/storage.ts` — **legacy**. AsyncStorage is read once, on first launch, to import an earlier install's data, then those keys are deleted. Never write new data here.

Three rules that are easy to break:

1. Adding a statement means adding it to `SQL` (or the inventory module) **and** to `jest.sqlite-mock.js`. The mock throws on anything it does not recognise, so the two cannot drift apart silently.
2. Run `__tests__/sql.test.ts` and `__tests__/inventorySql.test.ts` after any schema change. They execute the real SQL on Node's built-in SQLite and are the only thing proving the mock matches reality.
3. Never assume ids are contiguous. `AUTOINCREMENT` keeps a monotonic counter in `sqlite_sequence` and never reuses an id, even after every row is deleted.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Troubleshooting

### `Unable to resolve module "expo" from index.ts`

This project lives inside OneDrive. When Files On-Demand turns `node_modules`
into cloud placeholders, the files carry the `ReparsePoint` attribute. Node
resolves through those transparently, but Metro's file-map crawler skips
reparse points, so packages silently fail to resolve. The error names the
module, not the cause.

Tell whether it is this problem with:

```powershell
(Get-Item node_modules\expo -Force).Attributes   # ReparsePoint => this is it
```

Fix by pinning the tree to local disk, then clear Metro's caches:

```powershell
attrib +P -U "<project root>"
Remove-Item -Recurse -Force .expo, node_modules\.cache -ErrorAction SilentlyContinue
npx expo start --clear
```

Equivalently, right-click the project in OneDrive and choose
"Always keep on this device". A warm Metro cache masks the problem, so a
passing build after a restart is not proof it is fixed — verify with a cold
`.expo` + `node_modules\.cache`, or move the project outside OneDrive.

### `Failed to construct transformer: EINVAL ... readlink '.expo/devices.json'`

Same OneDrive cause, different symptom. The Windows watcher reports a cloud
placeholder with file type `"l"` (symlink), so `@expo/metro-file-map` calls
`readlink()` on it — which throws `EINVAL` on a placeholder and kills the dev
server while it is still starting up.

`metro.config.js` already excludes the `.expo` CLI state directory from Metro's
crawl (`config.resolver.blockList`, which Metro feeds to the crawler as its
`ignorePattern`). If you ever remove that override, this error returns.

Pinning the tree fixes module resolution but *not* this one, because a pinned
file is still a reparse point. The durable fix is moving the project outside
OneDrive.

Expect slow startup (several minutes for the first bundle) for the same reason:
Metro crawls the whole OneDrive-backed tree. Later rebuilds are fast.

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
