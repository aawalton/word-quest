import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractChapterText(filePath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`file:${filePath}`);

  const chapterText = await page.evaluate(() => {
    const content = document.querySelector('.entry-content');
    if (!content) return null;

    // Remove any script tags
    const scripts = content.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    // Extract text from paragraphs
    const paragraphs = content.querySelectorAll('p');
    const textArray = Array.from(paragraphs)
      .map(p => {
        // Check if the paragraph contains an image
        const img = p.querySelector('img');
        if (img) {
          // If it contains an image, don't include this paragraph
          return null;
        }
        return p.textContent.trim();
      })
      .filter(Boolean); // This will remove any null entries

    // Remove the last paragraph if it contains "Next Chapter"
    if (textArray[textArray.length - 1] && textArray[textArray.length - 1].includes("Next Chapter")) {
      textArray.pop();
    }

    return textArray;
  });

  await browser.close();
  return chapterText;
}

export async function getChaptersJson() {  // renamed from processChapters
  const chaptersDir = path.join(__dirname, '../../../data/html/series/the-wandering-inn/chapters');
  const outputDir = path.join(__dirname, '../../../data/json/series/the-wandering-inn/chapters');

  try {
    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(chaptersDir);

    for (const file of files) {
      if (path.extname(file) === '.html') {
        const filePath = path.join(chaptersDir, file);
        const outputPath = path.join(outputDir, `${path.parse(file).name}.json`);

        // Check if the output file already exists
        try {
          await fs.access(outputPath);
          continue; // Skip to the next file without logging
        } catch (error) {
          // File doesn't exist, proceed with processing
        }

        const chapterText = await extractChapterText(filePath);

        if (chapterText) {
          const jsonOutput = JSON.stringify({ chapterText }, null, 2);
          await fs.writeFile(outputPath, jsonOutput);
          console.log(`Processed: ${file}`);
        } else {
          console.log(`Failed to extract text from: ${file}`);
        }
      }
    }

    console.log('All chapters processed successfully.');
  } catch (error) {
    console.error('Error processing chapters:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  getChaptersJson().catch(console.error);
}
