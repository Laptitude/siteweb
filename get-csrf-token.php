<?php
// Démarrer la session si ce n'est pas déjà fait
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Fonction pour générer un jeton CSRF aléatoire
function generateCSRFToken() {
    return bin2hex(random_bytes(32)); // 64 caractères hexadécimaux (32 octets)
}

// Générer et stocker un nouveau jeton
$token = generateCSRFToken();
$_SESSION['csrf_token'] = $token;
$_SESSION['csrf_token_time'] = time();

// En-tête pour informer que la réponse est en JSON
header('Content-Type: application/json');

// Répondre avec le jeton
echo json_encode(['token' => $token]);
?> 