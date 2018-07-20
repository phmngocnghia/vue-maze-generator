<template>
<div>
  <sweet-modal title="Settings" ref = "settings" modal-theme="dark" overlay-theme = "dark">
    <div class="error" v-if = "error">
      <font-awesome-icon
        :icon = "['fas','exclamation-triangle']">
      </font-awesome-icon>&nbsp;
      {{error}}
    </div>
    <sweet-modal-tab title="Generator" id="Generator">
      <div>
        <h2>Maze size (cell)</h2>
        <p>Rows &nbsp;
        <input required type="number" min = "1" max = "15" v-model.number = "settings.rows"></p>
        <p>column
        <input required type="number" min = "1" max = "15" v-model.number = "settings.cols"></p>
        <h2>Start position: </h2>
        <checkbox-list
        class="mb d-flex"
        :data = "['Top','Bottom', 'Left', 'Right']"
        v-model.number = "settings.startPosition"/>
         <h2>End position: </h2>
        <checkbox-list
        class="d-flex"
        :data = "['Top','Bottom', 'Left', 'Right']"
        v-model.number = "settings.endPosition"/>
      </div>
    </sweet-modal-tab>
    <sweet-modal-tab title="Styles" id="Styles">
      <h2>Color</h2>
      <p>Solution color <input type="color" v-model.number="settings.solutionColor"></p>
      <p>Wall color <input type="color" v-model.number="settings.wallColor"></p>
      <p>Path color <input type="color" v-model.number="settings.visitedPathColor"></p>
      <p>Active Path color <input type="color" v-model.number="settings.activePathColor"></p>
      <h2>Size (px)</h2>
      <p>Path width
      <input
      required
      type="number"
      min = "1"
      max = "200"
      v-model.number = "settings.pathWidth"></p>
    </sweet-modal-tab>
    <button slot = "button" @click = "saveSettings" class="py-2">
      <FontAwesomeIcon icon="save" class="fa-fw" />
      Save
    </button>
  </sweet-modal>

  <sweet-modal icon="success" title="Congratulation" ref = "saveSettingsSuccessfully">
      Your settings has been saved successfully !
  </sweet-modal>
</div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import CheckboxList from '../components/CheckboxList';
import action from '../store/actions.js';

export default {
  data() {
    return {
      error: false,

      /**
       * Defined default value
       */

      settings: {
        rows: 10,
        cols: 10,
        startPosition: 'Top',
        endPosition: 'Bottom',
        solutionColor: '#039BE5',
        wallColor: '#212121',
        visitedPathColor: '#ffffff',
        activePathColor: '#4CAF50',
        pathWidth: 30,
      },
    };
  },

  methods: {
    openModal() {
      this.$refs.settings.open();
    },

    saveSettings() {
      /**
       * Validate textinput not empty
       */
      const {
        rows,
        cols,
        wallWidth,
      } = this.settings;

      const arr = [rows, cols, wallWidth];

      if (!(rows && cols && wallWidth)) {
        this.error = 'Invalid config';
      } else if (arr.some(elem => elem < 0)) {
        this.error = 'Number must be ';
      } else if (rows > 15) {
        this.error = 'Number of row must smaller than 16';
      } else if (cols > 15) {
        this.error = 'Number of colunm must be smaller than 16';
      } else {
        // OK
        this.error = false;

        // Save config
        this.$store.dispatch('setSettings', this.settings);

        this.$refs.saveSettingsSuccessfully.open();
        this.$refs.settings.close()

        // Save settings into local storage
        localStorage.setItem('settings', JSON.stringify(this.settings));
      }
    },
  },

  components: {
    CheckboxList,
    FontAwesomeIcon,
  },

  mounted() {
    // Load saved settings
    const savedLocalStorageJson = localStorage.getItem('settings');

    if (savedLocalStorageJson) {
      const savedLocalStorage = JSON.parse(savedLocalStorageJson);
      Object.assign(this.settings, savedLocalStorage);
    }

    this.$store.dispatch('setSettings', this.settings);
  },
};
</script>

<style scoped>
.sweet-buttons {
  padding: 30px 0px
}

.mb {
  margin-bottom: 20px
}
.mt {
  margin-top: 20px
}
.error {
  color: #ff3a3a;
  font-weight: bold;
  font-size: 24px;
  padding-bottom: 10px;
}

h2{
  margin-top: 0px
}

button{
  background: rgba(0,140,186,1);
  color: white
}

p{
  margin-bottom: 20px
}

div {
  text-align: left;
}

input[type="number"]{
  border-radius: 0px;
  border-color:#2c3e50;
  border-width: 1px;
  padding: 5px;
  margin-left: 5px
}

input[type="number"]:focus{
  border-color: #039BE5
}
</style>
