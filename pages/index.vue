<template>
  <div class="container-fluid">
    <div>
      <div v-for="listing in listings">
        <HsyListingComp v-bind:listing="listing"></HsyListingComp>
      </div>
    </div>
  </div>
</template>

<script>
import HsyListingComp from '~/components/HsyListingComp.vue'
export default {

  components: {
    HsyListingComp,
  },

  async asyncData({ $axios }) {
    const listings = await $axios.$get(`/api/v1/HsyListing/list`);
    return { listings }
  },
}
</script>

<style>
.container {
  margin: 0;
  padding: 0;
}
</style>
