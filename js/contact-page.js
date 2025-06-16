// Script pour le défilement automatique vers la section suivante
document.addEventListener("DOMContentLoaded", function () {
  const sections = [
    "support",
    "probleme",
    "intervention",
    "urgence",
    "disponibilites",
  ];

  sections.forEach((name, idx) => {
    document
      .querySelectorAll(`input[name="${name}"]`)
      .forEach((input) => {
        input.addEventListener("change", function () {
          // Désélectionner tous les autres dans la même section pour forcer le choix unique
          document
            .querySelectorAll(`input[name="${name}"]`)
            .forEach((radio) => {
              if (radio !== input) radio.checked = false;
            });

          // Scroll fluide vers le début de la section suivante
          const nextSection = sections[idx + 1];
          if (nextSection) {
            const nextFieldset = document
              .querySelector(`input[name="${nextSection}"]`)
              .closest("fieldset");
            if (nextFieldset) {
              // Calculer la position avec un offset pour le header
              const headerHeight =
                document.querySelector(".main-header").offsetHeight;
              const fieldsetTop =
                nextFieldset.getBoundingClientRect().top +
                window.pageYOffset;
              const scrollPosition = fieldsetTop - headerHeight - 20; // 20px de marge supplémentaire

              window.scrollTo({
                top: scrollPosition,
                behavior: "smooth",
              });

              // Focus sur le premier input de la section suivante
              setTimeout(() => {
                const nextInput = nextFieldset.querySelector(
                  'input[type="radio"]'
                );
                if (nextInput) nextInput.focus();
              }, 400);
            }
          }
        });
      });
  });
});

// Script pour masquer les cartes de contact sauf Email sur mobile
(function () {
  // Vérifier si l'appareil est mobile
  if (window.matchMedia("(max-width: 768px)").matches) {
    // Attendre que le DOM soit chargé
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        hideAllContactCardsExceptEmail
      );
    } else {
      hideAllContactCardsExceptEmail();
    }
  }

  function hideAllContactCardsExceptEmail() {
    // Optimiser le centrage de la page
    const container = document.querySelector("main.container");
    if (container) {
      container.style.padding = "0";
      container.style.width = "100%";
      container.style.maxWidth = "100%";
      container.style.overflowX = "hidden";
      container.style.boxSizing = "border-box";
    }

    // Centrer la section d'en-tête
    const pageHeader = document.querySelector(".page-header");
    if (pageHeader) {
      pageHeader.style.padding = "1rem";
      pageHeader.style.textAlign = "center";
    }

    // Optimiser le conteneur de contenu de contact
    const contactContent = document.querySelector(".contact-content");
    if (contactContent) {
      contactContent.style.padding = "0 1rem";
      contactContent.style.boxSizing = "border-box";
      contactContent.style.width = "100%";
    }

    // Optimiser le conteneur des cartes d'info
    const contactInfo = document.querySelector(".contact-info");
    if (contactInfo) {
      contactInfo.style.width = "100%";
      contactInfo.style.display = "flex";
      contactInfo.style.justifyContent = "center";
      contactInfo.style.padding = "0";
      contactInfo.style.margin = "0 0 1.5rem 0";
    }

    // Sélectionner toutes les cartes d'information
    const contactCards = document.querySelectorAll(
      ".contact-info .info-card"
    );

    // Masquer toutes les cartes sauf celle d'email (3ème carte)
    contactCards.forEach(function (card, index) {
      if (index !== 2) {
        card.style.display = "none";
      } else {
        card.style.display = "flex";
        card.style.width = "100%";
        card.style.maxWidth = "450px";
        card.style.margin = "0 auto";
        card.style.boxShadow = "0 4px 10px rgba(33, 150, 243, 0.15)";
        card.style.transition = "all 0.3s ease";
      }
    });

    // Optimiser le centrage du formulaire
    const formContainer = document.querySelector(
      ".contact-form-container"
    );
    if (formContainer) {
      formContainer.style.width = "100%";
      formContainer.style.maxWidth = "450px";
      formContainer.style.margin = "0 auto";
      formContainer.style.boxSizing = "border-box";
    }
  }
})();

// Fonction pour récupérer le jeton CSRF
function fetchCSRFToken() {
  fetch("get-csrf-token.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Erreur HTTP lors de la récupération du jeton CSRF: " +
            response.status
        );
      }
      return response.json();
    })
    .then((data) => {
      if (data.token) {
        const csrfContainer = document.getElementById("csrf-container");
        csrfContainer.innerHTML = `<input type="hidden" name="csrf_token" value="${data.token}">`;
      } else {
        console.error("Réponse du serveur sans jeton CSRF:", data);
      }
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération du jeton CSRF:",
        error
      );
    });
}

// Compteur de caractères pour le message
document.getElementById("message").addEventListener("input", function () {
  const counter = document.getElementById("message-counter");
  const currentLength = this.value.length;
  counter.textContent = `${currentLength}/5000 caractères`;

  // Changement de couleur si proche de la limite
  if (currentLength > 4500) {
    counter.style.color = "orange";
  } else if (currentLength > 4900) {
    counter.style.color = "red";
  } else {
    counter.style.color = "";
  }
});

// Fonction d'envoi AJAX pour les deux formulaires
function handleFormAjax(formId, messageId) {
  const form = document.getElementById(formId);
  if (!form) return;

  // Créer le conteneur de message
  let messageContainer = document.getElementById(messageId);
  if (!messageContainer) {
    messageContainer = document.createElement("div");
    messageContainer.id = messageId;
    messageContainer.style.margin = "1.2em 0";
    const submitButton = form.querySelector(".form-actions");
    if (submitButton) {
      submitButton.parentNode.insertBefore(
        messageContainer,
        submitButton.nextSibling
      );
    }
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Réinitialiser les messages d'erreur
    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());

    // Vérification des champs requis
    let isValid = true;
    let missingFields = [];

    // Vérifier les champs texte
    form
      .querySelectorAll(
        'input[type="text"], input[type="email"], textarea'
      )
      .forEach((field) => {
        if (field.hasAttribute("required") && !field.value.trim()) {
          isValid = false;
          missingFields.push(field.name || field.id);
          field.style.borderColor = "red";
        } else {
          field.style.borderColor = "";
        }
      });

    // Vérifier les groupes de radio buttons
    form.querySelectorAll("fieldset").forEach((fieldset) => {
      const radioGroup = fieldset.querySelectorAll('input[type="radio"]');
      if (
        radioGroup.length > 0 &&
        !Array.from(radioGroup).some((radio) => radio.checked)
      ) {
        isValid = false;
        missingFields.push(fieldset.querySelector("legend").textContent);
        fieldset.style.borderColor = "red";
      } else {
        fieldset.style.borderColor = "";
      }
    });

    // Vérifier le reCAPTCHA
    let widgetId =
      formId === "contact-form-libre"
        ? window.recaptchaLibreWidgetId
        : window.recaptchaGuideWidgetId;
    const recaptchaResponse = grecaptcha.getResponse(widgetId);
    if (!recaptchaResponse) {
      isValid = false;
      missingFields.push("reCAPTCHA");
    }

    if (!isValid) {
      messageContainer.className = "error";
      messageContainer.innerHTML =
        "Veuillez remplir tous les champs obligatoires :<br>" +
        missingFields.map((field) => `- ${field}`).join("<br>");
      return;
    }

    // Désactiver le bouton d'envoi
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      messageContainer.innerHTML = "Envoi en cours...";

      // Préparer les données
      const formData = new FormData(form);
      formData.append("g-recaptcha-response", recaptchaResponse);

      // Formatage du contenu de l'email
      let emailContent = "Nouvelle demande de contact :\n\n";
      emailContent += "INFORMATIONS DE CONTACT :\n";
      emailContent += `Nom : ${formData.get("name")}\n`;
      emailContent += `Email : ${formData.get("email")}\n\n`;

      if (formId === "contact-form-guide") {
        emailContent += "DÉTAILS DE LA DEMANDE :\n";
        emailContent += `Type de problème : ${formData.get(
          "probleme"
        )}\n`;
        if (formData.get("probleme") === "Autre") {
          emailContent += `Précision : ${formData.get(
            "probleme_autre"
          )}\n`;
        }
        emailContent += `Type d'intervention : ${formData.get(
          "intervention"
        )}\n`;
        emailContent += `Niveau d'urgence : ${formData.get("urgence")}\n`;
        emailContent += `Disponibilités : ${formData.get(
          "disponibilites"
        )}\n`;
      } else {
        emailContent += "MESSAGE :\n";
        emailContent += formData.get("message") + "\n";
      }

      formData.append("email-content", emailContent);

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        messageContainer.className = "success";
        messageContainer.innerHTML =
          "Votre message a bien été envoyé. Nous vous répondrons rapidement.";
        form.reset();
        grecaptcha.reset(widgetId);
      } else {
        messageContainer.className = "error";
        messageContainer.innerHTML =
          data.message ||
          "Une erreur est survenue lors de l'envoi du message.";
      }
    } catch (error) {
      messageContainer.className = "error";
      messageContainer.innerHTML =
        "Une erreur est survenue lors de l'envoi du message.";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      messageContainer.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });
}

// Initialisation des widgets reCAPTCHA
document.addEventListener("DOMContentLoaded", function () {
  window.onloadCallback = function () {
    window.recaptchaLibreWidgetId = grecaptcha.render("recaptcha-libre", {
      sitekey: "6Le3tygrAAAAALWqA4Y4gWaT49rdhQK5Q5HjP3aF",
    });
    window.recaptchaGuideWidgetId = grecaptcha.render("recaptcha-guide", {
      sitekey: "6Le3tygrAAAAALWqA4Y4gWaT49rdhQK5Q5HjP3aF",
    });
    handleFormAjax("contact-form-libre", "form-messages-libre");
    handleFormAjax("contact-form-guide", "form-messages-guide");
  };
  if (typeof grecaptcha !== "undefined") {
    onloadCallback();
  }
});

// Mettre à jour le script reCAPTCHA pour utiliser le callback
document
  .querySelector('script[src*="recaptcha/api.js"]')
  .setAttribute("data-callback", "onloadCallback");

// JS pour basculer l'affichage des formulaires
const formTypeRadios = document.querySelectorAll(
  'input[name="formType"]'
);
const formLibre = document.getElementById("contact-form-libre");
const formGuide = document.getElementById("contact-form-guide");
formTypeRadios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "libre") {
      formLibre.style.display = "";
      formGuide.style.display = "none";
    } else {
      formLibre.style.display = "none";
      formGuide.style.display = "";
    }
  });
});

// Effet de sélection visuel sur les options du formulaire guidé
function updateGuidedFormSelection() {
  document
    .querySelectorAll(".contact-form-guided .option")
    .forEach((label) => {
      const input = label.querySelector('input[type="radio"]');
      input.addEventListener("change", function () {
        // Retirer la classe selected de tous les labels du même groupe
        document
          .querySelectorAll(".contact-form-guided .option")
          .forEach((lab) => {
            if (lab.querySelector('input[name="' + input.name + '"]')) {
              lab.classList.remove("selected");
            }
          });
        // Ajouter la classe selected au label cliqué
        if (input.checked) {
          label.classList.add("selected");
        }
      });
    });
}
updateGuidedFormSelection();

// Afficher le champ texte si 'Autre' est sélectionné pour le problème
const problemeRadios = document.querySelectorAll(
  'input[name="probleme"]'
);
const autreField = document.getElementById("autre-probleme-field");
problemeRadios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "Autre") {
      autreField.style.display = "";
      autreField.querySelector("input").required = true;
    } else {
      autreField.style.display = "none";
      autreField.querySelector("input").required = false;
    }
  });
});

// Correction du pattern email dans les formulaires
document.querySelectorAll('input[type="email"]').forEach((input) => {
  input.setAttribute(
    "pattern",
    "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
  );
});

// Désactiver les champs requis des formulaires masqués
function updateFormRequiredFields() {
  const libreForm = document.getElementById("contact-form-libre");
  const guideForm = document.getElementById("contact-form-guide");
  if (!libreForm || !guideForm) return;
  if (libreForm.style.display === "none") {
    libreForm
      .querySelectorAll("[required]")
      .forEach((el) => (el.disabled = true));
    guideForm
      .querySelectorAll("[disabled]")
      .forEach((el) => (el.disabled = false));
  } else {
    guideForm
      .querySelectorAll("[required]")
      .forEach((el) => (el.disabled = true));
    libreForm
      .querySelectorAll("[disabled]")
      .forEach((el) => (el.disabled = false));
  }
}
// Appeler la fonction à chaque changement d'onglet
const radios = document.querySelectorAll('input[name="formType"]');
radios.forEach((radio) => {
  radio.addEventListener("change", updateFormRequiredFields);
});
// Appel initial au chargement
updateFormRequiredFields();

// Gestion du formulaire guidé
document.addEventListener("DOMContentLoaded", function () {
  const guidedForm = document.getElementById("contact-form-guide");
  const messageContainer = document.getElementById("form-messages-guide");

  if (guidedForm) {
    guidedForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validation des champs requis
      const requiredFields = [
        "name",
        "email",
        "support",
        "probleme",
        "intervention",
        "urgence",
        "disponibilites",
        "privacy",
      ];
      let isValid = true;

      requiredFields.forEach((field) => {
        const input = document.getElementById(field);
        if (!input || !input.value) {
          isValid = false;
          input.classList.add("error");
        } else {
          input.classList.remove("error");
        }
      });

      if (!isValid) {
        messageContainer.innerHTML =
          '<div class="alert alert-danger">Veuillez remplir tous les champs requis</div>';
        return;
      }

      // Formatage du contenu de l'email
      const emailContent = `
        Nom: ${document.getElementById("name").value}
        Email: ${document.getElementById("email").value}
        Type de support: ${document.getElementById("support").value}
        Problème: ${document.getElementById("probleme").value}
        Type d'intervention: ${
          document.getElementById("intervention").value
        }
        Niveau d'urgence: ${document.getElementById("urgence").value}
        Disponibilités: ${document.getElementById("disponibilites").value}
      `;

      // Envoi de l'email via EmailJS
      emailjs
        .send("service_a9wr65h", "template_k02wzul", {
          to_email: "contact.it2help@gmail.com",
          from_name: document.getElementById("name").value,
          from_email: document.getElementById("email").value,
          message: emailContent,
        })
        .then(function () {
          messageContainer.innerHTML =
            '<div class="alert alert-success">Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.</div>';
          guidedForm.reset();
        })
        .catch(function (error) {
          console.error("Erreur lors de l'envoi:", error);
          messageContainer.innerHTML =
            '<div class="alert alert-danger">Une erreur est survenue l\'envoi du message. Veuillez réessayer.</div>';
        });
    });
  }
});
