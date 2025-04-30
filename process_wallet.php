<?php
// Set error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define the file where wallet addresses will be stored
$data_file = 'wallet_submissions.txt';

// Get current timestamp
$timestamp = date('Y-m-d H:i:s');

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the wallet address from POST data
    $wallet_address = isset($_POST['wallet_address']) ? trim($_POST['wallet_address']) : '';
    
    // Get IP address and user agent
    $ip_address = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    
    // Validate wallet address (simple validation)
    if (strlen($wallet_address) >= 32) {
        // Format the data to save
        $data_to_save = json_encode([
            'timestamp' => $timestamp,
            'wallet_address' => $wallet_address,
            'ip_address' => $ip_address,
            'user_agent' => $user_agent
        ]);
        
        // Append to the file
        file_put_contents($data_file, $data_to_save . PHP_EOL, FILE_APPEND);
        
        // Success response
        $response = [
            'success' => true,
            'message' => 'Your wallet has been registered successfully!'
        ];
    } else {
        // Invalid wallet address response
        $response = [
            'success' => false,
            'message' => 'Please enter a valid Solana wallet address'
        ];
    }
    
    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// If not a POST request, redirect to the form
header('Location: qrcode.html');
exit;
?>