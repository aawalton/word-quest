import fs from 'fs/promises';
import path from 'path';

export async function countWordsInJsonFiles(baseDirectoryPath) {
  try {
    // Get all subdirectories in the base directory
    const subdirectories = await fs.readdir(baseDirectoryPath, { withFileTypes: true });
    const jsonDirectories = subdirectories
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(baseDirectoryPath, dirent.name, 'json'));

    let allResults = [];
    let existingData = [];

    // Read existing data from the output file
    const outputPath = path.join(baseDirectoryPath, '..', 'progress', 'word-counts.json');
    try {
      const existingContent = await fs.readFile(outputPath, 'utf-8');
      existingData = JSON.parse(existingContent);
    } catch (error) {
      // If the file doesn't exist or can't be read, we'll start with an empty array
    }

    // Process each JSON directory
    for (const directoryPath of jsonDirectories) {
      try {
        // Read all files in the directory
        const files = await fs.readdir(directoryPath);
        
        // Filter for JSON files
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
        
        // Process each JSON file
        const results = await Promise.all(jsonFiles.map(async (file) => {
          const chapterName = path.join(path.basename(path.dirname(directoryPath)), file);
          
          // Check if the file is already in existingData
          const existingEntry = existingData.find(entry => entry.file === chapterName);
          if (existingEntry) {
            return existingEntry;
          }
          
          // If not in existingData, calculate word count
          const filePath = path.join(directoryPath, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const jsonData = JSON.parse(content);
          
          const wordCount = jsonData.chapterText.reduce((count, text) => {
            return count + text.split(/\s+/).filter(word => word.length > 0).length;
          }, 0);
          
          return { 
            file: chapterName, 
            wordCount,
            completed: false
          };
        }));
        
        allResults = allResults.concat(results);
      } catch (dirError) {
      }
    }
    
    // Sort results by file name
    allResults.sort((a, b) => a.file.localeCompare(b.file));
    
    // Write results to JSON file
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(allResults, null, 2));
    
    console.log(`Results written to ${outputPath}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const baseDirectoryPath = './data';
  countWordsInJsonFiles(baseDirectoryPath);
}
