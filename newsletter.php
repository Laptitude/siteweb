<?php
// Vérifier s'il y a des messages de succès ou d'erreur
$success = isset($_GET['success']) && $_GET['success'] == '1';
$error = isset($_GET['error']) && $_GET['error'] == '1';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter - IT2Help</title>
    <meta name="description" content="Abonnez-vous à notre newsletter pour recevoir nos conseils et actualités informatiques.">
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Header -->
    <?php include 'includes/navbar.php'; ?>

    <section class="page-section newsletter">
        <div class="page-header">
            <h1>Newsletter IT2Help</h1>
            <div class="separator"></div>
            <p class="lead">Restez informé des dernières actualités informatiques et recevez nos conseils personnalisés</p>
        </div>

        <div class="container">
            <div class="newsletter-signup">
                <h2>Inscrivez-vous à notre newsletter</h2>
                <p>Recevez nos actualités, conseils techniques et offres exclusives directement dans votre boîte mail.</p>

                <?php if ($success): ?>
                <div id="form-messages" class="alert success">
                    <p>Merci pour votre inscription ! Vous recevrez bientôt nos prochaines newsletters.</p>
                </div>
                <?php elseif ($error): ?>
                <div id="form-messages" class="alert error">
                    <p>Une erreur est survenue lors de votre inscription. Veuillez réessayer.</p>
                </div>
                <?php endif; ?>

                <form id="newsletter-form" action="includes/newsletter-subscribe.php" method="post">
                    <div class="form-group">
                        <label for="email">Votre adresse email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group checkbox">
                        <input type="checkbox" id="consent" name="consent" required>
                        <label for="consent">J'accepte de recevoir la newsletter d'IT2Help et confirme avoir lu la <a href="politique-confidentialite.php">politique de confidentialité</a>.</label>
                    </div>
                    <button type="submit" class="btn-primary">S'inscrire <i class="fas fa-arrow-right"></i></button>
                </form>
            </div>

            <div class="articles-section">
                <h2>Nos derniers articles</h2>
                <div class="articles-grid">
                    <article class="article-card">
                        <div class="article-image">
                            <img src="images/articles/securite-informatique.jpg" alt="Sécurité informatique" class="lazy-load">
                            <i class="fas fa-link"></i>
                        </div>
                        <div class="article-content">
                            <div class="article-meta">
                                <span class="date">15 Nov 2023</span>
                                <span class="category">Sécurité</span>
                            </div>
                            <h3>Les meilleures pratiques de sécurité informatique en 2023</h3>
                            <p>Découvrez comment protéger efficacement vos données et vos appareils contre les cybermenaces.</p>
                            <a href="#" class="read-more">Lire l'article <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>

                    <article class="article-card">
                        <div class="article-image">
                            <img src="images/articles/sauvegarde-donnees.jpg" alt="Sauvegarde de données" class="lazy-load">
                            <i class="fas fa-link"></i>
                        </div>
                        <div class="article-content">
                            <div class="article-meta">
                                <span class="date">28 Oct 2023</span>
                                <span class="category">Conseils</span>
                            </div>
                            <h3>Comment sauvegarder efficacement vos données</h3>
                            <p>Les meilleures solutions pour sécuriser vos données importantes et éviter les pertes irrémédiables.</p>
                            <a href="#" class="read-more">Lire l'article <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>

                    <article class="article-card">
                        <div class="article-image">
                            <img src="images/articles/maintenance-pc.jpg" alt="Maintenance PC" class="lazy-load">
                            <i class="fas fa-link"></i>
                        </div>
                        <div class="article-content">
                            <div class="article-meta">
                                <span class="date">10 Oct 2023</span>
                                <span class="category">Maintenance</span>
                            </div>
                            <h3>5 astuces pour prolonger la durée de vie de votre ordinateur</h3>
                            <p>Des conseils simples mais efficaces pour optimiser les performances et la longévité de votre matériel.</p>
                            <a href="#" class="read-more">Lire l'article <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <?php include 'includes/footer.php'; ?>

    <script src="js/main.js"></script>
    <script src="js/cookie-consent.js"></script>
</body>
</html> 