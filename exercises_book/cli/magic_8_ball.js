const prompt = require('prompt-sync')({sigint: true});

let ball = ['Yes', 'No', 'Maybe','Ask again later']

function randomBall(){
    let random = Math.floor(Math.random()*ball.length)
    return ball[random]
}

function askQuestion(question){
    let response = prompt(question)
    if (response === ''){
        console.log('Please ask a question')
        return askQuestion(question)
    }
    return response
}

function main(){
    try{
    askQuestion('What is your question? ')
    let answer = randomBall()
    console.log(`${answer}.`)
    }catch(e){
        console.log(e)
    }
}

if (require.main === module){
    main()
}

