<template>
  <div id="app">
    <Header/>
    <Main/>
  </div>
</template>

<script>
import Header from './components/Header';
import Main from './components/Main';
import store from './store/index';

export default {
  name: 'App',
  components: {
    Main,
    Header,
  },
  store,
};
</script>

<style>
html {
  height: 100%;
}
body {
  min-height: 94%;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  letter-spacing: 1px;
  font-family: 'Muli', cursive !important;
}

a {
  text-decoration: none;
}

button {
  padding: 10px 20px;
  border: 0;
  border-radius: 3px;
  font-family: 'Muli', cursive !important
}
</style>
