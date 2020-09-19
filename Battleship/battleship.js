// Returns the corresponding cell ID
// for the given row and column.
function getLocation(row, col) {
    return (row - "A") + col
}

function parseGuess(guess) {
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess == null) {
        return null;
    }
    if (guess.length != 2) {
        return null;
    }
    var r = alphabet.indexOf(guess.charAt(0));
    var c = guess.charAt(1);
    if (r == -1 || c < 0 || c >= model.boardSize) {
        return null;
    }
    return r + c;
}

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();

    for (var i = 0; i < model.numShips; ++i) {
        console.log(model.ships[i].locations);
    }
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;

var view = {
    // prompts the user with the given msg.
    displayMessage: function(msg) {
        var e = document.getElementById("messageArea");
        e.innerHTML = msg;
    },

    displayHit: function(location) {
        var e = document.getElementById(location);
        e.classList.add("hit");
    },

    displayMiss: function(location) {
        var e = document.getElementById(location);
        e.classList.add("miss");
    }

};

var model = {
     boardSize: 7,
     numShips: 3,
     shipsSunk: 0,
     shipLength: 3,
     ships: [{locations:[0, 0, 0], hits:["", "", ""]},
             {locations:[0, 0, 0], hits:["", "", ""]},
             {locations:[0, 0, 0], hits:["", "", ""]}],
     
     // Returns true iff lacation has a ship and that ship
     // is not hit before, otherwise false is returned.
     fire: function(location) {
         for (var i = 0; i < this.numShips; ++i) {
             var ship = this.ships[i];
             var index = ship.locations.indexOf(location);
             if (index != -1) {
                 if (this.ships[i].hits[index] == "hit") {
                     view.displayMessage("You already hit this location!");
                     return false;
                 }
                 this.ships[i].hits[index] = "hit";
                 view.displayMessage("HIT!");
                 view.displayHit(location);
                 if (this.isSunk(ship)) {
                     this.shipsSunk++;
                     view.displayMessage("You sank the battleship!");
                 }
                 return true;
             }
         }
         view.displayMessage("You missed!");
         view.displayMiss(location);
         return false;
     },

     // Returns true iff this ship is sunk.
     isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; ++i) {
            if (ship.locations[i] != "hit") {
                return false;
            }
        }
        return true;
     },

     generateShip: function() {
         
         var direction = Math.floor(Math.random() * 2);
         var r, c;
         var newShipLocations = [];

         if (direction === 1) {
             // vertically arranged.
             r = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
             c = Math.floor(Math.random() * this.boardSize);
         } else {
             // horizantal
             c = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
             r = Math.floor(Math.random() * this.boardSize);
         }
         
         for (var i = 0; i < this.shipLength; ++i) {
             if (direction === 1) {
                 newShipLocations.push((r + i) + "" + c);
             } else {
                newShipLocations.push(r + "" + (c + i));
             }
         }
         return newShipLocations;
     },

     collision: function(locations) {
         for (var i = 0; i < this.numShips; ++i) {
             var ship = this.ships[i];
             for (var j = 0; j < this.shipLength; ++j) {
                 if (ship.locations.indexOf(locations[j]) != -1) {
                     return true;
                 }
             }
         }
         return false;
     },

     generateShipLocations: function() {
         var locations;
         for (var i = 0; i < this.numShips; ++i) {
             do {
                 locations = this.generateShip();
             } while(this.collision(locations));
             this.ships[i].locations = locations;
         }
     }
};

var controller = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location != null) {
            this.guesses++;
            model.fire(location);
            if (model.numShips === model.shipsSunk) {
                view.displayMessage("You sank all my battleships in "
                                    + this.guesses + " guesses!");
            }
        }
    }
}
