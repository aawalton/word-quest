const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function extractChapters() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto('https://wanderinginn.com/table-of-contents/', { waitUntil: 'networkidle0' });

    const chapters = await page.evaluate(() => {
      const chapterLinks = document.querySelectorAll('.page-toc a');
      return Array.from(chapterLinks).map(link => ({
        title: link.textContent.trim(),
        url: link.href
      }));
    });

    const outputPath = path.join('data/twi/table-of-contents.json');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(chapters, null, 2));

    console.log(`Chapters extracted and saved to ${outputPath}`);
  } catch (error) {
    console.error('Error extracting chapters:', error);
  } finally {
    await browser.close();
  }
}

extractChapters();