import PromptSync from "prompt-sync"; // Import prompt-sync for user input
const prompt = PromptSync({ sigint: true }); // Initialize prompt-sync with SIGINT support
import fs from "node:fs/promises"; // Import fs/promises for async file operations

// Function to verify yes/no answers from the user
// Keeps prompting until the user enters 'y' or 'n'
function verifyAns(question) {
  while (true) {
    const ans = prompt(question).toLowerCase();
    if (ans === "y") {
      return true;
    } else if (ans === "n") {
      return false;
    } else {
      console.log("Please enter a valid answer.");
    }
  }
}

const filepath = "../files/products.json"; // Path to the products JSON file

// Asynchronously read and parse the product data from the JSON file
// Returns the parsed JSON object or logs an error if reading fails
async function getData(filepath) {
  try {
    const file = await fs.readFile(filepath, "utf-8");
    return JSON.parse(file);
  } catch (err) {
    console.log(err.message);
  }
}

// Search for a product by name (case-insensitive) in the data
// Returns the product object if found, otherwise returns false
function productSearch(data, searchTerm) {
  return data.products.find((product) => product.name.toLowerCase() === searchTerm) || false;
}

// Construct a new product object with capitalized name
function constructProduct(answer, price, quantity) {
  const firstLetter = answer.charAt(0).toUpperCase();
  answer = firstLetter + answer.slice(1);
  return {
    name: answer,
    price: price,
    quantity: quantity,
  };
}

// Add a new product to the products array in data
// Returns the updated data object
function addToProducts(data, product) {
  data.products.push(product);
  return data;
}

// Asynchronously write the updated data back to the JSON file
// Logs an error if writing fails
async function writeData(filepath, data) {
  try {
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(err.message);
  }
}

// Add a new product by prompting the user for price and quantity, then save to file
// Handles invalid input and logs errors if any occur
async function addProduct(data, filepath, answer) {
  try {
    const price = parseFloat(prompt("What is the price you would like to set for the product? "));
    const quantity = parseInt(prompt("What is the quantity of the product? "), 10);
    const product = constructProduct(answer, price, quantity);
    const updatedData = addToProducts(data, product);
    await writeData(filepath, updatedData);
    console.log("Product added successfully!");
  } catch (error) {
    console.log(error);
  }
}

// Prompt the user for a product name, search for it, and handle adding if not found
// If not found, offers to add the product or search again
async function askQuestion(question, data) {
  try {
    while (true) {
      const answer = prompt(question).toLowerCase(); // Get user input and normalize
      const product = productSearch(data, answer); // Search for product
      if (product) {
        return product; // Return product if found
      } else {
        // Product not found, offer to add
        console.log("Sorry, that product was not found in our inventory.");
        const add = verifyAns("Would you like to add it? (y/n) ");
        if (add) {
          await addProduct(data, filepath, answer); // Add new product
          // Refresh in-memory data after adding
          const newData = await getData(filepath);
          return productSearch(newData, answer);
        } else{
          // Offer to search again or exit
          const searchAgain = verifyAns("Would you like to search again? (y/n) ");
          if (!searchAgain) {
            break; // Exit the program if the user chooses not to search again
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// Display product details if found, otherwise handle errors
// Prints product name, price (formatted), and quantity
async function displayProduct(question, data) {
  try {
    const product = await askQuestion(question, data);
    if (!product) {
      return; // Exit if no product is found or user quits
    }
    console.log(`Name: ${product.name}`);
    console.log(`Price: $${product.price.toFixed(2)}`);
    console.log(`Quantity on hand: ${product.quantity}`);
  } catch (error) {
    console.log(error);
  }
}

// Main function to load data and start the product search/display process
// Handles top-level errors
async function main() {
  try {
    const data = await getData(filepath); // Load product data from file
    await displayProduct("What is the product name? ", data); // Start interaction
  } catch (error) {
    console.log(error.message);
  }
}

main(); // Start the