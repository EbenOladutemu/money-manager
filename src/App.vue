<template>
  <router-view />
</template>

<script setup></script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  display: inline-block;
  margin-top: 1rem;
  margin-bottom: 1rem;

  a {
    font-weight: bold;
    font-size: 18px;
    color: #2c3e50;
    padding: 0.75rem;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
