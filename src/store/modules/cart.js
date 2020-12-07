import shop from "../../api/shop";

export default {
  namespaced: true,
  state: {
    //{id, price, quantity}
    cart: [],
    checkoutStatus: null
  },
  getters: {
    cartItems(state, getters, rootState, rootGetters) {
      return state.cart.map(cartItem => {
        const product = rootGetters['products/getProductById'](cartItem.id);
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      });
    },
    cartTotal(state, getters) {
      return getters.cartItems.reduce((total, product) => total + product.price * product.quantity, 0);
    },
    getCartItemById(state) {
      return (id) => {
        return state.cart.find(item => item.id === id);
      }
    },
    getCartWithPositiveProductQuantity(state){
      return state.cart.filter(cartItem => cartItem.quantity > 0);
    }
  },
  mutations: {
    incrementItemQuantity(state, cartItem) {
      cartItem.quantity++;
    },
    decrementItemQuantity(state, cartItem) {
      cartItem.quantity--;
    },
    pushProductToCart(state, productId) {
      state.cart.push({id: productId, quantity: 1});
    },
    setCheckoutStatus(state, status) {
      state.checkoutStatus = status;
    },
    emptyCart(state) {
      state.cart = [];
    },
    overrideCartWithArray(state, newArray){
      state.cart = newArray;
    }
  },
  actions: {
    //rootGetters: access getters outside the module (cause of namespaced)
    addProductToCart({state, getters, commit, rootState, rootGetters}, product) {
      if (rootGetters['products/productIsInStock'](product)) {
        const cartItem = state.cart.find(item => item.id === product.id);
        if (!cartItem) {
          commit('pushProductToCart', product.id);
        } else {
          commit('incrementItemQuantity', cartItem);
        }
        commit('products/decrementProductInventory', product, {root: true}); //so vuex uses products from the root and doesn't search for cart/products/decrement...
      }
    },
    checkout({state, commit}) {
      shop.buyProducts(state.cart, () => {
        commit('emptyCart');
        commit('setCheckoutStatus', 'success')
      }, () => {
        commit('setCheckoutStatus', 'fail')
      })
    },
    clear({state, commit, rootGetters, dispatch}) {
      state.cart.forEach(cartItem => {
        while (cartItem.quantity > 0) {
          const product = rootGetters['products/getProductById'](cartItem.id);
          commit('products/incrementProductInventory', product, {root: true});
          commit('decrementItemQuantity', cartItem);
        }
      });
      dispatch('removeProductsFromCartWithNoQuantity');
    },
    removeProductFromCart({state, mutations, getters, commit, rootMutations, rootState, actions, dispatch}, product) {
      let cartItem = getters.getCartItemById;
      cartItem = cartItem(product.id);
      commit('decrementItemQuantity', cartItem);
      commit('products/incrementProductInventory', product, {root: true});
      dispatch('removeProductsFromCartWithNoQuantity');
    },
    removeProductsFromCartWithNoQuantity({state, mutations, commit, getters}){
      const newCart = getters.getCartWithPositiveProductQuantity;
      commit('overrideCartWithArray', newCart);
    }
  }
}
