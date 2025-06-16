/**
 * IT2Help - Animations UI/UX
 * Améliore l'expérience utilisateur avec des animations subtiles
 */

document.addEventListener("DOMContentLoaded", function () {
  // Animation des éléments au défilement
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(
      ".service-card, .info-card, .testimonial-card, .category-card"
    );

    elements.forEach(function (element) {
      const position = element.getBoundingClientRect();

      // Si l'élément est visible dans la fenêtre
      if (position.top < window.innerHeight - 100) {
        element.classList.add("animate-in");
      }
    });
  };

  // Animation des entêtes de section
  const animateSectionHeaders = function () {
    const headers = document.querySelectorAll(".section-header");

    headers.forEach(function (header) {
      const position = header.getBoundingClientRect();

      if (position.top < window.innerHeight - 80) {
        header.classList.add("animate-in");
      }
    });
  };

  // Exécuter l'animation au chargement et au défilement
  animateOnScroll();
  animateSectionHeaders();

  window.addEventListener("scroll", function () {
    animateOnScroll();
    animateSectionHeaders();
  });

  // Animation des boutons au survol
  const buttons = document.querySelectorAll(".btn-primary, .btn-outline");

  buttons.forEach(function (button) {
    button.addEventListener("mouseover", function () {
      this.classList.add("pulse");
    });

    button.addEventListener("animationend", function () {
      this.classList.remove("pulse");
    });
  });

  // Amélioration de l'interaction avec les menus mobiles
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      document.body.classList.toggle("no-scroll");
      mobileMenu.classList.toggle("slide-in");
    });
  }

  // Fermer le menu mobile quand on clique sur un lien
  const mobileLinks = document.querySelectorAll(".mobile-menu a");

  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      document.body.classList.remove("no-scroll");
      mobileMenu.classList.remove("slide-in");
    });
  });

  // Améliorer la navigation au clavier (accessibilité)
  const focusableElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  focusableElements.forEach(function (element) {
    element.addEventListener("focus", function () {
      this.classList.add("keyboard-focus");
    });

    element.addEventListener("blur", function () {
      this.classList.remove("keyboard-focus");
    });
  });
});
