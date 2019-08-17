    $(document).ready(function() {


      var secretWordStuff = {
        wordBank : ['astronaut', 'asteroid', 'galaxy', 'jupiter', 'moon', 'alien', 'gravity', 'orbid'],
        generateRandomSecretWord : function () {
          var randomIndexNumber = Math.floor(secretWordStuff.wordBank.length*(Math.random()));
          secretWord = secretWordStuff.wordBank[randomIndexNumber];
          return secretWord;
        },
        getSecretWordFromUser : function (){
          secretWord = prompt ("Enter your secret word here. Make sure your opponent doesn't see what you are typing.");
          if (secretWord.length < 3) {
            secretWord = prompt("That's too easy. Try entering a secret word with at least 3 letters.");
          }
          for (var i=0; i< secretWord.length; i++) { //secret word should be one word only, no spaces
            if (secretWord[i] === " ") {
              secretWord = prompt ('Try entering one word only, without any spaces.');
            }
          }
          return secretWord;
        },
        showHiddenLetterList : function() {
          var hiddenLetterArray = [];
          for (var i=0; i<game.secretWord.length; i++) {
            hiddenLetterArray.push('_ ');
            $('#hiddenLetterList').append('<span id=letter-'+i+'>'+hiddenLetterArray[i]+'</span>');
          }
        }
      };
    
    
      var game = {
        isOngoing : false,
        startGame : function () {
          if (difficulty.difficultyLevel === 'two-player') {
            game.secretWord = secretWordStuff.getSecretWordFromUser();
          } else {
            game.secretWord = secretWordStuff.generateRandomSecretWord();
          }
          game.isOngoing = true;
          secretWordStuff.showHiddenLetterList();
          letterBoard.showLetters();
          $('#startButton').remove();
          $('#resetButtonContainer').html('<button id="resetButton" class="button">Reset Game</button>');
          $('#letterBoard').prop('disabled', false);
        },
        numberOfGuessesRemaining : 10,
        numberOfCorrectGuesses: 0,
        secretWord : secretWordStuff.generateRandomSecretWord(),
        evaluateGuess : function (theClickedLetter, theSecretWord) {
          var numberLettersTheGuessDoesNotMatch = 0;
          for (var i=0; i<theSecretWord.length; i++) {
            if(theClickedLetter === (theSecretWord[i]).toUpperCase()){
               $('#letter-'+i).html(theSecretWord[i]);
               game.numberOfCorrectGuesses ++;
               if (game.numberOfCorrectGuesses === theSecretWord.length) {
                 game.endGame("You Win!");
                 scoreBoard.incrementWinScore();
                }
              }
            else if (theClickedLetter !== (theSecretWord[i]).toUpperCase()){
              numberLettersTheGuessDoesNotMatch ++;
            }
          }
          if (numberLettersTheGuessDoesNotMatch === theSecretWord.length) { //if the guessed letter matches none of the letters in the secret word
            if (game.numberOfGuessesRemaining >= 1) { //don't continue to decrement # guesses left if you get to 0
              game.numberOfGuessesRemaining --;
              $('#numberOfGuessesRemaining').html(game.numberOfGuessesRemaining);
            }
          }
          if (game.numberOfGuessesRemaining === 0) {
            game.endGame('You Lose');
            scoreBoard.incrementLoseScore();
          }
      
        },
        endGame : function (winOrLossMessage) {
          game.isOngoing = false;
          $('#letterBoard').prop('disabled', true); //so nothing happens if you click the win message
          $('#letterBoard').html('<span class="winOrLossMessage" style="padding: 50px;">'+winOrLossMessage+'</span>'); //I want padding around only the win message, not the letter board
          $('#hiddenLetterList').html(game.secretWord);
          $('#resetButton').html('Play Again');
        },
        resetGame : function () {
          //called by reset/play again button click or difficulty level change
          if (difficulty.difficultyLevel === 'two-player') {
            game.secretWord = secretWordStuff.getSecretWordFromUser();
          } else {
            game.secretWord = secretWordStuff.generateRandomSecretWord();
          }
          $('#hiddenLetterList').empty();
          $('#letterBoard').empty();
          if (difficulty.difficultyLevel === 'easy' || difficulty.difficultyLevel ==='two-player') {
            game.numberOfGuessesRemaining = 10;
          } else if (difficulty.difficultyLevel === 'hard') {
            game.numberOfGuessesRemaining = 4;
          }
          $('#numberOfGuessesRemaining').html(game.numberOfGuessesRemaining);
          game.numberOfCorrectGuesses = 0;
          game.isOngoing = true;
          secretWordStuff.showHiddenLetterList();
          letterBoard.showLetters();
          $('#startButton').remove();
          $('#resetButtonContainer').html('<button id="resetButton" class="button">Reset Game</button>');
          $('#letterBoard').prop('disabled', false);
          // game.startGame(); //this could be more dry but I ended up repeating some of the stateGame function in resetGame after I broke everything when I added difficulty modes
        }
      };
    
    
    
      var letterBoard = {
        lettersArray : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        showLetters : function() {
          for (var i=0; i<letterBoard.lettersArray.length; i++) {
            $('#letterBoard').append('<button class="letter">'+letterBoard.lettersArray[i]+'</button>');
          }
          $('#letterBoard').prop('disabled', false);
        },
        disableGuessedLetters : function (theClickedLetter) {
            theClickedLetter.addClass('disabled');
            theClickedLetter.prop('disabled', true);
        }
      };
    
    
    
      var difficulty = {
        difficultyLevel : 'easy',
        setDifficulty : function(theClickedDifficulty) {
          //only change difficulty if game is not ongoing, or if player confirms game reset
          if (game.isOngoing === true) {
            if (confirm("Are you sure? This will reset your game.") === true) {
              theClickedDifficulty.addClass('clicked');
              if (theClickedDifficulty.attr('id') === 'hard') {
                difficulty.difficultyLevel = 'hard';
                $('#easy').removeClass('clicked');
                $('#two-player').removeClass('clicked');
              } else if (theClickedDifficulty.attr('id') === 'easy') {
                difficulty.difficultyLevel = 'easy';
                $('#hard').removeClass('clicked');
                $('#two-player').removeClass('clicked');
              } else if (theClickedDifficulty.attr('id') === 'two-player') {
                difficulty.difficultyLevel = 'two-player';
                $('#hard').removeClass('clicked');
                $('#easy').removeClass('clicked');
              }
              game.resetGame();
            }
          } else if (game.isOngoing === false) {
            theClickedDifficulty.addClass('clicked');
            if (theClickedDifficulty.attr('id') === 'hard') {
              difficulty.difficultyLevel = 'hard';
              $('#easy').removeClass('clicked');
              $('#two-player').removeClass('clicked');
              //don't change the number of guesses remaining if you are on the win/lose screen
              if (game.numberOfGuessesRemaining !==0 && game.numberOfCorrectGuesses !== game.secretWord.length)
                {game.numberOfGuessesRemaining = 4;
              }
            } else if (theClickedDifficulty.attr('id') === 'easy') {
              difficulty.difficultyLevel = 'easy';
              $('#hard').removeClass('clicked');
              $('#two-player').removeClass('clicked');
              if (game.numberOfGuessesRemaining !==0 && game.numberOfCorrectGuesses !== game.secretWord.length) {
                game.numberOfGuessesRemaining = 10;
              }
            } else if (theClickedDifficulty.attr('id') === 'two-player') {
              difficulty.difficultyLevel = 'two-player';
              $('#hard').removeClass('clicked');
              $('#easy').removeClass('clicked');
              if (game.numberOfGuessesRemaining !==0 && game.numberOfCorrectGuesses !== game.secretWord.length) {
                game.numberOfGuessesRemaining = 10;
              }
            }
            $('#numberOfGuessesRemaining').html(game.numberOfGuessesRemaining);
          }
        }
      }
    
    
      var scoreBoard = {
        gamesWon : 0,
        gamesLost : 0,
        incrementWinScore : function() {
          scoreBoard.gamesWon++;
          $('#number-of-games-won').html(scoreBoard.gamesWon);
        },
        incrementLoseScore : function() {
          scoreBoard.gamesLost++;
          $('#number-of-games-lost').html(scoreBoard.gamesLost);
        },
        resetScore : function() {
          scoreBoard.gamesWon = 0;
          scoreBoard.gamesLost = 0;
          $('#number-of-games-won').html(scoreBoard.gamesWon);
          $('#number-of-games-lost').html(scoreBoard.gamesLost);
        }
      };
    
      var buttonHandlers = {
        startClickHandler : function(event) {
          //  if (difficulty.difficultyLevel === 'easy' || difficulty.difficultyLevel ==='hard') {
          //   game.secretWord = secretWordStuff.generateRandomSecretWord();
          // } else if (difficulty.difficultyLevel === 'two-player') {
          //   game.secretWord = secretWordStuff.getSecretWordFromUser();
          // }
          game.startGame();
        },
        letterClickHandler : function (event) {
          event.stopPropagation();
          var $theClickedLetter = $(event.target);
          if (game.isOngoing === true && $theClickedLetter.attr('id') !== 'letterBoard') { //so nothing happens if user clicks on letterBoard parent div instead of letter button
            game.evaluateGuess($theClickedLetter.html(), game.secretWord);
            letterBoard.disableGuessedLetters($theClickedLetter);
          }
        },
        resetClickHandler : function (event) {
          if (game.isOngoing === true){
            if (confirm('Are you sure you want to reset the game?') === true) {
              game.resetGame();
            } else {
              return;
            }
          } else if (game.isOngoing === false) {
            game.resetGame();
          }
        },
        resetScoreBoardHandler : function(event) {
          scoreBoard.resetScore();
        },
        difficultyButtonHandler : function(event) {
          event.preventDefault();
          event.stopPropagation();
          var $theClickedDifficultyButton = $(event.target);
          //only change the difficulty if different from the current difficulty
          if ($theClickedDifficultyButton.attr('id') === difficulty.difficultyLevel) {
            return;
          } else if ($theClickedDifficultyButton.attr('id') !== difficulty.difficultyLevel) {
            difficulty.setDifficulty($theClickedDifficultyButton);
          }
        },
      };
    
    
      $('#startButton').on('click', buttonHandlers.startClickHandler);
      $('#letterBoard').on('click', buttonHandlers.letterClickHandler);
      $('#resetButtonContainer').on('click', '#resetButton', buttonHandlers.resetClickHandler);
      $('#reset-score-board').on('click', buttonHandlers.resetScoreBoardHandler);
      $('.difficulty-button').on('click', buttonHandlers.difficultyButtonHandler);
    
    });    