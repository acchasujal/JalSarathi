import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to convert SQLite ? to Postgres $1, $2, etc.
const convertQueryForPg = (sql) => {
  let i = 1;
  return sql.replace(/\?/g, () => `$${i++}`);
};

class JalSarathiDatabase {
  constructor() {
    this.driver = null;
    this.type = process.env.DATABASE_URL ? 'postgres' : 'sqlite';
    this.db = {
      // Wrapper for db.run
      run: (sql, params, callback) => {
        if (typeof params === 'function') {
          callback = params;
          params = [];
        }
        if (this.type === 'postgres') {
          this.driver.query(convertQueryForPg(sql), params || [])
            .then(res => callback?.call({ lastID: res.rows?.[0]?.id || 0, changes: res.rowCount }, null))
            .catch(err => callback?.call(null, err));
        } else {
          this.driver.run(sql, params || [], callback);
        }
      },
      // Wrapper for db.all
      all: (sql, params, callback) => {
        if (typeof params === 'function') {
          callback = params;
          params = [];
        }
        if (this.type === 'postgres') {
          this.driver.query(convertQueryForPg(sql), params || [])
            .then(res => callback?.(null, res.rows))
            .catch(err => callback?.(err, null));
        } else {
          this.driver.all(sql, params || [], callback);
        }
      },
      // Wrapper for db.get
      get: (sql, params, callback) => {
        if (typeof params === 'function') {
          callback = params;
          params = [];
        }
        if (this.type === 'postgres') {
          this.driver.query(convertQueryForPg(sql), params || [])
            .then(res => callback?.(null, res.rows[0]))
            .catch(err => callback?.(err, null));
        } else {
          this.driver.get(sql, params || [], callback);
        }
      }
    };
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.type === 'postgres') {
        const { Pool } = pg;
        this.driver = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        });
        
        this.driver.connect()
          .then(() => {
            console.log('🐘 Connected to JalSarathi PostgreSQL database');
            resolve(this.db);
          })
          .catch(err => {
            console.error('Error connecting to Postgres:', err);
            reject(err);
          });
      } else {
        const dbPath = process.env.DB_PATH || join(__dirname, '../data/jalsarathi.db');
        this.driver = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            console.error('Error opening JalSarathi database:', err);
            reject(err);
          } else {
            console.log('✅ Connected to JalSarathi SQLite database format');
            resolve(this.db);
          }
        });
      }
    });
  }

  initialize() {
    return new Promise((resolve, reject) => {
      // Postgres requires SERIAL instead of INTEGER PRIMARY KEY AUTOINCREMENT
      const autoInc = this.type === 'postgres' ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
      const dateTime = this.type === 'postgres' ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'DATETIME DEFAULT CURRENT_TIMESTAMP';

      const queries = [
        `CREATE TABLE IF NOT EXISTS rainwater_assessments (
          id ${autoInc},
          location TEXT NOT NULL,
          rooftop_area REAL NOT NULL,
          building_type TEXT NOT NULL,
          household_members INTEGER,
          location_type TEXT CHECK(location_type IN ('urban', 'rural')),
          rainfall_mm REAL,
          harvestable_water REAL,
          annual_savings REAL,
          system_cost REAL,
          payback_period REAL,
          created_at ${dateTime}
        )`,
        
        `CREATE TABLE IF NOT EXISTS water_quality_tests (
          id ${autoInc},
          location TEXT NOT NULL,
          lead_concentration REAL,
          arsenic_concentration REAL,
          mercury_concentration REAL,
          hpi_score REAL,
          safety_level TEXT,
          created_at ${dateTime}
        )`,
        
        `CREATE TABLE IF NOT EXISTS subsidies (
          id ${autoInc},
          scheme_name TEXT NOT NULL,
          location_type TEXT CHECK(location_type IN ('urban', 'rural')),
          min_area REAL,
          percentage REAL,
          description TEXT
        )`,

        `CREATE TABLE IF NOT EXISTS vendors (
          id ${autoInc},
          name TEXT NOT NULL,
          city TEXT NOT NULL,
          phone TEXT,
          rating REAL
        )`,

        `CREATE TABLE IF NOT EXISTS locations (
          id ${autoInc},
          name TEXT NOT NULL UNIQUE,
          rainfall REAL NOT NULL,
          type TEXT CHECK(type IN ('urban', 'rural', 'semi-arid'))
        )`
      ];

      let completed = 0;
      queries.forEach(query => {
        // We bypass the wrapper here because schema changes don't easily map between syntax
        // DB-specific nuances handled directly above via string interpolation
        if (this.type === 'postgres') {
           this.driver.query(query).then(() => {
             completed++;
             if (completed === queries.length) resolve();
           }).catch(reject);
        } else {
           this.driver.run(query, (err) => {
             if (err) reject(err);
             completed++;
             if (completed === queries.length) {
               console.log('✅ JalSarathi database schemas initialized');
               resolve();
             }
           });
        }
      });
    });
  }
}

export const jalsarathiDB = new JalSarathiDatabase();

export const initDatabase = async () => {
  await jalsarathiDB.connect();
  await jalsarathiDB.initialize();
};