/* Code adapted from the original Wordle source code and wordle-clone by Ian Lenehan (https://github.com/ianlenehan/wordle-clone) */

document.addEventListener("DOMContentLoaded", () => {

    let guessedWords = [[]];
    let availableSpace = 1;
    
    let gameState = 0;

    let word;
    let guessedWordCount = 0;
  
    const keys = document.querySelectorAll(".keyboard-row button");

    var solutionsList = sentences;

    var startDate = new Date(2022,4,12,0,0,0,0);

    function getSolution(solutionDate) {
        var index, differenceInDays = passValues(solutionDate);
        return index = differenceInDays % solutionsList.length,
        sentences[Math.abs(index)]
    }

    function passValues(solutionDate) {
        return daysSinceSentencleStart(startDate, solutionDate)
    }

    function daysSinceSentencleStart(startDate, solutionDate) {
        var start = new Date(startDate)
            , difference = new Date(solutionDate).setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);

        return Math.round(difference / 864e5) /* convert difference to days */
    }

    word = getSolution(new Date);
    word = "Now let me introduce my brother";
    let wordSolution = word.toLowerCase()
    let wordNoSpaces = wordSolution.replace(/\s+/g, '');

    createSquares(word);

    const animateCSS = (element, animation, duration = "0.5s", prefix = 'animate__') =>
        // We create a Promise and return it
        new Promise((resolve, reject) => {
            const animationName = `${prefix}${animation}`;
            const node = document.getElementById(element);
            node.style.setProperty('--animate-duration', duration);

            node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });

  
    function getCurrentWordArr() {
      const numberOfGuessedWords = guessedWords.length;
      return guessedWords[numberOfGuessedWords - 1];
    }
  
    function updateGuessedWords(letter) {
      const currentWordArr = getCurrentWordArr();
  
      if (currentWordArr && currentWordArr.length < wordNoSpaces.length) {
        currentWordArr.push(letter);
  
        const availableSpaceEl = document.getElementById(String(availableSpace));
  
        availableSpace = availableSpace + 1;
        availableSpaceEl.textContent = letter;
      }
    }
  
    function getTileColor(letter, index) {
      const isCorrectLetter = wordNoSpaces.includes(letter);
      console.log(isCorrectLetter);
      if (!isCorrectLetter) {
        return "rgb(76, 79, 93)";
      }
      /* rgb(58, 58, 60) */
      /* "rgb(76, 79, 93)"*/
  
      const letterInThatPosition = wordNoSpaces.charAt(index);
      const isCorrectPosition = letter === letterInThatPosition;
  
      if (isCorrectPosition) {
        return "rgb(83, 141, 78)";
      }
  
      return "rgb(181, 159, 59)";
    }

    function handleSubmitWord() {
      const currentWordArr = getCurrentWordArr();

      if (currentWordArr.length !== wordNoSpaces.length) {
        popUp("Not enough letters!");
        animateCSS("board", "shakeX", '0.6s');
        return
      }
  
      const currentWord = currentWordArr.join("");
      console.log(currentWord);
      console.log(wordNoSpaces);

      const firstLetterId = 1;
          const interval = 200;
          currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
              const tileColor = getTileColor(letter, index);
  
              const letterId = firstLetterId + index;
              const letterEl = document.getElementById(letterId);
              letterEl.classList.add("animate__flipInX");
              letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            }, interval * index);
          });
  
          guessedWordCount += 1;
  
          if (String(currentWord) === String(wordNoSpaces)) {
            popUpWin("Congratulations!");
            gameState = 1;
          } 
          else if (guessedWords.length === 1) {
            gameState = 1;
            popUpWin(`The sentence is "${word}."`);
          }
  
          guessedWords.push([]);
    }


  
    function createSquares(answer) {
      const gameBoard = document.getElementById("board");
  
      const sentenceSeparated = answer.split(" ");

      var lgth = 0;
      var longest;

      for (var i = 0; i < sentenceSeparated.length; i++) {
        if (sentenceSeparated[i].length > lgth) {
        var lgth = sentenceSeparated[i].length;
        longest = sentenceSeparated[i];
        }
    }

    
      let squareId = 0;
      for (wordorder = 0; wordorder < sentenceSeparated.length; wordorder++) {

          let row = document.createElement("div")
          row.classList.add("row");
          row.style.gridTemplateColumns = `repeat(${longest.length}, 1fr)`;
          gameBoard.appendChild(row);

          var currentWord = sentenceSeparated[wordorder]
          for (let index = 0; index < currentWord.length; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", squareId + 1);
            squareId += 1;
            row.appendChild(square);
        }
      }
    }

    function popUp(message) {
        var popUp = document.getElementById("failmessage");
        popUp.style.visibility="visible"
        popUp.innerHTML = message;

        animateCSS("failmessage", "fadeIn", "0.5s")
        setTimeout(() => {animateCSS("failmessage", "fadeOut", "2s")}, 3000);
        setTimeout(() => {popUp.style.visibility="hidden"}, 5000); 

    }

    function popUpWin(message) {
        var popUp = document.getElementById("failmessage");
        popUp.innerHTML = message;
        popUp.style.visibility="visible"

        animateCSS("failmessage", "fadeIn", "0.5s")

    }

  
    function handleDeleteLetter() {
      const currentWordArr = getCurrentWordArr();
      const removedLetter = currentWordArr.pop();
  
      guessedWords[guessedWords.length - 1] = currentWordArr;
  
      const lastLetterEl = document.getElementById(String(availableSpace - 1));
  
      lastLetterEl.textContent = "";
      availableSpace = availableSpace - 1;
    }
  
    for (let i = 0; i < keys.length; i++) {
      keys[i].onclick = ({ target }) => {
        const letter = target.getAttribute("data-key");
  
        if (letter === "enter") {
          if (gameState != 1) {
                handleSubmitWord();
                return;
            }
        }
  
        if (letter === "del") {
            if (gameState != 1) {
                handleDeleteLetter();
                return;
            }
        }
        try {
            updateGuessedWords(letter);
        } catch (error) {
            return;
        }
      };
    }
  });
  