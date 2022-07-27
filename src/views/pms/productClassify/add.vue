<!--
 * @Author: Ayan
 * @Date: 2022-02-14 11:52:49
 * @LastEditors: Ayan
 * @LastEditTime: 2022-02-14 15:19:54
 * @Description: file not
-->
<template> 
  <product-classify-detail :is-edit='false'></product-classify-detail>
</template>
<script>
import ProductClassifyDetail from './components/ProductClassifyDetail'
export default {
  name: 'addProductClassify',
  components: { ProductClassifyDetail }
}
</script>
<style>
</style>


