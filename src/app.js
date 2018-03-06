const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync('words.txt', 'utf8');
  return contents.split('\n');
};

let guessCounter = 0;
const guessedLetters = [];

const getWord = () => {
  const words = readWords();
  const randomNumber = Math.floor(Math.random() * 235886);
  const word = words[randomNumber];
  return word;
};

const finalWord = getWord();
let hiddenWord = '';
const hidden = () => {
  for (let i = 0; i < finalWord.length - 1; i++) {
    hiddenWord += '-';
  }
};


const guessCheck = letter => {
  let retWord = '';
  let flag = false;
  for (let i = 0; i < finalWord.length - 1; i++) {
    if (finalWord[i] === letter) {
      retWord += finalWord[i];
      flag = true;
    } else if (hiddenWord[i] !== '-') retWord += hiddenWord[i];
    else {
      retWord += '-';
    }
  }
  if (flag === false) guessCounter++;
  return (hiddenWord = retWord);
};

const duplicate = letter => {
  let flag = true;
  let count = 0;
  guessedLetters.push(letter);
  for (let i = 0; i < guessedLetters.length; i++) {
    if (guessedLetters[i] === letter) count++;
  }
  if (count > 1) flag = false;
  return flag;
};

server.get('/guess', (req, res) => {
  if (guessedLetters.length === 0) hidden();
  res.status(200);
  res.send(hiddenWord);
});

server.post('/guess', (req, res) => {
  // When this object is passed into the body:
  // {
  //   "letter": "a"
  // }
  // below, letter will equal a
  let { letter } = req.body;
  if (letter.length !== 1) letter = null;
  if (req.body.letter && duplicate(letter)) {
    guessCheck(letter);
    res.status(200);
    if (guessCounter === 6) {
      res.send(`You Guessed Incorrectly 6 Times, the Secret Word Was ${finalWord} You Lose!`);
    } else if (hiddenWord === finalWord) {
      res.send(`You Win!, the Secret Word Was ${finalWord}, Good Job!`);
    } else {
      res.send(hiddenWord + '\n' + `Guesses: ${guessedLetters}\n${guessCounter}/6 Incorrect Guesses`);
    }
  } else {
    res.status(422);
    res.send({ error: 'You failed to provide a single letter or tried a duplicate letter' });
  }
});

server.listen(3000);
