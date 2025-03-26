
<?php
// filepath: c:\Users\g0d77\pipeAI\ai-html-editor\server\loadJSON.php

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

// Prepare the SQL statement
$sql = "SELECT json_content FROM templates WHERE template_name = :template_name";
$stmt = $pdo->prepare($sql);

// Bind the parameters
$templateName = 'default_template'; // You can change this to a dynamic value if needed
$stmt->bindParam(':template_name', $templateName);

// Execute the statement
$stmt->execute();
$result = $stmt->fetch();

if ($result) {
    echo $result['json_content'];
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Template not found']);
}
?>