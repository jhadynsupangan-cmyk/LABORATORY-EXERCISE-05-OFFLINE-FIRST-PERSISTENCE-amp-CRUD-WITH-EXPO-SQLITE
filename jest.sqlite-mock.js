/* eslint-env jest */

/**
 * In-memory stand-in for `expo-sqlite`, used by the test suite.
 *
 * This is deliberately not a SQL engine. It recognises exactly the statements
 * `src/services/db.ts` issues and throws on anything else, so editing that
 * module's SQL without updating this mock fails loudly instead of quietly
 * passing the suite with a fake that does not match production behaviour.
 *
 * The store is a module-level singleton keyed by database name, mirroring a
 * real on-device database that outlives the React tree — which is what the
 * persistence tests rely on when they unmount and re-render.
 */

const stores = new Map();

function createStore() {
  return {
    user_version: 0,
    cart_lines: [],
    favorites: [],
    orders: [],
    user_profile: [],
    app_kv: [],
    // Second database (`pos_inventory.db`) for the Lab 05 POS screen.
    products: [],
    // SQLite's AUTOINCREMENT keeps a monotonic counter in `sqlite_sequence` and
    // never reuses an id, even after every row is deleted. Tracking it here
    // stops the mock quietly disagreeing with the real database.
    _sequences: { products: 0 },
  };
}

function storeFor(name) {
  if (!stores.has(name)) {
    stores.set(name, createStore());
  }
  return stores.get(name);
}

/** Collapse whitespace so line-wrapped SQL compares the same as single-line. */
function normalize(sql) {
  return String(sql)
    .replace(/\s+/g, ' ')
    .trim()
    // The Lab 05 module writes trailing semicolons; the shop layer does not.
    .replace(/;+$/, '')
    .trim();
}

let nextId = 1;

function insertRow(rows, row) {
  // `INTEGER PRIMARY KEY AUTOINCREMENT`: ids ascend in insertion order, which is
  // what `ORDER BY id ASC` / `ORDER BY id DESC` rely on.
  const stored = { id: nextId++, ...row };
  rows.push(stored);
  return stored;
}

function replaceByKey(rows, keyField, row) {
  const index = rows.findIndex((existing) => existing[keyField] === row[keyField]);
  if (index >= 0) {
    rows[index] = { ...rows[index], ...row };
    return rows[index];
  }
  return insertRow(rows, row);
}

function openDatabaseSync(name) {
  // Resolved per call rather than captured, so `__reset()` takes effect even on
  // a handle the app cached during an earlier test.
  const db = () => storeFor(name);

  return {
    execSync(sql) {
      const store = db();
      const text = normalize(sql);
      const version = text.match(/^PRAGMA user_version = (\d+)$/i);
      if (version) {
        store.user_version = Number(version[1]);
        return;
      }
      // Schema creation, `journal_mode` and `foreign_keys`. Tables are implicit
      // here, so there is nothing to do.
      if (/^(PRAGMA (journal_mode|foreign_keys)|CREATE TABLE)/i.test(text)) return;
      throw new Error(`expo-sqlite mock: unsupported execSync: ${text}`);
    },

    runSync(sql, params = []) {
      const store = db();
      const text = normalize(sql);
      const args = Array.isArray(params) ? params : [params];

      if (/^INSERT OR REPLACE INTO cart_lines/i.test(text)) {
        insertRow(store.cart_lines, {
          key: args[0],
          product_id: args[1],
          name: args[2],
          center: args[3],
          tone: args[4],
          price: args[5],
          quantity: args[6],
        });
        return { lastInsertRowId: 0, changes: 1 };
      }

      if (/^INSERT OR IGNORE INTO favorites/i.test(text)) {
        if (!store.favorites.some((row) => row.product_id === args[0])) {
          insertRow(store.favorites, { product_id: args[0] });
        }
        return { lastInsertRowId: 0, changes: 1 };
      }

      if (/^INSERT OR REPLACE INTO orders/i.test(text)) {
        insertRow(store.orders, {
          order_number: args[0],
          created_at: args[1],
          lines: args[2],
          subtotal: args[3],
          pickup_fee: args[4],
          total: args[5],
          payment_method: args[6],
          pickup_store: args[7],
          pickup_address: args[8],
          pickup_time: args[9],
          ready_at: args[10],
          note: args[11],
          status: args[12],
          confirmed_at: args[13],
        });
        return { lastInsertRowId: 0, changes: 1 };
      }

      if (/^INSERT OR REPLACE INTO user_profile/i.test(text)) {
        replaceByKey(store.user_profile, 'id', {
          id: 1,
          name: args[0],
          phone: args[1],
          address: args[2],
        });
        return { lastInsertRowId: 0, changes: 1 };
      }

      if (/^INSERT OR REPLACE INTO app_kv/i.test(text)) {
        replaceByKey(store.app_kv, 'key', { key: args[0], value: args[1] });
        return { lastInsertRowId: 0, changes: 1 };
      }

      const deleteMatch = text.match(/^DELETE FROM (\w+)$/i);
      if (deleteMatch) {
        const rows = store[deleteMatch[1]];
        if (!rows) throw new Error(`expo-sqlite mock: unknown table ${deleteMatch[1]}`);
        const changes = rows.length;
        rows.length = 0;
        return { lastInsertRowId: 0, changes };
      }

      // --- Lab 05 inventory table ---

      if (/^INSERT INTO products \(name, category, price, stock\)/i.test(text)) {
        store._sequences.products += 1;
        const id = store._sequences.products;
        store.products.push({
          id,
          name: args[0],
          category: args[1],
          price: args[2],
          stock: args[3],
        });
        return { lastInsertRowId: id, changes: 1 };
      }

      if (/^DELETE FROM products WHERE id = \?$/i.test(text)) {
        const index = store.products.findIndex((row) => row.id === args[0]);
        if (index >= 0) store.products.splice(index, 1);
        return { lastInsertRowId: 0, changes: index >= 0 ? 1 : 0 };
      }

      if (/^UPDATE products SET stock = MAX\(0, stock \+\ \?\) WHERE id = \?$/i.test(text)) {
        const row = store.products.find((candidate) => candidate.id === args[1]);
        if (row) row.stock = Math.max(0, row.stock + args[0]);
        return { lastInsertRowId: 0, changes: row ? 1 : 0 };
      }

      throw new Error(`expo-sqlite mock: unsupported runSync: ${text}`);
    },

    getFirstSync(sql, params = []) {
      const store = db();
      const text = normalize(sql);
      const args = Array.isArray(params) ? params : [params];

      if (/^PRAGMA user_version$/i.test(text)) {
        return { user_version: store.user_version };
      }

      const countMatch = text.match(/^SELECT COUNT\(\*\) AS count FROM (\w+)$/i);
      if (countMatch) {
        const rows = store[countMatch[1]];
        if (!rows) throw new Error(`expo-sqlite mock: unknown table ${countMatch[1]}`);
        return { count: rows.length };
      }

      if (/FROM cart_lines/i.test(text)) {
        const row = store.cart_lines.find((candidate) => candidate.key === args[0]);
        return row ?? null;
      }

      if (/FROM user_profile WHERE id = 1$/i.test(text)) {
        return store.user_profile.find((row) => row.id === 1) ?? null;
      }

      if (/FROM app_kv WHERE key = \?$/i.test(text)) {
        return store.app_kv.find((row) => row.key === args[0]) ?? null;
      }

      throw new Error(`expo-sqlite mock: unsupported getFirstSync: ${text}`);
    },

    getAllSync(sql, params = []) {
      const store = db();
      const text = normalize(sql);

      // Generic escape hatch so a test can inspect a whole table directly,
      // rather than only through the projections `db.ts` issues.
      const allMatch = text.match(/^SELECT \* FROM (\w+)$/i);
      if (allMatch) {
        const rows = store[allMatch[1]];
        if (!rows) throw new Error(`expo-sqlite mock: unknown table ${allMatch[1]}`);
        return rows.map((row) => ({ ...row }));
      }

      if (/FROM cart_lines ORDER BY id ASC$/i.test(text)) {
        return store.cart_lines.map((row) => ({ ...row }));
      }

      if (/FROM favorites ORDER BY id ASC$/i.test(text)) {
        return store.favorites.map((row) => ({ ...row }));
      }

      if (/FROM orders ORDER BY id DESC$/i.test(text)) {
        return [...store.orders].reverse().map((row) => ({ ...row }));
      }

      // --- Lab 05 inventory reads ---

      if (/^SELECT \* FROM products ORDER BY id DESC$/i.test(text)) {
        return [...store.products].reverse().map((row) => ({ ...row }));
      }

      if (/^SELECT \* FROM products WHERE name LIKE \? ORDER BY name ASC$/i.test(text)) {
        // `params[0]` arrives wrapped as `%query%`; match the substring inside.
        const needle = String(params[0] ?? '')
          .replace(/^%/, '')
          .replace(/%$/, '');
        return store.products
          .filter((row) => row.name.toLowerCase().includes(needle.toLowerCase()))
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((row) => ({ ...row }));
      }

      throw new Error(`expo-sqlite mock: unsupported getAllSync: ${text}`);
    },

    withTransactionSync(task) {
      const store = db();
      // Real SQLite would roll back on a throw. Snapshotting keeps the mock
      // honest if an insert fails part-way through a save.
      const backup = JSON.stringify(store);
      try {
        task();
      } catch (error) {
        const restored = JSON.parse(backup);
        for (const key of Object.keys(store)) delete store[key];
        Object.assign(store, restored);
        throw error;
      }
    },

    closeSync() {},
  };
}

module.exports = {
  openDatabaseSync,
  /**
   * Drops every database, so each test starts from an empty store — the
   * equivalent of a cold app launch on a device with no Mochito data.
   */
  __reset() {
    stores.clear();
    nextId = 1;
  },
  // Exposed so a suite can assert on persisted rows directly if it needs to.
  __stores: stores,
};