// Import the prompt-sync module for handling user input
const prompt = require('prompt-sync')({sigint: true});

// function inputValidation(question){
//     while(true){
//         let input = prompt(question).trim();
//         if (!input) {
//             console.log("Please enter a valid Password.");
//             continue;
//         }
//         return input; // Only accept non-empty, defined, non-null input
//     }
// }

// // This checks if an input contains a number or not
// function containsNumber(str) {
//      return /\d/.test(str);
// }

// function containsLetters(str) {
//     return /[a-zA-Z]/.test(str);
// }

// function containsSpecialCharacters(str) {
//     return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str);
// }

// const password = inputValidation("Enter a password: ")
// const passwordStrength = new Map()

// passwordStrength.set(1, "Very Strong")
// passwordStrength.set(2, "Strong")
// passwordStrength.set(3, "Weak")
// passwordStrength.set(4, "Very Weak")

// function passwordValidator(password){
//     if (password.length < 8 && /^\d+$/.test(password)) return 4;
//     if (password.length < 8 && /^[a-zA-Z]+$/.test(password)) return 3;
//     if (password.length >= 8 && containsNumber(password) && containsLetters(password) && !containsSpecialCharacters(password)) return 2;
//     if (password.length >= 8 && containsNumber(password) && containsLetters(password) && containsSpecialCharacters(password)) return 1;
// }

// let strength =  passwordStrength.get(passwordValidator(password))
// console.log(`The password ${password} is a ${strength} password`)


// Password Checker class definition
class passwordChecker {
    constructor() {
        this.prompt = prompt;
        // Define password strength levels using Map
        // Keys: 1-4 representing strength levels
        // Values: Corresponding strength descriptions
        this.passwordStrength = new Map([
            [1, "Very Strong"],  // >= 8 chars with letters, numbers, and special chars
            [2, "Strong"],       // >= 8 chars with letters and numbers
            [3, "Weak"],        // < 8 chars, only letters
            [4, "Very Weak"]    // < 8 chars, only numbers or default
        ]);
    }
    
    // Validates user input ensuring non-empty password
    inputValidation(question) {
        while(true) {
            let input = prompt(question).trim();
            if (!input) {
                console.log("Please enter a valid Password.");
                continue;
            }
            return input; // Only accept non-empty, defined, non-null input
        }
    }

    // Helper method to check if string contains numbers
    containsNumber(str) {
        return /\d/.test(str);
    }

    // Helper method to check if string contains letters
    containsLetters(str) {
        return /[a-zA-Z]/.test(str);
    }

    // Helper method to check if string contains special characters
    containsSpecialCharacters(str) {
        // Matches any of the following special characters
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str);
    }
  
    // Main password validation method
    // Returns strength level (1-4) based on password complexity
    passwordValidator(password) {
        // Very Weak: Less than 8 chars, only numbers
        if (password.length < 8 && /^\d+$/.test(password)) return 4;
        
        // Weak: Less than 8 chars, only letters
        if (password.length < 8 && /^[a-zA-Z]+$/.test(password)) return 3;
        
        // Strong: 8+ chars, contains both letters and numbers
        if (password.length >= 8 && 
            this.containsNumber(password) && 
            this.containsLetters(password) && 
            !this.containsSpecialCharacters(password)) return 2;
        
        // Very Strong: 8+ chars, contains letters, numbers, and special chars
        if (password.length >= 8 && 
            this.containsNumber(password) && 
            this.containsLetters(password) && 
            this.containsSpecialCharacters(password)) return 1;
        
        // Default to Very Weak if none of the above conditions are met
        return 4;
    }

    // Main execution method
    run() {
        try {
            // Get password input from user
            const password = this.inputValidation("Enter a password: ")
            // Get strength description based on validation result
            let strength = this.passwordStrength.get(this.passwordValidator(password))
            // Output result to user
            console.log(`The password ${password} is a ${strength} password`)
        } catch (error) {
            // Handle any errors that occur during execution
            console.error(`Error: ${error.message}`);
        }  
    }
}   

// Run the checker only if this file is being executed directly
if (require.main === module) {
    const checker = new passwordChecker();
    checker.run();
}

// Export the class for testing purposes
module.exports = passwordChecker;