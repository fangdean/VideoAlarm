<template>
  <div id="app">
    <SafeControl/>
  </div>
</template>

<script>
import SafeControl from './components/SafeControl.vue'

export default {
  name: 'app',
  components: {
    SafeControl
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
