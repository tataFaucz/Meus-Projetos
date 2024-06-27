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
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Mudança aqui para JSON
    })
    .then(data => {
        console.log('Load Players Response:', data);
        if (Array.isArray(data)) {
            players = data.map(player => ({ id: player.id_player, name: player.name }));
            console.log(players);
            updatePlayerList();
        } else {
            console.error('Invalid data format:', data);
        }
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function createPlayer() {
    const formData = new FormData(document.getElementById('playerForm'));
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
            loadPlayers(); // Atualiza a lista de jogadores
            document.getElementById('playerForm').reset();
            document.getElementById('playerId').value = '';
            selectPlayer(players.length - 1); // Seleciona o último jogador criado
        } else if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Unexpected response: ' + data);
        }
    })
    .catch(error => alert('There was a problem with the fetch operation: ' + error));
}


function updatePlayerList() {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = "";

    players.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `ID: ${player.id} - Name: ${player.name}`;
        li.onclick = () => selectPlayer(index); 
        playerList.appendChild(li);
    });
}

function selectPlayer(index) {
    selectedPlayerIndex = index;
    const selectedPlayer = players[selectedPlayerIndex].name; 
    document.getElementById("selectedPlayer").textContent = selectedPlayer;
}

function editPlayer() {
    if (selectedPlayerIndex !== -1) {
        const newName = prompt("Digite o novo nome do jogador:");
        const newNationality = prompt("Digite o novo país do jogador:");
        const newAge = prompt("Digite a nova idade do jogador:");
        const newEmail = prompt("Digite o novo e-mail do jogador:");

        if (newName !== null && newName.trim() !== "" && 
            newNationality !== null && newNationality.trim() !== "" && 
            newAge !== null && newAge.trim() !== "" && 
            newEmail !== null && newEmail.trim() !== "") {

            const playerId = players[selectedPlayerIndex].id;
            const requestBody = new URLSearchParams({
                action: 'update',
                id: playerId,
                name: newName,
                nationality: newNationality,
                age: newAge,
                email: newEmail
            });

            console.log('Request Body:', requestBody.toString());

            fetch('http://localhost/moranguinho_sa/players.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: requestBody
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Update Player Response:', data);
                if (data.message === 'Player updated successfully') {
                    players[selectedPlayerIndex] = {
                        id: playerId,
                        name: newName,
                        nationality: newNationality,
                        age: newAge,
                        email: newEmail
                    };
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
    } else {
        console.log('No player selected for editing.');
    }
}

function deletePlayer() {
    if (selectedPlayerIndex !== -1) {
        const confirmDelete = confirm("Tem certeza que deseja excluir este jogador?");
        if (confirmDelete) {
            const playerId = players[selectedPlayerIndex].id;
            console.log('Attempting to delete player with ID:', playerId);

            fetch('http://localhost/moranguinho_sa/players.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ action: 'delete', id: playerId })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
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
    } else {
        console.log('No player selected for deletion.');
    }
}


function startTimer() {
    timerInterval = setInterval(updateTimer, 1000); // Alterado para atualizar a cada segundo
}

function updateTimer() {
    document.getElementById("timer").innerText = "Tempo Restante: " + timeLeft + " segundos";
    if (timeLeft === 0) {
        clearInterval(timerInterval);
        endGame();
    }
    timeLeft--;
}

function startGame() {
    resetGame();
    if (selectedPlayerIndex === -1) {
        alert("Selecione um jogador antes de iniciar o jogo.");
        return;
    }

    function resetGame() {
        board = [];
        document.getElementById("board").innerHTML = "";
        score = 0;
        document.getElementById("score").innerText = score;
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        timeLeft = 180; // Reinicializar o tempo restante
        document.getElementById("timer").innerText = "Tempo Restante: " + timeLeft + " segundos";
        gameActive = false;
    }

    // Lógica do jogo continua aqui...
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

function playAgain() {
    resetGame();
    startGame();
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
    alert("Tempo esgotado! Sua pontuação final é: " + score);
    
    saveScore().then(() => {
        // Oculta o jogo e mostra a tabela de ranking
        document.getElementById("game").style.display = "none";
        document.getElementById("ranking-table").style.display = "block";
        document.getElementById("return-to-registration").style.display = "block"; // Mostrar o botão
    
        // Adicionar um atraso antes de buscar o ranking
        setTimeout(fetchRanking, 1000); // Atraso de 1 segundo
    }).catch(error => {
        console.error("Erro ao salvar pontuação:", error);
    });
}

function saveScore() {
    return new Promise((resolve, reject) => {
        if (selectedPlayerIndex === -1) {
            console.error("Nenhum jogador selecionado.");
            reject("Nenhum jogador selecionado.");
            return;
        }

        const playerId = players[selectedPlayerIndex].id;
        if (!playerId || score === undefined || score === null) {
            console.error("Dados incompletos: playerId ou pontuacao estão faltando.");
            reject("Dados incompletos.");
            return;
        }

        const requestBody = new URLSearchParams({
            action: 'save_score',
            id: playerId,
            pontuacao: score
        });

        console.log('Enviando dados para save_score:', requestBody.toString());

        fetch('http://localhost/moranguinho_sa/ranking.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestBody
        })
        .then(response => response.json())
        .then(data => {
            console.log('Save Score Response:', data);
            if (data.error) {
                console.error('Erro no save_score:', data.error);
                reject(data.error);
            } else {
                console.log(data.message);
                resolve(data.message);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            reject(error);
        });
    });
}

function fetchRanking() {
    const requestBody = new URLSearchParams({ action: 'get_ranking' });

    fetch('http://localhost/moranguinho_sa/ranking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: requestBody
    })
    .then(response => response.json())
    .then(data => {
        console.log('Fetch Ranking Response:', data);
        if (Array.isArray(data)) {
            const rankBody = document.getElementById("rank-body");
            rankBody.innerHTML = ""; // Limpa conteúdo anterior da tabela

            data.forEach((rank, index) => {
                const row = document.createElement("tr");
                const positionCell = document.createElement("td");
                positionCell.textContent = index + 1; // Posição baseada no índice
                const playerNameCell = document.createElement("td");
                playerNameCell.textContent = rank.name;
                const scoreCell = document.createElement("td");
                scoreCell.textContent = rank.pontuacao;

                row.appendChild(positionCell);
                row.appendChild(playerNameCell);
                row.appendChild(scoreCell);

                rankBody.appendChild(row);
            });

            document.getElementById("ranking-table").style.display = "block";
            document.getElementById("return-to-registration").style.display = "block";
        } else {
            console.error('Invalid data format:', data);
        }
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
}


function home(){
    window.location.href = "http://localhost/moranguinho_sa/moranguinho.html";
}