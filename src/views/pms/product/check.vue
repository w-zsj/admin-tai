<template> 
  <product-detail :is-check='true'></product-detail>
</template>
<script>
import ProductDetail from './components/ProductDetail'
export default {
  name: 'addProduct',
  components: { ProductDetail }
}
</script>
<style>
</style>
