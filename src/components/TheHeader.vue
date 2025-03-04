<template>
  <header class="header">
    <div class="logo">
      <router-link to="/" class="logo">
        Project Management App
      </router-link>
    </div>
  </header>
</template>

<script setup></script>

<style scoped lang="scss">
.header {
  background-color: #2B2C37;
  color: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 20px 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  .logo {
    margin: 0;
    font-size: 1.25rem;
    letter-spacing: 0.2rem;
    font-weight: 400;
    color: #e0f2fe;
    text-decoration: none;
  }
}
</style>
