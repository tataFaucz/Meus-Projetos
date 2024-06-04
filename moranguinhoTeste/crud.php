<?php
include 'db.php';

$action = $_POST['action'];

if ($action == 'create') {
    $name = $_POST['name'];
    $nationality = $_POST['nationality'];
    $age = $_POST['age'];
    $email = $_POST['email'];
    
    $sql = "INSERT INTO players (name, nationality, age, email) VALUES ('$name', '$nationality', $age, '$email')";
    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} elseif ($action == 'read') {
    $sql = "SELECT * FROM players";
    $result = $conn->query($sql);
    $players = [];
    while ($row = $result->fetch_assoc()) {
        $players[] = $row;
    }
    echo json_encode($players);
} elseif ($action == 'update') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $nationality = $_POST['nationality'];
    $age = $_POST['age'];
    $email = $_POST['email'];
    
    $sql = "UPDATE players SET name='$name', nationality='$nationality', age=$age, email='$email' WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo "Record updated successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} elseif ($action == 'delete') {
    $id = $_POST['id'];
    
    $sql = "DELETE FROM players WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo "Record deleted successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
