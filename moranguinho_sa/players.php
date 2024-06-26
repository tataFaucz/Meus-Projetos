<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once('db.php');

$action = $_POST['action'] ?? '';

$response = [];

try {
    if (!isset($pdo)) {
        throw new Exception("Database connection not established.");
    }

    if ($action == 'create') {
        $name = $_POST['name'] ?? '';
        $nationality = $_POST['nationality'] ?? '';
        $age = $_POST['age'] ?? '';
        $email = $_POST['email'] ?? '';
      
        if (empty($name) || empty($nationality) || empty($age) || empty($email)) {
            throw new Exception("All fields are required.");
        }

        $stmt = $pdo->prepare("INSERT INTO players (name, nationality, age, email) VALUES (?, ?, ?, ?)");
        if ($stmt->execute([$name, $nationality, $age, $email])) {
            $response = ["message" => "Player created successfully"];
        } else {
            throw new Exception("Error creating player.");
        }
    } elseif ($action == 'read') {
        if (isset($_POST['id'])) {
            $id = $_POST['id'];
            $stmt = $pdo->prepare("SELECT name FROM players WHERE id_player = ?");
            $stmt->execute([$id]);
            $player = $stmt->fetch(PDO::FETCH_ASSOC);
            $response = $player ?: ["message" => "Player not found"];
        } else {
            $stmt = $pdo->prepare("SELECT name FROM players");
            $stmt->execute();
            $players = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response = $players ?: [];
        }
    } elseif ($action == 'update') {
        $id = $_POST['id'] ?? '';
        $name = $_POST['name'] ?? '';
        $nationality = $_POST['nationality'] ?? '';
        $age = $_POST['age'] ?? '';
        $email = $_POST['email'] ?? '';

        if (empty($id) || empty($name) || empty($nationality) || empty($age) || empty($email)) {
            throw new Exception("All fields are required.");
        }

        $stmt = $pdo->prepare("UPDATE players SET name = ?, nationality = ?, age = ?, email = ? WHERE id_player = ?");
        if ($stmt->execute([$name, $nationality, $age, $email, $id])) {
            $response = ["message" => "Player updated successfully"];
        } else {
            throw new Exception("Error updating player.");
        }
    } elseif ($action == 'delete') {
        $id = $_POST['id'] ?? '';

        if (empty($id)) {
            throw new Exception("ID is required.");
        }

        $stmt = $pdo->prepare("DELETE FROM players WHERE id_player = ?");
        if ($stmt->execute([$id])) {
            $response = ["message" => "Player deleted successfully"];
        } else {
            throw new Exception("Error deleting player.");
        }
    } else {
        throw new Exception("Invalid action.");
    }

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>