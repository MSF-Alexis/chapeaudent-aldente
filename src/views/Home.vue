<script setup lang="ts">

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
                    <RouterLink class="btn btn--primary" to="/parcours">
                        Commencer un parcours
                    </RouterLink>
                    <RouterLink class="btn btn--ghost" to="/">
                        Voir toutes les fiches
                    </RouterLink>
                </div>

                <p class="home-hero__hint">
                    Choisis un domaine ou un niveau, puis explore les fiches avec
                    théorie, exemples, sources et exercices.
                </p>
            </div>
            <div class="home-stats">
                <div class="stat-card">
                    <span class="stat-card__number">42</span>
                    <span class="stat-card__label">Fiches disponibles</span>
                </div>

                <div class="stat-card">
                    <span class="stat-card__number">6</span>
                    <span class="stat-card__label">Parcours disponibles</span>
                </div>
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
                        <li><strong>Fiches :</strong> {{ 0 }}</li>
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
                        <li><strong>Fiches :</strong> {{ 0 }}</li>
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
                        <li><strong>Fiches :</strong> {{ 0 }}</li>
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
                        <li><strong>Fiches :</strong> {{ 0 }}</li>
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
    </main>
</template>
<style scoped>
.home-stats {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    padding: 2rem 1rem;
}

.stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 2rem 3rem;
    background: var(--color-surface, #f8fafc);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: 1rem;
    min-width: 160px;
}

.stat-card__number {
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1;
}

.stat-card__label {
    font-size: 0.95rem;
    color: var(--color-text-muted, #64748b);
    text-align: center;
}
</style>