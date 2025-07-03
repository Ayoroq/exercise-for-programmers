import PromptSync from "prompt-sync"; // Import prompt-sync for user input
const prompt = PromptSync({ sigint: true }); // Initialize prompt-sync with SIGINT support
import fs from "node:fs/promises"; // Import fs/promises for async file operations

const path = "../files/words.txt"; // Path to the input text file (single file mode, not used in batch mode)
const bad_words_path = "../files/bad_words_config.json"; // Path to the bad words config file
const folderPath = '../files/files_to_read/'; // Folder containing files to process
const writeFolderPath = '../files/files_updated/'; // Folder to write updated files

// Asynchronously read the contents of the input file (single file mode)
async function readWords() {
  try {
    const file = await fs.readFile(path, "utf-8");
    return file;
  } catch (err) {
    console.log(err);
  }
}

// Asynchronously read and parse the bad words configuration file
async function config(filepath) {
  try {
    const file = await fs.readFile(filepath, "utf-8");
    const data = JSON.parse(file);
    return data;
  } catch (err) {
    console.log(err);
  }
}

// Replace all bad words in the data with their mapped good words
// Returns the updated data and the total number of replacements
async function convertWords(data) {
  try {
    let total = 0;
    const bad_words = await config(bad_words_path); // Load bad-good word mapping
    Object.entries(bad_words).forEach(([key, value]) => {
      let regex = new RegExp(key, 'gi'); // Create case-insensitive regex for each bad word
      let match = data.match(regex); // Find all matches
      if (match) {
        total += match.length; // Count replacements
        data = data.replaceAll(regex, value); // Replace all occurrences
      }
    });
    return { data, total };
  } catch (err) {
    console.log(err);
  }
}

// Write the updated data to a new file
async function writeWords(updatedPath, data) {
  try {
    await fs.writeFile(updatedPath, data);
    console.log("File updated successfully");
  } catch (err) {
    console.log(err);
  }
}

// Prompt the user for a new filename and validate it (single file mode)
function getNewPath(question) {
  try {
    while (true) {
      let path = prompt(question).trim();

      // Accept either "myfile" or "myfile.txt"
      if (/^[a-zA-Z0-9._-]+(\.txt)?$/.test(path)) {
        const match = path.match(/^(.*?)\.(.*?)$/);
        return match ? match[1] : path; // Strip .txt if present
      }

      console.log("Please enter a valid filename: ");
    }
  } catch (error) {
    console.log(error);
  }
}

// // Main function to coordinate reading, converting, and writing the file
// async function main() {
//   try {
//     const data = await readWords(); // Read the original file
//     const { data: newData, total } = await convertWords(data); // Replace words and count
//     const newFileName = getNewPath("Enter a name for the output file: "); // Get output filename
//     await writeWords(`../files/${newFileName}.txt`, newData); // Write to new file
//     console.log(`There was a total of ${total} conversions made`);
//   } catch (err) {
//     console.log(err.message);
//   }
// }


//main();



// Asynchronously read all filenames in the specified folder
async function readFiles(folderPath) {
  try {
    const files = await fs.readdir(folderPath, 'utf-8');
    return files;
  } catch (err) {
    console.log(err);
  }
}

// Main function to process all files in the folder
// For each file: read, convert bad words, write updated file, and report conversions
async function main(){
  try{
    const files = await readFiles(folderPath); // Get all files in the folder
    for(let file of files){
      const fileName = file.match(/^(.*?)\.(.*?)$/)[1]; // Extract base filename (without extension)
      const newPath = folderPath + file; // Full path to the input file
      const data = await fs.readFile(newPath, 'utf-8'); // Read file contents
      const { data: newData, total } = await convertWords(data); // Replace bad words and count
      const filePath =  writeFolderPath + 'updated_' + fileName + '.txt'; // Output file path
      await writeWords(`${filePath}`, newData); // Write updated data to new file
      console.log(`File updated_${fileName}.txt created`);
      console.log(`There was a total of ${total} conversions made on the file ${file}\n`);
    }
  }catch(err){
    console.log(err)
  }
}

main(); // Start the batch processing