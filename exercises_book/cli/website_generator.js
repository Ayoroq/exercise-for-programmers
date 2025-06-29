const prompt = require("prompt-sync")({ sigint: true }); // For user input in terminal
const fsPromises = require("fs/promises"); // For async file and folder operations

// Ask a question and validate that the response is not empty or a number
function askQuestion(question) {
  let response = prompt(question);
  if (!/^[a-zA-Z0-9._-]+$/.test(response)) {
    console.log("Please return a valid response");
    return askQuestion(question);
  }
  return response;
}

// Ask a yes/no question and validate the response is 'y' or 'n'
function confirmFolder(question) {
  let response = prompt(question);
  if (response != "y" && response != "n") {
    console.log("Please enter y or n");
    return confirmFolder(question);
  }
  return response;
}

// Gather all user inputs for site name, author, and folder options
function input() {
  try {
    const site_name = askQuestion("Site name: ");
    const Author = askQuestion("Author: ");
    const javascript = confirmFolder("Do you want a folder for Javascript? ");
    const css = confirmFolder("Do you want a folder for CSS? ");
    return { site_name, Author, javascript, css };
  } catch (error) {
    console.log(error.message);
  }
}

// Create a folder, handle if it already exists and optionally overwrite
async function createFolder(path) {
  try {
    await fsPromises.mkdir(`./${path}`);
    console.log(`Created  ./${path}`);
  } catch (error) {
    if (error.code === "EEXIST") {
      console.log(`Directory '${path}' already exists.`);
      const response = confirmFolder("Do you want to overwrite the existing directory? (y/n): ");
      if (response === "y") {
        await fsPromises.rm(path, { recursive: true , force: true});
        await fsPromises.mkdir(path);
        console.log(`Created  ./${path}`);
      } else {
        console.log("Directory not overwritten");
      }
    } else {
      console.error(`Error creating directory: ${error.message}`);
    }
  }
}

// Write a basic HTML file with the given filename, folder, and author
async function write(filename, folder_path, author) {
  try {
    const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${filename}</title>
            <meta name="author" content="${author}">             
        </head>
        <body>
            <h1>${filename}</h1>
        </body>
        </html>
        `;
    await fsPromises.writeFile(`./${folder_path}/${filename}.html`, content);
    console.log(`Created  ./${folder_path}/${filename}.html`);
  } catch (error) {
    console.error(`Error creating file: ${error.message}`);
  }
}

// Main function to run the website generator logic
async function main() {
  try {
    const { site_name, Author, javascript, css } = input();
    await createFolder(site_name);
    if (javascript === "y") {
      await createFolder(`${site_name}/js`);
    }
    if (css === "y") {
      await createFolder(`${site_name}/css`);
    }
    await write("index", site_name, Author);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Only run main if this script is executed directly
if (require.main === module) {
  main();
}