<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <keep-alive :include="keepAliveWhiteList">
        <router-view />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  props: {
    keepAliveWhiteList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
