/**
 * IT2Help - Script principal
 */

document.addEventListener("DOMContentLoaded", function () {
  // Éviter d'initialiser le menu mobile ici si déjà géré par mobile-ui-improvements.js
  if (!window.mobileMenuInitialized) {
    initBackToTop();
    initCarousel();
    toggleServiceDetails();
  }

  // Smooth scroll pour les ancres
  initSmoothScroll();

  // Animation au scroll
  initScrollAnimation();

  // Message flash temporaire
  initFlashMessages();

  // Navigation active
  setActiveNavigation();

  // Initialisation du carousel d'avis
  initTestimonialCarousel();

  // Gestion de l'accordéon des services (mobile)
  initServicesAccordion();

  // Lazy loading des images
  initLazyLoading();

  // Fonction pour initialiser le site
  initSite();

  // Vérification que les icônes FontAwesome sont correctement chargées
  setTimeout(function () {
    // Vérifier si les icônes Font Awesome sont correctement chargées
    const testIcon = document.createElement("i");
    testIcon.className = "fas fa-tools";
    testIcon.style.display = "none";
    document.body.appendChild(testIcon);

    const computedStyle = window.getComputedStyle(testIcon);
    const isFontAwesomeLoaded =
      computedStyle.fontFamily.includes("Font Awesome") ||
      testIcon.offsetWidth > 0;

    document.body.removeChild(testIcon);

    // Si Font Awesome n'est pas correctement chargé, utiliser les icônes de secours
    if (!isFontAwesomeLoaded) {
      document.querySelectorAll(".service-icon i").forEach(function (icon) {
        icon.style.display = "none";
      });
      document
        .querySelectorAll(".service-icon span")
        .forEach(function (fallback) {
          fallback.style.display = "inline-block";
        });
    }
  }, 500);

  // Code supplémentaire pour forcer l'affichage des icônes sur mobile
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    // Appliquer des styles supplémentaires pour le mobile
    document.querySelectorAll(".service-icon i").forEach(function (icon) {
      icon.style.display = "inline-block";
      icon.style.fontFamily =
        '"Font Awesome 6 Free", "Font Awesome 6 Brands", FontAwesome';
      icon.style.fontWeight = "900";
      icon.style.fontSize = "1.8rem";
      icon.style.color = "#3498db";
      icon.style.lineHeight = "1";
      icon.style.textRendering = "auto";
      icon.style.webkitFontSmoothing = "antialiased";
      icon.style.mozOsxFontSmoothing = "grayscale";
    });
  }
});

/**
 * Initialisation du menu mobile
 */
function initMobileMenu() {
  const mobileMenuButton = document.querySelector(".mobile-menu-btn");
  const mobileNav = document.querySelector(".mobile-menu");

  if (mobileMenuButton && mobileNav) {
    mobileMenuButton.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
      const isExpanded =
        mobileMenuButton.getAttribute("aria-expanded") === "true";
      mobileMenuButton.setAttribute("aria-expanded", !isExpanded);
    });

    // Fermer le menu lors du clic sur un lien
    const mobileLinks = mobileNav.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("active");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      });
    });

    // Fermer le menu lors du clic en dehors
    document.addEventListener("click", (e) => {
      if (
        !mobileNav.contains(e.target) &&
        !mobileMenuButton.contains(e.target)
      ) {
        mobileNav.classList.remove("active");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }
    });
  }
}

/**
 * Détection de la page active pour la navigation
 */
function setActiveNavigation() {
  // Cette fonction remplace le fonctionnement PHP pour marquer le lien actif
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Définir les classes actives pour la navigation desktop et mobile
  const navLinks = document.querySelectorAll(".nav-links a");
  const mobileLinks = document.querySelectorAll(".mobile-menu a");

  // Sélectionner et ajouter la classe active aux liens correspondants
  function setActiveLinks(links) {
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href === currentPage ||
        (currentPage === "index.html" && href === "/") ||
        (currentPage === "" && href === "/")
      ) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  setActiveLinks(navLinks);
  setActiveLinks(mobileLinks);
}

/**
 * Initialisation du défilement fluide pour les ancres
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");

      // Vérifier si l'ancre pointe vers un élément valide
      if (targetId !== "#") {
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerOffset = 80; // Hauteur du header avec un peu de marge
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

/**
 * Animation des éléments au défilement
 */
function initScrollAnimation() {
  // Sélection des éléments à animer
  const elementsToAnimate = document.querySelectorAll(
    ".service-card, .category-card, .article-card, .info-card"
  );

  // Observer pour déclencher l'animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          // Arrêter d'observer une fois l'animation déclenchée
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // Déclencher quand 10% de l'élément est visible
    }
  );

  // Observer chaque élément
  elementsToAnimate.forEach((element) => {
    element.classList.add("to-animate"); // Classe initiale
    observer.observe(element);
  });
}

/**
 * Gestion des messages flash (succès, erreur)
 */
function initFlashMessages() {
  const alerts = document.querySelectorAll(".alert");

  if (alerts.length > 0) {
    // Faire disparaître les alertes après 5 secondes
    setTimeout(() => {
      alerts.forEach((alert) => {
        alert.style.opacity = "0";

        // Supprimer après la transition
        setTimeout(() => {
          alert.style.display = "none";
        }, 300);
      });
    }, 5000);
  }
}

/**
 * Style supplémentaire pour le CSS
 */
document.head.insertAdjacentHTML(
  "beforeend",
  `
<style>
    /* Animation pour les éléments au scroll */
    .to-animate {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Animation pour le bouton hamburger */
    .mobile-menu-btn.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .mobile-menu-btn.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-btn.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
    
    /* Empêcher le défilement quand le menu est ouvert */
    body.menu-open {
        overflow: hidden;
    }
    
    /* Animation pour les alertes */
    .alert {
        transition: opacity 0.3s ease;
    }
</style>
`
);

// Précharger l'image du logo si elle existe
if (document.querySelector(".logo-img")) {
  const logoImg = document.querySelector(".logo-img");
  const logoSrc = logoImg.getAttribute("src");

  if (logoSrc) {
    const img = new Image();
    img.src = logoSrc;
  }
}

/**
 * Initialisation et gestion du carousel d'avis clients
 */
function initTestimonialCarousel() {
  const track = document.querySelector(".carousel-track");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");
  const dots = document.querySelectorAll(".dot");

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  let cardWidth;
  let visibleCards = 1;
  let touchStartX = 0;
  let touchEndX = 0;

  // Configuration responsive du carousel
  function setCarouselLayout() {
    // Réinitialiser le transform du track
    track.style.transform = "translateX(0)";
    currentIndex = 0;

    // Déterminer la largeur et le nombre d'éléments visibles
    const viewportWidth = window.innerWidth;
    cardWidth = cards[0].offsetWidth;

    if (viewportWidth >= 1024) {
      visibleCards = 3;
    } else if (viewportWidth >= 768) {
      visibleCards = 2;
    } else {
      visibleCards = 1;
    }

    // Mettre à jour les dots
    updateDots();
  }

  // Déplacer le carousel
  function moveCarousel(index) {
    if (index < 0) {
      index = cards.length - visibleCards;
    } else if (index > cards.length - visibleCards) {
      index = 0;
    }

    currentIndex = index;
    const translateX =
      -currentIndex *
      (cardWidth + parseInt(getComputedStyle(cards[0]).marginLeft) * 2);
    track.style.transform = `translateX(${translateX}px)`;

    updateDots();
  }

  // Mettre à jour l'état des dots
  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle(
        "active",
        index === Math.floor(currentIndex / visibleCards)
      );
    });
  }

  // Configuration initiale
  setCarouselLayout();

  // Event Listeners
  window.addEventListener("resize", setCarouselLayout);

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      moveCarousel(currentIndex - visibleCards);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      moveCarousel(currentIndex + visibleCards);
    });
  }

  // Gestion des dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      moveCarousel(index * visibleCards);
    });
  });

  // Support tactile pour swipe
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe gauche -> suivant
      moveCarousel(currentIndex + visibleCards);
    }

    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe droite -> précédent
      moveCarousel(currentIndex - visibleCards);
    }
  }

  // Auto-play du carousel
  let autoplayInterval;

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      moveCarousel(currentIndex + visibleCards);
    }, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Démarrer l'autoplay
  startAutoplay();

  // Arrêter l'autoplay lors des interactions
  track.addEventListener("mouseenter", stopAutoplay);
  track.addEventListener("mouseleave", startAutoplay);
  track.addEventListener("touchstart", stopAutoplay);
  track.addEventListener("touchend", () => {
    setTimeout(startAutoplay, 3000);
  });
}

/**
 * Gestion de l'accordéon mobile pour les services
 */
function initServicesAccordion() {
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  const tabButtons = document.querySelectorAll(".tab-btn");

  if (accordionHeaders.length === 0) return;

  // Gestion des éléments d'accordéon
  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const parent = header.parentElement;
      const isActive = parent.classList.contains("active");

      // Fermer tous les accordéons
      document.querySelectorAll(".accordion-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Si l'élément n'était pas déjà actif, l'ouvrir
      if (!isActive) {
        parent.classList.add("active");
      }
    });
  });

  // Gestion des onglets de services (mobile)
  if (tabButtons.length > 0) {
    // Activer le premier accordéon par défaut
    const firstAccordion = document.querySelector(".accordion-item");
    if (firstAccordion) {
      firstAccordion.classList.add("active");
    }

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Mettre à jour l'onglet actif
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Récupérer le service cible
        const targetService = btn.getAttribute("data-service");

        // Fermer tous les accordéons
        document.querySelectorAll(".accordion-item").forEach((item) => {
          item.classList.remove("active");
        });

        // Ouvrir l'accordéon correspondant
        const targetAccordion = document.getElementById(
          `${targetService}-mobile`
        );
        if (targetAccordion) {
          targetAccordion.classList.add("active");

          // Scroll jusqu'à l'accordéon
          setTimeout(() => {
            targetAccordion.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }, 100);
        }
      });
    });
  }
}

/**
 * Optimisation du chargement - Lazy Loading pour les images
 */
function initLazyLoading() {
  // Sélectionner toutes les images avec la classe lazy-load
  const lazyImages = document.querySelectorAll("img.lazy-load");

  if (lazyImages.length === 0) return;

  // Option de l'observer
  const options = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% de l'image visible
  };

  // Fonction de callback pour charger les images
  const loadImage = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute("data-src");

        if (src) {
          img.src = src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      }
    });
  };

  // Créer l'observer
  const observer = new IntersectionObserver(loadImage, options);

  // Observer chaque image
  lazyImages.forEach((img) => {
    observer.observe(img);
  });

  // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
  if (!("IntersectionObserver" in window)) {
    lazyImages.forEach((img) => {
      const src = img.getAttribute("data-src");
      if (src) {
        img.src = src;
        img.classList.add("loaded");
      }
    });
  }
}

/**
 * Optimiser la taille des images
 * Fonction qui peut être utilisée pour les images qui seront chargées dynamiquement
 */
function optimizeImageURL(url, width) {
  // Cette fonction peut être adaptée selon le service d'optimisation d'images utilisé
  // Exemple simple: ajouter un paramètre de largeur à l'URL
  if (!url) return url;

  // Si c'est une URL externe, on peut utiliser un service comme Cloudinary
  if (url.includes("http")) {
    return url; // À adapter selon le service
  }

  // Pour les images locales, on peut utiliser des suffixes de taille
  const extension = url.split(".").pop();
  const baseName = url.substring(0, url.lastIndexOf("."));

  return `${baseName}-${width}.${extension}`;
}

/**
 * Initialisation du site
 */
function initSite() {
  // Afficher l'année en cours dans le footer
  const currentYearElement = document.getElementById("current-year");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Accordéon pour mobiles (page services)
  const accordionItems = document.querySelectorAll(".accordion-item");
  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header");
      if (header) {
        header.addEventListener("click", () => {
          item.classList.toggle("active");
        });
      }
    });
  }

  // Tabs pour mobiles (page services)
  const tabButtons = document.querySelectorAll(".tab-btn");
  if (tabButtons.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Retirer la classe active de tous les boutons
        tabButtons.forEach((btn) => btn.classList.remove("active"));

        // Ajouter la classe active au bouton cliqué
        button.classList.add("active");

        // Afficher l'accordéon correspondant
        const serviceId = button.getAttribute("data-service");
        const accordionItem = document.getElementById(`${serviceId}-mobile`);

        if (accordionItem) {
          // Fermer tous les accordéons
          accordionItems.forEach((item) => item.classList.remove("active"));

          // Ouvrir l'accordéon correspondant
          accordionItem.classList.add("active");

          // Scroll jusqu'à l'accordéon
          accordionItem.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  // Initialisation des fonctionnalités d'accessibilité mobile
  initAccessibility();
}

/**
 * Améliorations d'accessibilité pour mobile
 */
function initAccessibility() {
  // Créer le bouton d'accessibilité s'il n'existe pas déjà
  if (!document.querySelector(".accessibility-btn")) {
    const accessibilityBtn = document.createElement("button");
    accessibilityBtn.className = "accessibility-btn";
    accessibilityBtn.setAttribute("aria-label", "Options d'accessibilité");
    accessibilityBtn.innerHTML = '<i class="fas fa-universal-access"></i>';
    document.body.appendChild(accessibilityBtn);

    // Options d'accessibilité et leur état
    const accessibilityOptions = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
    };

    // Gestion du clic sur le bouton d'accessibilité
    accessibilityBtn.addEventListener("click", function () {
      // Créer ou afficher le panneau d'options si déjà créé
      let optionsPanel = document.querySelector(".accessibility-panel");

      if (!optionsPanel) {
        // Créer le panneau s'il n'existe pas
        optionsPanel = document.createElement("div");
        optionsPanel.className = "accessibility-panel";
        optionsPanel.innerHTML = `
          <div class="accessibility-header">
            <h3>Options d'accessibilité</h3>
            <button class="close-panel" aria-label="Fermer le panneau">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="accessibility-options">
            <div class="option">
              <input type="checkbox" id="high-contrast" ${
                accessibilityOptions.highContrast ? "checked" : ""
              }>
              <label for="high-contrast">Mode contraste élevé</label>
            </div>
            <div class="option">
              <input type="checkbox" id="large-text" ${
                accessibilityOptions.largeText ? "checked" : ""
              }>
              <label for="large-text">Texte agrandi</label>
            </div>
            <div class="option">
              <input type="checkbox" id="reduced-motion" ${
                accessibilityOptions.reducedMotion ? "checked" : ""
              }>
              <label for="reduced-motion">Réduire les animations</label>
            </div>
          </div>
        `;

        document.body.appendChild(optionsPanel);

        // Gérer la fermeture du panneau
        optionsPanel
          .querySelector(".close-panel")
          .addEventListener("click", function () {
            optionsPanel.classList.remove("visible");
          });

        // Gérer les changements d'options
        optionsPanel
          .querySelector("#high-contrast")
          .addEventListener("change", function (e) {
            accessibilityOptions.highContrast = e.target.checked;
            applyAccessibilitySettings();
          });

        optionsPanel
          .querySelector("#large-text")
          .addEventListener("change", function (e) {
            accessibilityOptions.largeText = e.target.checked;
            applyAccessibilitySettings();
          });

        optionsPanel
          .querySelector("#reduced-motion")
          .addEventListener("change", function (e) {
            accessibilityOptions.reducedMotion = e.target.checked;
            applyAccessibilitySettings();
          });
      }

      // Afficher le panneau avec une animation
      setTimeout(() => {
        optionsPanel.classList.toggle("visible");
      }, 10);
    });

    // Fonction pour appliquer les paramètres d'accessibilité
    function applyAccessibilitySettings() {
      // Appliquer le contraste élevé
      if (accessibilityOptions.highContrast) {
        document.body.classList.add("high-contrast");
      } else {
        document.body.classList.remove("high-contrast");
      }

      // Appliquer le texte agrandi
      if (accessibilityOptions.largeText) {
        document.body.classList.add("large-text");
      } else {
        document.body.classList.remove("large-text");
      }

      // Appliquer la réduction des animations
      if (accessibilityOptions.reducedMotion) {
        document.body.classList.add("reduced-motion");
      } else {
        document.body.classList.remove("reduced-motion");
      }

      // Sauvegarder les préférences dans localStorage
      localStorage.setItem(
        "accessibility",
        JSON.stringify(accessibilityOptions)
      );
    }

    // Charger les préférences d'accessibilité au chargement
    const savedPreferences = localStorage.getItem("accessibility");
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        Object.assign(accessibilityOptions, preferences);
        applyAccessibilitySettings();

        // Mettre à jour l'état des cases à cocher si le panneau existe
        if (document.querySelector("#high-contrast")) {
          document.querySelector("#high-contrast").checked =
            accessibilityOptions.highContrast;
          document.querySelector("#large-text").checked =
            accessibilityOptions.largeText;
          document.querySelector("#reduced-motion").checked =
            accessibilityOptions.reducedMotion;
        }
      } catch (e) {
        console.error(
          "Erreur lors du chargement des préférences d'accessibilité:",
          e
        );
      }
    }
  }
}

// Initialiser le bouton retour en haut
function initBackToTop() {
  const backToTopButton = document.getElementById("back-to-top");

  if (backToTopButton) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });

    backToTopButton.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

// Initialiser le carousel de témoignages
function initCarousel() {
  const carouselTrack = document.querySelector(".carousel-track");
  const prevButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");
  const dots = document.querySelectorAll(".dot");

  if (!carouselTrack || !prevButton || !nextButton || !dots.length) return;

  let currentIndex = 0;
  const cardWidth = document.querySelector(".testimonial-card").offsetWidth;
  const cardCount = document.querySelectorAll(".testimonial-card").length;

  // Fonction pour déplacer le carousel
  function moveCarousel(index) {
    if (index < 0) index = 0;
    if (index >= cardCount) index = cardCount - 1;

    currentIndex = index;
    const translateX = -currentIndex * cardWidth;
    carouselTrack.style.transform = `translateX(${translateX}px)`;

    // Mettre à jour les points
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  // Gestionnaires d'événements pour les boutons et points
  prevButton.addEventListener("click", () => moveCarousel(currentIndex - 1));
  nextButton.addEventListener("click", () => moveCarousel(currentIndex + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => moveCarousel(i));
  });

  // Recalculer le carousel lors du redimensionnement
  window.addEventListener("resize", () => {
    const newCardWidth =
      document.querySelector(".testimonial-card").offsetWidth;
    moveCarousel(currentIndex, newCardWidth);
  });
}

// Fonction pour afficher/masquer les détails des services
function toggleServiceDetails() {
  const toggleButtons = document.querySelectorAll(".toggle-service-btn");

  if (!toggleButtons.length) return;

  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".service-card-item");
      card.classList.toggle("expanded");

      const icon = this.querySelector("i");
      if (card.classList.contains("expanded")) {
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");
      } else {
        icon.classList.remove("fa-minus");
        icon.classList.add("fa-plus");
      }
    });
  });
}
