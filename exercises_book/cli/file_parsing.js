const fs = require("node:fs/promises"); // For async file reading
const bs = require("fs"); // For stream reading (used with csv-parse)
const { parse } = require("csv-parse"); // CSV parsing library

// Function to read and manually parse the CSV file, then sort by salary descending
async function readData() {
  try {
    const data = await fs.readFile("../files/employees_salary.csv", "utf8");
    return data
      .split("\n") // Split file into lines
      .filter((line) => line.trim() !== "") // Remove empty lines
      .map((line) => line.split(",")) // Split each line into [last, first, salary]
      .sort((a, b) => {
        return b[2] - a[2]; // Sort by salary descending
      });
  } catch (err) {
    console.error(err);
  }
}

// Variables to store max column widths for formatting
let last = 0;
let first = 0;
let salary = 0;

// Format data: convert salary to currency, and calculate max column widths
function format(data) {
  try {
    data.forEach((element) => {
      element[2] = Number(element[2]); // Convert salary to number
      element[2] = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(element[2]); // Format salary as currency
      if (element[0].length > last) {
        last = element[0].length; // Track max last name length
      }
      if (element[1].length > first) {
        first = element[1].length; // Track max first name length
      }
      if (element[2].length > salary) {
        salary = element[2].length; // Track max salary length
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}

// Print the formatted table to the console
async function print(data) {
  format(data); // Prepare data and column widths
  // Print header row with padding
  console.log("Last".padEnd(last + 1) + "First".padEnd(first + 1) + "Salary".padEnd(salary + 1));
  // Print separator line
  console.log("-".repeat(last + first + salary + 3));
  // Print each row with proper padding
  data.forEach((element) => {
    console.log(element[0].padEnd(last + 1) + element[1].padEnd(first + 1) + element[2].padEnd(salary + 1));
  });
}

// Main function for manual parsing and printing
async function main() {
  console.time("run-time");
  const data = await readData(); // Read and parse data
  await print(data); // Print formatted table
  console.timeEnd("sort-names");
}

// Uncomment to run manual parsing version
//main();

// Function to parse and print using csv-parse library
function csvParseAndPrint() {
  const datum = [];
  bs.createReadStream("../files/employees_salary.csv")
    .pipe(parse({ columns: false, skip_empty_lines: true }))
    .on("data", (data) => datum.push(data)) // Collect each row
    .on("end", () => {
      datum.sort((a, b) => {
        return b[2] - a[2]; // Sort by salary descending
      });
      console.time("run-time");
      print(datum); // Print formatted table
      console.timeEnd("run-time");
    })
    .on("error", (err) => {
      console.error(err.message);
    });
}

// Call the CSV parser version
csvParseAndPrint();

