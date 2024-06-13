const icons = ["amarelo", "branco", "rosa", "marrom", "roxo", "vermelho"];
const board = [];
const rows = 9;
const columns = 9;
let score = 0;
let timeLeft = 180;
let timerInterval;
let currTile;
let otherTile;

document.addEventListener('DOMContentLoaded', function() {
    const playerForm = document.getElementById('playerForm');
    const playerList = document.getElementById('playerList');
    playerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const playerId = document.getElementById('playerId').value;
        if (playerId) {
            updatePlayer(playerId);
        } else {
            createPlayer();
        }
    });

    loadPlayers();

    function loadPlayers() {
        fetch('http://localhost/moranguinho_sa/players.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ action: 'read' })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Load Players Response:', data);
            if (Array.isArray(data)) {
                playerList.innerHTML = '';
                data.forEach(player => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${player.name}
                         
                    `;

                    playerList.appendChild(li);

                });
            } else {
                console.error('Invalid data format:', data);
            }
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
    }

    function createPlayer() {
        const formData = new FormData(playerForm);
        formData.append('action', 'create');

        fetch('http://localhost/moranguinho_sa/players.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Create Player Response:', data);
            if (data.message === 'Player created successfully') {
                loadPlayers();
                playerForm.reset();
                document.getElementById('playerId').value = '';
            } else if (data.error) {
                console.error('Error:', data.error);
            } else {
                console.error('Unexpected response:', data);
            }
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
    }

    window.selectPlayer = function(id, name) {
        document.getElementById("selectedPlayer").textContent = name;
        document.getElementById('playerId').value = id;
    }

    window.editPlayer = function(id) {
        fetch('http://localhost/moranguinho_sa/players.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ action: 'read', id: id })
        })
        .then(response => response.json())
        .then(player => {
            console.log('Edit Player Response:', player);
            document.getElementById('playerId').value = player.id_player;
            document.getElementById('inputName').value = player.name;
            document.getElementById('inputNationality').value = player.nationality;
            document.getElementById('inputAge').value = player.age;
            document.getElementById('inputEmail').value = player.email;
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
    }

    function updatePlayer(id) {
        const formData = new FormData(playerForm);
        formData.append('action', 'update');
        formData.append('id', id);

        fetch('http://localhost/moranguinho_sa/players.php', {
            method: 'POST',
            body: new URLSearchParams(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Update Player Response:', data);
            if (data.message === 'Player updated successfully') {
                loadPlayers();
                playerForm.reset();
                document.getElementById('playerId').value = '';
            } else if (data.error) {
                console.error('Error:', data.error);
            } else {
                console.error('Unexpected response:', data);
            }
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
    }

    

    window.selectPlayer = function(name) {
        document.getElementById("selectedPlayer").textContent = name;
        // document.getElementById('playerId').value = id;
        // document.getElementById('inputName').value = name;
        // document.getElementById('inputNationality').value = nationality;
        // document.getElementById('inputAge').value = age;
        // document.getElementById('inputEmail').value = email;
        // document.getElementById('selectedPlayer').textContent = name;
    }

    window.deletePlayer = function(id) {
        fetch('http://localhost/moranguinho_sa/players.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ action: 'delete', id: id })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Delete Player Response:', data);
            if (data.message === 'Player deleted successfully') {
                loadPlayers();
                playerForm.reset();
                document.getElementById('playerId').value = '';
            } else if (data.error) {
                console.error('Error:', data.error);
            } else {
                console.error('Unexpected response:', data);
            }
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
    }
});


window.addEventListener("load", function() {
    startGame();
    startTimer();
    setInterval(function() {
        crushWakfu();
        slideWakfu();
        generateWakfu();
    }, 100);
});

function randomWakfu() {
    return icons[Math.floor(Math.random() * icons.length)];
}

function startGame() {
    const boardElement = document.getElementById("board");
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = `${r}-${c}`;
            tile.src = `./icons_game/${randomWakfu()}.png`;
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);
            boardElement.appendChild(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = `Tempo Restante: ${timeLeft} segundos`;
    if (timeLeft === 0) {
        clearInterval(timerInterval);
        endGame();
    }
    timeLeft--;
}

function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    const currCoords = currTile.id.split("-");
    const otherCoords = otherTile.id.split("-");

    const [r, c] = currCoords.map(coord => parseInt(coord));
    const [r2, c2] = otherCoords.map(coord => parseInt(coord));

    const moveLeft = c2 === c - 1 && r === r2;
    const moveRight = c2 === c + 1 && r === r2;
    const moveUp = r2 === r - 1 && c === c2;
    const moveDown = r2 === r + 1 && c === c2;

    const isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        const currImg = currTile.src;
        const otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        const validMove = checkValid();
        if (!validMove) {
            currTile.src = currImg;
            otherTile.src = otherImg;
        }
    }
}

function checkValid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            const wakfu1 = board[r][c];
            const wakfu2 = board[r][c + 1];
            const wakfu3 = board[r][c + 2];
            if (wakfu1.src === wakfu2.src && wakfu2.src === wakfu3.src && !wakfu1.src.includes("blank")) {
                return true;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            const wakfu1 = board[r][c];
            const wakfu2 = board[r + 1][c];
            const wakfu3 = board[r + 2][c];
            if (wakfu1.src === wakfu2.src && wakfu2.src === wakfu3.src && !wakfu1.src.includes("blank")) {
                return true;
            }
        }
    }
    return false;
}

function crushWakfu() {
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            const wakfu1 = board[r][c];
            const wakfu2 = board[r][c + 1];
            const wakfu3 = board[r][c + 2];
            if (wakfu1.src === wakfu2.src && wakfu2.src === wakfu3.src && !wakfu1.src.includes("blank")) {
                wakfu1.src = "./icons_game/blank.png";
                wakfu2.src = "./icons_game/blank.png";
                wakfu3.src = "./icons_game/blank.png";
                score += 30;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            const wakfu1 = board[r][c];
            const wakfu2 = board[r + 1][c];
            const wakfu3 = board[r + 2][c];
            if (wakfu1.src === wakfu2.src && wakfu2.src === wakfu3.src && !wakfu1.src.includes("blank")) {
                wakfu1.src = "./icons_game/blank.png";
                wakfu2.src = "./icons_game/blank.png";
                wakfu3.src = "./icons_game/blank.png";
                score += 30;
            }
        }
    }
}

function slideWakfu() {
    for (let c = 0; c < columns; c++) {
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][c].src.includes("blank")) {
                for (let r2 = r - 1; r2 >= 0; r2--) {
                    if (!board[r2][c].src.includes("blank")) {
                        board[r][c].src = board[r2][c].src;
                        board[r2][c].src = "./icons_game/blank.png";
                        break;
                    }
                }
            }
        }
    }
}

function generateWakfu() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = `./icons_game/${randomWakfu()}.png`;
        }
    }
}

function endGame() {
    document.getElementById("timer").textContent = "Tempo Esgotado!";
    document.getElementById("timer").style.color = "red";
}
