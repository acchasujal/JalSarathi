import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class JalSarathiDatabase {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const dbPath = process.env.DB_PATH || join(__dirname, '../data/jalsarathi.db');
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening JalSarathi database:', err);
          reject(err);
        } else {
          console.log('✅ Connected to JalSarathi SQLite database');
          resolve(this.db);
        }
      });
    });
  }

  initialize() {
    return new Promise((resolve, reject) => {
      const queries = [
        `CREATE TABLE IF NOT EXISTS rainwater_assessments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
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
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        
        `CREATE TABLE IF NOT EXISTS water_quality_tests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          location TEXT NOT NULL,
          lead_concentration REAL,
          arsenic_concentration REAL,
          mercury_concentration REAL,
          hpi_score REAL,
          safety_level TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        
        `CREATE TABLE IF NOT EXISTS subsidies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          scheme_name TEXT NOT NULL,
          location_type TEXT CHECK(location_type IN ('urban', 'rural')),
          min_area REAL,
          percentage REAL,
          description TEXT
        )`
      ];

      let completed = 0;
      queries.forEach(query => {
        this.db.run(query, (err) => {
          if (err) {
            console.error('Error creating table:', err);
            reject(err);
          }
          completed++;
          if (completed === queries.length) {
            console.log('✅ JalSarathi database tables initialized');
            resolve();
          }
        });
      });
    });
  }
}

export const jalsarathiDB = new JalSarathiDatabase();

export const initDatabase = async () => {
  await jalsarathiDB.connect();
  await jalsarathiDB.initialize();
};