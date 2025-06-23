// Import prompt-sync for user input and fs/promises for file operations
import promptSync from "prompt-sync";
const prompt = promptSync({ sigint: true });
import fs from "node:fs/promises";

let employees; // Array to hold employee names

// Read employee names from the file
async function read() {
  try {
    const data = await fs.readFile("../files/employees.csv", {
      encoding: "utf8",
    });
    // Split file into lines and remove empty lines
    employees = data.split("\n").filter((line) => line.trim() !== "");
  } catch (err) {
    console.error(err);
  }
}

// Ask the user for the name to remove
function inputName() {
  let name = prompt("Enter the employee's name to remove: ");
  return name;
}

// Check if the name exists in the array
function checkName(name, array) {
  return array.includes(name);
}

// Remove the name from the array if present
function removeName(name, employees) {
  try {
    if (checkName(name, employees)) {
      // Filter out the name to remove
      employees = employees.filter((employee) => employee !== name);
      return { employees, removed: true };
    } else {
      // Name not found, show error
      throw new Error(
        "Employee not found. Please make sure the name is spelled correctly with the right capitalization."
      );
    }
  } catch (error) {
    console.log(error);
    return { employees, removed: false };
  }
}

// Write the updated employee list back to the file
async function write(employees) {
  try {
    await fs.writeFile("../files/employees.csv", employees.join("\n"));
  } catch (err) {
    console.error(err.message);
  }
}

// Main program logic
async function main() {
  try {
    await read(); // Load employees from file

    // Print the current list of employees
    console.log("There are " + employees.length + " employees:");
    for (let employee of employees) {
      console.log(employee);
    }
    console.log("");

    // Ask for a name and try to remove it
    const name = inputName();
    const { employees: updatedEmployees, removed } = removeName(
      name,
      employees
    );

    // If removed, print updated list and write to file
    if (removed) {
      console.log("\nThere are " + updatedEmployees.length + " employees:");
      for (let employee of updatedEmployees) {
        console.log(employee);
      }
      await write(updatedEmployees);
    }
  } catch (error) {
    console.log(error);
  }
}

main(); // Run the program