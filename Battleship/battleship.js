/* This file contains the code for the game
    described in chapter 2 in head-first-javascript Book. 

    @author Adnan H. Mohamed.
*/
var loc1 = Math.floor(Math.random() * 10) % 5,
    loc2 = loc1 + 1, 
    loc3 = loc1 + 2; 

var guess;  // holds the user's guess.
var hits = 0;  // counts the number of hits sofar.
var guesses = 0; // counts the number of guesses made by user sofar.
var is_sunk = false;

while (!is_sunk) {
    // get user guess.
    guess = prompt("Enter your guess (0-6): ");
    if (guess < 0 || guess > 6) {
        alert("Bad entry!!!");
        continue;
    }
    guesses += 1;
    if (guess == loc1 || guess == loc2 || guess == loc3) {
        hits += 1;
        if (hits == 3) {
            is_sunk = true;
        }
        if(hits < 3)
           alert("Hit! " + (3 - hits) + " hits left!");
        else
           alert("Horray! You won!");
    } else {
        alert("Consider wearing glasses next time!");
    }
    
}

var accuracy = 3 / guesses;
alert("Your Accuracy is: " + accuracy);