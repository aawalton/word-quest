import { downloadTableOfContents } from './download-table-of-contents.js';
import { parseTableOfContents } from './parse-table-of-contents.js';
import { downloadChapters } from './download-chapters.js';
import { processChapters } from './parse-chapters.js';
// Add these new imports
import { countWordsInJsonFiles } from '../progress/word-count.js';
import { calculateTotalWordCount } from '../progress/total-word-count.js';
import { calculateLevelInfo } from '../progress/level.js';

async function syncTWI() {
  try {
    console.log('Starting TWI sync process...');

    console.log('Downloading table of contents...');
    await downloadTableOfContents();

    console.log('Parsing table of contents...');
    await parseTableOfContents();

    console.log('Downloading chapters...');
    await downloadChapters();

    console.log('Parsing chapters...');
    await processChapters();

    // Add new steps
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
    process.exit(0); // Exit with success code
  } catch (error) {
    console.error('An error occurred during the TWI sync process:', error);
    process.exit(1); // Exit with error code
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncTWI().catch((error) => {
    console.error(error);
    process.exit(1); // Exit with error code if an unhandled error occurs
  });
}
