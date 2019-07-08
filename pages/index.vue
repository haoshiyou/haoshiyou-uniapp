<template>
  <div class="container-fluid d-flex p-0">
    <div class="col-6 p-0">
      <MapView :listings="listingsWithGeo"></MapView>
    </div>
    <div class="col-6 p-0">
      <div class="container" style="height: 948px;overflow: scroll">
          <template v-for="listing in listings">
            <HsyListingComp v-bind:listing="listing"></HsyListingComp>
          </template>
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import HsyListingComp from '~/components/HsyListingComp.vue';
import MapView from '~/components/MapView.vue';
import * as $ from 'jquery';

let handleResize = function () {
  // Calculate new canvas size based on window
  $('#hsy_mapview > .GMap__Wrapper').height(window.innerHeight);
  $('#hsy_mapview > .GMap__Wrapper').height(window.innerHeight);
};

export default {
  components: {
    HsyListingComp,
    MapView,
  },
  data: function () {
    return {
      height: 512,
      width: 512,
      margin: 20,
    };
  },
  async asyncData({ $axios }) {
    const listings = await $axios.$get(`/api/v1/HsyListing/list`);
    return { listings }
  },
  computed: {
    listingsWithGeo: function() {
      return this.listings.filter(l => l && l.geo && l.geo.lat && l.geo.lng) ;
    }
  },
  mounted() {
    window.addEventListener('resize', handleResize);
    handleResize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', handleResize);
  }
}
</script>

<style>
.container {
  margin: 0;
  padding: 0;
}
html, body {
  height: 100%;
}

.container, .container-fluid {
  height: 100%;
  overflow: hidden;
}
</style>
