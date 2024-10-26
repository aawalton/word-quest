import { getSeriesHtml } from './get-series-html.js';
import { getSeriesJson } from './get-series-json.js';
import { getChaptersHtml } from './get-chapters-html.js';
import { getChaptersJson } from './get-chapters-json.js';
import { countWordsInJsonFiles } from '../progress/word-count.js';
import { calculateTotalWordCount } from '../progress/total-word-count.js';
import { calculateLevelInfo } from '../progress/level.js';

async function syncTheWanderingInn() {
  try {
    console.log('Starting TWI sync process...');

    console.log('Downloading table of contents...');
    await getSeriesHtml();

    console.log('Parsing table of contents...');
    await getSeriesJson();

    console.log('Downloading chapters...');
    await getChaptersHtml();

    console.log('Parsing chapters...');
    await getChaptersJson();

    console.log('Calculating word counts...');
    await countWordsInJsonFiles('./data');

    console.log('Calculating total word count...');
    const totalWordCount = await calculateTotalWordCount();
    console.log(`Total word count: ${totalWordCount}`);

    console.log('Calculating level info...');
    const levelInfo = await calculateLevelInfo();
    console.log(`\nCurrent level: ${levelInfo.currentLevel}`);
    console.log(`Total XP: ${levelInfo.totalXp}`);
    console.log(`XP needed for next level: ${levelInfo.xpNeededForNextLevel}`);
    console.log(`XP gained for next level: ${levelInfo.xpGainedTowardsNextLevel}`);
    console.log(`Progress towards next level: ${levelInfo.percentProgressToNextLevel}%`);

    console.log('TWI sync process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('An error occurred during the TWI sync process:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncTheWanderingInn().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
