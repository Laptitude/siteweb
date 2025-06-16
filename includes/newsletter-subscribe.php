<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    if ($email) {
        $file = __DIR__ . '/../newsletter-subscribers.txt';
        file_put_contents($file, $email.PHP_EOL, FILE_APPEND | LOCK_EX);
        header('Location: ../newsletter.php?success=1');
        exit;
    } else {
        header('Location: ../newsletter.php?error=1');
        exit;
    }
}
header('Location: ../newsletter.php');
