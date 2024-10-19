const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');

// Add this import at the top of the file
const { setTimeout } = require('timers/promises');

async function downloadChapters() {
  try {
    // Read the table of contents JSON file
    const tocPath = path.join('data', 'twi', 'json', 'table-of-contents.json');
    const tocData = await fs.readFile(tocPath, 'utf-8');
    const chapters = JSON.parse(tocData);

    // Create the output directory if it doesn't exist
    const outputDir = path.join('data', 'twi', 'html');
    await fs.mkdir(outputDir, { recursive: true });

    // Launch a browser instance
    const browser = await puppeteer.launch();

    for (const chapter of chapters) {
      const { number, title, url } = chapter;
      console.log(`Downloading: ${title}`);

      // Create a new page for each chapter
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Extract the main content of the chapter
      const content = await page.evaluate(() => {
        const articleElement = document.querySelector('article.post');
        return articleElement ? articleElement.innerHTML : null;
      });

      if (content) {
        // Create a safe filename from the chapter title with a 4-digit zero-padded prefix
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const paddedNumber = number.toString().padStart(4, '0');
        const fileName = `${paddedNumber}_${safeTitle}.html`;
        const filePath = path.join(outputDir, fileName);

        // Write the content to a file
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`Saved: ${fileName}`);
      } else {
        console.log(`No content found for: ${title}`);
      }

      // Add a delay between requests
      await setTimeout(1000);
    }

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

downloadChapters();
