import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getSeriesJson() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load the HTML file
  const htmlPath = path.join(__dirname, '..', '..', 'data', 'twi', 'table-of-contents.html');
  await page.goto(`file://${htmlPath}`);

  const chapters = await page.evaluate(() => {
    const chapterElements = document.querySelectorAll('.chapter-entry');
    return Array.from(chapterElements).map(el => {
      const linkElement = el.querySelector('a');

      if (!linkElement) {
        return null;
      }

      return {
        title: linkElement.textContent.trim(),
        url: linkElement.href
      };
    }).filter(chapter => chapter !== null);
  });

  await browser.close();

  // Add chapter numbers
  const numberedChapters = chapters.map((chapter, index) => ({
    number: index + 1,
    ...chapter
  }));

  // Save the result as JSON
  const jsonPath = path.join(__dirname, '..', '..', 'data', 'twi', 'table-of-contents.json');
  await fs.writeFile(jsonPath, JSON.stringify(numberedChapters, null, 2));

  console.log(`Table of contents saved to ${jsonPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  getSeriesJson().catch(console.error);
}
