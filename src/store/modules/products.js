import shop from "../../api/shop";

export default {
  namespaced: true,
  state: {
    products: []
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    decrementProductInventory(state, product) {
      product.inventory--;
    },
    incrementProductInventory(state, product){
      product.inventory++;
    }
  },
  getters: {
    availableProducts(state, getters) {
      return state.products.filter(product => product.inventory > 0)
    },
    productIsInStock() {
      return (product) => {
        return product.inventory > 0
      }
    },
    getProductById(state){
      return (id) => {
      return state.products.find(product => id === product.id);
      }
    },
    productIsInCart(){
      return (product, cart) => {
      return !!cart.find(item => item.id === product.id);
      }
    }
  },
  actions: {
    fetchProducts({commit}) {//context: set of methods and properties like the store object
      // => context.state and context.commit are possible
      //make the call
      //run setProducts mutation

      return new Promise((resolve, reject) =>
        shop.getProducts(products => {
          commit('setProducts', products);
          resolve();
        })
      )
    }
  }
}
