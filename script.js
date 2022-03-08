/*

=============
on page load:
=============
    > a modal will open
        > modal will let player 1 pick a username
        > modal will let player 1 pick a team color
        > modal will let player 2 pick a username
        > modal will let player 2 pick a team color

        > modal will allow player to select grid size with buttons
            > game will run at 6x7 by default
            > 5x4 grid button
            > 6x5 grid button
            > 8x7 grid button
            > 9x7 grid button
            > 10x7 grid button

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
    
    > gameboard 
        > Generated DYNAMICALLY using grid 

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

// ========================
// =========Selectors======
// ========================

// ----modal----
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
const modalHeader = document.querySelector('.modal-header');
const modalText = document.querySelector('.modal-text');
const btnCloseModal = document.querySelector('.btn-close-modal');

// ====================
// ======Functions====
// ====================

// gameInit();

function gameInit() {}
