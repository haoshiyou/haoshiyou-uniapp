<template>
  <div class="container-fluid d-flex">
    <div class="col-6 h-100">
      <MapView :listings="listingsWithGeo"></MapView>
    </div>
    <div class="col-6 h-100">
      <div v-for="listing in listings">
        <HsyListingComp v-bind:listing="listing"></HsyListingComp>
      </div>
    </div>
  </div>
</template>

<script>
import HsyListingComp from '~/components/HsyListingComp.vue';
import MapView from '~/components/MapView.vue'
export default {
  components: {
    HsyListingComp,
    MapView,
  },

  async asyncData({ $axios }) {
    const listings = await $axios.$get(`/api/v1/HsyListing/list`);
    return { listings }
  },
  computed: {
    listingsWithGeo: function() {
      return this.listings.filter(l => l && l.geo && l.geo.lat && l.geo.lng) ;
    }
  }
}
</script>

<style>
.container {
  margin: 0;
  padding: 0;
}
</style>
