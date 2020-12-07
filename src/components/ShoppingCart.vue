<template>
  <div>
    <h1>Shopping Cart</h1>
    <ul>
      <li v-for="product in products" v-show="product.quantity>0">
        {{ product.title }} - {{ product.price | currency }} - {{ product.quantity }}
      </li>
    </ul>
    <p>Total: {{ total | currency }}</p>
    <button @click="checkout">Checkout</button>
    <button @click="clear">Clear shopping cart</button>
    <p v-if="checkoutStatus">{{ checkoutStatus }}</p>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';

export default {
  name: "ShoppingCart",
  computed: {
    ...mapGetters('cart', { //no need for cart/cartProducts anymore
      products: 'cartItems',
      total: 'cartTotal'
    }),
    ...mapState('cart', {
      checkoutStatus: state => state.checkoutStatus
    })
  },
  methods: {
    //no need for $store.dispatch() anymore :)
    ...mapActions('cart', ['checkout', 'clear'])
  }
}
</script>

<style scoped>

</style>
