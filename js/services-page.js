document.addEventListener("DOMContentLoaded", function () {
  const serviceCards = document.querySelectorAll(".service-card-item");
  const toggleButtons = document.querySelectorAll(".toggle-service-btn");

  // Initialisation des attributs ARIA
  toggleButtons.forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });

  function toggleCard(card) {
    const targetId = card.id;
    const button = card.querySelector(".toggle-service-btn");
    const isExpanded = card.classList.contains("expanded");

    if (!isExpanded) {
      serviceCards.forEach((otherCard) => {
        if (otherCard.id !== targetId && otherCard.classList.contains("expanded")) {
          otherCard.classList.remove("expanded");
          const otherButton = otherCard.querySelector(".toggle-service-btn");
          otherButton.innerHTML = 'En savoir plus <i class="fas fa-chevron-down"></i>';
          otherButton.setAttribute("aria-expanded", "false");
        }
      });
    }

    card.classList.toggle("expanded");

    if (card.classList.contains("expanded")) {
      button.innerHTML = 'Réduire <i class="fas fa-chevron-up"></i>';
      button.setAttribute("aria-expanded", "true");
    } else {
      button.innerHTML = 'En savoir plus <i class="fas fa-chevron-down"></i>';
      button.setAttribute("aria-expanded", "false");
    }
  }

  toggleButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      const card = this.closest(".service-card-item");
      toggleCard(card);
    });
  });

  serviceCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      if (!e.target.closest(".toggle-service-btn")) {
        toggleCard(this);
      }
    });
    card.setAttribute("role", "region");
    card.setAttribute("aria-labelledby", card.id + "-title");
  });

  serviceCards.forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCard(this);
      }
    });
  });
});
