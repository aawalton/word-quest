import fs from 'fs/promises';
import path from 'path';

async function calculateTotalWordCount() {
  try {
    // Read the word-counts.json file
    const filePath = path.join(process.cwd(), 'progress', 'word-counts.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const wordCounts = JSON.parse(fileContent);

    // Calculate total word count for completed entries
    const totalWordCount = wordCounts.reduce((total, entry) => {
      if (entry.completed) {
        return total + entry.wordCount;
      }
      return total;
    }, 0);

    console.log(`Total word count for completed entries: ${totalWordCount}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  calculateTotalWordCount();
}

