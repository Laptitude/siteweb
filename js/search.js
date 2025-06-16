/**
 * IT2Help - Fonctionnalité de recherche
 * Permet de rechercher du contenu dans tout le site
 */

document.addEventListener("DOMContentLoaded", function () {
  // Éléments de l'interface
  const searchToggle = document.getElementById("search-toggle");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchForm = document.querySelector(".search-form");

  // Données de recherche (contenu du site indexé)
  const searchData = [
    {
      title: "Installation informatique",
      description:
        "Installation de systèmes d'exploitation, réseaux et périphériques",
      url: "services.html#installation-card",
      type: "service",
      keywords:
        "installation, windows, macos, linux, réseau, wifi, périphériques, imprimante, scanner",
    },
    {
      title: "Maintenance",
      description:
        "Nettoyage complet du système, mises à jour, optimisation des performances",
      url: "services.html#maintenance-card",
      type: "service",
      keywords:
        "maintenance, nettoyage, mise à jour, optimisation, performances, sauvegarde",
    },
    {
      title: "Réparations",
      description:
        "Dépannage PC et portables, récupération de données, suppression de virus",
      url: "services.html#reparation-card",
      type: "service",
      keywords:
        "réparation, dépannage, PC, portable, récupération, données, virus, malware",
    },
    {
      title: "Dépannage à distance",
      description:
        "Assistance informatique sans déplacement, résolution rapide de problèmes",
      url: "services.html#depannage-card",
      type: "service",
      keywords:
        "dépannage, distance, téléassistance, assistance, remote, problèmes, rapide",
    },
    {
      title: "Cybersécurité",
      description:
        "Antivirus, sauvegardes sécurisées, protection contre les ransomwares",
      url: "services.html#securite-card",
      type: "service",
      keywords:
        "cybersécurité, sécurité, antivirus, ransomware, protection, sauvegarde, formation",
    },
    {
      title: "Rennes",
      description:
        "Zone d'intervention principale : Rennes et ses environs (25km)",
      url: "services.html",
      type: "zone",
      keywords:
        "rennes, bretagne, zone, intervention, déplacement, ille-et-vilaine",
    },
    {
      title: "La Roche-sur-Yon",
      description:
        "Zone d'intervention principale : La Roche-sur-Yon et ses environs (25km)",
      url: "services.html",
      type: "zone",
      keywords: "la roche-sur-yon, vendée, zone, intervention, déplacement",
    },
    {
      title: "Formulaire de contact",
      description: "Nous contacter pour un devis ou une demande d'information",
      url: "contact.html",
      type: "contact",
      keywords: "contact, formulaire, devis, information, question, message",
    },
    {
      title: "Notre catalogue",
      description: "Découvrez nos produits informatiques et services",
      url: "catalogue.html",
      type: "produit",
      keywords:
        "catalogue, produits, ordinateurs, périphériques, composants, réseau, stockage, sécurité",
    },
    {
      title: "Témoignages clients",
      description: "Ce que nos clients disent de nos services",
      url: "index.html#testimonials",
      type: "avis",
      keywords: "avis, témoignages, clients, satisfaction, expérience",
    },
  ];

  // Afficher/masquer la barre de recherche
  searchToggle.addEventListener("click", function () {
    searchInput.classList.toggle("active");
    if (searchInput.classList.contains("active")) {
      searchInput.focus();
    } else {
      searchResults.classList.remove("active");
    }
  });

  // Fermer la recherche lors du clic à l'extérieur
  document.addEventListener("click", function (event) {
    const isClickInside =
      searchToggle.contains(event.target) ||
      searchInput.contains(event.target) ||
      searchResults.contains(event.target);

    if (!isClickInside && searchInput.classList.contains("active")) {
      searchInput.classList.remove("active");
      searchResults.classList.remove("active");
    }
  });

  // Empêcher la soumission du formulaire par défaut
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    performSearch();
  });

  // Recherche en temps réel pendant la saisie
  searchInput.addEventListener("input", function () {
    if (this.value.length >= 2) {
      performSearch();
    } else {
      searchResults.classList.remove("active");
    }
  });

  // Fonction de recherche
  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();

    if (query.length < 2) return;

    // Filtrer les résultats
    const results = searchData.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);
      const keywordMatch = item.keywords.toLowerCase().includes(query);

      return titleMatch || descMatch || keywordMatch;
    });

    // Afficher les résultats
    displayResults(results, query);
  }

  // Afficher les résultats dans le conteneur
  function displayResults(results, query) {
    // Vider le conteneur
    searchResults.innerHTML = "";

    if (results.length > 0) {
      // Créer les éléments de résultat
      results.forEach((result) => {
        const resultItem = document.createElement("a");
        resultItem.href = result.url;
        resultItem.className = "search-result-item";

        // Déterminer l'icône en fonction du type
        let iconClass = "fa-question";
        switch (result.type) {
          case "service":
            iconClass = "fa-tools";
            break;
          case "zone":
            iconClass = "fa-map-marker-alt";
            break;
          case "contact":
            iconClass = "fa-envelope";
            break;
          case "produit":
            iconClass = "fa-shopping-cart";
            break;
          case "avis":
            iconClass = "fa-comment";
            break;
        }

        resultItem.innerHTML = `
          <div class="search-result-icon">
            <i class="fas ${iconClass}"></i>
          </div>
          <div class="search-result-content">
            <h4>${highlightText(result.title, query)}</h4>
            <p>${highlightText(result.description, query)}</p>
          </div>
        `;

        searchResults.appendChild(resultItem);
      });
    } else {
      // Aucun résultat
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.textContent = 'Aucun résultat trouvé pour "' + query + '"';
      searchResults.appendChild(noResults);
    }

    // Afficher le conteneur de résultats
    searchResults.classList.add("active");
  }

  // Mettre en surbrillance les termes recherchés
  function highlightText(text, query) {
    if (!query || query.length < 2) return text;

    const regex = new RegExp("(" + escapeRegExp(query) + ")", "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  // Échapper les caractères spéciaux pour RegExp
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
});
