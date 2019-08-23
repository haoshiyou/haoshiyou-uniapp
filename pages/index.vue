<template>
  <div class="container-fluid d-flex p-0">
    <div class="col-6 p-0">
      <MapView :listings="listingsWithGeo"></MapView>
    </div>
    <div class="col-6 p-0">
      <div id="listing_container" class="container" style="height: 948px;overflow: scroll">
          <template v-for="listing in listings">
            <HsyListingComp v-bind:listing="listing"></HsyListingComp>
          </template>
          <div class="mx-auto w-100 spinner-container">
              <div id="loading_indicator"  class="spinner-border my-2" role="status">
                  <span class="sr-only">Loading...</span>
              </div>
          </div>

      </div>
    </div>
  </div>
</template>

<script>
import HsyListingComp from '~/components/HsyListingComp.vue';
import MapView from '~/components/MapView.vue';
import * as $ from 'jquery';

/*!
 * Determine if an element is in the viewport
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}    elem The element
 * @return {Boolean}      Returns true if element is in the viewport
 */
var isInViewport = function (elem) {
    var distance = elem.getBoundingClientRect();
    return (
        distance.top >= 0 &&
        distance.left >= 0 &&
        distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        distance.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

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
      limit: 10,
    };
  },
  async asyncData({ $axios }) {
    const limit = 10;
    const listings = await $axios.$get(
          `/api/v1/HsyListing/list?offset=0&limit=${limit}`);
    return { listings, limit }
  },
  computed: {
    listingsWithGeo: function() {
      return this.listings.filter(l => l && l.geo && l.geo.lat && l.geo.lng) ;
    }
  },
  methods: {
      loadMoreListing: async function () {
          let newListings = await this.$axios.$get(
              `/api/v1/HsyListing/list?offset=${this.listings.length}&$limit=${this.limit}`);
          this.listings = this.listings.concat(newListings);
      }
  },
  mounted() {
    window.addEventListener('resize', handleResize);
    handleResize();
    let dom = document.getElementById("loading_indicator");
    console.log(`adding listener`);
    document.getElementById("listing_container")
        .addEventListener('scroll', async (event) => {
            console.log(`scroll event! isInViewport(dom) = `, isInViewport(dom));
            if(isInViewport(dom)) {
                // console.log(`Indicator in display again!`);
                await this.loadMoreListing();
            }
        }, false);
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

.spinner-container {
    text-align: center;
}
</style>
