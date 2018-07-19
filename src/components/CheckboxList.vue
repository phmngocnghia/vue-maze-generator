<template>
  <div>
    <button
    :class = "dataItem === value ? 'active' : 'disactive'"
    v-for = "dataItem in data"
    :key = "dataItem"
    @click = "setSelectedValue(dataItem)">
      <font-awesome-icon
      :icon = "['fas',dataItem === value ? 'check-circle' : 'circle']">
      </font-awesome-icon>
      {{dataItem}}
    </button>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  props: ['data', 'value'],
  methods: {
    setSelectedValue(value) {
      this.$emit('input', value);
    },
  },

  components: {
    FontAwesomeIcon,
  },
};
</script>

<style scoped>
svg{
  margin-right: 5px
}

button:not(:first-of-type){
  margin-left: 10px;
}

button.active{
  background: rgba(0,140,186,1);
  color: white
}

button.disactive{
    background-color: #DDDDDD;
    color: #a7a7a7;
}

</style>
