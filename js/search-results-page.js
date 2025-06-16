
// Afficher les résultats de recherche
document.addEventListener("DOMContentLoaded", function () {
  // Récupérer le paramètre de recherche dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");

  // Afficher le terme recherché
  if (query) {
    document.getElementById("search-query").textContent = query;
    document.getElementById("search-input").value = query;

    // Simuler un délai de chargement pour une meilleure UX
    setTimeout(function () {
      // Utiliser le même moteur de recherche que dans le script search.js
      const searchData = window.searchData || [];
      const results = searchData.filter((item) => {
        const titleMatch = item.title
          .toLowerCase()
          .includes(query.toLowerCase());
        const descMatch = item.description
          .toLowerCase()
          .includes(query.toLowerCase());
        const keywordMatch = item.keywords
          .toLowerCase()
          .includes(query.toLowerCase());

        return titleMatch || descMatch || keywordMatch;
      });

      // Afficher les résultats
      const resultsContainer = document.getElementById(
        "search-results-container"
      );
      resultsContainer.innerHTML = "";

      if (results.length > 0) {
        // Créer les éléments de résultat
        results.forEach((result) => {
          const resultItem = document.createElement("div");
          resultItem.className = "search-result-full";

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
            <div class="search-result-header">
              <div class="search-result-icon">
                <i class="fas ${iconClass}"></i>
              </div>
              <h3><a href="${result.url}">${result.title}</a></h3>
            </div>
            <div class="search-result-content">
              <p>${result.description}</p>
              <a href="${result.url}" class="search-result-link">Voir plus <i class="fas fa-arrow-right"></i></a>
            </div>
          `;

          resultsContainer.appendChild(resultItem);
        });

        const resultCount = document.createElement("div");
        resultCount.className = "search-result-count";
        resultCount.innerHTML = `<p>${results.length} résultat${
          results.length > 1 ? "s" : ""
        } trouvé${results.length > 1 ? "s" : ""}</p>`;
        resultsContainer.prepend(resultCount);
      } else {
        // Aucun résultat
        const noResults = document.createElement("div");
        noResults.className = "no-results-full";
        noResults.innerHTML = `
          <div class="no-results-icon">
            <i class="fas fa-search"></i>
          </div>
          <h3>Aucun résultat trouvé pour "${query}"</h3>
          <p>Suggestions :</p>
          <ul>
            <li>Vérifiez l'orthographe des termes de recherche.</li>
            <li>Essayez d'autres mots-clés.</li>
            <li>Utilisez des termes plus généraux.</li>
          </ul>
        `;
        resultsContainer.appendChild(noResults);
      }
    }, 800);
  } else {
    // Pas de paramètre de recherche
    document.getElementById("search-query-text").textContent =
      "Veuillez saisir un terme de recherche";
    document.getElementById("search-results-container").innerHTML = `
      <div class="no-query">
        <p>Aucun terme de recherche n'a été spécifié.</p>
        <p>Utilisez la barre de recherche ci-dessus pour trouver ce que vous cherchez.</p>
      </div>
    `;
  }
});
