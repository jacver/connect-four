// =================
// ===global vars===
// =================

let playerInfo = [
  {
    player: 1,
    username: "Player 1",
    color: "#FFFF00",
    wins: 0,
    active: true,
  },
  {
    player: 2,
    username: "Player 2",
    color: "#ff0000",
    wins: 0,
    active: false,
  },
];

// ========================
// =========Selectors======
// ========================

// ----modal----
const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modal-content");
const modalHeader = document.querySelector(".modal-header");
const modalText = document.querySelector(".modal-text");

// -----buttons----
const btnsGetGrid = document.querySelectorAll(".btn-grid-choice"); // NODE LIST
const btnRules = document.querySelector(".btn-rules");
const btnStartGame = document.querySelector(".btn-start-game");
const btnResetGame = document.querySelector(".btn-reset-game");

// ----Game Board------
const gridContainer = document.querySelector("#grid-container");

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
    // let rowArr = [];

    let colX = document.querySelector(".column" + i);

    // Nested loop to generate each cell and append to COLUMN before creating next column
    for (let j = 0; j < rows; j++) {
      let cell = document.createElement("div");
      cell.classList.add(`cell`, `row${j}`);
      colX.appendChild(cell);
      // rowArr.push(" ");
    }
  }

  // Empty javascript board array
  let boardArr = [];

  for (let i = 0; i < rows; i++) {
    let rowArr = [];
    for (let j = 0; j < columns; j++) {
      rowArr.push("x");
    }
    boardArr.push(rowArr);
  }
  // console.log(boardArr);

  // hide the modal so player can access game
  modal.classList.remove("visible");
  modal.classList.add("hidden");

  // set starting turn counter
  let turnCount = 0;

  // Select each column and give event listener to run game turn
  let gameColumns = document.querySelectorAll(".column");

  gameColumns.forEach((column) => {
    column.addEventListener("click", turn);
    column.addEventListener("mouseenter", mouseEnterColumn);
    column.addEventListener("mouseleave", mouseExitColumn);
  });

  //-------------------------------------------------------------------
  // turn functionality for game progression
  function turn() {
    // determine active player
    let activePlayer = 1;
    turnCount % 2 === 0 ? (activePlayer = 1) : (activePlayer = 2);
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
          sibling.style.backgroundColor =
            playerInfo[`${activePlayer - 1}`].color;

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
    // console.log(boardArr);

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
            // TODO: DRAW MESSAGE
            gameDraw();
          }
        }
      }
    }
    checkDraw();

    function checkHorizontal() {
      // console.log("checking horizontal");
      for (let i = 0; i < boardArr.length; i++) {
        for (let j = 0; j < boardArr[i].length; j++) {
          if (boardArr[i][j] == `${activePlayer}`) {
            if (
              boardArr[i][j + 1] == `${activePlayer}` &&
              boardArr[i][j + 2] == `${activePlayer}` &&
              boardArr[i][j + 3] == `${activePlayer}`
            ) {
              alert(`${playerInfo[activePlayer - 1].username} wins!`);
              gameWon();
            }
          }
        }
      }
    }
    checkHorizontal();

    function checkVertical() {
      // console.log("checking vertical");
      for (let i = 0; i < boardArr.length; i++) {
        for (let j = 0; j < boardArr[i].length; j++) {
          if (i - 1 < 0) {
            break;
          }
          if (boardArr[i][j] == `${activePlayer}`) {
            if (
              boardArr[i - 1][j] == `${activePlayer}` &&
              boardArr[i - 2][j] == `${activePlayer}` &&
              boardArr[i - 3][j] == `${activePlayer}`
            ) {
              // alert(`${playerInfo[activePlayer - 1].username} wins!`);
              console.log("vert win");
              gameWon();
            }
          }
        }
      }
    }
    checkVertical();

    // function checkDiagonal() {
    //   // check down right
    //   console.log("checking up + right");
    //   for (let i = 0; i < boardArr.length; i++) {
    //     for (let j = 0; j < boardArr[i].length; j++) {
    //       if (boardArr[i][j] == `${activePlayer}` && i > 3) {
    //         console.log(`Up 1 right: ${boardArr[i - 1][j + 1]}`);
    //         console.log(`Up 2 right: ${boardArr[i - 2][j + 2]}`);
    //         console.log(`Up 3 right: ${boardArr[i - 3][j + 3]}`);
    //         if (
    //           boardArr[i - 1][j + 1] == `${activePlayer}` &&
    //           boardArr[i - 2][j + 1] == `${activePlayer}` &&
    //           boardArr[i - 3][j + 1] == `${activePlayer}`
    //         ) {
    //           alert("diagonal win!");
    //           console.log("diagonal win (up -> right)");
    //         }
    //       }
    //     }
    //   }
    // check down left
    // console.log("checking up + left");
    // for (let i = 0; i < boardArr.length; i++) {
    //   for (let j = 0; j < boardArr[i].length; j++) {
    //     if (boardArr[i][j] == `${activePlayer}`) {
    //       if (
    //         boardArr[i + 1][j - 1] == `${activePlayer}` &&
    //         boardArr[i + 2][j - 1] == `${activePlayer}` &&
    //         boardArr[i + 3][j - 1] == `${activePlayer}`
    //       ) {
    //         console.log("diagonal win (up-> right)");
    //       }
    //     }
    //   }
    // }
    // }
    // checkDiagonal();

    // add to turn counter
    turnCount++;

    // update active player display
    displayActivePlayer.innerText = playerInfo[`${activePlayer - 1}`].username;
  }

  // when mouse enters column, highlight that column by scaling up and adding gradient
  function mouseEnterColumn() {
    this.style.transform = "scale(1.1)";
    this.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  }
  // when mouse leaves previous column, revert styling to default
  function mouseExitColumn() {
    this.style.transform = "none";
    this.style.backgroundColor = "rgba(0, 0, 0, 0)";
  }

  function clearEventListeners() {
    // remove event listeners to prevent players from moving after win
    gameColumns.forEach((column) => {
      column.removeEventListener("click", turn);
      column.removeEventListener("mouseenter", mouseEnterColumn);
      column.removeEventListener("mouseleave", mouseExitColumn);
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
    removeColumnStyles();
    clearEventListeners();
  }

  function gameDraw() {
    console.log("draw game");
    removeColumnStyles();
    clearEventListeners();
  }
}
