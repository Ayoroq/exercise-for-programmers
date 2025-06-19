// Import prompt-sync for handling user input
const prompt = require('prompt-sync')({sigint: true});

/**
 * Collects user input for form fields
 * @returns {Object} Object containing form field values
 */
function getValues(){
    const firstName = prompt("Enter the first name: ").trim();
    const lastName = prompt("Enter the last name: ").trim();
    const zipCode = (prompt("Enter the ZIP code: ")).trim();
    const id = prompt("Enter an employee ID: ").trim();
    return {firstName, lastName, zipCode, id};
}

/**
 * Validates first name using regex
 * Must be at least 2 letters, no numbers or special characters
 */
function validateFirstName(firstName){
    return /^[a-z]{2,}$/i.test(firstName);
}

/**
 * Validates last name using regex
 * Must be at least 2 letters, no numbers or special characters
 */
function validateLastName(lastName){
    return /^[a-z]{2,}$/i.test(lastName);
}

/**
 * Validates employee ID format
 * Must be in format AA-1234 (2 letters, hyphen, 4 digits)
 */
function validateId(id){
    return /^[a-z]{2}-\d{4}$/i.test(id);
}

/**
 * Validates ZIP code
 * Must be exactly 5 digits
 */
function validateZipCode(zipCode){
    return /^\d{5}$/.test(zipCode);
}

/**
 * Main validation function that checks all input fields
 * Collects and returns error messages for invalid inputs
 */
function validateInput(firstName, lastName, zipCode, id){
    let valid = true;
    const errors = [];

    // Validate first name
    if (!validateFirstName(firstName)){
        if (firstName === ''){
            errors.push("The first name must be filled in.");
        } else {
            errors.push(`"${firstName}" is not a valid first name. It is too short.`);
        }
        valid = false;
    }

    // Validate last name
    if (!validateLastName(lastName)){
        if (lastName === ''){
            errors.push("The last name must be filled in.");
        } else {
            errors.push(`"${lastName}" is not a valid last name. It is too short.`);
        }
        valid = false;
    }

    // Validate ZIP code with specific error messages
    if (!validateZipCode(zipCode)){
        if (/[a-z]/i.test(zipCode)){
            errors.push("The ZIP code must be numeric.");
        }
        else if (zipCode === ''){
            errors.push("The ZIP code must be filled in.");
        }else {
            errors.push("The ZIP code must be exacly 5 digits.");
        }
        valid = false;
    }

    // Validate employee ID
    if (!validateId(id)){
        errors.push(`${id} is not a valid ID.`);
        valid = false;
    }

    // Display all errors or success message
    if (errors.length > 0) {
        console.log(errors.join("\n"));
    } else {
        console.log("There were no errors found.");
    }
}

/**
 * Main program execution function
 * Handles input collection and validation
 */
function main(){
    try{
        const {firstName, lastName, zipCode, id} = getValues();
        validateInput(firstName, lastName, zipCode, id);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Run the program if this is the main module
if (require.main === module) {
    main();
}