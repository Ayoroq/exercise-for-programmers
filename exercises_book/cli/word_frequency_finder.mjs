import PromptSync from "prompt-sync"; // Import prompt-sync for user input (not used in this script)
const prompt = PromptSync({ sigint: true }); // Initialize prompt-sync

import fs from "node:fs/promises"; // Import fs/promises for async file operations
import { time } from "node:console";

const filePath = "../files/macbeth.txt"; // Path to the input text file

// Asynchronously read the contents of the input file
async function readFile(filePath) {
  try {
    let data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Process the text: remove punctuation, split into words, and count frequencies
function processWords(data) {
  let words_freq = {};
  data = data.replace(/[.,!?]/g, ""); // Remove basic punctuation
  data = data
    .split(/\r?\n/) // Split by newlines
    .join(" ")      // Join lines into a single string
    .split(" ")     // Split by spaces to get words
    .filter((word) => word !== ""); // Remove empty strings
  // Count frequency of each word (case-insensitive)
  data.map((word) => (
    words_freq[word.toLowerCase()] = words_freq[word.toLowerCase()] 
      ? words_freq[word.toLowerCase()] + 1 
      : 1
  ));
  return words_freq;
}

// Sort the words by frequency in descending order
function sortWords(words_freq) {
  let sorted_words = Object.fromEntries(
    Object.entries(words_freq).sort((a, b) => b[1] - a[1])
  );
  return sorted_words;
}

// Print the histogram: word followed by asterisks representing frequency
function print(sorted_words){
   try{
    for(const [key, value] of Object.entries(sorted_words)){
        console.log(`${key.padEnd(10, ' ')}: ${'*'.repeat(value)}`);
    }
   }catch(error){
    console.log(error);
   }
}

// Main function to coordinate reading, processing, sorting, and printing
async function main() {
  try {
    console.time("run-time");
    const words = await readFile(filePath);      // Read the file
    const processed = processWords(words);       // Process and count words
    const sorted = sortWords(processed);         // Sort by frequency
    print(sorted);
    console.timeEnd("run-time");                              // Print the histogram
  } catch (error) {
    console.log(error);
  }
}

main(); // Start