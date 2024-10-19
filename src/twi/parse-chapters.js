const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

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
    return Array.from(paragraphs).map(p => p.textContent.trim()).filter(Boolean);
  });

  await browser.close();
  return chapterText;
}

async function processChapters() {
  const chaptersDir = path.join(__dirname, '..', '..', 'data', 'twi', 'chapters');
  const outputDir = path.join(__dirname, '..', '..', 'data', 'twi', 'json');

  try {
    await fs.mkdir(outputDir, { recursive: true });
    
    const files = await fs.readdir(chaptersDir);
    
    for (const file of files) {
      if (path.extname(file) === '.html') {
        const filePath = path.join(chaptersDir, file);
        const chapterText = await extractChapterText(filePath);
        
        if (chapterText) {
          const jsonOutput = JSON.stringify({ chapterText }, null, 2);
          const outputPath = path.join(outputDir, `${path.parse(file).name}.json`);
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

processChapters();

