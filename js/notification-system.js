/**
 * IT2Help - Système de notifications
 * Gère les notifications de contact et autres événements
 */

class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.container = null;
    this.storageKey = "it2help_notifications";
    this.maxNotifications = 5;

    this.initialize();
  }

  initialize() {
    // Créer le conteneur de notifications s'il n'existe pas déjà
    if (!document.getElementById("notification-container")) {
      this.container = document.createElement("div");
      this.container.id = "notification-container";
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById("notification-container");
    }

    // Récupérer les notifications stockées
    this.loadNotifications();

    // Afficher les notifications existantes
    this.renderNotifications();

    // Ajouter les écouteurs d'événements pour le formulaire de contact
    this.setupEventListeners();
  }

  // Charger les notifications depuis le stockage local
  loadNotifications() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.notifications = JSON.parse(stored);
      } catch (e) {
        console.error("Erreur lors du chargement des notifications:", e);
        this.notifications = [];
      }
    }
  }

  // Sauvegarder les notifications dans le stockage local
  saveNotifications() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
  }

  // Ajouter une nouvelle notification
  addNotification(message, type = "info", duration = 5000) {
    const id = Date.now();
    const notification = {
      id,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Ajouter au début du tableau
    this.notifications.unshift(notification);

    // Limiter le nombre de notifications
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications);
    }

    // Sauvegarder
    this.saveNotifications();

    // Mettre à jour l'affichage
    this.renderNotifications();

    // Afficher une alerte temporaire
    this.showToast(notification, duration);

    return id;
  }

  // Marquer une notification comme lue
  markAsRead(id) {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notifications[index].read = true;
      this.saveNotifications();
      this.renderNotifications();
    }
  }

  // Supprimer une notification
  removeNotification(id) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveNotifications();
    this.renderNotifications();
  }

  // Afficher une notification temporaire (toast)
  showToast(notification, duration) {
    const toast = document.createElement("div");
    toast.className = `notification-toast ${notification.type}`;
    toast.innerHTML = `
      <div class="notification-icon">
        <i class="fas ${this.getIconForType(notification.type)}"></i>
      </div>
      <div class="notification-content">
        <p>${notification.message}</p>
      </div>
      <button class="notification-close" aria-label="Fermer">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Ajouter à la page
    document.body.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Gérer le clic sur le bouton de fermeture
    const closeBtn = toast.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    });

    // Disparaître automatiquement après la durée spécifiée
    if (duration > 0) {
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, duration);
    }
  }

  // Afficher toutes les notifications dans le conteneur
  renderNotifications() {
    // Vider le conteneur
    this.container.innerHTML = "";

    // Pas de notifications
    if (this.notifications.length === 0) {
      this.container.innerHTML =
        '<div class="no-notifications">Aucune notification</div>';
      return;
    }

    // Créer les éléments pour chaque notification
    this.notifications.forEach((notification) => {
      const notificationEl = document.createElement("div");
      notificationEl.className = `notification-item ${notification.type} ${
        notification.read ? "read" : "unread"
      }`;

      // Formater la date
      const date = new Date(notification.timestamp);
      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      notificationEl.innerHTML = `
        <div class="notification-icon">
          <i class="fas ${this.getIconForType(notification.type)}"></i>
        </div>
        <div class="notification-content">
          <p>${notification.message}</p>
          <small>${formattedDate}</small>
        </div>
        <div class="notification-actions">
          <button class="btn-mark-read" title="Marquer comme lu" data-id="${
            notification.id
          }">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn-delete" title="Supprimer" data-id="${
            notification.id
          }">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      this.container.appendChild(notificationEl);
    });

    // Ajouter les écouteurs d'événements pour les boutons
    this.container.querySelectorAll(".btn-mark-read").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        this.markAsRead(id);
      });
    });

    this.container.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        this.removeNotification(id);
      });
    });

    // Mettre à jour le compteur de notifications non lues
    this.updateNotificationCount();
  }

  // Mettre à jour le compteur de notifications
  updateNotificationCount() {
    const unreadCount = this.notifications.filter((n) => !n.read).length;

    // Créer ou mettre à jour l'élément de compteur
    let countBadge = document.getElementById("notification-count");
    if (!countBadge) {
      countBadge = document.createElement("span");
      countBadge.id = "notification-count";
      document.body.appendChild(countBadge);
    }

    if (unreadCount > 0) {
      countBadge.textContent = unreadCount;
      countBadge.style.display = "block";
    } else {
      countBadge.style.display = "none";
    }
  }

  // Configurer les écouteurs d'événements
  setupEventListeners() {
    // Intercepter les soumissions de formulaire de contact
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        // Ne pas intercepter si c'est une soumission AJAX
        if (!e.submitter || !e.submitter.classList.contains("ajax-submit")) {
          // Stocker les données du formulaire pour notification
          const formData = new FormData(contactForm);
          const name = formData.get("name") || "Client";
          const email = formData.get("email") || "";
          const subject = formData.get("subject") || "Contact";

          // Créer une notification de test (pour la démo)
          setTimeout(() => {
            this.addNotification(
              `Nouveau message de ${name} (${email}) concernant: ${subject}`,
              "success"
            );
          }, 2000);
        }
      });
    }
  }

  // Obtenir l'icône Font Awesome en fonction du type de notification
  getIconForType(type) {
    switch (type) {
      case "success":
        return "fa-check-circle";
      case "error":
        return "fa-exclamation-circle";
      case "warning":
        return "fa-exclamation-triangle";
      case "info":
      default:
        return "fa-info-circle";
    }
  }
}

// Initialiser le système de notifications
document.addEventListener("DOMContentLoaded", () => {
  window.notificationSystem = new NotificationSystem();

  // Pour la démo, ajouter une notification de bienvenue si c'est la première visite
  if (!localStorage.getItem("it2help_first_visit")) {
    window.notificationSystem.addNotification(
      "Bienvenue sur IT2Help ! N'hésitez pas à nous contacter pour toute question.",
      "info",
      8000
    );
    localStorage.setItem("it2help_first_visit", "true");
  }
});
