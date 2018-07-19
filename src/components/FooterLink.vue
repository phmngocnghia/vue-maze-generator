<template>
  <div>
   <a :href="href">
    <span class="icon">
      <font-awesome-icon
        :icon = "['fab',iconName]">
      </font-awesome-icon>
    </span>
    {{text}}
   </a>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  data() {
    return {
    };
  },

  props: ['iconName', 'text', 'tooltipText', 'href'],

  components: {
    FontAwesomeIcon,
  },
};
</script>

<style scoped>
div {
  padding: 10px;
  display: inline-block
}

a{
  color: white;

  letter-spacing: 2px
}

</style>
