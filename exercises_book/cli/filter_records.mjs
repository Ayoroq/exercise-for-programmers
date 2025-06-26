import PromptSync from "prompt-sync";
const prompt = PromptSync({ sigint: true });

import fs from "node:fs/promises";

// Employee data as an array of objects (maps)
const data = [
  { "First Name": "John", "Last Name": "Johnson", Position: "Manager", "Separation date": "2016-12-31" },
  { "First Name": "Sally", "Last Name": "Weber", Position: "Web Developer", "Separation date": "2015-12-18" },
  { "First Name": "Jacquelyn", "Last Name": "Jackson", Position: "DBA", "Separation date": "" },
  { "First Name": "Jake", "Last Name": "Jacobson", Position: "Programmer", "Separation date": "" },
  { "First Name": "Michaela", "Last Name": "Michaelson", Position: "District Manager", "Separation date": "2015-12-19" },
  { "First Name": "Tou", "Last Name": "Xiong", Position: "Software Engineer", "Separation date": "2016-10-05" },
];

// Create a date object for six months ago from today
let sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

// Function to filter data based on the filter field and search value
function filterData(value, filterValue = "", data) {
  let array = [];
  data.forEach((element) => {
    let modifiedData = {};
    // Convert all keys in the object to lowercase for case-insensitive access
    let keys = Object.keys(element);
    keys.forEach((key) => {
      modifiedData[key.toLowerCase()] = element[key];
    });
    if (value === "separation date") {
      // If filtering by separation date, check if date is more than six months ago
      Date.parse(modifiedData[value]) < sixMonthsAgo ? array.push(modifiedData) : null;
    } else {
      // For other fields, check if the field includes the search string (case-insensitive)
      modifiedData[value].toLowerCase().includes(filterValue) ? array.push(modifiedData) : null;
    }
  });
  return array;
}

// Function to restructure filtered data for display (combine first and last name)
function restructure(data) {
  let fileData = [];
  data.forEach((element) => {
    fileData.push({
      Name: element["first name"] + " " + element["last name"],
      Position: element.position,
      "Separation date": element["separation date"],
    });
  });
  return fileData;
}

// Function to verify that the filter field entered by the user is valid
function verifyFilterValue(value) {
  return value === "last name" || value === "first name" || value === "position" || value === "separation date";
}

// Function to print the data in a formatted table
function print(data) {
  try {
    // Print table headers
    console.log("Name".padEnd(20, " ") + " | " + "Position".padEnd(25, " ") + " | " + "Separation Date".padEnd(20, " "));
    console.log("-".repeat(20) + " | " + "-".repeat(25) + " | " + "-".repeat(20));
    if (data.length > 0) {
      // Print each row of data
      data.forEach((element) => {
        console.log(element.Name.padEnd(20, " ") + " | " + element.Position.padEnd(25, " ") + " | " + element["Separation date"].padEnd(20, " "));
      });
    }
    console.log("");
  } catch (err) {
    console.log(err);
  }
}

// import data from files
async function read() {
  try {
    // Helper function to read and parse the CSV file
    async function importData() {
      try {
        // Read the employee records CSV file as a UTF-8 string
        const data = await fs.readFile("../files/employee_records.csv", { encoding: "utf8" });
        // Split the file into lines, then split each line by comma to get an array of values
        return data.split("\n").map((line) => line.split(","));
      } catch (err) {
        // Log any errors that occur while reading the file
        console.log(err);
      }
    }
    // Call the helper to get the raw CSV data as an array of arrays
    const datum = await importData();
    let fileData = [];
    // For each row, create an object mapping headers to values
    datum.forEach((element) => {
      let test = {};
      for (let i = 0; i < element.length; i++) {
        test[datum[0][i]] = element[i]; // Use the first row as headers
      }
      fileData.push(test);
    });
    fileData.shift(); // Remove the header row from the data array
    return fileData; // Return the array of employee objects
  } catch (err) {
    // Log any errors that occur in the read function
    console.log(err);
  }
}

// Main function to prompt user, filter data, and print results
async function main() {
  try {
    // Prompt user for filter field (e.g., last name, first name, position, separation date)
    console.log("");
    let filterValue = prompt("Enter a filter value:  ").toLowerCase().trim();
    // If filter is valid and not separation date, prompt for search string and filter
    if (verifyFilterValue(filterValue) && filterValue != "separation date") {
      let searchTerm = prompt("Enter a search string:  ").toLowerCase().trim();
      console.log("");
      console.log("Results: ");
      print(restructure(filterData(filterValue, searchTerm, await read())));
    }
    // If filter is separation date, filter for employees separated more than six months ago
    else if (filterValue == "separation date") {
      console.log("");
      console.log("Results: ");
      print(restructure(filterData(filterValue, "", await read())));
    } else {
      // If invalid filter, show error and prompt again
      console.log('Invalid filter value. Please enter "last name", "first name", "position", or "separation date".');
    }
  } catch (e) {
    console.log(e);
  }
}

// Start the program
await main();
