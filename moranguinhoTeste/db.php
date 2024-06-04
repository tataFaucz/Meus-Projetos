<?php

$servername = "localhost";
$username = "seu_usuario";
$password = "sua_senha";
$dbname = "crud_moranguinho";

function connectDB() {
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Erro de conexão: " . $conn->connect_error);
    }
    return $conn;
}

function readPlayers() {
    $conn = connectDB();
    $sql = "SELECT * FROM crud";
    $result = $conn->query($sql);
    
    $players = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $players[] = $row;
        }
    }
    
    $conn->close();
    return $players;
}
?>
