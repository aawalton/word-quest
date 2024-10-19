import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import path from 'path';

export async function downloadTableOfContents() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the URL
    await page.goto('https://wanderinginn.com/table-of-contents/', { waitUntil: 'networkidle0' });
    
    // Get the HTML content
    const htmlContent = await page.content();
    
    // Ensure the directory exists
    const dirPath = path.join('data/twi');
    await fs.mkdir(dirPath, { recursive: true });
    
    // Write the HTML content to a file
    const filePath = path.join(dirPath, 'table-of-contents.html');
    await fs.writeFile(filePath, htmlContent);
    
    console.log(`HTML content saved to ${filePath}`);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
}

downloadTableOfContents();

if (import.meta.url === `file://${process.argv[1]}`) {
  downloadTableOfContents().catch(console.error);
}
