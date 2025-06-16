/**
 * Google Maps - Carte des zones d'intervention IT2Help
 * Script pour afficher et gérer la carte interactive des zones d'intervention
 */

// Configuration des zones d'intervention
const interventionZones = {
  rennes: {
    center: { lat: 48.117266, lng: -1.677793 },
    zoom: 10,
    title: "Rennes",
    radius: 25000, // 25km en mètres
    color: "#4285F4", // Bleu Google
  },
  laRoche: {
    center: { lat: 46.670511, lng: -1.426442 },
    zoom: 10,
    title: "La Roche-sur-Yon",
    radius: 25000, // 25km en mètres
    color: "#DB4437", // Rouge Google
  },
};

// Variables globales
let map;
let currentZone = null;
let circles = {};
let markers = {};
let infoWindows = {};

// Fonction d'initialisation de la carte - rendre explicitement globale
window.initMap = function () {
  console.log("Fonction initMap appelée depuis google-maps.js");

  // Vérification de la disponibilité de l'API Google Maps
  if (typeof google === "undefined" || typeof google.maps === "undefined") {
    console.error("L'API Google Maps n'est pas chargée correctement.");
    document.getElementById("map").innerHTML =
      "<div style='padding: 20px; background: #f8d7da; color: #721c24; border-radius: 5px;'>" +
      "<h3>Erreur de chargement de Google Maps</h3>" +
      "<p>L'API Google Maps n'a pas pu être chargée. Veuillez vérifier votre clé API et votre connexion internet.</p>" +
      "</div>";
    return;
  }

  // Créer la carte centrée sur la France
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 47.3215806, lng: -1.5523444 }, // Coordonnées entre Rennes et La Roche
    zoom: 7,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    },
    fullscreenControl: true,
    streetViewControl: false,
    zoomControl: true,
  });

  // Créer les cercles et marqueurs pour chaque zone
  for (const [zoneName, zoneConfig] of Object.entries(interventionZones)) {
    // Créer le cercle de la zone d'intervention
    circles[zoneName] = new google.maps.Circle({
      strokeColor: zoneConfig.color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: zoneConfig.color,
      fillOpacity: 0.15,
      map: map,
      center: zoneConfig.center,
      radius: zoneConfig.radius,
      visible: false,
    });

    // Créer le marqueur pour la ville
    markers[zoneName] = new google.maps.Marker({
      position: zoneConfig.center,
      map: map,
      title: zoneConfig.title,
      visible: false,
      animation: google.maps.Animation.DROP,
    });

    // Créer une infoWindow pour chaque marqueur
    infoWindows[zoneName] = new google.maps.InfoWindow({
      content: `<div class="info-window">
                  <h3>${zoneConfig.title}</h3>
                  <p>Zone d'intervention: rayon de ${
                    zoneConfig.radius / 1000
                  } km</p>
                  <p><a href="contact.html" class="info-link">Nous contacter</a></p>
                </div>`,
    });

    // Ajouter l'événement click sur le marqueur pour afficher l'infoWindow
    markers[zoneName].addListener("click", () => {
      infoWindows[zoneName].open({
        anchor: markers[zoneName],
        map,
      });
    });
  }

  // Ajouter les événements click sur les boutons de sélection de zone
  document.querySelectorAll(".zone-selector-btn").forEach((button) => {
    button.addEventListener("click", function () {
      // Supprimer la classe active de tous les boutons
      document.querySelectorAll(".zone-selector-btn").forEach((btn) => {
        btn.classList.remove("active");
      });

      // Ajouter la classe active au bouton cliqué
      this.classList.add("active");

      const zoneName = this.getAttribute("data-zone");

      if (zoneName) {
        // Afficher une zone spécifique
        showZone(zoneName);
      } else {
        // Afficher toutes les zones (bouton "Toutes nos zones")
        showAllZones();
      }
    });
  });

  // Par défaut, afficher toutes les zones
  showAllZones();
};

// Fonction pour afficher une zone spécifique
function showZone(zoneName) {
  // Masquer toutes les zones
  for (const zone in circles) {
    circles[zone].setVisible(false);
    markers[zone].setVisible(false);
    if (infoWindows[zone].getMap()) {
      infoWindows[zone].close();
    }
  }

  // Afficher la zone sélectionnée
  if (interventionZones[zoneName]) {
    currentZone = zoneName;
    circles[zoneName].setVisible(true);
    markers[zoneName].setVisible(true);

    // Centrer la carte sur la zone avec le zoom approprié
    map.setCenter(interventionZones[zoneName].center);
    map.setZoom(interventionZones[zoneName].zoom);
  }
}

// Fonction pour afficher toutes les zones
function showAllZones() {
  currentZone = null;

  // Afficher toutes les zones
  for (const zone in circles) {
    circles[zone].setVisible(true);
    markers[zone].setVisible(true);
  }

  // Ajuster la vue pour voir toutes les zones
  const bounds = new google.maps.LatLngBounds();
  for (const zone in interventionZones) {
    bounds.extend(interventionZones[zone].center);
  }
  map.fitBounds(bounds);

  // Ajouter un peu de padding
  map.setZoom(map.getZoom() - 0.5);
}

// Charger la carte quand le document est prêt
window.addEventListener("load", function () {
  // Vérifier si le script Google Maps est déjà chargé
  console.log("Événement load déclenché dans google-maps.js");
  if (typeof google === "undefined") {
    console.error(
      "Google Maps API n'est pas chargée. Veuillez ajouter la clé API."
    );
  } else {
    console.log(
      "API Google Maps trouvée, initMap sera appelée par le callback API."
    );
  }
});
