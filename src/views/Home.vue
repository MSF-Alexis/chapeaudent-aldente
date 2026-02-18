<script setup>
</script>

<template>
    <main class="home">
        <header class="home-hero">
            <div class="home-hero__content">
                <h1>Chapeaudent</h1>
                <p class="home-hero__subtitle">
                    Un catalogue de fiches HTML, CSS, JavaScript et Intégration
                    pour apprendre pas à pas, du niveau débutant à expert.
                </p>

                <div class="home-hero__actions">
                    <RouterLink class="btn btn--primary" to="/parcours/debutant">
                        Commencer le parcours débutant
                    </RouterLink>
                    <RouterLink class="btn btn--ghost" to="/html">
                        Voir toutes les fiches HTML
                    </RouterLink>
                </div>

                <p class="home-hero__hint">
                    Choisis un domaine ou un niveau, puis explore les fiches avec
                    théorie, exemples, sources et exercices.
                </p>
            </div>
        </header>

        <section class="home-section">
            <h2>Domaines de compétences</h2>

            <div class="domain-grid">
                <article class="domain-card domain-card--html">
                    <h3>HTML</h3>
                    <p class="domain-card__description">
                        Structurer le contenu, utiliser les balises sémantiques,
                        formulaires, tableaux, accessibilité…
                    </p>

                    <ul class="domain-card__meta">
                        <li><strong>Fiches :</strong> ~XX</li>
                        <li><strong>Niveaux :</strong> Initial → Expert</li>
                        <li><strong>Compétences clés :</strong> structure de page, formulaires, tableaux, accessibilité.
                        </li>
                    </ul>

                    <div class="domain-card__actions">
                        <RouterLink class="btn btn--secondary" to="/html">
                            Explorer les fiches HTML
                        </RouterLink>
                    </div>
                </article>

                <article class="domain-card domain-card--css">
                    <h3>CSS</h3>
                    <p class="domain-card__description">
                        Mise en forme, layout, responsive design, Flexbox, Grid,
                        animations, thèmes et accessibilité.
                    </p>

                    <ul class="domain-card__meta">
                        <li><strong>Fiches :</strong> ~XX</li>
                        <li><strong>Niveaux :</strong> Initial → Expert</li>
                        <li><strong>Compétences clés :</strong> box model, Flexbox, Grid, media queries.</li>
                    </ul>

                    <div class="domain-card__actions">
                        <RouterLink class="btn btn--secondary" to="/css">
                            Explorer les fiches CSS
                        </RouterLink>
                    </div>
                </article>

                <article class="domain-card domain-card--js">
                    <h3>JavaScript</h3>
                    <p class="domain-card__description">
                        Logique, DOM, événements, JSON, asynchrone, gestion d’erreurs,
                        localStorage et patterns avancés.
                    </p>

                    <ul class="domain-card__meta">
                        <li><strong>Fiches :</strong> ~XX</li>
                        <li><strong>Niveaux :</strong> Initial → Expert</li>
                        <li><strong>Compétences clés :</strong> DOM, événements, tableaux, fonctions, async/await.</li>
                    </ul>

                    <div class="domain-card__actions">
                        <RouterLink class="btn btn--secondary" to="/js">
                            Explorer les fiches JavaScript
                        </RouterLink>
                    </div>
                </article>

                <article class="domain-card domain-card--integration">
                    <h3>Intégration</h3>
                    <p class="domain-card__description">
                        Bonnes pratiques d’intégration, accessibilité, performance,
                        workflow et organisation des projets.
                    </p>

                    <ul class="domain-card__meta">
                        <li><strong>Fiches :</strong> ~XX</li>
                        <li><strong>Niveaux :</strong> Initial → Expert</li>
                        <li><strong>Compétences clés :</strong> structure de projet, bonnes pratiques, a11y,
                            performances.</li>
                    </ul>

                    <div class="domain-card__actions">
                        <RouterLink class="btn btn--secondary" to="/integration">
                            Explorer les fiches d’intégration
                        </RouterLink>
                    </div>
                </article>
            </div>
        </section>

        <section class="home-section home-section--alt">
            <h2>Entrer par niveau</h2>
            <p class="home-section__intro">
                Tu peux aussi suivre les fiches dans l’ordre pédagogique,
                en fonction de ton niveau actuel.
            </p>

            <div class="level-grid">
                <article class="level-card">
                    <h3>Débutant</h3>
                    <p>Découvrir les bases : HTML, CSS et JavaScript avec des fiches “Initial” et “Basique”.</p>
                    <RouterLink class="btn btn--light" to="/parcours/debutant">
                        Parcours débutant
                    </RouterLink>
                </article>

                <article class="level-card">
                    <h3>Intermédiaire</h3>
                    <p>Approfondir avec des fiches “Opérationnel” : layouts, DOM, formulaires, accessibilité.</p>
                    <RouterLink class="btn btn--light" to="/parcours/intermediaire">
                        Parcours intermédiaire
                    </RouterLink>
                </article>

                <article class="level-card">
                    <h3>Avancé / Expert</h3>
                    <p>Explorer les sujets avancés : animations, patterns JS, performance, architectures CSS.</p>
                    <RouterLink class="btn btn--light" to="/parcours/avance">
                        Parcours avancé
                    </RouterLink>
                </article>
            </div>
        </section>
    </main>
</template>
