import fontawesome from '@fortawesome/fontawesome';
import Vue from 'vue';
import {
  faGithub,
  faLinkedin,
  faFacebookSquare,
  faStackOverflow,
} from '@fortawesome/fontawesome-free-brands';

import {
  faCircle,
  faCheckCircle,
  faExclamationTriangle,
} from '@fortawesome/fontawesome-free-solid';

import App from './App';
import SweetModal from '../node_modules/sweet-modal-vue/src/plugin';

fontawesome.library.add(
  faGithub,
  faLinkedin,
  faFacebookSquare,
  faStackOverflow,
  faCircle,
  faCheckCircle,
  faExclamationTriangle,
);

Vue.config.productionTip = false;

Vue.use(SweetModal);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
