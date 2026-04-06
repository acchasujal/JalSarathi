import { jalsarathiDB } from "../config/database.js";

// ─── Haversine distance (km) between two lat/lng points ────────────────────
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── Closest known city fallback by Haversine ──────────────────────────────
const KNOWN_CITIES = [
  { name: "Delhi",      lat: 28.6139, lon: 77.2090, rainfall: 800  },
  { name: "Mumbai",     lat: 19.0760, lon: 72.8777, rainfall: 2200 },
  { name: "Chennai",    lat: 13.0827, lon: 80.2707, rainfall: 1400 },
  { name: "Bangalore",  lat: 12.9716, lon: 77.5946, rainfall: 970  },
  { name: "Kolkata",    lat: 22.5726, lon: 88.3639, rainfall: 1800 },
  { name: "Hyderabad",  lat: 17.3850, lon: 78.4867, rainfall: 800  },
  { name: "Pune",       lat: 18.5204, lon: 73.8567, rainfall: 750  },
  { name: "Ahmedabad",  lat: 23.0225, lon: 72.5714, rainfall: 800  },
  { name: "Jaipur",     lat: 26.9124, lon: 75.7873, rainfall: 600  },
  { name: "Lucknow",    lat: 26.8467, lon: 80.9462, rainfall: 900  },
  { name: "Dehradun",   lat: 30.3165, lon: 78.0322, rainfall: 2100 },
  { name: "Shimla",     lat: 31.1048, lon: 77.1734, rainfall: 1500 },
  { name: "Guwahati",   lat: 26.1445, lon: 91.7362, rainfall: 1800 },
  { name: "Kochi",      lat: 9.9312,  lon: 76.2673, rainfall: 3100 },
  { name: "Bhopal",     lat: 23.2599, lon: 77.4126, rainfall: 1200 },
];

const findClosestCity = (lat, lon) => {
  let closest = KNOWN_CITIES[0];
  let minDist = haversineKm(lat, lon, closest.lat, closest.lon);
  for (const city of KNOWN_CITIES) {
    const d = haversineKm(lat, lon, city.lat, city.lon);
    if (d < minDist) {
      minDist = d;
      closest = city;
    }
  }
  return { ...closest, distanceKm: Math.round(minDist) };
};

// ─── Main export ───────────────────────────────────────────────────────────
export const fetchPreciseRainfall = async (lat, lon) => {
  console.log(`[weatherProvider] ▶ fetchPreciseRainfall called with lat=${lat}, lon=${lon}`);

  return new Promise(async (resolve) => {
    try {
      // 1. DB Cache: guard against uninitialized DB, then check for recent entry
      const searchPattern = `%${lat.toFixed(2)}%${lon.toFixed(2)}%`;
      const cacheQuery = `
        SELECT rainfall_mm 
        FROM rainwater_assessments 
        WHERE location LIKE ? 
        AND rainfall_mm IS NOT NULL
        AND created_at >= datetime('now', '-30 days')
        ORDER BY created_at DESC 
        LIMIT 1
      `;

      const runDbLookup = (callback) => {
        if (!jalsarathiDB.db || !jalsarathiDB.db.get) {
          console.log('[weatherProvider] DB not ready — skipping cache lookup');
          return callback(null, null);
        }
        jalsarathiDB.db.get(cacheQuery, [searchPattern], callback);
      };

      runDbLookup(async (err, row) => {
        if (!err && row && row.rainfall_mm > 0) {
          console.log(`[weatherProvider] ✅ DB cache hit → ${row.rainfall_mm}mm`);
          console.log(`[DB Cache] Hit for ${lat.toFixed(3)},${lon.toFixed(3)} → ${row.rainfall_mm}mm`);
          return resolve({
            rainfall: row.rainfall_mm,
            accuracyScore: 98,
            dataSource: "High Precision (DB Cache)",
          });
        }

        // 2. API: Try Visual Crossing with full prev-year historical data
        const apiKey = process.env.PRECISION_WEATHER_API_KEY;

        console.log(`[weatherProvider] API key present: ${!!apiKey}`);
        if (!apiKey) {
          // No key → Haversine fallback to closest known city
          const closest = findClosestCity(lat, lon);
          console.log(`[weatherProvider] ⚠️ No API key → Haversine fallback to ${closest.name} (${closest.distanceKm}km) → ${closest.rainfall}mm`);
          console.warn(`[No API Key] Closest city fallback: ${closest.name} (${closest.distanceKm}km away)`);
          return resolve({
            rainfall: closest.rainfall,
            accuracyScore: closest.distanceKm < 30 ? 75 : 60,
            dataSource: `Local Station Data (${closest.name}, ${closest.distanceKm}km)`,
          });
        }

        // Build date range: full previous year
        const now = new Date();
        const prevYear = now.getFullYear() - 1;
        const startDate = `${prevYear}-01-01`;
        const endDate = `${prevYear}-12-31`;

        const url =
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/` +
          `${lat},${lon}/${startDate}/${endDate}` +
          `?unitGroup=metric&include=days&elements=precip&key=${apiKey}&contentType=json`;

        console.log(`[Visual Crossing] Fetching annual precip for ${lat.toFixed(4)},${lon.toFixed(4)} (${prevYear})`);

        console.log(`[weatherProvider] 🌐 Calling Visual Crossing API...`);
        let response;
        try {
          response = await fetch(url);
        } catch (fetchErr) {
          // Network-level failure (DNS, timeout, etc.)
          console.warn(`[weatherProvider] ⚠️ Network error calling Visual Crossing:`, fetchErr.message);
          const closest = findClosestCity(lat, lon);
          return resolve({
            rainfall: closest.rainfall,
            accuracyScore: 65,
            dataSource: `Local Station (Network Error — ${closest.name})`,
          });
        }

        // 429 Rate-limit: resolve with a distinct signal — do NOT throw
        if (response.status === 429) {
          console.warn(`[weatherProvider] ⚠️ HTTP 429 — API rate limit hit for ${lat.toFixed(4)},${lon.toFixed(4)}`);
          return resolve({ rateLimited: true, rainfall: null });
        }

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Visual Crossing HTTP ${response.status}: ${errText.slice(0, 120)}`);
        }

        const data = await response.json();

        // 3. Sum all daily precip values for the year
        let annualPrecip = 0;
        if (data.days && data.days.length > 0) {
          annualPrecip = data.days.reduce((acc, day) => acc + (day.precip || 0), 0);
        }

        if (annualPrecip <= 0) {
          throw new Error("Visual Crossing returned zero or empty precipitation data");
        }

        const finalRainfall = parseFloat(annualPrecip.toFixed(1));
        console.log(`[weatherProvider] ✅ Visual Crossing success → ${finalRainfall}mm for ${lat.toFixed(4)},${lon.toFixed(4)}`);

        resolve({
          rainfall: finalRainfall,
          accuracyScore: 97,
          dataSource: "High Precision (Satellite Data)",
        });
      });

    } catch (error) {
      console.warn(`[weatherProvider] Failed for ${lat},${lon}:`, error.message);

      // API failed → Haversine fallback
      const closest = findClosestCity(lat, lon);
      console.warn(`[weatherProvider] ⚠️ API failed → Haversine fallback: ${closest.name} (${closest.distanceKm}km) → ${closest.rainfall}mm`);
      resolve({
        rainfall: closest.rainfall,
        accuracyScore: 75,
        dataSource: `Local Station Data (${closest.name}, ${closest.distanceKm}km)`,
      });
    }
  });
};
