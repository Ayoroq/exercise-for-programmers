const prompt = require ('prompt-sync')({sigint: true});

let quotes = [
    {
        quote: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt"
    },
    {
        quote: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        quote: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
        author: "Martin Luther King Jr."
    },
    {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        author: "Frank Herbert"
    }
    ,
    {
        quote: "The best way to predict the future is to create it.",
        author: "Isacc Asimov"
    }
]

for (quote of quotes) {
    console.log(quote.author + ' says, "' + quote.quote + '"');
}
