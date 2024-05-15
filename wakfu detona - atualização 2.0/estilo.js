var icons = ["amarelo", "azul", "cinza", "marrom", "verde", "verde_escuro"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;
var timeLeft = 180;
var timerInterval;
var currTile;
var otherTile;


window.onload = function() {
    startGame();
    startTimer();

    //1/10th of a second
    window.setInterval(function(){
        crushWakfu();
        slideWakfu();
        generateWakfu();
    }, 100);
}

function randomWakfu() {
    return icons[Math.floor(Math.random() * icons.length)]; //0 - 5.99
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // <img id="0-0" src="./images/Red.png">
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./icons_game/" + randomWakfu() + ".png";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on a candy, initialize drag process
            tile.addEventListener("dragover", dragOver);  //clicking on candy, moving mouse to drag the candy
            tile.addEventListener("dragenter", dragEnter); //dragging candy onto another candy
            tile.addEventListener("dragleave", dragLeave); //leave candy over another candy
            tile.addEventListener("drop", dragDrop); //dropping a candy over another candy
            tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap candies

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    console.log("Atualizando timer");
    document.getElementById("timer").innerText = "Tempo Restante: " + timeLeft + " segundos";
    if (timeLeft === 0) {
        clearInterval(timerInterval);
        endGame();
    }
    timeLeft--;
}

function dragStart() {
    //this refers to tile that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    //this refers to the target tile that was dropped on
    otherTile = this;
}

function dragEnd() {

    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;

    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;    
        }
    }
}

function crushWakfu() {
    //crushFive();
    //crushFour();
    crushThree();
    document.getElementById("score").innerText = score;

}

function crushThree() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let icon1 = board[r][c];
            let icon2 = board[r][c+1];
            let icon3 = board[r][c+2];
            if (icon1.src == icon2.src && icon2.src == icon3.src && !icon1.src.includes("blank")) {
                icon1.src = "./icons_game/blank.png";
                icon2.src = "./icons_game/blank.png";
                icon3.src = "./icons_game/blank.png";
                score += 30;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let icon1 = board[r][c];
            let icon2 = board[r+1][c];
            let icon3 = board[r+2][c];
            if (icon1.src == icon2.src && icon2.src == icon3.src && !icon1.src.includes("blank")) {
                icon1.src = "./icons_game/blank.png";
                icon2.src = "./icons_game/blank.png";
                icon3.src = "./icons_game/blank.png";
                score += 30;
            }
        }
    }
}

function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let icon1 = board[r][c];
            let icon2 = board[r][c+1];
            let icon3 = board[r][c+2];
            if (icon1.src == icon2.src && icon2.src == icon3.src && !icon1.src.includes("blank")) {
                return true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let icon1 = board[r][c];
            let icon2 = board[r+1][c];
            let icon3 = board[r+2][c];
            if (icon1.src == icon2.src && icon2.src == icon3.src && !icon1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}


function slideWakfu() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1; 
        for (let r = rows - 1; r >= 0; r--) { 
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./icons_game/blank.png";
        }
    }
}


function generateWakfu() {
    for (let c = 0; c < columns;  c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./icons_game/" + randomWakfu() + ".png";
        }
    }
}

function endGame() {
    // Parar a lógica do jogo
    clearInterval(timerInterval);

    // Desativar eventos de arrastar e soltar
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            tile.removeEventListener("dragstart", dragStart);
            tile.removeEventListener("dragover", dragOver);
            tile.removeEventListener("dragenter", dragEnter);
            tile.removeEventListener("dragleave", dragLeave);
            tile.removeEventListener("drop", dragDrop);
            tile.removeEventListener("dragend", dragEnd);
        }
    }

    alert("Tempo esgotado! Pontuação final: " + score);
}