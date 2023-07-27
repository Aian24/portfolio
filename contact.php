<?php
// Replace 'your_database_name', 'your_username', 'your_password', and 'your_table_name' with your actual database credentials and table name
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "contact";
$table = "contacts";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

// Prepare and execute SQL query
$sql = "INSERT INTO $table (name, email, message) VALUES ('$name', '$email', '$message')";

if ($conn->query($sql) === TRUE) {
    echo' <script> window.onload = function () { alert ("Thank you for your message"); location.href = "Basagre-Porfolio.html"; } </script> ';
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>