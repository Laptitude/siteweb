// Gestion du formulaire de contact
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form-guide");
  const messageContainer = document.getElementById("form-messages-guide");

  // Créer la section récapitulative
  const recapSection = document.createElement("div");
  recapSection.id = "recap-section";
  recapSection.className = "recap-section";
  recapSection.innerHTML = `
    <h3>Récapitulatif de votre demande</h3>
    <div class="recap-content">
      <p><strong>Appareil :</strong> <span id="recap-support">Non sélectionné</span></p>
      <p><strong>Problème :</strong> <span id="recap-probleme">Non sélectionné</span></p>
      <p><strong>Type d'intervention :</strong> <span id="recap-intervention">Non sélectionné</span></p>
      <p><strong>Niveau d'urgence :</strong> <span id="recap-urgence">Non sélectionné</span></p>
      <p><strong>Disponibilités :</strong> <span id="recap-disponibilites">Non sélectionné</span></p>
    </div>
  `;

  // Insérer le récapitulatif avant le bouton d'envoi
  const submitButton = form.querySelector(".form-actions");
  form.insertBefore(recapSection, submitButton);

  // Fonction pour mettre à jour le récapitulatif
  function updateRecap(fieldName, value) {
    const recapElement = document.getElementById(`recap-${fieldName}`);
    if (recapElement) {
      recapElement.textContent = value;
      recapElement.parentElement.classList.add("filled");
    }
  }

  // Gestion de la sélection des cartes
  const options = document.querySelectorAll(".option");
  options.forEach((option) => {
    const radio = option.querySelector('input[type="radio"]');

    // Initialiser l'état sélectionné si le radio est déjà coché
    if (radio && radio.checked) {
      option.classList.add("selected");
      updateRecap(radio.name, radio.value);
    }

    // Gérer le clic sur l'option
    option.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const name = radio.name;
      const wasChecked = radio.checked;

      // Désélectionner toutes les autres options du même groupe
      document
        .querySelectorAll(`.option input[name="${name}"]`)
        .forEach((input) => {
          input.closest(".option").classList.remove("selected");
          input.checked = false;
        });

      // Si l'option n'était pas déjà cochée, la sélectionner
      if (!wasChecked) {
        option.classList.add("selected");
        radio.checked = true;
        // Mettre à jour le récapitulatif
        updateRecap(name, radio.value);
      } else {
        // Si on désélectionne, mettre à jour le récapitulatif
        updateRecap(name, "Non sélectionné");
      }

      // Déclencher l'événement change pour le radio
      radio.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  // Afficher le champ texte si 'Autre' est sélectionné pour le problème
  const problemeRadios = document.querySelectorAll('input[name="probleme"]');
  const autreField = document.getElementById("autre-probleme-field");
  if (autreField) {
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
  }

  // Gestion de l'envoi du formulaire
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Récupérer les données du formulaire
      const formData = new FormData(form);

      // Vérifier les champs requis
      const requiredFields = [
        "name",
        "email",
        "probleme",
        "intervention",
        "urgence",
        "disponibilites",
      ];
      const missingFields = [];

      requiredFields.forEach((field) => {
        if (!formData.get(field)) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
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

        // Formatage du contenu de l'email
        let emailContent = "Nouvelle demande de contact :\n\n";
        emailContent += `Nom : ${formData.get("name")}\n`;
        emailContent += `Email : ${formData.get("email")}\n`;
        emailContent += `Support : ${formData.get("support")}\n`;
        emailContent += `Problème : ${formData.get("probleme")}\n`;
        if (formData.get("probleme") === "Autre") {
          emailContent += `Précision : ${formData.get("probleme_autre")}\n`;
        }
        emailContent += `Type d'intervention : ${formData.get(
          "intervention"
        )}\n`;
        emailContent += `Niveau d'urgence : ${formData.get("urgence")}\n`;
        emailContent += `Disponibilités : ${formData.get("disponibilites")}\n`;

        // Envoyer l'email via EmailJS
        const templateParams = {
          from_name: formData.get("name"),
          from_email: formData.get("email"),
          name: formData.get("name"),
          email: formData.get("email"),
          probleme: formData.get("probleme"),
          probleme_autre: formData.get("probleme_autre") || "",
          intervention: formData.get("intervention"),
          urgence: formData.get("urgence"),
          disponibilites: formData.get("disponibilites"),
          message: emailContent,
          to_name: "IT2Help",
          to_email: formData.get("email"),
          reply_to: formData.get("email"),
        };

        await emailjs.send(
          "service_a9wr65h",
          "template_k02wzul",
          templateParams
        );

        messageContainer.className = "success";
        messageContainer.innerHTML =
          "Votre message a bien été envoyé. Nous vous répondrons rapidement.";
        form.reset();
      } catch (error) {
        console.error("Erreur:", error);
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
});
