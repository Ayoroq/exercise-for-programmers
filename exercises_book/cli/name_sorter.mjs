// Import required modules for user input and file operations
import PromptSync from "prompt-sync";
const prompt = PromptSync();
import fs from "node:fs/promises";

// Reads names from CSV file and returns them sorted
async function readData() {
  try {
    const data = await fs.readFile("../files/names.csv", "utf8");
    return data.split("\n").sort();
  } catch (err) {
    console.error(err);
  }
}

// Validates input format: checks if it's a number or matches "Last, First" pattern
function isInvalid(input) {
  // Allow numbers
  if (!isNaN(input)) {
    return false;
  }
  // Allow "Last Name, First Name" format
  if (/^[A-Z][a-zA-Z''-]*,\s[A-Z][a-zA-Z''-]*$/.test(input)) {
    return false;
  }

  return true;
}

// Prompts user for names until empty input, validates format, and returns sorted list
function ask() {
  let answers = [];
  while (true) {
    let input = prompt("Enter a name:  ");
    // Empty input ends the loop
    if (input == "") {
      break;
    }
    if (isInvalid(input)) {
      console.log("Invalid input, enter name in the format 'Last Name, First Name'");
      continue;
    }
    answers.push(input);
  }
  return answers.sort();
}

// Formats and saves names to file with count and separator
async function print(data) {
  try {
    if (data.length == 0) {
      console.log("No names entered");
      return;
    }
    // Create formatted content with header and names
    let content = `Total of ${data.length} names\n${"-".repeat(20)}\n`;
    data.forEach((element) => {
      content += `${element}\n`;
    });
    await fs.writeFile("../files/sorted_names.txt", content);
    console.log("The file was saved!");
  } catch (error) {
    console.error(`Error writing names to file: ${error.message}`);
  }
}

// Main function: reads names from file, processes them, and saves sorted output
async function main() {
  console.time("sort-names");
  // Currently using file input instead of user input
  //const data = ask();
  const data = await readData();
  await print(data);
  console.timeEnd("sort-names");
}

main();