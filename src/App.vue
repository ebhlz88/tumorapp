<template>
  <div id="app">
    <navbarr />

    <router-view class="rview" />
  </div>
</template>
<script>
import navbarr from "./components/navbar.vue";
export default {
  components: {
    navbarr,
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  background-image: url("./assets/backk.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
.rview {
  min-height: 576px;
}
</style>
