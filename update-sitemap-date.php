<?php
// Définir le fuseau horaire pour l'Europe/Paris
date_default_timezone_set('Europe/Paris');

// Obtenir la date actuelle au format ISO 8601
$now = date('c');
echo "Date actuelle : " . $now . PHP_EOL;

// Chemin du fichier sitemap.xml
$sitemap_path = '/var/www/html/sitemap.xml';

// Vérifier si le fichier existe
if (!file_exists($sitemap_path)) {
    die("Erreur : Le fichier sitemap.xml n'existe pas.\n");
}
$sitemap_content = file_get_contents($sitemap_path);
if ($sitemap_content === false) {
    die("Erreur : Impossible de lire le fichier sitemap.xml.\n");
}

// Mettre à jour toutes les balises <lastmod> avec la nouvelle date
$updated_content = preg_replace('/<lastmod>.*?<\/lastmod>/', '<lastmod>' . $now . '</lastmod>', $sitemap_content);
if ($updated_content === null) {
    die("Erreur : Problème lors de la mise à jour des balises <lastmod>.\n");
}

// Sauvegarder le fichier mis à jour
if (file_put_contents($sitemap_path, $updated_content) === false) {
    die("Erreur : Impossible de sauvegarder les modifications dans le fichier sitemap.xml.\n");
}

echo "Sitemap mis à jour avec succès !\n";
?>