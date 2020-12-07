<template>
  <div>
    <h1>Product List</h1>
    <img src="https://i.imgur.com/JfPpwOA.gif" v-if="loading">
    <ul v-else>
      <li v-for="product in products">
        {{ product.title }} - {{ product.price | currency}} - {{product.inventory}}
      <button :disabled="!productIsInStock(product)" @click="addProductToCart(product)">Add to cart</button>
        <button :disabled="!productIsInCart(product, cart)" @click="removeProductFromCart(product)">Remove from cart</button>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';
export default {
  name: "ProductList",
  data() {
    return {loading: false}
  },
  computed: {
    //access state directly (without this.$store.state....)
    ...mapState({
      products: state => state.products.products,
      cart: state => state.cart.cart
    }),
    ...mapGetters('products', {
      productIsInStock: 'productIsInStock',
      productIsInCart: 'productIsInCart'
    })
  },

  methods: {
    ...mapActions({
      // no this.$store.dispatch needed anymore :)
      fetchProducts: 'products/fetchProducts',
      addProductToCart: 'cart/addProductToCart',
      removeProductFromCart: 'cart/removeProductFromCart'
    }),
  },
  created() {
    //dispatch: like commit but for calling actions
    this.loading = true;
    this.fetchProducts()
      .then(() => this.loading = false)
  }
}
</script>

<style scoped>

</style>
