import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Canonical mapping between Ergast/Jolpica circuitId and local circuit names
const CIRCUIT_MAP = {
  albert_park: 'Albert Park Circuit',
  shanghai: 'Shanghai International Circuit',
  suzuka: 'Suzuka International Racing Course',
  bahrain: 'Bahrain International Circuit',
  jeddah: 'Jeddah Corniche Circuit',
  miami: 'Miami International Autodrome',
  imola: 'Autodromo Enzo e Dino Ferrari',
  monaco: 'Circuit de Monaco',
  catalunya: 'Circuit de Barcelona-Catalunya',
  madring: 'Circuit de Barcelona-Catalunya', // fallback / alternate venue
  villeneuve: 'Circuit Gilles Villeneuve',
  red_bull_ring: 'Red Bull Ring',
  silverstone: 'Silverstone Circuit',
  spa: 'Circuit de Spa-Francorchamps',
  hungaroring: 'Hungaroring',
  zandvoort: 'Circuit Zandvoort',
  monza: 'Autodromo Nazionale Monza',
  baku: 'Baku City Circuit',
  marina_bay: 'Marina Bay Street Circuit',
  americas: 'Circuit of the Americas',
  rodriguez: 'Autódromo Hermanos Rodríguez',
  interlagos: 'Autódromo José Carlos Pace',
  vegas: 'Las Vegas Strip Circuit',
  losail: 'Lusail International Circuit',
  yas_marina: 'Yas Marina Circuit',
};

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'CharlesLeclercRedline/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function updateCalendar() {
  console.log('🗓️  Checking latest Formula 1 calendar from Jolpica F1 API...');

  try {
    const calendarData = await fetchJson('https://api.jolpi.ca/ergast/f1/current.json');
    const races = calendarData?.MRData?.RaceTable?.Races;

    if (!Array.isArray(races) || races.length < 15) {
      console.log('⚠️  Incomplete calendar data received. Keeping existing schedule.');
      return;
    }

    const calendarFilePath = path.join(rootDir, 'src/data/f1Calendar.js');
    let calendarContent = fs.readFileSync(calendarFilePath, 'utf8');

    let updatedCount = 0;
    const updateLog = [];
    const updatedCircuits = new Set();

    for (const race of races) {
      const circuitId = race.Circuit?.circuitId;
      const targetCircuit = CIRCUIT_MAP[circuitId];

      if (!targetCircuit || updatedCircuits.has(targetCircuit)) {
        continue;
      }

      // Format ISO 8601 datetime: e.g. "2026-03-08T04:00:00Z"
      const newIsoDate = race.time ? `${race.date}T${race.time}` : `${race.date}T14:00:00Z`;

      // Safely find and replace only the raceDate for this specific circuit block
      // to preserve SVG paths, viewBox, strokeWidth, and structure
      const escapedCircuit = targetCircuit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const circuitBlockRegex = new RegExp(
        `("circuit":\\s*"${escapedCircuit}"[\\s\\S]*?"raceDate":\\s*")[^"]+(")`
      );

      const match = calendarContent.match(circuitBlockRegex);
      if (match) {
        const currentIsoDate = calendarContent.substring(
          match.index + match[1].length,
          match.index + match[0].length - match[2].length
        );

        if (currentIsoDate !== newIsoDate) {
          calendarContent = calendarContent.replace(
            circuitBlockRegex,
            `$1${newIsoDate}$2`
          );
          updatedCount++;
          updateLog.push({
            circuit: targetCircuit,
            oldDate: currentIsoDate,
            newDate: newIsoDate,
          });
        }
        updatedCircuits.add(targetCircuit);
      }
    }

    if (updatedCount > 0) {
      fs.writeFileSync(calendarFilePath, calendarContent, 'utf8');
      console.log(`✅ Successfully updated ${updatedCount} race date(s) in src/data/f1Calendar.js:`);
      updateLog.forEach(({ circuit, oldDate, newDate }) => {
        console.log(`   - ${circuit}: ${oldDate} ➜ ${newDate}`);
      });
    } else {
      console.log('✨ F1 calendar is already fully up to date with official FIA records.');
    }
  } catch (error) {
    console.error('❌ Failed to update F1 calendar:', error.message);
    process.exitCode = 0; // Don't fail workflow if API is temporarily unavailable
  }
}

// Allow direct execution via CLI `node scripts/update-calendar.mjs`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateCalendar();
}
