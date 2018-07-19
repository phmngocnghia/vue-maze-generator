import vuex from 'vuex';
import Vue from 'vue';
import actions from './actions';
import mutations from './mutations';
import state from './state';


Vue.use(vuex);

export default new vuex.Store({
  state, actions, mutations,
});
