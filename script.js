// =================
// ===global vars===
// =================

let playerInfo = [
  {
    player: 1,
    username: "Player 1",
    color: "#B70B0D",
    wins: 0,
  },
  {
    player: 2,
    username: "Player 2",
    color: "#FFB401",
    wins: 0,
  },
];

// ========================
// =========Selectors======
// ========================

// ----init modal----
const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modal-content");
const modalHeader = document.querySelector(".modal-header");
const modalText = document.querySelector(".modal-text");

// ---- rules modal-----
const rulesModal = document.querySelector("#rules-modal");

// -----buttons----
const btnsGetGrid = document.querySelectorAll(".btn-grid-choice"); // NODE LIST
const btnsRules = document.querySelectorAll(".btn-rules");
const btnStartGame = document.querySelector(".btn-start-game");
const btnResetGame = document.querySelector(".btn-reset-game");
const btnPlayAgain = document.querySelector(".btn-play-again");

// Info Bar
let displayScoreP1 = document.querySelector(".display-score-1");
let displayScoreP2 = document.querySelector(".display-score-2");

// ----Game Board------
const gridContainer = document.querySelector("#grid-container");

// ----Results Banner----
const resultsBanner = document.querySelector("#results-banner");
const resultsHeader = document.querySelector(".results-header");

// ==========================================
// ======Getting PLayer 1 Input==============
// ==========================================

// Getting username and color choice for player 1
document.querySelector(".btn-player1").onclick = function () {
  // pull username and color values from landing page modal
  let username = document.querySelector(".input-username1").value;
  let color = document.querySelector(".color-player1").value;

  // if no username is input, default of Player 1 will remain, otherwise update object
  if (username) {
    playerInfo[0].username = username;
  }
  // if the user changes the color from default yellow, update object
  if (color !== playerInfo[0].color) {
    playerInfo[0].color = color;
  }

  // display updated name on gameboard
  let displayUsername1 = document.querySelector(".display-username1");
  displayUsername1.innerText = playerInfo[0].username;
};
// ==========================================
// ======Getting PLayer 2 Input==============
// ==========================================

document.querySelector(".btn-player2").onclick = function () {
  // pull username and color values from landing page modal
  let username = document.querySelector(".input-username2").value;
  let color = document.querySelector(".color-player2").value;
  this.style.backgroundColor = "rgb()";

  // if no username is input, default of Player 2 will remain, otherwise update object
  if (username) {
    playerInfo[1].username = username;
  }
  // if the user changes the color from default yellow, update object
  if (color !== playerInfo[1].color) {
    playerInfo[1].color = color;
  }

  // display updated name on gameboard
  let displayUsername2 = document.querySelector(".display-username2");
  displayUsername2.innerText = playerInfo[1].username;
};

// ==========================================
// ======Creating gameboard==================
// ==========================================

btnsGetGrid.forEach((btn) => btn.addEventListener("click", init));

function init() {
  // set default active player
  const displayActivePlayer = document.querySelector(".active-player");
  displayActivePlayer.innerText = playerInfo[0].username;

  btnResetGame.addEventListener("click", resetGame);
  btnPlayAgain.addEventListener("click", resetGame);
  btnsRules.forEach((btn) => btn.addEventListener("click", toggleRulesModal));

  // get gameboard
  let rows, columns;
  // break up the button text into rows and columns
  let rowsColsArr = this.innerText.split("x");
  // assign rows and columns based on new array
  rows = rowsColsArr[0];
  columns = rowsColsArr[1];

  // Generate HTML gameboard using CSS grid
  gridContainer.style.gridTemplateColumns = `repeat(${columns}, auto)`;
  gridContainer.style.gridTemplateRows = `repeat(${rows}, auto)`;

  // create each column and append it to container
  for (let i = 0; i < columns; i++) {
    let column = document.createElement("div");
    column.classList.add("column" + i, "column");
    gridContainer.appendChild(column);
    // blank 2d array

    let colX = document.querySelector(".column" + i);

    // Nested loop to generate each cell and append to COLUMN before creating next column
    for (let j = 0; j < rows; j++) {
      let cell = document.createElement("div");
      cell.classList.add(`cell`, `row${j}`);
      colX.appendChild(cell);
    }
  }

  let cells = document.querySelectorAll(".cell");

  // Empty javascript board array
  let boardArr = [];

  for (let i = 0; i < rows; i++) {
    let rowArr = [];
    for (let j = 0; j < columns; j++) {
      rowArr.push("x");
    }
    boardArr.push(rowArr);
  }

  // hide the modal so player can access game
  modal.classList.remove("visible");
  modal.classList.add("hidden");

  // set starting turn counter
  let turnCount = 1;

  // Select each column and give event listener to run game turn
  let gameColumns = document.querySelectorAll(".column");

  gameColumns.forEach((column) => {
    column.addEventListener("click", turn);
    column.addEventListener("mouseenter", mouseEnterColumn);
    column.addEventListener("mouseleave", mouseExitColumn);
  });

  // ======================================
  // =============Turn=====================
  // ======================================

  // turn functionality for game progression
  function turn() {
    // determine active player
    let activePlayer = 0;
    turnCount % 2 !== 0 ? (activePlayer = 0) : (activePlayer = 1);
    // current turn will show username of active player
    document.querySelector(".active-player").innerText =
      playerInfo[`${activePlayer - 1}`.username];

    // update html board and JS array
    // This function will start at the column button, then move up through the siblings (cells) and determine if 1) they are not the original button and 2) that they don't contain class occupied. If the cell is free, it will stop. If not, it will move up 1
    let findFirstCell = function (column) {
      let sibling = column.lastChild;

      while (sibling.previousSibling || sibling.classList.contains("row0")) {
        if (sibling !== column && !sibling.classList.contains("occupied")) {
          sibling.classList.add("occupied");
          sibling.style.backgroundColor = playerInfo[`${activePlayer}`].color;

          // seperating the number from each row/column class name to get XY coords
          let x = parseInt(sibling.parentNode.classList[0].split("column")[1]);
          let y = parseInt(sibling.classList[1].split("row")[1]);

          // inserting those coords into JS array
          boardArr[y][x] = activePlayer;

          break;
        } else if (sibling.classList.contains("occupied")) {
          sibling = sibling.previousSibling;
          continue;
        } else if (sibling.classList.contains("row0")) {
          sibling.style.backgroundColor =
            playerInfo[`${activePlayer - 1}`].color;
        }
      }
    };
    findFirstCell(this);

    function isCellFull(column) {
      // If the column is full, remove event listeners and styling. Otherwise an error will trip since no previous sibling exists
      if (column.firstChild.classList.contains("occupied")) {
        column.removeEventListener("click", turn);
        column.removeEventListener("mouseenter", mouseEnterColumn);
        column.removeEventListener("mouseleave", mouseExitColumn);

        column.style.transform = "none";
        column.style.backgroundColor = "rgba(0, 0, 0, 0)";
      }
    }
    isCellFull(this);

    // // check win conditions
    function checkDraw() {
      for (i = 0; i < boardArr.length; i++) {
        for (let j = 0; j < boardArr[i].length; j++) {
          if (!boardArr[0].includes("x")) {
            gameDraw();
          }
        }
      }
    }
    checkDraw();

    function checkHorizontal() {
      for (let i = 0; i < boardArr.length; i++) {
        for (let j = 0; j < boardArr[i].length; j++) {
          if (boardArr[i][j] == `${activePlayer}`) {
            if (
              boardArr[i][j + 1] == `${activePlayer}` &&
              boardArr[i][j + 2] == `${activePlayer}` &&
              boardArr[i][j + 3] == `${activePlayer}`
            ) {
              gameWon();
            }
          }
        }
      }
    }
    checkHorizontal();

    function checkVertical() {
      for (let i = 0; i < boardArr.length; i++) {
        for (let j = 0; j < boardArr[i].length; j++) {
          if (boardArr[i][j] == `${activePlayer}` && i >= 3) {
            if (
              boardArr[i - 1][j] == `${activePlayer}` &&
              boardArr[i - 2][j] == `${activePlayer}` &&
              boardArr[i - 3][j] == `${activePlayer}`
            ) {
              gameWon();
            }
          }
        }
      }
    }
    checkVertical();

    function checkDiagonal() {
      // check down right
      for (let i = 0; i < boardArr.length; i++) {
        for (let j = 0; j < boardArr[i].length; j++) {
          if (boardArr[i][j] == `${activePlayer}` && i >= 3) {
            if (
              // checking up and right
              boardArr[i][j] == boardArr[i - 1][j + 1] &&
              boardArr[i][j] == boardArr[i - 2][j + 2] &&
              boardArr[i][j] == boardArr[i - 3][j + 3]
            ) {
              gameWon();
            }
            if (
              // checking up and left
              boardArr[i][j] == boardArr[i - 1][j - 1] &&
              boardArr[i][j] == boardArr[i - 2][j - 2] &&
              boardArr[i][j] == boardArr[i - 3][j - 3]
            ) {
              gameWon();
            }
          }
        }
      }
    }
    checkDiagonal();

    // add to turn counter
    turnCount++;

    // MUST REDETERMINE ACTIVE PLAYER AFTER TURN COUNT INCREMENTS OR YOU WILL GET A 1 OFF ERROR ON DISPLAY NAME
    // determine active player
    turnCount % 2 !== 0 ? (activePlayer = 0) : (activePlayer = 1);
    // // update active player display
    displayActivePlayer.innerText =
      playerInfo[Number(`${activePlayer}`)].username;
  }

  function resetGame() {
    // reset turns and active player
    activePlayer = 0;
    displayActivePlayer.innerText = playerInfo[0].username;
    turnCount = 1;

    // remove "occupied" class from every cell and reset color
    cells.forEach((cell) => {
      cell.classList.remove("occupied");
      cell.style.backgroundColor = "rgb(255, 242, 189)";
    });

    if (resultsBanner.classList.contains("visible")) {
      resultsBanner.classList.remove("visible");
      resultsBanner.classList.add("hidden");
    }
    reattachEventListeners();

    // regenerate boardArr with x's
    boardArr = [];

    for (let i = 0; i < rows; i++) {
      let rowArr = [];
      for (let j = 0; j < columns; j++) {
        rowArr.push("x");
      }
      boardArr.push(rowArr);
    }
  }

  // when mouse enters column, highlight that column by scaling up and adding gradient
  function mouseEnterColumn() {
    this.style.transform = "scale(1.1)";
    this.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    this.style.borderRadius = "50px";
  }
  // when mouse leaves previous column, revert styling to default
  function mouseExitColumn() {
    this.style.transform = "none";
    this.style.backgroundColor = "rgba(0, 0, 0, 0)";
    this.style.borderRadius = "0";
  }

  function clearEventListeners() {
    // remove event listeners to prevent players from moving after win
    gameColumns.forEach((column) => {
      column.removeEventListener("click", turn);
      column.removeEventListener("mouseenter", mouseEnterColumn);
      column.removeEventListener("mouseleave", mouseExitColumn);
    });
  }

  function reattachEventListeners() {
    // remove event listeners to prevent players from moving after win
    gameColumns.forEach((column) => {
      column.addEventListener("click", turn);
      column.addEventListener("mouseenter", mouseEnterColumn);
      column.addEventListener("mouseleave", mouseExitColumn);
    });
  }

  function removeColumnStyles() {
    // remove styles or the last column to invoke turn() will be stuck with styling
    gameColumns.forEach((column) => {
      column.style.transform = "none";
      column.style.backgroundColor = "rgba(0, 0, 0, 0)";
    });
  }

  function gameWon() {
    // bring activePlayer into scope
    turnCount % 2 !== 0 ? (activePlayer = 1) : (activePlayer = 2);
    // update playerInfo wins and display wins
    playerInfo[activePlayer - 1].wins++;
    displayScoreP1.innerText = playerInfo[0].wins;
    displayScoreP2.innerText = playerInfo[1].wins;

    // remove column events
    removeColumnStyles();
    clearEventListeners();

    // style and show results banner
    resultsHeader.innerText = `${playerInfo[activePlayer - 1].username} wins!`;
    showResultsBanner();
  }

  function gameDraw() {
    removeColumnStyles();
    clearEventListeners();
    resultsHeader.innerText = "Draw!";
    showResultsBanner();
  }

  function showResultsBanner() {
    resultsBanner.classList.remove("hidden");
    resultsBanner.classList.add("visible");
  }

  function toggleRulesModal() {
    if (rulesModal.classList.contains("visible")) {
      rulesModal.classList.add("hidden");
      rulesModal.classList.remove("visible");
    } else {
      rulesModal.classList.add("visible");
      rulesModal.classList.remove("hidden");
    }
  }
}
