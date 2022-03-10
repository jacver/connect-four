/*

=============
on page load:
=============
    [x] a modal will open
        [x] modal will let player 1 pick a username
        [x] modal will let player 1 pick a team color
        [x] modal will let player 2 pick a username
        [x] modal will let player 2 pick a team color

        [x] modal will allow player to select grid size with buttons
            [x] game will run at 6x7 by default
            [x] 5x4 grid button
            [x] 6x5 grid button
            [x] 8x7 grid button
            [x] 9x7 grid button
            [x] 10x7 grid button

        > Player can read rules from modal via a button 
        > player can start game via a button
            > start game load grid with player specs (6x7 by default) 
            !!! maybe the "start game" functionality should run when player selects grid rather than be a seperate button? !!!

============
On gameInit
============
    > game will load after the steps above take place and player either clicks start or selects grid (depending on how I decide to run it)
    > above gameboard should show:
        > current player's turn
        > Player 1 win total
        > player 2 Win total
        > how to play button 
            > will open modal with rules
        > reset game button
    
    [x] gameboard 
        [x] Generated DYNAMICALLY using grid 

    > on a players turn the following will happen:
        > implement a way to indicate which column is hovered over
            > highlight circle border? highlight column? circles get a little bigger?
                > player will select a circle to fill
         > must fill lowest space in column (no floating spaces)
            >


============
On gameOver
============
    > modal opens to congratulate winning player
        > modal has "play again" button
        > modal has "change grid button"
    > update player record
*/

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
  //   console.log(playerInfo[0]);

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
  //   console.log(playerInfo[1]);

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

  let boardArr = [];

  // generate the grid using the rows and columns taken from the button
  for (let i = 0; i < rows; i++) {
    let row = document.createElement("div");
    row.classList.add("row" + (i + 1));
    gridContainer.appendChild(row);
    // blank 2d array
    let rowArr = [];

    let rowX = document.querySelector(".row" + (i + 1));

    for (let j = 0; j < columns; j++) {
      let cell = document.createElement("button");
      cell.classList.add("cell");
      rowX.appendChild(cell);
      rowArr.push("");
    }

    boardArr.push(rowArr);
  }

  // hide the modal so player can access game
  modal.classList.remove("visible");
  modal.classList.add("hidden");

  // add event listener to cells (slots in the game board)
  const cells = document.querySelectorAll(".cell");

  // set starting turn counter
  let turnCount = 1;

  cells.forEach((cell) => cell.addEventListener("click", turn));

  // turn functionality for game progression
  function turn() {
    let activePlayer;
    turnCount % 2 === 0 ? (activePlayer = 1) : (activePlayer = 2);

    // cell will become color of active player's team
    this.style.backgroundColor = playerInfo[`${activePlayer - 1}`].color;

    // update boardArray
    // console.log(boardArr);

    // check win conditions

    // add to turn counter
    turnCount++;

    // cycle active player

    // update active player display
    displayActivePlayer.innerText = playerInfo[`${activePlayer - 1}`].username;
  }
}
