/**
 * IT2Help - Améliorations UI/UX Mobile
 * Ce fichier contient des améliorations interactives pour l'interface mobile du site IT2Help.
 * Ces scripts sont exécutés uniquement sur les appareils mobiles (écrans ≤ 768px).
 */

// Détecter les appareils mobiles
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const body = document.body;

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", function () {
  // Indiquer que le menu mobile est initialisé par ce script
  window.mobileMenuInitialized = true;

  // Améliorer le menu mobile
  improveMobileMenu();

  // Améliorer les cartes de services
  improveServiceCards();

  // Améliorer les cartes de contact
  improveContactCardsMobile();

  // Améliorer l'expérience formulaire
  improveFormExperience();

  // Ajouter des effets de ripple sur les boutons
  addRippleEffect();

  // Décalage automatique pour toutes les ancres afin de ne jamais masquer le titre sous la navbar fixe
  scrollWithOffset();
});

/**
 * Améliore l'expérience du menu mobile
 */
function improveMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (!mobileMenuBtn || !mobileMenu) return;

  // Supprimer les écouteurs existants pour éviter les doublons
  const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
  mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);

  // Ajouter un nouveau gestionnaire pour l'ouverture/fermeture du menu
  newMobileMenuBtn.addEventListener("click", function () {
    this.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    body.classList.toggle("menu-open");

    // Empêcher le défilement du fond quand le menu est ouvert
    if (mobileMenu.classList.contains("active")) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }
  });

  // Fermer le menu quand on clique sur un lien
  const menuLinks = mobileMenu.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      newMobileMenuBtn.classList.remove("active");
      mobileMenu.classList.remove("active");
      body.classList.remove("menu-open");
      body.style.overflow = "";
    });
  });
}

/**
 * Améliore l'interaction avec les cartes de services sur mobile
 */
function improveServiceCards() {
  if (!isMobile) return;

  const serviceCards = document.querySelectorAll(".service-card");
  if (!serviceCards.length) return;

  serviceCards.forEach((card) => {
    // Ajouter une classe active lors du toucher pour effet visuel
    card.addEventListener(
      "touchstart",
      function () {
        this.classList.add("active");
      },
      { passive: true }
    );

    card.addEventListener(
      "touchend",
      function () {
        this.classList.remove("active");
      },
      { passive: true }
    );

    // Animation subtile au scroll
    observeElement(card, "card-in-view", 0.1);
  });
}

/**
 * Améliore l'interaction avec les cartes de contact sur mobile
 */
function improveContactCardsMobile() {
  // Vérifier si nous sommes sur la page de contact
  const contactCards = document.querySelectorAll(".contact-info .info-card");
  if (!contactCards.length) return;

  contactCards.forEach((card) => {
    // Animation au scroll
    observeElement(card, "card-in-view", 0.1);

    // Rendre les cartes cliquables selon leur contenu
    const title = card.querySelector("h3")?.textContent.toLowerCase();
    const content = card.querySelector("p")?.textContent;

    if (title === "téléphone" && content) {
      makeCardClickable(card, `tel:${content.replace(/\s/g, "")}`);
    } else if (title === "email" && content) {
      makeCardClickable(card, `mailto:${content.trim()}`);
    } else if (title === "adresse" && content) {
      const address = encodeURIComponent(content.replace(/\n/g, ", "));
      makeCardClickable(card, `https://maps.google.com/?q=${address}`);
    }
  });
}

/**
 * Rend une carte cliquable avec une action
 */
function makeCardClickable(card, url) {
  card.classList.add("clickable");

  card.addEventListener("click", function () {
    window.open(url, "_blank");
  });

  // Ajouter indication visuelle de toucher
  card.addEventListener(
    "touchstart",
    function () {
      this.classList.add("active");
    },
    { passive: true }
  );

  card.addEventListener(
    "touchend",
    function () {
      this.classList.remove("active");
    },
    { passive: true }
  );
}

/**
 * Améliore l'expérience de formulaire sur mobile
 */
function improveFormExperience() {
  if (!isMobile) return;

  const form = document.querySelector(".contact-form");
  if (!form) return;

  const inputs = form.querySelectorAll("input, textarea, select");
  const messageField = form.querySelector("#message");
  const counter = form.querySelector("#message-counter");

  // Gestion des états actifs des champs
  inputs.forEach((input) => {
    // Animation au focus
    input.addEventListener("focus", function () {
      this.parentNode.classList.add("input-active");
    });

    input.addEventListener("blur", function () {
      if (!this.value) {
        this.parentNode.classList.remove("input-active");
      }
    });

    // Si le champ a déjà une valeur
    if (input.value) {
      input.parentNode.classList.add("input-active");
    }
  });

  // Compteur de caractères amélioré
  if (messageField && counter) {
    const maxLength = messageField.getAttribute("maxlength") || 5000;

    messageField.addEventListener("input", function () {
      const remaining = maxLength - this.value.length;
      const percent = (this.value.length / maxLength) * 100;

      counter.textContent = `${this.value.length}/${maxLength} caractères`;

      // Changer la couleur en fonction du nombre de caractères
      if (percent > 90) {
        counter.style.color = "#e74c3c";
      } else if (percent > 70) {
        counter.style.color = "#f39c12";
      } else {
        counter.style.color = "";
      }
    });

    // Initialiser le compteur
    messageField.dispatchEvent(new Event("input"));
  }
}

/**
 * Ajoute un effet de ripple sur les boutons
 */
function addRippleEffect() {
  const buttons = document.querySelectorAll(".btn-primary, .btn-outline");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.classList.add("ripple-effect");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/**
 * Observer l'élément et ajouter une classe quand il entre dans la vue
 */
function observeElement(element, className, threshold = 0.2) {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: threshold }
  );

  observer.observe(element);
}

// Ajouter une classe au body pour indiquer qu'on est sur mobile
if (isMobile) {
  document.body.classList.add("is-mobile-device");
}

// Ajouter des styles CSS dynamiques pour corriger les problèmes d'UI
(function addDynamicStyles() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
        /* Styles d'animation pour feedback tactile */
        @media (max-width: 768px) {
            .active-touch {
                transform: scale(0.97) !important;
                transition: transform 0.1s ease !important;
            }
            
            /* Masquer le contour de focus sur les éléments mobiles */
            *:focus {
                outline: none !important;
            }
            
            /* Styles pendant le défilement pour améliorer les performances */
            body.is-scrolling * {
                transition: none !important;
            }
            
            /* Correction de l'espacement des boutons de formulaire */
            form button, form .btn-primary {
                margin-top: 16px !important;
            }
        }
    `;
  document.head.appendChild(styleElement);
})();

// Décalage automatique pour toutes les ancres afin de ne jamais masquer le titre sous la navbar fixe
(function () {
  function scrollWithOffset(hash) {
    var id = hash.replace("#", "");
    var target = document.getElementById(id);
    if (target) {
      setTimeout(function () {
        var navbar = document.querySelector(".main-header");
        var navbarHeight = navbar ? navbar.offsetHeight : 70;
        var rect = target.getBoundingClientRect();
        var scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: rect.top + scrollTop - navbarHeight - 10,
          behavior: "smooth",
        });
      }, 200);
    }
  }

  // Si la page est chargée avec un hash
  window.addEventListener("DOMContentLoaded", function () {
    if (
      window.location.hash &&
      document.getElementById(window.location.hash.substring(1))
    ) {
      scrollWithOffset(window.location.hash);
    }
  });

  // Si l'utilisateur clique sur un lien avec ancre
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (a && a.hash && document.getElementById(a.hash.substring(1))) {
      e.preventDefault();
      history.pushState(null, "", a.hash);
      scrollWithOffset(a.hash);
    }
  });
})();

// Fonction pour faire défiler avec un offset
function scrollWithOffset(element, offset = 0) {
  if (!element) return;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}
