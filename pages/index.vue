<template>
  <div class="w-100">
    <div style="height: 50px">
      <b-dropdown id="dropdown-1" text="Fillter" class="m-md-2" style="float: right;">
        <b-dropdown-item @click="getfitter('')">全部</b-dropdown-item>
        <b-dropdown-item @click="getfitter('南湾东')">南湾东</b-dropdown-item>
        <b-dropdown-item @click="getfitter('南湾西')">南湾西</b-dropdown-item>
        <b-dropdown-item @click="getfitter('三番')">三番</b-dropdown-item>
        <b-dropdown-item @click="getfitter('东湾')">东湾</b-dropdown-item>
        <b-dropdown-item @click="getfitter('中半岛')">中半岛</b-dropdown-item>
        <b-dropdown-item @click="getfitter('短租')">短租</b-dropdown-item>
        <b-dropdown-item @click="getfitter('西雅图')">西雅图</b-dropdown-item>
        <b-dropdown-item @click="getfitter('测试')">测试</b-dropdown-item>
      </b-dropdown>
      <button v-if="window.width < 750" type="button" class="btn btn-secondary" @click="showMap()">
        <i class="fa fa-map-o" aria-hidden="true"></i>
      </button>
    </div>
    <div class="container-fluid d-flex p-0">
      <div v-if="window.width >= 750 || show == 1" class="p-0 w-100 h-100">
        <MapView :listings="listingsWithGeo"></MapView>
      </div>
      <div v-if="show == -1" class="p-0 w-100">
        <div id="listing_container" class="container-fluid " style="height: calc(100vh - 50px); overflow: scroll;">
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
var isInViewport = function(elem) {
  var distance = elem.getBoundingClientRect();
  return (
    distance.top >= 0 &&
    distance.left >= 0 &&
    distance.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    distance.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
};

let handleResize = function() {
  // Calculate new canvas size based on window
  $("#hsy_mapview > .GMap__Wrapper").height(window.innerHeight - 50);
  $("#hsy_mapview > .GMap__Wrapper").height(window.innerHeight - 50);
};

export default {
  components: {
    HsyListingComp,
    MapView
  },
  head() {
    return {
      title: '好室友'
    };
  },
  data: function() {
    return {
      window: {
        width: 750
      },

      margin: 20,
      limit: 10,
      areaEnum: '',
      show: -1
    };
  },
  async asyncData({ $axios }) {
    const limit = 10;
    const areaEnum = '';
    //const listings = await $axios.$get(
    //      `/api/v1/HsyListing/list?offset=0&limit=${limit}&areaEnum=${areaEnum}`);
    const listings = await $axios.$get(
      `/api/v1/HsyListing/list?offset=0&limit=${limit}&areaEnum=${encodeURI(
        areaEnum
      )}`
    );
    return { listings, limit };
  },
  computed: {
    listingsWithGeo: function() {
      return this.listings.filter(
        l => l && l.location && l.location.lat && l.location.lng
      );
    }
  },
  methods: {
    async asyncData({ $axios }) {
      const limit = 10;
      const areaEnum = '';
      //const listings = await $axios.$get(
      //      `/api/v1/HsyListing/list?offset=0&limit=${limit}&areaEnum=${areaEnum}`);
      const listings = await $axios.$get(
        `/api/v1/HsyListing/list?offset=0&limit=${limit}&areaEnum=${encodeURI(
          areaEnum
        )}`
      );
      return { listings, limit };
    },
    loadMoreListing: async function() {
      let newListings = await this.$axios.$get(
        `/api/v1/HsyListing/list?offset=${this.listings.length}&$limit=${this.limit}&areaEnum=${this.areaEnum}`
      );
      this.listings = this.listings.concat(newListings);
    },
    getfitter: async function(areaEnum) {
      const limit = 10;
      this.areaEnum = areaEnum;
      this.listings = await this.$axios.$get(
        `/api/v1/HsyListing/list?offset=0&$limit=${
          this.limit
        }&areaEnum=${encodeURI(areaEnum)}`
      );
    },
    mapResize(event) {
      this.window.width = window.innerWidth;
      if (this.window.width >= 750) {
        this.show = -1;
      }
    },
    showMap() {
      this.show *= -1;
      handleResize();
    }
  },
  mounted() {
    window.addEventListener('resize', handleResize);
    handleResize();
    this.window.width = window.innerWidth;
    window.addEventListener('resize', this.mapResize);
    this.mapResize();
    let dom = document.getElementById('loading_indicator');
    console.log(`adding listener`);
    document.getElementById('listing_container').addEventListener(
      'scroll',
      async event => {
        console.log(`scroll event! isInViewport(dom) = `, isInViewport(dom));
        if (isInViewport(dom)) {
          // console.log(`Indicator in display again!`);
          await this.loadMoreListing();
        }
      },
      false
    );
  },
  beforeDestroy() {
    window.removeEventListener('resize', handleResize);
  }
};
</script>

<style>
.container {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}

.container,
.container-fluid {
  height: 100%;
  overflow: hidden;
}

.spinner-container {
  text-align: center;
}
</style>