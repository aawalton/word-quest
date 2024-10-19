import fs from 'fs/promises';
import path from 'path';

async function countWordsInJsonFiles(baseDirectoryPath) {
  try {
    // Get all subdirectories in the base directory
    const subdirectories = await fs.readdir(baseDirectoryPath, { withFileTypes: true });
    const jsonDirectories = subdirectories
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(baseDirectoryPath, dirent.name, 'json'));

    let allResults = [];

    // Process each JSON directory
    for (const directoryPath of jsonDirectories) {
      // Read all files in the directory
      const files = await fs.readdir(directoryPath);
      
      // Filter for JSON files
      const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
      
      // Process each JSON file
      const results = await Promise.all(jsonFiles.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(content);
        
        // Count words in chapterText array
        const wordCount = jsonData.chapterText.reduce((count, text) => {
          return count + text.split(/\s+/).filter(word => word.length > 0).length;
        }, 0);
        
        return { file: path.join(path.basename(path.dirname(directoryPath)), file), wordCount };
      }));
      
      allResults = allResults.concat(results);
    }
    
    // Sort results by file name
    allResults.sort((a, b) => a.file.localeCompare(b.file));
    
    // Log results
    allResults.forEach(({ file, wordCount }) => {
      console.log(`${file}: ${wordCount} words`);
    });
    
    // Calculate total word count
    const totalWords = allResults.reduce((sum, { wordCount }) => sum + wordCount, 0);
    console.log(`\nTotal words across all files: ${totalWords}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const baseDirectoryPath = './data';
  countWordsInJsonFiles(baseDirectoryPath);
}

