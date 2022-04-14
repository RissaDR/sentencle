/* Code adapted from the original Wordle source code and wordle-clone by Ian Lenehan (https://github.com/ianlenehan/wordle-clone) */

document.addEventListener("DOMContentLoaded", () => {

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
    let emoteArray = [];
    //⬜🟨🟩
    let word;
    let gameState;

    var startDate = new Date(2022,3,12,0,0,0,0);
    var todayDate = new Date();
    todayDate.setHours(0,0,0,0);
    let todayDateS = String(todayDate);
    var todayCompleted;

    initStatsModal();
    initHelpModal();

    let guessedWords = [[]];
    let availableSpace = 1;

    let guessedWordCount = 0;
    let guessesCorrect = 0;

    const sentencleDay = daysSinceSentencleStart(startDate, todayDate);
  
    const keys = document.querySelectorAll(".keyboard-row button");

    var solutionsList = sentences;

    function loadLocalStorage() {
      const storedBoardContainer = window.localStorage.getItem("boardContainer");

      if (storedBoardContainer) {
        document.getElementById("board-container").innerHTML =
          storedBoardContainer;
      }

      for (var i = 0; i < wordNoSpaces.length; i++) {
        const squareStyle = window.localStorage.getItem("squareStyle" + i);
        document.getElementById(i + 1).style = squareStyle;
        }
      }
    
    function preserveGameState() {
      const boardContainer = document.getElementById("board-container");
      window.localStorage.setItem("boardContainer", boardContainer.innerHTML);
    }

    function initLocalStorage() {
      const wordleLastCompleted = window.localStorage.getItem("wordleLastCompleted");

      if (wordleLastCompleted !== todayDateS) {
        createSquares(word);
        gameState = 0;
        window.localStorage.setItem("localGameState", 0);
        window.localStorage.removeItem("wordleLastCompleted");
        window.localStorage.removeItem("sentencleSharing");
        window.localStorage.removeItem("boardContainer");
        window.localStorage.removeItem("squareStyle");
      } else {
        loadLocalStorage();
        gameState = 1; /*localGameState stores a different number and serves for the popup.*/
      }

      if (window.localStorage.getItem("localGameState") == 2) {
        popUpWin(`The sentence today was "${word}."`);
      } else if (window.localStorage.getItem("localGameState") == 1) {
        popUpWin(`Congratulations!`);
      }
    }

    function initHelpModal() {
      const modal = document.getElementById("help-modal");
  
      // Get the button that opens the modal
      const btn = document.getElementById("help");
      btn.setAttribute("help", "stats");

      [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((letter, index) => {
        setTimeout(() => {
          animateCSS(`helpsquares${index}`, "flipInX")
          const square = document.getElementById(`helpsquares${index}`);
          square.style = `background-color:rgb(83, 141, 78);border-color:rgb(83, 141, 78)`;
        });
      }
      );
  
      // Get the <span> element that closes the modal
      const span = document.getElementById("close-help");

      // When the user clicks on the button, open the modal
      btn.addEventListener("click", function () {
        modal.style.display = "block";
        [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((letter, index) => {
          setTimeout(() => {
            animateCSS(`helpsquares${index}`, "flipInX")
            const square = document.getElementById(`helpsquares${index}`);
            square.style = `background-color:rgb(83, 141, 78);border-color:rgb(83, 141, 78)`;
          });
        });
        
      });
  
      // When the user clicks on <span> (x), close the modal
      span.addEventListener("click", function () {
        modal.style.display = "none";
        const isFirstTime = window.localStorage.setItem("firstTime", "false");
      });
  
      // When the user clicks anywhere outside of the modal, close it
      window.addEventListener("click", function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      });

      const isFirstTime = window.localStorage.getItem("firstTime");
      if (isFirstTime == "false") {
        modal.style.display = "none";
      }
    }
  
    function initStatsModal() {
      const modal = document.getElementById("stats-modal");
  
      // Get the button that opens the modal
      const btn = document.getElementById("stats");
      btn.setAttribute("id", "stats");
  
      // Get the <span> element that closes the modal
      const span = document.getElementById("close-stats");
  
      // When the user clicks on the button, open the modal
      btn.addEventListener("click", function () {
        updateStatsModal();
        // update stats here
        modal.style.display = "block";
      });
  
      // When the user clicks on <span> (x), close the modal
      span.addEventListener("click", function () {
        modal.style.display = "none";
      });
  
      // When the user clicks anywhere outside of the modal, close it
      window.addEventListener("click", function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      });
    }


    function updateTotalGames() {
      const totalGames = window.localStorage.getItem("totalGames") || 0;
      window.localStorage.setItem("totalGames", Number(totalGames) + 1);
    }

    function updateStatsModal() {
      const currentStreak = window.localStorage.getItem("currentStreak") || 0;
      const totalWins = window.localStorage.getItem("totalWins") || 0;
      const totalGames = window.localStorage.getItem("totalGames") || 0;
  
      document.getElementById("total-played").innerHTML = totalGames;
      document.getElementById("total-wins").textContent = totalWins;
      document.getElementById("current-streak").textContent = currentStreak;
  
      const winPct = Math.round((totalWins / totalGames) * 100) || 0;
      document.getElementById("win-pct").textContent = winPct + "%";

      if (totalGames > 0 && winPct === 0) {
        document.getElementById("win-pct").innerHTML += ` <span style="color: #dfbbb1"> — No wins yet... with enough <i>senten-acity</i>, maybe you'll score a win!</span>`
      }
    }

    function getSolution(solutionDate) {
        var index, differenceInDays = passValues(solutionDate);
        return index = differenceInDays % solutionsList.length,
        sentences[Math.abs(index)]
    }

    function passValues(solutionDate) {
        return daysSinceSentencleStart(startDate, solutionDate)
    }

    function daysSinceSentencleStart(startDate, solutionDate) {
        var start = startDate
            , difference = solutionDate.setHours(0,0,0,0) - start.setHours(0,0,0,0);

        return Math.abs(Math.round(difference / (1000*60*60*24))) /* convert difference to days */
    }

    word = getSolution(todayDate);
    let wordSolution = word.toLowerCase()
    let wordNoSpaces = wordSolution.replace(/\s+/g, '');

    initLocalStorage();

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

      const firstLetterId = 1;
          const interval = 200;
          currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
              const tileColor = getTileColor(letter, index);

              const letterId = firstLetterId + index;
              const letterEl = document.getElementById(letterId);
              letterEl.classList.add("animate__flipInX");
              letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
              window.localStorage.setItem("squareStyle" + index, `background-color:${tileColor};border-color:${tileColor}`);
            }, interval * index);
          }
          );
  
          guessedWordCount += 1;

          let cindex = 0;
          for (var i = 0; i < word.length; i++) {
            if (word[i] == " ") {
              emoteArray.push(" ");
            }
            else {
              const tileColor = getTileColor(currentWordArr[cindex], cindex);
              cindex += 1;
              let emote;

              if (tileColor == "rgb(83, 141, 78)") {
                emote = "🟩";
              } else if (tileColor == "rgb(181, 159, 59)") {
                emote = "🟨";
              } else if (tileColor == "rgb(76, 79, 93)") {
                emote = "⬜";
              }

              emoteArray.push(emote);
              }
            }
  
          if (String(currentWord) === String(wordNoSpaces)) {
            popUpWin("Congratulations!");

            updateTotalGames();

            let sentencleShare = `Sentencle 1/1 #${sentencleDay}\n${emoteArray.join("")}\nhttps://www.sentencle.xyz/`;

            gameState = 1;
            window.localStorage.setItem("localGameState", 1);
            todayCompleted = todayDateS;
            window.localStorage.setItem("wordleLastCompleted", todayDateS);

            const totalWins = window.localStorage.getItem("totalWins") || 0;
            window.localStorage.setItem("totalWins", Number(totalWins) + 1);

            const currentStreak = window.localStorage.getItem("currentStreak") || 0;
            window.localStorage.setItem("currentStreak", Number(currentStreak) + 1);

            const sentencleSharing = window.localStorage.getItem("sentencleSharing") || null;
            window.localStorage.setItem("sentencleSharing", sentencleShare);

            preserveGameState();


            guessesCorrect += 1;
          } 
          else if (guessedWords.length === 1) {
            popUpWin(`The sentence is "${word}."`);

            updateTotalGames();

            let sentencleShare = `Sentencle 0/1 #${sentencleDay}\n\n${emoteArray.join("")}\n\nhttps://www.sentencle.xyz/`;

            gameState = 2;
            window.localStorage.setItem("localGameState", 2);
            todayCompleted = todayDateS;
            window.localStorage.setItem("wordleLastCompleted", todayDateS);

            const totalWins = window.localStorage.getItem("totalWins") || 0;
            window.localStorage.setItem("currentStreak", 0);

            const sentencleSharing = window.localStorage.getItem("sentencleSharing") || null;
            window.localStorage.setItem("sentencleSharing", sentencleShare);

            preserveGameState();
          }
  
          guessedWords.push([]);
    }
    document.getElementById("share").onclick = function copyToClipboard() {
      let results = window.localStorage.getItem("sentencleSharing")
      var share = document.getElementById("share");
      share.innerHTML = "Results copied to clipboard!";
      navigator.clipboard.writeText(results);
      console.log();
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

        var share = document.getElementById("share");
        share.style.visibility="visible"

        animateCSS("failmessage", "fadeIn", "0.5s")
        animateCSS("share", "fadeIn", "0.5s")

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
      keys[i].addEventListener("click", function (target) {
        const letter = keys[i].getAttribute("data-key");
  
        if (letter === "enter") {
          if (gameState == 0) {
                handleSubmitWord();
                return;
            } else {
              return;
            }
        }
  
        if (letter === "del") {
            if (gameState == 0) {
                handleDeleteLetter();
                return;
            }
            else {
              return;
            }
        }
        
        try {
          if (gameState == 0) {
            updateGuessedWords(letter);
          } else {
            return;
          }
        } catch (error) {
            return;
        }
      });
    }
    
  });
  