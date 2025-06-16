<?php
// Script de rotation des logs
define('SECURE_ACCESS', true);

// Configuration
$log_dir = __DIR__ . '/../logs';
$max_log_size = 5 * 1024 * 1024; // 5 MB
$max_log_files = 5;

// Vérifier si le dossier logs existe
if (!file_exists($log_dir)) {
    mkdir($log_dir, 0755, true);
}

// Fonction pour faire la rotation des logs
function rotateLogs($log_file) {
    global $max_log_files;
    
    // Si le fichier n'existe pas, on ne fait rien
    if (!file_exists($log_file)) {
        return;
    }
    
    // Supprimer le plus ancien fichier si on atteint la limite
    $oldest_file = $log_file . '.' . $max_log_files;
    if (file_exists($oldest_file)) {
        unlink($oldest_file);
    }
    
    // Déplacer les fichiers existants
    for ($i = $max_log_files - 1; $i >= 1; $i--) {
        $old_file = $log_file . '.' . $i;
        $new_file = $log_file . '.' . ($i + 1);
        if (file_exists($old_file)) {
            rename($old_file, $new_file);
        }
    }
    
    // Renommer le fichier actuel
    rename($log_file, $log_file . '.1');
}

// Fichiers de log à surveiller
$log_files = [
    $log_dir . '/error.log',
    $log_dir . '/access.log',
    $log_dir . '/contact.log'
];

// Vérifier chaque fichier de log
foreach ($log_files as $log_file) {
    if (file_exists($log_file) && filesize($log_file) > $max_log_size) {
        rotateLogs($log_file);
    }
}

// Nettoyer les anciens fichiers de log (plus de 30 jours)
$old_files = glob($log_dir . '/*.log.*');
foreach ($old_files as $file) {
    if (filemtime($file) < strtotime('-30 days')) {
        unlink($file);
    }
} 