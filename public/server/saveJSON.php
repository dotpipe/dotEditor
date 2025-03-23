<?php
// filepath: c:\Users\g0d77\pipeAI\ai-html-editor\save_grid.php

// Database connection settings
$host = 'localhost';
$db = 'your_database_name';
$user = 'your_database_user';
$pass = 'your_database_password';
$charset = 'utf8mb4';

// Set up the DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Create a new PDO instance
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Handle connection errors
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// Get the JSON data from the request
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Check if the data is valid
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Prepare the SQL statement
$sql = "INSERT INTO templates (template_name, json_content) VALUES (:template_name, :json_content)";
$stmt = $pdo->prepare($sql);

// Bind the parameters
$templateName = 'default_template'; // You can change this to a dynamic value if needed
$stmt->bindParam(':template_name', $templateName);
$stmt->bindParam(':json_content', $jsonData);

// Execute the statement
if ($stmt->execute()) {
    echo json_encode(['success' => 'Grid data saved successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save grid data']);
}
?>
