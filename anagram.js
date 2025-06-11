// This program prompts the user for two strings and determines if they are anagrams.
const prompt = require("prompt-sync")({sigint: true});

// This function validates user input by repeatedly prompting until a valid input is received
function inputValidation(question){
    // Continuously prompt the user until a non-empty input is provided
    while(true){
        let input = prompt(question).trim().toLowerCase(); // Normalize the input
        if(input !== undefined && input !== null || input === "") return input // Accept empty string but not undefined/null
        console.log("Please enter a valid input");
    }
}

// This function prompts the user to enter two words and returns them as an array
const getWords = function() {
    // Prompt the user for two strings to compare
    console.log("Enter two strings and I'll tell you if they are anagrams:");
    let word1 = inputValidation("Enter the first string: ");
    let word2 = inputValidation("Enter the second string: ");
    return [word1, word2]; // Return both strings as a pair
}

let [word1, word2] = getWords();

// This function compares two strings and returns true if they are anagrams
function isAnagram(word1, word2){
    if(word1.length !== word2.length) return false; // Early exit if lengths differ

    let obj1 = {};
    let obj2 = {};

    // Count character frequencies for the first word
    for (let i = 0; i < word1.length; i++) {
        obj1[word1[i]] = obj1[word1[i]] ? obj1[word1[i]] + 1 : 1;
    }

    // Count character frequencies for the second word
    for (let i = 0; i < word2.length; i++) {
        obj2[word2[i]] = obj2[word2[i]] ? obj2[word2[i]] + 1 : 1;
    }

    // Compare both frequency maps
    for (const key in obj1) {
        if(obj1[key] !== obj2[key]) return false;
    }

    return true; // All character counts match
}

// Display the result to the user
isAnagram(word1, word2) ? console.log(`"${word1}" and "${word2}" are anagrams.`) : 
                            console.log(`"${word1}" and "${word2}" are not anagrams.`);