var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {  // Данный метод устанавливает атрибут class с названием hit ячейке в которой расположен корабль, в том случаи если она была угадана.
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {  // Данный метод устанавливает атрибут class с названием miss во всех остальных ячейках в которых не расположен корабль, если конечно пользователь попал именно в неё.
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}
var model = {
    boardSize: 7, // Размер игрового поля.
    numShips: 3,
    shipLength: 3, // Длина корабля в клетках.
    shipsSunk: 0,
    ships: [ // Свойство ships содержит массив объектов ship, содержащих массивы locations и hits для одного из трех кораблей. Обратите внимание, что использовавшаяся ранее переменная ships заменена свойством объекта модели.
        { locations: [0, 0, 0], hits: ["", "", ""] },   
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var locations = ship.locations;
            var index = locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        if (direction === 1) { // Если значение direction равно 1 то создается горизонтальный корабль.
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }
        else { // Если значение direction равно 0 то создаётся вертикальный корабль.
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            }
            else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    }
}
function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) { // В данном фрагменте кода происходит проверка правильности введённых координат т.е. введены ли они вообще или же их количество больше или меньше двух, а должно быть всего два символа.
        alert("Oops, please enter a letter and a number on the board.");
    }
    else {
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) { // В данном фрагменте кода происходит проверка координат на то полностью ли преобразовались их буквенная часть в цифравую.
            alert("Oops, that isn't on the board.");
        }
        else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) { // В данном фрагменте кода происходит проверка уже числовых координат на то соответствуют ли они диапазону значений поля на котором размещаются корабли.
            alert("Oops, that's off the board!");
        }
        else { // Данный фрагемент кода возвращает переменные row и column которые хранят по одному числавому значению на каждую переменную т.е. таким образом буквенно-числовые координаты полностью преобразовываются в полностью числовые которые используются в программе.
            return row + column;
        }
    }
    return null;
}
var controller = {
    guesses: 0, // Счётчик выстрелов.
    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
}
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.code === "Enter") {
        fireButton.click();
        return false; // return false нужен для того что бы данная функция не пыталась передавать данные т.к. эта задача другой функции - handleFireButton(). Функция handleKeyPress(e) должна связать нажатие клавиши Enter на клавиатуре с кнопкой fire в игре. 
    }
}
function handleFireButton() { // Данная функция является "обработчиком события нажатия конопки fire".
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value; // В данном случаи можно саму команду guessInput.value напрямую передать методу controller.processGuess(guessInput.value).  
    controller.processGuess(guess);
    guessInput.value = "";
}
function init() { // Данная функция запускает обработчик события.
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeydown = handleKeyPress;
    model.generateShipLocations();
}
window.onload = init;