var icons = ["amarelo", "branco", "rosa", "marrom", "roxo", "vermelho"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;
var timeLeft = 180;
let players = [];
let selectedPlayerIndex = -1;
var timerInterval;
var currTile;
var otherTile;
var gameActive = false;

document.addEventListener('DOMContentLoaded', function() {
    loadPlayers();
    document.getElementById("playerForm").addEventListener("submit", function(event) {
        event.preventDefault();
        createPlayer();
    });
});

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
            players = data.map(player => player.name);
            updatePlayerList();
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

            // Seleciona automaticamente o jogador recém-criado
            selectPlayer(data.id_player, formData.get('name'));
        } else if (data.error) {
            console.error('Error:', data.error);
        } else {
            console.error('Unexpected response:', data);
        }
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function updatePlayerList() {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = "";
    players.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = player;
        li.onclick = () => selectPlayer(index);
        playerList.appendChild(li);
    });
}

function selectPlayer(index) {
    selectedPlayerIndex = index;
    const selectedPlayer = players[selectedPlayerIndex];
    document.getElementById("selectedPlayer").textContent = selectedPlayer;
}

function editPlayer() {
    if (selectedPlayerIndex !== -1) {
        const newName = prompt("Digite o novo nome do jogador:");
        if (newName !== null && newName.trim() !== "") {
            fetch('http://localhost/moranguinho_sa/players.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ action: 'update', id: selectedPlayerIndex, name: newName })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Update Player Response:', data);
                if (data.message === 'Player updated successfully') {
                    players[selectedPlayerIndex] = newName;
                    updatePlayerList();
                    document.getElementById("selectedPlayer").textContent = newName;
                } else if (data.error) {
                    console.error('Error:', data.error);
                } else {
                    console.error('Unexpected response:', data);
                }
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
        }
    }
}

function deletePlayer() {
    if (selectedPlayerIndex !== -1) {
        const confirmDelete = confirm("Tem certeza que deseja excluir este jogador?");
        if (confirmDelete) {
            fetch('http://localhost/moranguinho_sa/players.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ action: 'delete', id: selectedPlayerIndex })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Delete Player Response:', data);
                if (data.message === 'Player deleted successfully') {
                    players.splice(selectedPlayerIndex, 1);
                    selectedPlayerIndex = -1;
                    updatePlayerList();
                    document.getElementById("selectedPlayer").textContent = "";
                } else if (data.error) {
                    console.error('Error:', data.error);
                } else {
                    console.error('Unexpected response:', data);
                }
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
        }
    }
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

function startGame() {
    if (selectedPlayerIndex === -1) {
        alert("Selecione um jogador antes de iniciar o jogo.");
        return;
    }

    // Crie o tabuleiro do jogo
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./icons_game/" + randomWakfu() + ".png";

            // Adicione a funcionalidade de arrastar
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            // Adicione o tile ao tabuleiro
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    document.getElementById("crud").style.display = "none";
    document.getElementById("game").style.display = "block";

    startTimer();
    gameActive = true;

    window.setInterval(function(){
        if (gameActive) {
            crushWakfu();
            slideWakfu();
            generateWakfu();
        }
    }, 100);
}

function randomWakfu() {
    return icons[Math.floor(Math.random() * icons.length)];
}

function dragStart() {
    if (!gameActive) return;
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
    if (!gameActive) return;
    otherTile = this;
}

function dragEnd() {
    if (!gameActive) return;
    
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-");
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
            currTile.src = currImg;
            otherTile.src = otherImg;    
        }
    }
}

function crushWakfu() {
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree() {
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
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                let temp = board[ind][c].src;
                board[ind][c].src = board[r][c].src;
                board[r][c].src = temp;
                ind--;
            }
        }
    }
}

function generateWakfu() {
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            if (board[r][c].src.includes("blank")) {
                board[r][c].src = "./icons_game/" + randomWakfu() + ".png";
            }
        }
    }
}

function endGame() {
    gameActive = false;
    alert("O jogo acabou! Sua pontuação é: " + score);
}
