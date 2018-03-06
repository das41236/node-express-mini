const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const STATUS_USER_ERROR = 422;

// 1 Choose word,
// 2 dashes for every letter,
// 3 User guesses a letter,
// 4 checks if letter in word,
// 5 if letter in word, display letters,
// 6 wrong guess counter++ if wrong,
// 7 if word guessed, win game.
// 8 if counter === 6, lose game.


const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync('words.txt', 'utf8');
  return contents.split('\n');
};

const words = readWords();
const randomNumber = Math.floor(Math.random() * words.length);
const word = words[randomNumber];
const hidden = word => {
  const array = [];
  for (let i = 1; i < word.length; i++) {
    array.push('-')
  }
  return array.join('');
}

const bothWords = hidden(word) + ' ' + word;

const gCounter = 0;

const checkGuess = (arr, letter) => {
  // const matches = [];
  // const array = arr.split('');
  // array.forEach((element) => {
  //   if (arr.includes(element)) matches.push(element);
  // });
  // return matches;
  if (arr.includes(letter)) {
    return true;
  } else {
    gCounter++
  }
  return false;
}


server.get('/guess/', (req, res) => {
  res.status(200);
  res.send(bothWords);
});

server.post('/guess/:letter', (req, res) => {
  const { letter } = req.params;

})

// TODO: your code to handle requests

server.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } 
  else {
    console.log('server up and running...');
  }});



  // eslint src/*.js && 