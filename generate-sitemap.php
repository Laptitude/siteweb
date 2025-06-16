<?php
// Script de génération automatique du sitemap
header('Content-Type: text/plain');

// Configuration
$domain = 'https://it2help.fr';
$files = [
    '' => 1.00,
    'index.html' => 0.80,
    'services.html' => 0.80,
    'catalogue.html' => 0.80,
    'contact.html' => 0.80,
    'mentions-legales.html' => 0.80,
    'politique-confidentialite.html' => 0.80,
    'cgv.html' => 0.80,
    // Pages de dépannage informatique par ville
    'depannage-informatique-aizenay.html' => 0.75,
    'depannage-informatique-beauvoir-sur-mer.html' => 0.75,
    'depannage-informatique-betton.html' => 0.75,
    'depannage-informatique-bruz.html' => 0.75,
    'depannage-informatique-cesson-sevigne.html' => 0.75,
    'depannage-informatique-chantepie.html' => 0.75,
    'depannage-informatique-ile-dyeu.html' => 0.75,
    'depannage-informatique-la-roche-sur-yon.html' => 0.75,
    'depannage-informatique-les-achards.html' => 0.75,
    'depannage-informatique-mareuil-sur-lay-dissais.html' => 0.75,
    'depannage-informatique-pace.html' => 0.75,
    'depannage-informatique-rennes.html' => 0.75,
    'depannage-informatique-saint-florent-des-bois.html' => 0.75,
    'depannage-informatique-saint-gregoire.html' => 0.75,
    'depannage-informatique-saint-hilaire-de-riez.html' => 0.75,
    'depannage-informatique-saint-jacques-de-la-lande.html' => 0.75,
    'depannage-informatique-talmont-saint-hilaire.html' => 0.75,
    'depannage-informatique-venansault.html' => 0.75,
    'depannage-informatique-vern-sur-seiche.html' => 0.75
];

// Date actuelle au format ISO 8601
$now = date('c');

// En-tête du sitemap
$xml = '<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- Généré automatiquement le ' . date('Y-m-d H:i:s') . ' -->

';

// Ajouter chaque URL
foreach ($files as $file => $priority) {
    $url = $domain . '/' . $file;
    $xml .= "<url>\n";
    $xml .= "  <loc>{$url}</loc>\n";
    $xml .= "  <lastmod>{$now}</lastmod>\n";
    $xml .= "  <priority>{$priority}</priority>\n";
    $xml .= "</url>\n";
}

// Fermeture du sitemap
$xml .= "\n</urlset>";

// Sauvegarder le sitemap
file_put_contents('sitemap.xml', $xml);

echo "Sitemap généré avec succès.\n";
echo "Fichier sitemap.xml mis à jour avec la date : {$now}";
?> 