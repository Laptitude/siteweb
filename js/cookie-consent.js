// Script de gestion du consentement aux cookies
document.addEventListener("DOMContentLoaded", function () {
  // Vérifie si l'utilisateur a déjà donné son consentement
  const cookieConsent = localStorage.getItem("cookieConsent");

  // Si le consentement n'a pas été donné, affiche la bannière
  if (!cookieConsent) {
    showCookieBanner();
  }

  // Fonction pour afficher la bannière de cookies
  function showCookieBanner() {
    // Créer la bannière
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.innerHTML = `
            <div class="cookie-content">
                <p>Ce site utilise des cookies pour améliorer votre expérience. En continuant à naviguer, vous acceptez notre utilisation des cookies.</p>
                <div class="cookie-buttons">
                    <button id="cookie-accept" class="btn-cookie accept">Accepter</button>
                    <button id="cookie-decline" class="btn-cookie decline">Refuser</button>
                    <a href="politique-confidentialite.html" class="cookie-more">En savoir plus</a>
                </div>
            </div>
        `;

    // Ajouter la bannière au body
    document.body.appendChild(banner);

    // Ajouter une classe au body pour ajuster le padding si nécessaire
    document.body.classList.add("has-cookie-banner");

    // Gérer les événements des boutons
    document
      .getElementById("cookie-accept")
      .addEventListener("click", function () {
        acceptCookies();
        hideBanner();
      });

    document
      .getElementById("cookie-decline")
      .addEventListener("click", function () {
        declineCookies();
        hideBanner();
      });
  }

  // Fonction pour masquer la bannière
  function hideBanner() {
    const banner = document.querySelector(".cookie-banner");
    if (banner) {
      banner.classList.add("hiding");
      setTimeout(() => {
        banner.remove();
        document.body.classList.remove("has-cookie-banner");
      }, 300);
    }
  }

  // Fonction pour accepter les cookies
  function acceptCookies() {
    localStorage.setItem("cookieConsent", "accepted");
    // Ici, vous pouvez activer d'autres scripts d'analyse ou de tracking
  }

  // Fonction pour refuser les cookies
  function declineCookies() {
    localStorage.setItem("cookieConsent", "declined");
    // Ici, vous devriez désactiver tout script non essentiel
  }
});
