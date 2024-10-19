import { downloadTableOfContents } from './download-table-of-contents.js';
import { parseTableOfContents } from './parse-table-of-contents.js';
import { downloadChapters } from './download-chapters.js';
import { processChapters } from './parse-chapters.js';

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
