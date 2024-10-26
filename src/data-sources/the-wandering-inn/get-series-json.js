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
  const htmlPath = path.join(__dirname, '../../../data/html/series/the-wandering-inn/the-wandering-inn.html');
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
        url: linkElement.href,
      };
    }).filter(chapter => chapter !== null);
  });

  await browser.close();

  // Transform chapters to match schema
  const formattedChapters = chapters.map((chapter, index) => ({
    order: index + 1,
    title: chapter.title,
    url: chapter.url
  }));

  // Create the complete series object
  const seriesData = {
    "series-id": "the-wandering-inn",
    "series-name": "The Wandering Inn",
    "author-ids": ["pirateaba"],
    "books": [], // No book information available in current HTML
    "chapters": formattedChapters
  };

  // Save the result as JSON
  const jsonPath = path.join(__dirname, '../../../data/json/series/the-wandering-inn/the-wandering-inn.json');
  await fs.writeFile(jsonPath, JSON.stringify(seriesData, null, 2));

  console.log(`Table of contents saved to ${jsonPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  getSeriesJson().catch(console.error);
}
