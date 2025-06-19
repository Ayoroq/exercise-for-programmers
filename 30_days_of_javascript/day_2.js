// declaring a variable
let challenge = '30 Days Of JavaScript';
console.log(challenge);
console.log(`The length of the value is ${challenge.length}`)

// changing to uppercase
console.log(challenge.toUpperCase());

//changing back to lowercase
console.log(challenge.toLowerCase());

// getting the first word
console.log(challenge.substring(0, 2));

// slicing out thr phrase 'Days Of JavaScript'
console.log(challenge.slice(2, 22));

// checking if the word 'Script' is in the challenge variable
console.log(challenge.includes('Script'));

// splitting the challenge variable into an array
console.log(challenge.split(' '));

//splitting the string below to an array
let test = 'Facebook, Google, Microsoft, Apple, IBM, Oracle, Amazon'
console.log(test.split(','))

// replacing the word 'JavaScript' with 'Python'
console.log(challenge.replace('jav)ascript','Python'));

// getting the character at index 15
console.log(challenge.charAt(15));
// gettig the character code of J in '30 Days Of JavaScript'
console.log(challenge.charCodeAt('J'));

//geting the first occurrence of 'a'
console.log(challenge.indexOf('a'));

// getting the last occurrence of 'a'
console.log(challenge.lastIndexOf("a"));

// getting the first occrurece of the word 'because'
console.log('You cannot end a sentence with because because because is a conjunction'.indexOf('because'));
// getting the last occurrence of the word 'because'
console.log('You cannot end a sentence with because because because is a conjunction'.lastIndexOf('because'));

//finding the position of the word 'because' in the sentence
console.log('You cannot end a sentence with because because because is a conjunction'.search('because'))

// trimming with the trim method
console.log(' 30 Days Of JavaScript '.trim());

//making startwith retrun true
console.log(challenge.startsWith('30'));

// making endswith return true
console.log(challenge.endsWith('JavaScript'));

//finding all the a in the word
console.log(challenge.match(/a/g))

//concating 
console.log('30 Days of'.concat(' JavaScript'));

// repeating with the repeat method
console.log(challenge.repeat(2));


// Moving to exercise 2 of this day
console.log(`The quote 'There is no exercise better for the heart than reaching down and lifting people up.' by John Holmes teaches us to help one another.`)

console.log(`"Love is not patronizing and charity isn't about pity, it is about love. Charity and love are the same -- with charity you give love, so don't just give money but reach out your hand instead."`)

// checking if typeof '10' is equal to 10
console.log(typeof '10' === 10)

//checking if on is found in python and jargon
console.log('python'.includes('on') && 'jargon'.includes('on'))

console.log('I hope this course is not full of jargon'.includes('jargon'))

// generate a random number betwee 50 and 100
let num = Math.floor(Math.random() * (100 - 51) + 51);
console.log(num);

console.log('1 1 1 1 1\n2 1 2 4 8\n3 1 3 9 27\n4 1 4 16 64\n5 1 5 25 125');

// slicing out the phrase 'because because because'
console.log('You cannot end a sentence with because because because is a conjunction'.substring(31,54));


// Exercise 3
// counting the number of words in the sentence
console.log('Love is the best thing in this world. Some found their love and some are still looking for their love.'.length)

//counting the number of because in the sentence
console.log('You cannot end a sentence with because because because is a conjunction'.match(/because/g).length)

// cleaning and finding the most frequent word
let sentence = '%I $am@% a %tea@cher%, &and& I lo%#ve %te@a@ching%;. The@re $is no@th@ing; &as& mo@re rewarding as educa@ting &and& @emp%o@weri@ng peo@ple. ;I found tea@ching m%o@re interesting tha@n any ot#her %jo@bs. %Do@es thi%s mo@tiv#ate yo@u to be a tea@cher!? %Th#is 30#Days&OfJavaScript &is al@so $the $resu@lt of &love& of tea&ching'
sentence = sentence.replace(/[^a-zA-Z0-9\s]/g, '').split(' ')
//console.log(sentence)

let wordCount = {}
for (word in sentence){
    sentence[word] = sentence[word].toLowerCase()
    //console.log(sentence[word])
    if (sentence[word] in wordCount){
        wordCount[sentence[word]] += 1
    }else{
        wordCount[sentence[word]] = 1
    }
}

console.log(Object.keys(wordCount).reduce((a, b) =>{
    return wordCount[a] > wordCount[b] ? a : b
}))


// calculating the total income
let text = 'He earns 5000 euro from salary per month, 10000 euro annual bonus, 15000 euro online courses per month.'.match(/\d+/g)
let salary = parseInt(text[0])
let bonus = parseInt(text[1])
let onlineCourses = parseInt(text[2])
let totalIncome = (salary * 12) + bonus + (onlineCourses * 12)
console.log(`His total income is ${totalIncome} euro`)


