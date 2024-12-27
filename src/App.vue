<template>
  <div id="app">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/TheHeader.vue'
import Footer from '@/components/TheFooter.vue'
</script>

<style scoped lang="scss">
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow-x: hidden
}

main {
  flex-grow: 1;
  padding: 20px;
  background-color: white;
}
</style>
