import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'CharlesLeclercRedline/1.0' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

async function updateStats() {
  console.log('🏎️  Checking latest Charles Leclerc F1 records from Jolpica F1 API...');
  
  try {
    // 1. Fetch total wins
    const winsData = await fetchJson('https://api.jolpi.ca/ergast/f1/drivers/leclerc/results/1.json?limit=1');
    const totalWins = parseInt(winsData?.MRData?.total, 10);

    // 2. Fetch total podiums (position 1, 2, 3)
    const [p1, p2, p3] = await Promise.all([
      fetchJson('https://api.jolpi.ca/ergast/f1/drivers/leclerc/results/1.json?limit=1'),
      fetchJson('https://api.jolpi.ca/ergast/f1/drivers/leclerc/results/2.json?limit=1'),
      fetchJson('https://api.jolpi.ca/ergast/f1/drivers/leclerc/results/3.json?limit=1'),
    ]);

    const totalPodiums = (
      parseInt(p1?.MRData?.total || '0', 10) +
      parseInt(p2?.MRData?.total || '0', 10) +
      parseInt(p3?.MRData?.total || '0', 10)
    );

    console.log(`📊 Fetched records: Wins = ${totalWins}, Podiums = ${totalPodiums}`);

    if (isNaN(totalWins) || totalWins < 9) {
      console.log('⚠️  Data sanity check failed or incomplete response. Keeping existing records.');
      return;
    }

    // 3. Update src/data/charlesData.js
    const dataFilePath = path.join(rootDir, 'src/data/charlesData.js');
    let dataFile = fs.readFileSync(dataFilePath, 'utf8');

    dataFile = dataFile.replace(/wins:\s*"\d+"/, `wins: "${totalWins}"`);
    if (totalPodiums > 0) {
      dataFile = dataFile.replace(/podiums:\s*"\d+"/, `podiums: "${totalPodiums}"`);
    }

    fs.writeFileSync(dataFilePath, dataFile, 'utf8');
    console.log('✅ Updated src/data/charlesData.js');

    // 4. Update src/components/sections/StorytellingScroll.jsx
    const storyFilePath = path.join(rootDir, 'src/components/sections/StorytellingScroll.jsx');
    let storyFile = fs.readFileSync(storyFilePath, 'utf8');

    // Replace wins counter target and text
    const padWins = totalWins < 10 ? `0${totalWins}` : `${totalWins}`;
    storyFile = storyFile.replace(
      /data-target="\d+"\s*data-pad="true"\s*>\s*\d+\s*<\/span>\s*<span[^>]*>\s*Grand Prix Wins/m,
      `data-target="${totalWins}"\n                  data-pad="true"\n                >\n                  ${padWins}\n                </span>\n                <span className="text-neutral-400 font-mono-telemetry uppercase text-[11px] sm:text-xs">\n                  Grand Prix Wins`
    );

    if (totalPodiums > 0) {
      storyFile = storyFile.replace(
        /data-target="\d+"\s*data-pad="false"\s*>\s*\d+\s*<\/span>\s*<span[^>]*>\s*PODIUMS/m,
        `data-target="${totalPodiums}"\n                  data-pad="false"\n                >\n                  ${totalPodiums}\n                </span>\n                <span className="text-white font-racing uppercase tracking-tight text-base sm:text-lg lg:text-xl">\n                  PODIUMS`
      );
    }

    fs.writeFileSync(storyFilePath, storyFile, 'utf8');
    console.log('✅ Updated src/components/sections/StorytellingScroll.jsx');

  } catch (error) {
    console.error('❌ Failed to update F1 stats:', error.message);
    process.exitCode = 0; // Don't fail build/cron if external API is temporarily down
  }
}

updateStats();
