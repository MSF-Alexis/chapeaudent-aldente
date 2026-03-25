<script setup>
import { RouterLink, RouterView } from 'vue-router'
import logo from '@/assets/logo.png';
</script>

<template>
  <div class="app">
    <header class="app-header">
      <nav class="app-nav">
        <RouterLink to="/" class="app-nav__brand">
          <img :src="logo" alt="">
          Chapeaudents
        </RouterLink>

        <ul class="app-nav__links">
          <li>
            <RouterLink to="" class="app-nav__link">
              HTML
            </RouterLink>
          </li>
          <li>
            <RouterLink to="" class="app-nav__link">
              CSS
            </RouterLink>
          </li>
          <li>
            <RouterLink to="" class="app-nav__link">
              JavaScript
            </RouterLink>
          </li>
          <li>
            <RouterLink to="" class="app-nav__link">
              Intégration
            </RouterLink>
          </li>
        </ul>
      </nav>
    </header>

    <RouterView />
  </div>
</template>
