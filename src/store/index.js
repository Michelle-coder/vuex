import Vuex from 'vuex';
import Vue from 'vue';
import actions from "./actions";
import cart from "./modules/cart";
import products from "./modules/products";


Vue.use(Vuex);

export default new Vuex.Store({
  modules: { //split / categorized the index.js in modules
    cart, products
  },
  state: { //like data:
  },
  getters: {// computed properties
    //getters update automatically
  },
  //shorthand for actions: actions
  actions,
  mutations: {//setting and updating the states
  }
});
